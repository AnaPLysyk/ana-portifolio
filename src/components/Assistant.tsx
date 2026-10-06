import { useState } from 'react'

export function Assistant() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    'Oi. Eu sou o assistente da Ana. Posso contar sobre trajetória profissional, competências, projetos e contatos.',
  ])

  function send() {
    const value = message.trim()
    if (!value) return
    setMessages(current => [
      ...current,
      'Você: ' + value,
      'Assistente: nesta primeira versão React eu uso contexto local. A API do assistente entra na próxima etapa.',
    ])
    setMessage('')
  }

  if (open) {
    return (
      <section className="assistant-chat" aria-label="Chat do assistente">
        <header>
          <div className="robot-mini"><span>⌃</span><span>−</span></div>
          <div>
            <strong>Assistente</strong>
            <small>Trajetória, projetos e competências</small>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Fechar chat">×</button>
        </header>

        <div className="chat-body">
          {messages.map((item, index) => <p key={index}>{item}</p>)}
        </div>

        <div className="chat-shortcuts">
          {['Quem é a Ana?', 'Trajetória', 'Automação', 'Projetos'].map(item => (
            <button key={item} onClick={() => setMessage(item)}>{item}</button>
          ))}
        </div>

        <form className="chat-compose" onSubmit={event => { event.preventDefault(); send() }}>
          <input value={message} onChange={event => setMessage(event.target.value)} placeholder="Pergunte sobre experiência, projetos ou competências..." />
          <button type="submit" aria-label="Enviar">→</button>
        </form>
      </section>
    )
  }

  return (
    <div className="assistant-visual">
      <button className="robot-button" onClick={() => setOpen(true)} aria-label="Abrir assistente">
        <svg className="orbit-system" viewBox="0 0 520 360" aria-hidden="true">
          <ellipse className="orbit orbit-a" cx="260" cy="180" rx="190" ry="70" />
          <ellipse className="orbit orbit-b" cx="260" cy="180" rx="185" ry="72" transform="rotate(63 260 180)" />
          <ellipse className="orbit orbit-c" cx="260" cy="180" rx="185" ry="74" transform="rotate(-53 260 180)" />
        </svg>
        <span className="robot-core">
          <i className="robot-eye left">⌃</i>
          <i className="robot-eye right">−</i>
        </span>
      </button>
      <button className="assistant-callout" onClick={() => setOpen(true)}>Clique para conversar comigo.</button>
    </div>
  )
}
