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

  // 1. Fetch data to sync into constructor
  const syncPortfolioData = async () => {
    if (!user) return
    setSyncing(true)
    
    try {
      const [
        { data: profile },
        { data: projects },
        { data: skills }
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('projects').select('*').eq('user_id', user.id),
        supabase.from('skills').select('*').eq('user_id', user.id)
      ])

      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'LOAD_DATABASE_PROFILE',
          profile
        }, '*')

        iframeRef.current.contentWindow.postMessage({
          type: 'SYNC_PORTFOLIO_DATA',
          projects,
          skills
        }, '*')
      }
    } catch (err) {
      console.error('Initial sync failed:', err)
    } finally {
      setSyncing(false)
    }
  }

  // 2. Listen for saves from the iframe
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data?.type === 'SAVE_CONSTRUCTOR_DATA') {
        const constructorPayload = event.data.payload
        console.log('Intercepted save payload, syncing to database...', constructorPayload)
        
        // Save to a special 'Constructor Save' entry in resumes table
        // This ensures the data is backed up to Supabase
        await supabase.from('resumes').upsert({
          user_id: user.id,
          title: 'Constructor Auto-Save',
          type: 'Constructor State',
          pdf_url: JSON.stringify(constructorPayload), // Storing JSON in pdf_url column temporarily or until dedicated column exists
          file_name: 'constructor_v1.json'
        }, { onConflict: 'user_id,type' }) // Assuming a constraint or just regular upsert
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [user])

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-2rem)] animate-fade-in">
       <div className="px-6 md:px-10 pt-6 shrink-0 flex justify-between items-end">
         <PageHeader title="Resume Constructor" subtitle="Compile ATS-optimized PDFs" />
         <div className="flex gap-2 mb-8">
            <button 
              onClick={syncPortfolioData}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-neonCyan/10 border border-neonCyan/30 text-neonCyan rounded-xl text-xs font-bold hover:bg-neonCyan/20 transition-all uppercase tracking-widest disabled:opacity-50"
            >
              {syncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Database className="w-3 h-3" />}
              Sync with Portfolio
            </button>
         </div>
       </div>
       
       <div className="flex-1 w-full relative overflow-hidden rounded-t-3xl border-t border-white/10 bg-white">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-cyberBlack">
              <Loader2 className="w-8 h-8 text-neonCyan animate-spin" />
            </div>
          )}
          <iframe 
             ref={iframeRef}
             src="/resume-builder.html" 
             title="Resume Builder Sandbox"
             className="w-full h-full border-0"
             onLoad={() => {
                setLoading(false)
                syncPortfolioData()
             }}
             style={{ minHeight: '100%' }}
          />
       </div>
    </div>
  )
}
