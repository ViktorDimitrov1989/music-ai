export interface RecentTrack {
  id: string
  name: string
  artists: string[]
  durationMs: number
  albumImageUrl: string | null
  playedAt: string
}
