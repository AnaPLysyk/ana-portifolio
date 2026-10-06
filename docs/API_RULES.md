# Regras da API — Portfólio Ana

## Objetivo

O backend existe para retirar do navegador as responsabilidades de autenticação, persistência e regras de edição. O front continua responsável pela experiência visual; a API passa a ser a fonte de verdade dos dados.

## Regras principais

1. Leitura pública
   - `GET /api/v1/portfolio` não exige autenticação.
   - O recrutador nunca precisa fazer login para visualizar o portfólio.

2. Edição protegida
   - Toda gravação exige `Authorization: Bearer <token>`.
   - O token é obtido em `POST /api/v1/auth/login`.
   - Usuário, senha e segredo JWT vêm de variáveis de ambiente; não ficam hardcoded no front.

3. Salvar é atômico
   - O editor envia o documento completo para `PUT /api/v1/portfolio`.
   - Nesta fase não existem dezenas de endpoints para cada campo/card.
   - Isso combina com o funcionamento atual do editor visual: a pessoa organiza a página e confirma uma versão completa.

4. Controle de concorrência
   - `GET /portfolio` retorna `revision`.
   - O editor deve enviar essa revisão em `expectedRevision` no save.
   - Se a versão atual já mudou, a API responde `409 REVISION_CONFLICT`.
   - O front deve solicitar recarga/reconciliação em vez de sobrescrever silenciosamente.

5. Validação
   - Payload inválido retorna `400 VALIDATION_ERROR`.
   - Campos desconhecidos são rejeitados nos objetos principais.
   - Tamanhos máximos existem para impedir conteúdo acidentalmente gigantesco.

6. Aparência e editor
   - Tema, cor, espaçamento e estilos editáveis fazem parte do documento persistido.
   - Elementos livres usam posição percentual (`x`/`y`) para não depender de resolução fixa.
   - O backend guarda configuração; a regra de responsividade continua sendo responsabilidade do front.

7. Assistente
   - `POST /api/v1/assistant/messages` é público.
   - A primeira implementação responde somente com informações existentes no portfólio.
   - Uma integração futura com IA deve manter o mesmo contrato HTTP sempre que possível.

8. Banco de dados
   - A primeira implementação usa repositório em memória.
   - Reiniciar a API restaura o seed.
   - Na próxima etapa, o repositório será substituído por PostgreSQL sem alterar controllers/rotas.

## Respostas de erro

Formato padrão:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "A requisição não atende ao contrato da API.",
  "details": {}
}
```

Códigos iniciais:

- `VALIDATION_ERROR` — 400
- `INVALID_CREDENTIALS` — 401
- `UNAUTHORIZED` — 401
- `REVISION_CONFLICT` — 409
- `AUTH_NOT_CONFIGURED` — 503
- `INTERNAL_ERROR` — 500

## Próximas etapas

1. validar contrato no Swagger;
2. integrar login do editor com a API;
3. trocar localStorage do portfólio por GET/PUT;
4. validar chat contra o endpoint do assistente;
5. adicionar testes de API;
6. criar PostgreSQL e migrations;
7. substituir o repositório em memória pelo repositório SQL.
