'use client'

import React, { useEffect, useState } from 'react'

import type { Article } from '@/payload-types'

type TocEntry = NonNullable<Article['toc']>[number]

type Props = {
  toc: TocEntry[]
}

export function ArticleToc({ toc }: Props): React.ReactElement | null {
  const [activeAnchor, setActiveAnchor] = useState('')

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('.article-body h2[id]'),
    )
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveAnchor(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-20% 0% -72% 0%' },
    )

    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [])

  if (!toc.length) return null

  return (
    <nav aria-label="Table of contents">
      <span className="eyebrow mb-4">Contents</span>
      <ol>
        {toc.map((entry) => {
          if (!entry.anchor || !entry.text) return null
          return (
            <li key={entry.anchor} style={entry.level === 'h3' ? { paddingLeft: '12px' } : {}}>
              <a
                href={`#${entry.anchor}`}
                className={[
                  'block text-[13px] leading-snug py-1',
                  'transition-colors duration-[150ms]',
                  activeAnchor === entry.anchor
                    ? 'text-signal-500'
                    : 'text-ink-300 hover:text-ink-100',
                ].join(' ')}
              >
                {entry.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
