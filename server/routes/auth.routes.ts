import type { FastifyInstance } from 'fastify'
import { authConfigured, config } from '../config.js'
import {
  err400,
  err401,
  privateDoc,
  publicDoc,
  secured,
} from '../openapi.docs.js'

interface LoginBody {
  username: string
  password: string
}

export const registerAuthRoutes = async (app: FastifyInstance) => {
  app.post<{ Body: LoginBody }>(
    '/api/v1/auth/login',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Faz login e recebe o token',
        description: publicDoc(
          'Envie usuário e senha do editor. Copie o `accessToken` retornado e cole no botão **Authorize** (topo da página) para liberar os endpoints 🔒. Cole só o token, sem a palavra "Bearer".',
        ),
        body: {
          type: 'object',
          required: ['username', 'password'],
          additionalProperties: false,
          properties: {
            username: {
              type: 'string',
              minLength: 1,
              description: 'Usuário do editor (definido em ADMIN_USERNAME).',
              examples: ['admin'],
            },
            password: {
              type: 'string',
              minLength: 1,
              description: 'Senha do editor (definida em ADMIN_PASSWORD).',
              examples: ['sua-senha'],
            },
          },
          examples: [{ username: 'admin', password: 'sua-senha' }],
        },
        response: {
          200: {
            description: 'Login feito. Use o `accessToken` no botão Authorize.',
            type: 'object',
            required: ['accessToken', 'tokenType', 'expiresIn'],
            properties: {
              accessToken: {
                type: 'string',
                description: 'Token JWT. Cole no botão Authorize.',
                examples: ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.exemplo.assinatura'],
              },
              tokenType: {
                type: 'string',
                const: 'Bearer',
                description: 'Tipo do token (sempre "Bearer").',
                examples: ['Bearer'],
              },
              expiresIn: {
                type: 'string',
                description: 'Tempo de validade do token.',
                examples: ['15m'],
              },
            },
          },
          400: err400,
          401: {
            description: 'Usuário ou senha incorretos.',
            type: 'object',
            required: ['code', 'message'],
            properties: {
              code: { type: 'string', examples: ['INVALID_CREDENTIALS'] },
              message: {
                type: 'string',
                examples: ['Usuário ou senha inválidos.'],
              },
            },
          },
          503: {
            description: 'Login ainda não configurado no servidor.',
            type: 'object',
            required: ['code', 'message'],
            properties: {
              code: { type: 'string', examples: ['AUTH_NOT_CONFIGURED'] },
              message: {
                type: 'string',
                examples: [
                  'Configure ADMIN_USERNAME, ADMIN_PASSWORD e JWT_SECRET antes de usar a autenticação.',
                ],
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      if (!authConfigured()) {
        return reply.code(503).send({
          code: 'AUTH_NOT_CONFIGURED',
          message:
            'Configure ADMIN_USERNAME, ADMIN_PASSWORD e JWT_SECRET antes de usar a autenticação.',
        })
      }

      if (
        request.body.username !== config.adminUsername ||
        request.body.password !== config.adminPassword
      ) {
        return reply.code(401).send({
          code: 'INVALID_CREDENTIALS',
          message: 'Usuário ou senha inválidos.',
        })
      }

      const accessToken = await reply.jwtSign(
        { username: request.body.username },
        {
          sign: {
            sub: request.body.username,
            expiresIn: config.jwtExpiresIn,
          },
        },
      )

      return {
        accessToken,
        tokenType: 'Bearer' as const,
        expiresIn: config.jwtExpiresIn,
      }
    },
  )

  app.get(
    '/api/v1/auth/me',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Mostra quem está logado',
        description: privateDoc(
          'Serve para testar se o token está valendo: retorna o usuário dono do token.',
        ),
        security: secured,
        response: {
          200: {
            description: 'Token válido.',
            type: 'object',
            required: ['username'],
            properties: {
              username: {
                type: 'string',
                description: 'Usuário logado.',
                examples: ['admin'],
              },
            },
          },
          401: err401,
        },
      },
    },
    async (request) => {
      const session = await request.jwtVerify<{ username: string }>()
      return { username: session.username }
    },
  )

  app.post(
    '/api/v1/auth/logout',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Encerra a sessão',
        description: privateDoc(
          'Não tem corpo. O token não é invalidado no servidor: depois de chamar, descarte o token (no Swagger, use **Logout** no botão Authorize).',
        ),
        security: secured,
        response: {
          204: {
            description: 'Sessão encerrada (resposta vazia).',
            type: 'null',
          },
          401: err401,
        },
      },
    },
    async (request, reply) => {
      await request.jwtVerify()
      return reply.code(204).send()
    },
  )
}
