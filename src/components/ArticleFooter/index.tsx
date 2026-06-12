import React from 'react'

import type { Article, Category, Media } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'

type Props = {
  article: Article
}

function getInitials(name: string | null | undefined): string {
  return (name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
}

export function ArticleFooter({ article }: Props): React.ReactElement | null {
  const categories = (article.categories ?? []).filter(
    (c): c is Category => typeof c === 'object',
  )
  const authors = article.populatedAuthors ?? []
  const author = authors[0]

  if (!categories.length && !author) return null

  const avatar =
    author?.avatar && typeof author.avatar === 'object' ? (author.avatar as Media) : null

  return (
    <div className="article-footer__content">
      {categories.length > 0 && (
        <div className="mb-8">
          <span className="eyebrow mb-3">Categories</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="text-[11px] uppercase tracking-wider font-mono px-2.5 py-1 border border-ds-border-hover text-ink-200"
              >
                {cat.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {author && (
        <div className="author-bio">
          <div className="author-bio__avatar">
            {avatar ? (
              <MediaComponent resource={avatar} imgClassName="w-full h-full object-cover" />
            ) : (
              <span className="author-bio__initials">{getInitials(author.name)}</span>
            )}
          </div>

          <div className="author-bio__content">
            <div className="author-bio__eyebrow">Author</div>
            <h3 className="author-bio__name">{author.name}</h3>
            {author.bio && <p className="author-bio__copy">{author.bio}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
