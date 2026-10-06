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

const revisionObjectSchema = (data: object) => ({
  type: 'object',
  required: ['expectedRevision', 'data'],
  additionalProperties: false,
  properties: {
    expectedRevision: { type: 'integer', minimum: 1 },
    data,
  },
})

export const registerEditorRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/editor',
    {
      schema: {
        tags: ['Editor'],
        summary: 'Retorna o estado visual usado pelo portfólio',
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
        summary: 'Substitui todo o estado visual do editor',
        security: [{ bearerAuth: [] }],
        body: { $ref: 'EditorWrite#' },
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
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
        description:
          'Substitui o estado hoje salvo em ana_portfolio_section_layouts_v178.',
        security: [{ bearerAuth: [] }],
        body: revisionObjectSchema({
          type: 'object',
          additionalProperties: { type: 'string', maxLength: 100 },
        }),
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
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
        summary: 'Atualiza ícones configurados por seção',
        description:
          'Substitui o estado hoje salvo em ana_portfolio_section_icons_v178.',
        security: [{ bearerAuth: [] }],
        body: revisionObjectSchema({
          type: 'object',
          additionalProperties: { $ref: 'SectionIconConfig#' },
        }),
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
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
        summary: 'Atualiza estilos dos textos editáveis',
        description:
          'Substitui os estilos hoje mantidos no localStorage pelo editor de texto.',
        security: [{ bearerAuth: [] }],
        body: revisionObjectSchema({
          type: 'object',
          additionalProperties: { $ref: 'TextStyle#' },
        }),
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
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
        summary: 'Atualiza elementos livres do quadro',
        description:
          'Ícones, badges, divisores e elementos de layout adicionados e posicionados na prévia.',
        security: [{ bearerAuth: [] }],
        body: revisionObjectSchema({
          type: 'array',
          maxItems: 500,
          items: { $ref: 'FreeElement#' },
        }),
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
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
        summary: 'Atualiza a posição do robô e do CTA',
        description:
          'Substitui o estado hoje salvo em ana_portfolio_assistant_layout_v185.',
        security: [{ bearerAuth: [] }],
        body: revisionObjectSchema({
          type: 'object',
          required: ['robot', 'cta'],
          additionalProperties: false,
          properties: {
            robot: { $ref: 'Position#' },
            cta: { $ref: 'Position#' },
          },
        }),
        response: {
          200: { $ref: 'PortfolioSnapshot#' },
          401: { $ref: 'ErrorResponse#' },
          409: { $ref: 'ErrorResponse#' },
        },
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
