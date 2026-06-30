import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { usersApi } from '../../api'
import { NoticeBox } from '../../components/NoticeBox'
import { roles, userStatuses } from '../../shared/constants'
import { getErrorMessage } from '../../shared/errors'
import { canManageUsers } from '../../shared/permissions'
import type { Notice } from '../../shared/viewTypes'
import type { AuthenticatedUser, InternalUser } from '../../types'

export function UsersPanel({ token, user }: { token: string; user: AuthenticatedUser | null }) {
  const [users, setUsers] = useState<InternalUser[]>([])
  const [notice, setNotice] = useState<Notice>(null)

  async function load() {
    try {
      setUsers(await usersApi.list(token))
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) })
    }
  }

  useEffect(() => { if (canManageUsers(user)) load() }, [token, user])

  if (!canManageUsers(user)) {
    return <section className="panel"><h3>Usuarios internos</h3><p>Solo ADMIN puede administrar usuarios.</p></section>
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      await usersApi.create(token, {
        firstName: form.get('firstName'),
        lastName: form.get('lastName'),
        email: form.get('email'),
        phone: form.get('phone'),
        password: form.get('password'),
        role: form.get('role'),
        status: form.get('status'),
      })
      setNotice({ type: 'success', text: 'Usuario creado' })
      event.currentTarget.reset()
      load()
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) })
    }
  }

  async function update(id: number, payload: { role?: string; status?: string }) {
    try {
      await usersApi.update(token, id, payload)
      setNotice({ type: 'success', text: 'Usuario actualizado' })
      load()
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) })
    }
  }

  return (
    <div className="users-grid">
      <section className="panel">
        <h3>Crear usuario</h3>
        <form onSubmit={create} className="case-form single">
          <label>Nombre<input name="firstName" required /></label>
          <label>Apellido<input name="lastName" required /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>Telefono<input name="phone" /></label>
          <label>Password<input name="password" type="password" minLength={8} maxLength={100} required /></label>
          <label>Rol<select name="role">{roles.map((role) => <option key={role}>{role}</option>)}</select></label>
          <label>Estado<select name="status">{userStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <button>Crear usuario</button>
        </form>
        <NoticeBox notice={notice} />
      </section>
      <section className="panel wide-panel">
        <div className="panel-head"><h3>Usuarios</h3><button className="secondary" onClick={load}>Actualizar</button></div>
        <div className="table-list">
          {users.map((item) => (
            <div key={item.id} className="user-row">
              <span><strong>{item.firstName} {item.lastName}</strong><small>{item.email}</small></span>
              <select value={item.role} onChange={(event) => update(item.id, { role: event.target.value })}>{roles.map((role) => <option key={role}>{role}</option>)}</select>
              <select value={item.status} onChange={(event) => update(item.id, { status: event.target.value })}>{userStatuses.map((status) => <option key={status}>{status}</option>)}</select>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
