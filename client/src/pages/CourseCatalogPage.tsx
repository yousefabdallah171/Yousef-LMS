import { useDeferredValue, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { CourseCard } from '../components/CourseCard'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { useCourses } from '../hooks/useCourses'

type SortOption = 'latest' | 'priceAsc' | 'title'

function CatalogSkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#1F2937] bg-[#111827]">
      <div className="aspect-video animate-pulse bg-surface-highest/50" />
      <div className="space-y-4 p-6">
        <div className="h-5 w-24 animate-pulse rounded bg-surface-highest/40" />
        <div className="h-7 w-3/4 animate-pulse rounded bg-surface-highest/50" />
        <div className="h-16 animate-pulse rounded bg-surface-highest/40" />
        <div className="flex items-center justify-between border-t border-[#1F2937] pt-6">
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-surface-highest/40" />
            <div className="h-6 w-24 animate-pulse rounded bg-surface-highest/50" />
          </div>
          <div className="h-10 w-28 animate-pulse rounded-lg bg-surface-highest/50" />
        </div>
      </div>
    </div>
  )
}

export function CourseCatalogPage() {
  const { t } = useTranslation()
  const searchId = useId()
  const { data, isLoading, isError, refetch } = useCourses()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('latest')
  const deferredSearch = useDeferredValue(search.trim().toLowerCase())
  const courses = data?.courses ?? []

  const filteredCourses = courses
    .filter((course) => {
      if (!deferredSearch) {
        return true
      }

      return (
        course.title.toLowerCase().includes(deferredSearch) ||
        course.description.toLowerCase().includes(deferredSearch)
      )
    })
    .sort((left, right) => {
      switch (sort) {
        case 'priceAsc':
          return left.price - right.price
        case 'title':
          return left.title.localeCompare(right.title, 'ar')
        default:
          return (
            new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
          )
      }
    })

  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-32 md:px-8">
      <header className="mb-12">
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-[#F9FAFB] md:text-6xl">
          {t('catalog.browseCourses')}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[#94A3B8] md:text-xl">
          {t('catalog.catalogDescription')}
        </p>
      </header>

      <section className="mb-12 space-y-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="relative w-full md:w-96">
            <label className="sr-only" htmlFor={searchId}>
              {t('catalog.searchLabel')}
            </label>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              {t('catalog.searchIcon')}
            </span>
            <input
              id={searchId}
              className="w-full rounded-xl border border-transparent bg-surface-high px-4 py-3 pr-12 text-foreground outline-none transition-all placeholder:text-slate-500 focus:border-secondary/40 focus:bg-surface-highest"
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('catalog.searchPlaceholder')}
              type="search"
              value={search}
            />
          </div>

          <div className="flex w-full items-center justify-between gap-4 md:w-auto">
            <span className="text-sm text-slate-400">
              {t('catalog.foundCourses', { count: filteredCourses.length })}
            </span>

            <div className="relative min-w-48">
              <select
                className="w-full cursor-pointer appearance-none rounded-xl border border-transparent bg-surface-high px-4 py-3 pl-10 text-foreground outline-none transition-all focus:border-secondary/40 focus:bg-surface-highest"
                onChange={(event) => setSort(event.target.value as SortOption)}
                value={sort}
              >
                <option value="latest">{t('catalog.sort.latest')}</option>
                <option value="title">{t('catalog.sort.title')}</option>
                <option value="priceAsc">{t('catalog.sort.priceAsc')}</option>
              </select>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                ▾
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white">
            {t('catalog.filters.all')}
          </span>
          <span className="rounded-full border border-transparent bg-surface-high px-5 py-2 text-sm font-medium text-slate-300 transition-all hover:border-secondary/30 hover:bg-surface-highest">
            Python
          </span>
          <span className="rounded-full border border-transparent bg-surface-high px-5 py-2 text-sm font-medium text-slate-300 transition-all hover:border-secondary/30 hover:bg-surface-highest">
            {t('catalog.filters.ai')}
          </span>
          <span className="rounded-full border border-transparent bg-surface-high px-5 py-2 text-sm font-medium text-slate-300 transition-all hover:border-secondary/30 hover:bg-surface-highest">
            {t('catalog.filters.web')}
          </span>
          <span className="rounded-full border border-transparent bg-surface-high px-5 py-2 text-sm font-medium text-slate-300 transition-all hover:border-secondary/30 hover:bg-surface-highest">
            {t('catalog.filters.data')}
          </span>
        </div>
      </section>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <CatalogSkeletonCard key={index} />
          ))}
        </div>
      ) : null}

      {!isLoading && isError ? (
        <EmptyState
          action={
            <Button onClick={() => void refetch()} type="button">
              {t('common.retry')}
            </Button>
          }
          description={t('catalog.loadErrorDescription')}
          title={t('common.error')}
        />
      ) : null}

      {!isLoading && !isError && filteredCourses.length === 0 ? (
        <EmptyState
          description={t('catalog.noCoursesDescription')}
          title={t('catalog.noCourses')}
        />
      ) : null}

      {!isLoading && !isError && filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard course={course} key={course.id} />
          ))}
        </div>
      ) : null}
    </main>
  )
}
