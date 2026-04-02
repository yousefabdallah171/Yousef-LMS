import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

function adminLinkClassName({ isActive }: { isActive: boolean }) {
  return [
    'block rounded-xl px-4 py-3 text-sm font-medium transition',
    isActive ? 'bg-primary text-white' : 'text-muted hover:bg-surface-high',
  ].join(' ')
}

export function AdminChrome() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <aside className="rounded-3xl border border-ghost bg-surface-high p-5 shadow-ambient">
        <div className="border-b border-ghost pb-5">
          <div className="text-xs uppercase tracking-[0.3em] text-secondary">
            {t('admin.panel')}
          </div>
          <h2 className="mt-3 text-2xl font-black text-foreground">
            {user?.name || t('admin.adminFallback')}
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            {t('admin.navigationDescription')}
          </p>
        </div>

        <nav className="mt-5 space-y-2">
          <NavLink className={adminLinkClassName} to="/admin">
            {t('admin.overview')}
          </NavLink>
          <NavLink className={adminLinkClassName} to="/admin/courses">
            {t('admin.courses.title')}
          </NavLink>
          <NavLink className={adminLinkClassName} to="/admin/orders">
            {t('admin.orders.title')}
          </NavLink>
          <NavLink className={adminLinkClassName} to="/admin/students">
            {t('admin.students')}
          </NavLink>
          <NavLink className={adminLinkClassName} to="/admin/comments">
            {t('admin.comments')}
          </NavLink>
        </nav>

        <button
          className="mt-6 w-full rounded-xl border border-ghost bg-surface-highest px-4 py-3 text-sm font-semibold text-foreground"
          onClick={toggleTheme}
          type="button"
        >
          {theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}
        </button>
      </aside>

      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  )
}
