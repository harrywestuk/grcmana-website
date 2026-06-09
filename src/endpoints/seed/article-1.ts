import type { Media, Author, Category, Tag } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type ArticleArgs = {
  heroImage: Media
  blockImage: Media
  author: Author
  category: Category
  tag: Tag
}

export const article1: (args: ArticleArgs) => RequiredDataFromCollectionSlug<'articles'> = ({
  heroImage,
  blockImage,
  author,
  category,
  tag,
}) => {
  return {
    slug: 'grc-programme-from-scratch',
    _status: 'published',
    title: 'Building a GRC Programme from Scratch: A Practical Guide',
    excerpt:
      'A step-by-step guide to standing up a governance, risk, and compliance programme that scales with your business — without the enterprise overhead.',
    featured: true,
    heroImage: heroImage.id,
    heroImageAlt: 'Team reviewing a GRC framework on a whiteboard',
    heroStyle: 'image',
    authors: [author.id],
    categories: [category.id],
    tags: [tag.id],
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Why Most GRC Programmes Fail Before They Start',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Most organisations approach GRC as a checkbox exercise — buying a platform, filling in spreadsheets, and hoping an auditor never asks a difficult question. The result is a programme that satisfies no-one: too heavy for the team to maintain, too thin to survive real scrutiny.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Key Insight',
              blockType: 'banner',
              content: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 1,
                          mode: 'normal',
                          style: '',
                          text: 'A GRC programme is only as strong as the business processes it maps to.',
                          version: 1,
                        },
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: ' Start with the business, not the framework.',
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      textFormat: 0,
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                },
              },
              style: 'info',
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Step 1: Map Your Asset Inventory',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Before you can govern, you need to know what you are governing. An asset inventory is the foundation of every mature GRC programme. Without it, risk assessments are guesswork and control mapping is fiction.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'What to include in your asset register',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h3',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A useful asset register captures people, processes, systems, and data. For each asset you need an owner, a classification level, and a dependency map. Here is a minimal schema that covers ISO 27001 Annex A requirements:',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Asset Register Schema',
              blockType: 'code',
              code: `// Minimal asset register entry
type AssetEntry = {
  id: string            // Unique asset ID (e.g. AST-001)
  name: string          // Human-readable name
  type: 'system' | 'data' | 'process' | 'people'
  owner: string         // Business owner (not IT)
  classification: 'public' | 'internal' | 'confidential' | 'restricted'
  dependencies: string[]  // IDs of assets this depends on
  controls: string[]    // Control IDs mapped to this asset
  reviewedAt: Date      // Last review date
}`,
              language: 'typescript',
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Step 2: Build Your Risk Register',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'With assets mapped, you can now identify threats and assess their likelihood and impact. A simple 5x5 risk matrix is sufficient for most early-stage programmes. The goal is to surface your top ten risks and make them visible to leadership — not to boil the ocean.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: '',
              blockType: 'mediaBlock',
              media: blockImage.id,
            },
            format: '',
            version: 2,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    meta: {
      title: 'Building a GRC Programme from Scratch | GRCMANA',
      description:
        'A step-by-step practical guide to standing up a GRC programme that scales with your business — without the enterprise overhead.',
      image: heroImage.id,
    },
  }
}
