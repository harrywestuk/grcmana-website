import React from 'react'
import { cn } from '@/utilities/ui'

import type { FrameworkBlock as FrameworkBlockProps } from '@/payload-types'

export const FrameworkBlock: React.FC<FrameworkBlockProps> = ({
  eyebrow,
  heading,
  headingAccent,
  body,
  phases,
}) => {
  return (
    <section className="bg-ink-950 border-y border-ds-border py-section-y">
      <div className="container">
        <div className={`max-w-[600px] ${body ? 'mb-14' : 'mb-14'}`}>
          {eyebrow && (
            <span className="reveal eyebrow inline-flex mb-base">
              {eyebrow}
            </span>
          )}
          {(heading || headingAccent) && (
            <h2 className={`reveal font-display font-normal text-display-h2 ${body ? 'mb-base' : ''}`}>
              {heading}
              {heading && headingAccent && ' '}
              {headingAccent && (
                <em className="italic text-signal-500">{headingAccent}</em>
              )}
            </h2>
          )}
          {body && (
            <p className="reveal font-sans text-[16px] leading-[1.65] text-ink-200">
              {body}
            </p>
          )}
        </div>

        {phases && phases.length > 0 && (
          <div className="grid-phases">
            {phases.map((phase) => (
              <div
                key={phase.id ?? phase.label}
                className={cn(
                  'reveal bg-ink-950 p-7 border-t-2 border-transparent transition-colors duration-base ease-brand',
                  phase.isActive && 'bg-signal-a04 border-signal-500',
                )}
              >
                {phase.number && (
                  <div
                    className={cn(
                      'font-mono text-[8px] tracking-[0.12em] uppercase mb-2',
                      phase.isActive ? 'text-signal-500' : 'text-ink-200',
                    )}
                  >
                    {phase.number}
                  </div>
                )}
                <div
                  className={cn(
                    'font-sans text-[14px] font-semibold mb-2',
                    phase.isActive ? 'text-white' : 'text-ink-200',
                  )}
                >
                  {phase.label}
                </div>
                {phase.description && (
                  <p className="font-sans text-[12px] leading-[1.6] text-ink-400">
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
