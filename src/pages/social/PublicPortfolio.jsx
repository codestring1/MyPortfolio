import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { MessageSquare, ExternalLink, Download, Code2, Zap, Briefcase, FileText, UserPlus, FileSearch } from 'lucide-react'

export default function PublicPortfolio() {
  const { userId } = useParams()
  const { user } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ profile: null, projects: [], skills: [], experience: [], academic: null, resumes: [] })
  
  // Contacts system state
  const [contactStatus, setContactStatus] = useState(null) // 'none', 'pending', 'approved', 'rejected'

  useEffect(() => {
    const fetchPortfolio = async () => {
      const [profRes, projRes, skillRes, expRes, acadRes, resRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('projects').select('*').eq('user_id', userId),
        supabase.from('skills').select('*').eq('user_id', userId),
        supabase.from('experience').select('*').eq('user_id', userId).order('id', { ascending: false }),
        supabase.from('academics').select('*').eq('user_id', userId).single(),
        supabase.from('resumes').select('*').eq('user_id', userId)
      ])

      setData({
        profile: profRes.data,
        projects: projRes.data || [],
        skills: skillRes.data || [],
        experience: expRes.data || [],
        academic: acadRes.data,
        resumes: resRes.data || []
      })

      // Check contact permissions if logged in and not the owner
      if (user && user.id !== userId) {
         const { data: contact } = await supabase
           .from('contact_requests')
           .select('status')
           .eq('requester_id', user.id)
           .eq('target_user_id', userId)
           .single()
         
         if (contact) {
           setContactStatus(contact.status)
         } else {
           setContactStatus('none')
         }
      } else if (user && user.id === userId) {
         setContactStatus('owner')
      }

      setLoading(false)
    }
    
    if (userId) fetchPortfolio()
  }, [userId, user])

  const requestContact = async () => {
    if (!user) { alert('You must be logged in to request comms.'); return }
    await supabase.from('contact_requests').insert([
      { requester_id: user.id, target_user_id: userId, status: 'pending' }
    ])
    setContactStatus('pending')
  }

  if (loading) return <div className="min-h-screen bg-cyberBlack flex items-center justify-center"><span className="cyber-spinner w-10 h-10"></span></div>
  if (!data.profile) return <div className="min-h-screen bg-cyberBlack text-white flex items-center justify-center font-mono">NODE NOT FOUND. URL INVALID OR PURGED.</div>

  const isApproved = contactStatus === 'approved' || contactStatus === 'owner'
  const isPending = contactStatus === 'pending'

  return (
    <div className="min-h-screen bg-cyberBlack cyber-grid overflow-y-auto">
      {/* Header Profile Cover */}
      <div className="relative h-64 bg-gradient-to-b from-neonCyan/20 to-cyberBlack border-b border-white/5 flex items-end px-6 md:px-16 pb-8">
         <div className="absolute top-[-50%] left-[20%] w-[60%] h-[150%] bg-cyan-glow opacity-30 pointer-events-none rounded-full blur-[100px]"></div>

         <div className="flex flex-col md:flex-row items-center md:items-end gap-6 relative z-10 w-full mb-[-64px]">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-cyberBlack bg-cyberBlack overflow-hidden shadow-cyan-glow shrink-0">
                {data.profile.photo_url ? (
                  <img src={data.profile.photo_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-5xl text-neonCyan">{data.profile.full_name?.charAt(0)}</div>
                )}
             </div>
             <div className="flex-1 text-center md:text-left pt-6 md:pt-0">
               <h1 className="text-4xl text-white font-black text-glow-cyan tracking-tight">{data.profile.full_name}</h1>
               <div className="text-neonCyan font-mono mt-1 text-sm tracking-widest uppercase">Verified Operative</div>
             </div>
             <div className="flex gap-3">
               {user && user.id !== userId && (
                  <Link to={`/chat/${userId}`} className="btn-primary py-2 px-4 shadow-[0_0_15px_rgba(0,163,255,0.4)]">
                    <MessageSquare size={16} /> SECURE CHAT
                  </Link>
               )}
             </div>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 space-y-12 animate-fade-in relative z-10">

        {/* --- Private Comms Section --- */}
        <section className="glass-card p-6 border-l-4 border-l-neonPurple flex flex-col md:flex-row gap-6 justify-between items-center bg-white/[0.02]">
           <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2"><FileSearch size={18} className="text-neonPurple"/> Comms & Resumes (Encrypted)</h3>
              <p className="text-gray-400 text-sm">Direct contact details and resumes are classified.</p>
           </div>
           
           {isApproved ? (
             <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                {data.profile.email && <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm font-mono text-gray-300">{data.profile.email}</span>}
                {data.profile.phone && <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm font-mono text-gray-300">{data.profile.phone}</span>}
                {data.resumes.map(r => (
                   <a key={r.id} href={r.pdf_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-neonCyan hover:underline bg-neonCyan/10 px-3 py-1.5 border border-neonCyan/20 rounded-lg">
                      {r.type} <Download size={14}/>
                   </a>
                ))}
             </div>
           ) : contactStatus === 'owner' ? (
             <div className="text-xs text-neonCyan font-mono">You are the owner. Information is exposed to approved nodes only.</div>
           ) : (
             <button onClick={requestContact} disabled={isPending || contactStatus==='rejected'} className="btn-primary py-2 px-4 shadow-[0_0_15px_rgba(255,42,109,0.3)] bg-transparent border border-errorRed text-errorRed hover:bg-errorRed/10">
                {isPending ? 'REQUEST PENDING' : contactStatus==='rejected' ? 'ACCESS DENIED' : <><UserPlus size={16}/> REQUEST CLEARANCE</>}
             </button>
           )}
        </section>

        {/* --- Grid / Blocks --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Sidebar Data */}
           <div className="lg:col-span-1 space-y-8">
              {/* Skills */}
              {data.skills.length > 0 && (
                 <div className="glass-card p-6">
                    <h3 className="text-sm font-mono text-gray-500 tracking-widest uppercase mb-4 flex items-center gap-2 border-b border-white/5 pb-2"><Zap size={14}/> Capabilities</h3>
                    <div className="flex flex-wrap gap-2">
                       {data.skills.map(s => (
                          <span key={s.id} className="badge-cyan">{s.name}</span>
                       ))}
                    </div>
                 </div>
              )}

              {/* Links */}
              {(data.profile.github_link || data.profile.linkedin_link) && (
                 <div className="glass-card p-6">
                    <h3 className="text-sm font-mono text-gray-500 tracking-widest uppercase mb-4 border-b border-white/5 pb-2">External Links</h3>
                    <div className="space-y-3">
                       {data.profile.github_link && <a href={data.profile.github_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-neonCyan text-sm"><ExternalLink size={14}/> GitHub Uplink</a>}
                       {data.profile.linkedin_link && <a href={data.profile.linkedin_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-neonCyan text-sm"><ExternalLink size={14}/> LinkedIn Grid</a>}
                    </div>
                 </div>
              )}
              
              {/* Academics Snippet */}
              {data.academic && (
                 <div className="glass-card p-6 border-t-2 border-t-matrixGreen/50">
                    <h3 className="text-sm font-mono text-gray-500 tracking-widest uppercase mb-4 border-b border-white/5 pb-2">Highest Education</h3>
                    {data.academic.pg_name && <div className="mb-3"><div className="text-white text-sm font-bold">{data.academic.pg_degree} - {data.academic.pg_branch}</div><div className="text-xs text-gray-400 font-mono mt-1">{data.academic.pg_name} ({data.academic.pg_end})</div></div>}
                    {!data.academic.pg_name && data.academic.grad_name && <div className="mb-3"><div className="text-white text-sm font-bold">{data.academic.grad_degree} - {data.academic.grad_branch}</div><div className="text-xs text-gray-400 font-mono mt-1">{data.academic.grad_name} ({data.academic.grad_end})</div></div>}
                    <Link to="/academics" className="text-xs text-neonCyan opacity-50 hover:opacity-100">[FULL LOG REDACTED]</Link>
                 </div>
              )}
           </div>

           {/* Main Column Data */}
           <div className="lg:col-span-2 space-y-8">
               
               {/* Projects */}
               {data.projects.length > 0 && (
                 <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Code2 className="text-matrixGreen" /> Projects & Payloads</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                       {data.projects.map(p => (
                          <div key={p.id} className="glass-card p-5 hover:border-matrixGreen/30 transition-colors">
                             <div className="flex justify-between items-start mb-2">
                               <h4 className="font-bold text-white text-lg">{p.title}</h4>
                               {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-matrixGreen opacity-50 hover:opacity-100 transition-opacity"><ExternalLink size={16}/></a>}
                             </div>
                             <p className="text-sm text-gray-400 line-clamp-2 mb-3">{p.description}</p>
                             <div className="text-xs font-mono text-neonCyan truncate">{p.tech_stack}</div>
                          </div>
                       ))}
                    </div>
                 </div>
               )}

               {/* Experience */}
               {data.experience.length > 0 && (
                 <div>
                    <h3 className="text-xl font-bold text-white mb-4 mt-8 flex items-center gap-2"><Briefcase className="text-cyberYellow" /> Corporate History</h3>
                    <div className="space-y-4">
                       {data.experience.map(e => (
                          <div key={e.id} className="glass-card p-5 border-l-2 border-l-cyberYellow/50">
                             <div className="flex justify-between items-start">
                                <div>
                                   <h4 className="font-bold text-white">{e.role}</h4>
                                   <div className="text-neonCyan font-mono text-xs mt-1">{e.company}</div>
                                </div>
                                <span className="badge-purple text-[10px]">{e.duration}</span>
                             </div>
                             <p className="text-sm text-gray-400 mt-3 whitespace-pre-wrap leading-relaxed">{e.description}</p>
                          </div>
                       ))}
                    </div>
                 </div>
               )}

           </div>
        </div>
      </div>
    </div>
  )
}
