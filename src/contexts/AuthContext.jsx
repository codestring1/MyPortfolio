import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

/* ─── Context Definition ───────────────────────────────────── */
const AuthContext = createContext(null)

/**
 * AuthProvider
 *
 * Wraps the entire application and exposes:
 *  - session      : The raw Supabase Session object (or null)
 *  - user         : The Supabase User object (or null)
 *  - profile      : Row from `profiles` table matching the logged-in user
 *  - loading      : True while the initial session lookup is in progress
 *  - profileLoading: True while the profile row is being fetched
 *  - signOut      : Calls supabase.auth.signOut()
 *  - updateProfile: Upserts a partial profile record and refreshes state
 *  - refreshProfile: Re-fetches the profile from Supabase
 */
export function AuthProvider({ children }) {
  const [session, setSession]           = useState(null)
  const [user, setUser]                 = useState(null)
  const [profile, setProfile]           = useState(null)
  const [loading, setLoading]           = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [isGuest, setIsGuest]               = useState(false)


  /* ── Fetch the `profiles` row for a given user id ── */
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null)
      return
    }
    setProfileLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = "no rows" — profile hasn't been created yet (onboarding)
        console.error('[AuthContext] fetchProfile error:', error.message)
      }
      setProfile(data ?? null)
    } finally {
      setProfileLoading(false)
    }
  }, [])

  /* ── Initialise session on mount ── */
  useEffect(() => {
    let mounted = true

    // Initial check
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted || isGuest) return // Don't overwrite guest session
      
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        fetchProfile(s.user.id)
      }
      setLoading(false)
    }).catch((err) => {
      console.warn('[AuthContext] getSession failed:', err.message)
      if (mounted) setLoading(false)
    })


    /* Subscribe to auth state changes */
    let authSub = null
    try {
      const { data } = supabase.auth.onAuthStateChange(
        (_event, s) => {
          if (!mounted || isGuest) return // Don't overwrite guest session
          
          setSession(s)
          setUser(s?.user ?? null)
          if (s?.user) {
            fetchProfile(s.user.id)
          } else {
            setProfile(null)
          }
          setLoading(false)
        }
      )
      authSub = data.subscription
    } catch (err) {
      console.warn('[AuthContext] onAuthStateChange failed:', err.message)
      if (mounted) setLoading(false)
    }

    return () => {
      mounted = false
      if (authSub) authSub.unsubscribe()
    }
  }, [fetchProfile]) // No user.id here to prevent re-runs on session change


  /* ── Real-time Profile Subscription ── */
  useEffect(() => {
    if (!user?.id || isGuest) return

    const profileSub = supabase.channel(`profile_realtime_${user.id}`)
      .on('postgres_changes', { 
         event: '*', 
         schema: 'public', 
         table: 'profiles',
         filter: `id=eq.${user.id}`
      }, () => fetchProfile(user.id))
      .subscribe()

    return () => {
      supabase.removeChannel(profileSub)
    }
  }, [user?.id, isGuest, fetchProfile])


  /* ── Sign out ── */
  const signOut = useCallback(async () => {
    if (!isGuest) {
      await supabase.auth.signOut()
    }
    setSession(null)
    setUser(null)
    setProfile(null)
    setIsGuest(false)
  }, [isGuest])

  /**
   * signInAsGuest
   *
   * Initiates a temporary guest session with mock data.
   */
  const signInAsGuest = useCallback(() => {
    setIsGuest(true)
    setSession({ access_token: 'guest-token', user: { id: 'guest-id' } })
    setUser({ id: 'guest-id', email: 'guest@preview' })
    setProfile({
      full_name: 'Guest Operative',
      email: 'guest@preview',
      photo_url: null,
      bio: 'Preview Mode Active. Systems operational.'
    })
  }, [])


  /**
   * updateProfile
   *
   * Upserts a record in the `profiles` table and refreshes local state.
   * @param {Object} updates  - Partial profile fields to update/insert
   */
  const updateProfile = useCallback(async (updates) => {
    if (!user) throw new Error('Not authenticated')

    const payload = { id: user.id, ...updates }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()

    if (error) throw error
    setProfile(data)
    return data
  }, [user])

  /**
   * refreshProfile
   *
   * Re-fetches the profile from Supabase.  Useful after external mutations.
   */
  const refreshProfile = useCallback(() => {
    if (user?.id) fetchProfile(user.id)
  }, [user, fetchProfile])

  /* ─── Context value ─────────────────────────────────────── */
  const value = {
    session,
    user,
    profile,
    loading,
    profileLoading,
    signOut,
    updateProfile,
    refreshProfile,
    isGuest,
    signInAsGuest,
    isAuthenticated: !!session || isGuest,
  }


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/* ─── Custom Hook ─────────────────────────────────────────── */
/**
 * useAuth()  — must be used inside <AuthProvider>.
 * Throws a clear error if accessed outside the provider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth() must be used inside <AuthProvider>')
  }
  return ctx
}

export default AuthContext
