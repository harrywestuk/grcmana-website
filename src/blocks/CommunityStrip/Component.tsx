import Link from 'next/link'
import React from 'react'

import type { CommunityStripBlock as CommunityStripBlockProps } from '@/payload-types'

function resolveCtaHref(cta: CommunityStripBlockProps['cta']): string {
  if (
    cta.type === 'reference' &&
    cta.reference?.value != null &&
    typeof cta.reference.value === 'object' &&
    'slug' in cta.reference.value
  ) {
    return `/${cta.reference.value.slug as string}`
  }
  return cta.url ?? '#'
}

export const CommunityStripBlock: React.FC<CommunityStripBlockProps> = ({
  overline,
  headline,
  headlineAccent,
  statValue,
  statLabel,
  cta,
}) => {
  return (
    <section
      style={{
        background: 'var(--ink-900)',
        borderTop: '1px solid var(--ds-border)',
        borderBottom: '1px solid var(--ds-border)',
        paddingBlock: '40px',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left: headline */}
          <div className="reveal">
            {overline && (
              <div
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-500)',
                  marginBottom: '6px',
                }}
              >
                {overline}
              </div>
            )}
            {(headline || headlineAccent) && (
              <h3
                style={{
                  fontFamily: 'var(--font-dm-serif), Georgia, serif',
                  fontSize: 'clamp(22px, 3vw, 30px)',
                  fontWeight: 400,
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                }}
              >
                {headline}
                {headline && headlineAccent && ' '}
                {headlineAccent && (
                  <em style={{ fontStyle: 'italic', color: 'var(--signal-500)' }}>
                    {headlineAccent}
                  </em>
                )}
              </h3>
            )}
          </div>

          {/* Centre: stat */}
          {(statValue || statLabel) && (
            <div className="reveal" style={{ textAlign: 'center' }}>
              {statValue && (
                <div
                  style={{
                    fontFamily: 'var(--font-dm-serif), Georgia, serif',
                    fontSize: 'clamp(36px, 5vw, 52px)',
                    fontWeight: 400,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    color: '#ffffff',
                  }}
                >
                  {statValue}
                </div>
              )}
              {statLabel && (
                <div
                  style={{
                    fontFamily: 'var(--font-dm-mono), monospace',
                    fontSize: '9px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-500)',
                    marginTop: '4px',
                  }}
                >
                  {statLabel}
                </div>
              )}
            </div>
          )}

          {/* Right: CTA */}
          {cta?.label && (
            <div className="reveal">
              <Link
                href={resolveCtaHref(cta)}
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background: 'transparent',
                  color: 'var(--ink-200)',
                  padding: '12px 24px',
                  border: '1px solid var(--ds-border)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all var(--dur-base) var(--ease-out)',
                  whiteSpace: 'nowrap',
                }}
                {...(cta.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {cta.label} →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
