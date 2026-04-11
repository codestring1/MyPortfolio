import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [msg, setMsg] = useState(null)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMsg(null)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
    } else {
      if (data?.session) {
        // Auto sign-in happened (config allowing)
        navigate('/details')
      } else {
        setShowOtp(true)
        setMsg('Verification sequence initiated. Check your designated email for the 6-digit code.')
      }
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup'
    })

    setLoading(false)

    if (verifyError) {
      setError(verifyError.message)
    } else {
      navigate('/details')
    }
  }

  return (
    <div className="page-container items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white text-glow-cyan tracking-tight mb-2">
            Establish Identity
          </h1>
          <p className="text-white/60 font-mono text-xs tracking-[0.2em] uppercase">

            {showOtp ? 'Verification Required' : 'New Operative Registration'}
          </p>
        </div>

        <div className="glass-card p-8 relative overflow-hidden">
          {/* Decorative neon line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neonCyan to-transparent"></div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-errorRed/10 border border-errorRed/30 text-errorRed text-sm">
              {error}
            </div>
          )}
          {msg && !error && (
            <div className="mb-6 p-3 rounded-lg bg-neonCyan/10 border border-neonCyan/30 text-neonCyan text-sm text-center">
              {msg}
            </div>
          )}

          {!showOtp ? (
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label className="input-label">Email Designation</label>
                <input
                  type="email"
                  className="input-cyber placeholder-white/20 focus:border-neonCyan/60 focus:bg-neonCyan/[0.04]"

                  placeholder="operative@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="input-label">Secure Access Code</label>
                <input
                  type="password"
                  className="input-cyber placeholder-white/20 focus:border-neonCyan/60 focus:bg-neonCyan/[0.04]"

                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full bg-neonCyan text-white hover:shadow-[0_0_20px_rgba(0,229,255,0.6)]"

              >
                {loading ? (
                  <span className="cyber-spinner border-t-black"></span>
                ) : (
                  <>
                    <UserPlus size={18} /> GENERATE PROFILE
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="input-label text-neonCyan">Enter 6-Digit Code</label>
                <input
                  type="text"
                  maxLength="6"
                  className="input-cyber text-center text-2xl tracking-[0.5em] font-mono focus:border-neonCyan/60"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="btn-primary w-full bg-neonCyan text-black hover:shadow-[0_0_20px_rgba(0,229,255,0.6)]"
              >
                {loading ? (
                  <span className="cyber-spinner border-t-black"></span>
                ) : (
                  'VERIFY IDENTITY'
                )}
              </button>

              <button 
                type="button"
                onClick={() => setShowOtp(false)}
                className="w-full text-xs text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                disabled={loading}
              >
                ← Back to Registration
              </button>
            </form>
          )}
        </div>

        {!showOtp && (
          <p className="text-white/50 text-sm">
            Already documented?{' '}
            <Link to="/login" className="text-white font-bold hover:text-neonCyan transition-colors underline underline-offset-4">
              Initialize Session
            </Link>
          </p>

        )}
      </div>
    </div>
  )
}
