import type { RecentTrack } from '../types/recent-track'
import TrackItem from './TrackItem'
import './RecentTracksList.css'

interface RecentTracksListProps {
  tracks: RecentTrack[]
}

interface DayGroup {
  date: Date
  tracks: RecentTrack[]
}

function RecentTracksList({ tracks }: RecentTracksListProps) {
  const groups = groupTracksByDay(tracks)

  return (
    <div className="recent-tracks-list" data-testid="recent-tracks-list">
      <header className="recent-tracks-header">
        <div>
          <p className="eyebrow">Your soundtrack, lately</p>
          <h2 id="recent-activity-title">Recent listening</h2>
        </div>
        <span className="recent-tracks-count">
          {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
        </span>
      </header>
      {groups.length === 0 ? (
        <p className="recent-tracks-empty">
          Your recent listens will show up here.
        </p>
      ) : (
        groups.map(({ date, tracks: dayTracks }) => {
          const dateKey = getLocalDateKey(date)
          const dayLabel = getDayLabel(date)

          return (
            <section
              className="recent-tracks-day"
              aria-label={dayLabel}
              data-day={dateKey}
              key={dateKey}
            >
              <h3 className="recent-tracks-day-heading">{dayLabel}</h3>
              <ol className="recent-tracks-items">
                {dayTracks.map((track) => (
                  <li key={`${track.id}-${track.playedAt}`}>
                    <TrackItem track={track} />
                  </li>
                ))}
              </ol>
            </section>
          )
        })
      )}
    </div>
  )
}

function groupTracksByDay(tracks: RecentTrack[]): DayGroup[] {
  const sortedTracks = [...tracks].sort(
    (first, second) =>
      Date.parse(second.playedAt) - Date.parse(first.playedAt),
  )
  const groups = new Map<string, DayGroup>()

  for (const track of sortedTracks) {
    const playedAt = new Date(track.playedAt)
    const dateKey = getLocalDateKey(playedAt)
    const group = groups.get(dateKey)

    if (group) {
      group.tracks.push(track)
    } else {
      groups.set(dateKey, { date: playedAt, tracks: [track] })
    }
  }

  return [...groups.values()]
}

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getDayLabel(date: Date): string {
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (getLocalDateKey(date) === getLocalDateKey(today)) {
    return 'Today'
  }

  if (getLocalDateKey(date) === getLocalDateKey(yesterday)) {
    return 'Yesterday'
  }

  return date.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default RecentTracksList
