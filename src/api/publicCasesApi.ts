import type { InspectionCase } from '../types'
import { apiRequest } from './client'

export const publicCasesApi = {
  create(payload: Record<string, unknown>, photos: File[]) {
    if (!photos.length) {
      return apiRequest<InspectionCase>('/api/public/inspection-cases', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    }

    const formData = new FormData()
    formData.append('case', new Blob([JSON.stringify(payload)], { type: 'application/json' }))
    photos.forEach((photo) => formData.append('photos', photo))
    return apiRequest<InspectionCase>('/api/public/inspection-cases', {
      method: 'POST',
      body: formData,
    })
  },
  status(trackingCode: string, phone: string) {
    return apiRequest<InspectionCase>('/api/public/inspection-cases/status', {
      params: { trackingCode, phone },
    })
  },
}
