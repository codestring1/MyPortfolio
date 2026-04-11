import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, Briefcase, Calendar, Wrench, GraduationCap, 
  Award, FileText, Settings, Github, Linkedin, Copy, Check, ExternalLink, ShieldCheck, UserPlus, Zap, Smartphone, Download
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'

function SocialLink({ icon: Icon, label, url }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!url) return
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!url) return null

  return (
    <div className="flex items-center gap-2 group">
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all text-xs font-medium text-white/90 hover:text-white"
      >
        <Icon size={14} />
        <span className="hidden sm:inline">{label}</span>
        <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
      <button 
        onClick={handleCopy}
        className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-white/50 hover:text-white"
        title={`Copy ${label} link`}
      >
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </button>
    </div>
  )
}

export default function Home() {
  const { profile, isAuthenticated } = useAuth()
  
  const firstName = profile?.full_name?.split(' ')[0] || 'Name'

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in pb-24 relative">
      
      {!isAuthenticated && (
        <div className="absolute top-8 right-8 z-20">
           <Link to="/login" className="btn-primary px-6 py-2 bg-neonCyan text-white font-bold text-xs uppercase rounded-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all">
             Sign In
           </Link>

        </div>
      )}

      {/* Welcome Header */}
      <header className="mb-2">
        <p className="text-gray-500 dark:text-gray-400 text-sm">{isAuthenticated ? 'Welcome back,' : 'Status: Online'}</p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-1 text-gray-800 dark:text-white uppercase">
          {firstName}
        </h1>
      </header>
      
      {/* Profile Card */}
      <div className="rounded-2xl p-6 relative overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(135deg, #0d1a29 0%, #0044cc 100%)' }}>
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
         
         <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20 bg-black/40 shadow-xl rotate-3">
               {profile?.photo_url ? (
                  <img src={profile.photo_url} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-black uppercase text-white/20">
                    {profile?.full_name?.charAt(0) || 'G'}
                  </div>
               )}
            </div>
            
            <div className="flex-1 text-center sm:text-left space-y-1">
               <h2 className="text-2xl font-black tracking-tight text-white">{profile?.full_name || 'Name'}</h2>
               <p className="text-white/60 text-sm font-medium pb-2">{profile?.email || 'email@email'}</p>
               
               <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 pt-2">
                  <SocialLink 
                    icon={Github} 
                    label="GitHub" 
                    url={profile?.github_link} 
                  />
                  <SocialLink 
                    icon={Linkedin} 
                    label="LinkedIn" 
                    url={profile?.linkedin_link} 
                  />
                  
                  {!isAuthenticated && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                       <ShieldCheck size={10} /> Read-Only Access
                    </div>
                  )}
               </div>
            </div>
         </div>
      </div>
      
      {/* Mobile App Download Card */}
      <div className="glass-card p-6 relative overflow-hidden group border-neonCyan/20">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neonCyan to-transparent opacity-50"></div>
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-neonCyan/10 border border-neonCyan/30 flex items-center justify-center text-neonCyan shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                  <Smartphone size={28} />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Mobile Terminal</h3>
                  <p className="text-sm text-gray-400">Access your portfolio on the go via the native Android uplink.</p>
               </div>
            </div>
            <a 
               href="/app-release.apk" 
               download 
               className="btn-primary w-full md:w-auto px-8 bg-neonCyan text-white flex items-center gap-2 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all font-bold"
            >
               <Download size={18} /> DOWNLOAD APK
            </a>
         </div>
      </div>


      <h2 className="text-lg font-bold mt-8 mb-4">Core Portfolio Modules</h2>

      <div className="grid grid-cols-2 gap-4 pb-12">
         {[
           { path: '/jobs', label: 'Find Jobs', icon: Briefcase, color: '#34a853', iconBg: 'rgba(52, 168, 83, 0.15)' },
           { path: '/projects', label: 'Projects', icon: Calendar, color: '#4285f4', iconBg: 'rgba(66, 133, 244, 0.15)' },
           { path: '/skills', label: 'Skills', icon: Wrench, color: '#fa7b17', iconBg: 'rgba(250, 123, 23, 0.15)' },
           { path: '/academics', label: 'Academics', icon: GraduationCap, color: '#a142f4', iconBg: 'rgba(161, 66, 244, 0.15)' },
           { path: '/experience', label: 'Experience', icon: Briefcase, color: '#7b8c9c', iconBg: 'rgba(123, 140, 156, 0.15)' },
           { path: '/certificates', label: 'Certificates', icon: Award, color: '#ea4335', iconBg: 'rgba(234, 67, 53, 0.15)' },
           { path: '/resumes', label: 'Resume', icon: FileText, color: '#a07152', iconBg: 'rgba(160, 113, 82, 0.15)' },
           { path: '/settings', label: 'Settings', icon: Settings, color: '#9aa0a6', iconBg: 'rgba(154, 160, 166, 0.15)' },
         ].map((item, idx) => (
            <Link key={idx} to={item.path} className="glass-card p-5 flex flex-col justify-between h-32 hover:border-neonCyan/30 active:scale-[0.98] transition-all border border-transparent shadow-sm">
               <div className="flex justify-between items-start w-full">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: item.iconBg }}>
                     <item.icon size={20} style={{ color: item.color }} />
                  </div>
                  <span className="text-gray-400 text-sm font-semibold">&rarr;</span>
               </div>
               <div className="font-bold text-gray-800 dark:text-gray-200 mt-auto">{item.label}</div>
            </Link>
         ))}
      </div>
    </div>
  )
}
