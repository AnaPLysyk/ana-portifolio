import type { FastifyInstance } from 'fastify'
import type { SavePortfolioRequest } from '../domain/types.js'
import { portfolioService } from '../services/portfolio.service.js'
import {
  err400,
  err401,
  err409Revision,
  expectedRevisionField,
  privateDoc,
  publicDoc,
  savedResponse,
  secured,
} from '../openapi.docs.js'

export const registerPortfolioRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/portfolio',
    {
      schema: {
        tags: ['Portfolio'],
        summary: 'Retorna o portfólio completo',
        description: publicDoc(
          'Devolve todos os dados de uma vez: perfil, textos, projetos, experiência, aparência, assistente e editor. Também traz `revision`, usado nas escritas.',
        ),
        response: {
          200: {
            description: 'Portfólio completo com `revision` e `updatedAt`.',
            $ref: 'PortfolioSnapshot#',
          },
        },
      },
    },
    async () => portfolioService.get(),
  )

  app.put<{ Body: SavePortfolioRequest }>(
    '/api/v1/portfolio',
    {
      schema: {
        tags: ['Portfolio'],
        summary: 'Salva o portfólio completo',
        description: privateDoc(
          'Substitui **todos** os dados de uma vez. Dica: faça `GET /api/v1/portfolio`, altere o que precisar e envie o resultado em `data`. Para mudar só uma parte, prefira os endpoints específicos (profile, projects etc.).',
        ),
        security: secured,
        body: {
          type: 'object',
          description: 'Versão atual + portfólio completo.',
          required: ['expectedRevision', 'data'],
          additionalProperties: false,
          properties: {
            expectedRevision: expectedRevisionField,
            data: {
              description:
                'Portfólio completo (o mesmo formato retornado pelo GET, dentro de `data`).',
              $ref: 'PortfolioDocument#',
            },
          },
        },
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
      return portfolioService.replace(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )
}
