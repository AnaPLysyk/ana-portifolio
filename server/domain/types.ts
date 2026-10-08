export type Theme = 'dark' | 'light'
export type Language = 'pt' | 'en' | 'es'
export type PageFormat = 'balanced' | 'editorial' | 'panoramic'
export type SectionIconPosition = 'before' | 'after'
export type ElementType = 'icon' | 'badge' | 'divider' | 'layout'

export interface Profile {
  name: string
  area: string
  role: string
  level: string
  company: string
  cep: string
  address: string
  location: string
  email: string
  whatsapp: string
  github: string
  linkedin: string
  photoUrl?: string
}

export interface HeroContent {
  title: string
  intro: string
}

export interface AboutContent {
  title: string
  body: string
}

export interface CompetencyItem {
  id: string
  title: string
  description: string
  tags: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  stack: string[]
  href: string
  status: string
  visibility: 'public' | 'private'
  linked: boolean
}

export interface ExperienceItem {
  id: string
  period: string
  company: string
  role: string
  summary: string
  details: string
}

export interface EducationItem {
  id: string
  title: string
  institution: string
  status: string
  period?: string
  description?: string
  href?: string
}

export interface HighlightItem {
  id: string
  title: string
  description: string
  href?: string
  label?: string
}

export interface Appearance {
  theme: Theme
  language: Language
  accent: string
  intensity: number
  spacing: number
  pageFormat: PageFormat
  footerText: string
}

export interface SectionIconConfig {
  icon: string
  size: number
  position: SectionIconPosition
  system: boolean
  color: string
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
  type: ElementType
  icon?: string
  text?: string
  x?: number
  y?: number
  size?: number
  color?: string
  useSystemColor?: boolean
  layout?: string
}

export interface AssistantPosition {
  x: number
  y: number
}

export interface AssistantLayout {
  robot: AssistantPosition
  cta: AssistantPosition
}

export interface EditorState {
  sectionLayouts: Record<string, string>
  sectionIcons: Record<string, SectionIconConfig>
  textStyles: Record<string, TextStyle>
  freeElements: FreeElement[]
  assistantLayout: AssistantLayout
}

export interface AssistantContext {
  id: string
  title: string
  category: string
  keywords: string[]
  content: string
  enabled: boolean
}

export interface AssistantConfig {
  greeting: string
  suggestions: string[]
  contexts: AssistantContext[]
}

export interface PortfolioDocument {
  profile: Profile
  hero: HeroContent
  about: AboutContent
  competencies: CompetencyItem[]
  projects: Project[]
  experience: ExperienceItem[]
  education: EducationItem[]
  highlights: HighlightItem[]
  contentBlocks: Record<string, string>
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

export interface RevisionWrite<T> {
  expectedRevision: number
  data: T
}

export interface AssistantMessageRequest {
  message: string
}

export interface AssistantMessageResponse {
  reply: string
  source: 'portfolio'
}
