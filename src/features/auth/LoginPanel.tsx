import { useState } from 'react'
import type { FormEvent } from 'react'
import { authApi, saveSession } from '../../api'
import { NoticeBox } from '../../components/NoticeBox'
import { getErrorMessage } from '../../shared/errors'
import type { Notice } from '../../shared/viewTypes'
import type { AuthenticatedUser } from '../../types'

export function LoginPanel({ onLogin }: { onLogin: (token: string, user: AuthenticatedUser) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState<Notice>(null)
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setNotice(null)
    try {
      const auth = await authApi.login(email, password)
      saveSession(auth)
      onLogin(auth.accessToken, auth.user)
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) || 'Credenciales invalidas' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="panel login-panel compact-panel">
      <span className="section-kicker">Equipo autorizado</span>
      <h3>Acceso interno</h3>
      <form onSubmit={submit} className="form-stack">
        <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Contrasena<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <button disabled={loading}>{loading ? 'Entrando...' : 'Entrar al panel'}</button>
      </form>
      <NoticeBox notice={notice} />
    </section>
  )
}
