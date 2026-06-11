import Link from 'next/link'
import React from 'react'

import type { ServicesBlock as ServicesBlockProps, Page, Article } from '@/payload-types'

type ServiceLink = {
  type?: ('reference' | 'custom') | null
  newTab?: boolean | null
  reference?:
    | ({ relationTo: 'pages'; value: number | Page } | null)
    | ({ relationTo: 'articles'; value: number | Article } | null)
  url?: string | null
  label: string
}

function resolveHref(link: ServiceLink): string {
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

export const ServicesBlock: React.FC<ServicesBlockProps> = ({
  eyebrow,
  heading,
  headingAccent,
  body,
  items,
}) => {
  return (
    <section
      style={{
        background: 'var(--ink-900)',
        paddingBlock: 'var(--section-y)',
      }}
    >
      <div className="container">
        {/* Section header */}
        <div
          style={{
            maxWidth: '600px',
            marginBottom: '56px',
          }}
        >
          {eyebrow && (
            <span
              className="reveal eyebrow"
              style={{ display: 'inline-flex', marginBottom: 'var(--gap-base)' }}
            >
              {eyebrow}
            </span>
          )}
          {(heading || headingAccent) && (
            <h2
              className="reveal"
              style={{
                fontFamily: 'var(--font-dm-serif), Georgia, serif',
                fontSize: 'clamp(36px, 4vw, 52px)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                marginBottom: body ? 'var(--gap-base)' : 0,
              }}
            >
              {heading}
              {heading && headingAccent && ' '}
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
              }}
            >
              {body}
            </p>
          )}
        </div>

        {/* Service cards grid */}
        {items && items.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1px',
              background: 'var(--ds-border)',
            }}
          >
            {items.map((item) => (
              <div
                key={item.id ?? item.title}
                className="reveal"
                style={{
                  background: 'var(--ink-900)',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  transition: 'background var(--dur-base) var(--ease-out)',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
                >
                  {item.icon && (
                    <span
                      style={{
                        fontSize: '20px',
                        lineHeight: 1,
                        color: 'var(--signal-500)',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {item.icon}
                    </span>
                  )}
                  <div style={{ flex: 1 }}>
                    {item.number && (
                      <div
                        style={{
                          fontFamily: 'var(--font-dm-mono), monospace',
                          fontSize: '8px',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--ink-200)',
                          marginBottom: '6px',
                        }}
                      >
                        {item.number}
                      </div>
                    )}
                    <h3
                      style={{
                        fontFamily: 'var(--font-syne), system-ui, sans-serif',
                        fontSize: '16px',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        color: '#ffffff',
                        marginBottom: '8px',
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-syne), system-ui, sans-serif',
                        fontSize: '14px',
                        lineHeight: 1.65,
                        color: 'var(--ink-300)',
                      }}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
                {item.link?.label && (
                  <Link
                    href={resolveHref(item.link)}
                    style={{
                      fontFamily: 'var(--font-dm-mono), monospace',
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--signal-500)',
                      textDecoration: 'none',
                      marginTop: 'auto',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    {...(item.link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {item.link.label} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
