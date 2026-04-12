import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client singleton.
 *
 * Replace the placeholder values below with your actual project credentials,
 * or set them as VITE_ environment variables in a .env file at the project root:
 *
 *   VITE_SUPABASE_URL=https://your-project.supabase.co
 *   VITE_SUPABASE_ANON_KEY=your-anon-key
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'


const isPlaceholder = supabaseUrl.includes('placeholder.supabase.co')

if (isPlaceholder) {
  console.warn(
    '[Supabase] Using PLACEHOLDER credentials. Features like database sync and real-time chat will remain in DEMO MODE.\n' +
    'To enable live data, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file or GitHub Secrets.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    /**
     * Persist the auth session across page reloads using localStorage.
     */
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

/* ─── Convenience helpers ──────────────────────────────────── */

/**
 * Returns the current session or null.
 */
export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

/**
 * Returns the currently logged-in user or null.
 */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}

/**
 * Upload a file to Cloudinary instead of Supabase Storage.
 * @param {string} bucket  - (Ignored, keeping param for signature compatibility)
 * @param {string} path    - (Ignored)
 * @param {File}   file    - File object
 * @returns {string}       - Public URL of the uploaded file
 */
export async function uploadFile(bucket, path, file) {
  const cloudName = 'dfcs8qugv'
  const uploadPreset = 'portfolio_upload'

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error?.message || 'Upload failed')
  }

  const data = await response.json()
  return data.secure_url
}
