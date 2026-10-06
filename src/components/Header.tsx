import type { Language, Theme } from '../types'

type Props = {
  name: string
  role: string
  level: string
  theme: Theme
  language: Language
  onThemeChange: () => void
  onLanguageChange: (language: Language) => void
}

export function Header({ name, role, level, theme, language, onThemeChange, onLanguageChange }: Props) {
  const links = [
    ['sobre', 'Sobre'],
    ['competencias', 'Competências'],
    ['projetos', 'Projetos'],
    ['experiencia', 'Experiência'],
    ['contato', 'Contato'],
  ]

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#inicio">
          <img src="https://avatars.githubusercontent.com/u/215724828?v=4" alt="Ana Paula" />
          <span>
            <strong>{name}</strong>
            <small>{role.toUpperCase()} · {level.toUpperCase()}</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Navegação principal">
          {links.map(([id, label]) => <a key={id} href={'#' + id}>{label}</a>)}
        </nav>

        <div className="header-actions">
          <div className="language-picker" aria-label="Idioma">
            {(['pt', 'en', 'es'] as Language[]).map(item => (
              <button key={item} className={language === item ? 'active' : ''} onClick={() => onLanguageChange(item)}>
                {item.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="icon-button" onClick={onThemeChange} aria-label="Alternar tema">
            {theme === 'dark' ? '☼' : '☾'}
          </button>
        </div>
      </div>
    </header>
  )
}
