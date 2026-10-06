import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { config } from './config.js'
import { registerOpenApiSchemas } from './openapi.schemas.js'
import { registerAssistantRoutes } from './routes/assistant.routes.js'
import { registerAuthRoutes } from './routes/auth.routes.js'
import { registerHealthRoutes } from './routes/health.routes.js'
import { registerPortfolioRoutes } from './routes/portfolio.routes.js'

export const buildApp = async () => {
  const app = Fastify({
    logger: true,
  })

  await app.register(cors, {
    origin: config.frontendOrigin,
    credentials: true,
  })

  await app.register(jwt, {
    secret: config.jwtSecret ?? 'development-only-change-me',
  })

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Ana Portfolio API',
        description:
          'API do portfólio profissional: leitura pública, edição autenticada e assistente.',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3333',
          description: 'Desenvolvimento local',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'Health', description: 'Disponibilidade da API' },
        { name: 'Auth', description: 'Sessão do editor' },
        { name: 'Portfolio', description: 'Documento publicado e edição' },
        { name: 'Assistant', description: 'Chat do portfólio' },
      ],
    },
  })

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  })

  registerOpenApiSchemas(app)

  await registerHealthRoutes(app)
  await registerAuthRoutes(app)
  await registerPortfolioRoutes(app)
  await registerAssistantRoutes(app)

  app.setErrorHandler((error, request, reply) => {
    if (error.validation) {
      return reply.code(400).send({
        code: 'VALIDATION_ERROR',
        message: 'A requisição não atende ao contrato da API.',
        details: {
          validation: error.validation,
        },
      })
    }

    if (error.statusCode === 401) {
      return reply.code(401).send({
        code: 'UNAUTHORIZED',
        message: 'Autenticação obrigatória ou token inválido.',
      })
    }

    request.log.error(error)

    return reply.code(error.statusCode ?? 500).send({
      code: 'INTERNAL_ERROR',
      message: 'Não foi possível concluir a operação.',
    })
  })

  return app
}
