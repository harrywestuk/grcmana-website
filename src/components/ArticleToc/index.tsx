'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

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

  const h2Entries = toc.filter((e) => e.level === 'h2')

  if (!h2Entries.length) return null

  return (
    <nav aria-label="Table of contents">
      <span className="eyebrow mb-4">Inside This Article</span>
      <ol>
        {h2Entries.map((entry) => {
          if (!entry.anchor || !entry.text) return null
          return (
            <li key={entry.anchor}>
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

      <Link
        href="/contact"
        className="flex items-center justify-between mt-6 px-[14px] py-[9px] font-mono text-[9px] font-medium tracking-[0.08em] uppercase bg-signal-500 hover:bg-signal-400 text-ink-900 transition-colors duration-[150ms]"
      >
        Book a Call
        <span>→</span>
      </Link>
    </nav>
  )
}
