import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { clerkMiddleware, getAuth } from '@clerk/express'
import express, { type NextFunction, type Request, type Response } from 'express'
import {
  getSpotifyProfile,
  SpotifyApiError,
  SpotifyConnectionRequiredError,
} from './services/spotify.js'

const app = express()
const publishableKey = process.env.CLERK_PUBLISHABLE_KEY
const secretKey = process.env.CLERK_SECRET_KEY
const frontendDistPath = fileURLToPath(
  new URL('../../frontend/dist/', import.meta.url),
)
const frontendIndexPath = fileURLToPath(
  new URL('../../frontend/dist/index.html', import.meta.url),
)

if (!publishableKey || !secretKey) {
  throw new Error(
    'Set CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in backend/.env before starting the backend.',
  )
}

app.use(clerkMiddleware({ publishableKey, secretKey }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.get('/api/me', async (request, response, next) => {
  const { isAuthenticated, userId } = getAuth(request)

  if (!isAuthenticated || !userId) {
    response.status(401).json({ error: 'unauthorized' })
    return
  }

  try {
    const spotify = await getSpotifyProfile(userId)
    response.json({ user: { clerkId: userId }, spotify })
  } catch (error) {
    if (error instanceof SpotifyConnectionRequiredError) {
      response.status(403).json({ error: 'spotify_connection_required' })
      return
    }

    if (error instanceof SpotifyApiError) {
      console.error(`Spotify API returned HTTP ${error.statusCode}`)
      response.status(502).json({ error: 'spotify_api_error' })
      return
    }

    next(error)
  }
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

app.use(
  (
    error: unknown,
    request: Request,
    response: Response,
    _next: NextFunction,
  ) => {
    console.error('Unhandled request error', error)

    if (request.path.startsWith('/api/')) {
      response.status(500).json({ error: 'internal_server_error' })
      return
    }

    response.status(500).send('Internal server error')
  },
)

export default app
