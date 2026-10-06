import type { FastifyInstance } from 'fastify'
import type {
  AboutContent,
  CompetencyItem,
  EducationItem,
  HeroContent,
  HighlightItem,
  RevisionWrite,
} from '../domain/types.js'
import { portfolioService } from '../services/portfolio.service.js'

const snapshotOf = (revision: number, updatedAt: string, data: unknown) => ({
  revision,
  updatedAt,
  data,
})

const listWriteSchema = (itemRef: string) => ({
  type: 'object',
  required: ['expectedRevision', 'data'],
  additionalProperties: false,
  properties: {
    expectedRevision: { type: 'integer', minimum: 1 },
    data: {
      type: 'array',
      maxItems: 100,
      items: { $ref: itemRef },
    },
  },
})

export const registerContentRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/hero',
    {
      schema: {
        tags: ['Content'],
        summary: 'Retorna o conteúdo da Home',
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return snapshotOf(snapshot.revision, snapshot.updatedAt, snapshot.data.hero)
    },
  )

  app.put<{ Body: RevisionWrite<HeroContent> }>(
    '/api/v1/hero',
    {
      schema: {
        tags: ['Content'],
        summary: 'Atualiza o conteúdo da Home',
        security: [{ bearerAuth: [] }],
        body: { $ref: 'HeroWrite#' },
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateHero(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.get(
    '/api/v1/about',
    {
      schema: {
        tags: ['Content'],
        summary: 'Retorna o conteúdo da seção Sobre',
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return snapshotOf(snapshot.revision, snapshot.updatedAt, snapshot.data.about)
    },
  )

  app.put<{ Body: RevisionWrite<AboutContent> }>(
    '/api/v1/about',
    {
      schema: {
        tags: ['Content'],
        summary: 'Atualiza o conteúdo da seção Sobre',
        security: [{ bearerAuth: [] }],
        body: { $ref: 'AboutWrite#' },
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateAbout(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.get(
    '/api/v1/competencies',
    {
      schema: {
        tags: ['Content'],
        summary: 'Retorna as competências',
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return snapshotOf(
        snapshot.revision,
        snapshot.updatedAt,
        snapshot.data.competencies,
      )
    },
  )

  app.put<{ Body: RevisionWrite<CompetencyItem[]> }>(
    '/api/v1/competencies',
    {
      schema: {
        tags: ['Content'],
        summary: 'Substitui a lista de competências',
        security: [{ bearerAuth: [] }],
        body: listWriteSchema('CompetencyItem#'),
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateCompetencies(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.get(
    '/api/v1/education',
    {
      schema: {
        tags: ['Content'],
        summary: 'Retorna formação e cursos',
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return snapshotOf(
        snapshot.revision,
        snapshot.updatedAt,
        snapshot.data.education,
      )
    },
  )

  app.put<{ Body: RevisionWrite<EducationItem[]> }>(
    '/api/v1/education',
    {
      schema: {
        tags: ['Content'],
        summary: 'Substitui formação e cursos',
        security: [{ bearerAuth: [] }],
        body: listWriteSchema('EducationItem#'),
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateEducation(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.get(
    '/api/v1/highlights',
    {
      schema: {
        tags: ['Content'],
        summary: 'Retorna destaques e conquistas',
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return snapshotOf(
        snapshot.revision,
        snapshot.updatedAt,
        snapshot.data.highlights,
      )
    },
  )

  app.put<{ Body: RevisionWrite<HighlightItem[]> }>(
    '/api/v1/highlights',
    {
      schema: {
        tags: ['Content'],
        summary: 'Substitui destaques e conquistas',
        security: [{ bearerAuth: [] }],
        body: listWriteSchema('HighlightItem#'),
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateHighlights(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.get(
    '/api/v1/content-blocks',
    {
      schema: {
        tags: ['Content'],
        summary: 'Retorna textos editáveis mapeados por chave estável',
        description:
          'Usado para persistir textos editados diretamente na página sem criar endpoint específico para cada parágrafo.',
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return snapshotOf(
        snapshot.revision,
        snapshot.updatedAt,
        snapshot.data.contentBlocks,
      )
    },
  )

  app.put<{ Body: RevisionWrite<Record<string, string>> }>(
    '/api/v1/content-blocks',
    {
      schema: {
        tags: ['Content'],
        summary: 'Salva os textos editáveis da página',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['expectedRevision', 'data'],
          additionalProperties: false,
          properties: {
            expectedRevision: { type: 'integer', minimum: 1 },
            data: {
              type: 'object',
              additionalProperties: { type: 'string', maxLength: 10000 },
            },
          },
        },
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateContentBlocks(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )
}
