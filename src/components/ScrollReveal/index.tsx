'use client'

import React, { useEffect } from 'react'

export const ScrollReveal: React.FC = () => {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')

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
  }, [])

  return null
}
