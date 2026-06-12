import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidateArticle } from './hooks/revalidateArticle'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

const extractText = (node: Record<string, unknown>): string => {
  if (typeof node.text === 'string') return node.text
  if (Array.isArray(node.children)) {
    return (node.children as Record<string, unknown>[]).map(extractText).join(' ')
  }
  return ''
}

const countWords = (content: unknown): number => {
  if (!content || typeof content !== 'object') return 0
  const root = (content as Record<string, unknown>).root
  if (!root || typeof root !== 'object') return 0
  const text = extractText(root as Record<string, unknown>)
  return text.trim().split(/\s+/).filter(Boolean).length
}

type TocEntry = {
  text: string
  anchor: string
  level: 'h2' | 'h3'
}

const buildToc = (content: unknown): TocEntry[] => {
  if (!content || typeof content !== 'object') return []
  const root = (content as Record<string, unknown>).root
  if (!root || typeof root !== 'object') return []
  const children = (root as Record<string, unknown>).children
  if (!Array.isArray(children)) return []

  return children.reduce<TocEntry[]>((acc, node) => {
    if (!node || typeof node !== 'object') return acc
    const n = node as Record<string, unknown>
    if (n.type === 'heading' && (n.tag === 'h2' || n.tag === 'h3')) {
      const text = Array.isArray(n.children)
        ? (n.children as { text?: string }[]).map((c) => c.text ?? '').join('')
        : ''
      const anchor = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      if (text) acc.push({ text, anchor, level: n.tag as 'h2' | 'h3' })
    }
    return acc
  }, [])
}

export const Articles: CollectionConfig<'articles'> = {
  slug: 'articles',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    excerpt: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'publishedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'articles',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'articles',
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Enter the full SEO title of the article.',
      },
    },
    {
      name: 'titleEmphasis',
      type: 'text',
      admin: {
        description: 'Enter the title text that you want to emphasise.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'heroImageAlt',
              type: 'text',
            },
            {
              name: 'heroStyle',
              type: 'select',
              options: [
                { label: 'Image', value: 'image' },
                { label: 'Gradient', value: 'gradient' },
                { label: 'Minimal', value: 'minimal' },
              ],
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
              label: false,
              required: true,
            },
            {
              name: 'readTime',
              type: 'number',
              admin: {
                disabled: true,
                description: 'Auto-calculated from content word count at ~200wpm.',
              },
              hooks: {
                beforeChange: [
                  ({ siblingData }) => {
                    const wordCount = countWords(siblingData?.content)
                    return wordCount > 0 ? Math.ceil(wordCount / 200) : undefined
                  },
                ],
              },
            },
            {
              name: 'toc',
              type: 'array',
              admin: {
                disabled: true,
                description: 'Auto-generated from h2/h3 headings in content.',
              },
              fields: [
                { name: 'text', type: 'text' },
                { name: 'anchor', type: 'text' },
                {
                  name: 'level',
                  type: 'select',
                  options: [
                    { label: 'H2', value: 'h2' },
                    { label: 'H3', value: 'h3' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'relatedArticles',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => ({
                id: {
                  not_in: [id],
                },
              }),
              hasMany: true,
              relationTo: 'articles',
            },
            {
              name: 'categories',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
            // tags relationship — pending `tags` collection
            // {
            //   name: 'tags',
            //   type: 'relationship',
            //   admin: { position: 'sidebar' },
            //   hasMany: true,
            //   relationTo: 'tags',
            // },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
        {
          label: 'AIO Snippet',
          fields: [
            {
              name: 'aioSnippet',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Key Takeaways',
                  admin: {
                    description: 'Label shown above the snippet. Defaults to "Key Takeaways".',
                  },
                },
                {
                  name: 'summary',
                  type: 'richText',
                  editor: lexicalEditor({
                    features: ({ rootFeatures }) => [
                      ...rootFeatures,
                      FixedToolbarFeature(),
                      InlineToolbarFeature(),
                    ],
                  }),
                  admin: {
                    description: 'Short summary (2–3 sentences). Bold text is supported.',
                  },
                },
                {
                  name: 'facts',
                  type: 'array',
                  maxRows: 4,
                  admin: {
                    description: 'Up to 4 key facts shown in the 2×2 grid.',
                  },
                  fields: [
                    {
                      name: 'term',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'definition',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Max 150 characters. Used on cards and as meta description fallback.',
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'authors',
    },
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'bio',
          type: 'textarea',
        },
        {
          name: 'linkedIn',
          type: 'text',
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateArticle],
    afterRead: [
      populateAuthors,
      ({ doc }) => {
        if (doc?.content) {
          doc.toc = buildToc(doc.content)
        }
        return doc
      },
    ],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
