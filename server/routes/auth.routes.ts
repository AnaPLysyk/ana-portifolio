import type { FastifyInstance } from 'fastify'
import { authConfigured, config } from '../config.js'

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
        summary: 'Autentica o editor do portfólio',
        body: {
          type: 'object',
          required: ['username', 'password'],
          additionalProperties: false,
          properties: {
            username: { type: 'string', minLength: 1 },
            password: { type: 'string', minLength: 1 },
          },
        },
        response: {
          200: {
            type: 'object',
            required: ['accessToken', 'tokenType', 'expiresIn'],
            properties: {
              accessToken: { type: 'string' },
              tokenType: { type: 'string', const: 'Bearer' },
              expiresIn: { type: 'string' },
            },
          },
          401: { $ref: 'ErrorResponse#' },
          503: { $ref: 'ErrorResponse#' },
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
        summary: 'Retorna a sessão autenticada',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            required: ['username'],
            properties: {
              username: { type: 'string' },
            },
          },
          401: { $ref: 'ErrorResponse#' },
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
        summary: 'Encerra a sessão no cliente',
        description:
          'JWT é stateless nesta primeira versão. O cliente deve descartar o token recebido no login.',
        security: [{ bearerAuth: [] }],
        response: {
          204: {
            type: 'null',
          },
          401: { $ref: 'ErrorResponse#' },
        },
      },
    },
    async (request, reply) => {
      await request.jwtVerify()
      return reply.code(204).send()
    },
  )
}
