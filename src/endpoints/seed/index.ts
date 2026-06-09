import type { CollectionSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { homeGrcmana } from './home-grcmana'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { article1 } from './article-1'

const collections: CollectionSlug[] = [
  'categories',
  'tags',
  'authors',
  'articles',
  'media',
  'menu-items',
  'pages',
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

  // Sequential to avoid FK cascade deadlocks between cross-referencing tables
  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
  }

  for (const collection of collections) {
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, previewBuffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const [image1Doc, image2Doc, previewImageDoc] = await Promise.all([
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
      data: {
        ...imageHero1,
        alt: 'GRCMANA Trust Maturity Assessment — product preview placeholder',
      },
      file: previewBuffer,
    }),
  ])

  payload.logger.info(`— Seeding categories...`)

  for (const category of categories) {
    await payload.create({
      collection: 'categories',
      data: { title: category, slug: category.toLowerCase() },
    })
  }

  const seedCategory = await payload.create({
    collection: 'categories',
    data: {
      title: 'GRC',
      slug: 'grc',
      description: 'Governance, Risk & Compliance guidance and frameworks.',
    },
  })

  payload.logger.info(`— Seeding tags...`)

  const seedTag = await payload.create({
    collection: 'tags',
    data: { title: 'Getting Started', slug: 'getting-started' },
  })

  payload.logger.info(`— Seeding authors...`)

  const seedAuthor = await payload.create({
    collection: 'authors',
    depth: 0,
    context: { disableRevalidate: true },
    data: {
      _status: 'published',
      name: 'Harry West',
      slug: 'harry-west',
      role: 'Founder & Trust Architect',
      bio: 'Harry helps high-growth B2B tech startups close the Enterprise Trust Gap through security, governance, and AI resilience.',
      linkedIn: 'https://www.linkedin.com/in/harrywestuk/',
    },
  })

  payload.logger.info(`— Seeding articles...`)

  await payload.create({
    collection: 'articles',
    depth: 0,
    context: { disableRevalidate: true },
    data: article1({
      heroImage: image1Doc,
      blockImage: image2Doc,
      author: seedAuthor,
      category: seedCategory,
      tag: seedTag,
    }),
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

  payload.logger.info(`— Seeding menu items...`)

  // Top-level root items
  const [solutionsItem, vaultItem, companyItem] = await Promise.all([
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'Solutions',
        linkType: 'custom',
        url: '/solutions',
        megaPanel: true,
        order: 1,
        column: 1,
      },
      context: { disableRevalidate: true },
    }),
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'Vault',
        linkType: 'custom',
        url: '/vault',
        megaPanel: true,
        order: 2,
        column: 1,
      },
      context: { disableRevalidate: true },
    }),
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'Company',
        linkType: 'custom',
        url: '/company',
        megaPanel: true,
        order: 3,
        column: 1,
      },
      context: { disableRevalidate: true },
    }),
  ])

  // Solutions children
  await Promise.all([
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'Enterprise GRC',
        description: 'Done-for-you strategic GTM & governance',
        linkType: 'custom',
        url: '/solutions/tofo-01',
        parent: solutionsItem.id,
        order: 1,
        column: 1,
      },
      context: { disableRevalidate: true },
    }),
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'ISO Certification Sprint',
        description: 'High-intent implementation — 90-day delivery',
        linkType: 'custom',
        url: '/solutions/tofo-02',
        parent: solutionsItem.id,
        order: 2,
        column: 1,
      },
      context: { disableRevalidate: true },
    }),
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'AI Governance',
        description: 'ISO 42001 & EU AI Act readiness',
        linkType: 'custom',
        url: '/solutions/tofo-03',
        parent: solutionsItem.id,
        order: 3,
        column: 1,
      },
      context: { disableRevalidate: true },
    }),
  ])

  // Vault children
  await Promise.all([
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'Templates',
        description: 'Freemium GRC asset library',
        linkType: 'custom',
        url: '/vault/templates',
        parent: vaultItem.id,
        order: 1,
        column: 1,
      },
      context: { disableRevalidate: true },
    }),
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'GRC Fundamentals',
        description: 'Evergreen GRC guides',
        linkType: 'custom',
        url: '/vault/grc',
        parent: vaultItem.id,
        order: 2,
        column: 1,
      },
      context: { disableRevalidate: true },
    }),
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'ISO 27001',
        description: 'Certification guides & checklists',
        linkType: 'custom',
        url: '/vault/iso-27001',
        parent: vaultItem.id,
        order: 3,
        column: 2,
      },
      context: { disableRevalidate: true },
    }),
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'SOC 2',
        description: 'Readiness frameworks & templates',
        linkType: 'custom',
        url: '/vault/soc-2',
        parent: vaultItem.id,
        order: 4,
        column: 2,
      },
      context: { disableRevalidate: true },
    }),
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'Blog',
        description: 'Current insights & news',
        linkType: 'custom',
        url: '/vault/blog',
        parent: vaultItem.id,
        order: 5,
        column: 2,
      },
      context: { disableRevalidate: true },
    }),
  ])

  // Company children
  await Promise.all([
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'About',
        description: 'Our mission and team',
        linkType: 'custom',
        url: '/company/about',
        parent: companyItem.id,
        order: 1,
        column: 1,
      },
      context: { disableRevalidate: true },
    }),
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'Careers',
        description: 'Associates & open roles',
        linkType: 'custom',
        url: '/company/careers',
        parent: companyItem.id,
        order: 2,
        column: 1,
      },
      context: { disableRevalidate: true },
    }),
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'Partners',
        description: 'Partnerships & alliances',
        linkType: 'custom',
        url: '/company/partners',
        parent: companyItem.id,
        order: 3,
        column: 1,
      },
      context: { disableRevalidate: true },
    }),
    payload.create({
      collection: 'menu-items',
      data: {
        label: 'Trust Centre',
        description: 'Security posture & certifications',
        linkType: 'custom',
        url: 'https://trust.grcmana.io',
        newTab: true,
        parent: companyItem.id,
        order: 4,
        column: 1,
      },
      context: { disableRevalidate: true },
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
      topLevelNav: [solutionsItem.id, vaultItem.id, companyItem.id],
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
