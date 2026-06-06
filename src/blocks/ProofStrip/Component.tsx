import React from 'react'

import type { ProofStripBlock as ProofStripBlockProps } from '@/payload-types'

export const ProofStripBlock: React.FC<ProofStripBlockProps> = ({ label, items }) => {
  if (!items || items.length === 0) return null

  return (
    <section
      style={{
        background: 'var(--ink-800)',
        borderTop: '1px solid var(--ds-border)',
        borderBottom: '1px solid var(--ds-border)',
        paddingBlock: '40px',
      }}
    >
      <div className="container">
        {label && (
          <div
            style={{
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '9px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--ink-500)',
              marginBottom: '20px',
            }}
          >
            {label}
          </div>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px 48px',
          }}
        >
          {items.map((item) => (
            <div
              key={item.id ?? item.client}
              style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.client}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-dm-serif), Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: '13px',
                  color: 'var(--ink-300)',
                  lineHeight: 1.4,
                }}
              >
                {item.outcome}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
