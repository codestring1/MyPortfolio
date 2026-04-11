import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function ChatList() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchConversations = async () => {
    if (!user) return

    try {
      // 1. Fetch all messages for current user
      const { data: messages, error: msgErr } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (msgErr) throw msgErr
      if (!messages || messages.length === 0) {
        setConversations([])
        return
      }

      // Group by the other user
      const grouped = {}
      messages.forEach(msg => {
         const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
         if (!grouped[otherId]) {
            grouped[otherId] = {
               msgs: [],
               lastMsg: msg,
               unreadCount: 0
            }
         }
         grouped[otherId].msgs.push(msg)
         if (msg.receiver_id === user.id && msg.status !== 'read') {
             grouped[otherId].unreadCount++
         }
      })

      const userIds = Object.keys(grouped)
      if (userIds.length === 0) {
         setConversations([])
         return
      }

      // 2. Fetch profiles
      const { data: profiles, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds)

      if (profErr) throw profErr

      const profilesMap = {}
      profiles?.forEach(p => { profilesMap[p.id] = p })

      // 3. Construct conversation list
      const convoList = []
      for (const otherId of userIds) {
         const profile = profilesMap[otherId]
         if (profile) {
            convoList.push({
               ...grouped[otherId],
               profile,
               // Formatter for time (HH:MM or MM/DD)
               formattedTime: new Date(grouped[otherId].lastMsg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            })
         }
      }

      // Sort by latest message
      convoList.sort((a, b) => new Date(b.lastMsg.created_at) - new Date(a.lastMsg.created_at))
      setConversations(convoList)

    } catch (err) {
      console.error('Error fetching conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConversations()

    if (user) {
      const channel = supabase.channel(`conversations_list_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
           fetchConversations()
        })
        .subscribe()

      return () => { supabase.removeChannel(channel) }
    }
  }, [user])

  return (
    <div className="flex flex-col min-h-full bg-black text-white pb-24 md:pb-0">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-black/90 z-10 backdrop-blur-md border-b border-white/5">
        <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} className="text-white" />
        </Link>
        <h1 className="text-xl font-bold flex-1 text-center pr-8">Messages</h1>
      </header>

      {/* Chat List */}
      <div className="flex flex-col">
          {loading ? (
             <div className="flex justify-center p-10"><span className="cyber-spinner w-8 h-8"></span></div>
          ) : conversations.length === 0 ? (
             <div className="text-center p-10 text-gray-500">No active comm lines detected.</div>
          ) : conversations.map((chat, idx) => (
             <Link key={idx} to={`/chat/${chat.profile.id}`} className="flex items-center justify-between p-4 bg-[#0a0a0c] hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5">
                <div className="flex items-center gap-4">
                   <div className={`w-14 h-14 rounded-full border-2 ${chat.unreadCount > 0 ? 'border-neonCyan' : 'border-white/10'} border-white/10 flex items-center justify-center text-xl font-bold shrink-0 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900`}>
                      {chat.profile.photo_url ? (
                         <img src={chat.profile.photo_url} alt={chat.profile.full_name} className="w-full h-full object-cover" />
                      ) : (
                         <span className="text-gray-300">{chat.profile.full_name?.charAt(0) || 'U'}</span>
                      )}
                   </div>
                   <div>
                      <h4 className="text-base font-bold flex items-center gap-2">
                          <span className={chat.unreadCount > 0 ? 'text-white' : 'text-gray-300'}>{chat.profile.full_name}</span>
                          {chat.unreadCount > 0 && <span className="bg-neonCyan text-black text-[10px] px-1.5 py-0.5 rounded-full font-bold">{chat.unreadCount}</span>}
                      </h4>
                      <p className={`text-sm mt-1 truncate max-w-[200px] sm:max-w-xs ${chat.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-500'}`}>
                          {chat.lastMsg.sender_id === user?.id ? 'You: ' : ''}{chat.lastMsg.content}
                      </p>
                   </div>
                </div>
                <div className="text-gray-500 text-xs font-mono self-start mt-2 shrink-0">
                   {chat.formattedTime}
                </div>
             </Link>
          ))}
      </div>
    </div>
  )
}
