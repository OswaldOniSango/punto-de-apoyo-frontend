import type { ApiErrorBody } from '../types'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export class ApiRequestError extends Error {
  status: number
  body?: ApiErrorBody

  constructor(status: number, body?: ApiErrorBody) {
    super(body?.message || body?.error || `Error HTTP ${status}`)
    this.status = status
    this.body = body
  }
}

type RequestOptions = RequestInit & {
  token?: string | null
  params?: Record<string, string | number | undefined | null>
}

function buildUrl(path: string, params?: RequestOptions['params']) {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      url.searchParams.set(key, String(value))
    }
  })
  return `${url.pathname}${url.search}${url.hash}`.startsWith('/api') && !API_BASE_URL
    ? `${url.pathname}${url.search}${url.hash}`
    : url.toString()
}

async function parseError(response: Response) {
  const text = await response.text()
  if (!text) return undefined
  try {
    return JSON.parse(text) as ApiErrorBody
  } catch {
    return { message: text }
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  const isFormData = options.body instanceof FormData

  if (!isFormData && options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  const response = await fetch(buildUrl(path, options.params), {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new ApiRequestError(response.status, await parseError(response))
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>
  }

  return response.blob() as Promise<T>
}

export function assetUrl(fileUrl: string) {
  if (!fileUrl) return ''
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl
  return `${API_BASE_URL}${fileUrl}`
}
