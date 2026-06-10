import React from 'react'

import type { MetricsBandBlock as MetricsBandBlockProps } from '@/payload-types'

export const MetricsBandBlock: React.FC<MetricsBandBlockProps> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) return null

  return (
    <section className="bg-ink-950 border-y border-ds-border py-section-y">
      <div className="container">
        <div className="grid-metrics">
          {metrics.map((metric) => (
            <div
              key={metric.id ?? metric.value}
              className="reveal bg-ink-950 p-10 text-center"
            >
              <div className="font-display font-normal text-metric text-white mb-1">
                {metric.value}
              </div>
              {metric.qualifier && (
                <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-signal-500 mb-3">
                  {metric.qualifier}
                </div>
              )}
              {metric.description && (
                <p className="font-sans text-[13px] leading-[1.6] text-ink-300 max-w-[240px] mx-auto">
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
