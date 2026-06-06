import React from 'react'

import type { MetricsBandBlock as MetricsBandBlockProps } from '@/payload-types'

export const MetricsBandBlock: React.FC<MetricsBandBlockProps> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) return null

  return (
    <section
      style={{
        background: 'var(--ink-950)',
        borderTop: '1px solid var(--ds-border)',
        borderBottom: '1px solid var(--ds-border)',
        paddingBlock: '56px',
      }}
    >
      <div className="container">
        <div
          className="grid-metrics"
        >
          {metrics.map((metric) => (
            <div
              key={metric.id ?? metric.value}
              className="reveal"
              style={{
                background: 'var(--ink-950)',
                padding: '40px 32px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-dm-serif), Georgia, serif',
                  fontSize: 'clamp(48px, 6vw, 72px)',
                  fontWeight: 400,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  color: '#ffffff',
                  marginBottom: '4px',
                }}
              >
                {metric.value}
              </div>
              {metric.qualifier && (
                <div
                  style={{
                    fontFamily: 'var(--font-dm-mono), monospace',
                    fontSize: '9px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--signal-500)',
                    marginBottom: '12px',
                  }}
                >
                  {metric.qualifier}
                </div>
              )}
              {metric.description && (
                <p
                  style={{
                    fontFamily: 'var(--font-syne), system-ui, sans-serif',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: 'var(--ink-300)',
                    maxWidth: '240px',
                    marginInline: 'auto',
                  }}
                >
                  {metric.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
