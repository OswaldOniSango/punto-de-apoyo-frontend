import type { AuthenticatedUser } from '../types'

export function canManageUsers(user: AuthenticatedUser | null) {
  return user?.role === 'ADMIN'
}

export function canAssign(user: AuthenticatedUser | null) {
  return user?.role === 'ADMIN' || user?.role === 'COORDINATOR'
}

export function canWorkCase(user: AuthenticatedUser | null) {
  return user?.role === 'ADMIN' || user?.role === 'ENGINEER'
}

export function canDownloadReport(user: AuthenticatedUser | null) {
  return user?.role === 'ADMIN' || user?.role === 'COORDINATOR' || user?.role === 'ENGINEER'
}
