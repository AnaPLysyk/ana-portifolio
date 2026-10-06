import { useEffect, useState } from 'react'
import { Assistant } from './components/Assistant'
import { EditorLogin, EditorPanel } from './components/Editor'
import { Header } from './components/Header'
import { portfolio as initialPortfolio } from './data/portfolio'
import type { Language, PortfolioData, Theme } from './types'

const STORAGE_KEY = 'ana-portfolio:v1'

function loadPortfolio(): PortfolioData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? { ...initialPortfolio, ...JSON.parse(raw) } : initialPortfolio
  } catch {
    return initialPortfolio
  }
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [language, setLanguage] = useState<Language>('pt')
  const [portfolio, setPortfolio] = useState<PortfolioData>(loadPortfolio)
  const [loginOpen, setLoginOpen] = useState(false)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function save(data: PortfolioData) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setPortfolio(data)
    setEditing(false)
  }

  return (
    <>
      <Header
        name={portfolio.name}
        role={portfolio.role}
        level={portfolio.level}
        theme={theme}
        language={language}
        onThemeChange={() => setTheme(value => value === 'dark' ? 'light' : 'dark')}
        onLanguageChange={setLanguage}
      />

      <main>
        <section className="hero section-shell" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow">PORTFÓLIO DE QA</span>
            <p className="hello">Oi, eu sou Ana.</p>
            <h1>{portfolio.heroTitle}</h1>
            <div className="hero-intro"><p>{portfolio.heroIntro}</p></div>
            <div className="hero-links">
              <a href={portfolio.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={portfolio.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <span>{portfolio.location}</span>
            </div>
          </div>
          <Assistant />
        </section>

        <section className="content-section" id="sobre">
          <div className="section-shell about-grid">
            <div><span className="eyebrow">SOBRE MIM</span><h2>{portfolio.aboutTitle}</h2></div>
            <p className="section-lead">{portfolio.aboutBody}</p>
          </div>
        </section>

        <section className="content-section" id="competencias">
          <div className="section-shell">
            <span className="eyebrow">COMPETÊNCIAS</span>
            <h2>Ferramentas no meu fluxo.</h2>
            <div className="skills-grid">{portfolio.skills.map(skill => <div className="skill" key={skill}>{skill}</div>)}</div>
          </div>
        </section>

        <section className="content-section" id="projetos">
          <div className="section-shell">
            <span className="eyebrow">CONSTRUINDO AGORA</span>
            <h2>Projetos que mostram como eu penso QA.</h2>
            <div className="project-grid">
              {portfolio.projects.map(project => (
                <article className="project-card" key={project.id}>
                  <div className="project-meta"><span>{project.status}</span><a href={project.href} target="_blank" rel="noreferrer">GitHub ↗</a></div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="tag-list">{project.stack.map(item => <span key={item}>{item}</span>)}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section" id="experiencia">
          <div className="section-shell">
            <span className="eyebrow">EXPERIÊNCIA</span>
            <h2>Trajetória profissional.</h2>
            <div className="timeline">
              {portfolio.experience.map((item, index) => (
                <details key={item.id} open={index === 0}>
                  <summary>
                    <span>{item.period}</span>
                    <div><small>{item.company}</small><strong>{item.role}</strong><p>{item.summary}</p></div>
                    <b>+</b>
                  </summary>
                  <div className="timeline-detail">{item.details}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section" id="contato">
          <div className="section-shell contact-grid">
            <div><span className="eyebrow">CONTATO</span><h2>Vamos conversar sobre qualidade.</h2><p>Se quiser falar sobre QA, automação, projetos ou oportunidades, estes são os melhores caminhos.</p></div>
            <div className="contact-links">
              <a href={'mailto:' + portfolio.email}>{portfolio.email}</a>
              <a href={portfolio.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href={portfolio.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </div>
        </section>
      </main>

      <button className={'portfolio-lock ' + (editing ? 'unlocked' : '')} onClick={() => editing ? setEditing(false) : setLoginOpen(true)} aria-label="Abrir edição">
        {editing ? '◉' : '○'}
      </button>

      <EditorLogin open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={() => { setLoginOpen(false); setEditing(true) }} />
      {editing && <EditorPanel data={portfolio} onCancel={() => setEditing(false)} onSave={save} />}
    </>
  )
}
