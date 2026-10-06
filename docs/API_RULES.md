# Regras do backend — Ana Portfolio

## 1. Separação de responsabilidades

### API HTTP
Fica em:

```text
server/routes/
```

Responsável por:
- método HTTP;
- URL;
- autenticação;
- schema de request;
- schema de response;
- status code;
- Swagger.

### Regras de negócio
Ficam em:

```text
server/services/
```

Responsáveis por:
- atualização parcial sem perder o restante do documento;
- CRUD de recursos;
- validação de existência;
- validação de duplicidade;
- ordenação;
- interpretação dos contextos do assistente.

### Persistência
Fica em:

```text
server/repositories/
```

Hoje é memória.

Depois será PostgreSQL.

## 2. Leitura pública

Visualizar o portfólio nunca exige login.

São públicos:
- portfólio completo;
- perfil;
- conteúdo;
- projetos;
- experiência;
- aparência;
- estado visual necessário para renderização;
- configuração pública do assistente;
- mensagens do assistente.

## 3. Escrita autenticada

Criar, atualizar, remover ou reordenar exige JWT.

Header:

```http
Authorization: Bearer <token>
```

O token vem de:

```http
POST /api/v1/auth/login
```

Credenciais devem existir apenas em variáveis de ambiente.

O login hardcoded atual do front será removido quando a integração HTTP for feita.

## 4. Controle de revisão

Toda alteração usa optimistic locking.

Exemplo:

```json
{
  "expectedRevision": 8,
  "data": {}
}
```

Se a revisão atual for 8:
- grava;
- revisão passa para 9.

Se a revisão atual já for 9:
- não grava;
- retorna 409.

Resposta:

```json
{
  "code": "REVISION_CONFLICT",
  "message": "O portfólio foi alterado depois que esta edição começou.",
  "details": {
    "expectedRevision": 8,
    "currentRevision": 9
  }
}
```

Nenhum endpoint de escrita pode ignorar essa regra.

## 5. Documento agregado e APIs granulares

Existem dois níveis.

### Documento completo

```http
GET /api/v1/portfolio
PUT /api/v1/portfolio
```

Serve para:
- carregar tudo de uma vez;
- confirmar uma edição completa;
- sincronizar o front após gravações.

### Recursos específicos

Existem endpoints separados para:
- perfil;
- Home;
- Sobre;
- competências;
- formação;
- destaques;
- projetos;
- experiência;
- aparência;
- layouts;
- ícones;
- estilos de texto;
- elementos livres;
- layout do assistente;
- configuração/contextos do assistente.

Isso permite testar cada regra separadamente.

## 6. Projetos

Regras:
- ID precisa ser único;
- POST com ID existente retorna 409;
- GET/PUT/DELETE de ID inexistente retorna 404;
- ID da URL e ID do payload devem ser iguais;
- alteração exige revisão atual;
- ordenação deve conter exatamente todos os IDs atuais;
- ordem duplicada/incompleta retorna 400.

## 7. Experiência

Mesmas regras de coleção aplicadas a projetos:
- ID único;
- recurso precisa existir para update/delete;
- ID URL = ID body;
- revisão obrigatória;
- ordenação precisa representar exatamente a coleção atual.

## 8. Conteúdo editável

Conteúdos estruturados têm endpoints próprios.

Textos que o editor altera diretamente na página usam:

```http
GET /api/v1/content-blocks
PUT /api/v1/content-blocks
```

Cada texto deve usar uma chave estável.

A API não deve depender do texto visível como identificador.

## 9. Aparência

A aparência persistida contém:
- tema;
- idioma;
- cor principal;
- intensidade;
- espaçamento;
- formato da página;
- assinatura do rodapé.

Responsividade não é regra do backend.

O backend persiste configuração.

O front decide como ela se comporta em Desktop/Tablet/Celular.

## 10. Editor visual

Estado persistido:
- layouts por seção;
- ícones por seção;
- estilos de texto;
- elementos livres;
- posição do robô;
- posição do CTA.

Correspondência com o localStorage temporário está documentada em:

```text
docs/API_ENDPOINTS.md
```

Depois da integração, o servidor vira a fonte de verdade.

## 11. Foto

Na etapa sem storage:
- API aceita URL ou data URL temporária.

Endpoint:

```http
PUT /api/v1/profile/photo
```

Na arquitetura final:
- arquivo deve ir para storage;
- banco guarda referência/URL;
- não devemos persistir imagem base64 em PostgreSQL como solução definitiva.

## 12. Assistente

Mensagem pública:

```http
POST /api/v1/assistant/messages
```

Configuração:

```http
GET /api/v1/assistant/config
PUT /api/v1/assistant/config
```

Nesta fase:
- resposta é determinística;
- usa contextos editáveis salvos no portfólio;
- não inventa dados fora dos contextos.

Depois:
- pode entrar um provedor de IA;
- o contrato HTTP deve ser preservado sempre que possível.

## 13. Erros

Formato:

```json
{
  "code": "CODE",
  "message": "Mensagem legível.",
  "details": {}
}
```

Códigos principais:
- `VALIDATION_ERROR` — 400;
- `INVALID_ORDER` — 400;
- `RESOURCE_ID_MISMATCH` — 400;
- `INVALID_CREDENTIALS` — 401;
- `UNAUTHORIZED` — 401;
- `RESOURCE_NOT_FOUND` — 404;
- `REVISION_CONFLICT` — 409;
- `RESOURCE_ALREADY_EXISTS` — 409;
- `AUTH_NOT_CONFIGURED` — 503;
- `INTERNAL_ERROR` — 500.

## 14. Banco

Ainda não conectar PostgreSQL.

Gate para começar banco:

1. TypeScript do backend compila;
2. Swagger abre;
3. smoke passa;
4. CRUD passa;
5. autenticação passa;
6. 400/401/404/409 passam;
7. editor visual pode ser representado pelo contrato;
8. contrato não está mudando a cada execução.

Depois disso:
- criar modelo relacional;
- migrations;
- PostgreSQL;
- repository SQL;
- testes de integração com banco.

## 15. Playwright

Não entra nesta etapa.

Depois que a API estiver estável, a automação será criada separando API e UI.

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

POM é apenas para UI.
