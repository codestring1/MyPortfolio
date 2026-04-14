import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogIn, KeyRound } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { signInAsGuest } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleGuestLogin = () => {
    signInAsGuest()
    const from = location.state?.from?.pathname || '/'
    navigate(from, { replace: true })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (signInError) {
      setError(signInError.message)
    } else {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="page-container items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white text-glow-cyan tracking-tight mb-2">
            Myportfolio
          </h1>
          <p className="text-white/60 font-mono text-xs tracking-[0.2em] uppercase">
            User Authentication
          </p>

        </div>

        <div className="glass-card p-8 relative overflow-hidden">
          {/* Decorative neon line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neonCyan to-transparent"></div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-errorRed/10 border border-errorRed/30 text-errorRed text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="input-cyber placeholder-white/20"
                placeholder="user@example.com"

                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input-cyber placeholder-white/20"
                placeholder="••••••••"

                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <Link to="/forgot-password" className="text-xs text-neonCyan hover:text-white transition-colors flex items-center gap-1">
                <KeyRound size={12} /> Reset Password
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full bg-neonCyan text-white hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            >


              {loading ? (
                <span className="cyber-spinner w-5 h-5 border-t-black border-black/20"></span>
              ) : (
                <>
                  <LogIn size={18} /> SIGN IN
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-mono"><span className="bg-[#050505] px-4 text-gray-500">Or continue as guest</span></div>
          </div>

          <button
            onClick={handleGuestLogin}
            className="w-full py-3 rounded-xl border border-neonCyan/30 text-neonCyan text-xs font-bold uppercase tracking-widest hover:bg-neonCyan/5 transition-all"
          >
            Enter as Guest
          </button>

        </div>


        <p className="text-center mt-8 text-white/50 text-sm">
          No active profile?{' '}
          <Link to="/signup" className="text-white font-bold hover:text-neonCyan transition-colors underline underline-offset-4">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  )
}
