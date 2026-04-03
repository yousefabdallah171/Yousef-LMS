import { useTranslation } from 'react-i18next'

import type { CommentItem as CommentRecord } from '../hooks/useComments'

function formatCommentDate(date: string) {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join(' ')
}

export function CommentItem({ comment }: { comment: CommentRecord }) {
  const { t } = useTranslation()

  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-surface-low p-5 text-end">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="font-bold text-foreground">{comment.authorName}</div>
          <div className="text-xs text-muted" title={t('comments.commentDate')}>
            {formatCommentDate(comment.createdAt)}
          </div>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-black text-primary">
          {getInitials(comment.authorName)}
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-foreground/90" dir="auto">
        {comment.content}
      </p>
    </article>
  )
}
