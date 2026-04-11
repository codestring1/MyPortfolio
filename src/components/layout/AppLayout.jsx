import { Outlet } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext.jsx'
import { Sun, Moon, Menu, Bell, MessageSquare, Hexagon } from 'lucide-react'
import Sidebar from './Sidebar.jsx'

export default function AppLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex h-screen overflow-hidden bg-cyberBlack">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto content-with-nav md:pb-0 relative">
        <div className="relative z-10 min-h-full">
          {/* Top Mobile-style Header */}
          <header className={`flex items-center justify-between p-4 sticky top-0 z-50 backdrop-blur-md md:hidden ${theme === 'dark' ? 'bg-black/90' : 'bg-white/90 border-b border-gray-200'}`}>
             <div className="flex items-center gap-4">
                <Menu size={26} className={theme === 'dark' ? 'text-white' : 'text-gray-800'} />
                <div className="flex items-center gap-2">
                   <Hexagon size={24} className="text-neonCyan animate-spin-10" />
                   <span className={`font-bold text-lg tracking-tight hidden sm:block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Myportfolio</span>
                </div>
             </div>
             <div className="flex items-center gap-5">
                <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-xl transition-all duration-300 ${theme === 'dark' ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-black/5 text-purple-600'}`}
                >
                  {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                </button>
                <Bell size={22} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
             </div>
          </header>

          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav (Simplified for demo, you can expand this similarly) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full glass-card border-x-0 border-b-0 rounded-none z-50">
        <div className="flex justify-around items-center p-3">
          <a href="/" className="text-neonCyan p-2 flex flex-col items-center">
            <span className="text-xs mt-1">Home</span>
          </a>
          <a href="/projects" className="text-gray-400 hover:text-neonCyan p-2 flex flex-col items-center">
             <span className="text-xs mt-1">Portfolio</span>
          </a>
          <a href="/chat" className="text-gray-400 hover:text-neonCyan p-2 flex flex-col items-center">
             <span className="text-xs mt-1">Comms</span>
          </a>
          <a href="/settings" className="text-gray-400 hover:text-neonCyan p-2 flex flex-col items-center">
             <span className="text-xs mt-1">Me</span>
          </a>
        </div>
      </div>
    </div>
  )
}
