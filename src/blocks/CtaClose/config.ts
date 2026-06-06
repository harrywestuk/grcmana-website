import type { Block } from 'payload'

import { link } from '@/fields/link'

export const CtaClose: Block = {
  slug: 'ctaClose',
  interfaceName: 'CtaCloseBlock',
  labels: {
    singular: 'CTA Close',
    plural: 'CTA Close Sections',
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
      admin: {
        description: 'One or two tight lines. No padding copy.',
      },
    },
    link({
      appearances: false,
      overrides: {
        name: 'primaryCta',
        label: 'Primary CTA',
      },
    }),
    link({
      appearances: false,
      overrides: {
        name: 'secondaryCta',
        label: 'Secondary CTA',
      },
    }),
    {
      name: 'note',
      type: 'text',
      label: 'Trust note',
      admin: {
        description: 'Small muted DM Mono line below CTAs e.g. "No commitment · Fixed-fee only".',
      },
    },
  ],
}
