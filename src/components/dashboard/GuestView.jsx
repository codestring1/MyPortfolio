import { useState } from 'react'
import { Upload, FileText, UserPlus, Zap, ArrowRight, ShieldCheck, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function GuestView() {
  const [dragActive, setDragActive] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Simulate upload
      setUploaded(true)
    }
  }

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      
      {/* Premium Hero Section */}
      <section className="relative rounded-3xl overflow-hidden p-8 md:p-12 min-h-[400px] flex flex-col justify-center text-center md:text-left bg-cyberBlack border border-white/5 shadow-2xl">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neonCyan/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neonPurple/10 rounded-full blur-[120px] -ml-64 -mb-64 animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neonCyan/10 border border-neonCyan/20 text-neonCyan text-[10px] font-bold uppercase tracking-widest mb-6">
            <Globe size={12} /> Public Access Node
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Build Your <span className="text-glow-cyan text-neonCyan">Professional</span> Uplink.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10">
            A next-generation portfolio system for operatives. Secure your credentials, showcase projects, and connect with the grid.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup" className="btn-primary px-8 py-4 text-lg">
              INITIALIZE PROFILE <UserPlus size={20} />
            </Link>
            <Link to="/login" className="btn-ghost px-8 py-4 text-lg bg-white/5">
              RESTORE SESSION <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Quick Upload Zone */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
              <Upload size={16} className="text-neonCyan" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Quick Document Upload</h2>
          </div>
          
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative h-64 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center ${
              dragActive ? 'border-neonCyan bg-neonCyan/5' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
            } ${uploaded ? 'border-green-500/50 bg-green-500/5' : ''}`}
          >
            {uploaded ? (
              <div className="space-y-4 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <ShieldCheck size={32} className="text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Document Staged</h3>
                  <p className="text-gray-400 text-sm mt-1">Ready for profile synchronization.</p>
                </div>
                <Link to="/signup" className="text-neonCyan text-sm font-bold hover:underline">
                  Sign up to finalize upload
                </Link>
              </div>
            ) : (
              <>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform ${dragActive ? 'scale-125' : ''}`}>
                  <FileText size={40} className="text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-white">Drag & Drop Documents</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-[240px]">
                  PDF, DOCX, or Images. Max 10MB. Staged locally for instant profile building.
                </p>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
              </>
            )}
          </div>
        </div>

        {/* Quick Details Form */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
              <Zap size={16} className="text-neonPurple" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Express Detail Entry</h2>
          </div>
          
          <div className="glass-card p-6 space-y-5 border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="input-label">Full Name</label>
                <input type="text" className="input-cyber" placeholder="John Doe" />
              </div>
              <div className="space-y-1.5">
                <label className="input-label">Target Role</label>
                <input type="text" className="input-cyber" placeholder="Systems Arch" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="input-label">Communication Link (Email)</label>
              <input type="email" className="input-cyber" placeholder="operative@grid.com" />
            </div>
            <div className="space-y-1.5">
              <label className="input-label">Core Objective / Bio</label>
              <textarea className="input-cyber h-24" placeholder="Brief mission statement..." />
            </div>
            <button className="btn-primary w-full py-4 opacity-70 cursor-not-allowed">
              TEMPORARY SAVE (Requires Account)
            </button>
          </div>
        </div>

      </div>

      {/* Security Banner */}
      <div className="rounded-2xl p-6 bg-neonCyan/5 border border-neonCyan/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 rounded-full bg-neonCyan/10 flex items-center justify-center shrink-0">
            <ShieldCheck size={24} className="text-neonCyan" />
          </div>
          <div>
            <h3 className="font-bold text-white">Data Isolation Active</h3>
            <p className="text-gray-400 text-sm">Your staged data is encrypted and stored locally. Authentication required for global persistence.</p>
          </div>
        </div>
        <Link to="/signup" className="btn-primary whitespace-nowrap">
          SECURE MY DATA
        </Link>
      </div>

    </div>
  )
}
