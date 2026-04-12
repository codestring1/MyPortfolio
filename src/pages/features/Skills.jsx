import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import Modal from '../../components/ui/Modal.jsx'
import SkillModal from '../../components/modals/SkillModal.jsx'
import { Edit2, Trash2, Zap } from 'lucide-react'

export default function Skills() {
  const { user } = useAuth()
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)

  const fetchSkills = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    setRefreshing(true)
    const { data, error } = await supabase.from('skills').select('*').eq('user_id', user.id).order('id', { ascending: false })
    if (!error) setSkills(data || [])
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => { 
    fetchSkills()
    
    if (user) {
      const channel = supabase.channel(`skills_realtime_${user.id}`)
        .on('postgres_changes', { 
           event: '*', 
           schema: 'public', 
           table: 'skills',
           filter: `user_id=eq.${user.id}`
        }, () => fetchSkills())
        .subscribe()
        
      return () => { supabase.removeChannel(channel) }
    }
  }, [user])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this capability?')) return
    await supabase.from('skills').delete().eq('id', id)
    fetchSkills()
  }

  const openAdd = () => { setEditingSkill(null); setIsModalOpen(true) }
  const openEdit = (s) => { setEditingSkill(s); setIsModalOpen(true) }

  if (loading) return <div className="p-10 flex justify-center"><span className="cyber-spinner w-10 h-10"></span></div>

  const getBadgeClass = (level) => {
    switch (level) {
      case 'Expert': return 'badge-green'
      case 'Intermediate': return 'badge-purple'
      default: return 'badge-cyan'
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-fade-in">
      <PageHeader title="Capability Matrix" subtitle="Combat skills & technical proficiency" onRefresh={fetchSkills} onAdd={openAdd} refreshing={refreshing} addLabel="NEW SKILL" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {skills.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-500 font-mono">
            No capabilities logged.
          </div>
        )}
        {skills.map(skill => (
          <div key={skill.id} className="glass-card p-4 flex items-center justify-between hover:bg-white/[0.06] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-neonCyan">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm tracking-tight">{skill.name}</h4>
                <div className="mt-1">
                  <span className={getBadgeClass(skill.level)}>{skill.level}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               {/* Workaround for hover opacity in Tailwind on mapped elements without a group wrapper: just keep visible for mobile/touch */}
               <div className="flex flex-col gap-2">
                 <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors"><Edit2 size={12} /></button>
                 <button onClick={() => handleDelete(skill.id)} className="p-1.5 rounded-lg bg-white/5 text-errorRed/70 hover:text-errorRed transition-colors"><Trash2 size={12} /></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSkill ? 'MODIFY SKILL' : 'LEARN NEW SKILL'}>
        <SkillModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={editingSkill} onSave={() => { setIsModalOpen(false); fetchSkills(); }} />
      </Modal>
    </div>
  )
}
