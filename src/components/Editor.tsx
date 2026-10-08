import { useState } from 'react'
import type { PortfolioData } from '../types'

type LoginProps = { open: boolean; onClose: () => void; onSuccess: () => void }

export function EditorLogin({ open, onClose, onSuccess }: LoginProps) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!open) return null

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (login === 'ana' && password === 'Ana123') {
      setError('')
      onSuccess()
      return
    }
    setError('Login ou senha inválidos.')
  }

  return (
    <div className="modal-backdrop">
      <section className="login-modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose}>×</button>
        <span className="eyebrow">PORTFOLIO EDITOR</span>
        <h2>Acesso de edição</h2>
        <p>Entre para abrir a área de edição do portfólio e do assistente.</p>
        <form onSubmit={submit}>
          <label>Login<input value={login} onChange={event => setLogin(event.target.value)} /></label>
          <label>Senha<input type="password" value={password} onChange={event => setPassword(event.target.value)} /></label>
          {error && <small className="error">{error}</small>}
          <button className="primary-button" type="submit">Desbloquear</button>
        </form>
      </section>
    </div>
  )
}

type PanelProps = {
  data: PortfolioData
  onCancel: () => void
  onSave: (data: PortfolioData) => void
}

export function EditorPanel({ data, onCancel, onSave }: PanelProps) {
  const [draft, setDraft] = useState<PortfolioData>(() => structuredClone(data))
  const changed = JSON.stringify(draft) !== JSON.stringify(data)

  return (
    <aside className="editor-panel">
      <header>
        <div className="editor-avatar">
          <img src="https://avatars.githubusercontent.com/u/215724828?v=4" alt="Ana Paula" />
          <button aria-label="Editar foto">✎</button>
        </div>
        <div>
          <small>ÁREA DA ANA</small>
          <strong>{draft.name}</strong>
          <p>Edite o portfólio e prepare o conteúdo que o assistente poderá usar.</p>
        </div>
      </header>

      <div className="editor-tabs">
        <button className="active">Conteúdo</button>
        <button>Aparência</button>
        <button>Assistente</button>
      </div>

      <div className="editor-body">
        <section>
          <span className="eyebrow">IDENTIDADE</span>
          <h3>Informações principais</h3>
          <label>Nome<input value={draft.name} onChange={event => setDraft(value => ({ ...value, name: event.target.value }))} /></label>
          <div className="editor-grid">
            <label>Área<input value={draft.role} onChange={event => setDraft(value => ({ ...value, role: event.target.value }))} /></label>
            <label>Nível<input value={draft.level} onChange={event => setDraft(value => ({ ...value, level: event.target.value }))} /></label>
          </div>
          <label>Localização<input value={draft.location} onChange={event => setDraft(value => ({ ...value, location: event.target.value }))} /></label>
          <label>E-mail<input value={draft.email} onChange={event => setDraft(value => ({ ...value, email: event.target.value }))} /></label>
        </section>

        <section>
          <span className="eyebrow">HOME</span>
          <h3>Apresentação</h3>
          <label>Título<textarea rows={3} value={draft.heroTitle} onChange={event => setDraft(value => ({ ...value, heroTitle: event.target.value }))} /></label>
          <label>Introdução<textarea rows={5} value={draft.heroIntro} onChange={event => setDraft(value => ({ ...value, heroIntro: event.target.value }))} /></label>
        </section>

        <section>
          <span className="eyebrow">ELEMENTOS DE LAYOUT</span>
          <h3>Adicionar ao portfólio</h3>
          <select defaultValue="">
            <option value="" disabled>Selecionar elemento…</option>
            <option>Seção</option>
            <option>Coluna</option>
            <option>Texto</option>
            <option>Card</option>
          </select>
          <small>O builder visual completo será migrado em uma etapa própria do front-end.</small>
        </section>
      </div>

      <footer>
        <button onClick={onCancel} aria-label="Cancelar edição">×</button>
        <span>{changed ? 'Alterações pendentes' : 'Sem alterações'}</span>
        <button className="save-button" onClick={() => onSave(draft)} disabled={!changed} aria-label="Salvar edição">✓</button>
      </footer>
    </aside>
  )
}
