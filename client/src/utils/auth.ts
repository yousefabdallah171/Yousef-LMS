type ReturnLocationState = {
  from?: {
    pathname?: string
    search?: string
  }
} | null

export function isValidReturnUrl(returnUrl: string) {
  return returnUrl.startsWith('/') && !returnUrl.startsWith('//')
}

export function getReturnUrl(
  searchParams: URLSearchParams,
  locationState: unknown,
  fallback = '/dashboard',
) {
  const searchReturnUrl = searchParams.get('returnUrl')

  if (searchReturnUrl && isValidReturnUrl(searchReturnUrl)) {
    return searchReturnUrl
  }

  const state = locationState as ReturnLocationState
  const pathname = state?.from?.pathname
  const stateReturnUrl = pathname ? `${pathname}${state.from?.search ?? ''}` : null

  if (stateReturnUrl && isValidReturnUrl(stateReturnUrl)) {
    return stateReturnUrl
  }

  return fallback
}
