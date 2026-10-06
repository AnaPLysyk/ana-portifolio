import type { FastifyInstance } from 'fastify'

export const registerHealthRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Verifica se a API está disponível',
        response: {
          200: {
            type: 'object',
            required: ['status', 'service', 'timestamp'],
            properties: {
              status: { type: 'string', const: 'ok' },
              service: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
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
