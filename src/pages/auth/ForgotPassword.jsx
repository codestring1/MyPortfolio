import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, ArrowLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [error, setError] = useState(null)

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMsg(null)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    setLoading(false)

    if (resetError) {
      setError(resetError.message)
    } else {
      setMsg('Reset link sent. Please check your email for instructions.')
    }
  }

  return (
    <div className="page-container items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center text-xs text-gray-500 hover:text-neonCyan transition-colors mb-6">
          <ArrowLeft size={14} className="mr-1" /> ABORT directive
        </Link>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white text-glow-cyan tracking-tight mb-2">
            Recover Access
          </h1>
          <p className="text-gray-400 font-mono text-sm tracking-widest uppercase">
            Key override sequence
          </p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleReset} className="space-y-6">
            {error && <div className="p-3 rounded-lg bg-errorRed/10 border border-errorRed/30 text-errorRed text-sm">{error}</div>}
            {msg && <div className="p-3 rounded-lg bg-matrixGreen/10 border border-matrixGreen/30 text-matrixGreen text-sm">{msg}</div>}

            <div>
              <label className="input-label">Target Email Designation</label>
              <input
                type="email"
                className="input-cyber"
                placeholder="operative@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full bg-neonCyan text-black hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all">

              {loading ? <span className="cyber-spinner border-t-black"></span> : <><Send size={18} /> TRANSMIT RESET CODE</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
