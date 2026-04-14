import { useState, useEffect, useRef } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import { Loader2, Database, RefreshCw } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function BuilderFrame() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const iframeRef = useRef(null)

  // 1. Fetch data from Supabase and pass it to the iframe 
  const syncPortfolioData = async () => {
    if (!user) return
    setSyncing(true)
    
    try {
      const [
        { data: profile },
        { data: projects },
        { data: skills },
        { data: academics },
        { data: experience }
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('projects').select('*').eq('user_id', user.id).order('id', { ascending: false }),
        supabase.from('skills').select('*').eq('user_id', user.id),
        supabase.from('academics').select('*').eq('user_id', user.id).single(),
        supabase.from('experience').select('*').eq('user_id', user.id).order('id', { ascending: false })
      ])

      if (iframeRef.current?.contentWindow) {
        // Send basic profile identifiers
        iframeRef.current.contentWindow.postMessage({
          type: 'LOAD_DATABASE_PROFILE',
          profile: profile || {}
        }, '*')

        // Sync Portfolio Database items directly into the HTML's editor grid
        iframeRef.current.contentWindow.postMessage({
          type: 'SYNC_PORTFOLIO_DATA',
          projects: projects || [],
          skills: skills || [],
          academics: academics || {},
          experience: experience || []
        }, '*')
      }
    } catch (err) {
      console.error('Data sync failed:', err)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    // Listens for local saves coming from inside the iframe (if you wish to sync them back up later)
    const handleMessage = (e) => {
      if (e.data?.type === 'SAVE_CONSTRUCTOR_DATA') {
         // Payload is available in e.data.payload
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div className="w-full h-[calc(100vh-70px)] md:h-screen flex flex-col animate-fade-in bg-slate-950">
       
       {/* Header Row */}
       <div className="shrink-0 flex flex-col md:flex-row md:justify-between md:items-start gap-4 px-4 pt-4 md:px-8 md:pt-6 border-b border-white/10">
         <div className="-mb-4">
            <PageHeader title="Resume Constructor" subtitle="Compile ATS-optimized PDFs" />
         </div>
         
         <div className="flex gap-2 md:mt-2 mb-4 md:mb-0">
            <button 
              onClick={syncPortfolioData}
              disabled={syncing}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 border border-blue-500/30 text-blue-500 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition-all uppercase tracking-widest disabled:opacity-50"
            >
              {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              SYNC PORTFOLIO DATA
            </button>
         </div>
       </div>
       
       {/* Embedded HTML App - Made full width/height with no padding */}
       <div className="flex-1 w-full relative overflow-hidden bg-white">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
          )}
          
          <iframe 
             ref={iframeRef}
             src="/resume-builder.html" 
             title="Resume Builder Sandbox"
             className="w-full h-full border-0 block"
             onLoad={() => {
                setLoading(false)
                syncPortfolioData()
             }}
          />
       </div>
    </div>
  )
}