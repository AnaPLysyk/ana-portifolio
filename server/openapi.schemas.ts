import type { FastifyInstance } from 'fastify'

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
    $id: 'PortfolioDocument',
    type: 'object',
    required: [
      'profile',
      'hero',
      'about',
      'skills',
      'projects',
      'experience',
      'appearance',
      'assistant',
      'editor',
    ],
    additionalProperties: false,
    properties: {
      profile: {
        type: 'object',
        required: ['name', 'role', 'level', 'location', 'email', 'github', 'linkedin'],
        additionalProperties: false,
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 120 },
          role: { type: 'string', minLength: 1, maxLength: 80 },
          level: { type: 'string', minLength: 1, maxLength: 40 },
          location: { type: 'string', minLength: 1, maxLength: 160 },
          email: { type: 'string', format: 'email' },
          github: { type: 'string', format: 'uri' },
          linkedin: { type: 'string', format: 'uri' },
          photoUrl: { type: 'string', format: 'uri' },
        },
      },
      hero: {
        type: 'object',
        required: ['title', 'intro'],
        additionalProperties: false,
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 220 },
          intro: { type: 'string', minLength: 1, maxLength: 1200 },
        },
      },
      about: {
        type: 'object',
        required: ['title', 'body'],
        additionalProperties: false,
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 220 },
          body: { type: 'string', minLength: 1, maxLength: 3000 },
        },
      },
      skills: {
        type: 'array',
        maxItems: 100,
        items: { type: 'string', minLength: 1, maxLength: 80 },
      },
      projects: {
        type: 'array',
        maxItems: 100,
        items: {
          type: 'object',
          required: ['id', 'name', 'description', 'stack', 'href', 'status'],
          additionalProperties: false,
          properties: {
            id: { type: 'string', minLength: 1, maxLength: 100 },
            name: { type: 'string', minLength: 1, maxLength: 160 },
            description: { type: 'string', minLength: 1, maxLength: 2000 },
            stack: {
              type: 'array',
              maxItems: 50,
              items: { type: 'string', minLength: 1, maxLength: 80 },
            },
            href: { type: 'string', format: 'uri' },
            status: { type: 'string', minLength: 1, maxLength: 80 },
          },
        },
      },
      experience: {
        type: 'array',
        maxItems: 100,
        items: {
          type: 'object',
          required: ['id', 'period', 'company', 'role', 'summary', 'details'],
          additionalProperties: false,
          properties: {
            id: { type: 'string', minLength: 1, maxLength: 100 },
            period: { type: 'string', minLength: 1, maxLength: 120 },
            company: { type: 'string', minLength: 1, maxLength: 160 },
            role: { type: 'string', minLength: 1, maxLength: 160 },
            summary: { type: 'string', minLength: 1, maxLength: 1200 },
            details: { type: 'string', minLength: 1, maxLength: 4000 },
          },
        },
      },
      appearance: {
        type: 'object',
        required: ['theme', 'language', 'accent', 'pageStyle', 'spacing', 'footerText'],
        additionalProperties: false,
        properties: {
          theme: { type: 'string', enum: ['dark', 'light'] },
          language: { type: 'string', enum: ['pt', 'en', 'es'] },
          accent: {
            type: 'string',
            pattern: '^#[0-9A-Fa-f]{6}$',
            description: 'Cor principal no formato hexadecimal #RRGGBB.',
          },
          pageStyle: { type: 'string', enum: ['current', 'light', 'direct'] },
          spacing: { type: 'number', minimum: 0, maximum: 100 },
          footerText: { type: 'string', maxLength: 500 },
        },
      },
      assistant: {
        type: 'object',
        required: ['greeting', 'suggestions'],
        additionalProperties: false,
        properties: {
          greeting: { type: 'string', minLength: 1, maxLength: 1000 },
          suggestions: {
            type: 'array',
            maxItems: 20,
            items: { type: 'string', minLength: 1, maxLength: 120 },
          },
        },
      },
      editor: {
        type: 'object',
        required: ['sectionLayouts', 'textStyles', 'freeElements'],
        additionalProperties: false,
        properties: {
          sectionLayouts: {
            type: 'object',
            additionalProperties: { type: 'string' },
          },
          textStyles: {
            type: 'object',
            additionalProperties: {
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
            },
          },
          freeElements: {
            type: 'array',
            maxItems: 500,
            items: {
              type: 'object',
              required: ['id', 'section', 'type'],
              additionalProperties: false,
              properties: {
                id: { type: 'string', minLength: 1, maxLength: 100 },
                section: { type: 'string', minLength: 1, maxLength: 100 },
                type: { type: 'string', enum: ['icon', 'badge', 'divider'] },
                icon: { type: 'string', maxLength: 100 },
                text: { type: 'string', maxLength: 300 },
                x: { type: 'number', minimum: 0, maximum: 100 },
                y: { type: 'number', minimum: 0, maximum: 100 },
                size: { type: 'number', minimum: 8, maximum: 256 },
                color: { type: 'string', maxLength: 40 },
                useSystemColor: { type: 'boolean' },
              },
            },
          },
        },
      },
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
}
