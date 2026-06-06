import type { Block } from 'payload'

import { link } from '@/fields/link'

export const CommunityStrip: Block = {
  slug: 'communityStrip',
  interfaceName: 'CommunityStripBlock',
  labels: {
    singular: 'Community Strip',
    plural: 'Community Strips',
  },
  fields: [
    {
      name: 'overline',
      type: 'text',
      label: 'Overline',
      admin: {
        description: 'Small muted DM Mono label above the headline.',
      },
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Headline',
    },
    {
      name: 'headlineAccent',
      type: 'text',
      label: 'Headline accent (Signal yellow)',
      admin: {
        description: 'The Signal-yellow portion of the headline text.',
      },
    },
    {
      name: 'statValue',
      type: 'text',
      label: 'Stat value',
      admin: {
        description: 'Large display number e.g. "16k+".',
      },
    },
    {
      name: 'statLabel',
      type: 'text',
      label: 'Stat label',
      admin: {
        description: 'Small muted label below the stat value.',
      },
    },
    link({
      appearances: false,
      overrides: {
        name: 'cta',
        label: 'CTA',
      },
    }),
  ],
}
