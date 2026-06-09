'use client'
import React, { useEffect, useRef, useState } from 'react'

export type TocItem = {
  id: string
  text: string
  level: number
}

export type TableOfContentsProps = {
  toc: TocItem[]
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ toc }) => {
  const [activeId, setActiveId] = useState<string>('')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!toc.length) return

    const headingIds = toc.map((item) => item.id)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: '0px 0px -70% 0px',
        threshold: 0,
      },
    )

    headingIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current?.observe(el)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [toc])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string): void => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }

  if (!toc.length) return null

  return (
    <nav aria-label="Table of contents">
      <p
        style={{
          fontFamily: 'var(--font-dm-mono), monospace',
          fontSize: '9px',
          fontWeight: 400,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--ink-300)',
          marginBottom: '16px',
        }}
      >
        On this page
      </p>

      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {toc.map((item) => {
          const isActive = activeId === item.id
          const isH3 = item.level === 3

          return (
            <li key={item.id} style={{ paddingLeft: isH3 ? '12px' : '0' }}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-syne), system-ui, sans-serif',
                  fontSize: '13px',
                  lineHeight: 1.4,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--ink-100)' : 'var(--ink-300)',
                  textDecoration: 'none',
                  padding: '5px 0',
                  borderLeft: isActive
                    ? '2px solid var(--signal-500)'
                    : '2px solid transparent',
                  paddingLeft: '10px',
                  transition: 'color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
                }}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
