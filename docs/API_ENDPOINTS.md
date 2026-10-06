# Endpoints — Ana Portfolio API

Base local:

```text
http://localhost:3333/api/v1
```

Swagger:

```text
http://localhost:3333/docs
```

## Health

| Método | Endpoint | Auth | Objetivo |
|---|---|---:|---|
| GET | `/health` | Não | Verificar disponibilidade da API |

## Autenticação

| Método | Endpoint | Auth | Objetivo |
|---|---|---:|---|
| POST | `/auth/login` | Não | Gerar JWT para o editor |
| GET | `/auth/me` | Sim | Validar sessão/token |
| POST | `/auth/logout` | Sim | Encerrar sessão no cliente |

## Portfólio completo

| Método | Endpoint | Auth | Objetivo |
|---|---|---:|---|
| GET | `/portfolio` | Não | Ler documento completo publicado |
| PUT | `/portfolio` | Sim | Salvar documento completo de uma vez |

## Perfil

| Método | Endpoint | Auth | Objetivo |
|---|---|---:|---|
| GET | `/profile` | Não | Nome, área, cargo, nível, empresa, CEP, endereço, localização, contatos |
| PUT | `/profile` | Sim | Atualizar dados do perfil |
| PUT | `/profile/photo` | Sim | Atualizar foto temporariamente por URL/data URL |

## Conteúdo

| Método | Endpoint | Auth | Objetivo |
|---|---|---:|---|
| GET | `/hero` | Não | Ler título/introdução da Home |
| PUT | `/hero` | Sim | Atualizar Home |
| GET | `/about` | Não | Ler Sobre |
| PUT | `/about` | Sim | Atualizar Sobre |
| GET | `/competencies` | Não | Ler competências |
| PUT | `/competencies` | Sim | Substituir competências |
| GET | `/education` | Não | Ler formação/cursos |
| PUT | `/education` | Sim | Substituir formação/cursos |
| GET | `/highlights` | Não | Ler destaques/conquistas |
| PUT | `/highlights` | Sim | Substituir destaques/conquistas |
| GET | `/content-blocks` | Não | Ler textos editáveis por chave |
| PUT | `/content-blocks` | Sim | Persistir edição direta de textos |

## Projetos

| Método | Endpoint | Auth | Objetivo |
|---|---|---:|---|
| GET | `/projects` | Não | Listar projetos |
| GET | `/projects/:id` | Não | Buscar projeto |
| POST | `/projects` | Sim | Criar projeto |
| PUT | `/projects/:id` | Sim | Atualizar projeto |
| DELETE | `/projects/:id?expectedRevision=N` | Sim | Remover projeto |
| PUT | `/projects/order` | Sim | Reordenar projetos |

## Experiência

| Método | Endpoint | Auth | Objetivo |
|---|---|---:|---|
| GET | `/experience` | Não | Listar trajetória |
| GET | `/experience/:id` | Não | Buscar experiência |
| POST | `/experience` | Sim | Criar experiência |
| PUT | `/experience/:id` | Sim | Atualizar experiência |
| DELETE | `/experience/:id?expectedRevision=N` | Sim | Remover experiência |
| PUT | `/experience/order` | Sim | Reordenar trajetória |

## Aparência

| Método | Endpoint | Auth | Objetivo |
|---|---|---:|---|
| GET | `/appearance` | Não | Ler tema/cor/intensidade/espaçamento/formato |
| PUT | `/appearance` | Sim | Salvar aparência |

## Editor visual

| Método | Endpoint | Auth | Objetivo |
|---|---|---:|---|
| GET | `/editor` | Não | Ler estado visual completo |
| PUT | `/editor` | Sim | Salvar estado visual completo |
| PUT | `/editor/layouts` | Sim | Salvar layouts por seção |
| PUT | `/editor/icons` | Sim | Salvar ícones por seção |
| PUT | `/editor/text-styles` | Sim | Salvar fonte/tamanho/peso/cor/alinhamento |
| PUT | `/editor/elements` | Sim | Salvar elementos livres/arrastáveis |
| PUT | `/editor/assistant-layout` | Sim | Salvar posição do robô e CTA |

Correspondência com o front temporário:

| localStorage atual | Endpoint futuro |
|---|---|
| `ana_portfolio_appearance_v178` | `PUT /appearance` |
| `ana_portfolio_section_icons_v178` | `PUT /editor/icons` |
| `ana_portfolio_section_layouts_v178` | `PUT /editor/layouts` |
| `ana_portfolio_elements_v181` | `PUT /editor/elements` |
| `ana_portfolio_block_styles_v182` | `PUT /editor/text-styles` |
| `ana_portfolio_assistant_layout_v185` | `PUT /editor/assistant-layout` |
| `ana_portfolio_ai_contexts_v1` | `PUT /assistant/config` |

## Assistente

| Método | Endpoint | Auth | Objetivo |
|---|---|---:|---|
| GET | `/assistant/config` | Não | Ler saudação, atalhos e contextos |
| PUT | `/assistant/config` | Sim | Salvar configuração/contextos |
| POST | `/assistant/messages` | Não | Enviar mensagem e receber resposta |

## Contrato de escrita

Toda escrita de conteúdo/configuração utiliza revisão otimista.

Exemplo:

```json
{
  "expectedRevision": 5,
  "data": {}
}
```

Sucesso:

```http
200
```

e o retorno contém a nova revisão.

Conflito:

```http
409
```

```json
{
  "code": "REVISION_CONFLICT",
  "message": "O portfólio foi alterado depois que esta edição começou.",
  "details": {
    "expectedRevision": 5,
    "currentRevision": 6
  }
}
```

## Status que precisam ser validados

- 200 — leitura/atualização;
- 201 — criação;
- 204 — logout;
- 400 — contrato inválido / ordem inválida / ID incompatível;
- 401 — token ausente/inválido ou login inválido;
- 404 — recurso inexistente;
- 409 — conflito de revisão ou ID já existente;
- 503 — autenticação não configurada.

## Gate antes do banco

A API só avança para PostgreSQL quando:

1. `npm run build:api` passar;
2. `npm run validate:api` passar;
3. Swagger abrir sem erro;
4. endpoints públicos responderem;
5. endpoints de escrita exigirem JWT;
6. CRUD de projetos e experiência funcionar;
7. revisão retornar 409 quando desatualizada;
8. editor/aparência/assistente persistirem em memória;
9. erros seguirem o contrato;
10. contrato estiver estável para iniciar Playwright.
