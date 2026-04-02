import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { LessonListItem } from '../components/LessonListItem'
import { PurchaseRequiredModal } from '../components/PurchaseRequiredModal'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { useCourseLesson } from '../hooks/useCourse'

export function LessonPlayerPage() {
  const { t } = useTranslation()
  const { slug, id } = useParams()
  const { data, isLoading, isError, refetch, error } = useCourseLesson(slug, id)
  const [lockedLessonTitle, setLockedLessonTitle] = useState<string | undefined>()

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <div className="h-[32rem] animate-pulse rounded-[2rem] bg-surface-highest/40" />
          <div className="space-y-6">
            <div className="aspect-video animate-pulse rounded-[2rem] bg-surface-highest/40" />
            <div className="h-12 w-2/3 animate-pulse rounded-3xl bg-surface-highest/40" />
            <div className="h-32 animate-pulse rounded-[2rem] bg-surface-highest/30" />
          </div>
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
              {t('lesson.videoRetry')}
            </Button>
          }
          description={
            status === 403
              ? t('catalog.lessonRequiresEnrollment')
              : t('lesson.videoError')
          }
          title={status === 403 ? t('lesson.locked') : t('common.error')}
        />
      </main>
    )
  }

  const { course, lesson, enrollment } = data
  const flattenedLessons = course.sections.flatMap((section) => section.lessons)
  const currentLessonIndex = flattenedLessons.findIndex((entry) => entry.id === lesson.id)
  const nextLesson = flattenedLessons[currentLessonIndex + 1]
  const isNextLessonAccessible = nextLesson
    ? nextLesson.isFreePreview || enrollment.enrolled
    : false
  const hasPlayableVideo = typeof lesson.videoUrl === 'string' && lesson.videoUrl.length > 0

  return (
    <>
      <main className="mx-auto max-w-[96rem] px-6 pb-20 pt-28 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-white/10 bg-surface-high p-6 lg:sticky lg:top-28 lg:h-[calc(100dvh-9rem)] lg:overflow-auto">
            <div className="mb-6 space-y-3 text-end">
              <h2 className="text-2xl font-black text-balance">
                {t('catalog.curriculumTitle')}
              </h2>
              <p className="text-sm text-muted">{course.title}</p>
            </div>

            <div className="space-y-5">
              {course.sections.map((section) => (
                <section key={section.id}>
                  <h3 className="mb-3 text-sm font-semibold text-muted">{section.title}</h3>
                  <div className="space-y-2">
                    {section.lessons.map((entry) => (
                      <LessonListItem
                        courseSlug={course.slug}
                        isAccessible={entry.isFreePreview || enrollment.enrolled}
                        isActive={entry.id === lesson.id}
                        key={entry.id}
                        lesson={entry}
                        onLockedClick={() => setLockedLessonTitle(entry.title)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </aside>

          <div className="space-y-8">
            <nav className="flex flex-wrap items-center justify-end gap-2 text-sm text-muted">
              <Link className="hover:text-primary" to="/courses">
                {t('nav.courses')}
              </Link>
              <span aria-hidden="true">/</span>
              <Link className="hover:text-primary" to={`/courses/${course.slug}`}>
                {course.title}
              </Link>
              <span aria-hidden="true">/</span>
              <span>{lesson.title}</span>
            </nav>

            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-surface-high">
              <div className="aspect-video bg-black">
                {hasPlayableVideo ? (
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                    src={lesson.videoUrl}
                    title={lesson.title}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-6">
                    <EmptyState
                      action={
                        <Button onClick={() => void refetch()} type="button">
                          {t('lesson.videoRetry')}
                        </Button>
                      }
                      description={t('lesson.videoError')}
                      title={t('common.error')}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4 border-t border-white/10 p-6 sm:flex-row-reverse sm:items-center sm:justify-between">
                <div className="text-end">
                  <div className="text-sm text-muted tabular-nums">
                    {t('catalog.lessonNumber', { count: lesson.orderIndex })}
                  </div>
                  <h1 className="mt-2 text-4xl font-black text-balance">{lesson.title}</h1>
                </div>
                {nextLesson && isNextLessonAccessible ? (
                  <Link
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white"
                    to={`/courses/${course.slug}/lessons/${nextLesson.id}`}
                  >
                    {t('catalog.nextLesson')}
                  </Link>
                ) : null}
                {nextLesson && !isNextLessonAccessible ? (
                  <Button
                    className="px-6 py-4"
                    onClick={() => setLockedLessonTitle(nextLesson.title)}
                    type="button"
                  >
                    {t('catalog.nextLesson')}
                  </Button>
                ) : null}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-surface-high p-8 text-end">
              <h2 className="text-2xl font-black text-balance">
                {t('lesson.lessonDescription')}
              </h2>
              <p className="mt-4 text-base leading-8 text-muted text-pretty">
                {lesson.description || t('catalog.lessonDescriptionFallback')}
              </p>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-surface-low p-8 text-end">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-surface-high px-4 py-2 text-sm tabular-nums text-muted">
                  0
                </span>
                <h2 className="text-2xl font-black">{t('catalog.commentsTitle')}</h2>
              </div>
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/10 bg-surface-high p-6">
                <p className="text-sm leading-7 text-muted text-pretty">
                  {t('catalog.commentsComingSoon')}
                </p>
              </div>
            </section>
          </div>
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
