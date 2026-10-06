export type Theme = 'dark' | 'light'
export type Language = 'pt' | 'en' | 'es'

export interface Profile {
  name: string
  role: string
  level: string
  location: string
  email: string
  github: string
  linkedin: string
  photoUrl?: string
}

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

export interface Appearance {
  theme: Theme
  language: Language
  accent: string
  pageStyle: 'current' | 'light' | 'direct'
  spacing: number
  footerText: string
}

export interface TextStyle {
  fontFamily?: string
  fontSize?: number
  fontWeight?: number
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  width?: string
  paddingInline?: string
}

export interface FreeElement {
  id: string
  section: string
  type: 'icon' | 'badge' | 'divider'
  icon?: string
  text?: string
  x?: number
  y?: number
  size?: number
  color?: string
  useSystemColor?: boolean
}

export interface EditorState {
  sectionLayouts: Record<string, string>
  textStyles: Record<string, TextStyle>
  freeElements: FreeElement[]
}

export interface AssistantConfig {
  greeting: string
  suggestions: string[]
}

export interface PortfolioDocument {
  profile: Profile
  hero: {
    title: string
    intro: string
  }
  about: {
    title: string
    body: string
  }
  skills: string[]
  projects: Project[]
  experience: ExperienceItem[]
  appearance: Appearance
  assistant: AssistantConfig
  editor: EditorState
}

export interface PortfolioSnapshot {
  revision: number
  updatedAt: string
  data: PortfolioDocument
}

export interface SavePortfolioRequest {
  expectedRevision: number
  data: PortfolioDocument
}

export interface AssistantMessageRequest {
  message: string
}

export interface AssistantMessageResponse {
  reply: string
  source: 'portfolio'
}
