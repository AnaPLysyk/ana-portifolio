import type { FastifyInstance } from 'fastify'
import type {
  AssistantConfig,
  AssistantMessageRequest,
  RevisionWrite,
} from '../domain/types.js'
import { portfolioService } from '../services/portfolio.service.js'
import { answerFromPortfolio } from '../services/assistant.service.js'

export const registerAssistantRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/assistant/config',
    {
      schema: {
        tags: ['Assistant'],
        summary: 'Retorna configuração e contextos do assistente',
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return {
        revision: snapshot.revision,
        updatedAt: snapshot.updatedAt,
        data: snapshot.data.assistant,
      }
    },
  )

  app.put<{ Body: RevisionWrite<AssistantConfig> }>(
    '/api/v1/assistant/config',
    {
      schema: {
        tags: ['Assistant'],
        summary: 'Atualiza saudação, sugestões e contextos do assistente',
        security: [{ bearerAuth: [] }],
        body: { $ref: 'AssistantWrite#' },
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateAssistant(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.post<{ Body: AssistantMessageRequest }>(
    '/api/v1/assistant/messages',
    {
      schema: {
        tags: ['Assistant'],
        summary: 'Responde perguntas usando o conteúdo do portfólio',
        description:
          'Nesta primeira versão, a resposta é determinística e baseada no conteúdo/contextos salvos. A integração com um provedor de IA entra depois sem mudar o endpoint.',
        body: {
          type: 'object',
          required: ['message'],
          additionalProperties: false,
          properties: {
            message: { type: 'string', minLength: 1, maxLength: 1000 },
          },
        },
        response: {
          200: {
            type: 'object',
            required: ['reply', 'source'],
            properties: {
              reply: { type: 'string' },
              source: { type: 'string', const: 'portfolio' },
            },
          },
          400: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request) => {
      const snapshot = portfolioService.get()
      return answerFromPortfolio(request.body.message, snapshot.data)
    },
  )
}
