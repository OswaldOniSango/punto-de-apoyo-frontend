import type { View } from '../shared/viewTypes'

function viewTitle(view: View) {
  const titles: Record<View, string> = {
    home: 'Inicio',
    dashboard: 'Centro de Operaciones',
    users: 'Usuarios internos',
    'public-status': 'Consulta publica',
    'public-create': 'Reporte ciudadano',
    login: 'Acceso del equipo',
  }
  return titles[view]
}

export function TopBar({ view, onMenuClick }: { view: View; onMenuClick?: () => void }) {
  return (
    <header className="topbar">
      <button className="menu-toggle" onClick={onMenuClick} aria-label="Abrir menu de operaciones">
        <span />
        <span />
        <span />
      </button>
      <div>
        <span className="eyebrow">Punto de Apoyo</span>
        <h2>{viewTitle(view)}</h2>
      </div>
    </header>
  )
}
