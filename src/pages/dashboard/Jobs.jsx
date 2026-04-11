import { useState, useEffect } from 'react'
import { 
  Search, MapPin, Briefcase, 
  ExternalLink, Loader2, ArrowRight, DollarSign, Clock, Building2 
} from 'lucide-react'
import { fetchJobs } from '../../lib/jsearch.js'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')

  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await fetchJobs({ 
        what: searchQuery, 
        where: locationQuery, 
        page: 1 
      })
      setJobs(data.results)
    } catch (err) {
      setError('Neural link unstable. Unable to synchronize with RapidAPI grid.')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Search Terminal */}
      <section className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neonCyan to-transparent"></div>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 space-y-2 w-full">
            <label className="input-label flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neonCyan rounded-full animate-pulse"></span>
              Keyword Search
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                className="input-cyber pl-12" 
                placeholder="Systems Architect, React Operative..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 space-y-2 w-full">
            <label className="input-label flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neonPurple rounded-full animate-pulse"></span>
              Geospatial Node
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                className="input-cyber pl-12" 
                placeholder="Bangalore, Hybrid, Remote..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="btn-primary w-full md:w-auto px-10 h-[46px] bg-neonCyan text-white font-bold"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'SEARCH GRID'}
          </button>
        </form>
      </section>

      {/* Results Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Briefcase size={20} className="text-neonCyan" />
              Contract Board
            </h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-mono">
              Live Feed: JSearch Global Aggregator
            </p>
          </div>
          <div className="badge-cyan font-mono animate-pulse">
            {jobs.length} Sync Nodes
          </div>
        </div>

        {error && (
          <div className="glass-card p-10 text-center border-errorRed/20 bg-errorRed/5">
            <p className="text-errorRed font-bold mb-2 uppercase">SYNC FAILURE</p>
            <p className="text-white/60 text-sm">{error}</p>
            <button onClick={handleSearch} className="mt-4 text-neonCyan text-xs underline uppercase font-bold">Retry Synchronization</button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-64 skeleton"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {!loading && jobs.length === 0 && !error && (
          <div className="glass-card p-12 text-center border-dashed border-2 border-white/10">
            <h2 className="text-xl font-bold text-gray-500 mb-2 mt-4 uppercase tracking-tighter italic">No Signals Detected</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              The neural net returned no active gigs for these parameters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function JobCard({ job }) {
  const formattedSalary = job.salary_min 
    ? `${job.currency} ${Math.floor(job.salary_min / 1000)}k`
    : 'System Hidden'

  return (
    <div className="glass-card p-6 flex flex-col justify-between group hover:border-neonCyan/40 active:scale-[0.98] transition-all border border-transparent shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-neonCyan/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-neonCyan/10 transition-colors"></div>
      
      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-neonCyan/30 transition-colors overflow-hidden p-1">
            {job.logo ? (
              <img src={job.logo} alt={job.company} className="w-full h-full object-contain" onError={(e) => e.target.style.display='none'} />
            ) : (
              <Building2 size={24} className="text-gray-400 group-hover:text-neonCyan transition-colors" />
            )}
          </div>
          <div className="badge-cyan text-[9px] uppercase tracking-tighter h-fit">
            {job.category}
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-bold text-white group-hover:text-neonCyan transition-colors line-clamp-2 min-h-[3rem]">
            {job.title}
          </h3>
          <p className="text-sm text-white/70 font-medium flex items-center gap-1">
            <Building2 size={12} className="text-gray-600" />
            {job.company}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin size={10} />
            {job.location}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-neonPurple">
            <DollarSign size={12} />
            {formattedSalary}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500">
            <Clock size={12} />
            {job.created ? new Date(job.created).toLocaleDateString() : 'Active'}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
         <div className="text-[10px] text-gray-600 font-mono italic">ID: {job.id.slice(-8)}</div>
         <a 
          href={job.redirect_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white font-bold text-xs flex items-center gap-1 hover:gap-2 transition-all hover:text-neonCyan bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
        >
          VIEW GIG <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}
