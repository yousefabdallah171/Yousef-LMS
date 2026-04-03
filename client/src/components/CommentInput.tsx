import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from './ui/Button'

type CommentInputProps = {
  disabled?: boolean
  isSubmitting?: boolean
  onSubmit: (content: string) => Promise<void> | void
}

export function CommentInput({
  disabled = false,
  isSubmitting = false,
  onSubmit,
}: CommentInputProps) {
  const { t } = useTranslation()
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!submitted || isSubmitting) {
      return
    }

    setContent('')
    setSubmitted(false)
    setError(null)
    setSuccess(t('comments.commentPosted'))
  }, [isSubmitting, submitted, t])

  async function handleSubmit() {
    const nextContent = content.trim()

    if (!nextContent) {
      setError(t('comments.emptyComment'))
      setSuccess(null)
      return
    }

    setError(null)
    setSuccess(null)
    setSubmitted(true)

    try {
      await onSubmit(nextContent)
    } catch (submitError) {
      const responseMessage =
        (
          submitError as {
            response?: { data?: { message?: string } }
          }
        ).response?.data?.message ?? null

      setSubmitted(false)
      setError(responseMessage || t('comments.postFailed'))
      setSuccess(null)
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-surface-low p-5">
      <label className="block text-right text-sm font-semibold text-foreground" htmlFor="comment-input">
        {t('comments.addComment')}
      </label>
      <textarea
        className="mt-3 min-h-32 w-full rounded-[1.25rem] border border-white/10 bg-surface-high px-4 py-3 text-right text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary/40 focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
        dir="auto"
        disabled={disabled || isSubmitting}
        id="comment-input"
        onChange={(event) => setContent(event.target.value)}
        placeholder={t('comments.placeholder')}
        value={content}
      />
      {error ? (
        <p className="mt-3 text-right text-sm text-danger">{error}</p>
      ) : null}
      {success ? (
        <p className="mt-3 text-right text-sm text-success">{success}</p>
      ) : null}
      <div className="mt-4 flex justify-start">
        <Button
          className="min-w-28"
          disabled={disabled || isSubmitting || !content.trim()}
          onClick={() => void handleSubmit()}
          type="button"
        >
          {isSubmitting ? t('comments.posting') : t('comments.postButton')}
        </Button>
      </div>
    </div>
  )
}
