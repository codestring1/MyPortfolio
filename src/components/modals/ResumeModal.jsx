import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { supabase, uploadFile } from '../../lib/supabase.js'
import { UploadCloud } from 'lucide-react'

export default function ResumeModal({ isOpen, onClose, initialData, onSave }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [file, setFile] = useState(null)
  
  const [formData, setFormData] = useState({
    title: '', type: 'Resume', pdf_url: '', file_name: ''
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ title: initialData.title || '', type: initialData.type || 'Resume', pdf_url: initialData.pdf_url || '', file_name: initialData.file_name || '' })
      } else {
        setFormData({ title: '', type: 'Resume', pdf_url: '', file_name: '' })
      }
      setFile(null); setError(null)
    }
  }, [isOpen, initialData])

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleFileChange = (e) => { if (e.target.files && e.target.files[0]) setFile(e.target.files[0]) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)

    try {
      let uploadedUrl = formData.pdf_url
      let actualFileName = formData.file_name

      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-resume-${Date.now()}.${fileExt}`
        uploadedUrl = await uploadFile('resumes', fileName, file) // Using 'resumes' bucket
        actualFileName = file.name
      }

      const payload = { user_id: user.id, title: formData.title, type: formData.type, pdf_url: uploadedUrl, file_name: actualFileName }

      let resultError = null
      if (initialData?.id) {
         const { error: patchError } = await supabase.from('resumes').update(payload).eq('id', initialData.id)
         resultError = patchError
      } else {
         const { error: postError } = await supabase.from('resumes').insert([payload])
         resultError = postError
      }
      if (resultError) throw resultError
      onSave()
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  if (!isOpen) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-errorRed/10 border border-errorRed/30 text-errorRed text-sm rounded-lg">{error}</div>}
      
      <div><label className="input-label">Archive Title</label><input name="title" value={formData.title} onChange={handleChange} className="input-cyber" required placeholder="Frontend Developer 2026" /></div>
      <div>
        <label className="input-label">Classification</label>
        <select name="type" value={formData.type} onChange={handleChange} className="input-cyber" required>
          <option value="Resume">Resume / CV</option>
          <option value="Cover Letter">Cover Letter</option>
          <option value="Portfolio Deck">Portfolio Deck</option>
        </select>
      </div>

      <div>
         <label className="input-label">Target File (PDF)</label>
         <div className="flex items-center justify-between w-full">
            {formData.pdf_url && !file && (<a href={formData.pdf_url} target="_blank" rel="noreferrer" className="text-xs text-matrixGreen underline">Current File Payload</a>)}
            <label className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-colors text-sm text-gray-300"><UploadCloud size={16} /> {file ? file.name : "Select Payload"}<input type="file" onChange={handleFileChange} className="hidden" accept="application/pdf" /></label>
         </div>
      </div>

      <div className="pt-4 flex justify-end gap-3"><button type="button" onClick={onClose} className="btn-ghost">CANCEL</button><button type="submit" disabled={loading} className="btn-primary" style={{backgroundColor: '#FFE500', color: '#000'}}>{loading ? <span className="cyber-spinner border-t-black w-4 h-4"></span> : "ARCHIVE FILE"}</button></div>
    </form>
  )
}
