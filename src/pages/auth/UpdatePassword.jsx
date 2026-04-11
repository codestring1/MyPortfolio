import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    })

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="page-container items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white text-glow-cyan tracking-tight mb-2">
            Establish New Key
          </h1>
          <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">
            Encryption override sequence
          </p>
        </div>

        <div className="glass-card p-8 relative">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-matrixGreen to-transparent"></div>
          <form onSubmit={handleUpdate} className="space-y-6">
            {error && <div className="p-3 rounded-lg bg-errorRed/10 border border-errorRed/30 text-errorRed text-sm">{error}</div>}

            <div>
              <label className="input-label">New Access Sequence</label>
              <input
                type="password"
                className="input-cyber"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full bg-matrixGreen text-black shadow-green-glow hover:shadow-green-glow">
              {loading ? <span className="cyber-spinner border-t-black"></span> : <><ShieldCheck size={18} /> CONFIRM ENCRYPTION</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
