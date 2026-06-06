import React from 'react'

import type { TestimonialBlock as TestimonialBlockProps } from '@/payload-types'

export const TestimonialBlock: React.FC<TestimonialBlockProps> = ({
  quote,
  boldedPhrase,
  authorName,
  authorRole,
}) => {
  const renderQuote = (): React.ReactNode => {
    if (!boldedPhrase) return quote

    const idx = quote.indexOf(boldedPhrase)
    if (idx === -1) return quote

    return (
      <>
        {quote.slice(0, idx)}
        <span style={{ color: 'var(--signal-500)', fontWeight: 400 }}>{boldedPhrase}</span>
        {quote.slice(idx + boldedPhrase.length)}
      </>
    )
  }

  return (
    <section
      style={{
        background: 'var(--ink-900)',
        paddingBlock: 'var(--section-y)',
        borderTop: '1px solid var(--ds-border)',
      }}
    >
      <div className="container container--narrow" style={{ textAlign: 'center' }}>
        <figure className="reveal" style={{ margin: 0 }}>
          <blockquote
            style={{
              fontFamily: 'var(--font-dm-serif), Georgia, serif',
              fontSize: 'clamp(22px, 3vw, 32px)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.4,
              letterSpacing: '-0.01em',
              color: '#ffffff',
              marginBottom: '28px',
            }}
          >
            &ldquo;{renderQuote()}&rdquo;
          </blockquote>
          <figcaption>
            <div
              style={{
                display: 'inline-block',
                width: '32px',
                height: '1px',
                background: 'var(--ds-border)',
                marginBottom: '16px',
              }}
            />
            <div
              style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#ffffff',
                marginBottom: '4px',
              }}
            >
              {authorName}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '9px',
                letterSpacing: '0.08em',
                color: 'var(--ink-400)',
              }}
            >
              {authorRole}
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
