import { useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthenticatedUser } from '../types'
import type { View } from '../shared/viewTypes'
import { canManageUsers } from '../shared/permissions'
import { TopBar } from './TopBar'

export function InternalShell({ user, view, setView, logout, children }: { user: AuthenticatedUser | null; view: View; setView: (view: View) => void; logout: () => void; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function navigate(nextView: View) {
    setView(nextView)
    setMenuOpen(false)
  }

  function logoutAndClose() {
    setMenuOpen(false)
    logout()
  }

  return (
    <div className="internal-shell">
      <aside className={menuOpen ? 'app-sidebar open' : 'app-sidebar'} aria-hidden={!menuOpen}>
        <div className="sidebar-head">
          <button className="sidebar-brand" onClick={() => navigate('dashboard')}>
            <img src="/punto-de-apoyo-logo.png" alt="Punto de Apoyo" />
          </button>
          <button className="drawer-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menu">×</button>
        </div>
        <nav className="app-menu" aria-label="Menu interno">
          <div className="menu-section">
            <span>Operacion</span>
            <button className={view === 'dashboard' ? 'active' : ''} onClick={() => navigate('dashboard')}>Centro de operaciones</button>
            <button className={view === 'public-create' ? 'active' : ''} onClick={() => navigate('public-create')}>Registrar caso</button>
            <button className={view === 'public-status' ? 'active' : ''} onClick={() => navigate('public-status')}>Consulta publica</button>
          </div>
          {canManageUsers(user) ? (
            <div className="menu-section">
              <span>Administracion</span>
              <button className={view === 'users' ? 'active' : ''} onClick={() => navigate('users')}>Usuarios internos</button>
            </div>
          ) : null}
        </nav>
        <div className="sidebar-user">
          <span>{user?.firstName} {user?.lastName}</span>
          <small>{user?.role}</small>
          <button onClick={logoutAndClose}>Cerrar sesion</button>
        </div>
      </aside>
      {menuOpen ? <button className="drawer-backdrop" onClick={() => setMenuOpen(false)} aria-label="Cerrar menu" /> : null}
      <main className="workspace">
        <TopBar view={view} onMenuClick={() => setMenuOpen(true)} />
        {children}
      </main>
    </div>
  )
}
