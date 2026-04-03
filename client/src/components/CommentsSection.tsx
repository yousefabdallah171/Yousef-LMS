import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useAuth } from '../context/AuthContext'
import { useComments, usePostComment } from '../hooks/useComments'
import { CommentInput } from './CommentInput'
import { CommentItem } from './CommentItem'
import { ButtonLink } from './ui/Button'
import { EmptyState } from './ui/EmptyState'

export function CommentsSection({
  lessonId,
  enrolled,
}: {
  lessonId: string
  enrolled: boolean
}) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const commentsQuery = useComments(lessonId)
  const postComment = usePostComment(lessonId)

  return (
    <section className="rounded-[2rem] border border-white/10 bg-surface-low p-8 text-end">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-surface-high px-4 py-2 text-sm tabular-nums text-muted">
          {commentsQuery.data?.comments.length ?? 0}
        </span>
        <div>
          <h2 className="text-2xl font-black">{t('catalog.commentsTitle')}</h2>
          <p className="mt-2 text-sm leading-7 text-muted">{t('comments.sectionSubtitle')}</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {enrolled ? (
          <CommentInput
            isSubmitting={postComment.isPending}
            onSubmit={async (content) => {
              await postComment.mutateAsync(content)
            }}
          />
        ) : (
          <div className="rounded-[1.5rem] border border-amber-400/20 bg-amber-500/10 p-5 text-sm leading-7 text-foreground">
            <p>{t('comments.enrollToComment')}</p>
            <div className="mt-4 flex flex-wrap justify-end gap-3">
              {user ? (
                <ButtonLink to="/dashboard" variant="secondary">
                  {t('nav.dashboard')}
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink to="/login" variant="secondary">
                    {t('lesson.login')}
                  </ButtonLink>
                  <ButtonLink to="/register">{t('lesson.register')}</ButtonLink>
                </>
              )}
            </div>
          </div>
        )}

        {commentsQuery.isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div className="h-28 animate-pulse rounded-[1.5rem] bg-surface-high" key={index} />
            ))}
          </div>
        ) : null}

        {!commentsQuery.isLoading && commentsQuery.isError ? (
          <EmptyState
            action={
              <button
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                onClick={() => void commentsQuery.refetch()}
                type="button"
              >
                {t('common.retry')}
              </button>
            }
            description={t('comments.loadError')}
            title={t('common.error')}
          />
        ) : null}

        {!commentsQuery.isLoading &&
        !commentsQuery.isError &&
        !commentsQuery.data?.comments.length ? (
          <EmptyState
            action={
              !enrolled && !user ? (
                <Link className="text-sm font-semibold text-primary" to="/login">
                  {t('lesson.login')}
                </Link>
              ) : undefined
            }
            description={t('comments.firstComment')}
            title={t('comments.noComments')}
          />
        ) : null}

        {!commentsQuery.isLoading && !commentsQuery.isError && commentsQuery.data?.comments.length ? (
          <div className="space-y-4">
            {commentsQuery.data.comments.map((comment) => (
              <CommentItem comment={comment} key={comment.id} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
