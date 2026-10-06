import type { FastifyInstance } from 'fastify'
import type { SavePortfolioRequest } from '../domain/types.js'
import {
  portfolioRepository,
  RevisionConflictError,
} from '../repositories/portfolio.repository.js'

export const registerPortfolioRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/portfolio',
    {
      schema: {
        tags: ['Portfolio'],
        summary: 'Retorna o portfólio publicado',
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
        },
      },
    },
    async () => portfolioRepository.get(),
  )

  app.put<{ Body: SavePortfolioRequest }>(
    '/api/v1/portfolio',
    {
      schema: {
        tags: ['Portfolio'],
        summary: 'Salva o documento completo do portfólio',
        description:
          'Requer a revisão que o editor carregou. Se outra gravação já tiver ocorrido, retorna 409 para impedir sobrescrita silenciosa.',
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
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request, reply) => {
      await request.jwtVerify()

      try {
        return portfolioRepository.save(request.body)
      } catch (error) {
        if (error instanceof RevisionConflictError) {
          return reply.code(409).send({
            code: 'REVISION_CONFLICT',
            message:
              'O portfólio foi alterado depois que esta edição começou. Recarregue a versão mais recente antes de salvar.',
            details: {
              expectedRevision: error.expectedRevision,
              currentRevision: error.currentRevision,
            },
          })
        }

        throw error
      }
    },
  )
}
