/**
 * Cliente HTTP mínimo sobre fetch.
 *
 * Usamos el proxy de Vite (`/api` -> `http://localhost:3000`) definido en
 * vite.config.ts, así evitamos problemas de CORS al correr contra el backend
 * mockeado en local con `pnpm dev`.
 */

const BASE_URL = '/api'

export class ApiError extends Error {
  status: number
  issues?: unknown

  constructor(message: string, status: number, issues?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.issues = issues
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!res.ok) {
    let body: any = null
    try {
      body = await res.json()
    } catch {
      // el body puede venir vacío
    }
    const message = body?.message ?? body?.name ?? `Error ${res.status} en ${path}`
    throw new ApiError(message, res.status, body?.issues)
  }

  if (res.status === 204) return undefined as T

  return res.json() as Promise<T>
}

export const http = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
}

function buildQuery<T extends object>(params: T): string {
  const entries = Object.entries(params as Record<string, string | undefined>).filter(
    ([, v]) => v !== undefined && v !== '',
  )
  if (entries.length === 0) return ''
  const search = new URLSearchParams(entries as [string, string][])
  return `?${search.toString()}`
}

export { buildQuery }
