import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '../components/ui/EmptyState'
import { useAdminStudentDetail } from '../hooks/useAdminStudents'

function formatAdminDate(date: string) {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function AdminStudentDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const { data, isLoading, isError, refetch } = useAdminStudentDetail(id)
  const student = data?.student

  return (
    <section className="space-y-8">
      {isLoading ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_320px]">
          <div className="space-y-4 rounded-[2rem] border border-ghost bg-surface-high p-6 shadow-ambient">
            {Array.from({ length: 4 }, (_, index) => (
              <div className="h-24 animate-pulse rounded-2xl bg-surface-low" key={index} />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-[2rem] border border-ghost bg-surface-high shadow-ambient" />
        </div>
      ) : null}

      {!isLoading && isError ? (
        <EmptyState
          action={
            <button
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
              onClick={() => void refetch()}
              type="button"
            >
              {t('common.retry')}
            </button>
          }
          description={t('admin.studentsManagement.detailLoadError')}
          title={t('common.error')}
        />
      ) : null}

      {!isLoading && !isError && student ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_320px]">
          <div className="space-y-6">
            <header className="rounded-[2rem] border border-ghost bg-surface-high p-8 shadow-ambient">
              <div className="flex flex-col gap-3 text-right">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">
                      {student.name}
                    </h1>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      {t('admin.studentsManagement.detailSubtitle')}
                    </p>
                  </div>
                  <Link
                    className="rounded-xl border border-ghost bg-surface-low px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-highest"
                    to="/admin/students"
                  >
                    {t('admin.studentsManagement.backToList')}
                  </Link>
                </div>
              </div>
            </header>

            <section className="rounded-[2rem] border border-ghost bg-surface-high p-6 shadow-ambient">
              <div className="mb-6 text-right">
                <h2 className="text-2xl font-black text-foreground">
                  {t('admin.studentsManagement.enrollmentHistory')}
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {t('admin.studentsManagement.historyDescription')}
                </p>
              </div>

              {!student.enrollments.length ? (
                <EmptyState
                  description={t('admin.studentsManagement.noEnrollmentsDescription')}
                  title={t('admin.studentsManagement.noEnrollmentsTitle')}
                />
              ) : (
                <div className="space-y-4">
                  {student.enrollments.map((enrollment) => (
                    <article
                      className="flex flex-col gap-4 rounded-[1.75rem] border border-ghost bg-surface-low p-5 sm:flex-row sm:items-center sm:justify-between"
                      key={enrollment.courseId}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          alt={enrollment.courseName}
                          className="h-20 w-32 rounded-2xl object-cover"
                          src={enrollment.courseThumbnail}
                        />
                        <div className="text-right">
                          <h3 className="text-lg font-bold text-foreground">
                            {enrollment.courseName}
                          </h3>
                          <p className="mt-1 text-sm text-muted">
                            {t('admin.studentsManagement.enrolledAt', {
                              date: formatAdminDate(enrollment.enrolledAt),
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold text-foreground">
                          {t('admin.studentsManagement.lessonsWatched', {
                            count: enrollment.lessonsWatched,
                          })}
                        </div>
                        <Link
                          className="mt-2 inline-flex text-sm font-semibold text-secondary transition hover:underline"
                          to={`/courses/${enrollment.courseSlug}`}
                        >
                          {t('admin.studentsManagement.viewCourse')}
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[2rem] border border-ghost bg-surface-high p-6 shadow-ambient xl:sticky xl:top-6">
              <h2 className="text-xl font-black text-foreground">
                {t('admin.studentsManagement.studentDetail')}
              </h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">{t('admin.studentsManagement.studentName')}</dt>
                  <dd className="font-semibold text-foreground">{student.name}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">{t('admin.studentsManagement.studentEmail')}</dt>
                  <dd className="font-semibold text-foreground">{student.email}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">{t('admin.studentsManagement.joinDate')}</dt>
                  <dd className="font-semibold text-foreground">
                    {formatAdminDate(student.joinedAt)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">{t('admin.studentsManagement.enrollmentsColumn')}</dt>
                  <dd className="font-semibold text-foreground">{student.enrollments.length}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  )
}
