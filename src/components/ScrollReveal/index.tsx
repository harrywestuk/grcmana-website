'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export const ScrollReveal: React.FC = () => {
  const pathname = usePathname()

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal:not(.in)')

    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    els.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [pathname])

  return null
}
