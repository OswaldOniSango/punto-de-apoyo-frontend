import { useState } from 'react'
import './App.css'
import { clearSession, getStoredToken, getStoredUser } from './api'
import { Dashboard } from './features/cases/Dashboard'
import { PublicCaseForm } from './features/publicCases/PublicCaseForm'
import { PublicStatusPanel } from './features/publicCases/PublicStatusPanel'
import { UsersPanel } from './features/users/UsersPanel'
import { InternalShell } from './layouts/InternalShell'
import { PublicShell } from './layouts/PublicShell'
import type { View } from './shared/viewTypes'
import type { AuthenticatedUser } from './types'

export default function App() {
  const [token, setToken] = useState(() => getStoredToken())
  const [user, setUser] = useState<AuthenticatedUser | null>(() => getStoredUser())
  const [view, setView] = useState<View>(() => (getStoredToken() ? 'dashboard' : 'public-create'))

  function handleLogin(authToken: string, authUser: AuthenticatedUser) {
    setToken(authToken)
    setUser(authUser)
    setView('dashboard')
  }

  function logout() {
    clearSession()
    setToken(null)
    setUser(null)
    setView('public-create')
  }

  if (!token) {
    return <PublicShell view={view} setView={setView} onLogin={handleLogin} />
  }

  return (
    <InternalShell user={user} view={view} setView={setView} logout={logout}>
      <AuthenticatedApp token={token} user={user} view={view} setView={setView} />
    </InternalShell>
  )
}

function AuthenticatedApp({ token, user, view, setView }: { token: string; user: AuthenticatedUser | null; view: View; setView: (view: View) => void }) {
  if (view === 'public-create') return <PublicCaseForm />
  if (view === 'public-status') return <PublicStatusPanel />
  if (view === 'users') return <UsersPanel token={token} user={user} />
  return <Dashboard token={token} user={user} setView={setView} />
}
