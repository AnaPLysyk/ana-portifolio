import type { FastifyInstance } from 'fastify'
import type { Profile, RevisionWrite } from '../domain/types.js'
import { portfolioService } from '../services/portfolio.service.js'
import {
  err400,
  err401,
  err409Revision,
  expectedRevisionField,
  privateDoc,
  publicDoc,
  revisionHint,
  savedResponse,
  secured,
  snapshotOf as snapshotDoc,
} from '../openapi.docs.js'

interface PhotoBody {
  expectedRevision: number
  dataUrl: string
}

const snapshotOf = (revision: number, updatedAt: string, data: unknown) => ({
  revision,
  updatedAt,
  data,
})

export const registerProfileRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/profile',
    {
      schema: {
        tags: ['Profile'],
        summary: 'Mostra o perfil',
        description: publicDoc(
          'Retorna nome, cargo, localização, contatos, links e foto.',
        ),
        response: {
          200: snapshotDoc('Perfil atual.', { $ref: 'Profile#' }),
        },
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return snapshotOf(snapshot.revision, snapshot.updatedAt, snapshot.data.profile)
    },
  )

  app.put<{ Body: RevisionWrite<Profile> }>(
    '/api/v1/profile',
    {
      schema: {
        tags: ['Profile'],
        summary: 'Atualiza o perfil',
        description: privateDoc(
          `Troca nome, cargo, localização, contatos e links. Envie todos os campos obrigatórios de \`data\`. ${revisionHint}`,
        ),
        security: secured,
        body: { $ref: 'ProfileWrite#' },
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
      return portfolioService.updateProfile(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.put<{ Body: PhotoBody }>(
    '/api/v1/profile/photo',
    {
      schema: {
        tags: ['Profile'],
        summary: 'Atualiza a foto do perfil',
        description: privateDoc(
          `Troca só a foto, mantendo o resto do perfil. Aceita um link de imagem (\`https://...\`) ou uma imagem em base64 (\`data:image/png;base64,...\`). ${revisionHint}`,
        ),
        security: secured,
        body: {
          type: 'object',
          required: ['expectedRevision', 'dataUrl'],
          additionalProperties: false,
          properties: {
            expectedRevision: expectedRevisionField,
            dataUrl: {
              type: 'string',
              minLength: 1,
              maxLength: 3000000,
              description:
                'Link da imagem ou imagem em base64 (`data:image/png|jpeg|jpg|webp;base64,...`).',
              examples: ['https://exemplo.com/foto.jpg'],
              anyOf: [
                { format: 'uri' },
                { pattern: '^data:image/(png|jpeg|jpg|webp);base64,' },
              ],
            },
          },
          examples: [
            {
              expectedRevision: 4,
              dataUrl: 'https://exemplo.com/foto.jpg',
            },
          ],
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
      const current = portfolioService.get().data.profile
      return portfolioService.updateProfile(request.body.expectedRevision, {
        ...current,
        photoUrl: request.body.dataUrl,
      })
    },
  )
}
