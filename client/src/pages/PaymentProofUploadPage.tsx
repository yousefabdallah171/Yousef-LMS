import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useCourses } from '../hooks/useCourses'
import { useCreateOrder, useMyOrders } from '../hooks/useOrders'
import { formatPrice } from '../utils/formatPrice'

function formatBytes(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function PaymentProofUploadPage() {
  const { t } = useTranslation()
  const { courseId } = useParams()
  const { data: coursesData, isLoading: isCoursesLoading, isError: isCoursesError, refetch: refetchCourses } = useCourses()
  const { data: ordersData, isLoading: isOrdersLoading, isError: isOrdersError, refetch: refetchOrders } = useMyOrders()
  const createOrder = useCreateOrder()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)

  const course = useMemo(
    () => coursesData?.courses.find((entry) => entry.id === courseId),
    [courseId, coursesData?.courses],
  )

  const pendingOrder = useMemo(
    () =>
      ordersData?.orders.find(
        (order) => order.courseId === courseId && order.status === 'pending_review',
      ) ?? null,
    [courseId, ordersData?.orders],
  )

  useEffect(() => {
    if (!selectedFile || !selectedFile.type.startsWith('image/')) {
      setPreviewUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [selectedFile])

  if (isCoursesLoading || isOrdersLoading) {
    return (
      <main className="mx-auto max-w-[760px] px-4 pb-20 pt-32">
        <div className="space-y-8">
          <div className="h-20 animate-pulse rounded-[2rem] bg-surface-high" />
          <div className="h-24 animate-pulse rounded-[2rem] bg-surface-high" />
          <div className="h-[32rem] animate-pulse rounded-[2rem] bg-surface-high" />
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitError(null)

    if (!course) {
      setSubmitError(t('payment.courseNotFoundDescription'))
      return
    }

    if (!selectedFile) {
      setSubmitError(t('payment.proofRequired'))
      return
    }

    try {
      const response = await createOrder.mutateAsync({
        courseId: course.id,
        proofFile: selectedFile,
        onProgress: setUploadProgress,
      })

      setCreatedOrderId(response.order.id)
      setUploadProgress(100)
      void refetchOrders()
    } catch (error) {
      const payload = (error as { response?: { data?: { code?: string; message?: string } } } | undefined)?.response?.data

      if (payload?.code === 'ORDER_ALREADY_EXISTS') {
        setSubmitError(t('payment.pendingOrderExists'))
      } else if (payload?.code === 'ALREADY_ENROLLED') {
        setSubmitError(t('payment.alreadyEnrolled'))
      } else if (payload?.code === 'INVALID_FILE_TYPE') {
        setSubmitError(t('payment.invalidFileType'))
      } else if (payload?.code === 'FILE_TOO_LARGE') {
        setSubmitError(t('payment.fileTooLarge'))
      } else {
        setSubmitError(payload?.message || t('common.error'))
      }
    }
  }

  if (createdOrderId) {
    return (
      <main className="mx-auto max-w-[760px] px-4 pb-20 pt-32">
        <div className="rounded-[2rem] border border-success/20 bg-surface-high p-10 text-end shadow-ambient">
          <StatusBadge label={t('payment.pendingReview')} tone="warning" />
          <h1 className="mt-4 text-3xl font-black text-foreground">{t('payment.orderSubmitted')}</h1>
          <p className="mt-3 text-sm leading-7 text-muted">{t('payment.orderSubmittedDescription')}</p>
          <div className="mt-8 flex flex-col items-center justify-end gap-4 sm:flex-row">
            <Link className="inline-flex items-center justify-center rounded-lg border border-ghost px-6 py-3 text-sm font-semibold text-foreground" to={`/payment/${course.id}`}>
              {t('payment.backToInstructions')}
            </Link>
            <Link className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white" to="/dashboard">
              {t('nav.dashboard')}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (pendingOrder) {
    return (
      <main className="mx-auto max-w-[760px] px-4 pb-20 pt-32">
        <div className="rounded-[2rem] border border-warning/20 bg-surface-high p-10 text-end shadow-ambient">
          <StatusBadge label={t('payment.pendingReview')} tone="warning" />
          <h1 className="mt-4 text-3xl font-black text-foreground">{t('payment.pendingOrderExists')}</h1>
          <p className="mt-3 text-sm leading-7 text-muted">{t('payment.pendingOrderDescription')}</p>
          <div className="mt-8 flex flex-col items-center justify-end gap-4 sm:flex-row">
            <Link className="inline-flex items-center justify-center rounded-lg border border-ghost px-6 py-3 text-sm font-semibold text-foreground" to={`/payment/${course.id}`}>
              {t('payment.backToInstructions')}
            </Link>
            <Link className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white" to="/dashboard">
              {t('nav.dashboard')}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[760px] px-4 pb-20 pt-32">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="text-end">
            <h1 className="mb-2 text-3xl font-bold text-foreground">{t('payment.uploadProofTitle')}</h1>
            <div className="flex items-center gap-2 text-muted">
              <span className="text-sm">{t('payment.cartStep')}</span>
              <span className="text-xs">/</span>
              <span className="text-sm">{t('payment.paymentStep')}</span>
              <span className="text-xs">/</span>
              <span className="text-sm font-semibold text-primary">{t('payment.uploadStepTitle')}</span>
            </div>
          </div>
          <Link className="group flex items-center gap-2 rounded-lg px-4 py-2 text-muted transition hover:text-foreground" to={`/payment/${course.id}`}>
            <span className="font-medium">{t('payment.backToInstructions')}</span>
          </Link>
        </div>

        <div className="flex items-center gap-6 rounded-xl bg-surface-low p-4">
          <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg">
            <img alt={course.title} className="h-full w-full object-cover" src={course.thumbnailUrl} />
          </div>
          <div className="flex-grow text-end">
            <h3 className="text-lg font-bold text-foreground">{course.title}</h3>
            <p className="mt-1 text-xl font-semibold text-secondary">{formatPrice(course.price)}</p>
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-2">
            <span className="text-sm font-bold text-primary">{t('payment.awaitingProof')}</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-surface-high shadow-2xl">
          <form className="space-y-8 p-8" onSubmit={(event) => void handleSubmit(event)}>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-foreground">{t('payment.uploadProof')}</h2>
              <p className="text-muted">{t('payment.uploadProofDescription')}</p>
            </div>

            <label className="relative block cursor-pointer">
              <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border-2 border-dashed border-ghost bg-surface px-6 py-12 transition hover:border-primary">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-4xl">↑</span>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">{t('payment.dragAndDrop')}</p>
                  <p className="mt-1 text-sm text-muted">{t('payment.uploadFormats')}</p>
                </div>
              </div>
              <input
                accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                className="absolute inset-0 opacity-0"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                type="file"
              />
            </label>

            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-ghost bg-surface-low p-4">
                  <button
                    className="flex size-8 items-center justify-center rounded-full text-muted transition hover:bg-danger/10 hover:text-danger"
                    onClick={() => {
                      setSelectedFile(null)
                      setUploadProgress(0)
                      setSubmitError(null)
                    }}
                    type="button"
                  >
                    ×
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="text-end">
                      <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-xs text-muted">{formatBytes(selectedFile.size)}</p>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded bg-surface text-primary">
                      {previewUrl ? (
                        <img alt={selectedFile.name} className="h-full w-full rounded object-cover" src={previewUrl} />
                      ) : (
                        <span>PDF</span>
                      )}
                    </div>
                  </div>
                </div>

                {createOrder.isPending ? (
                  <div className="space-y-2">
                    <div className="flex justify-between px-1 text-xs font-medium">
                      <span className="text-secondary">{t('payment.progressLabel', { progress: uploadProgress })}</span>
                      <span className="text-muted">{t('payment.submitting')}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-secondary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/10 p-4">
              <span className="text-primary">i</span>
              <p className="text-sm leading-relaxed text-primary">{t('payment.reviewTimeNotice')}</p>
            </div>

            {submitError ? (
              <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                {submitError}
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-4 bg-surface px-8 py-6">
              <button
                className="rounded-lg border border-ghost px-6 py-4 font-medium text-muted transition hover:text-foreground"
                type="button"
                onClick={() => window.history.back()}
              >
                {t('payment.backToInstructions')}
              </button>
              <button
                className="flex items-center gap-2 rounded-lg bg-primary-container px-8 py-4 font-bold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={createOrder.isPending || !selectedFile}
                type="submit"
              >
                {t('payment.submitOrder')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
