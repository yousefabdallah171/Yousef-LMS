import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Button, ButtonLink } from './ui/Button'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return [
    'rounded-full px-3 py-2 text-sm font-medium transition',
    isActive ? 'bg-surface-high text-foreground shadow-ambient' : 'text-muted',
  ].join(' ')
}

export function Navigation() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 border-b border-ghost bg-surface-highest/80 backdrop-blur-glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-ambient">
            Y
          </div>
          <div>
            <div className="text-sm font-semibold text-secondary">{t('nav.brandTagline')}</div>
            <div className="text-lg font-black text-foreground">{t('nav.brandName')}</div>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink className={navLinkClassName} to="/">
            {t('nav.home')}
          </NavLink>
          <NavLink className={navLinkClassName} to="/courses">
            {t('nav.courses')}
          </NavLink>
          {user ? (
            <NavLink className={navLinkClassName} to="/dashboard">
              {t('nav.dashboard')}
            </NavLink>
          ) : null}
          {user?.role === 'admin' ? (
            <NavLink className={navLinkClassName} to="/admin">
              {t('nav.admin')}
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          <Button onClick={toggleTheme} type="button" variant="ghost">
            {theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}
          </Button>
          {user ? (
            <Button onClick={() => void logout()} type="button" variant="secondary">
              {t('nav.logout')}
            </Button>
          ) : (
            <>
              <ButtonLink to="/login" variant="ghost">
                {t('nav.login')}
              </ButtonLink>
              <ButtonLink to="/register">{t('nav.register')}</ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
