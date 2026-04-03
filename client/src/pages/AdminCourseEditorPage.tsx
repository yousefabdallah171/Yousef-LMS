import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'

import type {
  AdminCourseDetailDto,
  AdminCourseLessonDto,
  AdminCourseRequest,
  AdminLessonRequest,
  AdminSectionRequest,
} from '@yousef-lms/shared/types/api'

import { EmptyState } from '../components/ui/EmptyState'
import {
  getAdminCourseErrorMessage,
  useAdminCourse,
  useCreateCourse,
  useCreateLesson,
  useCreateSection,
  useDeleteCourse,
  useDeleteLesson,
  usePublishCourse,
  useUnpublishCourse,
  useUpdateCourse,
  useUpdateLesson,
} from '../hooks/useAdminCourses'

type CourseFormState = AdminCourseRequest
type SectionFormState = AdminSectionRequest
type LessonFormState = Required<AdminLessonRequest>

function buildCourseForm(course?: AdminCourseDetailDto | null): CourseFormState {
  return {
    title: course?.title ?? '',
    description: course?.description ?? '',
    thumbnailUrl: course?.thumbnailUrl ?? '',
    price: course?.price ?? 0,
  }
}

function buildSectionForm(course?: AdminCourseDetailDto | null): SectionFormState {
  return {
    title: '',
    orderIndex: (course?.sections.at(-1)?.orderIndex ?? 0) + 1,
  }
}

function buildLessonForm(lesson?: AdminCourseLessonDto): LessonFormState {
  return {
    title: lesson?.title ?? '',
    videoUrl: lesson?.videoUrl ?? '',
    description: lesson?.description ?? '',
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function parseNumber(value: string) {
  const next = Number(value)
  return Number.isFinite(next) ? next : 0
}

export function AdminCourseEditorPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const params = useParams()
  const courseId = params.id
  const isNew = !courseId
  const { data, isLoading, isError, refetch } = useAdminCourse(courseId)
  const course = data?.course

  const [courseForm, setCourseForm] = useState<CourseFormState>(buildCourseForm())
  const [sectionForm, setSectionForm] = useState<SectionFormState>(buildSectionForm())
  const [lessonForms, setLessonForms] = useState<Record<string, LessonFormState>>({})
  const [newLessonForms, setNewLessonForms] = useState<Record<string, LessonFormState>>({})
  const [feedback, setFeedback] = useState<string | null>(null)

  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse()
  const publishCourse = usePublishCourse()
  const unpublishCourse = useUnpublishCourse()
  const deleteCourse = useDeleteCourse()
  const createSection = useCreateSection()
  const createLesson = useCreateLesson()
  const updateLesson = useUpdateLesson()
  const deleteLesson = useDeleteLesson()

  useEffect(() => {
    setCourseForm(buildCourseForm(course))
    setSectionForm(buildSectionForm(course))

    if (!course) {
      setLessonForms({})
      setNewLessonForms({})
      return
    }

    setLessonForms(
      Object.fromEntries(
        course.sections.flatMap((section) =>
          section.lessons.map((lesson) => [lesson.id, buildLessonForm(lesson)]),
        ),
      ),
    )
    setNewLessonForms(
      Object.fromEntries(
        course.sections.map((section) => [section.id, buildLessonForm()]),
      ),
    )
  }, [course])

  function setExistingLessonValue(lessonId: string, field: keyof LessonFormState, value: string) {
    setLessonForms((current) => ({
      ...current,
      [lessonId]: {
        ...current[lessonId],
        [field]: value,
      },
    }))
  }

  function setNewLessonValue(sectionId: string, field: keyof LessonFormState, value: string) {
    setNewLessonForms((current) => ({
      ...current,
      [sectionId]: {
        ...(current[sectionId] ?? buildLessonForm()),
        [field]: value,
      },
    }))
  }

  async function ensureCourseSaved() {
    if (courseId) {
      return courseId
    }

    const created = await createCourse.mutateAsync(courseForm)
    navigate(`/admin/courses/${created.course.id}/edit`, { replace: true })
    return created.course.id
  }

  async function handleSaveDraft() {
    try {
      if (courseId) {
        await updateCourse.mutateAsync({
          courseId,
          payload: courseForm,
        })
      } else {
        const created = await createCourse.mutateAsync(courseForm)
        navigate(`/admin/courses/${created.course.id}/edit`, { replace: true })
      }

      setFeedback(t('admin.courses.courseSaved'))
    } catch (error) {
      setFeedback(getAdminCourseErrorMessage(error, t('admin.courses.genericError')))
    }
  }

  async function handlePublish() {
    try {
      const targetCourseId = await ensureCourseSaved()
      await updateCourse.mutateAsync({
        courseId: targetCourseId,
        payload: courseForm,
      })
      await publishCourse.mutateAsync(targetCourseId)
      setFeedback(t('admin.courses.coursePublished'))
    } catch (error) {
      setFeedback(getAdminCourseErrorMessage(error, t('admin.courses.genericError')))
    }
  }

  async function handleUnpublish() {
    if (!courseId) {
      return
    }

    try {
      await unpublishCourse.mutateAsync(courseId)
      setFeedback(t('admin.courses.courseUnpublished'))
    } catch (error) {
      setFeedback(getAdminCourseErrorMessage(error, t('admin.courses.genericError')))
    }
  }

  async function handleDeleteCourse() {
    if (!courseId || !window.confirm(t('admin.courses.deleteConfirm'))) {
      return
    }

    try {
      await deleteCourse.mutateAsync(courseId)
      navigate('/admin/courses')
    } catch (error) {
      setFeedback(getAdminCourseErrorMessage(error, t('admin.courses.genericError')))
    }
  }

  async function handleCreateSection() {
    try {
      const targetCourseId = await ensureCourseSaved()
      await createSection.mutateAsync({
        courseId: targetCourseId,
        payload: sectionForm,
      })
      setFeedback(t('admin.courses.sectionSaved'))
    } catch (error) {
      setFeedback(getAdminCourseErrorMessage(error, t('admin.courses.genericError')))
    }
  }

  async function handleCreateLesson(sectionId: string) {
    if (!courseId) {
      return
    }

    try {
      await createLesson.mutateAsync({
        courseId,
        sectionId,
        payload: newLessonForms[sectionId] ?? buildLessonForm(),
      })
      setFeedback(t('admin.courses.lessonSaved'))
      setNewLessonForms((current) => ({
        ...current,
        [sectionId]: buildLessonForm(),
      }))
    } catch (error) {
      setFeedback(getAdminCourseErrorMessage(error, t('admin.courses.genericError')))
    }
  }

  async function handleSaveLesson(lessonId: string) {
    if (!courseId) {
      return
    }

    try {
      await updateLesson.mutateAsync({
        courseId,
        lessonId,
        payload: lessonForms[lessonId],
      })
      setFeedback(t('admin.courses.lessonSaved'))
    } catch (error) {
      setFeedback(getAdminCourseErrorMessage(error, t('admin.courses.genericError')))
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    if (!courseId || !window.confirm(t('admin.courses.deleteLessonConfirm'))) {
      return
    }

    try {
      await deleteLesson.mutateAsync({
        courseId,
        lessonId,
      })
      setFeedback(t('admin.courses.lessonDeleted'))
    } catch (error) {
      setFeedback(getAdminCourseErrorMessage(error, t('admin.courses.genericError')))
    }
  }

  return (
    <section className="space-y-8">
      <header className="rounded-[2rem] border border-ghost bg-surface-high p-8 shadow-ambient">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="text-right">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
              {isNew ? t('admin.courses.newCourse') : t('admin.courses.editCourse')}
            </div>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-foreground">
              {isNew ? t('admin.courses.editorTitle') : course?.title ?? t('admin.courses.editCourse')}
            </h1>
            <p className="mt-2 text-sm leading-7 text-muted">
              {t('admin.courses.editorSubtitle')}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-2xl border border-ghost bg-surface-low px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-highest"
              to="/admin/courses"
            >
              {t('admin.courses.backToList')}
            </Link>
            <button
              className="rounded-2xl border border-ghost bg-surface-low px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-highest"
              id="save-draft-button"
              onClick={() => void handleSaveDraft()}
              type="button"
            >
              {t('admin.courses.saveDraft')}
            </button>
            {course?.status === 'published' ? (
              <button
                className="rounded-2xl bg-warning px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                id="unpublish-course-button"
                onClick={() => void handleUnpublish()}
                type="button"
              >
                {t('admin.courses.unpublishCourse')}
              </button>
            ) : (
              <button
                className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                id="publish-course-button"
                onClick={() => void handlePublish()}
                type="button"
              >
                {t('admin.courses.publishCourse')}
              </button>
            )}
          </div>
        </div>
      </header>

      {feedback ? (
        <div className="rounded-2xl border border-ghost bg-surface-high p-4 text-sm text-foreground shadow-ambient">
          {feedback}
        </div>
      ) : null}

      {!isNew && isLoading ? (
        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-4 rounded-[2rem] border border-ghost bg-surface-high p-6 shadow-ambient">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="h-16 animate-pulse rounded-2xl bg-surface-low" key={index} />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-[2rem] border border-ghost bg-surface-high shadow-ambient" />
        </div>
      ) : null}

      {!isNew && !isLoading && isError ? (
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
          description={t('admin.courses.loadError')}
          title={t('common.error')}
        />
      ) : null}

      {(isNew || course) && !isLoading ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_340px]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-ghost bg-surface-high p-6 shadow-ambient">
              <div className="mb-6 text-right">
                <h2 className="text-2xl font-black text-foreground">
                  {t('admin.courses.courseInfoTitle')}
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {t('admin.courses.courseInfoDescription')}
                </p>
              </div>

              <div className="grid gap-4">
                <label
                  className="space-y-2 text-sm font-semibold text-foreground"
                  htmlFor="course-title"
                >
                  <span>{t('admin.courses.courseTitleLabel')}</span>
                  <input
                    className="w-full rounded-2xl border border-ghost bg-surface-low px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                    id="course-title"
                    onChange={(event) =>
                      setCourseForm((current) => ({ ...current, title: event.target.value }))
                    }
                    value={courseForm.title}
                  />
                </label>
                <label
                  className="space-y-2 text-sm font-semibold text-foreground"
                  htmlFor="course-description"
                >
                  <span>{t('admin.courses.courseDescriptionLabel')}</span>
                  <textarea
                    className="min-h-40 w-full rounded-2xl border border-ghost bg-surface-low px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                    id="course-description"
                    onChange={(event) =>
                      setCourseForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    value={courseForm.description}
                  />
                </label>
                <label
                  className="space-y-2 text-sm font-semibold text-foreground"
                  htmlFor="course-thumbnail-url"
                >
                  <span>{t('admin.courses.thumbnailUrlLabel')}</span>
                  <input
                    className="w-full rounded-2xl border border-ghost bg-surface-low px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                    id="course-thumbnail-url"
                    onChange={(event) =>
                      setCourseForm((current) => ({
                        ...current,
                        thumbnailUrl: event.target.value,
                      }))
                    }
                    value={courseForm.thumbnailUrl}
                  />
                </label>
                <label
                  className="space-y-2 text-sm font-semibold text-foreground"
                  htmlFor="course-price"
                >
                  <span>{t('admin.courses.priceLabel')}</span>
                  <input
                    className="w-full rounded-2xl border border-ghost bg-surface-low px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                    id="course-price"
                    min="0"
                    onChange={(event) =>
                      setCourseForm((current) => ({
                        ...current,
                        price: parseNumber(event.target.value),
                      }))
                    }
                    step="0.01"
                    type="number"
                    value={courseForm.price}
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[2rem] border border-ghost bg-surface-high p-6 shadow-ambient">
              <div className="mb-6 flex flex-col gap-3 text-right sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-foreground">
                    {t('admin.courses.curriculumTitle')}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {t('admin.courses.curriculumDescription')}
                  </p>
                </div>
              </div>

              {!courseId ? (
                <EmptyState
                  description={t('admin.courses.saveBeforeSections')}
                  title={t('admin.courses.curriculumTitle')}
                />
              ) : (
                <div className="space-y-6">
                  {course?.sections.map((section) => (
                    <article
                      className="rounded-[1.75rem] border border-ghost bg-surface-low p-5"
                      key={section.id}
                    >
                      <div className="flex flex-col gap-3 border-b border-ghost pb-4 text-right sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{section.title}</h3>
                          <p className="mt-1 text-xs text-muted">
                            {t('admin.courses.sectionMeta', {
                              order: section.orderIndex,
                              count: section.lessons.length,
                            })}
                          </p>
                        </div>
                        <div className="text-xs text-muted">
                          {formatDate(section.createdAt)}
                        </div>
                      </div>

                      <div className="mt-5 space-y-4">
                        {section.lessons.map((lesson) => {
                          const lessonForm = lessonForms[lesson.id] ?? buildLessonForm(lesson)

                          return (
                            <div
                              className="rounded-2xl border border-ghost bg-surface-high p-4"
                              key={lesson.id}
                            >
                              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-right">
                                <div>
                                  <div className="text-sm font-semibold text-foreground">
                                    {lesson.title}
                                  </div>
                                  <div className="mt-1 text-xs text-muted">
                                    {t('admin.courses.lessonMeta', {
                                      order: lesson.orderIndex,
                                      free: lesson.isFreePreview
                                        ? t('admin.courses.previewIncluded')
                                        : t('admin.courses.paidOnly'),
                                    })}
                                  </div>
                                </div>
                                <button
                                  className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                                  id={`delete-lesson-${lesson.id}`}
                                  onClick={() => void handleDeleteLesson(lesson.id)}
                                  type="button"
                                >
                                  {t('admin.courses.deleteLesson')}
                                </button>
                              </div>

                              <div className="grid gap-3">
                                <label
                                  className="space-y-2 text-sm font-semibold text-foreground"
                                  htmlFor={`lesson-${lesson.id}-title`}
                                >
                                  <span>{t('admin.courses.lessonTitle')}</span>
                                  <input
                                    className="w-full rounded-2xl border border-ghost bg-surface-low px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                                    id={`lesson-${lesson.id}-title`}
                                    onChange={(event) =>
                                      setExistingLessonValue(
                                        lesson.id,
                                        'title',
                                        event.target.value,
                                      )
                                    }
                                    value={lessonForm.title}
                                  />
                                </label>
                                <label
                                  className="space-y-2 text-sm font-semibold text-foreground"
                                  htmlFor={`lesson-${lesson.id}-video`}
                                >
                                  <span>{t('admin.courses.videoUrl')}</span>
                                  <input
                                    className="w-full rounded-2xl border border-ghost bg-surface-low px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                                    id={`lesson-${lesson.id}-video`}
                                    onChange={(event) =>
                                      setExistingLessonValue(
                                        lesson.id,
                                        'videoUrl',
                                        event.target.value,
                                      )
                                    }
                                    value={lessonForm.videoUrl}
                                  />
                                </label>
                                <label
                                  className="space-y-2 text-sm font-semibold text-foreground"
                                  htmlFor={`lesson-${lesson.id}-description`}
                                >
                                  <span>{t('admin.courses.lessonDescription')}</span>
                                  <textarea
                                    className="min-h-24 w-full rounded-2xl border border-ghost bg-surface-low px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                                    id={`lesson-${lesson.id}-description`}
                                    onChange={(event) =>
                                      setExistingLessonValue(
                                        lesson.id,
                                        'description',
                                        event.target.value,
                                      )
                                    }
                                    value={lessonForm.description}
                                  />
                                </label>
                              </div>

                              <div className="mt-4 flex justify-end">
                                <button
                                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                                  id={`save-lesson-${lesson.id}`}
                                  onClick={() => void handleSaveLesson(lesson.id)}
                                  type="button"
                                >
                                  {t('admin.courses.saveLesson')}
                                </button>
                              </div>
                            </div>
                          )
                        })}

                        <div className="rounded-2xl border border-dashed border-ghost bg-surface-high p-4">
                          <div className="mb-4 text-sm font-semibold text-foreground">
                            {t('admin.courses.addLesson')}
                          </div>
                          <div className="grid gap-3">
                            <label
                              className="space-y-2 text-sm font-semibold text-foreground"
                              htmlFor={`section-${section.id}-new-lesson-title`}
                            >
                              <span>{t('admin.courses.lessonTitle')}</span>
                              <input
                                className="w-full rounded-2xl border border-ghost bg-surface-low px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                                id={`section-${section.id}-new-lesson-title`}
                                onChange={(event) =>
                                  setNewLessonValue(section.id, 'title', event.target.value)
                                }
                                value={(newLessonForms[section.id] ?? buildLessonForm()).title}
                              />
                            </label>
                            <label
                              className="space-y-2 text-sm font-semibold text-foreground"
                              htmlFor={`section-${section.id}-new-lesson-video`}
                            >
                              <span>{t('admin.courses.videoUrl')}</span>
                              <input
                                className="w-full rounded-2xl border border-ghost bg-surface-low px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                                id={`section-${section.id}-new-lesson-video`}
                                onChange={(event) =>
                                  setNewLessonValue(section.id, 'videoUrl', event.target.value)
                                }
                                value={(newLessonForms[section.id] ?? buildLessonForm()).videoUrl}
                              />
                            </label>
                            <label
                              className="space-y-2 text-sm font-semibold text-foreground"
                              htmlFor={`section-${section.id}-new-lesson-description`}
                            >
                              <span>{t('admin.courses.lessonDescription')}</span>
                              <textarea
                                className="min-h-24 w-full rounded-2xl border border-ghost bg-surface-low px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                                id={`section-${section.id}-new-lesson-description`}
                                onChange={(event) =>
                                  setNewLessonValue(section.id, 'description', event.target.value)
                                }
                                value={
                                  (newLessonForms[section.id] ?? buildLessonForm()).description
                                }
                              />
                            </label>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button
                              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                              id={`add-lesson-${section.id}`}
                              onClick={() => void handleCreateLesson(section.id)}
                              type="button"
                            >
                              {t('admin.courses.addLesson')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}

                  <div className="rounded-[1.75rem] border border-dashed border-ghost bg-surface-low p-5">
                    <h3 className="text-lg font-bold text-foreground">
                      {t('admin.courses.addSection')}
                    </h3>
                    <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px]">
                      <label
                        className="space-y-2 text-sm font-semibold text-foreground"
                        htmlFor="section-title"
                      >
                        <span>{t('admin.courses.sectionTitle')}</span>
                        <input
                          className="w-full rounded-2xl border border-ghost bg-surface-high px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                          id="section-title"
                          onChange={(event) =>
                            setSectionForm((current) => ({
                              ...current,
                              title: event.target.value,
                            }))
                          }
                          value={sectionForm.title}
                        />
                      </label>
                      <label
                        className="space-y-2 text-sm font-semibold text-foreground"
                        htmlFor="section-order-index"
                      >
                        <span>{t('admin.courses.sectionOrderLabel')}</span>
                        <input
                          className="w-full rounded-2xl border border-ghost bg-surface-high px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                          id="section-order-index"
                          min="1"
                          onChange={(event) =>
                            setSectionForm((current) => ({
                              ...current,
                              orderIndex: parseNumber(event.target.value),
                            }))
                          }
                          type="number"
                          value={sectionForm.orderIndex}
                        />
                      </label>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                        id="add-section-button"
                        onClick={() => void handleCreateSection()}
                        type="button"
                      >
                        {t('admin.courses.addSection')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[2rem] border border-ghost bg-surface-high p-6 shadow-ambient xl:sticky xl:top-6">
              <h2 className="text-xl font-black text-foreground">
                {t('admin.courses.publishPanelTitle')}
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted">
                {t('admin.courses.publishPanelDescription')}
              </p>

              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">{t('admin.courses.currentStatus')}</dt>
                  <dd className="font-semibold text-foreground">
                    {course?.status
                      ? t(`admin.courses.statuses.${course.status}`)
                      : t('admin.courses.statuses.draft')}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">{t('admin.courses.totalSections')}</dt>
                  <dd className="font-semibold text-foreground">{course?.sectionsCount ?? 0}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">{t('admin.courses.totalLessons')}</dt>
                  <dd className="font-semibold text-foreground">{course?.lessonsCount ?? 0}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">{t('admin.courses.totalEnrollments')}</dt>
                  <dd className="font-semibold text-foreground">
                    {course?.enrollmentsCount ?? 0}
                  </dd>
                </div>
                {course?.updatedAt ? (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted">{t('admin.courses.updatedAtColumn')}</dt>
                    <dd className="font-semibold text-foreground">
                      {formatDate(course.updatedAt)}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {courseForm.thumbnailUrl ? (
                <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-ghost bg-surface-low">
                  <img
                    alt={courseForm.title || t('admin.courses.thumbnailPreviewAlt')}
                    className="h-44 w-full object-cover"
                    src={courseForm.thumbnailUrl}
                  />
                </div>
              ) : null}

              {courseId ? (
                <button
                  className="mt-6 w-full rounded-2xl bg-danger px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  id="delete-course-button"
                  onClick={() => void handleDeleteCourse()}
                  type="button"
                >
                  {t('admin.courses.deleteCourse')}
                </button>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  )
}
