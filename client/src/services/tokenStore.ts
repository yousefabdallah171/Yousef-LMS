type AuthTokens = {
  accessToken: string | null
  refreshToken: string | null
}

const ACCESS_TOKEN_KEY = 'yousef_lms.access_token'
const REFRESH_TOKEN_KEY = 'yousef_lms.refresh_token'

function readStoredToken(key: string) {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStoredToken(key: string, value: string | null) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (value) {
      window.localStorage.setItem(key, value)
      return
    }

    window.localStorage.removeItem(key)
  } catch {
    // Ignore storage failures and keep the in-memory copy in sync.
  }
}

let tokens: AuthTokens = {
  accessToken: readStoredToken(ACCESS_TOKEN_KEY),
  refreshToken: readStoredToken(REFRESH_TOKEN_KEY),
}

export function getAccessToken() {
  return tokens.accessToken
}

export function getRefreshToken() {
  return tokens.refreshToken
}

export function setAuthTokens(nextTokens: Partial<AuthTokens>) {
  tokens = {
    ...tokens,
    ...nextTokens,
  }

  if (Object.hasOwn(nextTokens, 'accessToken')) {
    writeStoredToken(ACCESS_TOKEN_KEY, tokens.accessToken)
  }

  if (Object.hasOwn(nextTokens, 'refreshToken')) {
    writeStoredToken(REFRESH_TOKEN_KEY, tokens.refreshToken)
  }
}

export function clearAuthTokens() {
  tokens = {
    accessToken: null,
    refreshToken: null,
  }

  writeStoredToken(ACCESS_TOKEN_KEY, null)
  writeStoredToken(REFRESH_TOKEN_KEY, null)
}
