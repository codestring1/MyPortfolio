import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('app-theme')
    if (savedTheme) return savedTheme
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    
    return 'dark' // Default to dark for this portfolio app
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove both classes first
    root.classList.remove('light', 'dark')
    
    // Add the current theme class
    root.classList.add(theme)
    
    // Update body class for specific overrides if needed
    document.body.className = theme
    
    localStorage.setItem('app-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
