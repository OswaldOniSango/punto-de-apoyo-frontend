import type { AuthenticatedUser } from '../types'
import type { View } from '../shared/viewTypes'
import { LoginPanel } from '../features/auth/LoginPanel'
import { PublicCaseForm } from '../features/publicCases/PublicCaseForm'
import { PublicStatusPanel } from '../features/publicCases/PublicStatusPanel'

export function PublicShell({ view, setView, onLogin }: { view: View; setView: (view: View) => void; onLogin: (token: string, user: AuthenticatedUser) => void }) {
  const publicView = view === 'dashboard' || view === 'users' ? 'home' : view

  return (
    <div className="public-shell">
      <header className="public-nav">
        <div className="public-nav-inner">
          <button className="brand-button" onClick={() => setView('home')}>
            <img src="/punto-de-apoyo-logo.png" alt="" />
            <span>Punto de apoyo</span>
          </button>
          <nav aria-label="Menu ciudadano">
            <button className={publicView === 'public-status' ? 'nav-link active' : 'nav-link'} onClick={() => setView('public-status')}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 18a7.5 7.5 0 1 1 5.3-2.2L21 21" /></svg>
              Consultar caso
            </button>
            <button className={publicView === 'public-create' ? 'nav-link active' : 'nav-link'} onClick={() => setView('public-create')}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /><path d="M5 5h14v14H5z" /></svg>
              Crear Reporte
            </button>
            <button className="internal-access" onClick={() => setView('login')} title="Panel de gestion" aria-label="Panel de gestion">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8Z" />
                <path d="M4 21a8 8 0 0 1 16 0" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {publicView === 'home' ? <section className="public-hero">
        <div className="hero-inner">
          <img src="/punto-de-apoyo-brand.jpg" alt="Punto de Apoyo" className="hero-brand" />
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="badge">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8Z" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
                Atencion ciudadana
              </span>
              <h1>Registro y seguimiento de viviendas afectadas</h1>
              <p>Canal institucional para reportar casos, coordinar inspecciones y consultar el avance del proceso.</p>
              <div className="hero-actions">
                <button onClick={() => setView('public-create')}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /><path d="M5 5h14v14H5z" /></svg>
                  Crear reporte
                </button>
                <button className="secondary" onClick={() => setView('public-status')}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 18a7.5 7.5 0 1 1 5.3-2.2L21 21" /></svg>
                  Consultar caso
                </button>
              </div>
            </div>
            <div className="hero-steps" aria-label="Proceso ciudadano">
              <article>
                <span className="step-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9l5-4 5 4v10" /><path d="M9 19v-6h5v6" /><path d="M14 12h6v7h-6" /></svg></span>
                <span><strong>Busca</strong><small>Encuentra el estado publico de tu edificio.</small></span>
              </article>
              <article>
                <span className="step-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8v4H8z" /><path d="M6 6H5a2 2 0 0 0-2 2v11h18V8a2 2 0 0 0-2-2h-1" /><path d="M12 11v6M9 14h6" /></svg></span>
                <span><strong>Registra</strong><small>Crea un caso de inspeccion con descripcion y fotos.</small></span>
              </article>
              <article>
                <span className="step-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8Z" /><path d="M4 21a8 8 0 0 1 16 0" /></svg></span>
                <span><strong>Consulta</strong><small>Sigue actualizaciones del equipo tecnico.</small></span>
              </article>
            </div>
          </div>
        </div>
      </section> : null}

      {publicView !== 'home' ? <main className="public-content">
        {publicView === 'login' ? <LoginPanel onLogin={onLogin} /> : null}
        {publicView === 'public-status' ? <PublicStatusPanel /> : null}
        {publicView === 'public-create' ? <PublicCaseForm /> : null}
      </main> : null}

      <footer className="public-footer">
        <div className="public-footer-inner">
          <div className="footer-brand">
            <img src="/punto-de-apoyo-logo.png" alt="" />
            Punto de apoyo
          </div>
          <p>Coordinacion y respuesta para Venezuela.</p>
        </div>
      </footer>
    </div>
  )
}
