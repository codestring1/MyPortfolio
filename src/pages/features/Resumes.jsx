import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ResumeModal from '../../components/modals/ResumeModal.jsx'
import { FileText, Download, Trash2, Edit2, Eye } from 'lucide-react'
import PdfViewer from '../../components/ui/PdfViewer.jsx'

export default function Resumes() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingResume, setEditingResume] = useState(null)
  const [viewingPdf, setViewingPdf] = useState(null)

  const fetchResumes = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    setRefreshing(true)
    const { data, error } = await supabase.from('resumes').select('*').eq('user_id', user.id).order('id', { ascending: false })
    if (!error) setResumes(data || [])
    setLoading(false); setRefreshing(false)
  }

  useEffect(() => { 
    fetchResumes()
    
    if (user) {
      const channel = supabase.channel(`resumes_realtime_${user.id}`)
        .on('postgres_changes', { 
           event: '*', 
           schema: 'public', 
           table: 'resumes',
           filter: `user_id=eq.${user.id}`
        }, () => fetchResumes())
        .subscribe()
        
      return () => { supabase.removeChannel(channel) }
    }
  }, [user])

  const handleDelete = async (id) => {
    if (!window.confirm('Purge archive payload?')) return
    await supabase.from('resumes').delete().eq('id', id)
    fetchResumes()
  }

  if (loading) return <div className="p-10 flex justify-center"><span className="cyber-spinner w-10 h-10"></span></div>

  const getTypeStyle = (type) => {
     if (type === 'Cover Letter') return 'badge-green'
     if (type === 'Portfolio Deck') return 'badge-purple'
     return 'badge-cyan'
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
      <PageHeader title="Data Archives (Resumes)" subtitle="Manage personal marketing payloads" onRefresh={fetchResumes} onAdd={() => {setEditingResume(null); setIsModalOpen(true)}} refreshing={refreshing} addLabel="UPLOAD ARCHIVE" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.length === 0 && <div className="col-span-full py-10 text-gray-500 font-mono text-center">No payloads found in archive directory.</div>}
        
        {resumes.map(resume => (
          <div key={resume.id} className="glass-card flex flex-col hover:-translate-y-1 transition-transform group relative overflow-hidden">
             {/* bg accent */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-cyberYellow/5 rounded-full blur-[30px] group-hover:bg-cyberYellow/10 transition-colors pointer-events-none"></div>
             
             <div className="p-6 flex-1">
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyberYellow">
                       <FileText size={24} />
                    </div>
                    <div><span className={getTypeStyle(resume.type)}>{resume.type}</span></div>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">{resume.title}</h3>
             </div>
             
             <div className="flex bg-white/5 font-bold">
                <button onClick={() => setViewingPdf(resume)} className="flex-1 py-3 flex items-center justify-center gap-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-r border-white/5">
                  <Eye size={14} /> View File
                </button>
                <button onClick={() => {setEditingResume(resume); setIsModalOpen(true)}} className="px-4 text-gray-400 hover:text-neonCyan hover:bg-white/5 transition-colors border-r border-white/5">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(resume.id)} className="px-4 text-gray-400 hover:text-errorRed hover:bg-errorRed/10 transition-colors">
                  <Trash2 size={16} />
                </button>
             </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingResume ? 'MODIFY ARCHIVE' : 'NEW ARCHIVE UPLOAD'}>
        <ResumeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={editingResume} onSave={() => { setIsModalOpen(false); fetchResumes(); }} />
      </Modal>

      {viewingPdf && (
        <PdfViewer
          url={viewingPdf.pdf_url}
          title={viewingPdf.title}
          onClose={() => setViewingPdf(null)}
        />
      )}
    </div>
  )
}
