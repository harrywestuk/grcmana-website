import React from 'react'

import type { ProductPreviewBlock as ProductPreviewBlockProps } from '@/payload-types'
import { Media } from '@/components/Media'

export const ProductPreviewBlock: React.FC<ProductPreviewBlockProps> = ({
  eyebrow,
  heading,
  headingAccent,
  body,
  previewImage,
}) => {
  return (
    <section
      style={{
        background: 'var(--ink-900)',
        paddingBlock: 'var(--section-y)',
        borderTop: '1px solid var(--ds-border)',
      }}
    >
      <div className="container">
        <div className="grid-split">
          {/* Copy side */}
          <div>
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
                }}
              >
                {body}
              </p>
            )}
          </div>

          {/* Image card side */}
          <div className="reveal">
            {/* Chrome bar */}
            <div
              style={{
                background: 'var(--ink-800)',
                border: '1px solid var(--ds-border)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: 'var(--ink-950)',
                  borderBottom: '1px solid var(--ds-border)',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {['#FF5F57', '#FFBD2E', '#28C840'].map((color) => (
                  <span
                    key={color}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: color,
                      display: 'inline-block',
                    }}
                  />
                ))}
              </div>
              {typeof previewImage === 'object' && previewImage !== null ? (
                <Media
                  resource={previewImage}
                  imgClassName=""
                  htmlElement={null}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
