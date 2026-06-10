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
    <section className="bg-ink-950 border-t border-ds-border py-section-y text-center">
      <div className="container container--narrow">
        {eyebrow && (
          <span className="reveal eyebrow inline-flex justify-center mb-base">
            {eyebrow}
          </span>
        )}

        {(heading || headingAccent) && (
          <h2
            className={`reveal font-display font-normal text-display-cta ${body ? 'mb-base' : 'mb-loose'}`}
          >
            {heading}
            {heading && headingAccent && <br />}
            {headingAccent && (
              <em className="italic text-signal-500">{headingAccent}</em>
            )}
          </h2>
        )}

        {body && (
          <p className="reveal font-sans text-[16px] leading-[1.65] text-ink-200 mb-loose max-w-[480px] mx-auto">
            {body}
          </p>
        )}

        <div className={`reveal flex items-center justify-center gap-3.5 flex-wrap ${note ? 'mb-5' : ''}`}>
          {primaryCta?.label && (
            <Link
              href={resolveHref(primaryCta)}
              className="font-mono text-[12px] font-medium tracking-[0.08em] uppercase bg-signal-500 text-ink-900 px-8 py-4 inline-flex items-center gap-1.5 no-underline transition-all duration-base ease-brand hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
              {...(primaryCta.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {primaryCta.label}
            </Link>
          )}
          {secondaryCta?.label && (
            <Link
              href={resolveHref(secondaryCta)}
              className="font-mono text-[12px] font-medium tracking-[0.08em] uppercase bg-transparent text-ink-200 px-8 py-4 border border-ds-border inline-flex items-center gap-1.5 no-underline transition-all duration-base ease-brand hover:border-ds-border-hover hover:text-white"
              {...(secondaryCta.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>

        {note && (
          <p className="reveal font-mono text-[9px] tracking-[0.08em] text-ink-500">
            {note}
          </p>
        )}
      </div>
    </section>
  )
}
