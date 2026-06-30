import type { InternalUser } from '../types'
import { apiRequest } from './client'

export const usersApi = {
  list(token: string) {
    return apiRequest<InternalUser[]>('/api/users', { token })
  },
  engineers(token: string) {
    return apiRequest<InternalUser[]>('/api/users/engineers', { token })
  },
  create(token: string, payload: Record<string, unknown>) {
    return apiRequest<InternalUser>('/api/users', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    })
  },
  update(token: string, id: number, payload: { role?: string; status?: string }) {
    return apiRequest<InternalUser>('/api/users/' + id, {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    })
  },
}
