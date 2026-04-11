import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'

export default function ExperienceModal({ isOpen, onClose, initialData, onSave }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    duration: '',
    description: ''
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          company: initialData.company || '',
          role: initialData.role || '',
          duration: initialData.duration || '',
          description: initialData.description || ''
        })
      } else {
        setFormData({ company: '', role: '', duration: '', description: '' })
      }
      setError(null)
    }
  }, [isOpen, initialData])

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      user_id: user.id,
      company: formData.company,
      role: formData.role,
      duration: formData.duration,
      description: formData.description,
    }

    let resultError = null
    if (initialData?.id) {
      const { error: patchError } = await supabase.from('experience').update(payload).eq('id', initialData.id)
      resultError = patchError
    } else {
      const { error: postError } = await supabase.from('experience').insert([payload])
      resultError = postError
    }

    setLoading(false)
    if (resultError) {
      setError(resultError.message)
    } else {
      onSave()
    }
  }

  if (!isOpen) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-errorRed/10 border border-errorRed/30 text-errorRed text-sm rounded-lg">{error}</div>}
      
      <div>
        <label className="input-label">Corporation / Faction</label>
        <input name="company" value={formData.company} onChange={handleChange} className="input-cyber" required placeholder="Arasaka Corp" />
      </div>

      <div>
        <label className="input-label">Assigned Role</label>
        <input name="role" value={formData.role} onChange={handleChange} className="input-cyber" required placeholder="Netrunner" />
      </div>

      <div>
        <label className="input-label">Duration</label>
        <input name="duration" value={formData.duration} onChange={handleChange} className="input-cyber" required placeholder="2075 - 2077" />
      </div>

      <div>
        <label className="input-label">Mission Briefing (Description)</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="input-cyber" placeholder="..." />
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <button type="button" onClick={onClose} className="btn-ghost">CANCEL</button>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <span className="cyber-spinner border-t-black w-4 h-4"></span> : "COMMIT GRID"}
        </button>
      </div>
    </form>
  )
}
