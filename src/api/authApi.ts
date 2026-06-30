import type { AuthResponse } from '../types'
import { apiRequest } from './client'

export const authApi = {
  login(email: string, password: string) {
    return apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
  me(token: string) {
    return apiRequest<AuthResponse['user']>('/api/users/me', { token })
  },
}
