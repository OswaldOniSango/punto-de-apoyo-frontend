import type { CasePriority, CaseStatus, InspectionCase, StructuralRisk } from '../types'
import { apiRequest } from './client'

export const casesApi = {
  search(token: string, params: { trackingCode?: string; status?: CaseStatus | ''; city?: string; priority?: CasePriority | ''; createdDate?: string }) {
    return apiRequest<InspectionCase[]>('/api/inspection-cases', { token, params })
  },
  addPhotos(token: string, id: number, photos: File[]) {
    const formData = new FormData()
    photos.forEach((photo) => formData.append('photos', photo))
    return apiRequest('/api/inspection-cases/' + id + '/photos', {
      method: 'POST',
      token,
      body: formData,
    })
  },
  assign(token: string, id: number, engineerIds: number[]) {
    return apiRequest<InspectionCase>('/api/inspection-cases/' + id + '/assignments', {
      method: 'POST',
      token,
      body: JSON.stringify({ engineerIds }),
    })
  },
  unassign(token: string, id: number, engineerId: number) {
    return apiRequest<InspectionCase>('/api/inspection-cases/' + id + '/assignments/' + engineerId, {
      method: 'DELETE',
      token,
    })
  },
  updateStatus(token: string, id: number, status: CaseStatus) {
    return apiRequest<InspectionCase>('/api/inspection-cases/' + id + '/status', {
      method: 'PATCH',
      token,
      body: JSON.stringify({ status }),
    })
  },
  createObservation(token: string, id: number, payload: { observations: string; recommendations: string; structuralRisk: StructuralRisk }, photos: File[]) {
    if (!photos.length) {
      return apiRequest('/api/inspection-cases/' + id + '/technical-observations', {
        method: 'POST',
        token,
        body: JSON.stringify(payload),
      })
    }

    const formData = new FormData()
    formData.append('observation', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
    photos.forEach((photo) => formData.append('photos', photo))
    return apiRequest('/api/inspection-cases/' + id + '/technical-observations', {
      method: 'POST',
      token,
      body: formData,
    })
  },
  async downloadReport(token: string, id: number) {
    const blob = await apiRequest<Blob>('/api/inspection-cases/' + id + '/inspection-report.pdf', { token })
    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = `inspection-case-${id}.pdf`
    link.click()
    URL.revokeObjectURL(href)
  },
}
