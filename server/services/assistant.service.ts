import type {
  AssistantContext,
  AssistantMessageResponse,
  PortfolioDocument,
} from '../domain/types.js'

const normalize = (value: string) =>
  value
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const score = (question: string, context: AssistantContext) => {
  if (!context.enabled) return 0

  const q = normalize(question)
  const tokens = q.split(' ').filter((token) => token.length >= 3)
  const title = normalize(context.title)
  const category = normalize(context.category)
  const content = normalize(context.content)
  const keywords = context.keywords.map(normalize)

  let value = 0

  for (const keyword of keywords) {
    if (keyword && q.includes(keyword)) value += 8
  }

  for (const token of tokens) {
    if (title.includes(token)) value += 4
    if (category.includes(token)) value += 2.5
    if (content.includes(token)) value += 1.2
  }

  return value
}

const contextualAnswer = (
  message: string,
  portfolio: PortfolioDocument,
): string | null => {
  const ranked = portfolio.assistant.contexts
    .map((context) => ({ context, score: score(message, context) }))
    .filter((item) => item.score >= 2.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)

  if (!ranked.length) return null

  return ranked.map((item) => item.context.content).join(' ')
}

export const answerFromPortfolio = (
  message: string,
  portfolio: PortfolioDocument,
): AssistantMessageResponse => {
  const contextual = contextualAnswer(message, portfolio)

  if (contextual) {
    return {
      reply: contextual,
      source: 'portfolio',
    }
  }

  const normalized = normalize(message)

  if (/projet|github|repo/.test(normalized)) {
    const names = portfolio.projects.map((project) => project.name).join(', ')
    return {
      reply: `Hoje eu destaco principalmente estes projetos: ${names}. Posso explicar o objetivo de cada um e o que estou desenvolvendo neles.`,
      source: 'portfolio',
    }
  }

  if (/experi|trajet|trabalh|carreira/.test(normalized)) {
    return {
      reply:
        'Minha trajetória passa por suporte técnico, testes exploratórios e QA. Hoje atuo como QA Analyst Pleno, trabalhando com testes funcionais, API, integrações, investigação de falhas e automação.',
      source: 'portfolio',
    }
  }

  return {
    reply:
      portfolio.assistant.greeting ||
      'Oi! Posso contar sobre minha trajetória, automação, projetos, competências e experiência profissional.',
    source: 'portfolio',
  }
}
