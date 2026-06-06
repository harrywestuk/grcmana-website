import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'group',
      label: 'Logo',
      fields: [
        {
          name: 'mark',
          type: 'text',
          label: 'Logo mark',
          defaultValue: 'GRCMANA',
          admin: {
            description: 'Primary logo text (DM Mono, uppercase).',
          },
        },
        {
          name: 'sub',
          type: 'text',
          label: 'Logo sub-line',
          defaultValue: 'Trust Architect',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo image (optional)',
          admin: {
            description: 'SVG or image logo — overrides the text mark when set.',
          },
        },
      ],
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon (optional)',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'utilityCta',
      type: 'group',
      label: 'Utility CTA (optional)',
      admin: {
        description: 'Ghost-style CTA left of the primary button.',
      },
      fields: [
        link({
          appearances: false,
          overrides: {
            name: 'link',
          },
        }),
      ],
    },
    {
      name: 'primaryCta',
      type: 'group',
      label: 'Primary CTA',
      admin: {
        description: 'Signal-filled primary CTA — e.g. "Book a Call →".',
      },
      fields: [
        link({
          appearances: false,
          overrides: {
            name: 'link',
          },
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
