export type Theme = 'dark' | 'light'
export type Language = 'pt' | 'en' | 'es'

export interface Project {
  id: string
  name: string
  description: string
  stack: string[]
  href: string
  status: string
}

export interface ExperienceItem {
  id: string
  period: string
  company: string
  role: string
  summary: string
  details: string
}

export interface PortfolioData {
  name: string
  role: string
  level: string
  location: string
  email: string
  github: string
  linkedin: string
  heroTitle: string
  heroIntro: string
  aboutTitle: string
  aboutBody: string
  skills: string[]
  projects: Project[]
  experience: ExperienceItem[]
}
