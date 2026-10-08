// Helpers de documentação Swagger. Só descrevem o contrato: não mudam regras.

export const secured = [{ bearerAuth: [] }]

export const publicDoc = (text: string) =>
  `🔓 **Não precisa de login.**\n\n${text}`

export const privateDoc = (text: string) =>
  `🔒 **Precisa de login.**\n\n${text}`

export const revisionHint =
  'Use em `expectedRevision` a `revision` do último GET.'

export const expectedRevisionField = {
  type: 'integer',
  minimum: 1,
  description: 'Use a `revision` retornada pelo último GET.',
  examples: [4],
} as const

// --- Erros -----------------------------------------------------------------

const errorExample = (code: string, message: string, details?: object) => ({
  code,
  message,
  ...(details ? { details } : {}),
})

const errorBody = (
  description: string,
  code: string,
  message: string,
  details?: object,
) => ({
  description,
  type: 'object',
  required: ['code', 'message'],
  properties: {
    code: { type: 'string', description: 'Código do erro.', examples: [code] },
    message: {
      type: 'string',
      description: 'Explicação do erro.',
      examples: [message],
    },
    details: {
      type: 'object',
      additionalProperties: true,
      description: 'Informações extras (opcional).',
      ...(details ? { examples: [details] } : {}),
    },
  },
  examples: [errorExample(code, message, details)],
})

export const err400 = errorBody(
  'Algum dado enviado está incorreto ou faltando.',
  'VALIDATION_ERROR',
  'A requisição não atende ao contrato da API.',
)

export const err401 = errorBody(
  'Precisa fazer login ou o token não é mais válido.',
  'UNAUTHORIZED',
  'Autenticação obrigatória ou token inválido.',
)

export const err404 = (
  code = 'RESOURCE_NOT_FOUND',
  message = 'Item não encontrado.',
  id = 'exemplo-1',
) =>
  errorBody('O `id` informado não existe.', code, message, {
    id,
  })

export const err409Revision = errorBody(
  'Os dados mudaram desde o último GET. Faça um novo GET e tente de novo.',
  'REVISION_CONFLICT',
  'O portfólio foi alterado depois que esta edição começou. Recarregue a revisão atual antes de salvar.',
  { expectedRevision: 3, currentRevision: 4 },
)

export const err409AlreadyExists = (
  resource = 'Recurso',
  id = 'exemplo-1',
) =>
  errorBody(
    'ID duplicado: já existe um item com esse `id`.',
    'RESOURCE_ALREADY_EXISTS',
    `${resource} já existe.`,
    { id },
  )

export const err409Create = (resource: string, id: string) => ({
  description:
    'Os dados mudaram desde o último GET ou já existe um item com esse `id`.',
  oneOf: [
    err409Revision,
    err409AlreadyExists(resource, id),
  ],
})

// --- Respostas de sucesso --------------------------------------------------

/** Resposta padrão de leitura: { revision, updatedAt, data }. */
export const snapshotOf = (description: string, data: object, example?: unknown) => ({
  description,
  type: 'object',
  required: ['revision', 'updatedAt', 'data'],
  properties: {
    revision: {
      type: 'integer',
      description: 'Versão atual dos dados.',
      examples: [4],
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      description: 'Data da última alteração.',
      examples: ['2025-01-15T12:00:00.000Z'],
    },
    data: example === undefined ? data : { ...data, examples: [example] },
  },
})

/** Resposta padrão de escrita: o portfólio completo, já com a nova revision. */
export const savedResponse = (
  description =
    'Alteração realizada. A resposta contém o portfólio completo e a nova `revision`.',
) => ({
  description,
  $ref: 'PortfolioSnapshot#',
})

export const idParam = (what: string, example: string) => ({
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'string',
      minLength: 1,
      description: `Identificador único d${what}.`,
      examples: [example],
    },
  },
})

export const revisionQuery = {
  type: 'object',
  required: ['expectedRevision'],
  additionalProperties: false,
  properties: {
    expectedRevision: {
      ...expectedRevisionField,
      description:
        'Use a `revision` do último GET. Vai na URL, por exemplo: `?expectedRevision=4`.',
    },
  },
} as const

/** Body de escrita: { expectedRevision, data }. */
export const writeBody = (data: object, example: unknown, description?: string) => ({
  type: 'object',
  ...(description ? { description } : {}),
  required: ['expectedRevision', 'data'],
  additionalProperties: false,
  properties: {
    expectedRevision: expectedRevisionField,
    data: {
      description: 'Dados que serão salvos.',
      ...data,
    },
  },
  examples: [{ expectedRevision: 4, data: example }],
})

/** Body de reordenação: { expectedRevision, ids }. */
export const orderBody = (ids: string[]) => ({
  type: 'object',
  description: 'Nova ordem. A lista deve ter exatamente os IDs atuais, sem repetir.',
  required: ['expectedRevision', 'ids'],
  additionalProperties: false,
  properties: {
    expectedRevision: expectedRevisionField,
    ids: {
      type: 'array',
      minItems: 1,
      uniqueItems: true,
      description: 'IDs na ordem em que os itens devem aparecer.',
      items: { type: 'string', minLength: 1 },
      examples: [ids],
    },
  },
  examples: [{ expectedRevision: 4, ids }],
})
