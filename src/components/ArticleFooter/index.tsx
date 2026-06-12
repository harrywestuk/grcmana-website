import React from 'react'

import type { Article, Category, Media } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'

type Props = {
  article: Article
}

export function ArticleFooter({ article }: Props): React.ReactElement | null {
  const categories = (article.categories ?? []).filter(
    (c): c is Category => typeof c === 'object',
  )
  const authors = article.populatedAuthors ?? []

  if (!categories.length && !authors.length) return null

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

      {authors.length > 0 && (
        <div>
          <span className="eyebrow mb-4">
            {authors.length === 1 ? 'Author' : 'Authors'}
          </span>
          <div className="flex flex-col gap-5">
            {authors.map((author) => {
              const avatar =
                author.avatar && typeof author.avatar === 'object'
                  ? (author.avatar as Media)
                  : null
              return (
                <div key={author.id} className="flex gap-4 items-start">
                  {avatar && (
                    <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden">
                      <MediaComponent
                        resource={avatar}
                        imgClassName="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-ink-100">{author.name}</p>
                    {author.bio && (
                      <p className="text-[13px] text-ink-300 mt-1 leading-relaxed">{author.bio}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
