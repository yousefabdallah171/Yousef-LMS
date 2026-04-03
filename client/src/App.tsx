import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import './App.css'
import { AdminRoute } from './components/AdminRoute'
import { AdminOrderDetailPage } from './pages/AdminOrderDetailPage'
import { AdminCommentsPage } from './pages/AdminCommentsPage'
import { AdminCourseEditorPage } from './pages/AdminCourseEditorPage'
import { AdminCoursesPage } from './pages/AdminCoursesPage'
import { AdminOrdersPage } from './pages/AdminOrdersPage'
import { AdminStudentDetailPage } from './pages/AdminStudentDetailPage'
import { AdminStudentsPage } from './pages/AdminStudentsPage'
import { CourseCatalogPage } from './pages/CourseCatalogPage'
import { CourseDetailPage } from './pages/CourseDetailPage'
import { DashboardPage } from './pages/DashboardPage'
import { HomePage } from './pages/HomePage'
import { LessonPlayerPage } from './pages/LessonPlayerPage'
import { LoginPage } from './pages/LoginPage'
import { Navigation } from './components/Navigation'
import { PaymentInstructionsPage } from './pages/PaymentInstructionsPage'
import { PaymentProofUploadPage } from './pages/PaymentProofUploadPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RegisterPage } from './pages/RegisterPage'
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
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/payment/:courseId" element={<PaymentInstructionsPage />} />
          <Route path="/payment/:courseId/proof" element={<PaymentProofUploadPage />} />
        </Route>
        <Route element={<AdminRoute />} path="/admin">
          <Route element={<AdminChrome />}>
            <Route
              index
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
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="courses/new" element={<AdminCourseEditorPage />} />
            <Route path="courses/:id/edit" element={<AdminCourseEditorPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="students/:id" element={<AdminStudentDetailPage />} />
            <Route path="comments" element={<AdminCommentsPage />} />
          </Route>
        </Route>
        <Route path="/404" element={<NotFoundPlaceholder />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Route>
    </Routes>
  )
}

export default App
