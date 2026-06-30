import type { CasePriority, CaseStatus } from '../types'

export function formatDate(value?: string) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('es-VE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export function statusLabel(status: CaseStatus) {
  const labels: Record<CaseStatus, string> = {
    PENDIENTE: 'Pendiente',
    ASIGNADO: 'Asignado',
    EN_PROCESO: 'En proceso',
    INSPECCIONADO: 'Inspeccionado',
    CERRADO: 'Cerrado',
  }
  return labels[status]
}

export function priorityLabel(priority: CasePriority) {
  const labels: Record<CasePriority, string> = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
    URGENT: 'Urgente',
  }
  return labels[priority]
}
