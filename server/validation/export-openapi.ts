import { readFileSync, writeFileSync } from 'node:fs'

process.env.ADMIN_USERNAME ??= 'openapi-export'
process.env.ADMIN_PASSWORD ??= 'openapi-export'
process.env.JWT_SECRET ??= 'openapi-export-secret-with-enough-entropy'

const { buildApp } = await import('../app.js')

const app = await buildApp()
await app.ready()

const yaml = (app.swagger({ yaml: true }) as string).trimEnd() + '\n'
const target = new URL('../../docs/openapi.yaml', import.meta.url)

// --check: só confere se docs/openapi.yaml está igual ao Swagger gerado.
if (process.argv.includes('--check')) {
  const current = readFileSync(target, 'utf8').replace(/\r\n/g, '\n')
  await app.close()
  if (current !== yaml) {
    console.error('docs/openapi.yaml desatualizado. Rode: npm run docs:openapi')
    process.exit(1)
  }
  console.log('OPENAPI_SYNC_OK')
} else {
  writeFileSync(target, yaml)
  await app.close()
  console.log('docs/openapi.yaml atualizado a partir do Swagger gerado.')
}
