import type { FastifyInstance } from 'fastify'
import type { Profile, RevisionWrite } from '../domain/types.js'
import { portfolioService } from '../services/portfolio.service.js'

interface PhotoBody {
  expectedRevision: number
  dataUrl: string
}

const snapshotOf = (revision: number, updatedAt: string, data: unknown) => ({
  revision,
  updatedAt,
  data,
})

export const registerProfileRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/profile',
    {
      schema: {
        tags: ['Profile'],
        summary: 'Retorna os dados públicos do perfil',
        response: {
          200: {
            type: 'object',
            required: ['revision', 'updatedAt', 'data'],
            properties: {
              revision: { type: 'integer' },
              updatedAt: { type: 'string', format: 'date-time' },
              data: { $ref: 'Profile#' },
            },
          },
        },
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return snapshotOf(snapshot.revision, snapshot.updatedAt, snapshot.data.profile)
    },
  )

  app.put<{ Body: RevisionWrite<Profile> }>(
    '/api/v1/profile',
    {
      schema: {
        tags: ['Profile'],
        summary: 'Atualiza identidade e contatos do portfólio',
        security: [{ bearerAuth: [] }],
        body: { $ref: 'ProfileWrite#' },
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateProfile(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.put<{ Body: PhotoBody }>(
    '/api/v1/profile/photo',
    {
      schema: {
        tags: ['Profile'],
        summary: 'Atualiza a foto usada no portfólio',
        description:
          'Antes do storage definitivo, aceita URL pública ou data URL de imagem. O banco não será responsável por arquivos na arquitetura final.',
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['expectedRevision', 'dataUrl'],
          additionalProperties: false,
          properties: {
            expectedRevision: { type: 'integer', minimum: 1 },
            dataUrl: {
              type: 'string',
              minLength: 1,
              maxLength: 3000000,
              anyOf: [
                { format: 'uri' },
                { pattern: '^data:image/(png|jpeg|jpg|webp);base64,' },
              ],
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
      const current = portfolioService.get().data.profile
      return portfolioService.updateProfile(request.body.expectedRevision, {
        ...current,
        photoUrl: request.body.dataUrl,
      })
    },
  )
}
