import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client singleton.
 *
 * Replace the placeholder values below with your actual project credentials,
 * or set them as VITE_ environment variables in a .env file at the project root:
 *
 * VITE_SUPABASE_URL=https://your-project.supabase.co
 * VITE_SUPABASE_ANON_KEY=your-anon-key
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'


const isPlaceholder = supabaseUrl.includes('placeholder.supabase.co')

if (isPlaceholder) {
  console.warn(
    '[Supabase] Using PLACEHOLDER credentials. Features like database sync and real-time chat will remain in DEMO MODE.\n' +
    'To enable live data, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file or GitHub Secrets.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    /**
     * Persist the auth session across page reloads using localStorage.
     */
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

/* ─── Convenience helpers ──────────────────────────────────── */

/**
 * Returns the current session or null.
 */
export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

/**
 * Returns the currently logged-in user or null.
 */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}

/**
 * Upload a file by converting it to a Base64 String (Matching Android App Logic)
 * @param {string} bucket  - (Ignored for Base64 logic)
 * @param {string} path    - File name
 * @param {File}   file    - File object
 * @returns {Promise<string>} - Base64 Data URI of the file
 */
export async function uploadFile(bucket, path, file) {
  console.log('[Upload] Bypassing external storage. Encoding file to Base64 to match Android app logic...', { fileName: file?.name, fileSize: file?.size })

  // EXACT ANDROID LOGIC MATCH: Convert the file to a Base64 Data URI string.
  // In the Android app, `uriToBase64Proj` is used to encode files into Base64 strings 
  // and save them directly to the Supabase database. We replicate that here to 
  // permanently bypass any "Failed to fetch" or CORS errors from external endpoints.
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      // reader.result contains the full Data URI (e.g., data:application/pdf;base64,... or data:image/png;base64,...)
      console.log('[Upload] Base64 encoding complete. String ready for database injection.')
      resolve(reader.result)
    }
    
    reader.onerror = (error) => {
      console.error('[Upload] FileReader error:', error)
      reject(new Error('Failed to encode file to Base64 format.'))
    }
    
    // Read the file as a data URL (Base64)
    reader.readAsDataURL(file)
  })
}