import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import Modal from '../../components/ui/Modal.jsx'
import CertificateModal from '../../components/modals/CertificateModal.jsx'
import { Edit2, Trash2, ShieldCheck, DownloadCloud, Eye } from 'lucide-react'
import PdfViewer from '../../components/ui/PdfViewer.jsx'

export default function Certificates() {
  const { user } = useAuth()
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCert, setEditingCert] = useState(null)
  const [viewingPdf, setViewingPdf] = useState(null)

  const fetchCerts = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    setRefreshing(true)
    const { data, error } = await supabase.from('certificates').select('*').eq('user_id', user.id).order('id', { ascending: false })
    if (!error) setCerts(data || [])
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => { fetchCerts() }, [user])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete credential?')) return
    await supabase.from('certificates').delete().eq('id', id)
    fetchCerts()
  }

  if (loading) return <div className="p-10 flex justify-center"><span className="cyber-spinner w-10 h-10"></span></div>

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-fade-in">
      <PageHeader title="Credentials & Certs" subtitle="Verified security clearances" onRefresh={fetchCerts} onAdd={() => {setEditingCert(null); setIsModalOpen(true)}} refreshing={refreshing} addLabel="UPLOAD CERTIFICATE" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certs.length === 0 && <div className="col-span-full py-10 text-gray-500 font-mono text-center">No active credentials found.</div>}
        
        {certs.map(cert => (
          <div key={cert.id} className="glass-card flex flex-col overflow-hidden group border-white/5 hover:border-cyan-500/30">
            <div className="flex flex-1">
              <div className="w-16 bg-gradient-to-b from-white/5 to-transparent border-r border-white/5 flex flex-col items-center justify-start pt-6 text-neonCyan">
                <ShieldCheck size={28} className="opacity-80" />
              </div>
              <div className="p-5 flex-1 relative">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => {setEditingCert(cert); setIsModalOpen(true)}} className="p-1.5 rounded-lg bg-white/10 text-gray-300 hover:text-white"><Edit2 size={14}/></button>
                  <button onClick={() => handleDelete(cert.id)} className="p-1.5 rounded-lg bg-errorRed/10 text-errorRed hover:bg-errorRed/20"><Trash2 size={14}/></button>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight pr-16">{cert.name}</h3>
                <div className="text-xs font-mono text-gray-400 mt-1 uppercase">ISSUER: <span className="text-neonCyan">{cert.issuer}</span></div>
                <p className="mt-3 text-sm text-gray-400 line-clamp-2">{cert.description}</p>
              </div>
            </div>
            
            {cert.pdf_url && (
              <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <button onClick={() => setViewingPdf(cert)} className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-neonCyan transition-colors bg-white/5 px-3 py-1.5 rounded-lg">
                    <Eye size={12} /> VIEW SECURE DOCUMENT
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCert ? 'REISSUE CREDENTIAL' : 'NEW CREDENTIAL UPLOAD'}>
        <CertificateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={editingCert} onSave={() => { setIsModalOpen(false); fetchCerts(); }} />
      </Modal>

      {viewingPdf && (
        <PdfViewer
          url={viewingPdf.pdf_url}
          title={viewingPdf.name}
          onClose={() => setViewingPdf(null)}
        />
      )}
    </div>
  )
}
