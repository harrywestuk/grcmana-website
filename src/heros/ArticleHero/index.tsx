import React from 'react'

import type { Media, Category } from '@/payload-types'
import { Media as MediaComponent } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'

type PopulatedAuthor = {
  id?: string | null
  name?: string | null
}

export type ArticleHeroProps = {
  title: string
  heroImage?: Media | number | null
  heroImageAlt?: string | null
  heroStyle?: 'image' | 'gradient' | 'minimal' | null
  categories?: (Category | number)[] | null
  populatedAuthors?: PopulatedAuthor[] | null
  publishedAt?: string | null
  readTime?: number | null
  excerpt?: string | null
}

const SECTION_TOP = 'calc(var(--section-y-hero) + 60px)'
const SECTION_BOTTOM = 'var(--section-y-hero)'

export const ArticleHero: React.FC<ArticleHeroProps> = ({
  title,
  heroImage,
  heroImageAlt,
  heroStyle = 'minimal',
  categories,
  populatedAuthors,
  publishedAt,
  readTime,
  excerpt,
}) => {
  const resolvedStyle = heroStyle ?? 'minimal'
  const hasImage = heroImage && typeof heroImage !== 'number'

  const firstCategory =
    categories && categories.length > 0 && typeof categories[0] === 'object'
      ? (categories[0] as Category)
      : null

  const authorNames =
    populatedAuthors
      ?.filter((a) => a.name)
      .map((a) => a.name)
      .join(', ') ?? null

  const isImageVariant = resolvedStyle === 'image' && hasImage
  const isGradientVariant = resolvedStyle === 'gradient'

  return (
    <section
      aria-label="Article hero"
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: SECTION_TOP,
        paddingBottom: SECTION_BOTTOM,
        ...(isImageVariant && { minHeight: '520px' }),
        ...(isGradientVariant && { background: 'var(--ink-900)' }),
      }}
    >
      {/* ── Background: full-bleed cover image (image variant) ── */}
      {isImageVariant && (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
            }}
          >
            <MediaComponent
              fill
              priority
              imgClassName="object-cover"
              resource={heroImage as Media}
              alt={heroImageAlt ?? undefined}
            />
          </div>
          {/* Gradient overlay — readable text without drowning the image */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              background:
                'linear-gradient(to top, rgba(7,8,10,0.92) 0%, rgba(7,8,10,0.55) 50%, rgba(7,8,10,0.25) 100%)',
            }}
          />
        </>
      )}

      {/* ── Background: radial signal glow (gradient variant) ── */}
      {isGradientVariant && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 600px 400px at 50% 40%, rgba(232,255,71,0.05) 0%, transparent 65%)',
          }}
        />
      )}

      {/* ── Content ── */}
      <div
        className="container container--narrow"
        style={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Category eyebrow */}
        {firstCategory && (
          <span className="reveal eyebrow">
            {firstCategory.title}
          </span>
        )}

        {/* Title */}
        <h1
          className="reveal"
          style={{
            fontFamily: 'var(--font-dm-serif), Georgia, serif',
            fontSize: 'clamp(40px, 5.5vw, 68px)',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            fontWeight: 400,
            color: isImageVariant ? '#ffffff' : 'inherit',
            marginTop: firstCategory ? 'var(--gap-tight)' : 0,
            marginBottom: excerpt ? 'var(--gap-base)' : 'var(--gap-loose)',
          }}
        >
          {title}
        </h1>

        {/* Excerpt */}
        {excerpt && (
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-syne), system-ui, sans-serif',
              fontSize: '16px',
              lineHeight: 1.65,
              color: isImageVariant ? 'var(--ink-100)' : 'var(--ink-200)',
              marginBottom: 'var(--gap-loose)',
              maxWidth: '580px',
            }}
          >
            {excerpt}
          </p>
        )}

        {/* Meta row — authors · date · read time */}
        {(authorNames || publishedAt || readTime) && (
          <div
            className="reveal"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '20px',
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '10px',
              fontWeight: 400,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: isImageVariant ? 'var(--ink-100)' : 'var(--ink-300)',
            }}
          >
            {authorNames && <span>{authorNames}</span>}
            {authorNames && (publishedAt || readTime) && (
              <span
                aria-hidden="true"
                style={{ color: 'var(--ink-500)', fontSize: '8px' }}
              >
                ●
              </span>
            )}
            {publishedAt && (
              <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
            )}
            {publishedAt && readTime && (
              <span
                aria-hidden="true"
                style={{ color: 'var(--ink-500)', fontSize: '8px' }}
              >
                ●
              </span>
            )}
            {readTime && <span>{readTime} min read</span>}
          </div>
        )}
      </div>
    </section>
  )
}
