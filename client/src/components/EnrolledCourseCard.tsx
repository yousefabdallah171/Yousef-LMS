import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { StudentEnrollment } from '../hooks/useEnrollments'
import { formatPrice } from '../utils/formatPrice'
import { ButtonLink } from './ui/Button'

export function EnrolledCourseCard({ enrollment }: { enrollment: StudentEnrollment }) {
  const { t } = useTranslation()

  const progressLabel = useMemo(() => {
    if (!enrollment.lessonsCount) {
      return '0%'
    }

    return `${Math.round((enrollment.lessonsWatched / enrollment.lessonsCount) * 100)}%`
  }, [enrollment.lessonsCount, enrollment.lessonsWatched])

  const continueTo = enrollment.continueLessonId
    ? `/courses/${enrollment.courseSlug}/lessons/${enrollment.continueLessonId}`
    : `/courses/${enrollment.courseSlug}`

  return (
    <article className="overflow-hidden rounded-[2rem] border border-ghost bg-surface-low shadow-ambient">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          alt={enrollment.courseName}
          className="h-full w-full object-cover"
          src={enrollment.courseThumbnail}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-high to-transparent" />
      </div>
      <div className="space-y-5 p-6 text-right">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold text-muted">
            <span>{progressLabel}</span>
            <span>
              {enrollment.lessonsWatched} / {enrollment.lessonsCount}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-highest">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: progressLabel }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-foreground">{enrollment.courseName}</h3>
          <p className="text-sm text-muted">{formatPrice(enrollment.price)}</p>
        </div>

        <ButtonLink className="w-full py-3" to={continueTo}>
          {t('dashboard.continueLearning')}
        </ButtonLink>
      </div>
    </article>
  )
}
