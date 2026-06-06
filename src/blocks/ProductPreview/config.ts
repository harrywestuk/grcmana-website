import type { Block } from 'payload'

export const ProductPreview: Block = {
  slug: 'productPreview',
  interfaceName: 'ProductPreviewBlock',
  labels: {
    singular: 'Product Preview',
    plural: 'Product Previews',
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
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body copy',
    },
    {
      name: 'previewImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Preview image',
      required: true,
      admin: {
        description: 'Screenshot or dashboard image shown inside the chrome-bar card.',
      },
    },
  ],
}
