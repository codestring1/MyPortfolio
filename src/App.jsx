import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import SplashIntro from './components/SplashIntro.jsx'

// Auth Screens
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'
import Details from './pages/auth/Details.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import UpdatePassword from './pages/auth/UpdatePassword.jsx'

// Dashboard Layout Modules
import Home from './pages/dashboard/Home.jsx'
import Community from './pages/dashboard/Community.jsx'
import Jobs from './pages/dashboard/Jobs.jsx'

// CRUD Feature Modules
import Projects from './pages/features/Projects.jsx'
import Skills from './pages/features/Skills.jsx'
import Experience from './pages/features/Experience.jsx'
import Academics from './pages/features/Academics.jsx'
import Certificates from './pages/features/Certificates.jsx'
import Resumes from './pages/features/Resumes.jsx'
import Settings from './pages/features/Settings.jsx'
import BuilderFrame from './pages/features/BuilderFrame.jsx'

// Social & Chat
import PublicPortfolio from './pages/social/PublicPortfolio.jsx'
import ChatList from './pages/social/ChatList.jsx'
import ChatDM from './pages/social/ChatDM.jsx'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return (
      <ThemeProvider>
        <SplashIntro onComplete={() => setShowSplash(false)} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            {/* Auth Routes (Public) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            
            {/* Public Layout Routes (Dashboard is now public entry) */}
            <Route element={<AppLayout />}>
               <Route path="/" element={<Home />} />
               
               {/* Public Portfolio View */}
               <Route path="/portfolio/:userId" element={<PublicPortfolio />} />

               {/* Protected Dashboard Modules */}
               <Route path="/details" element={<ProtectedRoute><Details /></ProtectedRoute>} />
               <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
               <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />

               {/* CRUD Feature Modules (Protected) */}
               <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
               <Route path="/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
               <Route path="/experience" element={<ProtectedRoute><Experience /></ProtectedRoute>} />
               <Route path="/academics" element={<ProtectedRoute><Academics /></ProtectedRoute>} />
               <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
               <Route path="/resumes" element={<ProtectedRoute><Resumes /></ProtectedRoute>} />
               <Route path="/builder" element={<ProtectedRoute><BuilderFrame /></ProtectedRoute>} />
               <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

               {/* Chat & Social (Protected) */}
               <Route path="/chat" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
               <Route path="/chat/:userId" element={<ProtectedRoute><ChatDM /></ProtectedRoute>} />
            </Route>

          </Routes>
        </HashRouter>

      </AuthProvider>
    </ThemeProvider>
  )
}
