import { RefreshCw, Plus, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, subtitle, onRefresh, onAdd, addLabel = 'ADD NEW', refreshing = false }) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-neonCyan hover:border-neonCyan/30 transition-all active:scale-95"
          title="Go Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-800 dark:text-white dark:text-glow-cyan tracking-tight">{title}</h1>
          {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-1 font-mono uppercase tracking-widest text-xs">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {onRefresh && (
          <button 
            onClick={onRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-neonCyan transition-all disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          </button>
        )}
        
        {onAdd && (
          <button 
            onClick={onAdd}
            className="btn-primary"
          >
            <Plus size={18} /> {addLabel}
          </button>
        )}
      </div>
    </div>
  )
}
