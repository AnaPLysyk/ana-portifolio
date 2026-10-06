import type { FastifyInstance } from 'fastify'
import type { AssistantMessageRequest } from '../domain/types.js'
import { portfolioRepository } from '../repositories/portfolio.repository.js'
import { answerFromPortfolio } from '../services/assistant.service.js'

export const registerAssistantRoutes = async (app: FastifyInstance) => {
  app.post<{ Body: AssistantMessageRequest }>(
    '/api/v1/assistant/messages',
    {
      schema: {
        tags: ['Assistant'],
        summary: 'Responde perguntas usando o conteúdo do portfólio',
        description:
          'Nesta primeira versão, a resposta é determinística e baseada no conteúdo salvo. A integração com um provedor de IA entra em uma etapa posterior sem mudar o endpoint.',
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
        },
      },
    },
    async (request) => {
      const snapshot = portfolioRepository.get()
      return answerFromPortfolio(request.body.message, snapshot.data)
    },
  )
}
