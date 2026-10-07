import type { FastifyInstance } from 'fastify'
import type { Appearance, RevisionWrite } from '../domain/types.js'
import { portfolioService } from '../services/portfolio.service.js'
import {
  err400,
  err401,
  err409,
  privateDoc,
  publicDoc,
  revisionHint,
  savedResponse,
  secured,
  snapshotOf as snapshotDoc,
} from '../openapi.docs.js'

export const registerAppearanceRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/appearance',
    {
      schema: {
        tags: ['Appearance'],
        summary: 'Mostra a aparência do portfólio',
        description: publicDoc(
          'Retorna tema, idioma, cor de destaque, espaçamento, formato da página e texto do rodapé.',
        ),
        response: {
          200: snapshotDoc('Aparência atual.', { $ref: 'Appearance#' }),
        },
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
        summary: 'Atualiza a aparência',
        description: privateDoc(
          `Troca tema, idioma, cor, intensidade, espaçamento, formato e rodapé. Envie todos os campos de \`data\`. ${revisionHint}`,
        ),
        security: secured,
        body: { $ref: 'AppearanceWrite#' },
        response: {
          200: savedResponse(),
          400: err400,
          401: err401,
          409: err409,
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
