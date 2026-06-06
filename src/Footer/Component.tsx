import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer as FooterType } from '@/payload-types'

function resolveHref(link: {
  type?: ('reference' | 'custom') | null
  url?: string | null
  reference?: { value: unknown } | null
  newTab?: boolean | null
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

export async function Footer() {
  const footerData: FooterType = await getCachedGlobal('footer', 1)()

  const brand = footerData?.brand
  const columns = footerData?.columns ?? []
  const copyright = footerData?.copyright
  const registration = footerData?.registration

  return (
    <footer
      style={{
        background: 'var(--ink-950)',
        borderTop: '1px solid var(--ds-border)',
        paddingBlock: '64px 28px',
      }}
    >
      <div className="container">
        {/* Top grid */}
        <div className="footer-top-grid">
          {/* Brand column */}
          <div>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  marginBottom: '3px',
                }}
              >
                {brand?.name ?? 'GRCMANA'}
              </div>
              {brand?.sub && (
                <div
                  style={{
                    fontFamily: 'var(--font-dm-mono), monospace',
                    fontSize: '8px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-500)',
                    marginBottom: '14px',
                  }}
                >
                  {brand.sub}
                </div>
              )}
            </Link>
            {brand?.tagline && (
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--ink-300)',
                  lineHeight: 1.6,
                  marginBottom: '20px',
                }}
              >
                {brand.tagline}
              </p>
            )}
            {brand?.certBadges && brand.certBadges.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {brand.certBadges.map((badge) => (
                  <span
                    key={badge.id ?? badge.label}
                    style={{
                      fontFamily: 'var(--font-dm-mono), monospace',
                      fontSize: '8px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-500)',
                      padding: '4px 8px',
                      border: '1px solid var(--ds-border)',
                    }}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.id ?? col.heading}>
              <div
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '9px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-500)',
                  marginBottom: '16px',
                }}
              >
                {col.heading}
              </div>
              {col.links && col.links.length > 0 && (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '9px', listStyle: 'none' }}>
                  {col.links.map((item) => (
                    <li key={item.id ?? item.link.label}>
                      <Link
                        href={resolveHref(item.link)}
                        style={{
                          fontSize: '13px',
                          color: 'var(--ink-300)',
                          textDecoration: 'none',
                          transition: 'color var(--dur-fast) var(--ease-out)',
                        }}
                        {...(item.link.newTab
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {item.link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '9px',
              letterSpacing: '0.08em',
              color: 'var(--ink-500)',
            }}
          >
            {copyright}
          </span>
          {registration && (
            <span
              style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '9px',
                letterSpacing: '0.08em',
                color: 'var(--ink-500)',
              }}
            >
              {registration}
            </span>
          )}
        </div>
      </div>
    </footer>
  )
}
