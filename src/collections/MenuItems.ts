import type { CollectionConfig } from 'payload'
import { revalidateTag } from 'next/cache'

export const MenuItems: CollectionConfig = {
  slug: 'menu-items',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'parent', 'order', 'column'],
    description: 'Navigation items for the site mega menu. Create items here, then assign top-level items to the Header global.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: 'Label',
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      admin: {
        description: 'Short descriptor shown beneath the label in the mega menu panel (optional).',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'linkType',
          type: 'radio',
          label: 'Link type',
          options: [
            { label: 'Internal page', value: 'internal' },
            { label: 'Custom URL', value: 'custom' },
          ],
          defaultValue: 'custom',
          admin: {
            layout: 'horizontal',
            width: '50%',
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          admin: {
            width: '50%',
            style: { alignSelf: 'flex-end' },
          },
        },
      ],
    },
    {
      name: 'reference',
      type: 'relationship',
      relationTo: ['pages', 'posts'],
      label: 'Page / Post',
      admin: {
        condition: (_, siblingData) => siblingData?.linkType === 'internal',
      },
      required: true,
      validate: (
        value: unknown,
        { siblingData }: { siblingData?: Record<string, unknown> },
      ): true | string => {
        if (siblingData?.linkType === 'internal' && !value) return 'This field is required.'
        return true
      },
    },
    {
      name: 'url',
      type: 'text',
      label: 'Custom URL',
      admin: {
        condition: (_, siblingData) => siblingData?.linkType === 'custom',
        description: 'Absolute URL (https://…) or relative path (/solutions).',
      },
      required: true,
      validate: (
        value: unknown,
        { siblingData }: { siblingData?: Record<string, unknown> },
      ): true | string => {
        if (siblingData?.linkType === 'custom' && !value) return 'This field is required.'
        return true
      },
    },
    {
      name: 'megaPanel',
      type: 'checkbox',
      label: 'Opens mega panel',
      defaultValue: false,
      admin: {
        description: 'Hovering this root-level item opens a full-width dropdown panel instead of navigating directly. Only applies to items with no parent.',
      },
    },
    {
      name: 'columnMeta',
      type: 'array',
      label: 'Column headings (optional)',
      admin: {
        description: 'Add a heading (and optional sub-text) for each column in the mega panel. Match the Column number to the one set on child items.',
        condition: (data) => Boolean(data?.megaPanel),
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'columnNumber',
              type: 'number',
              label: 'Column',
              required: true,
              admin: {
                width: '25%',
                description: 'Matches the Column field on child items.',
              },
            },
            {
              name: 'heading',
              type: 'text',
              label: 'Heading',
              required: true,
              admin: {
                width: '75%',
              },
            },
          ],
        },
        {
          name: 'subText',
          type: 'text',
          label: 'Sub-text (optional)',
          admin: {
            description: 'Short descriptor shown beneath the column heading.',
          },
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Panel CTA bar (optional)',
      admin: {
        description: 'Full-width strip shown at the bottom of the mega panel — e.g. "View All Solutions →".',
        condition: (data) => Boolean(data?.megaPanel),
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'CTA label',
          admin: {
            description: 'Button text, e.g. "View All Solutions →"',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'linkType',
              type: 'radio',
              label: 'Link type',
              options: [
                { label: 'Internal page', value: 'internal' },
                { label: 'Custom URL', value: 'custom' },
              ],
              defaultValue: 'custom',
              admin: {
                layout: 'horizontal',
                width: '50%',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in new tab',
              admin: {
                width: '50%',
                style: { alignSelf: 'flex-end' },
              },
            },
          ],
        },
        {
          name: 'reference',
          type: 'relationship',
          relationTo: ['pages', 'posts'],
          label: 'Page / Post',
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'internal',
          },
          validate: (
            value: unknown,
            { siblingData }: { siblingData?: Record<string, unknown> },
          ): true | string => {
            if (siblingData?.linkType === 'internal' && !value) return 'This field is required.'
            return true
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Custom URL',
          admin: {
            condition: (_, siblingData) => siblingData?.linkType === 'custom',
            description: 'Absolute URL (https://…) or relative path (/solutions).',
          },
          validate: (
            value: unknown,
            { siblingData }: { siblingData?: Record<string, unknown> },
          ): true | string => {
            if (siblingData?.linkType === 'custom' && !value) return 'This field is required.'
            return true
          },
        },
      ],
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'menu-items',
      label: 'Parent item',
      admin: {
        description: 'Leave blank for top-level items.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'order',
          type: 'number',
          label: 'Order',
          defaultValue: 0,
          admin: {
            width: '50%',
            description: 'Sort position among siblings (lower = first).',
          },
        },
        {
          name: 'column',
          type: 'number',
          label: 'Column',
          defaultValue: 1,
          admin: {
            width: '50%',
            description: 'Which column within the mega panel this item appears in.',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ req: { payload }, context }) => {
        if (!context.disableRevalidate) {
          payload.logger.info('Revalidating header (menu-item changed)')
          revalidateTag('global_header', 'max')
        }
      },
    ],
    afterDelete: [
      ({ req: { payload } }) => {
        payload.logger.info('Revalidating header (menu-item deleted)')
        revalidateTag('global_header', 'max')
      },
    ],
  },
}
