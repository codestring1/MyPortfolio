import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'

export default function SkillModal({ isOpen, onClose, initialData, onSave }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    cert: '',
    level: 'Beginner'
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          cert: initialData.cert || '',
          level: initialData.level || 'Beginner'
        })
      } else {
        setFormData({ name: '', cert: '', level: 'Beginner' })
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
      name: formData.name,
      cert: formData.cert,
      level: formData.level,
    }

    let resultError = null
    if (initialData?.id) {
      const { error: patchError } = await supabase.from('skills').update(payload).eq('id', initialData.id)
      resultError = patchError
    } else {
      const { error: postError } = await supabase.from('skills').insert([payload])
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
        <label className="input-label">Skill Designation</label>
        <input name="name" value={formData.name} onChange={handleChange} className="input-cyber" required placeholder="e.g. React.js" />
      </div>

      <div>
        <label className="input-label">Certification URL (Optional)</label>
        <input type="text" name="cert" value={formData.cert} onChange={handleChange} className="input-cyber" placeholder="https://" />
      </div>

      <div>
        <label className="input-label">Proficiency Level</label>
        <select name="level" value={formData.level} onChange={handleChange} className="input-cyber" required>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>
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
