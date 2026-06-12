import React from 'react'
import Link from 'next/link'

import type { Article, Category } from '@/payload-types'
import { formatDateHuman } from '@/utilities/formatDateTime'

type Props = {
  article: Article
}

function renderTitle(title: string, emphasis: string | null | undefined): React.ReactNode {
  if (!emphasis) return title
  const idx = title.indexOf(emphasis)
  if (idx !== -1) {
    return (
      <>
        {title.slice(0, idx)}
        <em>{emphasis}</em>
        {title.slice(idx + emphasis.length)}
      </>
    )
  }
  // Emphasis not found as a substring — append it as a suffix
  return (
    <>
      {title.trimEnd()}{' '}
      <em>{emphasis}</em>
    </>
  )
}

export const ArticleHeader: React.FC<Props> = ({ article }) => {
  const { title, titleEmphasis, categories, populatedAuthors, publishedAt, readTime } = article

  const firstCat =
    categories && categories.length > 0 && typeof categories[0] === 'object'
      ? (categories[0] as Category)
      : null

  const authorName =
    populatedAuthors && populatedAuthors.length > 0 ? (populatedAuthors[0]?.name ?? null) : null

  return (
    <header className="article-header">
      <div className="article-header__glow" aria-hidden="true" />
      <div className="article-header__inner">
        <nav className="breadcrumb-eyebrow" aria-label="Breadcrumb">
          <Link href="/blog" className="breadcrumb-eyebrow__item">
            Blog
          </Link>
          {firstCat && (
            <>
              <span className="breadcrumb-eyebrow__sep" aria-hidden="true">
                &gt;
              </span>
              <Link
                href={`/blog?category=${firstCat.slug}`}
                className="breadcrumb-eyebrow__item"
              >
                {firstCat.title}
              </Link>
            </>
          )}
          <span className="breadcrumb-eyebrow__sep" aria-hidden="true">
            &gt;
          </span>
          <span
            className="breadcrumb-eyebrow__item"
            style={{ color: 'var(--ink-400)', pointerEvents: 'none' }}
            aria-current="page"
          >
            Article
          </span>
        </nav>

        <h1 className="article-header__title">{renderTitle(title, titleEmphasis)}</h1>

        <div className="article-header__clean-meta" aria-label="Article metadata">
          {authorName && <span className="author-name">{authorName}</span>}
          {publishedAt && (
            <>
              <span className="separator" aria-hidden="true">
                ·
              </span>
              <time dateTime={publishedAt}>{formatDateHuman(publishedAt)}</time>
            </>
          )}
          {readTime != null && (
            <>
              <span className="separator" aria-hidden="true">
                ·
              </span>
              <span>{readTime} min read</span>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
