import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import Modal from '../../components/ui/Modal.jsx'
import ProjectModal from '../../components/modals/ProjectModal.jsx'
import { ExternalLink, Edit2, Trash2, Code2 } from 'lucide-react'

export default function Projects() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const fetchProjects = async () => {
    if (!user) return
    setRefreshing(true)
    const { data, error } = await supabase.from('projects').select('*').eq('user_id', user.id).order('id', { ascending: false })
    if (!error) setProjects(data || [])
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => { 
    if (user) {
      fetchProjects()
      
      const channel = supabase.channel(`projects_realtime_${user.id}`)
        .on('postgres_changes', { 
           event: '*', 
           schema: 'public', 
           table: 'projects',
           filter: `user_id=eq.${user.id}`
        }, () => fetchProjects())
        .subscribe()
        
      return () => { supabase.removeChannel(channel) }
    }
  }, [user])

  const handleDelete = async (id) => {
    if (!window.confirm('Erase this data payload?')) return
    await supabase.from('projects').delete().eq('id', id)
    fetchProjects()
  }

  const openAdd = () => { setEditingProject(null); setIsModalOpen(true) }
  const openEdit = (p) => { setEditingProject(p); setIsModalOpen(true) }

  if (loading) return <div className="p-10 flex justify-center"><span className="cyber-spinner w-10 h-10"></span></div>

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto animate-fade-in">
      <PageHeader title="Projects Array" subtitle="Manage your portfolio grid" onRefresh={fetchProjects} onAdd={openAdd} refreshing={refreshing} addLabel="NEW PROJECT" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 && (
          <div className="col-span-full text-center py-20 text-gray-500 font-mono">
            No project nodes detected. Initialize your first grid injection.
          </div>
        )}
        {projects.map(project => (
          <div key={project.id} className="glass-card flex flex-col hover:border-neonCyan/30 transition-all">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{project.title}</h3>
                <Code2 className="text-neonCyan opacity-50 flex-shrink-0" size={24} />
              </div>
              <p className="text-sm text-gray-400 line-clamp-3 mb-4">{project.description}</p>
              
              {project.tech_stack && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack.split(',').map((t, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-wider font-mono text-neonCyan bg-neonCyan/10 px-2 py-1 rounded-md border border-neonCyan/20">
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex gap-3">
                <button onClick={() => openEdit(project)} className="text-gray-400 hover:text-matrixGreen transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(project.id)} className="text-gray-400 hover:text-errorRed transition-colors"><Trash2 size={16} /></button>
              </div>
              {project.link && (
                <a href={project.link} target="_blank" rel="noreferrer" className="text-xs font-bold text-neonCyan hover:underline flex items-center gap-1">
                  UPLINK <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? 'RECONFIGURE NODE' : 'INJECT PROJECT NODE'}>
        <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialData={editingProject} onSave={() => { setIsModalOpen(false); fetchProjects(); }} />
      </Modal>
    </div>
  )
}
