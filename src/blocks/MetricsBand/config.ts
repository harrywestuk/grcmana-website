import type { Block } from 'payload'

export const MetricsBand: Block = {
  slug: 'metricsBand',
  interfaceName: 'MetricsBandBlock',
  labels: {
    singular: 'Metrics Band',
    plural: 'Metrics Bands',
  },
  fields: [
    {
      name: 'metrics',
      type: 'array',
      label: 'Metrics',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Metric value',
          required: true,
          admin: {
            description: 'Large display number e.g. "73%", "6wk", "£2.8M".',
          },
        },
        {
          name: 'qualifier',
          type: 'text',
          label: 'Qualifier',
          admin: {
            description: 'Short DM Mono label below the value.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          admin: {
            description: 'Supporting sentence explaining the metric.',
          },
        },
      ],
    },
  ],
}
