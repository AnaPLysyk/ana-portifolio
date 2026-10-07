import type { FastifyInstance } from 'fastify'
import { writeBody } from './openapi.docs.js'

// Exemplos fictícios, reutilizados nos schemas e nas rotas.
export const examples = {
  profile: {
    name: 'Maria Exemplo',
    area: 'Qualidade de Software',
    role: 'QA Analyst',
    level: 'Pleno',
    company: 'Empresa Exemplo',
    cep: '00000-000',
    address: 'Rua Exemplo, 123',
    location: 'São Paulo, SP',
    email: 'maria@exemplo.com',
    whatsapp: '+55 11 90000-0000',
    github: 'https://github.com/exemplo',
    linkedin: 'https://www.linkedin.com/in/exemplo',
  },
  hero: {
    title: 'Qualidade de software com método e curiosidade',
    intro: 'Sou QA e ajudo times a entregar produtos confiáveis.',
  },
  about: {
    title: 'Sobre mim',
    body: 'Trabalho com testes funcionais, automação e análise de falhas.',
  },
  competency: {
    id: 'automacao-testes',
    title: 'Automação de testes',
    description: 'Criação de testes automatizados para web e API.',
    tags: ['Playwright', 'TypeScript'],
  },
  project: {
    id: 'projeto-exemplo',
    name: 'Projeto Exemplo',
    description: 'Aplicação de demonstração com testes automatizados.',
    stack: ['React', 'TypeScript', 'Fastify'],
    href: 'https://github.com/exemplo/projeto-exemplo',
    status: 'Em andamento',
    visibility: 'public',
    linked: true,
  },
  experience: {
    id: 'empresa-exemplo',
    period: '2024 — 2025',
    company: 'Empresa Exemplo',
    role: 'QA Analyst',
    summary: 'Atuação com testes funcionais e automação.',
    details:
      'Execução de testes, análise de falhas e automação com Playwright.',
  },
  education: {
    id: 'curso-exemplo',
    title: 'Curso de Teste de Software',
    institution: 'Instituição Exemplo',
    status: 'Concluído',
    period: '2023',
    description: 'Fundamentos de testes, técnicas e boas práticas.',
    href: 'https://exemplo.com/curso',
  },
  highlight: {
    id: 'destaque-exemplo',
    title: 'Redução de falhas em produção',
    description: 'Testes automatizados reduziram erros após cada entrega.',
    href: 'https://exemplo.com/case',
    label: 'Ver case',
  },
  appearance: {
    theme: 'dark',
    language: 'pt',
    accent: '#7C3AED',
    intensity: 60,
    spacing: 50,
    pageFormat: 'balanced',
    footerText: '© 2025 Maria Exemplo',
  },
  sectionIcon: {
    icon: 'briefcase',
    size: 24,
    position: 'before',
    system: true,
    color: '#7C3AED',
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    textAlign: 'left',
  },
  freeElement: {
    id: 'badge-1',
    section: 'hero',
    type: 'badge',
    text: 'Disponível',
    x: 10,
    y: 20,
    size: 16,
    useSystemColor: true,
  },
  assistantContext: {
    id: 'contato',
    title: 'Como entrar em contato',
    category: 'Contato',
    keywords: ['contato', 'email'],
    content: 'O contato pode ser feito pelo e-mail ou LinkedIn do portfólio.',
    enabled: true,
  },
  assistant: {
    greeting: 'Olá! Pergunte sobre projetos, experiência ou contato.',
    suggestions: ['Quais são os projetos?', 'Como entrar em contato?'],
    contexts: [
      {
        id: 'contato',
        title: 'Como entrar em contato',
        category: 'Contato',
        keywords: ['contato', 'email'],
        content: 'O contato pode ser feito pelo e-mail ou LinkedIn do portfólio.',
        enabled: true,
      },
    ],
  },
  assistantLayout: { robot: { x: 85, y: 80 }, cta: { x: 70, y: 85 } },
  sectionLayouts: { hero: 'balanced', about: 'editorial' },
  contentBlocks: { 'hero.cta': 'Fale comigo', 'footer.note': 'Obrigada pela visita!' },
}

const id = (what: string) => ({
  type: 'string',
  minLength: 1,
  maxLength: 100,
  description: `Identificador único d${what}, em texto simples (ex.: "empresa-exemplo"). Não pode repetir.`,
  examples: ['exemplo-1'],
})

const text = (description: string, example: string, max: number, min = 1) => ({
  type: 'string',
  ...(min ? { minLength: min } : {}),
  maxLength: max,
  description,
  examples: [example],
})

const list = (description: string, example: string[], maxItems = 50) => ({
  type: 'array',
  maxItems,
  description,
  items: { type: 'string', minLength: 1, maxLength: 80 },
  examples: [example],
})

const revisionWrite = (data: object, example: unknown) =>
  writeBody(data, example, 'Corpo de escrita: versão atual + os dados novos.')

export const registerOpenApiSchemas = (app: FastifyInstance) => {
  app.addSchema({
    $id: 'ErrorResponse',
    type: 'object',
    description: 'Formato padrão de erro da API.',
    required: ['code', 'message'],
    properties: {
      code: { type: 'string', description: 'Código do erro.' },
      message: { type: 'string', description: 'Explicação do erro.' },
      details: {
        type: 'object',
        additionalProperties: true,
        description: 'Informações extras (opcional).',
      },
    },
  })

  app.addSchema({
    $id: 'Profile',
    type: 'object',
    description: 'Identidade e contatos exibidos no portfólio.',
    required: [
      'name',
      'area',
      'role',
      'level',
      'company',
      'cep',
      'address',
      'location',
      'email',
      'whatsapp',
      'github',
      'linkedin',
    ],
    additionalProperties: false,
    properties: {
      name: text('Nome completo.', 'Maria Exemplo', 120),
      area: text('Área de atuação.', 'Qualidade de Software', 100),
      role: text('Cargo ou função.', 'QA Analyst', 80),
      level: text('Nível de senioridade.', 'Pleno', 40),
      company: text('Empresa atual (pode ficar vazio).', 'Empresa Exemplo', 120, 0),
      cep: text('CEP (pode ficar vazio).', '00000-000', 20, 0),
      address: text('Endereço (pode ficar vazio).', 'Rua Exemplo, 123', 240, 0),
      location: text('Cidade e estado.', 'São Paulo, SP', 160),
      email: {
        type: 'string',
        format: 'email',
        description: 'E-mail de contato.',
        examples: ['maria@exemplo.com'],
      },
      whatsapp: text('WhatsApp com DDD (pode ficar vazio).', '+55 11 90000-0000', 40, 0),
      github: {
        type: 'string',
        format: 'uri',
        description: 'Link completo do GitHub.',
        examples: ['https://github.com/exemplo'],
      },
      linkedin: {
        type: 'string',
        format: 'uri',
        description: 'Link completo do LinkedIn.',
        examples: ['https://www.linkedin.com/in/exemplo'],
      },
      photoUrl: {
        type: 'string',
        maxLength: 3000000,
        description:
          'Foto (opcional): URL pública ou data URL de imagem. Para trocar só a foto, use PUT /api/v1/profile/photo.',
        examples: ['https://exemplo.com/foto.jpg'],
      },
    },
    examples: [examples.profile],
  })

  app.addSchema({
    $id: 'HeroContent',
    type: 'object',
    description: 'Texto principal da Home.',
    required: ['title', 'intro'],
    additionalProperties: false,
    properties: {
      title: text('Título da Home.', examples.hero.title, 300),
      intro: text('Texto de apresentação.', examples.hero.intro, 3000),
    },
    examples: [examples.hero],
  })

  app.addSchema({
    $id: 'AboutContent',
    type: 'object',
    description: 'Texto da seção Sobre.',
    required: ['title', 'body'],
    additionalProperties: false,
    properties: {
      title: text('Título da seção.', examples.about.title, 300),
      body: text('Texto completo da seção.', examples.about.body, 5000),
    },
    examples: [examples.about],
  })

  app.addSchema({
    $id: 'CompetencyItem',
    type: 'object',
    description: 'Uma competência (habilidade) do portfólio.',
    required: ['id', 'title', 'description', 'tags'],
    additionalProperties: false,
    properties: {
      id: id('a competência'),
      title: text('Nome da competência.', 'Automação de testes', 160),
      description: text(
        'Explicação curta da competência.',
        examples.competency.description,
        2000,
      ),
      tags: list('Palavras-chave ligadas à competência.', ['Playwright', 'TypeScript']),
    },
    examples: [examples.competency],
  })

  app.addSchema({
    $id: 'Project',
    type: 'object',
    description: 'Um projeto exibido no portfólio.',
    required: [
      'id',
      'name',
      'description',
      'stack',
      'href',
      'status',
      'visibility',
      'linked',
    ],
    additionalProperties: false,
    properties: {
      id: id('o projeto'),
      name: text('Nome do projeto.', 'Projeto Exemplo', 160),
      description: text('O que o projeto faz.', examples.project.description, 3000),
      stack: list('Tecnologias usadas.', ['React', 'TypeScript', 'Fastify']),
      href: {
        type: 'string',
        format: 'uri',
        description: 'Link do projeto (repositório ou site).',
        examples: ['https://github.com/exemplo/projeto-exemplo'],
      },
      status: text('Situação do projeto.', 'Em andamento', 80),
      visibility: {
        type: 'string',
        enum: ['public', 'private'],
        description: '`public` aparece para todos; `private` fica restrito.',
        examples: ['public'],
      },
      linked: {
        type: 'boolean',
        description: '`true` se o projeto tem link clicável.',
        examples: [true],
      },
    },
    examples: [examples.project],
  })

  app.addSchema({
    $id: 'ExperienceItem',
    type: 'object',
    description: 'Um item da trajetória profissional.',
    required: ['id', 'period', 'company', 'role', 'summary', 'details'],
    additionalProperties: false,
    properties: {
      id: id('a experiência'),
      period: text('Período em texto livre.', '2024 — 2025', 120),
      company: text('Nome da empresa.', 'Empresa Exemplo', 160),
      role: text('Cargo exercido.', 'QA Analyst', 160),
      summary: text('Resumo em uma frase.', examples.experience.summary, 1600),
      details: text('Detalhes do que foi feito.', examples.experience.details, 5000),
    },
    examples: [examples.experience],
  })

  app.addSchema({
    $id: 'EducationItem',
    type: 'object',
    description: 'Um curso ou formação.',
    required: ['id', 'title', 'institution', 'status'],
    additionalProperties: false,
    properties: {
      id: id('a formação'),
      title: text('Nome do curso ou formação.', examples.education.title, 200),
      institution: text('Instituição de ensino.', 'Instituição Exemplo', 160),
      status: text('Situação.', 'Concluído', 80),
      period: text('Período (opcional).', '2023', 120, 0),
      description: text('Descrição (opcional).', examples.education.description, 3000, 0),
      href: {
        type: 'string',
        format: 'uri',
        description: 'Link do curso ou certificado (opcional).',
        examples: ['https://exemplo.com/curso'],
      },
    },
    examples: [examples.education],
  })

  app.addSchema({
    $id: 'HighlightItem',
    type: 'object',
    description: 'Um destaque ou conquista.',
    required: ['id', 'title', 'description'],
    additionalProperties: false,
    properties: {
      id: id('o destaque'),
      title: text('Título do destaque.', examples.highlight.title, 200),
      description: text('Explicação do destaque.', examples.highlight.description, 3000),
      href: {
        type: 'string',
        format: 'uri',
        description: 'Link relacionado (opcional).',
        examples: ['https://exemplo.com/case'],
      },
      label: text('Texto do botão do link (opcional).', 'Ver case', 100, 0),
    },
    examples: [examples.highlight],
  })

  app.addSchema({
    $id: 'Appearance',
    type: 'object',
    description: 'Aparência geral do portfólio.',
    required: [
      'theme',
      'language',
      'accent',
      'intensity',
      'spacing',
      'pageFormat',
      'footerText',
    ],
    additionalProperties: false,
    properties: {
      theme: {
        type: 'string',
        enum: ['dark', 'light'],
        description: 'Tema: `dark` (escuro) ou `light` (claro).',
        examples: ['dark'],
      },
      language: {
        type: 'string',
        enum: ['pt', 'en', 'es'],
        description: 'Idioma: `pt`, `en` ou `es`.',
        examples: ['pt'],
      },
      accent: {
        type: 'string',
        pattern: '^#[0-9A-Fa-f]{6}$',
        description: 'Cor de destaque em hexadecimal, com 6 dígitos.',
        examples: ['#7C3AED'],
      },
      intensity: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        description: 'Intensidade dos efeitos visuais (0 a 100).',
        examples: [60],
      },
      spacing: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        description: 'Espaçamento entre elementos (0 a 100).',
        examples: [50],
      },
      pageFormat: {
        type: 'string',
        enum: ['balanced', 'editorial', 'panoramic'],
        description: 'Formato da página: `balanced`, `editorial` ou `panoramic`.',
        examples: ['balanced'],
      },
      footerText: text('Texto do rodapé (pode ficar vazio).', '© 2025 Maria Exemplo', 500, 0),
    },
    examples: [examples.appearance],
  })

  app.addSchema({
    $id: 'SectionIconConfig',
    type: 'object',
    description: 'Ícone de uma seção.',
    required: ['icon', 'size', 'position', 'system', 'color'],
    additionalProperties: false,
    properties: {
      icon: text('Nome do ícone.', 'briefcase', 100),
      size: {
        type: 'number',
        minimum: 8,
        maximum: 256,
        description: 'Tamanho em pixels (8 a 256).',
        examples: [24],
      },
      position: {
        type: 'string',
        enum: ['before', 'after'],
        description: 'Posição em relação ao título: `before` (antes) ou `after` (depois).',
        examples: ['before'],
      },
      system: {
        type: 'boolean',
        description: '`true` usa a cor do sistema; `false` usa a cor do campo `color`.',
        examples: [true],
      },
      color: text('Cor do ícone (ex.: "#7C3AED").', '#7C3AED', 40, 0),
    },
    examples: [examples.sectionIcon],
  })

  app.addSchema({
    $id: 'TextStyle',
    type: 'object',
    description: 'Estilo de um texto. Todos os campos são opcionais.',
    additionalProperties: false,
    properties: {
      fontFamily: text('Fonte.', 'Inter, sans-serif', 200, 0),
      fontSize: {
        type: 'number',
        minimum: 8,
        maximum: 160,
        description: 'Tamanho da fonte em pixels (8 a 160).',
        examples: [18],
      },
      fontWeight: {
        type: 'number',
        minimum: 100,
        maximum: 900,
        description: 'Peso da fonte (100 a 900). 400 = normal, 700 = negrito.',
        examples: [600],
      },
      color: text('Cor do texto.', '#FFFFFF', 40, 0),
      textAlign: {
        type: 'string',
        enum: ['left', 'center', 'right'],
        description: 'Alinhamento: `left`, `center` ou `right`.',
        examples: ['left'],
      },
      width: text('Largura (ex.: "80%").', '80%', 30, 0),
      paddingInline: text('Margem interna lateral (ex.: "16px").', '16px', 30, 0),
    },
    examples: [examples.textStyle],
  })

  app.addSchema({
    $id: 'FreeElement',
    type: 'object',
    description: 'Elemento livre posicionado na página.',
    required: ['id', 'section', 'type'],
    additionalProperties: false,
    properties: {
      id: id('o elemento'),
      section: text('Seção onde o elemento aparece.', 'hero', 100),
      type: {
        type: 'string',
        enum: ['icon', 'badge', 'divider', 'layout'],
        description: 'Tipo: `icon`, `badge`, `divider` ou `layout`.',
        examples: ['badge'],
      },
      icon: text('Nome do ícone (para `icon`).', 'star', 100, 0),
      text: text('Texto exibido (para `badge`).', 'Disponível', 500, 0),
      x: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        description: 'Posição horizontal em % (0 a 100).',
        examples: [10],
      },
      y: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        description: 'Posição vertical em % (0 a 100).',
        examples: [20],
      },
      size: {
        type: 'number',
        minimum: 8,
        maximum: 256,
        description: 'Tamanho em pixels (8 a 256).',
        examples: [16],
      },
      color: text('Cor do elemento.', '#7C3AED', 40, 0),
      useSystemColor: {
        type: 'boolean',
        description: '`true` usa a cor de destaque do portfólio.',
        examples: [true],
      },
      layout: text('Nome do layout (para `layout`).', 'balanced', 100, 0),
    },
    examples: [examples.freeElement],
  })

  app.addSchema({
    $id: 'AssistantContext',
    type: 'object',
    description: 'Um assunto que o assistente sabe responder.',
    required: ['id', 'title', 'category', 'keywords', 'content', 'enabled'],
    additionalProperties: false,
    properties: {
      id: id('o contexto'),
      title: text('Título do assunto.', 'Como entrar em contato', 160),
      category: text('Categoria.', 'Contato', 100),
      keywords: list('Palavras que ativam este assunto.', ['contato', 'email']),
      content: text('Texto usado na resposta.', examples.assistantContext.content, 5000),
      enabled: {
        type: 'boolean',
        description: '`true` = o assistente usa este assunto.',
        examples: [true],
      },
    },
    examples: [examples.assistantContext],
  })

  app.addSchema({
    $id: 'AssistantConfig',
    type: 'object',
    description: 'Configuração do assistente do portfólio.',
    required: ['greeting', 'suggestions', 'contexts'],
    additionalProperties: false,
    properties: {
      greeting: text('Mensagem de boas-vindas.', examples.assistant.greeting, 1200),
      suggestions: {
        type: 'array',
        maxItems: 20,
        description: 'Perguntas sugeridas ao visitante.',
        items: { type: 'string', minLength: 1, maxLength: 120 },
        examples: [examples.assistant.suggestions],
      },
      contexts: {
        type: 'array',
        maxItems: 100,
        description: 'Assuntos que o assistente conhece.',
        items: { $ref: 'AssistantContext#' },
      },
    },
    examples: [examples.assistant],
  })

  app.addSchema({
    $id: 'Position',
    type: 'object',
    description: 'Posição na tela, em porcentagem.',
    required: ['x', 'y'],
    additionalProperties: false,
    properties: {
      x: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        description: 'Horizontal (0 a 100).',
        examples: [85],
      },
      y: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        description: 'Vertical (0 a 100).',
        examples: [80],
      },
    },
  })

  app.addSchema({
    $id: 'EditorState',
    type: 'object',
    description: 'Estado visual do editor (layouts, ícones, estilos e elementos).',
    required: [
      'sectionLayouts',
      'sectionIcons',
      'textStyles',
      'freeElements',
      'assistantLayout',
    ],
    additionalProperties: false,
    properties: {
      sectionLayouts: {
        type: 'object',
        description: 'Layout de cada seção. Chave = nome da seção.',
        additionalProperties: { type: 'string', maxLength: 100 },
        examples: [examples.sectionLayouts],
      },
      sectionIcons: {
        type: 'object',
        description: 'Ícone de cada seção. Chave = nome da seção.',
        additionalProperties: { $ref: 'SectionIconConfig#' },
      },
      textStyles: {
        type: 'object',
        description: 'Estilo de cada texto editável. Chave = nome do texto.',
        additionalProperties: { $ref: 'TextStyle#' },
      },
      freeElements: {
        type: 'array',
        maxItems: 500,
        description: 'Elementos livres da página.',
        items: { $ref: 'FreeElement#' },
      },
      assistantLayout: {
        type: 'object',
        description: 'Posição do robô e do botão de chamada (CTA).',
        required: ['robot', 'cta'],
        additionalProperties: false,
        properties: {
          robot: { $ref: 'Position#' },
          cta: { $ref: 'Position#' },
        },
      },
    },
    examples: [
      {
        sectionLayouts: examples.sectionLayouts,
        sectionIcons: { experience: examples.sectionIcon },
        textStyles: { 'hero.title': examples.textStyle },
        freeElements: [examples.freeElement],
        assistantLayout: examples.assistantLayout,
      },
    ],
  })

  app.addSchema({
    $id: 'PortfolioDocument',
    type: 'object',
    description:
      'Portfólio completo. Cada bloco tem endpoint próprio; veja os schemas de cada um.',
    required: [
      'profile',
      'hero',
      'about',
      'competencies',
      'projects',
      'experience',
      'education',
      'highlights',
      'contentBlocks',
      'appearance',
      'assistant',
      'editor',
    ],
    additionalProperties: false,
    properties: {
      profile: { $ref: 'Profile#' },
      hero: { $ref: 'HeroContent#' },
      about: { $ref: 'AboutContent#' },
      competencies: {
        type: 'array',
        maxItems: 100,
        items: { $ref: 'CompetencyItem#' },
      },
      projects: {
        type: 'array',
        maxItems: 100,
        items: { $ref: 'Project#' },
      },
      experience: {
        type: 'array',
        maxItems: 100,
        items: { $ref: 'ExperienceItem#' },
      },
      education: {
        type: 'array',
        maxItems: 100,
        items: { $ref: 'EducationItem#' },
      },
      highlights: {
        type: 'array',
        maxItems: 100,
        items: { $ref: 'HighlightItem#' },
      },
      contentBlocks: {
        type: 'object',
        description: 'Textos editáveis. Chave = nome do texto, valor = conteúdo.',
        additionalProperties: { type: 'string', maxLength: 10000 },
      },
      appearance: { $ref: 'Appearance#' },
      assistant: { $ref: 'AssistantConfig#' },
      editor: { $ref: 'EditorState#' },
    },
  })

  app.addSchema({
    $id: 'PortfolioSnapshot',
    type: 'object',
    description: 'Portfólio completo + controle de versão.',
    required: ['revision', 'updatedAt', 'data'],
    properties: {
      revision: {
        type: 'integer',
        minimum: 1,
        description: 'Versão atual dos dados. Use em `expectedRevision` ao salvar.',
        examples: [5],
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data da última alteração.',
        examples: ['2025-01-15T12:00:00.000Z'],
      },
      data: { $ref: 'PortfolioDocument#' },
    },
  })

  app.addSchema({
    $id: 'ProfileWrite',
    ...revisionWrite({ $ref: 'Profile#' }, examples.profile),
  })

  app.addSchema({
    $id: 'HeroWrite',
    ...revisionWrite({ $ref: 'HeroContent#' }, examples.hero),
  })

  app.addSchema({
    $id: 'AboutWrite',
    ...revisionWrite({ $ref: 'AboutContent#' }, examples.about),
  })

  app.addSchema({
    $id: 'AppearanceWrite',
    ...revisionWrite({ $ref: 'Appearance#' }, examples.appearance),
  })

  app.addSchema({
    $id: 'AssistantWrite',
    ...revisionWrite({ $ref: 'AssistantConfig#' }, examples.assistant),
  })

  app.addSchema({
    $id: 'EditorWrite',
    ...revisionWrite({ $ref: 'EditorState#' }, {
      sectionLayouts: examples.sectionLayouts,
      sectionIcons: { experience: examples.sectionIcon },
      textStyles: { 'hero.title': examples.textStyle },
      freeElements: [examples.freeElement],
      assistantLayout: examples.assistantLayout,
    }),
  })
}
