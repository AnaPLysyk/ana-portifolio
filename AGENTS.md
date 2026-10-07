# AGENTS.md

Contrato permanente de desenvolvimento do repositório `ana-portifolio`.

## Objetivo do Projeto

Este projeto é um portfólio profissional real. Ele precisa ficar funcional o quanto antes para uso em candidaturas e entrevistas. O código também tem finalidade didática: deve ser possível ler, entender, explicar e aprender com ele.

Não trate este projeto como sistema enterprise complexo.

## Antes de Alterar

Antes de qualquer mudança:

1. Leia a estrutura atual do projeto.
2. Leia `README.md`.
3. Leia os documentos em `docs/`.
4. Leia `package.json`.
5. Entenda frontend, API, backend, persistência e testes.
6. Não comece criando arquivos: primeiro investigue.

## Prioridade

O objetivo principal é colocar o portfólio em funcionamento completo rapidamente, sem destruir ou reescrever o que já funciona.

Ordem de prioridade:

funcionalidade > estabilidade > simplicidade > clareza > didática > abstrações sofisticadas

Não fazer engenharia excessiva.

## Frontend Protegido

O frontend visual já passou por muitas rodadas de refinamento. A aparência atual é baseline aprovada.

Não pode:

- redesenhar páginas sem solicitação;
- mudar layout por preferência própria;
- alterar cores, espaçamentos ou responsividade sem necessidade;
- substituir componentes funcionando só para "melhorar arquitetura";
- refazer o protótipo;
- remover comportamentos existentes;
- misturar grandes refactors visuais com tarefas de backend.

Mudanças no frontend só devem ocorrer para:

- concluir a migração para React;
- integrar o frontend à API;
- corrigir defeito;
- implementar funcionalidade explicitamente solicitada.

A aparência deve permanecer equivalente ao protótipo aprovado.

## React

O objetivo é chegar a um frontend React + TypeScript compreensível.

Preferir:

- componentes pequenos quando houver reutilização real;
- nomes claros;
- fluxo de dados fácil de acompanhar;
- poucas camadas;
- código explícito.

Evitar:

- abstrações prematuras;
- hooks genéricos sem necessidade;
- factories;
- wrappers desnecessários;
- providers para tudo;
- dezenas de componentes minúsculos sem benefício;
- bibliotecas novas quando React/TypeScript já resolvem.

Uma pessoa estudando React deve conseguir seguir o código.

## API e Backend

Stack atual:

- Node.js;
- TypeScript;
- Fastify.

Separação obrigatória:

- `routes`: contrato HTTP, autenticação, request, response, status e Swagger;
- `services`: regras de negócio;
- `repositories`: persistência;
- `domain`: tipos do domínio.

Uma route não deve concentrar regra de negócio. Um repository não deve decidir regra de negócio. Não criar novas camadas sem necessidade real.

## Swagger / OpenAPI

O Swagger deve funcionar como material de aprendizado.

Cada endpoint deve deixar claro:

- o que faz;
- se exige autenticação;
- parâmetros;
- body;
- campos obrigatórios;
- exemplos de request e response;
- status possíveis;
- erros esperados.

O Swagger deve refletir o comportamento real da API. Não manter documentação mentindo sobre o código.

## Persistência

Estado atual: repository em memória.

Persistência final planejada: PostgreSQL.

A entrada do PostgreSQL deve substituir a persistência sem reescrever routes e regras de negócio.

Não espalhar SQL pelo projeto. Não criar ORM ou estrutura complexa sem avaliar necessidade. Escolher a solução mais simples que satisfaça o projeto e seja fácil de explicar em entrevista.

## Testes

Ordem planejada:

API funcional -> frontend React integrado -> testes automatizados -> PostgreSQL -> regressão completa

Para Playwright, manter separação clara entre API e UI:

```text
playwright/
  features/
    api/
    ui/
  steps/
    api/
    ui/
  pom/
    ui/
  utils/
    api/
    auth/
    data/
    evidence/
  fixtures/
```

POM é somente para UI. Não misturar automação de API com Page Object. Testes devem validar comportamento, não detalhes internos desnecessários.

## Organização

Regra central:

NÃO CRIAR UMA NOVA PASTA OU ARQUIVO SEM PRIMEIRO VERIFICAR SE O CONTEÚDO CABE EM ALGO QUE JÁ EXISTE.

Evitar:

- pastas com apenas um arquivo sem motivo;
- arquivos duplicados;
- versões `v1`, `v2`, `final`, `final2`;
- `utils` genéricos sem domínio claro;
- helpers que só escondem uma linha;
- código morto;
- arquivos temporários;
- documentação duplicada.

Antes de criar, pesquise. Antes de duplicar, reutilize. Antes de abstrair, prove a necessidade.

## Refactor

Se algo funciona, não refatorar apenas porque existe uma maneira mais elegante.

Refactor precisa de motivo concreto:

- bug;
- duplicação relevante;
- dificuldade real de manutenção;
- impedimento para próxima funcionalidade;
- violação deste contrato.

Não misturar refactor amplo com implementação funcional.

## Menor Mudança

Para qualquer tarefa, faça a menor alteração que resolva corretamente o problema.

Não modificar arquivos sem relação com a tarefa. Não aproveitar uma tarefa pequena para reorganizar metade do projeto.

## Requisitos

Não inventar funcionalidades porque "seria interessante".

Se algo não estiver solicitado ou previsto pela arquitetura atual, não implementar. Pode sugerir ao final, mas não incluir automaticamente.

## Dependências

Não instalar pacote novo automaticamente.

Antes de adicionar dependência:

1. verifique se já existe solução no projeto;
2. verifique se Node, Fastify, React ou TypeScript já resolvem;
3. justifique a necessidade.

Evitar aumentar a stack sem ganho real.

## Segurança Contra Regressão

Antes de editar, entenda o comportamento existente. Depois de editar, execute as validações relacionadas.

Quando aplicável:

```bash
npm run build:front
npm run build:api
npm run validate:api
npm run build
```

Não declarar uma tarefa concluída se build/testes relacionados estiverem falhando. Não "resolver" teste removendo validação.

## Commits

Cada implementação deve ser pequena e coerente.

Evitar commits gigantes misturando frontend, backend, documentação, refactor e testes quando não fazem parte da mesma necessidade.

Mensagens devem explicar o propósito da mudança.

## Como Trabalhar

Antes de implementar:

1. entenda o pedido;
2. localize onde isso pertence na arquitetura;
3. verifique o código existente;
4. identifique a menor mudança necessária;
5. implemente;
6. valide;
7. informe objetivamente o que mudou.

## Escolha Entre Soluções

Quando houver duas soluções, escolher preferencialmente:

- a mais simples;
- a que usa menos arquivos;
- a que introduz menos conceitos;
- a que mantém o padrão existente;
- a que seja mais fácil de explicar;
- a que tenha menor risco de regressão.

Não escolher arquitetura mais complexa apenas porque seria comum em sistemas grandes.

## Finalidade Didática

Código inteligente não é código difícil.

Neste projeto, qualidade significa:

- clareza;
- nomes bons;
- responsabilidades visíveis;
- fluxo fácil de seguir;
- pouca duplicação;
- testabilidade;
- comportamento previsível.

Uma pessoa em aprendizado deve conseguir abrir uma route e entender para onde a chamada vai depois.

## Linguagem e Legibilidade

Português simples é o idioma principal do projeto sempre que isso melhorar a compreensão.

Usar português, quando fizer sentido, em documentação, Swagger, mensagens de erro, descrições, textos de negócio, nomes ligados ao domínio, cenários de teste, features BDD e nomes criados pelo próprio projeto. A intenção é permitir que alguém leia o código e entenda o fluxo sem traduzir mentalmente termos desnecessários.

Não traduzir o que pertence à tecnologia: GET, POST, PUT, DELETE, HTTP, JSON, JWT, API, React, Fastify, Playwright, TypeScript, PostgreSQL, palavras reservadas, APIs externas e nomes exigidos por bibliotecas. Português deve melhorar a compreensão, não criar uma convenção artificial.

Preferir linguagem de negócio antes de linguagem técnica. Nomes devem explicar intenção, como `buscarExperiencias`, `criarProjeto`, `atualizarPerfil`, `removerExperiencia` e `validarRevisao`, em vez de nomes vagos como `handleData`, `processItem`, `executeAction`, `doStuff`, `helper` ou `manager`.

Código deve ser lido quase como uma frase: o que entra, o que acontece e o que sai. Evitar código compacto ou "inteligente" que exija conhecimento avançado para ser compreendido.

Usar BDD como referência de clareza, mesmo fora de Gherkin: dado um contexto, quando uma ação acontece, então um resultado é esperado. Isso deve influenciar testes, regras de negócio, nomes de funções e organização dos fluxos.

Comentários não devem explicar código ruim ou óbvio. Primeiro melhore nomes e fluxo. Comente apenas decisão não óbvia, restrição, motivo de solução ou comportamento externo importante. O código explica "o que"; o comentário, quando necessário, explica "por quê".

Manter estrutura simples. Não criar `controllers`, `use-cases`, `adapters`, `facades`, `managers`, `providers`, `mappers` ou `factories` apenas porque esses padrões existem. Criar camada nova somente quando houver necessidade concreta demonstrável.

Não fazer renomeação em massa. O projeto já possui código funcional com nomes em inglês. Aplicar esta convenção progressivamente em código novo, áreas já alteradas ou renomeações que realmente melhorem compreensão sem causar regressão.

Antes de finalizar, perguntar: "Uma pessoa que conhece o básico de programação conseguiria entender o que isso faz?" Se a resposta for não, simplificar antes de adicionar documentação ou abstrações.

A arquitetura deve ajudar a autora a explicar em entrevista onde começa uma requisição, por onde ela passa, onde está a regra, onde os dados são armazenados, como o frontend recebe a resposta e como o comportamento é testado.

## Roadmap Atual

Até o usuário alterar explicitamente, seguir esta direção:

1. estabilizar e documentar completamente API/Swagger;
2. finalizar backend necessário;
3. consolidar frontend em React sem alterar o design aprovado;
4. integrar React com API;
5. implementar testes Playwright API;
6. implementar testes Playwright UI;
7. adicionar PostgreSQL;
8. executar regressão;
9. preparar deploy;
10. colocar o portfólio disponível para uso profissional.

Não inverter esta ordem sem justificativa concreta.

## Regra de Parada

Se uma tarefa exigir:

- reescrever grande parte do frontend;
- trocar framework;
- criar várias novas camadas;
- mudar contrato público da API;
- remover funcionalidade;
- adicionar infraestrutura relevante;
- alterar arquitetura estabelecida;

PARE.

Explique primeiro o que precisa mudar, por quê, qual impacto e qual alternativa mais simples existe.

## Definição de Pronto

Uma tarefa só está pronta quando:

- atende exatamente o solicitado;
- não criou complexidade desnecessária;
- respeita a arquitetura;
- não regrediu comportamento existente;
- passou nas validações aplicáveis;
- não deixou código temporário;
- não duplicou documentação;
- é possível explicar o que foi feito de maneira simples.

## Filosofia Final

"Se for difícil de explicar, provavelmente ainda pode ser simplificado."

"Primeiro entender. Depois mudar. Sempre pela solução mais simples que preserve o que já funciona."
