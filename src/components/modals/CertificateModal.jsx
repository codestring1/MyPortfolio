import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { supabase, uploadFile } from '../../lib/supabase.js'
import { UploadCloud } from 'lucide-react'

export default function CertificateModal({ isOpen, onClose, initialData, onSave }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [file, setFile] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '', issuer: '', description: '', pdf_url: ''
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '', issuer: initialData.issuer || '',
          description: initialData.description || '', pdf_url: initialData.pdf_url || ''
        })
      } else {
        setFormData({ name: '', issuer: '', description: '', pdf_url: '' })
      }
      setFile(null)
      setError(null)
    }
  }, [isOpen, initialData])

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleFileChange = (e) => { if (e.target.files && e.target.files[0]) setFile(e.target.files[0]) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let uploadedUrl = formData.pdf_url
      
      // If user selected a new file, upload to 'certificates' bucket
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        uploadedUrl = await uploadFile('certificates', fileName, file)
      }

      const payload = {
        user_id: user.id, name: formData.name, issuer: formData.issuer,
        description: formData.description, pdf_url: uploadedUrl
      }

      let resultError = null
      if (initialData?.id) {
         const { error: patchError } = await supabase.from('certificates').update(payload).eq('id', initialData.id)
         resultError = patchError
      } else {
         const { error: postError } = await supabase.from('certificates').insert([payload])
         resultError = postError
      }
      
      if (resultError) throw resultError
      onSave()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-errorRed/10 border border-errorRed/30 text-errorRed text-sm rounded-lg">{error}</div>}
      
      <div><label className="input-label">Certificate Title</label><input name="name" value={formData.name} onChange={handleChange} className="input-cyber" required placeholder="AWS Certified Architect" /></div>
      <div><label className="input-label">Issuing Authority</label><input name="issuer" value={formData.issuer} onChange={handleChange} className="input-cyber" required placeholder="Amazon Web Services" /></div>
      <div><label className="input-label">Brief Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="input-cyber" placeholder="Certified in distributed architectures..." /></div>

      <div>
        <label className="input-label">Document Upload (PDF/Image)</label>
        <div className="flex items-center justify-between mt-2">
           {formData.pdf_url && !file && (
             <a href={formData.pdf_url} target="_blank" rel="noreferrer" className="text-xs text-neonCyan underline">Current Document</a>
           )}
           <label className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-colors text-sm text-gray-300">
             <UploadCloud size={16} /> {file ? file.name : "Select File"}
             <input type="file" onChange={handleFileChange} className="hidden" accept="application/pdf,image/*" />
           </label>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3"><button type="button" onClick={onClose} className="btn-ghost">CANCEL</button><button type="submit" disabled={loading} className="btn-primary">{loading ? <span className="cyber-spinner border-t-black w-4 h-4"></span> : "COMMIT GRID"}</button></div>
    </form>
  )
}
