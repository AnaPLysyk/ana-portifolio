import type {
  AssistantMessageResponse,
  PortfolioDocument,
} from '../domain/types.js'

const includesAny = (value: string, terms: string[]) =>
  terms.some((term) => value.includes(term))

export const answerFromPortfolio = (
  message: string,
  portfolio: PortfolioDocument,
): AssistantMessageResponse => {
  const normalized = message.trim().toLocaleLowerCase('pt-BR')

  if (includesAny(normalized, ['automação', 'automacao', 'playwright', 'teste'])) {
    return {
      reply:
        'Na automação, estou aprofundando Playwright e TypeScript e também estudando o uso de agentes como apoio à análise e à manutenção dos testes.',
      source: 'portfolio',
    }
  }

  if (includesAny(normalized, ['projeto', 'github', 'repositório', 'repositorio'])) {
    const names = portfolio.projects.map((project) => project.name).join(', ')
    return {
      reply: `Hoje eu destaco principalmente estes projetos: ${names}. Posso explicar o objetivo de cada um e o que estou desenvolvendo neles.`,
      source: 'portfolio',
    }
  }

  if (includesAny(normalized, ['trajetória', 'trajetoria', 'experiência', 'experiencia'])) {
    return {
      reply:
        'Minha trajetória passa por suporte técnico, testes exploratórios e QA. Hoje atuo como QA Analyst Pleno, trabalhando com testes funcionais, API, integrações, investigação de falhas e automação.',
      source: 'portfolio',
    }
  }

  if (includesAny(normalized, ['quem é', 'quem e', 'ana', 'sobre você', 'sobre voce'])) {
    return {
      reply: portfolio.about.body,
      source: 'portfolio',
    }
  }

  return {
    reply:
      'Oi! Posso contar sobre minha trajetória, automação, projetos, competências e experiência profissional. O que você gostaria de saber?',
    source: 'portfolio',
  }
}
