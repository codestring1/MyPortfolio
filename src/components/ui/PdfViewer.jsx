import { X, ExternalLink, Download, FileText } from 'lucide-react'

/**
 * Floating PDF Viewer overlay — renders an iframe of the PDF
 * inside a glass-morphism modal on the same page.
 */
export default function PdfViewer({ url, title, onClose }) {
  if (!url) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Viewer Card */}
      <div className="relative w-full max-w-5xl h-[85vh] rounded-2xl border border-white/10 bg-cyberBlack/95 shadow-2xl shadow-neonCyan/10 overflow-hidden flex flex-col z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.03] shrink-0">
          <h3 className="text-white font-bold text-sm truncate mr-4">{title || 'Document Viewer'}</h3>
          <div className="flex items-center gap-2">
            <a
              href={url}
              download
              className="p-2 rounded-lg text-gray-400 hover:text-matrixGreen hover:bg-white/5 transition-colors"
              title="Download"
            >
              <Download size={16} />
            </a>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg text-gray-400 hover:text-neonCyan hover:bg-white/5 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink size={16} />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-errorRed hover:bg-errorRed/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF iframe with Fallback */}
        <div className="flex-1 bg-gray-900 relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-500 mb-2">
                <FileText size={32} />
             </div>
             <p className="text-gray-400 text-sm max-w-xs">
                If the secure preview is blocked by your browser, use the link below to access the payload directly.
             </p>
             <a 
               href={url} 
               target="_blank" 
               rel="noreferrer" 
               className="btn-primary py-2 px-6 bg-neonCyan text-white font-bold text-xs uppercase"
             >
               Open Document Manually
             </a>
          </div>

          <iframe
            src={url}
            title={title || 'PDF Document'}
            className="w-full h-full border-0 relative z-10 bg-white"
            style={{ minHeight: '100%' }}
          />
        </div>
      </div>
    </div>
  )
}
