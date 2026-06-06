import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'brand',
      type: 'group',
      label: 'Brand',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Brand name',
          defaultValue: 'GRCMANA',
        },
        {
          name: 'sub',
          type: 'text',
          label: 'Brand sub-line',
          defaultValue: 'Part of The Mana Consortium',
        },
        {
          name: 'tagline',
          type: 'textarea',
          label: 'Tagline',
          admin: {
            description: 'Short description paragraph below the brand name.',
          },
        },
        {
          name: 'certBadges',
          type: 'array',
          label: 'Certification badges',
          admin: {
            description: 'Outlined cert badges e.g. "ISO 27001", "Cyber Essentials".',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Link columns',
      maxRows: 6,
      admin: {
        description: 'Footer navigation columns (e.g. Solutions, Framework, Resources, Company).',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Column heading',
          required: true,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright line',
      defaultValue: '© 2025 GRCMANA · Part of The Mana Consortium · All rights reserved',
    },
    {
      name: 'registration',
      type: 'text',
      label: 'Registration text',
      defaultValue: 'Registered in England & Wales',
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
