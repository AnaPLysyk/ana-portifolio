import type { FastifyInstance } from 'fastify'
import type { ExperienceItem } from '../domain/types.js'
import { portfolioService } from '../services/portfolio.service.js'

interface RevisionBody<T> {
  expectedRevision: number
  data: T
}

interface OrderBody {
  expectedRevision: number
  ids: string[]
}

interface RevisionQuery {
  expectedRevision: number
}

export const registerExperienceRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/experience',
    {
      schema: {
        tags: ['Experience'],
        summary: 'Lista a trajetória profissional',
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return {
        revision: snapshot.revision,
        updatedAt: snapshot.updatedAt,
        data: snapshot.data.experience,
      }
    },
  )

  app.get<{ Params: { id: string } }>(
    '/api/v1/experience/:id',
    {
      schema: {
        tags: ['Experience'],
        summary: 'Retorna um item da trajetória',
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', minLength: 1 } },
        },
      },
    },
    async (request, reply) => {
      const snapshot = portfolioService.get()
      const item = snapshot.data.experience.find(
        (entry) => entry.id === request.params.id,
      )

      if (!item) {
        return reply.code(404).send({
          code: 'EXPERIENCE_NOT_FOUND',
          message: 'Experiência não encontrada.',
        })
      }

      return {
        revision: snapshot.revision,
        updatedAt: snapshot.updatedAt,
        data: item,
      }
    },
  )

  app.post<{ Body: RevisionBody<ExperienceItem> }>(
    '/api/v1/experience',
    {
      schema: {
        tags: ['Experience'],
        summary: 'Cria um item de experiência',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['expectedRevision', 'data'],
          additionalProperties: false,
          properties: {
            expectedRevision: { type: 'integer', minimum: 1 },
            data: { $ref: 'ExperienceItem#' },
          },
        },
        response: {
          201: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request, reply) => {
      await request.jwtVerify()
      const result = portfolioService.createExperience(
        request.body.expectedRevision,
        request.body.data,
      )
      return reply.code(201).send(result)
    },
  )

  app.put<{ Params: { id: string }; Body: RevisionBody<ExperienceItem> }>(
    '/api/v1/experience/:id',
    {
      schema: {
        tags: ['Experience'],
        summary: 'Atualiza um item de experiência',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', minLength: 1 } },
        },
        body: {
          type: 'object',
          required: ['expectedRevision', 'data'],
          additionalProperties: false,
          properties: {
            expectedRevision: { type: 'integer', minimum: 1 },
            data: { $ref: 'ExperienceItem#' },
          },
        },
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          400: { $ref: 'ErrorResponse#' },
          401: { $ref: 'ErrorResponse#' },
          404: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateExperience(
        request.body.expectedRevision,
        request.params.id,
        request.body.data,
      )
    },
  )

  app.delete<{ Params: { id: string }; Querystring: RevisionQuery }>(
    '/api/v1/experience/:id',
    {
      schema: {
        tags: ['Experience'],
        summary: 'Remove um item de experiência',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', minLength: 1 } },
        },
        querystring: {
          type: 'object',
          required: ['expectedRevision'],
          additionalProperties: false,
          properties: {
            expectedRevision: { type: 'integer', minimum: 1 },
          },
        },
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          404: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.deleteExperience(
        Number(request.query.expectedRevision),
        request.params.id,
      )
    },
  )

  app.put<{ Body: OrderBody }>(
    '/api/v1/experience/order',
    {
      schema: {
        tags: ['Experience'],
        summary: 'Reordena a trajetória profissional',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['expectedRevision', 'ids'],
          additionalProperties: false,
          properties: {
            expectedRevision: { type: 'integer', minimum: 1 },
            ids: {
              type: 'array',
              minItems: 1,
              uniqueItems: true,
              items: { type: 'string', minLength: 1 },
            },
          },
        },
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          400: { $ref: 'ErrorResponse#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.reorderExperience(
        request.body.expectedRevision,
        request.body.ids,
      )
    },
  )
}
