import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

function adminLinkClassName({ isActive }: { isActive: boolean }) {
  return [
    'block rounded-xl px-4 py-3 text-sm font-medium transition',
    isActive ? 'bg-primary text-white' : 'text-muted hover:bg-surface-high',
  ].join(' ')
}

export function AdminChrome() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_1fr] lg:px-8">
      <aside className="rounded-3xl border border-ghost bg-surface-high p-5 shadow-ambient">
        <div className="border-b border-ghost pb-5">
          <div className="text-xs uppercase tracking-[0.3em] text-secondary">
            Admin panel
          </div>
          <h2 className="mt-3 text-2xl font-black text-foreground">
            {user?.name || 'Admin'}
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            Core navigation for course operations, order review, and student moderation.
          </p>
        </div>

        <nav className="mt-5 space-y-2">
          <NavLink className={adminLinkClassName} to="/admin">
            Overview
          </NavLink>
          <NavLink className={adminLinkClassName} to="/admin/courses">
            Courses
          </NavLink>
          <NavLink className={adminLinkClassName} to="/admin/orders">
            Orders
          </NavLink>
          <NavLink className={adminLinkClassName} to="/admin/students">
            Students
          </NavLink>
          <NavLink className={adminLinkClassName} to="/admin/comments">
            Comments
          </NavLink>
        </nav>

        <button
          className="mt-6 w-full rounded-xl border border-ghost bg-surface-highest px-4 py-3 text-sm font-semibold text-foreground"
          onClick={toggleTheme}
          type="button"
        >
          Theme: {theme}
        </button>
      </aside>

      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  )
}
