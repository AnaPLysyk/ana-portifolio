# Portfólio — Ana Paula de Lima Lysyk

Aplicação web do portfólio profissional, construída a partir do protótipo visual validado.

## Stack

- React
- TypeScript
- Vite
- CSS responsivo

Etapas seguintes:
- contrato OpenAPI/Swagger
- API e regras de negócio
- backend
- PostgreSQL

## Desenvolvimento local

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Organização atual

- `src/App.tsx`: composição principal do portfólio
- `src/components/Header.tsx`: cabeçalho fixo, tema e idioma
- `src/components/Assistant.tsx`: esfera/órbitas e chat
- `src/components/Editor.tsx`: login e primeira estrutura do editor
- `src/data/portfolio.ts`: conteúdo inicial desacoplado da interface
- `src/types.ts`: contrato de dados do front
- `src/styles.css`: tema, layout e responsividade

## Estratégia

O front-end está sendo construído primeiro a partir do protótipo validado. O conteúdo já foi separado do layout para facilitar a próxima etapa: definir o contrato da API e trocar a persistência local por chamadas HTTP sem reescrever os componentes.

O editor ainda usa estado/localStorage como adaptação temporária. Autenticação real, persistência, contexto do assistente e regras de edição serão migrados para a API/backend.
