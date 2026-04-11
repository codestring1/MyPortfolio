import { useState, useEffect } from 'react'

export default function SplashIntro({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false)
  const [showBrand, setShowBrand] = useState(false)

  useEffect(() => {
    // Timings from Android SplashScreen.kt
    const brandFadeDelay = 1500
    const transitionDelay = 2800 
    const totalDuration = 3200

    const brandTimer = setTimeout(() => setShowBrand(true), brandFadeDelay)
    const exitTimer = setTimeout(() => setIsExiting(true), transitionDelay)
    const completeTimer = setTimeout(() => onComplete(), totalDuration)

    return () => {
      clearTimeout(brandTimer)
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-in-out ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(to bottom, #050505, #1A1A2E)'
      }}
    >
      <div className="flex flex-col items-center justify-center flex-1">
        
        {/* The 'Rotating P' Logo (Matching Android 140dp size) */}
        <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center animate-logo-spin">
          
          {/* Sweep Gradient Border Simulation */}
          <div 
            className="absolute inset-0 rounded-full p-[4px]"
            style={{
              background: 'conic-gradient(from 0deg, #00E5FF, #D500F9, #00E5FF)'
            }}
          >
            {/* Inner Dark Circle */}
            <div className="w-full h-full bg-black/30 rounded-full backdrop-blur-sm flex items-center justify-center border border-white/10">
              <span className="text-white text-6xl md:text-8xl font-black tracking-tighter">
                P
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Text (Fades in at bottom center like Android) */}
      <div 
        className={`mb-32 transition-all duration-1000 transform ${
          showBrand ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h1 className="text-neonCyan text-xl md:text-2xl font-bold tracking-[0.3em] uppercase">
          Portfolio
        </h1>
      </div>
    </div>
  )
}