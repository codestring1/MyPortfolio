import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Save } from 'lucide-react'

export default function Academics() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)
  
  // Flat schema form
  const [formData, setFormData] = useState({
    school_name: '', school_year: '', school_grade: '',
    inter_name: '', inter_branch: '', inter_year: '', inter_grade: '',
    grad_name: '', grad_degree: '', grad_branch: '', grad_start: '', grad_end: '', grad_grade: '',
    pg_name: '', pg_degree: '', pg_branch: '', pg_start: '', pg_end: '', pg_grade: ''
  })

  useEffect(() => {
    const fetchAcademics = async () => {
      if (!user) {
        setLoading(false)
        return
      }
      const { data } = await supabase.from('academics').select('*').eq('user_id', user.id).single()
      if (data) {
        const d = { ...data }
        delete d.user_id 
        setFormData(d)
      }
      setLoading(false)
    }
    
    fetchAcademics()
    
    if (user) {
      const channel = supabase.channel(`academics_realtime_${user.id}`)
        .on('postgres_changes', { 
           event: '*', 
           schema: 'public', 
           table: 'academics',
           filter: `user_id=eq.${user.id}`
        }, () => fetchAcademics())
        .subscribe()
        
      return () => { supabase.removeChannel(channel) }
    }
  }, [user])

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setMsg(null)
    
    const payload = { user_id: user.id, ...formData }
    const { error } = await supabase.from('academics').upsert(payload, { onConflict: 'user_id' })
    
    setSaving(false)
    if (!error) {
      setMsg("Academic records encoded successfully.")
      setTimeout(() => setMsg(null), 3000)
    }
  }

  if (loading) return <div className="p-10 flex justify-center"><span className="cyber-spinner w-10 h-10"></span></div>

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fade-in pb-10">
      <PageHeader title="Academic Implants" subtitle="Formal training and knowledge uploads" />

      {msg && <div className="mb-6 p-4 rounded-xl bg-matrixGreen/10 border border-matrixGreen/30 text-matrixGreen">{msg}</div>}

      <form onSubmit={handleSave} className="space-y-8">
        {/* School */}
        <section className="glass-card p-6 border-t-2 border-t-neonCyan">
          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest font-mono">Foundational Training (School)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="input-label">Facility</label><input name="school_name" value={formData.school_name || ''} onChange={handleChange} className="input-cyber" /></div>
            <div><label className="input-label">Year of Extract</label><input name="school_year" value={formData.school_year || ''} onChange={handleChange} className="input-cyber" /></div>
            <div><label className="input-label">Grade/Score</label><input name="school_grade" value={formData.school_grade || ''} onChange={handleChange} className="input-cyber" /></div>
          </div>
        </section>

        {/* Intermediate / High School */}
        <section className="glass-card p-6 border-t-2 border-t-neonPurple">
          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest font-mono">Secondary Training (Inter / High School)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div><label className="input-label">Facility</label><input name="inter_name" value={formData.inter_name || ''} onChange={handleChange} className="input-cyber" /></div>
             <div><label className="input-label">Branch/Subject</label><input name="inter_branch" value={formData.inter_branch || ''} onChange={handleChange} className="input-cyber" /></div>
             <div><label className="input-label">Year of Extract</label><input name="inter_year" value={formData.inter_year || ''} onChange={handleChange} className="input-cyber" /></div>
             <div><label className="input-label">Grade/Score</label><input name="inter_grade" value={formData.inter_grade || ''} onChange={handleChange} className="input-cyber" /></div>
          </div>
        </section>

        {/* Graduation */}
        <section className="glass-card p-6 border-t-2 border-t-matrixGreen">
          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest font-mono">Advanced Upload (Graduation)</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <div className="md:col-span-2"><label className="input-label">Academy/Facility</label><input name="grad_name" value={formData.grad_name || ''} onChange={handleChange} className="input-cyber" /></div>
             <div><label className="input-label">Degree</label><input name="grad_degree" value={formData.grad_degree || ''} onChange={handleChange} className="input-cyber" /></div>
             <div className="md:col-span-3 lg:col-span-1"><label className="input-label">Branch specialisation</label><input name="grad_branch" value={formData.grad_branch || ''} onChange={handleChange} className="input-cyber" /></div>
             <div><label className="input-label">Start Year</label><input name="grad_start" value={formData.grad_start || ''} onChange={handleChange} className="input-cyber" /></div>
             <div><label className="input-label">End Year</label><input name="grad_end" value={formData.grad_end || ''} onChange={handleChange} className="input-cyber" /></div>
             <div><label className="input-label">Grade/GPA</label><input name="grad_grade" value={formData.grad_grade || ''} onChange={handleChange} className="input-cyber" /></div>
          </div>
        </section>
        
        {/* Post Graduation */}
        <section className="glass-card p-6 border-t-2 border-t-cyberYellow">
          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest font-mono">Master Upload (Post Graduation)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <div className="md:col-span-2"><label className="input-label">Academy/Facility</label><input name="pg_name" value={formData.pg_name || ''} onChange={handleChange} className="input-cyber" /></div>
             <div><label className="input-label">Degree</label><input name="pg_degree" value={formData.pg_degree || ''} onChange={handleChange} className="input-cyber" /></div>
             <div className="md:col-span-3 lg:col-span-1"><label className="input-label">Branch specialisation</label><input name="pg_branch" value={formData.pg_branch || ''} onChange={handleChange} className="input-cyber" /></div>
             <div><label className="input-label">Start Year</label><input name="pg_start" value={formData.pg_start || ''} onChange={handleChange} className="input-cyber" /></div>
             <div><label className="input-label">End Year</label><input name="pg_end" value={formData.pg_end || ''} onChange={handleChange} className="input-cyber" /></div>
             <div><label className="input-label">Grade/GPA</label><input name="pg_grade" value={formData.pg_grade || ''} onChange={handleChange} className="input-cyber" /></div>
          </div>
        </section>

        {/* Submit Action */}
        <div className="pt-6 flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary w-full md:w-auto px-10 shadow-cyan-glow">
            {saving ? <span className="cyber-spinner border-t-black w-5 h-5"></span> : <><Save size={18} /> ENCODE RECORD</>}
          </button>
        </div>
      </form>
    </div>
  )
}
