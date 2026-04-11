import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { Send, ArrowLeft, Shield } from 'lucide-react'

export default function ChatDM() {
  const { userId } = useParams() // Target user ID
  const { user } = useAuth()     // Current logged-in user
  
  const [messages, setMessages] = useState([])
  const [targetProfile, setTargetProfile] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  
  const endOfMessagesRef = useRef(null)

  // 1. Fetch Target Profile
  useEffect(() => {
    supabase.from('profiles').select('*').eq('id', userId).single().then(({data}) => setTargetProfile(data))
  }, [userId])

  // 2. Load History & Subscribe
  useEffect(() => {
    if (!user || !userId) return

    const fetchHistory = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)
      setLoading(false)
      scrollToBottom()
    }

    fetchHistory()

    const channel = supabase.channel('realtime_messages')
      .on('postgres_changes', { 
         event: 'INSERT', 
         schema: 'public', 
         table: 'messages',
      }, payload => {
         const msg = payload.new
         // Only add if it belongs to this conversation
         if ((msg.sender_id === user.id && msg.receiver_id === userId) || 
             (msg.sender_id === userId && msg.receiver_id === user.id)) {
             setMessages(prev => [...prev, msg])
             scrollToBottom()
         }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user, userId])

  const scrollToBottom = () => {
    setTimeout(() => { endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' }) }, 100)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    const content = newMessage.trim()
    if (!content) return

    setNewMessage('') // optimistic clear

    const payload = {
      sender_id: user.id,
      receiver_id: userId,
      content,
      status: 'sent',
      // PostgREST triggers default timestamp on insert usually, but passing explicitly if schema requires
    }

    await supabase.from('messages').insert([payload])
  }

  if (loading || !targetProfile) {
    return <div className="h-full flex items-center justify-center p-10"><span className="cyber-spinner w-8 h-8"></span></div>
  }

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-2rem)]">
       {/* Chat Header */}
       <div className="glass-card flex items-center justify-between p-4 rounded-none border-t-0 border-x-0 z-20 sticky top-0 bg-cyberBlack/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4 pl-2 md:pl-0">
             <Link to="/chat" className="text-gray-400 hover:text-neonCyan transition-colors p-2 md:p-0"><ArrowLeft size={20}/></Link>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full border border-neonCyan/30 bg-cyberBlack flex items-center justify-center overflow-hidden">
                  {targetProfile.photo_url ? <img src={targetProfile.photo_url} className="w-full h-full object-cover" alt="Avatar"/> : <span className="text-neonCyan">{targetProfile.full_name?.charAt(0)}</span>}
               </div>
               <div>
                  <div className="text-white font-bold flex items-center gap-2">{targetProfile.full_name}</div>
                  <div className="text-matrixGreen text-[10px] font-mono mt-0.5 tracking-widest flex items-center gap-1"><Shield size={10}/> SECURE LINK</div>
               </div>
             </div>
          </div>
          <Link to={`/portfolio/${userId}`} className="btn-ghost scale-75 transform origin-right">VIEW PORTFOLIO</Link>
       </div>
 
       {/* Chat Area */}
       <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 cyber-grid">
          <div className="text-center pb-6 border-b border-white/5 mb-6">
             <div className="inline-block px-3 py-1 rounded-full bg-neonCyan/10 border border-neonCyan/20 text-neonCyan text-xs font-mono tracking-widest">
                ENCRYPTION AHEAD. CONNECTION ESTABLISHED.
             </div>
          </div>
 
          {messages.map((msg, i) => {
             const isMe = msg.sender_id === user.id
             return (
               <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={isMe ? 'bubble-sent' : 'bubble-received'}>
                      {msg.content}
                  </div>
               </div>
             )
          })}
          <div ref={endOfMessagesRef} className="h-4"></div>
       </div>
 
       {/* Input Area */}
       <div className="glass-card rounded-none border-b-0 border-x-0 p-4 pb-8 md:pb-4 bg-cyberBlack shrink-0 z-20">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3">
             <input
               type="text"
               className="input-cyber flex-1 focus:bg-white/[0.05]"
               placeholder="Transmit message..."
               value={newMessage}
               onChange={e => setNewMessage(e.target.value)}
             />
             <button type="submit" disabled={!newMessage.trim()} className="btn-primary px-5 disabled:opacity-30 disabled:hover:scale-100 disabled:shadow-none bg-neonCyan text-black">
                <Send size={18} />
             </button>
          </form>
       </div>
    </div>
  )
}
