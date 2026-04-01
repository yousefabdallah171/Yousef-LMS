import { NavLink } from 'react-router-dom'

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
            <div className="text-sm font-semibold text-secondary">Arabic-first LMS</div>
            <div className="text-lg font-black text-foreground">Yousef LMS</div>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink className={navLinkClassName} to="/">
            Home
          </NavLink>
          <NavLink className={navLinkClassName} to="/courses">
            Courses
          </NavLink>
          {user ? (
            <NavLink className={navLinkClassName} to="/dashboard">
              Dashboard
            </NavLink>
          ) : null}
          {user?.role === 'admin' ? (
            <NavLink className={navLinkClassName} to="/admin">
              Admin
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          <Button onClick={toggleTheme} type="button" variant="ghost">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
          {user ? (
            <Button onClick={() => void logout()} type="button" variant="secondary">
              Logout
            </Button>
          ) : (
            <>
              <ButtonLink to="/login" variant="ghost">
                Login
              </ButtonLink>
              <ButtonLink to="/register">Register</ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
