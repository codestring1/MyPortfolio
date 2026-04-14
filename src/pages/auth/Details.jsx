import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'

/**
 * Details component is the onboarding flow.
 * It enforces users strictly populating their profiles row matching schema:
 * profiles (id, full_name, email, phone, github_link, linkedin_link, photo_url)
 */
export default function Details() {
  const { user, profile, updateProfile } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    github_link: '',
    linkedin_link: '',
    // Supabase Auth stores email which we duplicate here for convenience:
    email: user?.email || '', 
  })

  useEffect(() => {
    if (profile?.full_name) {
      // If they already have a name, redirect them out of onboarding
      navigate('/')
    }
  }, [profile, navigate])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!formData.full_name.trim()) throw new Error("Your full name is required.")
      
      await updateProfile(formData)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white text-glow-cyan tracking-tight mb-2">
            Onboarding
          </h1>
          <p className="text-gray-400 font-mono text-xs tracking-widest uppercase">
            Complete Your Profile
          </p>
        </div>

        <div className="glass-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-errorRed/10 border border-errorRed/30 text-errorRed text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="input-label">Full Name *</label>
              <input
                name="full_name"
                type="text"
                className="input-cyber"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="input-label">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  className="input-cyber"
                  placeholder="+1 (555) 019-9231"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="input-label">Email (Immutable)</label>
                <input
                  type="email"
                  className="input-cyber"
                  value={formData.email}
                  disabled
                />
              </div>
            </div>

            <div className="cyber-divider my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="input-label">GitHub Link</label>
                <input
                  name="github_link"
                  type="url"
                  className="input-cyber"
                  placeholder="https://github.com/..."
                  value={formData.github_link}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="input-label">LinkedIn Link</label>
                <input
                  name="linkedin_link"
                  type="url"
                  className="input-cyber"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedin_link}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? <span className="cyber-spinner border-t-black" /> : <><Save size={18} /> SAVE PROFILE</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
