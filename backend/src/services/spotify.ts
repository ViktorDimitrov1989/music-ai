import { clerkClient } from '@clerk/express'

interface SpotifyProfile {
  id: string
  displayName: string | null
  email: string | null
  country: string | null
  product: string | null
  imageUrl: string | null
  profileUrl: string | null
}

export class SpotifyConnectionRequiredError extends Error {}

export class SpotifyApiError extends Error {
  constructor(readonly statusCode: number) {
    super('Spotify API request failed')
  }
}

export async function getSpotifyAccessToken(
  userId: string,
): Promise<string | undefined> {
  const tokens = await clerkClient.users.getUserOauthAccessToken(
    userId,
    'spotify',
  )

  return tokens.data[0]?.token
}

export async function getSpotifyProfile(
  userId: string,
): Promise<SpotifyProfile> {
  const accessToken = await getSpotifyAccessToken(userId)

  if (!accessToken) {
    throw new SpotifyConnectionRequiredError()
  }

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new SpotifyApiError(response.status)
  }

  const profile: unknown = await response.json()

  if (!isRecord(profile) || typeof profile.id !== 'string') {
    throw new Error('Spotify returned an invalid profile response.')
  }

  const firstImage = Array.isArray(profile.images)
    ? profile.images.find(
        (image): image is { url: string } =>
          isRecord(image) && typeof image.url === 'string',
      )
    : undefined
  const externalUrls = isRecord(profile.external_urls)
    ? profile.external_urls
    : undefined

  return {
    id: profile.id,
    displayName: asNullableString(profile.display_name),
    email: asNullableString(profile.email),
    country: asNullableString(profile.country),
    product: asNullableString(profile.product),
    imageUrl: firstImage?.url ?? null,
    profileUrl: asNullableString(externalUrls?.spotify),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}
