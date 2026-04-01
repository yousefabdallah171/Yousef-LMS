/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { apiClient } from '../services/apiClient'
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from '../services/tokenStore'

type UserRole = 'admin' | 'student'

type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

type LoginInput = {
  email: string
  password: string
}

type RegisterInput = {
  name: string
  email: string
  password: string
}

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  login: (input: LoginInput) => Promise<AuthUser>
  register: (input: RegisterInput) => Promise<AuthUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function decodeJwtPayload<T>(token: string): T | null {
  try {
    const payload = token.split('.')[1]

    if (!payload) {
      return null
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = window.atob(
      normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '='),
    )

    return JSON.parse(decoded) as T
  } catch {
    return null
  }
}

function getUserFromAccessToken(token: string | null) {
  if (!token) {
    return null
  }

  const payload = decodeJwtPayload<{
    sub: string
    role: UserRole
    name?: string
    email?: string
  }>(token)

  if (!payload?.sub || !payload.role) {
    return null
  }

  return {
    id: payload.sub,
    role: payload.role,
    name: payload.name || '',
    email: payload.email || '',
  } satisfies AuthUser
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    getUserFromAccessToken(getAccessToken()),
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    if (accessToken) {
      setUser(getUserFromAccessToken(accessToken))
      setIsLoading(false)
      return
    }

    if (!refreshToken) {
      setIsLoading(false)
      return
    }

    apiClient
      .post('/auth/refresh', { refreshToken })
      .then((response) => {
        setAuthTokens({
          accessToken: response.data.accessToken as string,
          refreshToken: response.data.refreshToken as string,
        })

        setUser(getUserFromAccessToken(response.data.accessToken as string))
      })
      .catch(() => {
        clearAuthTokens()
        setUser(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      async login(input) {
        const response = await apiClient.post('/auth/login', input)
        const authUser = response.data.user as AuthUser

        setAuthTokens({
          accessToken: response.data.accessToken as string,
          refreshToken: response.data.refreshToken as string,
        })
        setUser(authUser)

        return authUser
      },
      async register(input) {
        const response = await apiClient.post('/auth/register', input)
        const authUser = response.data.user as AuthUser

        setAuthTokens({
          accessToken: response.data.accessToken as string,
          refreshToken: response.data.refreshToken as string,
        })
        setUser(authUser)

        return authUser
      },
      async logout() {
        try {
          await apiClient.post('/auth/logout')
        } finally {
          clearAuthTokens()
          setUser(null)
        }
      },
    }),
    [isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
