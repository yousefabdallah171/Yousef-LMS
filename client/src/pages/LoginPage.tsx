import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'

type LoginFormValues = {
  email: string
  password: string
}

function getReturnUrl(
  searchParams: URLSearchParams,
  locationState: unknown,
  fallback = '/dashboard',
) {
  const searchReturnUrl = searchParams.get('returnUrl')

  if (searchReturnUrl) {
    return searchReturnUrl
  }

  const state = locationState as { from?: { pathname?: string; search?: string } } | null
  const pathname = state?.from?.pathname

  if (pathname) {
    return `${pathname}${state.from?.search ?? ''}`
  }

  return fallback
}

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setSubmitError(null)

    try {
      const user = await login(values)
      const fallback = user.role === 'admin' ? '/admin' : '/dashboard'
      navigate(getReturnUrl(searchParams, location.state, fallback), { replace: true })
    } catch (error) {
      const code = (error as { response?: { data?: { code?: string } } } | undefined)
        ?.response?.data?.code
      setSubmitError(
        code === 'INVALID_CREDENTIALS'
          ? t('auth.invalidCredentials')
          : t('auth.sessionExpiredSubtitle'),
      )
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col overflow-hidden lg:flex-row">
      <section className="relative hidden flex-1 flex-col justify-center overflow-hidden bg-surface-container-lowest p-16 lg:flex">
        <div className="absolute -left-24 -top-24 size-96 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-secondary/10 blur-[120px]" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="mb-8 text-6xl font-black leading-tight tracking-tight text-white">
            {t('auth.loginHeroTitle')}
            <br />
            <span className="bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
              {t('auth.loginHeroHighlight')}
            </span>
          </h1>
          <p className="mb-12 max-w-lg text-xl leading-relaxed text-muted">
            {t('auth.loginHeroDescription')}
          </p>
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-surface-high/60 px-6 py-4 backdrop-blur-xl">
            <span className="text-secondary">{'\u2713'}</span>
            <span className="font-medium text-foreground">{t('auth.previewCta')}</span>
          </div>
        </div>
      </section>

      <section className="relative flex flex-1 items-center justify-center bg-surface px-6 py-12">
        <div className="absolute left-8 right-8 top-8 flex items-center justify-between">
          <Link className="text-3xl font-black tracking-tighter text-foreground" to="/">
            {t('nav.brandName')}
          </Link>
        </div>

        <div className="w-full max-w-[440px] rounded-2xl border border-white/10 bg-[#111827] p-10 shadow-2xl shadow-primary/5">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-white">{t('auth.loginTitle')}</h2>
            <p className="text-sm text-muted">{t('auth.loginSubtitleFull')}</p>
          </div>

          <form className="space-y-6" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
            <div className="space-y-2">
              <label className="me-1 block text-sm font-medium text-muted" htmlFor="login-email">
                {t('auth.emailLabel')}
              </label>
              <input
                {...register('email', {
                  required: t('auth.emailRequired'),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t('auth.emailInvalid'),
                  },
                })}
                className="h-12 w-full rounded-xl border border-[#1F2937] bg-surface-high px-4 text-start text-foreground outline-none transition-all placeholder:text-outline focus:border-secondary focus:ring-1 focus:ring-primary"
                dir="ltr"
                id="login-email"
                placeholder="name@example.com"
                type="email"
              />
              {errors.email ? (
                <p className="text-sm text-red-300">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="me-1 block text-sm font-medium text-muted" htmlFor="login-password">
                  {t('auth.passwordLabel')}
                </label>
                <Link className="text-sm font-medium text-secondary hover:underline" to="/forgot-password">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <input
                {...register('password', {
                  required: t('auth.passwordRequired'),
                })}
                className="h-12 w-full rounded-xl border border-[#1F2937] bg-surface-high px-4 text-start text-foreground outline-none transition-all placeholder:text-outline focus:border-secondary focus:ring-1 focus:ring-primary"
                dir="ltr"
                id="login-password"
                placeholder="••••••••"
                type="password"
              />
              {errors.password ? (
                <p className="text-sm text-red-300">{errors.password.message}</p>
              ) : null}
            </div>

            {submitError ? (
              <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {submitError}
              </div>
            ) : null}

            <Button className="h-14 w-full rounded-xl text-lg" disabled={isSubmitting} type="submit">
              {isSubmitting ? t('auth.submitting') : t('auth.loginButton')}
            </Button>
          </form>

          <div className="mt-10 border-t border-[#1F2937] pt-8 text-center text-sm text-muted">
            {t('auth.noAccount')}{' '}
            <Link
              className="font-bold text-secondary hover:underline"
              to={`/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
            >
              {t('auth.registerButton')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
