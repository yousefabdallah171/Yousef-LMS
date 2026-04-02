import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type LessonListItemProps = {
  courseSlug: string
  lesson: {
    id: string
    title: string
    orderIndex: number
    isFreePreview: boolean
  }
  isAccessible: boolean
  isActive?: boolean
  onLockedClick?: () => void
}

export function LessonListItem({
  courseSlug,
  lesson,
  isAccessible,
  isActive = false,
  onLockedClick,
}: LessonListItemProps) {
  const { t } = useTranslation()
  const itemClassName = [
    'flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-start transition-colors duration-200',
    isActive
      ? 'border-primary/40 bg-surface-highest'
      : 'border-transparent bg-surface-high/40 hover:border-white/10 hover:bg-surface-high',
  ].join(' ')

  const content = (
    <>
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className={`flex size-10 items-center justify-center rounded-full text-lg ${
            isAccessible ? 'bg-primary/10 text-primary' : 'bg-surface-highest text-muted'
          }`}
        >
          {isAccessible ? '\u25B6' : '\uD83D\uDD12'}
        </span>
        <div className="space-y-1">
          <div className="text-sm text-muted tabular-nums">
            {t('catalog.lessonNumber', { count: lesson.orderIndex })}
          </div>
          <div className="text-base font-semibold text-foreground">{lesson.title}</div>
        </div>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${
          lesson.isFreePreview
            ? 'bg-primary/10 text-primary'
            : 'bg-surface-highest text-muted'
        }`}
      >
        {lesson.isFreePreview ? t('lesson.freePreview') : t('lesson.locked')}
      </span>
    </>
  )

  if (isAccessible) {
    return (
      <Link
        className={itemClassName}
        to={`/courses/${courseSlug}/lessons/${lesson.id}`}
      >
        {content}
      </Link>
    )
  }

  return (
    <button className={itemClassName} onClick={onLockedClick} type="button">
      {content}
    </button>
  )
}
