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
        description: [
          '### O que é esta API?',
          'Esta API é a forma de consultar e alterar os dados usados pelo portfólio. Pelo Swagger você pode testar essas operações manualmente, sem precisar usar o frontend.',
          '',
          '### Como testar um endpoint?',
          '1. Abra o endpoint.',
          '2. Clique em **Try it out**.',
          '3. Preencha os campos mostrados.',
          '4. Clique em **Execute**.',
          '5. Confira o código e a resposta retornada.',
          '',
          '### O que significam GET, POST, PUT e DELETE?',
          '- **GET** = consultar dados.',
          '- **POST** = criar algo novo.',
          '- **PUT** = alterar dados existentes.',
          '- **DELETE** = remover.',
          '',
          '### Login e token',
          'Algumas operações podem ser executadas por qualquer pessoa e outras exigem login. Depois do login, a API devolve um `accessToken`. Esse token funciona como uma identificação temporária para permitir alterações. Copie o valor e informe no botão **Authorize**.',
          '',
          '### revision e expectedRevision',
          '`revision` é o número da versão atual dos dados.',
          '',
          'Antes de alterar alguma informação, faça o GET correspondente e veja o valor de `revision`.',
          '',
          'Ao salvar, envie esse mesmo número em `expectedRevision`.',
          '',
          'Isso evita que uma alteração sobrescreva outra feita depois.',
          '',
          'Exemplo curto:',
          '',
          'GET retornou: `revision: 4`',
          '',
          'Então no PUT, POST ou DELETE use: `expectedRevision: 4`',
          '',
          'Se retornar **409**, faça um novo GET porque os dados mudaram.',
          '',
          '### Códigos de resposta',
          '- **200** = operação realizada.',
          '- **201** = item criado.',
          '- **204** = operação realizada sem conteúdo na resposta.',
          '- **400** = algum dado enviado está incorreto ou faltando.',
          '- **401** = precisa fazer login ou o token não é mais válido.',
          '- **404** = o item procurado não existe.',
          '- **409** = os dados mudaram desde o último GET ou, em criação, o ID já existe.',
          '- **503** = autenticação ainda não foi configurada no ambiente.',
        ].join('\n'),
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
        { name: 'Health', description: '🔓 Teste se a API está no ar' },
        { name: 'Auth', description: 'Login e sessão. O token vai no botão Authorize' },
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
      defaultModelRendering: 'model',
      defaultModelsExpandDepth: -1,
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
