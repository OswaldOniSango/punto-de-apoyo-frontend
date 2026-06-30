import type { AuthenticatedUser } from '../types'
import type { View } from '../shared/viewTypes'
import { LoginPanel } from '../features/auth/LoginPanel'
import { PublicCaseForm } from '../features/publicCases/PublicCaseForm'
import { PublicStatusPanel } from '../features/publicCases/PublicStatusPanel'

export function PublicShell({ view, setView, onLogin }: { view: View; setView: (view: View) => void; onLogin: (token: string, user: AuthenticatedUser) => void }) {
  const publicView = view === 'dashboard' || view === 'users' ? 'public-create' : view

  return (
    <div className="public-shell">
      <header className="public-nav">
        <button className="brand-button" onClick={() => setView('public-create')}>
          <span className="brand-symbol"><img src="/punto-de-apoyo-brand.jpg" alt="Punto de Apoyo" /></span>
        </button>
        <nav aria-label="Menu ciudadano">
          <button className={publicView === 'public-create' ? 'active' : ''} onClick={() => setView('public-create')}>Reportar vivienda</button>
          <button className={publicView === 'public-status' ? 'active' : ''} onClick={() => setView('public-status')}>Consultar estado</button>
        </nav>
        <button className="internal-access" onClick={() => setView('login')}>Acceso interno</button>
      </header>

      <section className="public-hero">
        <div className="hero-copy">
          <div className="hero-logo"><img src="/punto-de-apoyo-brand.jpg" alt="Punto de Apoyo" /></div>
          <span className="badge">Atencion ciudadana</span>
          <h1>Reporta danos en tu vivienda y recibe seguimiento tecnico.</h1>
          <p>Una plataforma para registrar casos, coordinar inspecciones y mantener informada a la comunidad durante el proceso.</p>
          <div className="hero-actions">
            <button onClick={() => setView('public-create')}>Crear reporte</button>
            <button className="secondary" onClick={() => setView('public-status')}>Consultar caso</button>
          </div>
        </div>
      </section>

      <main className="public-content">
        {publicView === 'login' ? <LoginPanel onLogin={onLogin} /> : null}
        {publicView === 'public-status' ? <PublicStatusPanel /> : null}
        {publicView === 'public-create' ? <PublicCaseForm /> : null}
      </main>
    </div>
  )
}
