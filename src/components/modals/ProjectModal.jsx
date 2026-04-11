import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'

export default function ProjectModal({ isOpen, onClose, initialData, onSave }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: '',
    link: ''
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title || '',
          description: initialData.description || '',
          tech_stack: initialData.tech_stack || '',
          link: initialData.link || ''
        })
      } else {
        setFormData({ title: '', description: '', tech_stack: '', link: '' })
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
      title: formData.title,
      description: formData.description,
      tech_stack: formData.tech_stack,
      link: formData.link,
      // Leaving out documents/images upload for brevity in demo, but table supports arrays
    }

    let resultError = null
    if (initialData?.id) {
      const { error: patchError } = await supabase.from('projects').update(payload).eq('id', initialData.id)
      resultError = patchError
    } else {
      const { error: postError } = await supabase.from('projects').insert([payload])
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
        <label className="input-label">Project Designation</label>
        <input name="title" value={formData.title} onChange={handleChange} className="input-cyber" required placeholder="e.g. Myportfolio Web" />
      </div>

      <div>
        <label className="input-label">Mission Brief (Description)</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="input-cyber" required placeholder="Detailed payload description..." />
      </div>

      <div>
        <label className="input-label">Tech Stack (Comma Separated)</label>
        <input name="tech_stack" value={formData.tech_stack} onChange={handleChange} className="input-cyber" placeholder="React, Tailwind, Supabase" />
      </div>

      <div>
        <label className="input-label">External Uplink (URL)</label>
        <input type="url" name="link" value={formData.link} onChange={handleChange} className="input-cyber" placeholder="https://" />
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
