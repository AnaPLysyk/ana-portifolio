import type { FastifyInstance } from 'fastify'
import type { Appearance, RevisionWrite } from '../domain/types.js'
import { portfolioService } from '../services/portfolio.service.js'

export const registerAppearanceRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/appearance',
    {
      schema: {
        tags: ['Appearance'],
        summary: 'Retorna a configuração visual publicada',
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return {
        revision: snapshot.revision,
        updatedAt: snapshot.updatedAt,
        data: snapshot.data.appearance,
      }
    },
  )

  app.put<{ Body: RevisionWrite<Appearance> }>(
    '/api/v1/appearance',
    {
      schema: {
        tags: ['Appearance'],
        summary: 'Atualiza tema, cor, intensidade, espaçamento e formato',
        security: [{ bearerAuth: [] }],
        body: { $ref: 'AppearanceWrite#' },
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateAppearance(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )
}
