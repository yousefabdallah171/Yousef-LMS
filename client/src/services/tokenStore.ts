type AuthTokens = {
  accessToken: string | null
  refreshToken: string | null
}

let tokens: AuthTokens = {
  accessToken: null,
  refreshToken: null,
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
}

export function clearAuthTokens() {
  tokens = {
    accessToken: null,
    refreshToken: null,
  }
}
