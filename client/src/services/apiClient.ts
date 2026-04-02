import axios from 'axios'

import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from './tokenStore'

const apiVersion = (import.meta.env.VITE_API_VERSION || 'v1').replace(/^\/+|\/+$/g, '')
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

const apiClient = axios.create({
  baseURL: configuredApiUrl
    ? new URL(`/api/${apiVersion}`, configuredApiUrl).toString()
    : `/api/${apiVersion}`,
})

const TOKEN_REFRESHED_EVENT = 'auth:token-refreshed'

let refreshRequest: Promise<string | null> | null = null

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined
    const requestUrl = originalRequest?.url ?? ''

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    // If refresh itself returns 401, the stored refresh token is invalid.
    // Exit here to avoid re-entering the refresh path indefinitely.
    if (requestUrl.includes('/auth/refresh')) {
      clearAuthTokens()
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      clearAuthTokens()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (!refreshRequest) {
      refreshRequest = apiClient
        .post('/auth/refresh', { refreshToken })
        .then((response) => {
          const nextAccessToken = response.data.accessToken as string
          const nextRefreshToken = response.data.refreshToken as string

          setAuthTokens({
            accessToken: nextAccessToken,
            refreshToken: nextRefreshToken,
          })
          window.dispatchEvent(
            new CustomEvent(TOKEN_REFRESHED_EVENT, {
              detail: { accessToken: nextAccessToken },
            }),
          )

          return nextAccessToken
        })
        .catch((refreshError) => {
          clearAuthTokens()
          throw refreshError
        })
        .finally(() => {
          refreshRequest = null
        })
    }

    const nextAccessToken = await refreshRequest

    if (nextAccessToken) {
      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`
    }

    return apiClient(originalRequest)
  },
)

export { apiClient, TOKEN_REFRESHED_EVENT }
