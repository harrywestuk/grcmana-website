import React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export type CTABlockProps = {
  heading: string
  subheading?: string | null
  primaryCTA: { label: string; href: string }
  secondaryCTA?: { label: string; href: string } | null
}

const btnBase: React.CSSProperties = {
  fontFamily: 'var(--font-dm-mono), monospace',
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  borderRadius: 0,
  height: 'auto',
  padding: '14px 28px',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
}

export const CTABlock: React.FC<CTABlockProps> = ({
  heading,
  subheading,
  primaryCTA,
  secondaryCTA,
}) => {
  return (
    <div
      style={{
        background: 'var(--ink-800)',
        border: '1px solid var(--ds-border)',
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--gap-base)',
        marginBlock: 'var(--section-y)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-dm-serif), Georgia, serif',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 400,
          lineHeight: 1.1,
          letterSpacing: '-0.015em',
          color: 'var(--ink-100)',
          margin: 0,
        }}
      >
        {heading}
      </h2>

      {subheading && (
        <p
          style={{
            fontFamily: 'var(--font-syne), system-ui, sans-serif',
            fontSize: '15px',
            lineHeight: 1.65,
            color: 'var(--ink-300)',
            margin: 0,
          }}
        >
          {subheading}
        </p>
      )}

      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          marginTop: 'calc(var(--gap-loose) - var(--gap-base))',
        }}
      >
        <Button
          asChild
          style={{
            ...btnBase,
            background: 'var(--signal-500)',
            color: 'var(--ink-900)',
          }}
        >
          <Link href={primaryCTA.href}>{primaryCTA.label}</Link>
        </Button>

        {secondaryCTA && (
          <Button
            asChild
            variant="ghost"
            style={{
              ...btnBase,
              color: 'var(--ink-200)',
              background: 'transparent',
            }}
          >
            <Link href={secondaryCTA.href}>{secondaryCTA.label}</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
