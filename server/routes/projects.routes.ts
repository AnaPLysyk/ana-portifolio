import type { FastifyInstance } from 'fastify'
import type { Project } from '../domain/types.js'
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

export const registerProjectRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/projects',
    {
      schema: {
        tags: ['Projects'],
        summary: 'Lista os projetos do portfólio',
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return {
        revision: snapshot.revision,
        updatedAt: snapshot.updatedAt,
        data: snapshot.data.projects,
      }
    },
  )

  app.get<{ Params: { id: string } }>(
    '/api/v1/projects/:id',
    {
      schema: {
        tags: ['Projects'],
        summary: 'Retorna um projeto',
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', minLength: 1 } },
        },
      },
    },
    async (request, reply) => {
      const snapshot = portfolioService.get()
      const project = snapshot.data.projects.find(
        (item) => item.id === request.params.id,
      )

      if (!project) {
        return reply.code(404).send({
          code: 'PROJECT_NOT_FOUND',
          message: 'Projeto não encontrado.',
        })
      }

      return {
        revision: snapshot.revision,
        updatedAt: snapshot.updatedAt,
        data: project,
      }
    },
  )

  app.post<{ Body: RevisionBody<Project> }>(
    '/api/v1/projects',
    {
      schema: {
        tags: ['Projects'],
        summary: 'Cria um projeto',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['expectedRevision', 'data'],
          additionalProperties: false,
          properties: {
            expectedRevision: { type: 'integer', minimum: 1 },
            data: { $ref: 'Project#' },
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
      const result = portfolioService.createProject(
        request.body.expectedRevision,
        request.body.data,
      )
      return reply.code(201).send(result)
    },
  )

  app.put<{ Params: { id: string }; Body: RevisionBody<Project> }>(
    '/api/v1/projects/:id',
    {
      schema: {
        tags: ['Projects'],
        summary: 'Atualiza um projeto',
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
            data: { $ref: 'Project#' },
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
      return portfolioService.updateProject(
        request.body.expectedRevision,
        request.params.id,
        request.body.data,
      )
    },
  )

  app.delete<{ Params: { id: string }; Querystring: RevisionQuery }>(
    '/api/v1/projects/:id',
    {
      schema: {
        tags: ['Projects'],
        summary: 'Remove um projeto',
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
      return portfolioService.deleteProject(
        Number(request.query.expectedRevision),
        request.params.id,
      )
    },
  )

  app.put<{ Body: OrderBody }>(
    '/api/v1/projects/order',
    {
      schema: {
        tags: ['Projects'],
        summary: 'Reordena os projetos',
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
      return portfolioService.reorderProjects(
        request.body.expectedRevision,
        request.body.ids,
      )
    },
  )
}
