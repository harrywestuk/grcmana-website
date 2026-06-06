import type { Block } from 'payload'

import { link } from '@/fields/link'

export const Services: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: {
    singular: 'Services',
    plural: 'Services Sections',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Eyebrow',
      admin: {
        description: 'Max 3 words, no trailing punctuation.',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'headingAccent',
      type: 'text',
      label: 'Heading accent (italic Signal yellow)',
      admin: {
        description: 'The italic Signal-yellow word or phrase in the headline.',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body copy',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Service cards',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'number',
          type: 'text',
          label: 'Number tag',
          admin: {
            description: 'e.g. "01 — Compliance"',
          },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon glyph',
          admin: {
            description: 'Unicode glyph character e.g. ⬡ ◈ ◎',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Service title',
          required: true,
        },
        {
          name: 'body',
          type: 'textarea',
          label: 'Description',
          required: true,
        },
        link({
          appearances: false,
          overrides: {
            name: 'link',
            label: 'Action link',
          },
        }),
      ],
    },
  ],
}
