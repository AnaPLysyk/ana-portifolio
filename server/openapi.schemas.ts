import type { FastifyInstance } from 'fastify'

const id = {
  type: 'string',
  minLength: 1,
  maxLength: 100,
} as const

const revisionWrite = (data: object) => ({
  type: 'object',
  required: ['expectedRevision', 'data'],
  additionalProperties: false,
  properties: {
    expectedRevision: { type: 'integer', minimum: 1 },
    data,
  },
})

export const registerOpenApiSchemas = (app: FastifyInstance) => {
  app.addSchema({
    $id: 'ErrorResponse',
    type: 'object',
    required: ['code', 'message'],
    properties: {
      code: { type: 'string' },
      message: { type: 'string' },
      details: {
        type: 'object',
        additionalProperties: true,
      },
    },
  })

  app.addSchema({
    $id: 'Profile',
    type: 'object',
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
      name: { type: 'string', minLength: 1, maxLength: 120 },
      area: { type: 'string', minLength: 1, maxLength: 100 },
      role: { type: 'string', minLength: 1, maxLength: 80 },
      level: { type: 'string', minLength: 1, maxLength: 40 },
      company: { type: 'string', maxLength: 120 },
      cep: { type: 'string', maxLength: 20 },
      address: { type: 'string', maxLength: 240 },
      location: { type: 'string', minLength: 1, maxLength: 160 },
      email: { type: 'string', format: 'email' },
      whatsapp: { type: 'string', maxLength: 40 },
      github: { type: 'string', format: 'uri' },
      linkedin: { type: 'string', format: 'uri' },
      photoUrl: {
        type: 'string',
        maxLength: 3000000,
        description:
          'URL pública ou data URL temporária. Quando houver storage, será substituída por URL persistida.',
      },
    },
  })

  app.addSchema({
    $id: 'HeroContent',
    type: 'object',
    required: ['title', 'intro'],
    additionalProperties: false,
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 300 },
      intro: { type: 'string', minLength: 1, maxLength: 3000 },
    },
  })

  app.addSchema({
    $id: 'AboutContent',
    type: 'object',
    required: ['title', 'body'],
    additionalProperties: false,
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 300 },
      body: { type: 'string', minLength: 1, maxLength: 5000 },
    },
  })

  app.addSchema({
    $id: 'CompetencyItem',
    type: 'object',
    required: ['id', 'title', 'description', 'tags'],
    additionalProperties: false,
    properties: {
      id,
      title: { type: 'string', minLength: 1, maxLength: 160 },
      description: { type: 'string', minLength: 1, maxLength: 2000 },
      tags: {
        type: 'array',
        maxItems: 50,
        items: { type: 'string', minLength: 1, maxLength: 80 },
      },
    },
  })

  app.addSchema({
    $id: 'Project',
    type: 'object',
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
      id,
      name: { type: 'string', minLength: 1, maxLength: 160 },
      description: { type: 'string', minLength: 1, maxLength: 3000 },
      stack: {
        type: 'array',
        maxItems: 50,
        items: { type: 'string', minLength: 1, maxLength: 80 },
      },
      href: { type: 'string', format: 'uri' },
      status: { type: 'string', minLength: 1, maxLength: 80 },
      visibility: { type: 'string', enum: ['public', 'private'] },
      linked: { type: 'boolean' },
    },
  })

  app.addSchema({
    $id: 'ExperienceItem',
    type: 'object',
    required: ['id', 'period', 'company', 'role', 'summary', 'details'],
    additionalProperties: false,
    properties: {
      id,
      period: { type: 'string', minLength: 1, maxLength: 120 },
      company: { type: 'string', minLength: 1, maxLength: 160 },
      role: { type: 'string', minLength: 1, maxLength: 160 },
      summary: { type: 'string', minLength: 1, maxLength: 1600 },
      details: { type: 'string', minLength: 1, maxLength: 5000 },
    },
  })

  app.addSchema({
    $id: 'EducationItem',
    type: 'object',
    required: ['id', 'title', 'institution', 'status'],
    additionalProperties: false,
    properties: {
      id,
      title: { type: 'string', minLength: 1, maxLength: 200 },
      institution: { type: 'string', minLength: 1, maxLength: 160 },
      status: { type: 'string', minLength: 1, maxLength: 80 },
      period: { type: 'string', maxLength: 120 },
      description: { type: 'string', maxLength: 3000 },
      href: { type: 'string', format: 'uri' },
    },
  })

  app.addSchema({
    $id: 'HighlightItem',
    type: 'object',
    required: ['id', 'title', 'description'],
    additionalProperties: false,
    properties: {
      id,
      title: { type: 'string', minLength: 1, maxLength: 200 },
      description: { type: 'string', minLength: 1, maxLength: 3000 },
      href: { type: 'string', format: 'uri' },
      label: { type: 'string', maxLength: 100 },
    },
  })

  app.addSchema({
    $id: 'Appearance',
    type: 'object',
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
      theme: { type: 'string', enum: ['dark', 'light'] },
      language: { type: 'string', enum: ['pt', 'en', 'es'] },
      accent: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$' },
      intensity: { type: 'number', minimum: 0, maximum: 100 },
      spacing: { type: 'number', minimum: 0, maximum: 100 },
      pageFormat: {
        type: 'string',
        enum: ['balanced', 'editorial', 'panoramic'],
      },
      footerText: { type: 'string', maxLength: 500 },
    },
  })

  app.addSchema({
    $id: 'SectionIconConfig',
    type: 'object',
    required: ['icon', 'size', 'position', 'system', 'color'],
    additionalProperties: false,
    properties: {
      icon: { type: 'string', minLength: 1, maxLength: 100 },
      size: { type: 'number', minimum: 8, maximum: 256 },
      position: { type: 'string', enum: ['before', 'after'] },
      system: { type: 'boolean' },
      color: { type: 'string', maxLength: 40 },
    },
  })

  app.addSchema({
    $id: 'TextStyle',
    type: 'object',
    additionalProperties: false,
    properties: {
      fontFamily: { type: 'string', maxLength: 200 },
      fontSize: { type: 'number', minimum: 8, maximum: 160 },
      fontWeight: { type: 'number', minimum: 100, maximum: 900 },
      color: { type: 'string', maxLength: 40 },
      textAlign: { type: 'string', enum: ['left', 'center', 'right'] },
      width: { type: 'string', maxLength: 30 },
      paddingInline: { type: 'string', maxLength: 30 },
    },
  })

  app.addSchema({
    $id: 'FreeElement',
    type: 'object',
    required: ['id', 'section', 'type'],
    additionalProperties: false,
    properties: {
      id,
      section: { type: 'string', minLength: 1, maxLength: 100 },
      type: { type: 'string', enum: ['icon', 'badge', 'divider', 'layout'] },
      icon: { type: 'string', maxLength: 100 },
      text: { type: 'string', maxLength: 500 },
      x: { type: 'number', minimum: 0, maximum: 100 },
      y: { type: 'number', minimum: 0, maximum: 100 },
      size: { type: 'number', minimum: 8, maximum: 256 },
      color: { type: 'string', maxLength: 40 },
      useSystemColor: { type: 'boolean' },
      layout: { type: 'string', maxLength: 100 },
    },
  })

  app.addSchema({
    $id: 'AssistantContext',
    type: 'object',
    required: ['id', 'title', 'category', 'keywords', 'content', 'enabled'],
    additionalProperties: false,
    properties: {
      id,
      title: { type: 'string', minLength: 1, maxLength: 160 },
      category: { type: 'string', minLength: 1, maxLength: 100 },
      keywords: {
        type: 'array',
        maxItems: 50,
        items: { type: 'string', minLength: 1, maxLength: 80 },
      },
      content: { type: 'string', minLength: 1, maxLength: 5000 },
      enabled: { type: 'boolean' },
    },
  })

  app.addSchema({
    $id: 'AssistantConfig',
    type: 'object',
    required: ['greeting', 'suggestions', 'contexts'],
    additionalProperties: false,
    properties: {
      greeting: { type: 'string', minLength: 1, maxLength: 1200 },
      suggestions: {
        type: 'array',
        maxItems: 20,
        items: { type: 'string', minLength: 1, maxLength: 120 },
      },
      contexts: {
        type: 'array',
        maxItems: 100,
        items: { $ref: 'AssistantContext#' },
      },
    },
  })

  app.addSchema({
    $id: 'EditorState',
    type: 'object',
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
        additionalProperties: { type: 'string', maxLength: 100 },
      },
      sectionIcons: {
        type: 'object',
        additionalProperties: { $ref: 'SectionIconConfig#' },
      },
      textStyles: {
        type: 'object',
        additionalProperties: { $ref: 'TextStyle#' },
      },
      freeElements: {
        type: 'array',
        maxItems: 500,
        items: { $ref: 'FreeElement#' },
      },
      assistantLayout: {
        type: 'object',
        required: ['robot', 'cta'],
        additionalProperties: false,
        properties: {
          robot: { $ref: 'Position#' },
          cta: { $ref: 'Position#' },
        },
      },
    },
  })

  app.addSchema({
    $id: 'Position',
    type: 'object',
    required: ['x', 'y'],
    additionalProperties: false,
    properties: {
      x: { type: 'number', minimum: 0, maximum: 100 },
      y: { type: 'number', minimum: 0, maximum: 100 },
    },
  })

  app.addSchema({
    $id: 'PortfolioDocument',
    type: 'object',
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
    required: ['revision', 'updatedAt', 'data'],
    properties: {
      revision: { type: 'integer', minimum: 1 },
      updatedAt: { type: 'string', format: 'date-time' },
      data: { $ref: 'PortfolioDocument#' },
    },
  })

  app.addSchema({
    $id: 'ProfileWrite',
    ...revisionWrite({ $ref: 'Profile#' }),
  })

  app.addSchema({
    $id: 'HeroWrite',
    ...revisionWrite({ $ref: 'HeroContent#' }),
  })

  app.addSchema({
    $id: 'AboutWrite',
    ...revisionWrite({ $ref: 'AboutContent#' }),
  })

  app.addSchema({
    $id: 'AppearanceWrite',
    ...revisionWrite({ $ref: 'Appearance#' }),
  })

  app.addSchema({
    $id: 'AssistantWrite',
    ...revisionWrite({ $ref: 'AssistantConfig#' }),
  })

  app.addSchema({
    $id: 'EditorWrite',
    ...revisionWrite({ $ref: 'EditorState#' }),
  })
}
