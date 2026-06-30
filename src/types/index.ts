export type UserRole = 'ADMIN' | 'COORDINATOR' | 'ENGINEER'
export type UserStatus = 'ACTIVE' | 'INACTIVE'
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type CaseStatus = 'PENDIENTE' | 'ASIGNADO' | 'EN_PROCESO' | 'INSPECCIONADO' | 'CERRADO'
export type StructuralRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type AuthenticatedUser = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  role: UserRole
}

export type AuthResponse = {
  tokenType: string
  accessToken: string
  expiresAt: string
  user: AuthenticatedUser
}

export type InternalUser = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  role: UserRole
  status: UserStatus
  createdAt?: string
  updatedAt?: string
}

export type PhotoEvidence = {
  id: number
  caseId: number
  uploadedByUserId?: number | null
  publicUpload: boolean
  fileName: string
  fileUrl: string
  contentType: string
  sizeBytes: number
  createdAt: string
}

export type CaseAssignment = {
  id: number
  engineerId: number
  engineerFirstName: string
  engineerLastName: string
  engineerEmail: string
  engineerPhone?: string | null
  assignedBy: number
  assignedAt: string
}

export type InspectionCase = {
  id: number
  trackingCode: string
  applicantName: string
  applicantPhone: string
  applicantEmail?: string | null
  address: string
  city?: string | null
  stateRegion?: string | null
  description: string
  latitude?: number | null
  longitude?: number | null
  priority: CasePriority
  status: CaseStatus
  createdAt: string
  updatedAt: string
  photos: PhotoEvidence[]
  assignments: CaseAssignment[]
}

export type TechnicalObservation = {
  id: number
  caseId: number
  createdByUserId: number
  observations: string
  recommendations: string
  structuralRisk: StructuralRisk
  createdAt: string
  updatedAt: string
  photos: PhotoEvidence[]
}

export type FieldError = {
  field: string
  message: string
}

export type ApiErrorBody = {
  status?: number
  error?: string
  message?: string
  fieldErrors?: FieldError[]
}
