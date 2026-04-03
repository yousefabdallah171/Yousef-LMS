import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useCourses } from '../hooks/useCourses'
import { useMyOrders } from '../hooks/useOrders'
import { formatPrice } from '../utils/formatPrice'

export function PaymentInstructionsPage() {
  const { t } = useTranslation()
  const { courseId } = useParams()
  const { data: coursesData, isLoading: isCoursesLoading, isError: isCoursesError, refetch: refetchCourses } = useCourses()
  const { data: ordersData, isLoading: isOrdersLoading, isError: isOrdersError, refetch: refetchOrders } = useMyOrders()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const course = useMemo(
    () => coursesData?.courses.find((entry) => entry.id === courseId),
    [courseId, coursesData?.courses],
  )

  const relatedOrders = useMemo(
    () => ordersData?.orders.filter((order) => order.courseId === courseId) ?? [],
    [courseId, ordersData?.orders],
  )

  const pendingOrder = relatedOrders.find((order) => order.status === 'pending_review')
  const approvedOrder = relatedOrders.find((order) => order.status === 'approved')

  async function copyValue(key: string, value: string) {
    await navigator.clipboard.writeText(value)
    setCopiedKey(key)
    window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 2000)
  }

  if (isCoursesLoading || isOrdersLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-32 md:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="h-14 w-64 animate-pulse rounded-3xl bg-surface-high" />
            <div className="h-72 animate-pulse rounded-[2rem] bg-surface-high" />
            <div className="h-24 animate-pulse rounded-[2rem] bg-surface-high" />
          </div>
          <div className="h-[28rem] animate-pulse rounded-[2rem] bg-surface-high lg:col-span-4" />
        </div>
      </main>
    )
  }

  if (isCoursesError || isOrdersError) {
    return (
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-32 md:px-8">
        <EmptyState
          action={
            <button
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
              onClick={() => {
                void refetchCourses()
                void refetchOrders()
              }}
              type="button"
            >
              {t('common.retry')}
            </button>
          }
          description={t('payment.loadError')}
          title={t('common.error')}
        />
      </main>
    )
  }

  if (!course) {
    return (
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-32 md:px-8">
        <EmptyState
          description={t('payment.courseNotFoundDescription')}
          title={t('payment.courseNotFoundTitle')}
        />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-32 md:px-8">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="order-2 space-y-10 lg:order-1 lg:col-span-8">
          <header className="space-y-4 text-end">
            <h1 className="text-5xl font-black leading-tight tracking-tight text-foreground">
              {t('payment.paymentInstructions')}
            </h1>
            <p className="max-w-2xl text-xl leading-relaxed text-muted">
              {t('payment.instructionsDescription')}
            </p>
          </header>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              'transferStep',
              'receiptStep',
              'uploadStep',
              'activationStep',
            ].map((stepKey, index) => (
              <div
                className={[
                  'rounded-xl border-r-4 p-6 transition-all duration-300',
                  index === 0
                    ? 'border-primary bg-surface-high'
                    : 'border-ghost bg-surface-low hover:bg-surface-high',
                ].join(' ')}
                key={stepKey}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={[
                      'flex size-10 items-center justify-center rounded-full text-lg font-bold',
                      index === 0
                        ? 'bg-primary text-white'
                        : 'bg-surface-highest text-muted',
                    ].join(' ')}
                  >
                    {index + 1}
                  </span>
                  <div className="space-y-1 text-end">
                    <h3 className="text-xl font-bold text-foreground">
                      {t(`payment.steps.${stepKey}.title`)}
                    </h3>
                    <p className="text-sm text-muted">
                      {t(`payment.steps.${stepKey}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <section className="relative overflow-hidden rounded-[2rem] border border-ghost bg-surface-highest p-8">
            <div className="absolute -left-6 -top-6 size-32 rounded-full bg-secondary/10 blur-[60px]" />
            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-secondary">•</span>
                <h2 className="text-2xl font-bold text-foreground">
                  {t('payment.secureTransferTitle')}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[
                  {
                    label: t('payment.bankDetails'),
                    value: t('payment.bankValue'),
                    key: 'bank',
                  },
                  {
                    label: t('payment.mobileWalletDetails'),
                    value: t('payment.walletValue'),
                    key: 'wallet',
                  },
                ].map((item) => (
                  <div className="space-y-2" key={item.key}>
                    <label className="text-sm font-medium text-muted">{item.label}</label>
                    <div className="flex items-center justify-between rounded-lg border border-ghost bg-surface px-4 py-4">
                      <button
                        className="rounded-lg px-3 py-1 text-sm font-bold text-primary transition hover:bg-primary/10"
                        onClick={() => void copyValue(item.key, item.value)}
                        type="button"
                      >
                        {copiedKey === item.key ? t('payment.copied') : t('payment.copy')}
                      </button>
                      <span className="text-end text-lg font-bold text-foreground">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {pendingOrder ? (
            <div className="rounded-xl border border-warning/30 bg-warning/10 p-5 text-end">
              <div className="flex items-center justify-between gap-3">
                <StatusBadge label={t('payment.pendingReview')} tone="warning" />
                <p className="font-semibold text-foreground">{t('payment.pendingOrderExists')}</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">
                {t('payment.pendingOrderDescription')}
              </p>
            </div>
          ) : null}

          {approvedOrder ? (
            <div className="rounded-xl border border-success/30 bg-success/10 p-5 text-end">
              <div className="flex items-center justify-between gap-3">
                <StatusBadge label={t('payment.approvedStatus')} tone="success" />
                <p className="font-semibold text-foreground">{t('payment.alreadyEnrolled')}</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">
                {t('payment.alreadyEnrolledDescription')}
              </p>
            </div>
          ) : null}

          <div className="flex flex-col items-center gap-6 pt-4 sm:flex-row">
            {pendingOrder || approvedOrder ? (
              <Link
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-10 py-4 text-lg font-bold text-white shadow-ambient sm:w-auto"
                to="/dashboard"
              >
                {t('nav.dashboard')}
              </Link>
            ) : (
              <Link
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-10 py-4 text-lg font-bold text-white shadow-ambient sm:w-auto"
                to={`/payment/${course.id}/proof`}
              >
                {t('payment.uploadProof')}
              </Link>
            )}
            <Link className="font-medium text-muted underline underline-offset-8 transition hover:text-foreground" to={`/courses/${course.slug}`}>
              {t('payment.backToCourse')}
            </Link>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-warning/30 bg-warning/10 p-5">
            <span className="text-warning">!</span>
            <p className="text-sm leading-relaxed text-foreground">{t('payment.manualReviewNotice')}</p>
          </div>
        </div>

        <aside className="order-1 lg:order-2 lg:col-span-4 lg:sticky lg:top-32">
          <div className="overflow-hidden rounded-[2rem] border border-ghost bg-surface-high shadow-2xl">
            <div className="relative h-48">
              <img alt={course.title} className="h-full w-full object-cover" src={course.thumbnailUrl} />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-high to-transparent" />
            </div>
            <div className="space-y-6 p-8 text-end">
              <div className="space-y-2">
                <StatusBadge label={t('payment.awaitingProof')} tone="info" />
                <h2 className="text-3xl font-black leading-tight text-foreground">{course.title}</h2>
                <div className="flex items-end justify-end gap-2 pt-2">
                  <span className="text-4xl font-black text-foreground">{formatPrice(course.price)}</span>
                </div>
              </div>

              <div className="h-px w-full bg-ghost" />

              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted">
                  {t('payment.subscriptionFeatures')}
                </h4>
                <ul className="space-y-4 text-sm text-foreground">
                  <li>{t('payment.features.lifetime')}</li>
                  <li>{t('payment.features.certificate')}</li>
                  <li>{t('payment.features.resources')}</li>
                </ul>
              </div>

              <div className="rounded-xl bg-surface px-4 py-4 text-center text-sm text-muted">
                {t('payment.securedTransferBadge')}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
