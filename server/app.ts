import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { config } from './config.js'
import { registerOpenApiSchemas } from './openapi.schemas.js'
import { RevisionConflictError } from './repositories/portfolio.repository.js'
import { registerAppearanceRoutes } from './routes/appearance.routes.js'
import { registerAssistantRoutes } from './routes/assistant.routes.js'
import { registerAuthRoutes } from './routes/auth.routes.js'
import { registerContentRoutes } from './routes/content.routes.js'
import { registerEditorRoutes } from './routes/editor.routes.js'
import { registerExperienceRoutes } from './routes/experience.routes.js'
import { registerHealthRoutes } from './routes/health.routes.js'
import { registerPortfolioRoutes } from './routes/portfolio.routes.js'
import { registerProfileRoutes } from './routes/profile.routes.js'
import { registerProjectRoutes } from './routes/projects.routes.js'
import {
  InvalidOrderError,
  InvalidResourceIdError,
  ResourceAlreadyExistsError,
  ResourceNotFoundError,
} from './services/portfolio.service.js'

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
          'API completa do portfólio: conteúdo público, editor autenticado, aparência, elementos e assistente.',
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
        { name: 'Portfolio', description: 'Documento completo do portfólio' },
        { name: 'Profile', description: 'Identidade, contato e foto' },
        { name: 'Content', description: 'Home, Sobre, competências, formação e textos' },
        { name: 'Projects', description: 'Projetos e ordenação' },
        { name: 'Experience', description: 'Trajetória profissional e ordenação' },
        { name: 'Appearance', description: 'Tema, cor, espaçamento e formato' },
        { name: 'Editor', description: 'Layouts, ícones, estilos e elementos livres' },
        { name: 'Assistant', description: 'Configuração, contextos e chat' },
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
  await registerProfileRoutes(app)
  await registerContentRoutes(app)
  await registerProjectRoutes(app)
  await registerExperienceRoutes(app)
  await registerAppearanceRoutes(app)
  await registerEditorRoutes(app)
  await registerAssistantRoutes(app)

  app.setErrorHandler((error: any, request, reply) => {
    if (error.validation) {
      return reply.code(400).send({
        code: 'VALIDATION_ERROR',
        message: 'A requisição não atende ao contrato da API.',
        details: {
          validation: error.validation,
        },
      })
    }

    if (error instanceof RevisionConflictError) {
      return reply.code(409).send({
        code: 'REVISION_CONFLICT',
        message:
          'O portfólio foi alterado depois que esta edição começou. Recarregue a revisão atual antes de salvar.',
        details: {
          expectedRevision: error.expectedRevision,
          currentRevision: error.currentRevision,
        },
      })
    }

    if (error instanceof ResourceNotFoundError) {
      return reply.code(404).send({
        code: 'RESOURCE_NOT_FOUND',
        message: `${error.resource} não encontrado.`,
        details: { id: error.id },
      })
    }

    if (error instanceof ResourceAlreadyExistsError) {
      return reply.code(409).send({
        code: 'RESOURCE_ALREADY_EXISTS',
        message: `${error.resource} já existe.`,
        details: { id: error.id },
      })
    }

    if (error instanceof InvalidOrderError) {
      return reply.code(400).send({
        code: 'INVALID_ORDER',
        message:
          'A ordenação precisa conter exatamente os IDs atuais, sem duplicidade.',
        details: { resource: error.resource },
      })
    }

    if (error instanceof InvalidResourceIdError) {
      return reply.code(400).send({
        code: 'RESOURCE_ID_MISMATCH',
        message: 'O ID da URL deve ser o mesmo ID enviado no corpo.',
        details: {
          resource: error.resource,
          pathId: error.pathId,
          bodyId: error.bodyId,
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
