'use client'

import React, { useEffect, useRef } from 'react'

export const ReadingProgressBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const pct = Math.min(total > 0 ? (window.scrollY / total) * 100 : 0, 100)
      bar.style.width = `${pct}%`
      bar.style.opacity = pct > 0 ? '1' : '0'
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      ref={barRef}
      style={{
        background: 'var(--signal-500)',
        height: '2px',
        left: 0,
        opacity: 0,
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        transition: 'width 100ms linear, opacity 200ms ease',
        width: '0%',
        zIndex: 300,
      }}
    />
  )
}
