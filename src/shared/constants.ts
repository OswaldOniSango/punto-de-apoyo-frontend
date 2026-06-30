import type { CasePriority, CaseStatus, StructuralRisk, UserRole, UserStatus } from '../types'

export const priorities: CasePriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
export const statuses: CaseStatus[] = ['PENDIENTE', 'ASIGNADO', 'EN_PROCESO', 'INSPECCIONADO', 'CERRADO']
export const editableStatuses: CaseStatus[] = ['EN_PROCESO', 'INSPECCIONADO', 'CERRADO']
export const roles: UserRole[] = ['ADMIN', 'COORDINATOR', 'ENGINEER']
export const userStatuses: UserStatus[] = ['ACTIVE', 'INACTIVE']
export const risks: StructuralRisk[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
