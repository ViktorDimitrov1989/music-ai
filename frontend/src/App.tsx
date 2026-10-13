import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from '@clerk/react'
import { useEffect, useState } from 'react'
import './App.css'

interface SpotifyProfile {
  id: string
  displayName: string | null
  email: string | null
  country: string | null
  product: string | null
  imageUrl: string | null
  profileUrl: string | null
}

interface MeResponse {
  user: { clerkId: string }
  spotify: SpotifyProfile
}

type ProfileState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'loaded'; profile: SpotifyProfile }
  | { status: 'signed-out' }

function App() {
  const { isLoaded, isSignedIn } = useAuth()
  const [profileState, setProfileState] = useState<ProfileState>({
    status: 'loading',
  })

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    if (!isSignedIn) {
      setProfileState({ status: 'signed-out' })
      return
    }

    const controller = new AbortController()
    setProfileState({ status: 'loading' })

    void fetch('/api/me', {
      credentials: 'same-origin',
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload: unknown = await response.json()

        if (!response.ok) {
          throw new Error(getApiErrorMessage(payload))
        }

        if (!isMeResponse(payload)) {
          throw new Error('The backend returned an invalid profile response.')
        }

        return payload
      })
      .then((payload) => {
        setProfileState({ status: 'loaded', profile: payload.spotify })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setProfileState({
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Could not load your Spotify profile.',
        })
      })

    return () => controller.abort()
  }, [isLoaded, isSignedIn])

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Aftertone home">
          <span className="wordmark-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          aftertone
        </a>
        <div className="topbar-actions">
          <span className="topbar-note">A music diary</span>
          <nav className="auth-controls" aria-label="Account">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="auth-button auth-button-primary" type="button">
                  Sign in with Spotify
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="auth-button auth-button-secondary" type="button">
                  Create account
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </nav>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Your days, in sound</p>
          <h1 id="hero-title">
            Some days have
            <br />
            a <em>soundtrack.</em>
          </h1>
          <p className="hero-description">
            A little space to look back at what you listened to, and remember
            what was going on in your life.
          </p>
          <a className="text-link" href="#diary">
            Explore your diary <span aria-hidden="true">↘</span>
          </a>
        </div>

        <div className="record-art" aria-hidden="true">
          <div className="record">
            <div className="record-label">
              <span>side A</span>
              <span>your story</span>
            </div>
          </div>
          <span className="art-caption">A collection of little moments</span>
        </div>
      </section>

      <section className="diary-card" id="diary" aria-labelledby="diary-title">
        <div className="diary-card-copy">
          <p className="eyebrow">The first page</p>
          <h2 id="diary-title">Your listening story starts here.</h2>
          <p>
            Connect Spotify to bring your listening history into one thoughtful
            timeline. Add the memories only you can tell.
          </p>
        </div>
        <div className="diary-card-note">
          <span className="note-dot" aria-hidden="true" />
          {profileState.status === 'loading' && isSignedIn ? (
            <span role="status">Loading your Spotify profile…</span>
          ) : null}
          {profileState.status === 'error' ? (
            <span role="alert">{profileState.message}</span>
          ) : null}
          {profileState.status === 'loaded' ? (
            <span className="spotify-profile">
              {profileState.profile.imageUrl ? (
                <img
                  className="spotify-avatar"
                  src={profileState.profile.imageUrl}
                  alt=""
                />
              ) : null}
              <span>
                Connected as{' '}
                {profileState.profile.displayName ??
                  profileState.profile.email ??
                  profileState.profile.id}
              </span>
              {profileState.profile.profileUrl ? (
                <a
                  className="spotify-profile-link"
                  href={profileState.profile.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Spotify profile
                </a>
              ) : null}
            </span>
          ) : null}
          {profileState.status === 'signed-out' ? (
            <span>Sign in with Spotify to start your diary.</span>
          ) : null}
        </div>
      </section>

      <footer className="footer">
        <span>Made for the songs that stay with you.</span>
        <span>Aftertone · A personal music diary</span>
      </footer>
    </main>
  )
}

function isMeResponse(value: unknown): value is MeResponse {
  if (!isRecord(value) || !isRecord(value.user) || !isRecord(value.spotify)) {
    return false
  }

  return (
    typeof value.user.clerkId === 'string' &&
    typeof value.spotify.id === 'string'
  )
}

function getApiErrorMessage(payload: unknown): string {
  if (isRecord(payload) && payload.error === 'spotify_connection_required') {
    return 'This account is not connected to Spotify. Sign in with Spotify to continue.'
  }

  return 'Could not load your Spotify profile. Please try again.'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export default App
