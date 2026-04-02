import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { StatusBadge } from '../components/ui/StatusBadge'
import {
  getAdminOrderErrorMessage,
  useAdminOrderDetail,
  useApproveOrder,
  useRejectOrder,
} from '../hooks/useAdminOrders'

function formatAdminDate(date: string | null) {
  if (!date) {
    return '-'
  }

  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function isImageProof(url: string) {
  return /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url)
}

export function AdminOrderDetailPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const { data, isLoading, isError, refetch, error } = useAdminOrderDetail(id)
  const approveOrder = useApproveOrder()
  const rejectOrder = useRejectOrder()
  const [reason, setReason] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const [feedbackKey, setFeedbackKey] = useState<string | null>(null)
  const [feedbackFallback, setFeedbackFallback] = useState<string | null>(null)

  const order = data?.order
  const proofIsImage = useMemo(() => (order ? isImageProof(order.proofUrl) : false), [order])

  if (isLoading) {
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <div className="h-48 animate-pulse rounded-[2rem] bg-surface-high" />
          <div className="h-96 animate-pulse rounded-[2rem] bg-surface-high" />
        </div>
        <div className="h-[32rem] animate-pulse rounded-[2rem] bg-surface-high" />
      </div>
    )
  }

  if (isError || !order) {
    const status = (error as { response?: { status?: number } } | undefined)?.response?.status

    return (
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
        description={
          status === 404 ? t('admin.orders.notFoundDescription') : t('admin.orders.loadError')
        }
        title={status === 404 ? t('admin.orders.notFoundTitle') : t('common.error')}
      />
    )
  }

  const currentOrder = order

  async function handleApprove() {
    if (!window.confirm(t('admin.orders.approveConfirm'))) {
      return
    }

    try {
      await approveOrder.mutateAsync(currentOrder.id)
      setFeedbackKey('approveSuccess')
      setFeedbackFallback(null)
    } catch (mutationError) {
      const message = getAdminOrderErrorMessage(mutationError, t('common.error'))

      if (message === 'alreadyApproved') {
        setFeedbackKey('alreadyApproved')
        setFeedbackFallback(null)
        return
      }

      setFeedbackKey(null)
      setFeedbackFallback(message)
    }
  }

  async function handleReject() {
    if (!window.confirm(t('admin.orders.rejectConfirm'))) {
      return
    }

    try {
      await rejectOrder.mutateAsync({
        orderId: currentOrder.id,
        reason: reason.trim() || undefined,
      })
      setFeedbackKey('rejectSuccess')
      setFeedbackFallback(null)
    } catch (mutationError) {
      const message = getAdminOrderErrorMessage(mutationError, t('common.error'))

      if (message === 'alreadyApproved') {
        setFeedbackKey('alreadyApproved')
        setFeedbackFallback(null)
        return
      }

      setFeedbackKey(null)
      setFeedbackFallback(message)
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-2 text-sm text-muted">
        <Link className="hover:text-primary" to="/admin/orders">
          {t('admin.orders.title')}
        </Link>
        <span>/</span>
        <span>{t('admin.orders.orderDetail')}</span>
      </div>

      {feedbackKey || feedbackFallback ? (
        <div className="mb-6 rounded-2xl border border-ghost bg-surface-high p-4 text-sm text-foreground shadow-ambient">
          {feedbackKey ? t(`admin.orders.${feedbackKey}`) : feedbackFallback}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-ghost bg-surface-high p-8 shadow-ambient">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <StatusBadge
                  label={t(`admin.orders.statuses.${currentOrder.status}`)}
                  tone={
                    currentOrder.status === 'approved'
                      ? 'success'
                      : currentOrder.status === 'rejected'
                        ? 'danger'
                        : 'warning'
                  }
                />
                <h1 className="text-3xl font-black text-foreground">
                  {t('admin.orders.orderDetail')}
                </h1>
                <p className="text-sm text-muted">{currentOrder.courseName}</p>
              </div>
              <button
                className="rounded-xl border border-ghost px-4 py-2 text-sm font-semibold text-foreground"
                onClick={() => navigate('/admin/orders')}
                type="button"
              >
                {t('admin.orders.backToList')}
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-surface-low p-5">
                <p className="text-xs font-semibold text-muted">
                  {t('admin.orders.studentColumn')}
                </p>
                <h2 className="mt-2 text-xl font-bold text-foreground">
                  {currentOrder.studentName}
                </h2>
                <p className="mt-1 text-sm text-muted">{currentOrder.studentEmail}</p>
              </div>
              <div className="rounded-2xl bg-surface-low p-5">
                <p className="text-xs font-semibold text-muted">
                  {t('admin.orders.submittedAt')}
                </p>
                <h2 className="mt-2 text-xl font-bold text-foreground">
                  {formatAdminDate(currentOrder.createdAt)}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {t('admin.orders.reviewedAt')}: {formatAdminDate(currentOrder.reviewedAt)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-ghost bg-surface-high p-8 shadow-ambient">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-foreground">
                {t('admin.orders.viewProof')}
              </h2>
              <a
                className="rounded-xl border border-ghost px-4 py-2 text-sm font-semibold text-foreground"
                href={currentOrder.proofUrl}
                rel="noreferrer"
                target="_blank"
              >
                {t('admin.orders.openProof')}
              </a>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-ghost bg-surface-low">
              {proofIsImage ? (
                <button
                  className="block w-full"
                  onClick={() => setShowImageModal(true)}
                  type="button"
                >
                  <img
                    alt={t('admin.orders.proofAlt', { student: currentOrder.studentName })}
                    className="aspect-[16/10] w-full object-cover"
                    src={currentOrder.proofUrl}
                  />
                </button>
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center p-8 text-center">
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      {t('admin.orders.proofDocument')}
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      {t('admin.orders.proofDocumentDescription')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-ghost bg-surface-high p-6 shadow-ambient">
            <h2 className="text-sm font-bold tracking-[0.2em] text-muted">
              {t('admin.orders.reviewPanel')}
            </h2>
            <label
              className="mt-5 block text-sm font-semibold text-foreground"
              htmlFor="reject-reason"
            >
              {t('admin.orders.rejectReason')}
            </label>
            <textarea
              className="mt-3 min-h-32 w-full rounded-2xl border border-ghost bg-surface-low p-4 text-sm text-foreground outline-none transition focus:border-primary"
              id="reject-reason"
              onChange={(event) => setReason(event.target.value)}
              placeholder={t('admin.orders.rejectReasonPlaceholder')}
              value={reason}
            />
            <div className="mt-5 grid gap-3">
              <Button
                className="w-full py-3"
                disabled={
                  approveOrder.isPending ||
                  rejectOrder.isPending ||
                  currentOrder.status !== 'pending_review'
                }
                onClick={() => void handleApprove()}
                type="button"
              >
                {t('admin.orders.approve')}
              </Button>
              <Button
                className="w-full py-3"
                disabled={
                  approveOrder.isPending ||
                  rejectOrder.isPending ||
                  currentOrder.status !== 'pending_review'
                }
                onClick={() => void handleReject()}
                type="button"
                variant="secondary"
              >
                {t('admin.orders.reject')}
              </Button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-ghost bg-surface-high p-6 shadow-ambient">
            <h2 className="text-sm font-bold tracking-[0.2em] text-muted">
              {t('admin.orders.timelineTitle')}
            </h2>
            <div className="mt-5 space-y-5 text-sm">
              <div className="rounded-2xl bg-surface-low p-4">
                <p className="font-semibold text-foreground">
                  {t('admin.orders.statuses.pending_review')}
                </p>
                <p className="mt-1 text-muted">{formatAdminDate(currentOrder.createdAt)}</p>
              </div>
              {currentOrder.reviewedAt ? (
                <div className="rounded-2xl bg-surface-low p-4">
                  <p className="font-semibold text-foreground">
                    {t(`admin.orders.statuses.${currentOrder.status}`)}
                  </p>
                  <p className="mt-1 text-muted">
                    {formatAdminDate(currentOrder.reviewedAt)}
                  </p>
                </div>
              ) : null}
              {currentOrder.rejectionReason ? (
                <div className="rounded-2xl bg-surface-low p-4">
                  <p className="font-semibold text-foreground">
                    {t('admin.orders.rejectReason')}
                  </p>
                  <p className="mt-1 text-muted">{currentOrder.rejectionReason}</p>
                </div>
              ) : null}
            </div>
          </section>
        </aside>
      </div>

      {showImageModal && proofIsImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6"
          onClick={() => setShowImageModal(false)}
          role="presentation"
        >
          <div className="max-h-full max-w-5xl overflow-hidden rounded-[2rem] border border-ghost bg-surface-high p-4">
            <img
              alt={t('admin.orders.proofAlt', { student: currentOrder.studentName })}
              className="max-h-[80vh] w-full object-contain"
              src={currentOrder.proofUrl}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
