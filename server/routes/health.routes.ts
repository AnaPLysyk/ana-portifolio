import type { FastifyInstance } from 'fastify'
import { publicDoc } from '../openapi.docs.js'

export const registerHealthRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Verifica se a API está no ar',
        description: publicDoc(
          'Teste rápido: se responder `status: "ok"`, a API está funcionando. Bom primeiro passo para quem está começando.',
        ),
        response: {
          200: {
            description: 'API disponível.',
            type: 'object',
            required: ['status', 'service', 'timestamp'],
            properties: {
              status: {
                type: 'string',
                const: 'ok',
                description: 'Sempre "ok" quando a API está no ar.',
                examples: ['ok'],
              },
              service: {
                type: 'string',
                description: 'Nome do serviço.',
                examples: ['ana-portfolio-api'],
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'Hora atual do servidor.',
                examples: ['2025-01-15T12:00:00.000Z'],
              },
            },
          },
        },
      },
    },
    async () => ({
      status: 'ok',
      service: 'ana-portfolio-api',
      timestamp: new Date().toISOString(),
    }),
  )
}
