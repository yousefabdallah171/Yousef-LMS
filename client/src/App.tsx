import './App.css'

function App() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="eyebrow">Yousef LMS</div>
        <h1>Phase 1 is ready for implementation.</h1>
        <p>
          The repo now has a monorepo baseline with a React client, Express
          server, shared package, and Docker Compose for the full local stack.
        </p>

        <div className="actions">
          <a className="button button-primary" href="/courses">
            Next routes
          </a>
          <a className="button button-secondary" href="http://localhost:3000/health">
            Server health
          </a>
        </div>
      </section>

      <section className="status-grid" aria-label="Setup status">
        <article className="status-card">
          <h2>Client</h2>
          <p>Vite + React + TypeScript + Tailwind + RTL baseline</p>
        </article>
        <article className="status-card">
          <h2>Server</h2>
          <p>Express + Prisma scaffold + health endpoints + env baseline</p>
        </article>
        <article className="status-card">
          <h2>Infra</h2>
          <p>Dockerfiles + Compose + Postgres + Redis + root dev scripts</p>
        </article>
      </section>

      <section className="command-card">
        <h2>Run commands</h2>
        <ul>
          <li>
            <code>npm install</code>
          </li>
          <li>
            <code>npm run docker:up</code>
          </li>
          <li>
            <code>npm run dev</code>
          </li>
        </ul>
      </section>
    </main>
  )
}

export default App
