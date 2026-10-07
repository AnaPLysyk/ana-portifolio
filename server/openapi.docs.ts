// Helpers de documentação Swagger. Só descrevem o contrato: não mudam regras.

export const secured = [{ bearerAuth: [] }]

export const publicDoc = (text: string) =>
  `🔓 **Público** — não precisa de login.\n\n${text}`

export const privateDoc = (text: string) =>
  `🔒 **Requer Bearer Token** — faça login em \`POST /api/v1/auth/login\` e cole o \`accessToken\` no botão **Authorize**.\n\n${text}`

export const revisionHint =
  'Antes de enviar, consulte o GET correspondente e use o valor `revision` retornado em `expectedRevision`.'

export const expectedRevisionField = {
  type: 'integer',
  minimum: 1,
  description:
    'Versão atual dos dados. Use o valor `revision` retornado pelo último GET.',
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
  'Dados inválidos: algum campo está faltando ou fora do formato.',
  'VALIDATION_ERROR',
  'A requisição não atende ao contrato da API.',
)

export const err401 = errorBody(
  'Sem login: envie o Bearer Token (botão Authorize).',
  'UNAUTHORIZED',
  'Autenticação obrigatória ou token inválido.',
)

export const err404 = (
  code = 'RESOURCE_NOT_FOUND',
  message = 'Item não encontrado.',
  id = 'exemplo-1',
) =>
  errorBody('Não encontrado: o `id` informado não existe.', code, message, {
    id,
  })

export const err409Revision = errorBody(
  'Conflito de revisão: alguém alterou os dados depois do último GET. Faça um novo GET e tente de novo.',
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
    'Pode ser conflito de revisão ou tentativa de criar um `id` que já existe.',
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
      description: 'Versão atual dos dados. Use em `expectedRevision` ao salvar.',
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
      description: `ID d${what}. Use o campo \`id\` retornado na listagem.`,
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
        'Versão atual dos dados. Use o valor `revision` retornado pelo último GET (vai na URL, ex.: `?expectedRevision=4`).',
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
    data,
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
      description: 'IDs na ordem desejada (o primeiro aparece primeiro).',
      items: { type: 'string', minLength: 1 },
      examples: [ids],
    },
  },
  examples: [{ expectedRevision: 4, ids }],
})
