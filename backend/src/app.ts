import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import express from 'express'

const app = express()
const frontendDistPath = fileURLToPath(
  new URL('../../frontend/dist/', import.meta.url),
)
const frontendIndexPath = fileURLToPath(
  new URL('../../frontend/dist/index.html', import.meta.url),
)

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'Not found' })
})

if (existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath))
}

app.use((request, response, next) => {
  if (request.method !== 'GET' || request.path.startsWith('/api/')) {
    next()
    return
  }

  if (!existsSync(frontendIndexPath)) {
    next()
    return
  }

  response.sendFile(frontendIndexPath)
})

export default app
