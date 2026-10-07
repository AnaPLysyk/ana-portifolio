import type { FastifyInstance } from 'fastify'
import type { Project } from '../domain/types.js'
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
  'PROJECT_NOT_FOUND',
  'Projeto não encontrado.',
  'projeto-exemplo',
)
const idDoc = idParam('o projeto', 'projeto-exemplo')

export const registerProjectRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/projects',
    {
      schema: {
        tags: ['Projects'],
        summary: 'Lista os projetos',
        description: publicDoc(
          'Retorna todos os projetos na ordem em que aparecem no portfólio. Guarde o valor `revision`: ele é usado nas escritas.',
        ),
        response: {
          200: snapshotDoc('Lista de projetos.', {
            type: 'array',
            items: { $ref: 'Project#' },
          }, [examples.project]),
        },
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return {
        revision: snapshot.revision,
        updatedAt: snapshot.updatedAt,
        data: snapshot.data.projects,
      }
    },
  )

  app.get<{ Params: { id: string } }>(
    '/api/v1/projects/:id',
    {
      schema: {
        tags: ['Projects'],
        summary: 'Busca um projeto pelo id',
        description: publicDoc('Retorna um único projeto.'),
        params: idDoc,
        response: {
          200: snapshotDoc('O projeto encontrado.', {
            $ref: 'Project#',
          }),
          400: err400,
          404: notFound,
        },
      },
    },
    async (request, reply) => {
      const snapshot = portfolioService.get()
      const item = snapshot.data.projects.find(
        (entry) => entry.id === request.params.id,
      )

      if (!item) {
        return reply.code(404).send({
          code: 'PROJECT_NOT_FOUND',
          message: 'Projeto não encontrado.',
        })
      }

      return {
        revision: snapshot.revision,
        updatedAt: snapshot.updatedAt,
        data: item,
      }
    },
  )

  app.post<{ Body: RevisionBody<Project> }>(
    '/api/v1/projects',
    {
      schema: {
        tags: ['Projects'],
        summary: 'Cria um projeto',
        description: privateDoc(
          `Cria um novo projeto no portfólio. ${revisionHint}`,
        ),
        security: secured,
        body: writeBody({ $ref: 'Project#' }, examples.project),
        response: {
          201: savedResponse(
            'Projeto criado. A resposta contém o portfólio completo e a nova `revision`.',
          ),
          400: err400,
          401: err401,
          409: err409Create('Projeto', 'projeto-exemplo'),
        },
      },
    },
    async (request, reply) => {
      await request.jwtVerify()
      const result = portfolioService.createProject(
        request.body.expectedRevision,
        request.body.data,
      )
      return reply.code(201).send(result)
    },
  )

  app.put<{ Params: { id: string }; Body: RevisionBody<Project> }>(
    '/api/v1/projects/:id',
    {
      schema: {
        tags: ['Projects'],
        summary: 'Atualiza um projeto',
        description: privateDoc(
          `Troca os dados de um projeto existente. O \`id\` da URL deve ser igual ao \`data.id\` do corpo. ${revisionHint}`,
        ),
        security: secured,
        params: idDoc,
        body: writeBody({ $ref: 'Project#' }, examples.project),
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
      return portfolioService.updateProject(
        request.body.expectedRevision,
        request.params.id,
        request.body.data,
      )
    },
  )

  app.delete<{ Params: { id: string }; Querystring: RevisionQuery }>(
    '/api/v1/projects/:id',
    {
      schema: {
        tags: ['Projects'],
        summary: 'Remove um projeto',
        description: privateDoc(
          `Apaga um projeto. Não tem corpo: envie \`expectedRevision\` na URL (ex.: \`?expectedRevision=4\`). ${revisionHint}`,
        ),
        security: secured,
        params: idDoc,
        querystring: revisionQuery,
        response: {
          200: savedResponse(
            'Projeto removido. A resposta contém o portfólio completo e a nova `revision`.',
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
      return portfolioService.deleteProject(
        Number(request.query.expectedRevision),
        request.params.id,
      )
    },
  )

  app.put<{ Body: OrderBody }>(
    '/api/v1/projects/order',
    {
      schema: {
        tags: ['Projects'],
        summary: 'Reordena os projetos',
        description: privateDoc(
          `Define a nova ordem dos projetos. Envie todos os \`id\` atuais, sem repetir e sem faltar nenhum. ${revisionHint}`,
        ),
        security: secured,
        body: orderBody(['projeto-b', 'projeto-a']),
        response: {
          200: savedResponse(
            'Projetos reordenados. A resposta contém o portfólio completo e a nova `revision`.',
          ),
          400: err400,
          401: err401,
          409: err409Revision,
        },
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.reorderProjects(
        request.body.expectedRevision,
        request.body.ids,
      )
    },
  )
}
