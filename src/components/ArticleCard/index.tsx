'use client'
import React from 'react'
import Link from 'next/link'
import useClickableCard from '@/utilities/useClickableCard'

import type { Media, Category } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'
import { CategoryBadge } from '@/components/CategoryBadge'
import { formatDateTime } from '@/utilities/formatDateTime'

type ArticleAuthor = {
  id?: string | null
  name?: string | null
}

export type ArticleCardProps = {
  title: string
  slug: string
  excerpt?: string | null
  heroImage?: Media | number | null
  publishedAt?: string | null
  categories?: (Category | number)[] | null
  authors?: ArticleAuthor[] | null
  readTime?: number | null
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  slug,
  excerpt,
  heroImage,
  publishedAt,
  categories,
  authors,
  readTime,
}) => {
  const { card, link } = useClickableCard<HTMLElement>({})
  const href = `/blog/${slug}`

  const resolvedCategories = categories?.filter(
    (c): c is Category => typeof c === 'object' && c !== null,
  )

  const hasImage = heroImage && typeof heroImage !== 'number'

  const authorNames =
    authors
      ?.filter((a) => a.name)
      .map((a) => a.name)
      .join(', ') ?? null

  return (
    <article className="article-card" ref={card.ref as React.RefObject<HTMLElement>}>
      {hasImage && (
        <div className="article-card__thumb">
          <MediaComponent resource={heroImage as Media} size="(max-width: 640px) 100vw, 33vw" />
        </div>
      )}

      <div className="article-card__body">
        {resolvedCategories && resolvedCategories.length > 0 && (
          <div className="article-card__cats">
            {resolvedCategories.map((category) => (
              <CategoryBadge
                key={category.id}
                title={category.title}
                slug={category.slug}
                href={`/categories/${category.slug}`}
              />
            ))}
          </div>
        )}

        <h3 className="article-card__title">
          <Link href={href} ref={link.ref}>
            {title}
          </Link>
        </h3>

        {excerpt && <p className="article-card__excerpt">{excerpt}</p>}

        {(authorNames || publishedAt || readTime) && (
          <div className="article-card__meta">
            {authorNames && <span>{authorNames}</span>}
            {authorNames && (publishedAt || readTime) && (
              <span aria-hidden="true" style={{ color: 'var(--ink-500)' }}>
                ·
              </span>
            )}
            {publishedAt && (
              <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
            )}
            {publishedAt && readTime && (
              <span aria-hidden="true" style={{ color: 'var(--ink-500)' }}>
                ·
              </span>
            )}
            {readTime && <span>{readTime} min read</span>}
          </div>
        )}
      </div>
    </article>
  )
}
