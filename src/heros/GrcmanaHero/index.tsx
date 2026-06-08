import React from 'react'
import Link from 'next/link'

import type { Page } from '@/payload-types'

type GrcmanaHeroProps = Page['hero']

export const GrcmanaHero: React.FC<GrcmanaHeroProps> = ({
  eyebrow,
  heading,
  headingAccent,
  body,
  links,
  trustBadges,
}) => {
  const primaryCta = links?.[0]?.link
  const secondaryCta = links?.[1]?.link

  const primaryHref =
    primaryCta?.type === 'reference' &&
    typeof primaryCta.reference?.value === 'object' &&
    'slug' in primaryCta.reference.value
      ? `/${primaryCta.reference.value.slug}`
      : (primaryCta?.url ?? '#')

  const secondaryHref =
    secondaryCta?.type === 'reference' &&
    typeof secondaryCta.reference?.value === 'object' &&
    'slug' in secondaryCta.reference.value
      ? `/${secondaryCta.reference.value.slug}`
      : (secondaryCta?.url ?? '#')

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'calc(var(--section-y-hero) * 0.5 + 60px)',
        paddingBottom: 'var(--section-y-hero)',
        paddingInline: 'var(--gutter)',
      }}
    >
      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 700px 500px at 50% 45%, rgba(232,255,71,0.05) 0%, transparent 65%), radial-gradient(ellipse 280px 280px at 75% 15%, rgba(232,255,71,0.035) 0%, transparent 55%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          maxWidth: 'var(--container-narrow)',
          marginInline: 'auto',
        }}
      >
        {eyebrow && (
          <span className="reveal eyebrow" style={{ justifyContent: 'center', display: 'flex' }}>
            {eyebrow}
          </span>
        )}

        {(heading || headingAccent) && (
          <h1
            className="reveal"
            style={{
              fontFamily: 'var(--font-dm-serif), Georgia, serif',
              fontSize: 'clamp(52px, 7.5vw, 88px)',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              fontWeight: 400,
              marginBottom: 'var(--gap-base)',
            }}
          >
            {heading}
            {heading && headingAccent && <br />}
            {headingAccent && (
              <em style={{ fontStyle: 'italic', color: 'var(--signal-500)' }}>
                {headingAccent}
              </em>
            )}
          </h1>
        )}

        {body && (
          <p
            className="reveal"
            style={{
              fontFamily: 'var(--font-syne), system-ui, sans-serif',
              fontSize: '17px',
              lineHeight: 1.65,
              color: 'var(--ink-200)',
              maxWidth: '500px',
              margin: '0 auto var(--gap-loose)',
            }}
          >
            {body}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div
            className="reveal"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
              marginBottom: '56px',
            }}
          >
            {primaryCta && (
              <Link
                href={primaryHref}
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'var(--signal-500)',
                  color: 'var(--ink-900)',
                  padding: '16px 32px',
                  borderRadius: 0,
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
            {secondaryCta && (
              <Link
                href={secondaryHref}
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'transparent',
                  color: 'var(--ink-200)',
                  padding: '16px 32px',
                  borderRadius: 0,
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
        )}

        {trustBadges && trustBadges.length > 0 && (
          <div
            className="reveal"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {trustBadges.map((badge) => (
              <span
                key={badge.id ?? badge.label}
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '8px',
                  fontWeight: 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-200)',
                  background: 'var(--ink-800)',
                  padding: '5px 10px',
                  border: '1px solid var(--ds-border-hover)',
                }}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
