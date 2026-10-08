import type { FastifyInstance } from 'fastify'
import type {
  AboutContent,
  CompetencyItem,
  EducationItem,
  HeroContent,
  HighlightItem,
  RevisionWrite,
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

const snapshotOf = (revision: number, updatedAt: string, data: unknown) => ({
  revision,
  updatedAt,
  data,
})

const listWriteSchema = (itemRef: string, example: unknown) =>
  writeBody(
    {
      type: 'array',
      maxItems: 100,
      description: 'Lista completa. Ela **substitui** a lista atual.',
      items: { $ref: itemRef },
    },
    [example],
    'Versão atual + lista completa de itens.',
  )

const listResponse = (description: string, itemRef: string, example: unknown) =>
  snapshotDoc(description, { type: 'array', items: { $ref: itemRef } }, [example])

const writeResponses = {
  200: savedResponse(),
  400: err400,
  401: err401,
  409: err409Revision,
}

const listHint = (what: string) =>
  `Envia a lista **inteira** de ${what}: itens que não estiverem na lista serão removidos. Dica: faça o GET, ajuste a lista e envie de volta. ${revisionHint}`

export const registerContentRoutes = async (app: FastifyInstance) => {
  app.get(
    '/api/v1/hero',
    {
      schema: {
        tags: ['Content'],
        summary: 'Mostra o texto da Home',
        description: publicDoc('Retorna o título e a apresentação da página inicial.'),
        response: {
          200: snapshotDoc('Conteúdo da Home.', { $ref: 'HeroContent#' }),
        },
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return snapshotOf(snapshot.revision, snapshot.updatedAt, snapshot.data.hero)
    },
  )

  app.put<{ Body: RevisionWrite<HeroContent> }>(
    '/api/v1/hero',
    {
      schema: {
        tags: ['Content'],
        summary: 'Atualiza o texto da Home',
        description: privateDoc(
          `Troca o título e a apresentação da página inicial. ${revisionHint}`,
        ),
        security: secured,
        body: { $ref: 'HeroWrite#' },
        response: writeResponses,
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateHero(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.get(
    '/api/v1/about',
    {
      schema: {
        tags: ['Content'],
        summary: 'Mostra a seção Sobre',
        description: publicDoc('Retorna o título e o texto da seção Sobre.'),
        response: {
          200: snapshotDoc('Conteúdo da seção Sobre.', {
            $ref: 'AboutContent#',
          }),
        },
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return snapshotOf(snapshot.revision, snapshot.updatedAt, snapshot.data.about)
    },
  )

  app.put<{ Body: RevisionWrite<AboutContent> }>(
    '/api/v1/about',
    {
      schema: {
        tags: ['Content'],
        summary: 'Atualiza a seção Sobre',
        description: privateDoc(
          `Troca o título e o texto da seção Sobre. ${revisionHint}`,
        ),
        security: secured,
        body: { $ref: 'AboutWrite#' },
        response: writeResponses,
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateAbout(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.get(
    '/api/v1/competencies',
    {
      schema: {
        tags: ['Content'],
        summary: 'Lista as competências',
        description: publicDoc('Retorna as habilidades exibidas no portfólio.'),
        response: {
          200: listResponse(
            'Lista de competências.',
            'CompetencyItem#',
            examples.competency,
          ),
        },
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return snapshotOf(
        snapshot.revision,
        snapshot.updatedAt,
        snapshot.data.competencies,
      )
    },
  )

  app.put<{ Body: RevisionWrite<CompetencyItem[]> }>(
    '/api/v1/competencies',
    {
      schema: {
        tags: ['Content'],
        summary: 'Salva a lista de competências',
        description: privateDoc(listHint('competências')),
        security: secured,
        body: listWriteSchema('CompetencyItem#', examples.competency),
        response: writeResponses,
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateCompetencies(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.get(
    '/api/v1/education',
    {
      schema: {
        tags: ['Content'],
        summary: 'Lista formação e cursos',
        description: publicDoc('Retorna a formação acadêmica e os cursos.'),
        response: {
          200: listResponse(
            'Lista de formações e cursos.',
            'EducationItem#',
            examples.education,
          ),
        },
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return snapshotOf(
        snapshot.revision,
        snapshot.updatedAt,
        snapshot.data.education,
      )
    },
  )

  app.put<{ Body: RevisionWrite<EducationItem[]> }>(
    '/api/v1/education',
    {
      schema: {
        tags: ['Content'],
        summary: 'Salva formação e cursos',
        description: privateDoc(listHint('formações e cursos')),
        security: secured,
        body: listWriteSchema('EducationItem#', examples.education),
        response: writeResponses,
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateEducation(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.get(
    '/api/v1/highlights',
    {
      schema: {
        tags: ['Content'],
        summary: 'Lista destaques e conquistas',
        description: publicDoc('Retorna os destaques exibidos no portfólio.'),
        response: {
          200: listResponse(
            'Lista de destaques.',
            'HighlightItem#',
            examples.highlight,
          ),
        },
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return snapshotOf(
        snapshot.revision,
        snapshot.updatedAt,
        snapshot.data.highlights,
      )
    },
  )

  app.put<{ Body: RevisionWrite<HighlightItem[]> }>(
    '/api/v1/highlights',
    {
      schema: {
        tags: ['Content'],
        summary: 'Salva destaques e conquistas',
        description: privateDoc(listHint('destaques')),
        security: secured,
        body: listWriteSchema('HighlightItem#', examples.highlight),
        response: writeResponses,
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateHighlights(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )

  app.get(
    '/api/v1/content-blocks',
    {
      schema: {
        tags: ['Content'],
        summary: 'Mostra os textos editáveis',
        description: publicDoc(
          'Retorna textos soltos da página, em pares `chave: texto` (ex.: `"hero.cta": "Fale comigo"`).',
        ),
        response: {
          200: snapshotDoc(
            'Textos editáveis por chave.',
            {
              type: 'object',
              additionalProperties: { type: 'string', maxLength: 10000 },
            },
            examples.contentBlocks,
          ),
        },
      },
    },
    async () => {
      const snapshot = portfolioService.get()
      return snapshotOf(
        snapshot.revision,
        snapshot.updatedAt,
        snapshot.data.contentBlocks,
      )
    },
  )

  app.put<{ Body: RevisionWrite<Record<string, string>> }>(
    '/api/v1/content-blocks',
    {
      schema: {
        tags: ['Content'],
        summary: 'Salva os textos editáveis',
        description: privateDoc(
          `Envia o conjunto **completo** de textos (o que não for enviado é removido). Cada chave é o nome do texto e o valor é o conteúdo. ${revisionHint}`,
        ),
        security: secured,
        body: writeBody(
          {
            type: 'object',
            description: 'Pares `chave: texto`.',
            additionalProperties: { type: 'string', maxLength: 10000 },
          },
          examples.contentBlocks,
        ),
        response: writeResponses,
      },
    },
    async (request) => {
      await request.jwtVerify()
      return portfolioService.updateContentBlocks(
        request.body.expectedRevision,
        request.body.data,
      )
    },
  )
}
