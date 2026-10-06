import type { SyntheticEvent } from 'react'

function loadAsset(doc: Document, type: 'css' | 'js', id: string, src: string) {
  if (doc.getElementById(id)) return

  if (type === 'css') {
    const link = doc.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = src
    doc.head.appendChild(link)
    return
  }

  const script = doc.createElement('script')
  script.id = id
  script.src = src
  doc.body.appendChild(script)
}

function applyFinalHtmlPatches(event: SyntheticEvent<HTMLIFrameElement>) {
  const frame = event.currentTarget
  const doc = frame.contentDocument
  if (!doc) return

  // A base visual continua sendo o HTML final v161.
  // Estes arquivos restauram exatamente os ajustes incrementais v162/v163.
  loadAsset(doc, 'css', 'portfolio-v163-final-css', '/parity/v163-final.css')
  loadAsset(doc, 'js', 'portfolio-v163-runtime-js', '/parity/v163-runtime.js')
  loadAsset(doc, 'js', 'portfolio-v163-drag-js', '/parity/v163-drag.js')
  loadAsset(doc, 'css', 'portfolio-conversational-chat-css', '/parity/conversational-chat.css')
  loadAsset(doc, 'js', 'portfolio-conversational-chat-js', '/parity/conversational-chat.js')
  loadAsset(doc, 'css', 'portfolio-refinements-v171-css', '/parity/refinements-v171.css')
  loadAsset(doc, 'js', 'portfolio-refinements-v171-js', '/parity/refinements-v171.js')
  loadAsset(doc, 'css', 'portfolio-refinements-v173-css', '/parity/refinements-v173.css')
  loadAsset(doc, 'js', 'portfolio-refinements-v173-js', '/parity/refinements-v173.js')
  loadAsset(doc, 'js', 'portfolio-refinements-v175-js', '/parity/refinements-v175.js')
  loadAsset(doc, 'js', 'portfolio-refinements-v176-js', '/parity/refinements-v176.js')
  loadAsset(doc, 'js', 'portfolio-refinements-v177-js', '/parity/refinements-v177.js')
  loadAsset(doc, 'css', 'portfolio-refinements-v178-css', '/parity/refinements-v178.css')
  loadAsset(doc, 'js', 'portfolio-refinements-v178-js', '/parity/refinements-v178.js')
  loadAsset(doc, 'css', 'portfolio-refinements-v179-css', '/parity/refinements-v179.css')
  loadAsset(doc, 'js', 'portfolio-refinements-v179-js', '/parity/refinements-v179.js')
  loadAsset(doc, 'css', 'portfolio-refinements-v180-css', '/parity/refinements-v180.css')
  loadAsset(doc, 'js', 'portfolio-refinements-v180-js', '/parity/refinements-v180.js')
  loadAsset(doc, 'css', 'portfolio-refinements-v181-css', '/parity/refinements-v181.css')
  loadAsset(doc, 'js', 'portfolio-refinements-v181-js', '/parity/refinements-v181.js')
  loadAsset(doc, 'css', 'portfolio-refinements-v182-css', '/parity/refinements-v182.css')
  loadAsset(doc, 'js', 'portfolio-refinements-v182-js', '/parity/refinements-v182.js')
  loadAsset(doc, 'css', 'portfolio-refinements-v183-css', '/parity/refinements-v183.css')
  loadAsset(doc, 'js', 'portfolio-refinements-v183-js', '/parity/refinements-v183.js')
  loadAsset(doc, 'css', 'portfolio-refinements-v184-css', '/parity/refinements-v184.css')
  loadAsset(doc, 'js', 'portfolio-refinements-v184-js', '/parity/refinements-v184.js')
  loadAsset(doc, 'css', 'portfolio-refinements-v185-css', '/parity/refinements-v185.css')
  loadAsset(doc, 'js', 'portfolio-refinements-v185-js', '/parity/refinements-v185.js')
  loadAsset(doc, 'css', 'portfolio-refinements-v188-css', '/parity/refinements-v188.css')
  loadAsset(doc, 'js', 'portfolio-refinements-v188-js', '/parity/refinements-v188.js')
}

export default function App() {
  return (
    <main className="prototype-shell">
      <iframe
        className="prototype-frame"
        src="/prototype-final.html"
        title="Portfólio profissional de Ana Paula de Lima Lysyk"
        onLoad={applyFinalHtmlPatches}
      />
    </main>
  )
}
