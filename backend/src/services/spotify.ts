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

export interface RecentlyPlayedTrack {
  id: string
  name: string
  artists: string[]
  durationMs: number
  albumImageUrl: string | null
  playedAt: string
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

export async function getRecentlyPlayedTracks(
  userId: string,
): Promise<RecentlyPlayedTrack[]> {
  const accessToken = await getSpotifyAccessToken(userId)

  if (!accessToken) {
    throw new SpotifyConnectionRequiredError()
  }

  const response = await fetch(
    'https://api.spotify.com/v1/me/player/recently-played?limit=50',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  )

  if (!response.ok) {
    throw new SpotifyApiError(response.status)
  }

  const payload: unknown = await response.json()

  if (!isRecord(payload) || !Array.isArray(payload.items)) {
    throw new Error('Spotify returned an invalid listening history response.')
  }

  return payload.items.map((item): RecentlyPlayedTrack => {
    if (
      !isRecord(item) ||
      !isRecord(item.track) ||
      !isRecord(item.track.album) ||
      !Array.isArray(item.track.artists) ||
      typeof item.track.id !== 'string' ||
      typeof item.track.name !== 'string' ||
      typeof item.track.duration_ms !== 'number' ||
      typeof item.played_at !== 'string' ||
      Number.isNaN(Date.parse(item.played_at))
    ) {
      throw new Error('Spotify returned an invalid listening history item.')
    }

    const artists = item.track.artists.map((artist) => {
      if (!isRecord(artist) || typeof artist.name !== 'string') {
        throw new Error('Spotify returned an invalid track artist.')
      }

      return artist.name
    })
    const albumImage = Array.isArray(item.track.album.images)
      ? item.track.album.images.find(
          (image): image is { url: string } =>
            isRecord(image) && typeof image.url === 'string',
        )
      : undefined

    return {
      id: item.track.id,
      name: item.track.name,
      artists,
      durationMs: item.track.duration_ms,
      albumImageUrl: albumImage?.url ?? null,
      playedAt: item.played_at,
    }
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}
