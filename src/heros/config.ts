import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        { label: 'None', value: 'none' },
        { label: 'GRCMANA Hero', value: 'grcmana' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
      ],
      required: true,
    },
    // ── GRCMANA Hero fields ──────────────────────────────────
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      admin: {
        condition: (_, { type } = {}) => type === 'grcmana',
        description: 'Short label above the headline. Max 3 words, no trailing punctuation.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      admin: {
        condition: (_, { type } = {}) => type === 'grcmana',
      },
    },
    {
      name: 'headingAccent',
      type: 'text',
      label: 'Heading accent (italic Signal yellow)',
      admin: {
        condition: (_, { type } = {}) => type === 'grcmana',
        description: 'Italic Signal-yellow phrase on the second line of the headline.',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body copy',
      admin: {
        condition: (_, { type } = {}) => type === 'grcmana',
      },
    },
    {
      name: 'trustBadges',
      type: 'array',
      label: 'Trust badges',
      admin: {
        condition: (_, { type } = {}) => type === 'grcmana',
        description: 'Certification labels shown below the CTAs.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
    },
    // ── Shared fields (non-grcmana hero types) ───────────────
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
      admin: {
        condition: (_, { type } = {}) =>
          ['highImpact', 'mediumImpact', 'lowImpact'].includes(type),
      },
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
  ],
  label: false,
}
