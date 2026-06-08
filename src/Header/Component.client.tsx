'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'
import type { MenuItemNode } from '@/utilities/buildMenuTree'
import { resolveMenuHref } from '@/utilities/buildMenuTree'

interface HeaderClientProps {
  data: HeaderType
  menuTree: MenuItemNode[]
}

function resolveCtaHref(link: {
  type?: ('reference' | 'custom') | null
  url?: string | null
  reference?: { value: unknown } | null
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

function resolvePanelCtaHref(cta: NonNullable<MenuItemNode['cta']>): string {
  if (
    cta.linkType === 'internal' &&
    cta.reference != null &&
    typeof cta.reference === 'object' &&
    'value' in cta.reference &&
    typeof cta.reference.value === 'object' &&
    cta.reference.value !== null &&
    'slug' in cta.reference.value
  ) {
    return `/${(cta.reference.value as { slug: string }).slug}`
  }
  return cta.url ?? '#'
}

// ─── Desktop mega panel ───────────────────────────────────────────────────────

type PanelProps = {
  item: MenuItemNode
  onClose: () => void
}

const MegaPanel: React.FC<PanelProps> = ({ item, onClose }) => {
  const columns = item.children.reduce<Record<number, MenuItemNode[]>>((acc, child) => {
    const col = child.column ?? 1
    if (!acc[col]) acc[col] = []
    acc[col].push(child)
    return acc
  }, {})

  const colKeys = Object.keys(columns)
    .map(Number)
    .sort((a, b) => a - b)

  const metaByColumn = (item.columnMeta ?? []).reduce<
    Record<number, NonNullable<MenuItemNode['columnMeta']>[number]>
  >((acc, m) => {
    if (m.columnNumber != null) acc[m.columnNumber] = m
    return acc
  }, {})

  const panelCta = item.cta?.label ? item.cta : null
  const ctaHref = panelCta ? resolvePanelCtaHref(panelCta) : '#'

  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        left: 0,
        right: 0,
        background: 'var(--ink-950)',
        borderBottom: '1px solid var(--ds-border)',
        borderTop: '1px solid var(--ds-border)',
        zIndex: 190,
      }}
    >
      {/* Link columns */}
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.max(colKeys.length, 1)}, 1fr)`,
          gap: '40px',
          padding: '32px var(--container-px, 24px)',
        }}
      >
        {colKeys.map((colKey) => {
          const meta = metaByColumn[colKey]
          return (
          <div key={colKey} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {meta && (
              <div style={{ marginBottom: '8px', paddingBottom: '10px', borderBottom: '1px solid var(--ds-border)' }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-dm-mono), monospace',
                    fontSize: '10px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-200)',
                  }}
                >
                  {meta.heading}
                </span>
                {meta.subText && (
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-dm-serif), Georgia, serif',
                      fontStyle: 'italic',
                      fontSize: '11px',
                      color: 'var(--ink-300)',
                      marginTop: '2px',
                    }}
                  >
                    {meta.subText}
                  </span>
                )}
              </div>
            )}
            {columns[colKey].map((child) => {
              const href = resolveMenuHref(child)
              return (
                <Link
                  key={child.id}
                  href={href}
                  onClick={onClose}
                  style={{ display: 'block', textDecoration: 'none', padding: '10px 0' }}
                  {...(child.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-dm-mono), monospace',
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#ffffff',
                      marginBottom: child.description ? '4px' : 0,
                    }}
                  >
                    {child.label}
                  </span>
                  {child.description && (
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-dm-serif), Georgia, serif',
                        fontStyle: 'italic',
                        fontSize: '12px',
                        color: 'var(--ink-300)',
                        lineHeight: 1.4,
                      }}
                    >
                      {child.description}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
          )
        })}
      </div>

      {/* CTA bar */}
      {panelCta && (
        <div
          style={{
            borderTop: '1px solid var(--ds-border)',
            background: 'var(--ink-900)',
          }}
        >
          <div className="container" style={{ padding: '0 var(--container-px, 24px)' }}>
            <Link
              href={ctaHref}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '14px 0',
                textDecoration: 'none',
              }}
              {...(panelCta.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--signal-500)',
                }}
              >
                {panelCta.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '10px',
                  color: 'var(--signal-500)',
                }}
              >
                →
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, menuTree }) => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<number | null>(null)
  const [expandedMobile, setExpandedMobile] = useState<number | null>(null)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLElement>(null)

  const logoMark = data?.logo?.mark ?? 'GRCMANA'
  const logoSub = data?.logo?.sub ?? 'Trust Architect'

  // Close mobile drawer and panels on route change
  useEffect(() => {
    setMobileOpen(false)
    setActivePanel(null)
    setExpandedMobile(null)
  }, [pathname])

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Close panel on click-outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (navRef.current && !navRef.current.contains(e.target as Node)) {
      setActivePanel(null)
    }
  }, [])

  useEffect(() => {
    if (activePanel !== null) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activePanel, handleClickOutside])

  const openPanel = (id: number) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    hoverTimerRef.current = setTimeout(() => setActivePanel(id), 120)
  }

  const closePanel = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    hoverTimerRef.current = setTimeout(() => setActivePanel(null), 80)
  }

  const keepPanel = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
  }

  return (
    <>
      <nav
        ref={navRef}
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

          {/* Desktop nav */}
          {menuTree.length > 0 && (
            <ul
              className="nav-desktop"
              style={{ alignItems: 'center', gap: '28px', listStyle: 'none' }}
            >
              {menuTree.map((item) => {
                const href = resolveMenuHref(item)
                const isActive = pathname === href || pathname.startsWith(href + '/')
                const hasPanel = item.megaPanel && item.children.length > 0
                const isPanelOpen = activePanel === item.id

                return (
                  <li
                    key={item.id}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => hasPanel && openPanel(item.id)}
                    onMouseLeave={() => hasPanel && closePanel()}
                  >
                    {hasPanel ? (
                      <button
                        onClick={() => setActivePanel(isPanelOpen ? null : item.id)}
                        aria-expanded={isPanelOpen}
                        style={{
                          fontFamily: 'var(--font-dm-mono), monospace',
                          fontSize: '10px',
                          fontWeight: 400,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: isActive || isPanelOpen ? '#ffffff' : 'var(--ink-200)',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          transition: 'color var(--dur-fast) var(--ease-out)',
                        }}
                      >
                        {item.label}
                      </button>
                    ) : (
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
                        {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          )}

          {/* Desktop CTAs */}
          <div className="nav-desktop" style={{ alignItems: 'center', gap: '10px' }}>
            {data?.utilityCta?.link?.label && (
              <Link
                href={resolveCtaHref(data.utilityCta.link)}
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
                href={resolveCtaHref(data.primaryCta.link)}
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
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
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
                gap: mobileOpen ? '0px' : '5px',
                width: '22px',
              }}
            >
              {[
                mobileOpen ? 'translateY(1.5px) rotate(45deg)' : 'none',
                null,
                mobileOpen ? 'translateY(-1.5px) rotate(-45deg)' : 'none',
              ].map((transform, i) =>
                transform === null ? (
                  <span
                    key={i}
                    style={{
                      display: 'block',
                      width: '22px',
                      height: '1.5px',
                      background: '#ffffff',
                      opacity: mobileOpen ? 0 : 1,
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

        {/* Desktop mega panels — inside the fixed nav so hover bridge works */}
        {menuTree.map((item) => {
          if (!item.megaPanel || item.children.length === 0 || activePanel !== item.id) return null
          return (
            <div
              key={item.id}
              onMouseEnter={keepPanel}
              onMouseLeave={closePanel}
            >
              <MegaPanel item={item} onClose={() => setActivePanel(null)} />
            </div>
          )
        })}
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
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
            {menuTree.length > 0 && (
              <ul style={{ listStyle: 'none', marginBottom: '40px' }}>
                {menuTree.map((item) => {
                  const href = resolveMenuHref(item)
                  const isActive = pathname === href
                  const hasChildren = item.children.length > 0
                  const isExpanded = expandedMobile === item.id

                  return (
                    <li key={item.id} style={{ borderBottom: '1px solid var(--ds-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link
                          href={hasChildren ? '#' : href}
                          onClick={
                            hasChildren
                              ? (e) => {
                                  e.preventDefault()
                                  setExpandedMobile(isExpanded ? null : item.id)
                                }
                              : undefined
                          }
                          style={{
                            flex: 1,
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
                          {...(!hasChildren && item.newTab
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                        >
                          {item.label}
                        </Link>
                        {hasChildren && (
                          <button
                            onClick={() => setExpandedMobile(isExpanded ? null : item.id)}
                            aria-expanded={isExpanded}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--ink-300)',
                              padding: '8px',
                              fontSize: '16px',
                              lineHeight: 1,
                              transform: isExpanded ? 'rotate(180deg)' : 'none',
                              transition: 'transform var(--dur-base) var(--ease-out)',
                            }}
                          >
                            ↓
                          </button>
                        )}
                      </div>

                      {hasChildren && isExpanded && (
                        <ul
                          style={{
                            listStyle: 'none',
                            paddingLeft: '16px',
                            paddingBottom: '8px',
                          }}
                        >
                          {item.children.map((child) => {
                            const childHref = resolveMenuHref(child)
                            return (
                              <li key={child.id}>
                                <Link
                                  href={childHref}
                                  style={{
                                    display: 'block',
                                    padding: '10px 0',
                                    fontFamily: 'var(--font-dm-mono), monospace',
                                    fontSize: '10px',
                                    fontWeight: 400,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    color: 'var(--ink-200)',
                                    textDecoration: 'none',
                                  }}
                                  {...(child.newTab
                                    ? { target: '_blank', rel: 'noopener noreferrer' }
                                    : {})}
                                >
                                  {child.label}
                                  {child.description && (
                                    <span
                                      style={{
                                        display: 'block',
                                        fontFamily: 'var(--font-dm-serif), Georgia, serif',
                                        fontStyle: 'italic',
                                        fontSize: '11px',
                                        textTransform: 'none',
                                        letterSpacing: 0,
                                        color: 'var(--ink-300)',
                                        marginTop: '2px',
                                      }}
                                    >
                                      {child.description}
                                    </span>
                                  )}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data?.primaryCta?.link?.label && (
                <Link
                  href={resolveCtaHref(data.primaryCta.link)}
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
                  href={resolveCtaHref(data.utilityCta.link)}
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
