import React from 'react'

import type { FrameworkBlock as FrameworkBlockProps } from '@/payload-types'

export const FrameworkBlock: React.FC<FrameworkBlockProps> = ({
  eyebrow,
  heading,
  headingAccent,
  body,
  phases,
}) => {
  return (
    <section
      style={{
        background: 'var(--ink-950)',
        paddingBlock: 'var(--section-y)',
        borderTop: '1px solid var(--ds-border)',
        borderBottom: '1px solid var(--ds-border)',
      }}
    >
      <div className="container">
        {/* Section header */}
        <div style={{ maxWidth: '600px', marginBottom: '56px' }}>
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

        {/* Phase grid */}
        {phases && phases.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1px',
              background: 'var(--ds-border)',
            }}
          >
            {phases.map((phase) => (
              <div
                key={phase.id ?? phase.label}
                className="reveal"
                style={{
                  background: phase.isActive ? 'rgba(232,255,71,0.04)' : 'var(--ink-950)',
                  padding: '28px 24px',
                  borderTop: phase.isActive
                    ? '2px solid var(--signal-500)'
                    : '2px solid transparent',
                  transition: 'background var(--dur-base) var(--ease-out)',
                }}
              >
                {phase.number && (
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-mono), monospace',
                      fontSize: '8px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: phase.isActive ? 'var(--signal-500)' : 'var(--ink-500)',
                      marginBottom: '8px',
                    }}
                  >
                    {phase.number}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: 'var(--font-syne), system-ui, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: phase.isActive ? '#ffffff' : 'var(--ink-200)',
                    marginBottom: '8px',
                  }}
                >
                  {phase.label}
                </div>
                {phase.description && (
                  <p
                    style={{
                      fontFamily: 'var(--font-syne), system-ui, sans-serif',
                      fontSize: '12px',
                      lineHeight: 1.6,
                      color: 'var(--ink-400)',
                    }}
                  >
                    {phase.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
