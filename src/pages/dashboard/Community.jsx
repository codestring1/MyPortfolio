import { useState, useEffect } from 'react'
import { ArrowLeft, Search, PlusCircle, CheckCircle, Clock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function Community() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [requests, setRequests] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!user) return

    try {
      // Fetch all public profiles except the current user
      const { data: profiles, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)

      if (profileErr) throw profileErr

      // Fetch contact requests involving the user
      const { data: contactReqs, error: reqErr } = await supabase
        .from('contact_requests')
        .select('*')
        .or(`requester_id.eq.${user.id},target_user_id.eq.${user.id}`)

      if (reqErr) throw reqErr

      // Map requests by the *other* user's ID
      const reqMap = {}
      contactReqs?.forEach(req => {
         const otherId = req.requester_id === user.id ? req.target_user_id : req.requester_id
         reqMap[otherId] = req // gives us the full request object
      })

      setUsers(profiles || [])
      setRequests(reqMap)
    } catch (err) {
      console.error('Error fetching community:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    if (user) {
      // Realtime subscription for requests to update UI live
      const channel = supabase.channel(`community_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_requests' }, () => {
           fetchData()
        })
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    }
  }, [user])

  const handleAction = async (targetId, currentRequest) => {
    if (currentRequest && currentRequest.status === 'approved') {
       // Already friends, let the Link handle routing to profile
       return
    }

    if (!currentRequest) {
      // Send a new request
      await supabase.from('contact_requests').insert({
         requester_id: user.id,
         target_user_id: targetId,
         status: 'pending'
      })
      // Optimistic update
      setRequests(prev => ({ ...prev, [targetId]: { requester_id: user.id, status: 'pending' } }))
    }
    // If it's pending and target_user_id is me, I should be able to accept it (omitted here for simplicity, handled in Dashboard/Header typically)
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-full bg-black text-white pb-24 md:pb-0">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-black/90 z-10 backdrop-blur-md">
        <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-xl font-bold flex-1 text-center pr-8">Community</h1>
      </header>

      <div className="px-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search people..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1c1c1e] text-white rounded-2xl py-4 pl-12 pr-4 border border-white/5 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {/* User List */}
        <div className="space-y-4 pb-4">
          {loading ? (
             <div className="flex justify-center p-10"><span className="cyber-spinner w-8 h-8"></span></div>
          ) : filteredUsers.length === 0 ? (
             <div className="text-center p-10 text-gray-500">No operatives found.</div>
          ) : (
            filteredUsers.map((profile) => {
              const req = requests[profile.id]
              let ActionIcon = PlusCircle
              let actionText = "Send Request"
              let actionClass = "bg-white/5 hover:bg-white/10"

              if (req) {
                 if (req.status === 'approved') {
                   ActionIcon = null
                   actionText = "View Profile &rarr;"
                 } else if (req.status === 'pending') {
                   if (req.requester_id === user?.id) {
                     ActionIcon = Clock
                     actionText = "Pending"
                     actionClass = "bg-orange-500/10 text-orange-500 opacity-80 cursor-not-allowed"
                   } else {
                     // They requested us
                     actionText = "Accept Request"
                     ActionIcon = CheckCircle
                     actionClass = "bg-matrixGreen/20 text-matrixGreen hover:bg-matrixGreen/30"
                   }
                 }
              }

              return (
                <div key={profile.id} onClick={() => navigate(`/portfolio/${profile.id}`)} className="bg-[#1c1c1e] rounded-2xl p-4 flex flex-col gap-3 transition-colors duration-300 cursor-pointer hover:bg-white/5 border border-transparent hover:border-white/10">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full border-2 border-white/20 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xl font-bold overflow-hidden shrink-0">
                         {profile.photo_url ? (
                           <img src={profile.photo_url} alt="Avatar" className="w-full h-full object-cover" />
                         ) : (
                           profile.full_name?.charAt(0) || 'U'
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <h2 className="text-lg font-bold truncate">{profile.full_name}</h2>
                         <p className="text-gray-400 text-sm truncate">{profile.email}</p>
                      </div>
                   </div>
                   <div className="mt-2 text-left w-full pl-[4.5rem]">
                     {req?.status === 'approved' ? (
                       <Link to={`/portfolio/${profile.id}`} onClick={(e) => e.stopPropagation()} className="bg-white/5 hover:bg-white/10 transition-colors px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 inline-flex">
                          View Profile &rarr;
                       </Link>
                     ) : (
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleAction(profile.id, req); }}
                         disabled={req?.status === 'pending' && req.requester_id === user?.id}
                         className={`${actionClass} transition-colors px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2`}
                       >
                          {ActionIcon && <ActionIcon size={16} />}
                          {actionText}
                       </button>
                     )}
                   </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
