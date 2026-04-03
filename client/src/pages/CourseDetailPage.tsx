import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { LessonListItem } from '../components/LessonListItem'
import { PurchaseRequiredModal } from '../components/PurchaseRequiredModal'
import { Button, ButtonLink } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { useAuth } from '../context/AuthContext'
import { useCourse } from '../hooks/useCourse'
import { formatPrice } from '../utils/formatPrice'

export function CourseDetailPage() {
  const { t } = useTranslation()
  const { slug } = useParams()
  const { user } = useAuth()
  const { data, isLoading, isError, refetch, error } = useCourse(slug)
  const [lockedLessonTitle, setLockedLessonTitle] = useState<string | undefined>()

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <div className="h-8 w-48 animate-pulse rounded-full bg-surface-highest/50" />
            <div className="h-16 w-3/4 animate-pulse rounded-3xl bg-surface-highest/50" />
            <div className="h-28 animate-pulse rounded-3xl bg-surface-highest/40" />
            <div className="h-96 animate-pulse rounded-[2rem] bg-surface-highest/40" />
          </div>
          <div className="h-[32rem] animate-pulse rounded-[2rem] bg-surface-highest/40" />
        </div>
      </main>
    )
  }

  if (isError || !data) {
    const status = (error as { response?: { status?: number } } | undefined)?.response
      ?.status

    return (
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-32 md:px-8">
        <EmptyState
          action={
            <Button onClick={() => void refetch()} type="button">
              {t('common.retry')}
            </Button>
          }
          description={
            status === 404
              ? t('catalog.notFoundDescription')
              : t('catalog.detailLoadErrorDescription')
          }
          title={status === 404 ? t('catalog.notFound') : t('common.error')}
        />
      </main>
    )
  }

  const { course, enrollment } = data
  const allLessons = course.sections.flatMap((section) => section.lessons)
  const totalLessons = allLessons.length
  const freeLessons = allLessons.filter((lesson) => lesson.isFreePreview)
  const firstAccessibleLesson = allLessons.find(
    (lesson) => lesson.isFreePreview || enrollment.enrolled,
  )

  return (
    <>
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="order-2 space-y-10 lg:order-1">
            <nav className="flex flex-wrap items-center justify-end gap-2 text-sm text-muted">
              <Link className="hover:text-primary" to="/">
                {t('nav.home')}
              </Link>
              <span aria-hidden="true">/</span>
              <Link className="hover:text-primary" to="/courses">
                {t('nav.courses')}
              </Link>
              <span aria-hidden="true">/</span>
              <span>{course.title}</span>
            </nav>

            <header className="space-y-6 text-end">
              <h1 className="text-5xl font-black text-balance md:text-6xl">
                {course.title}
              </h1>
              <p className="max-w-4xl text-lg leading-8 text-muted text-pretty">
                {course.description}
              </p>
              <div className="flex flex-wrap justify-end gap-3 text-sm text-muted">
                <span className="rounded-full bg-surface-high px-4 py-2 tabular-nums">
                  {t('catalog.courseCount', { count: totalLessons })}
                </span>
                <span className="rounded-full bg-surface-high px-4 py-2 tabular-nums">
                  {t('catalog.previewCount', { count: freeLessons.length })}
                </span>
                <span className="rounded-full bg-surface-high px-4 py-2">
                  {enrollment.enrolled
                    ? t('catalog.enrolledStatus')
                    : t('catalog.previewAvailable')}
                </span>
              </div>
            </header>

            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-surface-low">
              <img
                alt={course.title}
                className="aspect-[16/8] w-full object-cover"
                src={course.thumbnailUrl}
              />
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-surface-high p-8">
              <div className="mb-8 flex items-end justify-between gap-4">
                <p className="text-sm text-muted tabular-nums">
                  {t('catalog.curriculumMeta', {
                    sections: course.sections.length,
                    lessons: totalLessons,
                  })}
                </p>
                <h2 className="text-3xl font-black text-balance">
                  {t('catalog.curriculumTitle')}
                </h2>
              </div>

              <div className="space-y-6">
                {course.sections.map((section) => (
                  <section
                    className="rounded-[1.5rem] border border-white/10 bg-surface-low p-5"
                    key={section.id}
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="text-sm text-muted tabular-nums">
                        {t('catalog.sectionLessonCount', {
                          count: section.lessons.length,
                        })}
                      </span>
                      <h3 className="text-xl font-bold text-balance">{section.title}</h3>
                    </div>
                    <div className="space-y-3">
                      {section.lessons.map((lesson) => (
                        <LessonListItem
                          courseSlug={course.slug}
                          isAccessible={lesson.isFreePreview || enrollment.enrolled}
                          isEnrolled={enrollment.enrolled}
                          key={lesson.id}
                          lesson={lesson}
                          onLockedClick={() => setLockedLessonTitle(lesson.title)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          </div>

          <aside className="order-1 lg:sticky lg:top-28 lg:order-2 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-surface-high shadow-2xl">
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt={course.title}
                  className="h-full w-full object-cover"
                  src={course.thumbnailUrl}
                />
                <div className="absolute inset-0 bg-black/35" />
              </div>
              <div className="space-y-6 p-8 text-end">
                <div>
                  <p className="text-xs font-semibold text-muted">
                    {t('catalog.priceLabel')}
                  </p>
                  <p className="mt-2 text-4xl font-black tabular-nums text-primary">
                    {formatPrice(course.price)}
                  </p>
                </div>

                <div className="grid gap-3">
                  {enrollment.enrolled ? (
                    <ButtonLink
                      className="py-4 text-base"
                      to={
                        firstAccessibleLesson
                          ? `/courses/${course.slug}/lessons/${firstAccessibleLesson.id}`
                          : `/courses/${course.slug}`
                      }
                    >
                      {t('catalog.continueLearning')}
                    </ButtonLink>
                  ) : (
                    <ButtonLink
                      className="py-4 text-base"
                      to={user ? `/payment/${course.id}` : '/login'}
                    >
                      {t('catalog.buyNow')}
                    </ButtonLink>
                  )}

                  {firstAccessibleLesson ? (
                    <ButtonLink
                      className="py-4 text-base"
                      to={`/courses/${course.slug}/lessons/${firstAccessibleLesson.id}`}
                      variant="secondary"
                    >
                      {t('catalog.watchFreeLessons')}
                    </ButtonLink>
                  ) : null}
                </div>

                <div className="space-y-3 border-t border-white/10 pt-6 text-sm text-muted">
                  <div className="flex items-center justify-between gap-3">
                    <span className="tabular-nums">
                      {t('catalog.previewCount', { count: freeLessons.length })}
                    </span>
                    <span>{t('catalog.freePreviewAccess')}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>{t('catalog.lifetimeAccess')}</span>
                    <span>{t('catalog.courseBenefitLifetime')}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>{t('catalog.manualReview')}</span>
                    <span>{t('catalog.courseBenefitManualReview')}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <PurchaseRequiredModal
        courseId={course.id}
        courseSlug={course.slug}
        courseTitle={course.title}
        lockedLessonTitle={lockedLessonTitle}
        onClose={() => setLockedLessonTitle(undefined)}
        open={Boolean(lockedLessonTitle)}
        price={course.price}
      />
    </>
  )
}
