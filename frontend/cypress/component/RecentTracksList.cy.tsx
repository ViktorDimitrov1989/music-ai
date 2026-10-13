import RecentTracksList from '../../src/components/RecentTracksList'
import type { RecentTrack } from '../../src/types/recent-track'

describe('recent listening list', () => {
  it('opening the list → orders tracks newest first and groups them by day', () => {
    const today = new Date(2026, 9, 13, 12)
    const yesterday = new Date(2026, 9, 12, 12)
    cy.clock(today.getTime())
    cy.viewport(1280, 720)

    const tracks: RecentTrack[] = [
      {
        id: 'yesterday-track',
        name: 'Yesterday Song',
        artists: ['Artist'],
        durationMs: 180_000,
        albumImageUrl: null,
        playedAt: new Date(yesterday.getTime() + 10 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'earlier-today',
        name: 'Earlier Today',
        artists: ['Artist'],
        durationMs: 180_000,
        albumImageUrl: null,
        playedAt: new Date(today.getTime() - 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'latest-today',
        name: 'Latest Today',
        artists: ['Artist'],
        durationMs: 180_000,
        albumImageUrl: null,
        playedAt: new Date(today.getTime() - 15 * 60 * 1000).toISOString(),
      },
    ]

    cy.mount(<RecentTracksList tracks={tracks} />)

    cy.get('[data-testid="recent-tracks-list"] .recent-tracks-day').should(
      'have.length',
      2,
    )
    cy.get('[data-testid="recent-tracks-list"]')
      .find('.recent-tracks-day-heading')
      .then(($headings) => {
        expect([...$headings].map((heading) => heading.textContent)).to.deep.equal(
          ['Today', 'Yesterday'],
        )
      })
    cy.get('[data-testid="recent-tracks-list"] [data-testid="recent-track"]')
      .then(($items) => {
        expect([...$items].map((item) => item.getAttribute('data-track-id'))).to
          .deep.equal(['latest-today', 'earlier-today', 'yesterday-track'])
      })
  })
})
