import type { FastifyInstance } from 'fastify'
import type { ExperienceItem } from '../domain/types.js'
import { portfolioService } from '../services/portfolio.service.js'
import { examples } from '../openapi.schemas.js'
import {
  err400,
  err401,
  err404,
  err409Create,
  err409Revision,
  idParam,
  orderBody,
  privateDoc,
  publicDoc,
  revisionHint,
  revisionQuery,
  savedResponse,
  secured,
  snapshotOf as snapshotDoc,
  writeBody,
} from '../openapi.docs.js'

interface RevisionBody<T> {
  expectedRevision: number
  data: T
}

interface OrderBody {
  expectedRevision: number
  ids: string[]
}

interface RevisionQuery {
  expectedRevision: number
}

const notFound = err404(
  'EXPERIENCE_NOT_FOUND',
  'Experiência não encontrada.',
  'empresa-exemplo',
)
const idDoc = idParam('a experiência', 'empresa-exemplo')

export const registerExperienceRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/experience',
    {
      schema: {
        tags: ['Experience'],
        summary: 'Lista a trajetória profissional',
        description: publicDoc(
          'Retorna todas as experiências na ordem em que aparecem no portfólio. Guarde o valor `revision`: ele é usado nas escritas.',
        ),
        response: {
          200: snapshotDoc('Lista de experiências.', {
            type: 'array',
            items: { $ref: 'ExperienceItem#' },
          }, [examples.experience]),
        },
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return {
        revision: snapshot.revision,
        updatedAt: snapshot.updatedAt,
        data: snapshot.data.experience,
      }
    },
  )

  app.get<{ Params: { id: string } }>(
    '/api/v1/experience/:id',
    {
      schema: {
        tags: ['Experience'],
        summary: 'Busca uma experiência pelo id',
        description: publicDoc('Retorna uma única experiência profissional.'),
        params: idDoc,
        response: {
          200: snapshotDoc('A experiência encontrada.', {
            $ref: 'ExperienceItem#',
          }),
          400: err400,
          404: notFound,
        },
      },
    },
    async (request, reply) => {
      const snapshot = portfolioService.get()
      const item = snapshot.data.experience.find(
        (entry) => entry.id === request.params.id,
      )

      if (!item) {
        return reply.code(404).send({
          code: 'EXPERIENCE_NOT_FOUND',
          message: 'Experiência não encontrada.',
        })
      }

      return {
        revision: snapshot.revision,
        updatedAt: snapshot.updatedAt,
        data: item,
      }
    },
  )

  app.post<{ Body: RevisionBody<ExperienceItem> }>(
    '/api/v1/experience',
    {
      schema: {
        tags: ['Experience'],
        summary: 'Cria uma experiência profissional',
        description: privateDoc(
          `Cria um novo item na trajetória profissional. ${revisionHint}`,
        ),
        security: secured,
        body: writeBody({ $ref: 'ExperienceItem#' }, examples.experience),
        response: {
          201: savedResponse(
            'Experiência criada. A resposta contém o portfólio completo e a nova `revision`.',
          ),
          400: err400,
          401: err401,
          409: err409Create('Experiência', 'empresa-exemplo'),
        },
      },
    },
    async (request, reply) => {
      await request.jwtVerify()
      const result = portfolioService.createExperience(
        request.body.expectedRevision,
        request.body.data,
      )
      return reply.code(201).send(result)
    },
  )

  app.put<{ Params: { id: string }; Body: RevisionBody<ExperienceItem> }>(
    '/api/v1/experience/:id',
    {
      schema: {
        tags: ['Experience'],
        summary: 'Atualiza uma experiência profissional',
        description: privateDoc(
          `Troca os dados de uma experiência existente. O \`id\` da URL deve ser igual ao \`data.id\` do corpo. ${revisionHint}`,
        ),
        security: secured,
        params: idDoc,
        body: writeBody({ $ref: 'ExperienceItem#' }, examples.experience),
        response: {
          200: savedResponse(),
          400: err400,
          401: err401,
          404: notFound,
          409: err409Revision,
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateExperience(
        request.body.expectedRevision,
        request.params.id,
        request.body.data,
      )
    },
  )

  app.delete<{ Params: { id: string }; Querystring: RevisionQuery }>(
    '/api/v1/experience/:id',
    {
      schema: {
        tags: ['Experience'],
        summary: 'Remove uma experiência profissional',
        description: privateDoc(
          `Apaga uma experiência. Não tem corpo: envie \`expectedRevision\` na URL (ex.: \`?expectedRevision=4\`). ${revisionHint}`,
        ),
        security: secured,
        params: idDoc,
        querystring: revisionQuery,
        response: {
          200: savedResponse(
            'Experiência removida. A resposta contém o portfólio completo e a nova `revision`.',
          ),
          400: err400,
          401: err401,
          404: notFound,
          409: err409Revision,
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.deleteExperience(
        Number(request.query.expectedRevision),
        request.params.id,
      )
    },
  )

  app.put<{ Body: OrderBody }>(
    '/api/v1/experience/order',
    {
      schema: {
        tags: ['Experience'],
        summary: 'Reordena as experiências',
        description: privateDoc(
          `Define a nova ordem da trajetória. Envie todos os \`id\` atuais, sem repetir e sem faltar nenhum. ${revisionHint}`,
        ),
        security: secured,
        body: orderBody(['empresa-b', 'empresa-a']),
        response: {
          200: savedResponse(
            'Experiências reordenadas. A resposta contém o portfólio completo e a nova `revision`.',
          ),
          400: err400,
          401: err401,
          409: err409Revision,
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.reorderExperience(
        request.body.expectedRevision,
        request.body.ids,
      )
    },
  )
}
