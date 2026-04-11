import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ExperienceModal from '../../components/modals/ExperienceModal.jsx'
import { Edit2, Trash2, Building2 } from 'lucide-react'

export default function Experience() {
  const { user } = useAuth()
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExp, setEditingExp] = useState(null)

  const fetchExperience = async () => {
    if (!user) return
    setRefreshing(true)
    const { data, error } = await supabase.from('experience').select('*').eq('user_id', user.id).order('id', { ascending: false })
    if (!error) setExperiences(data || [])
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => { 
    if (user) {
      fetchExperience()
      
      const channel = supabase.channel(`experience_realtime_${user.id}`)
        .on('postgres_changes', { 
           event: '*', 
           schema: 'public', 
           table: 'experience',
           filter: `user_id=eq.${user.id}`
        }, () => fetchExperience())
        .subscribe()
        
      return () => { supabase.removeChannel(channel) }
    }
  }, [user])

  const handleDelete = async (id) => {
    if (!window.confirm('Wipe corporate record?')) return
    await supabase.from('experience').delete().eq('id', id)
    fetchExperience()
  }

  const openAdd = () => { setEditingExp(null); setIsModalOpen(true) }
  const openEdit = (e) => { setEditingExp(e); setIsModalOpen(true) }

  if (loading) return <div className="p-10 flex justify-center"><span className="cyber-spinner w-10 h-10"></span></div>

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fade-in">
      <PageHeader title="Corporate History" subtitle="Verified professional engagements" onRefresh={fetchExperience} onAdd={openAdd} refreshing={refreshing} addLabel="ADD LOG" />

      <div className="relative border-l-2 border-white/10 pl-6 md:pl-8 space-y-8">
        {experiences.length === 0 && (
          <div className="text-gray-500 font-mono py-10">No logs found in timeline.</div>
        )}
        
        {experiences.map(exp => (
          <div key={exp.id} className="relative glass-card p-6 border border-white/5 hover:border-white/10">
            {/* Timeline dot */}
            <div className="absolute -left-[35px] md:-left-[43px] top-6 w-4 h-4 rounded-full bg-cyberBlack border-2 border-matrixGreen shadow-[0_0_10px_rgba(0,255,157,0.5)]"></div>
            
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h3 className="text-xl font-bold text-white text-glow-cyan tracking-tight">{exp.role}</h3>
                <div className="flex items-center gap-2 mt-1 text-neonCyan font-mono text-sm">
                  <Building2 size={14} /> {exp.company}
                </div>
              </div>
              <div className="badge-purple shrink-0">{exp.duration}</div>
            </div>
            
            <p className="mt-4 text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
            
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/5">
              <button onClick={() => openEdit(exp)} className="btn-ghost py-1.5 px-3 text-xs"><Edit2 size={14} /> MODIFY</button>
              <button onClick={() => handleDelete(exp.id)} className="btn-danger py-1.5 px-3 text-xs"><Trash2 size={14} /> WIPE</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExp ? 'REWRITE HISTORY' : 'INJECT CORPORATE LOG'}>
        <ExperienceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={editingExp} onSave={() => { setIsModalOpen(false); fetchExperience(); }} />
      </Modal>
    </div>
  )
}
