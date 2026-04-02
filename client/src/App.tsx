import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import './App.css'
import { AdminRoute } from './components/AdminRoute'
import { CourseCatalogPage } from './pages/CourseCatalogPage'
import { CourseDetailPage } from './pages/CourseDetailPage'
import { HomePage } from './pages/HomePage'
import { LessonPlayerPage } from './pages/LessonPlayerPage'
import { Navigation } from './components/Navigation'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminChrome } from './components/admin/AdminChrome'
import { NotFoundPlaceholder, PlaceholderPage } from './pages/PlaceholderPage'

function PublicAppShell() {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <Navigation />
      <Outlet />
    </div>
  )
}

function App() {
  const { t } = useTranslation()

  return (
    <Routes>
      <Route element={<PublicAppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CourseCatalogPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />
        <Route path="/courses/:slug/lessons/:id" element={<LessonPlayerPage />} />
        <Route
          path="/register"
          element={
            <PlaceholderPage
              route="/register"
              subtitle={t('auth.registerSubtitle')}
              title={t('auth.registerTitle')}
            />
          }
        />
        <Route
          path="/login"
          element={
            <PlaceholderPage
              route="/login"
              subtitle={t('auth.loginSubtitle')}
              title={t('auth.loginTitle')}
            />
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PlaceholderPage
              route="/forgot-password"
              subtitle={t('auth.forgotPasswordSubtitle')}
              title={t('auth.forgotPassword')}
            />
          }
        />
        <Route
          path="/reset-password"
          element={
            <PlaceholderPage
              route="/reset-password"
              subtitle={t('auth.resetPasswordSubtitle')}
              title={t('auth.resetPassword')}
            />
          }
        />
        <Route
          path="/payment/:courseId"
          element={
            <PlaceholderPage
              route="/payment/:courseId"
              subtitle={t('placeholder.paymentSubtitle')}
              title={t('placeholder.paymentTitle')}
            />
          }
        />
        <Route
          path="/403"
          element={
            <PlaceholderPage
              route="/403"
              subtitle={t('errors.forbiddenDesc')}
              title={t('errors.forbidden')}
              status={t('placeholder.statusProtectedRoute')}
              tone="warning"
            />
          }
        />
        <Route
          path="/500"
          element={
            <PlaceholderPage
              route="/500"
              subtitle={t('errors.serverErrorDesc')}
              title={t('errors.serverError')}
              status={t('placeholder.statusFallbackRoute')}
              tone="danger"
            />
          }
        />
        <Route
          path="/offline"
          element={
            <PlaceholderPage
              route="/offline"
              subtitle={t('errors.offlineDesc')}
              title={t('errors.offline')}
              status={t('placeholder.statusSupportRoute')}
              tone="warning"
            />
          }
        />
        <Route
          path="/session-expired"
          element={
            <PlaceholderPage
              route="/session-expired"
              subtitle={t('auth.sessionExpiredSubtitle')}
              title={t('auth.sessionExpiredTitle')}
              status={t('placeholder.statusSupportRoute')}
              tone="warning"
            />
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <PlaceholderPage
                route="/dashboard"
                subtitle={t('dashboard.subtitle')}
                title={t('dashboard.title')}
                status={t('placeholder.statusAuthenticatedRoute')}
                tone="success"
              />
            }
          />
        </Route>
        <Route element={<AdminRoute />}>
          <Route element={<AdminChrome />}>
            <Route
              path="/admin"
              element={
                <PlaceholderPage
                  route="/admin"
                  subtitle={t('admin.overviewSubtitle')}
                  title={t('admin.overviewTitle')}
                  status={t('placeholder.statusAdminRoute')}
                  tone="success"
                />
              }
            />
            <Route
              path="/admin/courses"
              element={
                <PlaceholderPage
                  route="/admin/courses"
                  subtitle={t('admin.coursesSubtitle')}
                  title={t('admin.courses')}
                  status={t('placeholder.statusAdminRoute')}
                  tone="success"
                />
              }
            />
            <Route
              path="/admin/orders"
              element={
                <PlaceholderPage
                  route="/admin/orders"
                  subtitle={t('admin.ordersSubtitle')}
                  title={t('admin.orders')}
                  status={t('placeholder.statusAdminRoute')}
                  tone="success"
                />
              }
            />
            <Route
              path="/admin/students"
              element={
                <PlaceholderPage
                  route="/admin/students"
                  subtitle={t('admin.studentsSubtitle')}
                  title={t('admin.students')}
                  status={t('placeholder.statusAdminRoute')}
                  tone="success"
                />
              }
            />
            <Route
              path="/admin/comments"
              element={
                <PlaceholderPage
                  route="/admin/comments"
                  subtitle={t('admin.commentsSubtitle')}
                  title={t('admin.comments')}
                  status={t('placeholder.statusAdminRoute')}
                  tone="success"
                />
              }
            />
          </Route>
        </Route>
        <Route path="/404" element={<NotFoundPlaceholder />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Route>
    </Routes>
  )
}

export default App
