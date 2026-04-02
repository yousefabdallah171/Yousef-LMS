import { useTranslation } from 'react-i18next'

import { CourseCard } from '../components/CourseCard'
import { ButtonLink } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { useCourses } from '../hooks/useCourses'

function FeaturedSkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl bg-surface-high">
      <div className="h-56 animate-pulse bg-surface-highest/50" />
      <div className="space-y-4 p-8">
        <div className="h-8 w-3/4 animate-pulse rounded bg-surface-highest/50" />
        <div className="h-16 animate-pulse rounded bg-surface-highest/40" />
        <div className="flex items-center justify-between border-t border-white/5 pt-6">
          <div className="h-8 w-20 animate-pulse rounded bg-surface-highest/50" />
          <div className="h-4 w-16 animate-pulse rounded bg-surface-highest/40" />
        </div>
      </div>
    </div>
  )
}

export function HomePage() {
  const { t } = useTranslation()
  const { data, isLoading, isError } = useCourses()
  const featuredCourses = (data?.courses ?? []).slice(0, 3)
  const journeySteps = [
    {
      icon: '\u2315',
      title: t('home.steps.browse.title'),
      description: t('home.steps.browse.description'),
      color: 'text-primary',
    },
    {
      icon: '\u00A4',
      title: t('home.steps.pay.title'),
      description: t('home.steps.pay.description'),
      color: 'text-secondary',
    },
    {
      icon: '\u25CC',
      title: t('home.steps.learn.title'),
      description: t('home.steps.learn.description'),
      color: 'text-white',
    },
  ]

  return (
    <main className="overflow-hidden pt-24">
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-8 py-20 lg:grid-cols-2">
        <div className="text-end">
          <h1 className="mb-8 text-6xl font-extrabold leading-tight tracking-tight md:text-7xl">
            {t('home.heroTitle')}
            <span className="mt-2 block text-primary">{t('home.heroHighlight')}</span>
          </h1>
          <p className="mb-12 max-w-2xl text-xl leading-relaxed text-muted lg:ms-auto">
            {t('home.heroDescription')}
          </p>
          <div className="flex flex-row-reverse flex-wrap gap-6">
            <ButtonLink className="px-10 py-4 text-lg" to="/courses">
              {t('home.browseCourses')}
            </ButtonLink>
            <ButtonLink
              className="border border-secondary/30 bg-secondary/10 px-10 py-4 text-lg text-secondary hover:bg-secondary/20"
              to="/courses"
              variant="ghost"
            >
              {t('home.watchFreeLessons')}
            </ButtonLink>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -start-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute -bottom-20 -end-20 h-80 w-80 rounded-full bg-secondary/10 blur-[100px]" />
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-surface-high/40 p-4 backdrop-blur-xl">
            <img
              alt={t('home.heroImageAlt')}
              className="h-auto w-full rounded-2xl object-cover grayscale-[0.5] transition-all duration-700 hover:grayscale-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYKOzRdhQ6dZUu639F7M8vlimt13Jfx96QQrshb-G7vwWzTxLuu__LL2WFFUMBd_lgPS-zk5NAa56SLWXj5Zv0M9OfJkO0qP1mJ4ks6m7rR_gnCUCXs04p6fWgS_CskMqSDDmSw7RbnYIu7b0i1akwJReq-cNR_k_vJ_kjRdyHAv949VtVs1TyJMKDh46VecSXVyYkIrwUWIOlNYzxgGgT_YgoCdOX2zQcfQ52CKVQWhQwwGeXbhwrAdJRaPgmesoUv3wvA3Kz42De"
            />
          </div>
        </div>
      </section>

      <section className="bg-surface-low py-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-12 px-8 md:justify-between">
          {[
            {
              value: t('home.stats.studentsValue'),
              label: t('home.stats.studentsLabel'),
              color: 'text-primary',
            },
            {
              value: t('home.stats.coursesValue'),
              label: t('home.stats.coursesLabel'),
              color: 'text-secondary',
            },
            {
              value: t('home.stats.ratingValue'),
              label: t('home.stats.ratingLabel'),
              color: 'text-white',
            },
          ].map((stat) => (
            <div className="text-center md:text-end" key={stat.label}>
              <div className={`text-4xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="mt-1 text-sm tracking-widest text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 py-32">
        <div className="mb-16 flex items-end justify-between">
          <ButtonLink className="gap-2 text-primary" to="/courses" variant="ghost">
            <span>{t('home.viewAllCourses')}</span>
            <span aria-hidden="true">{'\u2190'}</span>
          </ButtonLink>
          <h2 className="text-4xl font-bold">{t('home.featuredTitle')}</h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <FeaturedSkeletonCard key={index} />
            ))}
          </div>
        ) : null}

        {!isLoading && isError ? (
          <EmptyState
            action={
              <ButtonLink to="/courses" variant="secondary">
                {t('common.retry')}
              </ButtonLink>
            }
            description={t('catalog.loadErrorDescription')}
            title={t('common.error')}
          />
        ) : null}

        {!isLoading && !isError && featuredCourses.length === 0 ? (
          <EmptyState
            action={<ButtonLink to="/courses">{t('catalog.startLearning')}</ButtonLink>}
            description={t('catalog.noCoursesDescription')}
            title={t('common.emptyState')}
          />
        ) : null}

        {!isLoading && !isError && featuredCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard course={course} key={course.id} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="bg-surface-low py-32">
        <div className="mx-auto max-w-7xl px-8">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-bold">{t('home.journeyTitle')}</h2>
            <p className="text-muted">{t('home.journeySubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {journeySteps.map((step) => (
              <div className="group text-center" key={step.title}>
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-white/5 bg-surface-highest text-4xl transition-colors group-hover:border-primary/40">
                  <span className={step.color}>{step.icon}</span>
                </div>
                <h3 className="mb-4 text-2xl font-bold">{step.title}</h3>
                <p className="text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 py-32">
        <div className="grid grid-cols-1 items-center gap-16 rounded-[3rem] bg-surface-highest p-12 lg:grid-cols-2 lg:p-20">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            <img
              alt={t('home.instructor.imageAlt')}
              className="relative z-10 h-[500px] w-full rounded-3xl object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuATw39MfcCtsiH3KZSS84CLyb_cZ_VIFEhapXfqdYzKiIpuAmjRp_WJjtb7Y6XSrcs9ArHa3V1gUgt8cvjQBHqRXmXxqz2ibO8diElLEux28NQCcMQpzKLGj071dyROSxBP72_Pxk7Ac5tkYbWV4tpbID38zEMAUnFFU6wqIzfAcnh-Ue89q_0i-l8l6ro-t3OdakiVSlzIejsSL5UoJyqla1NA7loFw8X_1XAczs36x5yKlnIN5jglu_UUzZKENYQDn00ROhVAFR8y"
            />
          </div>
          <div className="order-1 text-end lg:order-2">
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-primary">
              {t('home.instructor.eyebrow')}
            </h4>
            <h2 className="mb-8 text-5xl font-black">{t('home.instructor.name')}</h2>
            <p className="mb-10 text-xl leading-relaxed text-muted">
              {t('home.instructor.bio')}
            </p>
            <div className="mb-10 flex flex-row-reverse flex-wrap gap-4">
              {['fullstack', 'ai', 'data'].map((tag) => (
                <span
                  className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium"
                  key={tag}
                >
                  {t(`home.instructor.tags.${tag}`)}
                </span>
              ))}
            </div>
            <div className="flex flex-row-reverse gap-8">
              <div className="text-end">
                <div className="text-3xl font-bold text-white">
                  {t('home.instructor.trainingHoursValue')}
                </div>
                <div className="text-xs text-muted">
                  {t('home.instructor.trainingHoursLabel')}
                </div>
              </div>
              <div className="h-10 w-px self-center bg-white/10" />
              <div className="text-end">
                <div className="text-3xl font-bold text-white">
                  {t('home.instructor.consultingHoursValue')}
                </div>
                <div className="text-xs text-muted">
                  {t('home.instructor.consultingHoursLabel')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-8 py-32">
        <h2 className="mb-16 text-center text-4xl font-bold">
          {t('home.testimonials.title')}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(['sara', 'omar', 'ahmed'] as const).map((key) => (
            <div
              className="relative rounded-3xl border border-white/5 bg-surface-low p-10"
              key={key}
            >
              <span className="absolute start-6 top-6 text-6xl text-primary/20">"</span>
              <p className="relative z-10 mb-8 text-end leading-relaxed text-foreground">
                {t(`home.testimonials.items.${key}.quote`)}
              </p>
              <div className="flex flex-row-reverse items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-highest text-sm font-bold text-primary">
                  {t(`home.testimonials.items.${key}.initials`)}
                </div>
                <div className="text-end">
                  <div className="font-bold">
                    {t(`home.testimonials.items.${key}.name`)}
                  </div>
                  <div className="text-xs text-muted">
                    {t(`home.testimonials.items.${key}.role`)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
