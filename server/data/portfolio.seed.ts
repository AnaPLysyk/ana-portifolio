import type { PortfolioDocument } from '../domain/types.js'

export const portfolioSeed: PortfolioDocument = {
  profile: {
    name: 'Ana Paula de Lima Lysyk',
    role: 'QA Analyst',
    level: 'Pleno',
    location: 'Rio Grande do Sul · Brasil',
    email: 'lysykana@gmail.com',
    github: 'https://github.com/AnaPLysyk',
    linkedin: 'https://www.linkedin.com/in/ana-lysik',
  },
  hero: {
    title: 'Aqui eu mostro como trabalho com qualidade de software.',
    intro:
      'Você vai encontrar minhas competências, projetos no GitHub, experiência profissional e formação. Nos projetos e na minha trajetória, mostro o que faço no dia a dia e o que ainda estou desenvolvendo — principalmente em automação.',
  },
  about: {
    title: 'Eu gosto de entender como as coisas funcionam.',
    body:
      'Sou uma QA analítica, curiosa e investigativa. Gosto de cruzar informações, entender o contexto e chegar à causa antes de concluir. Já trabalhei com planejamento, documentação, execução e evidências de teste e sigo aprofundando automação e agentes aplicados ao QA.',
  },
  skills: [
    'Playwright',
    'TypeScript',
    'Node.js',
    'Postman',
    'REST/JSON',
    'Qase',
    'Git/GitHub',
    'SQL/MySQL',
    'SonarCloud',
    'Keycloak',
  ],
  projects: [
    {
      id: 'qa-orchestrator',
      name: 'QA-Orchestrator',
      description:
        'Projeto para organizar contexto, execução e evidências entre diferentes fluxos de QA.',
      stack: ['TypeScript', 'Node.js', 'Playwright'],
      href: 'https://github.com/AnaPLysyk',
      status: 'em desenvolvimento',
    },
    {
      id: 'playwright-agents',
      name: 'Playwright + agentes',
      description:
        'Estudo prático de automação e uso de agentes como apoio à análise e manutenção dos testes.',
      stack: ['Playwright', 'TypeScript', 'AI'],
      href: 'https://github.com/AnaPLysyk',
      status: 'estudo',
    },
  ],
  experience: [
    {
      id: 'testing-company',
      period: 'jan 2025 — atual',
      company: 'Testing Company',
      role: 'QA Analyst Pleno',
      summary: 'Testes manuais, automação, API, integrações e investigação de falhas.',
      details:
        'Atuação em diferentes projetos e produtos, passando por documentação, validação funcional, regressão, API, banco, integrações, logs e automação com Playwright e TypeScript.',
    },
    {
      id: 'freelance',
      period: 'nov — dez 2024',
      company: 'Utest · remoto',
      role: 'Tester Manual · Freelance',
      summary: 'Exploração, usabilidade e reporte de bugs.',
      details:
        'Execução de testes exploratórios com foco em comportamento, usabilidade e evidências claras para reprodução.',
    },
    {
      id: 'support',
      period: 'ago — dez 2024',
      company: 'Ahove Tecnologia',
      role: 'Suporte técnico',
      summary: 'Atendimento, implantação, testes e reporte de problemas.',
      details:
        'Contato direto com usuários e análise de problemas, base importante para a evolução para QA.',
    },
  ],
  appearance: {
    theme: 'dark',
    language: 'pt',
    accent: '#9cff57',
    pageStyle: 'current',
    spacing: 50,
    footerText: 'Ana Paula de Lima Lysyk · QA Analyst · Pleno · portfólio profissional',
  },
  assistant: {
    greeting: 'Oi, tudo bem? Eu sou a Ana. O que você gostaria de saber sobre meu trabalho?',
    suggestions: ['Quem é a Ana?', 'Trajetória', 'Automação', 'Projetos'],
  },
  editor: {
    sectionLayouts: {},
    textStyles: {},
    freeElements: [],
  },
}
