import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { getReturnUrl } from '../utils/auth'

type RegisterFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { register: registerUser } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const passwordValue = watch('password')

  async function onSubmit(values: RegisterFormValues) {
    setSubmitError(null)

    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      navigate(getReturnUrl(searchParams, location.state), { replace: true })
    } catch (error) {
      const code = (error as { response?: { data?: { code?: string } } } | undefined)
        ?.response?.data?.code
      setSubmitError(
        code === 'EMAIL_ALREADY_EXISTS'
          ? t('auth.emailExists')
          : t('common.error'),
      )
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col overflow-hidden md:flex-row">
      <section className="relative hidden flex-1 flex-col justify-center overflow-hidden bg-surface-container-lowest px-16 lg:flex">
        <div className="absolute -start-24 -top-24 size-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 end-0 size-[32rem] rounded-full bg-secondary/5 blur-[150px]" />
        <div className="relative z-10 max-w-xl">
          <h2 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-white">
            {t('auth.registerHeroTitle')}{' '}
            <span className="text-primary">{t('auth.registerHeroHighlight')}</span>
          </h2>
          <p className="text-xl leading-relaxed text-muted">
            {t('auth.registerHeroDescription')}
          </p>
        </div>
      </section>

      <section className="flex w-full items-center justify-center bg-surface px-6 py-12 md:w-[600px] lg:w-[680px]">
        <div className="w-full max-w-[480px] space-y-10">
          <div className="space-y-4 text-center md:text-end">
            <Link className="inline-block text-3xl font-black tracking-tighter text-foreground" to="/">
              {t('nav.brandName')}
            </Link>
            <div>
              <h1 className="mb-3 text-4xl font-extrabold text-foreground">
                {t('auth.registerTitle')}
              </h1>
              <p className="text-lg text-muted">{t('auth.registerSubtitleFull')}</p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-muted" htmlFor="register-name">
                {t('auth.nameLabel')}
              </label>
              <input
                {...register('name', {
                  required: t('auth.nameRequired'),
                  minLength: {
                    value: 1,
                    message: t('auth.nameRequired'),
                  },
                })}
                className="h-12 w-full rounded-lg border border-outline-variant/30 bg-surface-high px-4 text-foreground outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary"
                id="register-name"
                placeholder={t('auth.namePlaceholder')}
                type="text"
              />
              {errors.name ? (
                <p className="text-sm text-red-300">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-muted" htmlFor="register-email">
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
                className="h-12 w-full rounded-lg border border-outline-variant/30 bg-surface-high px-4 text-start text-foreground outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary"
                dir="ltr"
                id="register-email"
                placeholder="name@example.com"
                type="email"
              />
              {errors.email ? (
                <p className="text-sm text-red-300">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-muted" htmlFor="register-password">
                {t('auth.passwordLabel')}
              </label>
              <input
                {...register('password', {
                  required: t('auth.passwordRequired'),
                  minLength: {
                    value: 8,
                    message: t('auth.passwordMinLength'),
                  },
                })}
                className="h-12 w-full rounded-lg border border-outline-variant/30 bg-surface-high px-4 text-start text-foreground outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary"
                dir="ltr"
                id="register-password"
                placeholder="••••••••"
                type="password"
              />
              {errors.password ? (
                <p className="text-sm text-red-300">{errors.password.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-muted" htmlFor="register-confirm-password">
                {t('auth.confirmPasswordLabel')}
              </label>
              <input
                {...register('confirmPassword', {
                  required: t('auth.confirmPasswordRequired'),
                  validate: (value) =>
                    value === passwordValue || t('auth.passwordMismatch'),
                })}
                className="h-12 w-full rounded-lg border border-outline-variant/30 bg-surface-high px-4 text-start text-foreground outline-none transition-all placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary"
                dir="ltr"
                id="register-confirm-password"
                placeholder="••••••••"
                type="password"
              />
              {errors.confirmPassword ? (
                <p className="text-sm text-red-300">{errors.confirmPassword.message}</p>
              ) : null}
            </div>

            {submitError ? (
              <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {submitError}
              </div>
            ) : null}

            <Button className="h-14 w-full rounded-xl text-lg" disabled={isSubmitting} type="submit">
              {isSubmitting ? t('auth.submitting') : t('auth.registerButton')}
            </Button>

            <div className="text-center text-sm text-muted">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link
                className="font-bold text-primary hover:underline"
                to={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
              >
                {t('auth.loginButton')}
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
