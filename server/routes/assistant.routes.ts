import type { FastifyInstance } from 'fastify'
import type {
  AssistantConfig,
  AssistantMessageRequest,
  RevisionWrite,
} from '../domain/types.js'
import { portfolioService } from '../services/portfolio.service.js'
import { answerFromPortfolio } from '../services/assistant.service.js'
import {
  err400,
  err401,
  err409Revision,
  privateDoc,
  publicDoc,
  revisionHint,
  savedResponse,
  secured,
  snapshotOf as snapshotDoc,
} from '../openapi.docs.js'

export const registerAssistantRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/assistant/config',
    {
      schema: {
        tags: ['Assistant'],
        summary: 'Mostra a configuração do assistente',
        description: publicDoc(
          'Retorna a saudação, as perguntas sugeridas e os assuntos (contextos) que o assistente conhece.',
        ),
        response: {
          200: snapshotDoc('Configuração atual do assistente.', {
            $ref: 'AssistantConfig#',
          }),
        },
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
        summary: 'Atualiza o assistente',
        description: privateDoc(
          `Troca saudação, sugestões e contextos. A lista \`contexts\` enviada **substitui** a atual. ${revisionHint}`,
        ),
        security: secured,
        body: { $ref: 'AssistantWrite#' },
        response: {
          200: savedResponse(),
          400: err400,
          401: err401,
          409: err409Revision,
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
        summary: 'Faz uma pergunta ao assistente',
        description: publicDoc(
          'Envie uma pergunta e receba uma resposta baseada no conteúdo do portfólio. Nesta versão a resposta não usa IA externa: vem dos textos e contextos salvos.',
        ),
        body: {
          type: 'object',
          required: ['message'],
          additionalProperties: false,
          properties: {
            message: {
              type: 'string',
              minLength: 1,
              maxLength: 1000,
              description: 'Sua pergunta (até 1000 caracteres).',
              examples: ['Quais são os projetos?'],
            },
          },
          examples: [{ message: 'Quais são os projetos?' }],
        },
        response: {
          200: {
            description: 'Resposta do assistente.',
            type: 'object',
            required: ['reply', 'source'],
            properties: {
              reply: {
                type: 'string',
                description: 'Texto da resposta.',
                examples: ['O portfólio tem o Projeto Exemplo, feito com React e Fastify.'],
              },
              source: {
                type: 'string',
                const: 'portfolio',
                description: 'De onde veio a resposta (sempre "portfolio").',
                examples: ['portfolio'],
              },
            },
          },
          400: err400,
        },
      },
    },
    async (request) => {
      const snapshot = portfolioService.get()
      return answerFromPortfolio(request.body.message, snapshot.data)
    },
  )
}
