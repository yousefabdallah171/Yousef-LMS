import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import './App.css'
import { AdminRoute } from './components/AdminRoute'
import { Navigation } from './components/Navigation'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminChrome } from './components/admin/AdminChrome'
import { ButtonLink } from './components/ui/Button'
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
  const healthUrl = new URL(
    '/health',
    import.meta.env.VITE_API_URL || window.location.origin,
  ).toString()

  return (
    <Routes>
      <Route element={<PublicAppShell />}>
        <Route
          path="/"
          element={
            <PlaceholderPage
              route="/"
              subtitle="Public landing route mapped to the Stitch home experience."
              title="Home"
              action={
                <div className="flex flex-wrap gap-3">
                  <ButtonLink to="/courses">Course catalog</ButtonLink>
                  <a
                    className="inline-flex items-center justify-center rounded-lg border border-ghost px-4 py-2.5 text-sm font-semibold text-foreground"
                    href={healthUrl}
                  >
                    Server health
                  </a>
                </div>
              }
            />
          }
        />
        <Route
          path="/courses"
          element={
            <PlaceholderPage
              route="/courses"
              subtitle="Catalog route ready for the Stitch course inventory screen."
              title="Course Catalog"
            />
          }
        />
        <Route
          path="/courses/:slug"
          element={
            <PlaceholderPage
              route="/courses/:slug"
              subtitle="Course detail route reserved for preview and purchase intent."
              title="Course Detail"
            />
          }
        />
        <Route
          path="/courses/:slug/lessons/:id"
          element={
            <PlaceholderPage
              route="/courses/:slug/lessons/:id"
              subtitle="Lesson player route reserved for free preview and enrolled access."
              title="Lesson Player"
            />
          }
        />
        <Route
          path="/register"
          element={
            <PlaceholderPage
              route="/register"
              subtitle="Registration route is now part of the shared auth shell."
              title="Register"
            />
          }
        />
        <Route
          path="/login"
          element={
            <PlaceholderPage
              route="/login"
              subtitle="Login route is now part of the shared auth shell."
              title="Login"
            />
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PlaceholderPage
              route="/forgot-password"
              subtitle="Password recovery support route is mapped and ready for the Stitch page."
              title="Forgot Password"
            />
          }
        />
        <Route
          path="/reset-password"
          element={
            <PlaceholderPage
              route="/reset-password"
              subtitle="Password reset support route is mapped and ready for the Stitch page."
              title="Reset Password"
            />
          }
        />
        <Route
          path="/payment/:courseId"
          element={
            <PlaceholderPage
              route="/payment/:courseId"
              subtitle="Payment instructions route is connected and reserved for the purchase flow."
              title="Payment"
            />
          }
        />
        <Route
          path="/403"
          element={
            <PlaceholderPage
              route="/403"
              subtitle="Forbidden route is wired for access-denied redirects."
              title="Forbidden"
              status="Protected route"
              tone="warning"
            />
          }
        />
        <Route
          path="/500"
          element={
            <PlaceholderPage
              route="/500"
              subtitle="Server-error fallback route is reserved for the branded error page."
              title="Server Error"
              status="Fallback route"
              tone="danger"
            />
          }
        />
        <Route
          path="/offline"
          element={
            <PlaceholderPage
              route="/offline"
              subtitle="Offline support route is available for network failure handling."
              title="Offline"
              status="Support route"
              tone="warning"
            />
          }
        />
        <Route
          path="/session-expired"
          element={
            <PlaceholderPage
              route="/session-expired"
              subtitle="Session-expired route is available for auth timeout recovery."
              title="Session Expired"
              status="Support route"
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
                subtitle="Student dashboard route is protected and ready for enrollment and order data."
                title="Dashboard"
                status="Authenticated route"
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
                  subtitle="Admin overview route is protected and wrapped in the admin shell."
                  title="Admin Overview"
                  status="Admin route"
                  tone="success"
                />
              }
            />
            <Route
              path="/admin/courses"
              element={
                <PlaceholderPage
                  route="/admin/courses"
                  subtitle="Admin course inventory route is protected and ready for Stitch parity work."
                  title="Admin Courses"
                  status="Admin route"
                  tone="success"
                />
              }
            />
            <Route
              path="/admin/orders"
              element={
                <PlaceholderPage
                  route="/admin/orders"
                  subtitle="Admin order review route is protected and ready for workflow implementation."
                  title="Admin Orders"
                  status="Admin route"
                  tone="success"
                />
              }
            />
            <Route
              path="/admin/students"
              element={
                <PlaceholderPage
                  route="/admin/students"
                  subtitle="Admin student roster route is protected and ready for data wiring."
                  title="Admin Students"
                  status="Admin route"
                  tone="success"
                />
              }
            />
            <Route
              path="/admin/comments"
              element={
                <PlaceholderPage
                  route="/admin/comments"
                  subtitle="Admin moderation route is protected and ready for comment operations."
                  title="Admin Comments"
                  status="Admin route"
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
