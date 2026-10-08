import type { FastifyInstance } from 'fastify'
import type {
  AssistantLayout,
  EditorState,
  FreeElement,
  RevisionWrite,
  SectionIconConfig,
  TextStyle,
} from '../domain/types.js'
import { portfolioService } from '../services/portfolio.service.js'
import { examples } from '../openapi.schemas.js'
import {
  err400,
  err401,
  err409Revision,
  privateDoc,
  publicDoc,
  revisionHint,
  savedResponse,
  secured,
  snapshotOf as snapshotDoc,
  writeBody,
} from '../openapi.docs.js'

const writeResponses = {
  200: savedResponse(),
  400: err400,
  401: err401,
  409: err409Revision,
}

export const registerEditorRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/editor',
    {
      schema: {
        tags: ['Editor'],
        summary: 'Mostra o estado visual do editor',
        description: publicDoc(
          'Retorna layouts, ícones, estilos de texto, elementos livres e posição do assistente.',
        ),
        response: {
          200: snapshotDoc('Estado atual do editor.', { $ref: 'EditorState#' }),
        },
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return {
        revision: snapshot.revision,
        updatedAt: snapshot.updatedAt,
        data: snapshot.data.editor,
      }
    },
  )

  app.put<{ Body: RevisionWrite<EditorState> }>(
    '/api/v1/editor',
    {
      schema: {
        tags: ['Editor'],
        summary: 'Atualiza todo o editor',
        description: privateDoc(
          `Substitui o estado visual inteiro de uma vez. Para mudar só uma parte, use os endpoints abaixo (layouts, icons, text-styles, elements, assistant-layout). ${revisionHint}`,
        ),
        security: secured,
        body: { $ref: 'EditorWrite#' },
        response: writeResponses,
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateEditor(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.put<{ Body: RevisionWrite<Record<string, string>> }>(
    '/api/v1/editor/layouts',
    {
      schema: {
        tags: ['Editor'],
        summary: 'Atualiza os layouts das seções',
        description: privateDoc(
          `Define o layout de cada seção. Chave = nome da seção, valor = nome do layout. O objeto enviado substitui o atual. ${revisionHint}`,
        ),
        security: secured,
        body: writeBody(
          {
            type: 'object',
            description: 'Pares `seção: layout`.',
            additionalProperties: { type: 'string', maxLength: 100 },
          },
          examples.sectionLayouts,
        ),
        response: writeResponses,
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateSectionLayouts(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.put<{ Body: RevisionWrite<Record<string, SectionIconConfig>> }>(
    '/api/v1/editor/icons',
    {
      schema: {
        tags: ['Editor'],
        summary: 'Atualiza os ícones das seções',
        description: privateDoc(
          `Define o ícone de cada seção. Chave = nome da seção. O objeto enviado substitui o atual. ${revisionHint}`,
        ),
        security: secured,
        body: writeBody(
          {
            type: 'object',
            description: 'Pares `seção: configuração do ícone`.',
            additionalProperties: { $ref: 'SectionIconConfig#' },
          },
          { experience: examples.sectionIcon },
        ),
        response: writeResponses,
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateSectionIcons(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.put<{ Body: RevisionWrite<Record<string, TextStyle>> }>(
    '/api/v1/editor/text-styles',
    {
      schema: {
        tags: ['Editor'],
        summary: 'Atualiza os estilos de texto',
        description: privateDoc(
          `Define fonte, tamanho, cor e alinhamento de cada texto. Chave = nome do texto. O objeto enviado substitui o atual. ${revisionHint}`,
        ),
        security: secured,
        body: writeBody(
          {
            type: 'object',
            description: 'Pares `texto: estilo`.',
            additionalProperties: { $ref: 'TextStyle#' },
          },
          { 'hero.title': examples.textStyle },
        ),
        response: writeResponses,
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateTextStyles(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.put<{ Body: RevisionWrite<FreeElement[]> }>(
    '/api/v1/editor/elements',
    {
      schema: {
        tags: ['Editor'],
        summary: 'Atualiza os elementos livres',
        description: privateDoc(
          `Envia a lista **completa** de ícones, badges, divisores e layouts posicionados na página. ${revisionHint}`,
        ),
        security: secured,
        body: writeBody(
          {
            type: 'array',
            maxItems: 500,
            description: 'Lista completa de elementos. Ela substitui a atual.',
            items: { $ref: 'FreeElement#' },
          },
          [examples.freeElement],
        ),
        response: writeResponses,
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateFreeElements(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.put<{ Body: RevisionWrite<AssistantLayout> }>(
    '/api/v1/editor/assistant-layout',
    {
      schema: {
        tags: ['Editor'],
        summary: 'Atualiza a posição do assistente',
        description: privateDoc(
          `Define onde ficam o robô e o botão de chamada (CTA), em porcentagem da tela (0 a 100). ${revisionHint}`,
        ),
        security: secured,
        body: writeBody(
          {
            type: 'object',
            required: ['robot', 'cta'],
            additionalProperties: false,
            description: 'Posição do robô e do CTA.',
            properties: {
              robot: { $ref: 'Position#' },
              cta: { $ref: 'Position#' },
            },
          },
          examples.assistantLayout,
        ),
        response: writeResponses,
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateAssistantLayout(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )
}
