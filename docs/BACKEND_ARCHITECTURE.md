# Arquitetura — API, backend e persistência

## Onde está cada coisa

```text
ana-portifolio/
├─ src/                         FRONT-END
│  ├─ components/
│  ├─ data/
│  └─ ...
│
├─ server/                      BACKEND
│  ├─ index.ts                  sobe o servidor HTTP
│  ├─ app.ts                    monta Fastify, Swagger, JWT e registra rotas
│  ├─ config.ts                 variáveis de ambiente
│  ├─ openapi.schemas.ts        schemas usados pela API/Swagger
│  │
│  ├─ routes/                   API HTTP
│  │  ├─ health.routes.ts
│  │  ├─ auth.routes.ts
│  │  ├─ portfolio.routes.ts
│  │  ├─ profile.routes.ts
│  │  ├─ content.routes.ts
│  │  ├─ projects.routes.ts
│  │  ├─ experience.routes.ts
│  │  ├─ appearance.routes.ts
│  │  ├─ editor.routes.ts
│  │  └─ assistant.routes.ts
│  │
│  ├─ services/                 REGRAS DE NEGÓCIO
│  │  ├─ portfolio.service.ts
│  │  └─ assistant.service.ts
│  │
│  ├─ domain/                   MODELOS/CONTRATOS DO BACKEND
│  │  └─ types.ts
│  │
│  ├─ repositories/             PERSISTÊNCIA
│  │  └─ portfolio.repository.ts
│  │
│  ├─ data/                     SEED TEMPORÁRIO
│  │  └─ portfolio.seed.ts
│  │
│  └─ validation/               VALIDAÇÃO TÉCNICA SEM PLAYWRIGHT
│     └─ api.smoke.ts
│
└─ docs/
   ├─ openapi.yaml
   ├─ API_RULES.md
   ├─ API_ENDPOINTS.md
   └─ BACKEND_ARCHITECTURE.md
```

## API

API significa a camada HTTP.

Ela está em:

```text
server/routes/
```

É ali que ficam:

- URL;
- método HTTP;
- autenticação;
- request;
- response;
- status code;
- schema Swagger.

Exemplo:

```text
server/routes/projects.routes.ts
```

define:

```http
GET    /api/v1/projects
GET    /api/v1/projects/:id
POST   /api/v1/projects
PUT    /api/v1/projects/:id
DELETE /api/v1/projects/:id
PUT    /api/v1/projects/order
```

A rota NÃO deve concentrar regra de negócio.

## Backend / regras

As regras ficam em:

```text
server/services/
```

Exemplo:

```text
server/services/portfolio.service.ts
```

É ali que o sistema decide:

- se um projeto já existe;
- se um item existe antes de atualizar/remover;
- se a ordenação é válida;
- como atualizar apenas parte do portfólio;
- como preservar o restante do documento;
- como interpretar a revisão enviada.

O assistente tem regra própria em:

```text
server/services/assistant.service.ts
```

## Persistência

Hoje:

```text
server/repositories/portfolio.repository.ts
```

mantém o documento em memória.

Isso é temporário.

A próxima etapa troca essa implementação por PostgreSQL.

A API e as regras NÃO devem precisar mudar quando o banco entrar.

Fluxo esperado:

```text
Front
  ↓ HTTP
Route
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

## Controle de revisão

Toda gravação recebe:

```json
{
  "expectedRevision": 3,
  "data": {}
}
```

Se a revisão atual ainda for 3:

```text
salva → revisão 4
```

Se a revisão atual já for 4:

```http
409 REVISION_CONFLICT
```

Isso impede uma aba/edição antiga de sobrescrever uma versão mais nova.

## Autenticação

Leitura pública:

- não exige token.

Edição:

- exige JWT.

Fluxo:

```text
POST /api/v1/auth/login
        ↓
accessToken
        ↓
Authorization: Bearer <token>
        ↓
PUT / POST / DELETE
```

Credenciais vêm do `.env`.

Nenhuma senha do editor deve permanecer hardcoded no React quando a integração da API for feita.

## Swagger

Com a API rodando:

```text
http://localhost:3333/docs
```

O Swagger é construído a partir das rotas reais em `server/routes/` e dos schemas em `server/openapi.schemas.ts`.

## Validação antes do Playwright

Primeiro:

```powershell
npm run build:api
npm run validate:api
```

O smoke usa `Fastify.inject`, então testa as rotas reais sem navegador e sem precisar subir uma porta.

Depois que contrato + smoke estiverem estáveis, entra a estrutura Playwright separando API e UI.

## Playwright — próxima fase, ainda não agora

Estrutura planejada:

```text
playwright/
├─ features/
│  ├─ api/
│  └─ ui/
├─ steps/
│  ├─ api/
│  └─ ui/
├─ pom/
│  └─ ui/
├─ utils/
│  ├─ api/
│  ├─ auth/
│  ├─ data/
│  └─ evidence/
└─ fixtures/
```

API não precisa de POM. POM será usado na UI.

Só começamos essa fase depois que a API atual estiver compilando e passando no smoke.
