import type { PortfolioDocument } from '../domain/types.js'

export const portfolioSeed: PortfolioDocument = {
  profile: {
    name: 'Ana Paula de Lima Lysyk',
    area: 'Qualidade de Software',
    role: 'QA Analyst',
    level: 'Pleno',
    company: 'Sem empresa atual',
    cep: '93320-500',
    address: 'Rua Lopes Trovão · Industrial · Novo Hamburgo - RS',
    location: 'Novo Hamburgo · RS · Brasil',
    email: 'lysykana@gmail.com',
    whatsapp: '+55 (51) 99991-7265',
    github: 'https://github.com/AnaPLysyk',
    linkedin: 'https://www.linkedin.com/in/ana-lysik',
  },
  hero: {
    title: 'Aqui eu mostro como trabalho com qualidade de software.',
    intro:
      'Você vai encontrar minhas competências, projetos no GitHub, experiência profissional e formação. Nos projetos e na minha trajetória, mostro o que faço no dia a dia, as ferramentas que uso e o que ainda estou desenvolvendo — principalmente em automação.',
  },
  about: {
    title: 'Eu gosto de entender como as coisas funcionam.',
    body:
      'Sou uma QA analítica, curiosa e investigativa. Gosto de cruzar informações, entender o contexto e chegar à causa antes de concluir. Já trabalhei com planejamento, documentação, execução e evidências de teste. Hoje sigo construindo minha prática em automação e explorando agentes aplicados ao QA.',
  },
  competencies: [
    {
      id: 'produto-testes',
      title: 'Produto de testes',
      description:
        'Requisitos e critérios de aceite · planejamento de cenários · testes funcionais e exploratórios · regressão · evidências.',
      tags: ['requisitos', 'cenários', 'regressão', 'evidências'],
    },
    {
      id: 'automacao',
      title: 'Automação',
      description:
        'Playwright, TypeScript e evolução de fluxos E2E com manutenção orientada a risco.',
      tags: ['Playwright', 'TypeScript', 'E2E'],
    },
    {
      id: 'api-integracoes',
      title: 'API e integrações',
      description:
        'REST/JSON, Postman, payloads, contratos e validação entre serviços.',
      tags: ['REST', 'JSON', 'Postman', 'integrações'],
    },
    {
      id: 'investigacao',
      title: 'Investigação',
      description:
        'Logs, banco, comportamento e rastreamento da origem das falhas.',
      tags: ['logs', 'SQL', 'análise'],
    },
  ],
  projects: [
    {
      id: 'quality-control',
      name: 'Quality Control',
      description: 'Produto autoral.',
      stack: [],
      href: 'https://github.com/AnaPLysyk',
      status: 'GitHub vinculado',
      visibility: 'public',
      linked: true,
    },
    {
      id: 'smart',
      name: 'SMART',
      description: 'Automação de produto.',
      stack: ['Playwright', 'TypeScript'],
      href: 'https://github.com/AnaPLysyk',
      status: 'privado',
      visibility: 'private',
      linked: false,
    },
    {
      id: 'qa-orchestrator',
      name: 'Orquestrador QA',
      description: 'Engenharia de QA.',
      stack: ['TypeScript', 'Node.js', 'Playwright'],
      href: 'https://github.com/AnaPLysyk',
      status: 'privado',
      visibility: 'private',
      linked: false,
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
  education: [
    {
      id: 'ciencia-computacao',
      title: 'Ciência da Computação',
      institution: 'Formação em andamento',
      status: 'Cursando',
    },
    {
      id: 'agile-desmistificado',
      title: 'Agile Desmistificado — Scrum, XP e Kanban',
      institution: 'Udemy',
      status: 'Curso',
    },
    {
      id: 'algoritmo-logica',
      title: 'Algoritmo e Lógica de Programação',
      institution: 'Udemy',
      status: 'Curso',
    },
  ],
  highlights: [
    {
      id: 'arena-tc',
      title: 'Arena TC · comunicação técnica',
      description:
        'Apresentei “Do corpo negro ao computador quântico”, conectando física, tecnologia e computação de forma acessível.',
      label: 'Comunicação',
    },
    {
      id: 'tc-awards-2025',
      title: 'TC Awards 2025 · 1º lugar em equipe',
      description:
        'Testing Courses — plataforma gamificada de formação em QA, projeto vencedor do TC Awards e posteriormente adquirido pela Testing Company.',
      label: 'Reconhecimento',
    },
  ],
  contentBlocks: {},
  appearance: {
    theme: 'dark',
    language: 'pt',
    accent: '#9cff57',
    intensity: 72,
    spacing: 76,
    pageFormat: 'balanced',
    footerText:
      'Ana Paula de Lima Lysyk · QA Analyst · Pleno · portfólio profissional',
  },
  assistant: {
    greeting:
      'Oi, tudo bem? Eu sou a Ana. O que você gostaria de saber sobre meu trabalho?',
    suggestions: ['Quem é a Ana?', 'Trajetória', 'Automação', 'Projetos'],
    contexts: [
      {
        id: 'perfil',
        title: 'Quem é a Ana',
        category: 'perfil',
        keywords: ['ana', 'perfil', 'qa', 'quem é'],
        content:
          'Eu sou QA Analyst Pleno e trabalho com qualidade de software, testes, investigação e automação.',
        enabled: true,
      },
      {
        id: 'automacao',
        title: 'Automação',
        category: 'automação',
        keywords: ['automação', 'playwright', 'typescript', 'e2e'],
        content:
          'Na automação, estou aprofundando Playwright e TypeScript e estudando agentes como apoio à análise e manutenção dos testes.',
        enabled: true,
      },
      {
        id: 'api',
        title: 'API e integrações',
        category: 'API e integrações',
        keywords: ['api', 'postman', 'rest', 'json', 'integração'],
        content:
          'Em API e integrações, trabalho com REST/JSON, payloads, contratos, Postman e validação entre serviços.',
        enabled: true,
      },
      {
        id: 'formacao',
        title: 'Formação e cursos',
        category: 'formação',
        keywords: ['formação', 'curso', 'faculdade', 'udemy'],
        content:
          'Estou cursando Ciência da Computação e sigo complementando a formação com cursos técnicos e de desenvolvimento.',
        enabled: true,
      },
    ],
  },
  editor: {
    sectionLayouts: {
      sobre: 'flow',
      competencias: 'grid',
      projetos: 'list',
      experiencia: 'timeline',
      contato: 'default',
    },
    sectionIcons: {
      sobre: {
        icon: 'none',
        size: 28,
        position: 'before',
        system: true,
        color: '#6ea8ff',
      },
      competencias: {
        icon: 'check',
        size: 28,
        position: 'before',
        system: true,
        color: '#6ea8ff',
      },
      projetos: {
        icon: 'github',
        size: 34,
        position: 'before',
        system: true,
        color: '#6ea8ff',
      },
      experiencia: {
        icon: 'timeline',
        size: 30,
        position: 'before',
        system: true,
        color: '#6ea8ff',
      },
      contato: {
        icon: 'mail',
        size: 28,
        position: 'before',
        system: true,
        color: '#6ea8ff',
      },
    },
    textStyles: {},
    freeElements: [],
    assistantLayout: {
      robot: { x: 50, y: 41 },
      cta: { x: 78, y: 28 },
    },
  },
}
