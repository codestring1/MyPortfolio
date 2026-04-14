import { X, ExternalLink, Download, FileText, Loader2, Image as ImageIcon } from 'lucide-react'
import { useState, useEffect } from 'react'

/**
 * Floating Document Viewer overlay
 * Smartly handles both PDFs (native rendering) and Images (native rendering).
 */
export default function PdfViewer({ url, title, onClose }) {
  const [loading, setLoading] = useState(true)

  // Safety fallback: drop the loader fairly quickly so users see the document or the fallback UI
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!url) return null

  // Detect if the uploaded file is an image based on the URL extension
  const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i) !== null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Viewer Card */}
      <div className="relative w-full max-w-5xl h-[85vh] rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-blue-500/10 overflow-hidden flex flex-col z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.03] shrink-0 relative z-20">
          <h3 className="text-white font-bold text-sm truncate mr-4 flex items-center gap-2">
            {isImage ? <ImageIcon size={16} className="text-green-500" /> : <FileText size={16} className="text-blue-500" />}
            {title || 'Document Viewer'}
          </h3>
          <div className="flex items-center gap-2">
            <a
              href={url}
              download
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg text-gray-400 hover:text-green-500 hover:bg-white/5 transition-colors"
              title="Download File"
            >
              <Download size={16} />
            </a>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-white/5 transition-colors"
              title="Open in New Tab"
            >
              <ExternalLink size={16} />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Document Frame */}
        <div className="flex-1 bg-gray-900 relative flex items-center justify-center overflow-hidden">
          
          {/* Fallback Messaging (Shows if iframe stays empty due to Cloudinary forced download) */}
          {!loading && !isImage && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4 z-0 bg-gray-900">
               <FileText size={48} className="text-gray-600 mb-2" />
               <p className="text-gray-300 text-sm max-w-sm font-bold uppercase tracking-widest">
                  Document Preview
               </p>
               <p className="text-gray-500 text-xs max-w-sm italic">
                  If the preview is unavailable, please download the file or open it in a new browser tab.
               </p>
               <a
                 href={url}
                 target="_blank"
                 rel="noreferrer"
                 className="mt-4 px-6 py-2.5 bg-blue-500 text-white hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] rounded-lg transition-all text-sm font-bold flex items-center gap-2"
               >
                 <ExternalLink size={16} /> Open in New Tab
               </a>
             </div>
          )}

          {/* Background Loader */}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4 z-0 bg-gray-900">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-blue-500 mb-2">
                  <Loader2 size={32} className="animate-spin" />
               </div>
               <p className="text-gray-300 text-sm max-w-xs font-bold uppercase tracking-widest">
                  Loading Document...
               </p>
            </div>
          )}

          {isImage ? (
            <img
              src={url}
              alt={title || 'Document'}
              className={`max-w-full max-h-full object-contain relative z-10 transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
          ) : (
            <iframe
              src={url}
              title={title || 'PDF Document'}
              /* If the iframe successfully loads a PDF, it will cover the gray fallback background. */
              className={`w-full h-full border-0 relative z-10 bg-white transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
          )}
        </div>
      </div>
    </div>
  )
}