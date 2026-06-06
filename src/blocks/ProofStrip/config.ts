import type { Block } from 'payload'

export const ProofStrip: Block = {
  slug: 'proofStrip',
  interfaceName: 'ProofStripBlock',
  labels: {
    singular: 'Proof Strip',
    plural: 'Proof Strips',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Section label',
      admin: {
        description: 'Small muted label above the proof items (e.g. "Founders closing enterprise deals").',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Proof items',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'client',
          type: 'text',
          label: 'Client name',
          required: true,
        },
        {
          name: 'outcome',
          type: 'textarea',
          label: 'Outcome sentence',
          required: true,
          admin: {
            description: 'One sentence, one outcome, past tense. DM Serif Display italic.',
          },
        },
      ],
    },
  ],
}
