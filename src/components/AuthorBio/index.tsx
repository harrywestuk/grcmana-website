import React from 'react'
import Link from 'next/link'

import type { Media } from '@/payload-types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { Media as MediaComponent } from '@/components/Media'
import RichText from '@/components/RichText'

type AuthorCredential = {
  id?: string | null
  title?: string | null
  issuer?: string | null
  year?: number | null
  verificationUrl?: string | null
  verificationPlatform?: 'credly' | 'issuer' | 'other' | null
}

type AuthorOrganisation = {
  id?: string | null
  name?: string | null
  role?: string | null
  url?: string | null
}

type AuthorExpertise = {
  id?: string | null
  value?: string | null
}

type SocialLinks = {
  linkedIn?: string | null
  twitter?: string | null
  github?: string | null
  website?: string | null
  youtube?: string | null
  medium?: string | null
  facebook?: string | null
  instagram?: string | null
  pinterest?: string | null
  tiktok?: string | null
}

export type AuthorData = SocialLinks & {
  id?: string | null
  name?: string | null
  slug?: string | null
  role?: string | null
  avatar?: Media | number | null
  bio?: string | null
  bioExtended?: DefaultTypedEditorState | null
  credentials?: AuthorCredential[] | null
  expertise?: AuthorExpertise[] | null
  yearsExperience?: number | null
  organisations?: AuthorOrganisation[] | null
}

export type AuthorBioProps = {
  author: AuthorData
  variant: 'byline' | 'full'
}

const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  linkedIn: 'LinkedIn',
  twitter: 'X / Twitter',
  github: 'GitHub',
  website: 'Website',
  youtube: 'YouTube',
  medium: 'Medium',
  facebook: 'Facebook',
  instagram: 'Instagram',
  pinterest: 'Pinterest',
  tiktok: 'TikTok',
}

export const AuthorBio: React.FC<AuthorBioProps> = ({ author, variant }) => {
  const {
    name,
    slug,
    role,
    avatar,
    bio,
    bioExtended,
    credentials,
    expertise,
    yearsExperience,
    organisations,
    linkedIn,
    twitter,
    github,
    website,
    youtube,
    medium,
    facebook,
    instagram,
    pinterest,
    tiktok,
  } = author

  const hasAvatar = avatar && typeof avatar !== 'number'

  const socialLinks: { key: keyof SocialLinks; href: string }[] = (
    [
      { key: 'linkedIn' as const, href: linkedIn },
      { key: 'twitter' as const, href: twitter },
      { key: 'github' as const, href: github },
      { key: 'website' as const, href: website },
      { key: 'youtube' as const, href: youtube },
      { key: 'medium' as const, href: medium },
      { key: 'facebook' as const, href: facebook },
      { key: 'instagram' as const, href: instagram },
      { key: 'pinterest' as const, href: pinterest },
      { key: 'tiktok' as const, href: tiktok },
    ] as { key: keyof SocialLinks; href: string | null | undefined }[]
  ).filter((s): s is { key: keyof SocialLinks; href: string } => !!s.href)

  if (variant === 'byline') {
    return (
      <div className="author-bio author-bio--byline">
        {hasAvatar && (
          <div className="author-bio__avatar author-bio__avatar--sm">
            <MediaComponent
              resource={avatar as Media}
              imgClassName="object-cover"
              style={{ width: 48, height: 48 }}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
            {name && (
              slug ? (
                <Link
                  href={`/authors/${slug}`}
                  className="author-bio__name"
                  style={{ textDecoration: 'none' }}
                >
                  {name}
                </Link>
              ) : (
                <span className="author-bio__name">{name}</span>
              )
            )}
            {role && <span className="author-bio__role">{role}</span>}
          </div>

          {bio && <p className="author-bio__bio">{bio}</p>}

          {credentials && credentials.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {credentials.map((cred) =>
                cred.title ? (
                  cred.verificationUrl ? (
                    <a
                      key={cred.id ?? cred.title}
                      href={cred.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="author-bio__cred-badge"
                    >
                      {cred.title}
                    </a>
                  ) : (
                    <span key={cred.id ?? cred.title} className="author-bio__cred-badge">
                      {cred.title}
                    </span>
                  )
                ) : null,
              )}
            </div>
          )}

          {linkedIn && (
            <Link
              href={linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="author-bio__social-link"
              style={{ marginTop: '4px' }}
            >
              LinkedIn ↗
            </Link>
          )}
        </div>
      </div>
    )
  }

  // ── full variant ──────────────────────────────────────────────
  return (
    <div className="author-bio" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header row — avatar + name/role */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        {hasAvatar && (
          <div className="author-bio__avatar author-bio__avatar--lg">
            <MediaComponent
              resource={avatar as Media}
              imgClassName="object-cover"
              style={{ width: 80, height: 80 }}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {name && (
            <span className="author-bio__name" style={{ fontSize: '20px' }}>
              {name}
            </span>
          )}
          {role && <span className="author-bio__role">{role}</span>}
          {yearsExperience && (
            <span
              style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '9px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink-300)',
              }}
            >
              {yearsExperience} years experience
            </span>
          )}
        </div>
      </div>

      {/* Short bio */}
      {bio && <p className="author-bio__bio" style={{ margin: 0 }}>{bio}</p>}

      {/* Extended bio (rich text) */}
      {bioExtended && (
        <RichText data={bioExtended} enableGutter={false} enableProse />
      )}

      {/* Expertise tags */}
      {expertise && expertise.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span className="author-bio__role">Expertise</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {expertise.map((tag) =>
              tag.value ? (
                <span key={tag.id ?? tag.value} className="author-bio__cred-badge">
                  {tag.value}
                </span>
              ) : null,
            )}
          </div>
        </div>
      )}

      {/* Full credentials */}
      {credentials && credentials.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span className="author-bio__role">Credentials</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {credentials.map((cred) => {
              if (!cred.title) return null
              const isCredly = cred.verificationPlatform === 'credly'
              return (
                <div
                  key={cred.id ?? cred.title}
                  style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-syne), system-ui, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--ink-100)',
                    }}
                  >
                    {cred.title}
                  </span>
                  {cred.issuer && (
                    <span
                      style={{
                        fontFamily: 'var(--font-dm-mono), monospace',
                        fontSize: '9px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--ink-300)',
                      }}
                    >
                      {cred.issuer}
                      {cred.year ? ` · ${cred.year}` : ''}
                    </span>
                  )}
                  {cred.verificationUrl && (
                    <a
                      href={cred.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="author-bio__cred-badge"
                      style={{
                        ...(isCredly && {
                          borderColor: 'var(--ds-border-signal)',
                          color: 'var(--signal-500)',
                        }),
                      }}
                    >
                      {isCredly ? 'Verified on Credly ↗' : 'Verify ↗'}
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Organisations */}
      {organisations && organisations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span className="author-bio__role">Experience</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {organisations.map((org) => (
              <div key={org.id ?? org.name} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'baseline' }}>
                {org.url ? (
                  <a
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-syne), system-ui, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--ink-100)',
                      textDecoration: 'none',
                    }}
                  >
                    {org.name} ↗
                  </a>
                ) : (
                  <span
                    style={{
                      fontFamily: 'var(--font-syne), system-ui, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--ink-100)',
                    }}
                  >
                    {org.name}
                  </span>
                )}
                {org.role && (
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-mono), monospace',
                      fontSize: '9px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-300)',
                    }}
                  >
                    {org.role}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Social links */}
      {socialLinks.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {socialLinks.map(({ key, href }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="author-bio__social-link"
            >
              {SOCIAL_LABELS[key]} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
