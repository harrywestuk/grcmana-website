import Link from 'next/link'
import React from 'react'

import type { CtaCloseBlock as CtaCloseBlockProps } from '@/payload-types'

function resolveHref(link: {
  type?: ('reference' | 'custom') | null
  url?: string | null
  reference?: { value: unknown } | null
}): string {
  if (
    link.type === 'reference' &&
    link.reference?.value != null &&
    typeof link.reference.value === 'object' &&
    'slug' in link.reference.value
  ) {
    return `/${link.reference.value.slug as string}`
  }
  return link.url ?? '#'
}

export const CtaCloseBlock: React.FC<CtaCloseBlockProps> = ({
  eyebrow,
  heading,
  headingAccent,
  body,
  primaryCta,
  secondaryCta,
  note,
}) => {
  return (
    <section
      style={{
        background: 'var(--ink-950)',
        paddingBlock: 'var(--section-y)',
        borderTop: '1px solid var(--ds-border)',
        textAlign: 'center',
      }}
    >
      <div className="container container--narrow">
        {eyebrow && (
          <span
            className="reveal eyebrow"
            style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 'var(--gap-base)' }}
          >
            {eyebrow}
          </span>
        )}
        {(heading || headingAccent) && (
          <h2
            className="reveal"
            style={{
              fontFamily: 'var(--font-dm-serif), Georgia, serif',
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              marginBottom: body ? 'var(--gap-base)' : 'var(--gap-loose)',
            }}
          >
            {heading}
            {heading && headingAccent && <br />}
            {headingAccent && (
              <em style={{ fontStyle: 'italic', color: 'var(--signal-500)' }}>
                {headingAccent}
              </em>
            )}
          </h2>
        )}
        {body && (
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-syne), system-ui, sans-serif',
              fontSize: '16px',
              lineHeight: 1.65,
              color: 'var(--ink-200)',
              marginBottom: 'var(--gap-loose)',
              maxWidth: '480px',
              marginInline: 'auto',
            }}
          >
            {body}
          </p>
        )}
        <div
          className="reveal"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            marginBottom: note ? '20px' : 0,
          }}
        >
          {primaryCta?.label && (
            <Link
              href={resolveHref(primaryCta)}
              style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'var(--signal-500)',
                color: 'var(--ink-900)',
                padding: '16px 32px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                transition: 'all var(--dur-base) var(--ease-out)',
                whiteSpace: 'nowrap',
              }}
              {...(primaryCta.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {primaryCta.label}
            </Link>
          )}
          {secondaryCta?.label && (
            <Link
              href={resolveHref(secondaryCta)}
              style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'transparent',
                color: 'var(--ink-200)',
                padding: '16px 32px',
                border: '1px solid var(--ds-border)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                textDecoration: 'none',
                transition: 'all var(--dur-base) var(--ease-out)',
                whiteSpace: 'nowrap',
              }}
              {...(secondaryCta.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
        {note && (
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '9px',
              letterSpacing: '0.08em',
              color: 'var(--ink-500)',
            }}
          >
            {note}
          </p>
        )}
      </div>
    </section>
  )
}
