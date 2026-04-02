type AuthTokens = {
  accessToken: string | null
  refreshToken: string | null
}

const TOKEN_STORAGE_KEY = 'yousef-lms.auth-tokens'

function canUseSessionStorage() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

function readStoredTokens(): AuthTokens {
  if (!canUseSessionStorage()) {
    return {
      accessToken: null,
      refreshToken: null,
    }
  }

  try {
    const rawValue = window.sessionStorage.getItem(TOKEN_STORAGE_KEY)

    if (!rawValue) {
      return {
        accessToken: null,
        refreshToken: null,
      }
    }

    const parsed = JSON.parse(rawValue) as Partial<AuthTokens>

    return {
      accessToken: typeof parsed.accessToken === 'string' ? parsed.accessToken : null,
      refreshToken: typeof parsed.refreshToken === 'string' ? parsed.refreshToken : null,
    }
  } catch {
    return {
      accessToken: null,
      refreshToken: null,
    }
  }
}

function persistTokens(nextTokens: AuthTokens) {
  if (!canUseSessionStorage()) {
    return
  }

  if (!nextTokens.accessToken && !nextTokens.refreshToken) {
    window.sessionStorage.removeItem(TOKEN_STORAGE_KEY)
    return
  }

  window.sessionStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(nextTokens))
}

let tokens: AuthTokens = {
  ...readStoredTokens(),
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

  persistTokens(tokens)
}

export function clearAuthTokens() {
  tokens = {
    accessToken: null,
    refreshToken: null,
  }

  persistTokens(tokens)
}
