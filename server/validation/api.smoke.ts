import assert from 'node:assert/strict'

process.env.API_HOST = '127.0.0.1'
process.env.API_PORT = '3333'
process.env.FRONTEND_ORIGIN = 'http://localhost:5173'
process.env.ADMIN_USERNAME = 'api-smoke'
process.env.ADMIN_PASSWORD = 'api-smoke-password'
process.env.JWT_SECRET = 'api-smoke-secret-with-enough-entropy'
process.env.JWT_EXPIRES_IN = '15m'

const { buildApp } = await import('../app.js')
const { portfolioRepository } = await import(
  '../repositories/portfolio.repository.js'
)

const app = await buildApp()
await app.ready()

portfolioRepository.reset()

let checks = 0

const check = (condition: unknown, message: string) => {
  assert.ok(condition, message)
  checks += 1
  console.log(`PASS | ${message}`)
}

const json = <T>(response: { body: string }): T =>
  JSON.parse(response.body) as T

try {
  const health = await app.inject({
    method: 'GET',
    url: '/api/v1/health',
  })
  check(health.statusCode === 200, 'GET /health retorna 200')

  const publicPortfolio = await app.inject({
    method: 'GET',
    url: '/api/v1/portfolio',
  })
  check(publicPortfolio.statusCode === 200, 'GET /portfolio é público')
  let portfolio = json<any>(publicPortfolio)
  check(portfolio.revision === 1, 'portfolio inicia na revisão 1')

  const unauthorized = await app.inject({
    method: 'PUT',
    url: '/api/v1/profile',
    payload: {
      expectedRevision: portfolio.revision,
      data: portfolio.data.profile,
    },
  })
  check(unauthorized.statusCode === 401, 'escrita sem JWT retorna 401')

  const invalidLogin = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/login',
    payload: {
      username: 'api-smoke',
      password: 'errada',
    },
  })
  check(invalidLogin.statusCode === 401, 'login inválido retorna 401')

  const login = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/login',
    payload: {
      username: 'api-smoke',
      password: 'api-smoke-password',
    },
  })
  check(login.statusCode === 200, 'login válido retorna 200')
  const accessToken = json<any>(login).accessToken as string
  check(Boolean(accessToken), 'login retorna accessToken')

  const auth = {
    authorization: `Bearer ${accessToken}`,
  }

  const me = await app.inject({
    method: 'GET',
    url: '/api/v1/auth/me',
    headers: auth,
  })
  check(me.statusCode === 200, 'GET /auth/me valida JWT')

  const profile = await app.inject({
    method: 'GET',
    url: '/api/v1/profile',
  })
  check(profile.statusCode === 200, 'GET /profile retorna 200')
  const profilePayload = json<any>(profile)

  const saveProfile = await app.inject({
    method: 'PUT',
    url: '/api/v1/profile',
    headers: auth,
    payload: {
      expectedRevision: profilePayload.revision,
      data: {
        ...profilePayload.data,
        company: 'Smoke Test',
      },
    },
  })
  check(saveProfile.statusCode === 200, 'PUT /profile autenticado salva')
  portfolio = json<any>(saveProfile)
  check(portfolio.revision === 2, 'salvar perfil incrementa revisão')

  const staleProfile = await app.inject({
    method: 'PUT',
    url: '/api/v1/profile',
    headers: auth,
    payload: {
      expectedRevision: 1,
      data: portfolio.data.profile,
    },
  })
  check(staleProfile.statusCode === 409, 'revisão antiga retorna 409')
  check(
    json<any>(staleProfile).code === 'REVISION_CONFLICT',
    'conflito retorna REVISION_CONFLICT',
  )

  const invalidHero = await app.inject({
    method: 'PUT',
    url: '/api/v1/hero',
    headers: auth,
    payload: {
      expectedRevision: 2,
      data: {
        title: 'Sem intro',
      },
    },
  })
  check(invalidHero.statusCode === 400, 'payload inválido retorna 400')

  const createProject = await app.inject({
    method: 'POST',
    url: '/api/v1/projects',
    headers: auth,
    payload: {
      expectedRevision: 2,
      data: {
        id: 'api-smoke-project',
        name: 'API Smoke Project',
        description: 'Projeto temporário para validação da API.',
        stack: ['Fastify'],
        href: 'https://github.com/AnaPLysyk',
        status: 'teste',
        visibility: 'private',
        linked: false,
      },
    },
  })
  check(createProject.statusCode === 201, 'POST /projects cria projeto')
  portfolio = json<any>(createProject)
  check(portfolio.revision === 3, 'criar projeto incrementa revisão')

  const getProject = await app.inject({
    method: 'GET',
    url: '/api/v1/projects/api-smoke-project',
  })
  check(getProject.statusCode === 200, 'GET /projects/:id encontra projeto')

  const updateProject = await app.inject({
    method: 'PUT',
    url: '/api/v1/projects/api-smoke-project',
    headers: auth,
    payload: {
      expectedRevision: 3,
      data: {
        ...json<any>(getProject).data,
        description: 'Projeto atualizado pelo smoke.',
      },
    },
  })
  check(updateProject.statusCode === 200, 'PUT /projects/:id atualiza projeto')
  portfolio = json<any>(updateProject)
  check(portfolio.revision === 4, 'atualizar projeto incrementa revisão')

  const projectIds = portfolio.data.projects
    .map((item: any) => item.id)
    .reverse()

  const reorderProjects = await app.inject({
    method: 'PUT',
    url: '/api/v1/projects/order',
    headers: auth,
    payload: {
      expectedRevision: 4,
      ids: projectIds,
    },
  })
  check(reorderProjects.statusCode === 200, 'PUT /projects/order reordena')
  portfolio = json<any>(reorderProjects)
  check(portfolio.revision === 5, 'reordenar incrementa revisão')

  const deleteProject = await app.inject({
    method: 'DELETE',
    url: '/api/v1/projects/api-smoke-project?expectedRevision=5',
    headers: auth,
  })
  check(deleteProject.statusCode === 200, 'DELETE /projects/:id remove projeto')
  portfolio = json<any>(deleteProject)
  check(portfolio.revision === 6, 'remover projeto incrementa revisão')

  const createExperience = await app.inject({
    method: 'POST',
    url: '/api/v1/experience',
    headers: auth,
    payload: {
      expectedRevision: 6,
      data: {
        id: 'api-smoke-experience',
        period: '2026',
        company: 'Smoke',
        role: 'QA',
        summary: 'Validação temporária.',
        details: 'Registro criado para validar CRUD.',
      },
    },
  })
  check(
    createExperience.statusCode === 201,
    'POST /experience cria experiência',
  )
  portfolio = json<any>(createExperience)

  const deleteExperience = await app.inject({
    method: 'DELETE',
    url: `/api/v1/experience/api-smoke-experience?expectedRevision=${portfolio.revision}`,
    headers: auth,
  })
  check(
    deleteExperience.statusCode === 200,
    'DELETE /experience/:id remove experiência',
  )
  portfolio = json<any>(deleteExperience)

  const appearanceGet = await app.inject({
    method: 'GET',
    url: '/api/v1/appearance',
  })
  check(appearanceGet.statusCode === 200, 'GET /appearance retorna 200')

  const appearanceData = json<any>(appearanceGet).data
  const appearancePut = await app.inject({
    method: 'PUT',
    url: '/api/v1/appearance',
    headers: auth,
    payload: {
      expectedRevision: portfolio.revision,
      data: {
        ...appearanceData,
        intensity: 73,
      },
    },
  })
  check(appearancePut.statusCode === 200, 'PUT /appearance salva aparência')
  portfolio = json<any>(appearancePut)

  const editorLayouts = await app.inject({
    method: 'PUT',
    url: '/api/v1/editor/layouts',
    headers: auth,
    payload: {
      expectedRevision: portfolio.revision,
      data: {
        ...portfolio.data.editor.sectionLayouts,
        projetos: 'grid',
      },
    },
  })
  check(editorLayouts.statusCode === 200, 'PUT /editor/layouts salva layouts')
  portfolio = json<any>(editorLayouts)

  const assistantGet = await app.inject({
    method: 'GET',
    url: '/api/v1/assistant/config',
  })
  check(assistantGet.statusCode === 200, 'GET /assistant/config retorna 200')

  const assistantPut = await app.inject({
    method: 'PUT',
    url: '/api/v1/assistant/config',
    headers: auth,
    payload: {
      expectedRevision: portfolio.revision,
      data: json<any>(assistantGet).data,
    },
  })
  check(
    assistantPut.statusCode === 200,
    'PUT /assistant/config salva configuração',
  )
  portfolio = json<any>(assistantPut)

  const assistantMessage = await app.inject({
    method: 'POST',
    url: '/api/v1/assistant/messages',
    payload: {
      message: 'Como você trabalha com automação e Playwright?',
    },
  })
  check(
    assistantMessage.statusCode === 200,
    'POST /assistant/messages responde',
  )
  check(
    typeof json<any>(assistantMessage).reply === 'string',
    'assistente retorna reply textual',
  )

  const editorGet = await app.inject({
    method: 'GET',
    url: '/api/v1/editor',
  })
  check(editorGet.statusCode === 200, 'GET /editor retorna estado visual')

  const finalPortfolio = await app.inject({
    method: 'GET',
    url: '/api/v1/portfolio',
  })
  check(finalPortfolio.statusCode === 200, 'GET /portfolio continua íntegro')
  check(
    json<any>(finalPortfolio).revision === portfolio.revision,
    'revisão final é consistente entre endpoints',
  )

  console.log('')
  console.log(`API_SMOKE_OK | checks=${checks} | revision=${portfolio.revision}`)
} finally {
  await app.close()
}
