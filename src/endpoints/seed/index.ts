import type { CollectionSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { homeGrcmana } from './home-grcmana'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
]

const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  payload.logger.info(`— Clearing collections...`)

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, image3Buffer, previewBuffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const [demoAuthor, image1Doc, image2Doc, image3Doc, previewImageDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: {
        ...imageHero1,
        alt: 'GRCMANA Trust Maturity Assessment — product preview placeholder',
      },
      file: previewBuffer,
    }),
    categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  ])

  payload.logger.info(`— Seeding posts...`)

  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: { relatedPosts: [post2Doc.id, post3Doc.id] },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: { relatedPosts: [post1Doc.id, post3Doc.id] },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: { relatedPosts: [post1Doc.id, post2Doc.id] },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  const [, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: homeGrcmana({ previewImage: previewImageDoc, metaImage: image1Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      context: {
        disableRevalidate: true,
      },
      data: contactPageData({ contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding header global...`)

  await payload.updateGlobal({
    slug: 'header',
    data: {
      logo: {
        mark: 'GRCMANA',
        sub: 'Trust Architect',
      },
      navItems: [
        { link: { type: 'custom', label: 'Solutions', url: '/solutions' } },
        { link: { type: 'custom', label: 'Services', url: '/services' } },
        { link: { type: 'custom', label: 'Framework', url: '/framework' } },
        { link: { type: 'custom', label: 'Resources', url: '/resources' } },
        {
          link: {
            type: 'reference',
            label: 'About',
            reference: { relationTo: 'pages', value: contactPage.id },
          },
        },
      ],
      utilityCta: {
        link: {
          type: 'custom',
          label: 'Ask the Trust Architect',
          url: '/ask',
        },
      },
      primaryCta: {
        link: {
          type: 'custom',
          label: 'Book a Call →',
          url: '/contact',
        },
      },
    },
  })

  payload.logger.info(`— Seeding footer global...`)

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      brand: {
        name: 'GRCMANA',
        sub: 'Part of The Mana Consortium',
        tagline:
          'Helping high-growth B2B tech startups close the Enterprise Trust Gap through security, governance, and AI resilience.',
        certBadges: [
          { label: 'ISO 27001' },
          { label: 'ISO 42001' },
          { label: 'ISO 9001' },
          { label: 'Cyber Essentials' },
          { label: 'EU AI Act Ready' },
          { label: 'NIST AI RMF' },
        ],
      },
      columns: [
        {
          heading: 'Solutions',
          links: [
            { link: { type: 'custom', label: 'ISO Certification', url: '/solutions/iso-certification' } },
            { link: { type: 'custom', label: 'AI Governance', url: '/solutions/ai-governance' } },
            { link: { type: 'custom', label: 'CISO-as-a-Service', url: '/solutions/ciso' } },
            { link: { type: 'custom', label: 'GRC Retainer', url: '/solutions/grc-retainer' } },
            { link: { type: 'custom', label: 'Trust Centre', url: '/trust-centre' } },
          ],
        },
        {
          heading: 'Framework',
          links: [
            { link: { type: 'custom', label: 'Trust Architecture', url: '/framework' } },
            { link: { type: 'custom', label: 'Trust Maturity Model', url: '/framework/maturity-model' } },
            { link: { type: 'custom', label: 'Enterprise Trust Gap', url: '/framework/trust-gap' } },
            { link: { type: 'custom', label: 'AI Risk Register', url: '/framework/ai-risk-register' } },
          ],
        },
        {
          heading: 'Resources',
          links: [
            { link: { type: 'custom', label: 'GRC Playbook', url: '/resources/grc-playbook' } },
            { link: { type: 'custom', label: 'The Trust Collective', url: '/community' } },
            { link: { type: 'custom', label: 'Blog', url: '/blog' } },
            { link: { type: 'custom', label: 'Case Studies', url: '/case-studies' } },
            { link: { type: 'custom', label: 'Cyber Resilience Network', url: '/community/network' } },
          ],
        },
        {
          heading: 'Company',
          links: [
            { link: { type: 'custom', label: 'About GRCMANA', url: '/about' } },
            { link: { type: 'custom', label: 'Harry — Trust Architect', url: '/about/harry' } },
            { link: { type: 'custom', label: 'Contact', url: '/contact' } },
            { link: { type: 'custom', label: 'The Mana Consortium', url: '/consortium', newTab: true } },
            { link: { type: 'custom', label: 'Privacy Policy', url: '/privacy' } },
          ],
        },
      ],
      copyright: '© 2025 GRCMANA · Part of The Mana Consortium · All rights reserved',
      registration: 'Registered in England & Wales',
    },
  })

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}
