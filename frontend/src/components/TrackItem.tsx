import type { RecentTrack } from '../types/recent-track'
import './TrackItem.css'

interface TrackItemProps {
  track: RecentTrack
}

function TrackItem({ track }: TrackItemProps) {
  const playedAt = new Date(track.playedAt)

  return (
    <article
      className="track-item"
      data-testid="recent-track"
      data-track-id={track.id}
    >
      {track.albumImageUrl ? (
        <img
          className="track-item-cover"
          src={track.albumImageUrl}
          alt={`${track.name} album cover`}
        />
      ) : (
        <div
          className="track-item-cover track-item-cover-placeholder"
          role="img"
          aria-label={`${track.name} album artwork unavailable`}
        >
          <span aria-hidden="true">♪</span>
        </div>
      )}
      <div className="track-item-details">
        <h4 className="track-item-name">{track.name}</h4>
        <p className="track-item-artists">{track.artists.join(', ')}</p>
      </div>
      <div className="track-item-meta">
        <time className="track-item-time" dateTime={track.playedAt}>
          {playedAt.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </time>
        <span className="track-item-duration">
          {formatDuration(track.durationMs)}
        </span>
      </div>
    </article>
  )
}

function formatDuration(durationMs: number): string {
  const totalSeconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export default TrackItem
