# Portfólio — Ana Paula de Lima Lysyk

Aplicação web do portfólio profissional com editor visual e API própria.

## Status

### Front-end
Baseline visual concluído para seguir com a arquitetura do produto.

O front já cobre:
- portfólio público;
- tema claro/escuro;
- responsividade e prévia por aparelho;
- editor visual;
- edição de texto/estilos;
- elementos livres;
- assistente visual;
- fluxo de visualizar/editar.

A persistência via `localStorage` e o login local são temporários. Eles serão substituídos pela API.

### Backend
Primeira base em implementação:

- Fastify + TypeScript;
- contrato OpenAPI;
- Swagger UI;
- autenticação JWT;
- leitura pública do portfólio;
- save autenticado com controle de revisão;
- endpoint do assistente;
- repositório em memória antes do PostgreSQL.

## Stack

Front:
- React
- TypeScript
- Vite
- CSS responsivo

Backend:
- Node.js
- TypeScript
- Fastify
- OpenAPI / Swagger
- JWT

Próxima persistência:
- PostgreSQL

## Desenvolvimento local

Instale as dependências:

```bash
npm install
```

### Front-end

```bash
npm run dev:front
```

Acesse:

```text
http://localhost:5173
```

### API

Crie o arquivo local de ambiente:

PowerShell:

```powershell
Copy-Item .env.example .env
```

Edite o `.env` e defina principalmente:

```env
ADMIN_USERNAME=ana
ADMIN_PASSWORD=sua-senha-local
JWT_SECRET=um-segredo-local-forte
```

Suba a API:

```bash
npm run dev:api
```

API:

```text
http://localhost:3333
```

Swagger:

```text
http://localhost:3333/docs
```

Health:

```text
http://localhost:3333/api/v1/health
```

## Build

Front + API:

```bash
npm run build
```

Somente front:

```bash
npm run build:front
```

Somente API:

```bash
npm run build:api
```

## Contrato da API

- `docs/openapi.yaml` — contrato OpenAPI
- `docs/API_RULES.md` — regras de negócio e decisões da API
- `/docs` — Swagger UI quando a API estiver rodando

Endpoints iniciais:

- `GET /api/v1/health`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `GET /api/v1/portfolio`
- `PUT /api/v1/portfolio`
- `POST /api/v1/assistant/messages`

## Organização

Front:

- `src/App.tsx` — composição principal
- `src/components/` — componentes React
- `src/data/portfolio.ts` — conteúdo inicial do front
- `src/types.ts` — contratos atuais do front
- `public/parity/` — refinamentos visuais do protótipo validado

Backend:

- `server/app.ts` — configuração do Fastify/Swagger
- `server/index.ts` — inicialização da API
- `server/domain/` — contratos de domínio
- `server/data/` — seed temporário
- `server/repositories/` — acesso/persistência
- `server/routes/` — endpoints HTTP
- `server/services/` — regras de aplicação
- `server/openapi.schemas.ts` — schemas usados pelo Swagger/runtime

## Estratégia de evolução

1. congelar o baseline visual do front;
2. validar o contrato OpenAPI;
3. ligar autenticação e persistência do editor à API;
4. substituir `localStorage`;
5. adicionar testes de API;
6. modelar PostgreSQL e migrations;
7. substituir o repositório em memória pelo banco;
8. preparar deploy do front e da API.
