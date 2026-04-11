import { Link, useLocation } from 'react-router-dom'
import { Home, Users, Briefcase, LayoutDashboard, Zap, Award, FileText, Settings, LogOut, MessageSquare, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useTheme } from '../../contexts/ThemeContext.jsx'

export default function Sidebar() {
  const { profile, signOut, isGuest } = useAuth()

  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  // ... existing navGroups ...
  const navGroups = [
    {
      title: 'DASHBOARD',
      items: [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Community', path: '/community', icon: Users },
        { name: 'Jobs Board', path: '/jobs', icon: Briefcase },
        { name: 'Comms', path: '/chat', icon: MessageSquare },
      ]
    },
    {
      title: 'PORTFOLIO',
      items: [
        { name: 'Projects', path: '/projects', icon: LayoutDashboard },
        { name: 'Skills', path: '/skills', icon: Zap },
        { name: 'Experience', path: '/experience', icon: Award },
        { name: 'Academics', path: '/academics', icon: FileText },
        { name: 'Certificates', path: '/certificates', icon: Award },
        { name: 'Resumes', path: '/resumes', icon: FileText },
        { name: 'Constructor', path: '/builder', icon: FileText },
      ]
    }
  ]

  return (
    <aside className={`w-64 glass-card h-full flex flex-col pt-6 pb-4 border-l-0 border-y-0 rounded-none border-r overflow-y-auto ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
      <div className="px-6 mb-8">
        <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-glow-cyan' : 'text-neonCyan'}`}>Myportfolio</h2>
        <div className="text-xs font-mono text-neonCyan mt-1 tracking-widest uppercase">System Uplink</div>
      </div>

      <div className="flex-1 px-4 space-y-8">
        {navGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-2 text-[10px] font-mono text-gray-500 mb-3 tracking-widest">{group.title}</h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-neonCyan/10 text-neonCyan border border-neonCyan/20 shadow-[inset_4px_0_0_0_#00A3FF]' 
                        : `text-gray-400 hover:text-neonCyan ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5'}`
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-neonCyan' : ''} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-8">
        <h3 className="px-2 text-[10px] font-mono text-gray-500 mb-3 tracking-widest">SYSTEM</h3>
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all mb-1 ${
            theme === 'dark' ? 'text-yellow-400 hover:bg-white/5' : 'text-purple-600 hover:bg-black/5'
          }`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Daylight Mode' : 'Cyber Mode'}
        </button>

        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all mb-1 ${
            theme === 'dark' ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'
          }`}
        >
          <Settings size={18} /> Settings
        </Link>
        
        {profile ? (
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-errorRed hover:bg-errorRed/10 transition-all border border-transparent hover:border-errorRed/20"
          >
            <LogOut size={18} /> Sever Connection
          </button>
        ) : (
          <Link
            to="/login"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-neonCyan hover:bg-neonCyan/10 transition-all border border-transparent hover:border-neonCyan/20"
          >
            <Zap size={18} /> Establish Uplink
          </Link>
        )}
      </div>

      {profile ? (
        <div className={`mt-6 px-6 pt-4 border-t mx-4 border-b-0 pb-0 flex items-center gap-3 ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="w-10 h-10 rounded-full bg-neonCyan/20 border-2 border-neonCyan flex items-center justify-center text-neonCyan font-bold uppercase overflow-hidden shrink-0">
            {profile.photo_url ? (
              <img src={profile.photo_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              profile.full_name?.charAt(0) || 'O'
            )}
          </div>
          <div className="overflow-hidden">
            <div className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{profile.full_name}</div>
            {isGuest && <div className="text-[10px] font-mono text-neonCyan font-bold tracking-widest bg-neonCyan/10 px-1.5 py-0.5 rounded w-fit mt-0.5 border border-neonCyan/20 animate-pulse">PREVIEW MODE</div>}
          </div>
        </div>

      ) : (
        <div className={`mt-6 px-6 pt-4 border-t mx-4 border-b-0 pb-0 flex items-center gap-3 ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="w-10 h-10 rounded-full bg-white/5 border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 font-bold uppercase overflow-hidden shrink-0">
            ?
          </div>
          <div className="overflow-hidden">
            <div className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Guest Operative</div>
          </div>
        </div>
      )}

    </aside>
  )
}
