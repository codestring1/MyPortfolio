import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { uploadFile } from '../../lib/supabase.js'
import PageHeader from '../../components/PageHeader.jsx'
import { Save, UploadCloud } from 'lucide-react'

export default function Settings() {
  const { user, profile, updateProfile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    github_link: profile?.github_link || '',
    linkedin_link: profile?.linkedin_link || '',
  })
  const [file, setFile] = useState(null)

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))
  const handleFileChange = (e) => { if (e.target.files && e.target.files[0]) setFile(e.target.files[0]) }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null); setMsg(null)

    try {
      let uploadedUrl = profile?.photo_url
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}-avatar-${Date.now()}.${fileExt}`
        uploadedUrl = await uploadFile('avatars', fileName, file)
      }

      await updateProfile({ ...formData, photo_url: uploadedUrl })
      setMsg("Operative profile re-synced successfully.")
      setTimeout(() => setMsg(null), 3000)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto animate-fade-in">
      <PageHeader title="System Settings" subtitle="Configure identity matrix" />

      {msg && <div className="mb-6 p-4 rounded-xl bg-matrixGreen/10 border border-matrixGreen/30 text-matrixGreen">{msg}</div>}
      {error && <div className="mb-6 p-4 rounded-xl bg-errorRed/10 border border-errorRed/30 text-errorRed">{error}</div>}

      <form onSubmit={handleSave} className="glass-card p-6 md:p-8 space-y-6">
        
        <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-white/10">
          <div className="w-24 h-24 rounded-full bg-white/5 border border-white/20 overflow-hidden flex items-center justify-center shrink-0 text-gray-400">
             {(file && URL.createObjectURL(file)) || profile?.photo_url ? (
               <img src={file ? URL.createObjectURL(file) : profile?.photo_url} className="w-full h-full object-cover" alt="Avatar"/>
             ) : (
               <span className="text-4xl text-neonCyan">{profile?.full_name?.charAt(0) || '?'}</span>
             )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-white font-bold mb-2">Avatar Upload</h3>
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-colors text-sm text-gray-300">
              <UploadCloud size={16} /> {file ? file.name : "Select Image"}
              <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
            </label>
          </div>
        </div>

        <div className="space-y-5">
           <div><label className="input-label">Public Alias</label><input name="full_name" value={formData.full_name} onChange={handleChange} className="input-cyber" required/></div>
           <div className="grid md:grid-cols-2 gap-4">
              <div><label className="input-label">Email (Immutable)</label><input type="email" value={profile?.email || user?.email || ''} className="input-cyber opacity-50 cursor-not-allowed" disabled/></div>
              <div><label className="input-label">Comms Line</label><input name="phone" value={formData.phone} onChange={handleChange} className="input-cyber" /></div>
           </div>
           <div className="grid md:grid-cols-2 gap-4">
              <div><label className="input-label">GitHub</label><input name="github_link" value={formData.github_link} onChange={handleChange} className="input-cyber placeholder:opacity-50" placeholder="https://github.com/..." /></div>
              <div><label className="input-label">LinkedIn</label><input name="linkedin_link" value={formData.linkedin_link} onChange={handleChange} className="input-cyber placeholder:opacity-50" placeholder="https://linkedin.com/in/..." /></div>
           </div>
        </div>

        <div className="pt-4 flex justify-end">
           <button type="submit" disabled={loading} className="btn-primary">
             {loading ? <span className="cyber-spinner border-t-black w-4 h-4"></span> : <><Save size={18} /> SYNC CHANGES</>}
           </button>
        </div>
      </form>
    </div>
  )
}
