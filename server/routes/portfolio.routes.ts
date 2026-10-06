import type { FastifyInstance } from 'fastify'
import type { SavePortfolioRequest } from '../domain/types.js'
import { portfolioService } from '../services/portfolio.service.js'

export const registerPortfolioRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/portfolio',
    {
      schema: {
        tags: ['Portfolio'],
        summary: 'Retorna o documento completo publicado',
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
        },
      },
    },
    async () => portfolioService.get(),
  )

  app.put<{ Body: SavePortfolioRequest }>(
    '/api/v1/portfolio',
    {
      schema: {
        tags: ['Portfolio'],
        summary: 'Salva o documento completo do portfólio',
        description:
          'Endpoint agregado usado quando o front salva toda a edição de uma vez. Também existe API granular por domínio.',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['expectedRevision', 'data'],
          additionalProperties: false,
          properties: {
            expectedRevision: { type: 'integer', minimum: 1 },
            data: { $ref: 'PortfolioDocument#' },
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
      return portfolioService.replace(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )
}
