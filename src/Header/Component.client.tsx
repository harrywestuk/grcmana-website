'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

interface HeaderClientProps {
  data: HeaderType
}

function resolveHref(link: {
  type?: ('reference' | 'custom') | null
  url?: string | null
  reference?: { value: unknown } | null
  newTab?: boolean | null
}): string {
  if (
    link.type === 'reference' &&
    link.reference?.value != null &&
    typeof link.reference.value === 'object' &&
    'slug' in link.reference.value
  ) {
    return `/${link.reference.value.slug as string}`
  }
  return link.url ?? '#'
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const navItems = data?.navItems ?? []
  const logoMark = data?.logo?.mark ?? 'GRCMANA'
  const logoSub = data?.logo?.sub ?? 'Trust Architect'

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          height: '60px',
          background: 'rgba(10,11,13,0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--ds-border)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="GRCMANA home"
            style={{ display: 'flex', flexDirection: 'column', gap: '1px', textDecoration: 'none' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#ffffff',
              }}
            >
              {logoMark}
            </span>
            {logoSub && (
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '8px',
                  fontWeight: 400,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-400)',
                }}
              >
                {logoSub}
              </span>
            )}
          </Link>

          {/* Desktop nav links */}
          {navItems.length > 0 && (
            <ul
              className="nav-desktop"
              style={{ alignItems: 'center', gap: '28px', listStyle: 'none' }}
            >
              {navItems.map(({ link }, i) => {
                const href = resolveHref(link)
                const isActive = pathname === href
                return (
                  <li key={i}>
                    <Link
                      href={href}
                      style={{
                        fontFamily: 'var(--font-dm-mono), monospace',
                        fontSize: '10px',
                        fontWeight: 400,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: isActive ? '#ffffff' : 'var(--ink-200)',
                        textDecoration: 'none',
                        transition: 'color var(--dur-fast) var(--ease-out)',
                      }}
                      {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}

          {/* Desktop CTAs */}
          <div className="nav-desktop" style={{ alignItems: 'center', gap: '10px' }}>
            {data?.utilityCta?.link?.label && (
              <Link
                href={resolveHref(data.utilityCta.link)}
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '9px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'transparent',
                  color: 'var(--ink-200)',
                  padding: '7px 14px',
                  border: '1px solid var(--ds-border)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--dur-base) var(--ease-out)',
                }}
                {...(data.utilityCta.link.newTab
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {data.utilityCta.link.label}
              </Link>
            )}
            {data?.primaryCta?.link?.label && (
              <Link
                href={resolveHref(data.primaryCta.link)}
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '9px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'var(--signal-500)',
                  color: 'var(--ink-900)',
                  padding: '7px 14px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--dur-base) var(--ease-out)',
                }}
                {...(data.primaryCta.link.newTab
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {data.primaryCta.link.label}
              </Link>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="nav-mobile"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isOpen ? '0px' : '5px',
                width: '22px',
              }}
            >
              {[
                isOpen ? 'translateY(1.5px) rotate(45deg)' : 'none',
                null,
                isOpen ? 'translateY(-1.5px) rotate(-45deg)' : 'none',
              ].map((transform, i) =>
                transform === null ? (
                  <span
                    key={i}
                    style={{
                      display: 'block',
                      width: '22px',
                      height: '1.5px',
                      background: '#ffffff',
                      opacity: isOpen ? 0 : 1,
                      transition: 'opacity var(--dur-fast) var(--ease-out)',
                    }}
                  />
                ) : (
                  <span
                    key={i}
                    style={{
                      display: 'block',
                      width: '22px',
                      height: '1.5px',
                      background: '#ffffff',
                      transformOrigin: 'center',
                      transform,
                      transition: 'transform var(--dur-base) var(--ease-out)',
                    }}
                  />
                ),
              )}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 190,
            background: 'var(--ink-950)',
            paddingTop: '60px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <div
            className="container"
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '32px',
              paddingBottom: '40px',
              flex: 1,
            }}
          >
            {/* Nav links */}
            {navItems.length > 0 && (
              <ul style={{ listStyle: 'none', marginBottom: '40px' }}>
                {navItems.map(({ link }, i) => {
                  const href = resolveHref(link)
                  const isActive = pathname === href
                  return (
                    <li key={i} style={{ borderBottom: '1px solid var(--ds-border)' }}>
                      <Link
                        href={href}
                        style={{
                          display: 'block',
                          padding: '16px 0',
                          fontFamily: 'var(--font-dm-mono), monospace',
                          fontSize: '13px',
                          fontWeight: 500,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: isActive ? 'var(--signal-500)' : '#ffffff',
                          textDecoration: 'none',
                        }}
                        {...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data?.primaryCta?.link?.label && (
                <Link
                  href={resolveHref(data.primaryCta.link)}
                  style={{
                    fontFamily: 'var(--font-dm-mono), monospace',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: 'var(--signal-500)',
                    color: 'var(--ink-900)',
                    padding: '14px 24px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'block',
                  }}
                  {...(data.primaryCta.link.newTab
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {data.primaryCta.link.label}
                </Link>
              )}
              {data?.utilityCta?.link?.label && (
                <Link
                  href={resolveHref(data.utilityCta.link)}
                  style={{
                    fontFamily: 'var(--font-dm-mono), monospace',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: 'transparent',
                    color: 'var(--ink-200)',
                    padding: '14px 24px',
                    border: '1px solid var(--ds-border)',
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'block',
                  }}
                  {...(data.utilityCta.link.newTab
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {data.utilityCta.link.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
