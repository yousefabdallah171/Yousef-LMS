export interface ApiErrorResponse {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface HealthResponse {
  status: 'ok'
}
