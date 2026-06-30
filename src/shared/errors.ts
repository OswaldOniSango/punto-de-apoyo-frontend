import { ApiRequestError } from '../api'

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiRequestError) {
    const fields = error.body?.fieldErrors?.map((field) => `${field.field}: ${field.message}`).join(' | ')
    return fields || error.message
  }
  if (error instanceof Error) return error.message
  return 'Ocurrio un error inesperado'
}
