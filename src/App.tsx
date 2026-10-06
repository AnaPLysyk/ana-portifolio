import type { SyntheticEvent } from 'react'

function applyParityPatches(event: SyntheticEvent<HTMLIFrameElement>) {
  const frame = event.currentTarget
  const doc = frame.contentDocument
  if (!doc) return

  if (!doc.getElementById('photo-editor-parity-css')) {
    const link = doc.createElement('link')
    link.id = 'photo-editor-parity-css'
    link.rel = 'stylesheet'
    link.href = '/parity/photo-editor.css'
    doc.head.appendChild(link)
  }

  if (!doc.getElementById('photo-editor-parity-js')) {
    const script = doc.createElement('script')
    script.id = 'photo-editor-parity-js'
    script.src = '/parity/photo-editor.js'
    doc.body.appendChild(script)
  }
}

export default function App() {
  return (
    <main className="prototype-shell">
      <iframe
        className="prototype-frame"
        src="/prototype-final.html"
        title="Portfólio profissional de Ana Paula de Lima Lysyk"
        onLoad={applyParityPatches}
      />
    </main>
  )
}
