import React from 'react'
import Link from 'next/link'
import type { Article, Category } from '@/payload-types'

export type BlogCardPost = Pick<
  Article,
  | 'title'
  | 'titleEmphasis'
  | 'slug'
  | 'categories'
  | 'excerpt'
  | 'publishedAt'
  | 'populatedAuthors'
  | 'readTime'
>

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
  return (
    <>
      {title.trimEnd()} <em>{emphasis}</em>
    </>
  )
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const BlogMatrixCard: React.FC<{ post: BlogCardPost }> = ({ post }) => {
  const { title, titleEmphasis, slug, categories, excerpt, publishedAt, populatedAuthors, readTime } =
    post

  const firstCat =
    categories && categories.length > 0 && typeof categories[0] === 'object'
      ? (categories[0] as Category)
      : null

  const authorName =
    populatedAuthors && populatedAuthors.length > 0 ? (populatedAuthors[0]?.name ?? null) : null

  return (
    <Link href={`/blog/${slug}`} className="matrix-item">
      <div className="matrix-item__header">
        <span className="matrix-item__cat">{firstCat?.title ?? 'Uncategorised'}</span>
        {publishedAt && (
          <span className="matrix-item__date">{formatShortDate(publishedAt)}</span>
        )}
      </div>

      <h2 className="matrix-item__title">{renderTitle(title, titleEmphasis)}</h2>

      {excerpt && <p className="matrix-item__excerpt">{excerpt}</p>}

      <div className="matrix-item__footer">
        {authorName && (
          <>
            <span>By</span>
            <span className="matrix-item__author">{authorName}</span>
          </>
        )}
        {authorName && readTime != null && <span>·</span>}
        {readTime != null && <span>{readTime} min read</span>}
      </div>
    </Link>
  )
}
