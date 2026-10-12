import './App.css'

function App() {
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
        <span className="topbar-note">A music diary</span>
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
          <span>Spotify connection is coming soon.</span>
        </div>
      </section>

      <footer className="footer">
        <span>Made for the songs that stay with you.</span>
        <span>Aftertone · A personal music diary</span>
      </footer>
    </main>
  )
}

export default App
