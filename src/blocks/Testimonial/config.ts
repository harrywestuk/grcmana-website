import type { Block } from 'payload'

export const Testimonial: Block = {
  slug: 'testimonial',
  interfaceName: 'TestimonialBlock',
  labels: {
    singular: 'Testimonial',
    plural: 'Testimonials',
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      label: 'Quote',
      required: true,
      admin: {
        description: 'Full quote text. One to three sentences.',
      },
    },
    {
      name: 'boldedPhrase',
      type: 'text',
      label: 'Bolded phrase (Signal yellow)',
      admin: {
        description: 'Exact phrase from the quote to highlight in Signal yellow. Max 6 words.',
      },
    },
    {
      name: 'authorName',
      type: 'text',
      label: 'Author name',
      required: true,
    },
    {
      name: 'authorRole',
      type: 'text',
      label: 'Author role',
      required: true,
      admin: {
        description: 'e.g. "Founder & CEO, RegTech Ltd."',
      },
    },
  ],
}
