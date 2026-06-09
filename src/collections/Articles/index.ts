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

type LexicalNode = {
  type: string
  text?: string
  tag?: string
  children?: LexicalNode[]
}

type LexicalContent = {
  root?: {
    children?: LexicalNode[]
  }
}

const extractText = (nodes: LexicalNode[]): string =>
  nodes
    .map((node) => {
      if (node.type === 'text' && node.text) return node.text
      if (node.children) return extractText(node.children)
      return ''
    })
    .join(' ')

const extractToc = (
  nodes: LexicalNode[],
): { id: string; text: string; level: string }[] => {
  const toc: { id: string; text: string; level: string }[] = []

  for (const node of nodes) {
    if (node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) {
      const text = extractText(node.children ?? [])
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      toc.push({ id, text, level: node.tag })
    }

    if (node.children) {
      toc.push(...extractToc(node.children))
    }
  }

  return toc
}

export const Articles: CollectionConfig<'articles'> = {
  slug: 'articles',
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
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
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
              },
              hooks: {
                beforeChange: [
                  ({ siblingData }) => {
                    const content = siblingData?.content as LexicalContent | undefined
                    if (!content?.root?.children) return 0
                    const text = extractText(content.root.children)
                    const words = text.trim().split(/\s+/).filter(Boolean).length
                    return Math.ceil(words / 200)
                  },
                ],
              },
            },
            {
              name: 'toc',
              type: 'array',
              admin: {
                readOnly: true,
              },
              fields: [
                { name: 'id', type: 'text' },
                { name: 'text', type: 'text' },
                { name: 'level', type: 'text' },
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
            {
              name: 'tags',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'tags',
            },
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
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
      defaultValue: false,
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
        { name: 'id', type: 'text' },
        { name: 'name', type: 'text' },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
        },
        { name: 'bio', type: 'textarea' },
        { name: 'linkedIn', type: 'text' },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateArticle],
    afterRead: [
      populateAuthors,
      ({ doc }) => {
        const content = doc?.content as LexicalContent | undefined
        if (content?.root?.children) {
          doc.toc = extractToc(content.root.children)
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
