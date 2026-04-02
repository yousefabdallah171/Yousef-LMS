import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/formatPrice'
import { Button, ButtonLink } from './ui/Button'

type PurchaseRequiredModalProps = {
  open: boolean
  courseId: string
  courseSlug: string
  courseTitle: string
  price: number
  lockedLessonTitle?: string
  onClose: () => void
}

export function PurchaseRequiredModal({
  open,
  courseId,
  courseSlug,
  courseTitle,
  price,
  lockedLessonTitle,
  onClose,
}: PurchaseRequiredModalProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (open && !dialog.open) {
      dialog.showModal()
    }

    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-surface-high p-0 text-foreground shadow-2xl backdrop:bg-black/70"
      onCancel={onClose}
      onClose={onClose}
      ref={dialogRef}
    >
      <div className="relative overflow-hidden rounded-[2rem]">
        <div className="absolute inset-x-0 top-0 h-32 bg-primary/10 blur-3xl" />
        <div className="relative space-y-8 p-8 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 text-end">
              <p className="text-sm font-semibold text-primary">
                {t('lesson.purchaseRequired')}
              </p>
              <h2 className="text-3xl font-black text-balance">
                {t('catalog.purchaseModal.title')}
              </h2>
              <p className="text-sm leading-7 text-muted text-pretty">
                {lockedLessonTitle
                  ? t('catalog.purchaseModal.lessonMessage', {
                      lesson: lockedLessonTitle,
                    })
                  : t('catalog.purchaseModal.description')}
              </p>
            </div>
            <Button
              aria-label={t('catalog.purchaseModal.close')}
              className="size-11 rounded-full px-0"
              onClick={onClose}
              type="button"
              variant="ghost"
            >
              ×
            </Button>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-surface-low p-6">
            <div className="flex flex-col gap-4 text-end sm:flex-row-reverse sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-muted">
                  {t('catalog.purchaseModal.courseLabel')}
                </p>
                <p className="mt-2 text-xl font-bold text-balance">{courseTitle}</p>
              </div>
              <div className="text-end">
                <p className="text-xs font-semibold text-muted">
                  {t('catalog.priceLabel')}
                </p>
                <p className="mt-2 text-3xl font-black tabular-nums text-primary">
                  {formatPrice(price)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {user ? (
              <ButtonLink className="py-4 text-base" to={`/payment/${courseId}`}>
                {t('lesson.buyNow')}
              </ButtonLink>
            ) : (
              <>
                <ButtonLink className="py-4 text-base" to="/login">
                  {t('lesson.login')}
                </ButtonLink>
                <ButtonLink
                  className="py-4 text-base"
                  to="/register"
                  variant="secondary"
                >
                  {t('lesson.register')}
                </ButtonLink>
              </>
            )}
          </div>

          <div className="rounded-[1.5rem] border border-amber-400/20 bg-amber-500/10 p-5 text-end">
            <p className="text-sm leading-7 text-pretty text-foreground">
              {t('catalog.purchaseModal.paymentHelp')}
            </p>
          </div>

          <div className="flex justify-end">
            <ButtonLink to={`/courses/${courseSlug}`} variant="ghost">
              {t('catalog.purchaseModal.keepBrowsing')}
            </ButtonLink>
          </div>
        </div>
      </div>
    </dialog>
  )
}
