import type { Block } from 'payload'

export const Framework: Block = {
  slug: 'framework',
  interfaceName: 'FrameworkBlock',
  labels: {
    singular: 'Framework',
    plural: 'Framework Sections',
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
      name: 'phases',
      type: 'array',
      label: 'Phases',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'number',
          type: 'text',
          label: 'Phase number label',
          admin: {
            description: 'e.g. "Phase 01"',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Phase name',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'isActive',
          type: 'checkbox',
          label: 'Active phase',
          defaultValue: false,
          admin: {
            description: 'Highlights this phase in Signal yellow.',
          },
        },
      ],
    },
  ],
}
