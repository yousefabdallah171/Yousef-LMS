import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { formatPrice } from '../utils/formatPrice'

type CourseCardProps = {
  course: {
    id: string
    slug: string
    title: string
    description: string
    thumbnailUrl: string
    price: number
    lessonsCount: number
    freePreviewLessonsCount: number
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const { t } = useTranslation()

  return (
    <article className="group overflow-hidden rounded-xl border border-[#1F2937] bg-[#111827] transition-all duration-300 hover:border-secondary/50 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)]">
      <div className="relative aspect-video overflow-hidden">
        <img
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={course.thumbnailUrl}
        />
        {course.freePreviewLessonsCount > 0 ? (
          <div className="absolute end-4 top-4 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
            {t('catalog.freePreview')}
          </div>
        ) : null}
      </div>

      <div className="p-6">
        {course.freePreviewLessonsCount > 0 ? (
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-block rounded bg-secondary/10 px-2 py-1 text-[10px] font-bold tracking-wider text-secondary">
              {t('catalog.courseCount', { count: course.freePreviewLessonsCount })}
            </span>
          </div>
        ) : null}

        <h3 className="mb-3 text-xl font-bold text-[#F9FAFB] transition-colors group-hover:text-secondary">
          {course.title}
        </h3>

        <p className="mb-6 text-sm leading-7 text-slate-400">
          {course.description}
        </p>

        <div className="flex items-end justify-between gap-4 border-t border-[#1F2937] pt-6">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">
              {t('catalog.courseCount', { count: course.lessonsCount })}
            </span>
            <span className="text-lg font-bold text-[#F9FAFB]">
              {formatPrice(course.price)}
            </span>
          </div>

          <Link
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
            to={`/courses/${course.slug}`}
          >
            {t('catalog.viewCourse')}
          </Link>
        </div>
      </div>
    </article>
  )
}
