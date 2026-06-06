import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

type HomeGrcmanaArgs = {
  previewImage: Media
  metaImage: Media
}

export const homeGrcmana: (
  args: HomeGrcmanaArgs,
) => RequiredDataFromCollectionSlug<'pages'> = ({ previewImage, metaImage }) => {
  return {
    slug: 'home',
    _status: 'published',
    title: 'GRCMANA — Close the Enterprise Trust Gap',
    hero: {
      type: 'grcmana',
      eyebrow: 'Trust Architect · GRCMANA',
      heading: 'Close the Enterprise',
      headingAccent: 'Trust Gap.',
      body: 'We help high-growth B2B tech startups turn security, governance, and resilience from a deal blocker into the reason enterprise contracts get signed.',
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'default',
            label: 'Book a Discovery Call →',
            url: '/contact',
          },
        },
        {
          link: {
            type: 'custom',
            appearance: 'outline',
            label: 'See the Framework',
            url: '/framework',
          },
        },
      ],
      trustBadges: [
        { label: 'ISO 27001' },
        { label: 'ISO 42001' },
        { label: 'ISO 9001' },
        { label: 'Cyber Essentials' },
        { label: 'EU AI Act Ready' },
        { label: 'NIST AI RMF' },
      ],
    },
    layout: [
      {
        blockName: 'Proof Strip',
        blockType: 'proofStrip',
        label: 'Founders closing enterprise deals',
        items: [
          {
            client: 'Fintech Co.',
            outcome:
              'Closed a £400k ARR enterprise deal within six weeks of ISO 27001 certification.',
          },
          {
            client: 'RegTech Ltd.',
            outcome:
              'Moved from shortlisted to preferred vendor after a single AI governance assessment.',
          },
          {
            client: 'DataCo AI',
            outcome:
              'Passed a Tier 1 bank security review on first submission — zero remediation required.',
          },
        ],
      },
      {
        blockName: 'Services',
        blockType: 'services',
        eyebrow: 'Services',
        heading: 'GRC built for founders',
        headingAccent: 'who need to move.',
        body: 'Fixed-fee, founder-facing. No bloated retainers, no complexity theatre. Certification when you need it, governance that holds up to enterprise scrutiny.',
        items: [
          {
            number: '01 — Compliance',
            icon: '⬡',
            title: 'ISO Certification',
            body: '27001, 42001, and 9001 — full certification in as few as six weeks. We build the system, run the audit, and hand you a certificate your enterprise buyers will accept without question.',
            link: {
              type: 'custom',
              label: 'Explore',
              url: '/services/iso-certification',
            },
          },
          {
            number: '02 — Governance',
            icon: '◈',
            title: 'AI Governance',
            body: 'ISO 42001, EU AI Act readiness, NIST AI RMF mapping, and Shadow AI management — structured for the pace of a startup, credible enough for a regulated enterprise buyer.',
            link: {
              type: 'custom',
              label: 'Explore',
              url: '/services/ai-governance',
            },
          },
          {
            number: '03 — Resilience',
            icon: '◎',
            title: 'CISO-as-a-Service',
            body: 'A Global CISO on your team without the hire. Board-level reporting, enterprise security reviews, vendor assessments, and incident response — at a fraction of the in-house cost.',
            link: {
              type: 'custom',
              label: 'Explore',
              url: '/services/ciso-as-a-service',
            },
          },
        ],
      },
      {
        blockName: 'Trust Architecture Framework',
        blockType: 'framework',
        eyebrow: 'The Trust Architecture Framework',
        heading: 'Six phases from',
        headingAccent: 'exposed to trusted.',
        body: 'A structured path through every stage of security and governance maturity — built for startups that need to move fast and hold up to enterprise scrutiny.',
        phases: [
          {
            number: 'Phase 01',
            label: 'Define',
            description:
              'Map your risk landscape and set the baseline. Know where you are before you move.',
            isActive: true,
          },
          {
            number: 'Phase 02',
            label: 'Build',
            description:
              'Architect the controls, policies, and evidence framework that certification demands.',
            isActive: false,
          },
          {
            number: 'Phase 03',
            label: 'Embed',
            description:
              'Make governance a team behaviour, not a compliance exercise. Culture over checkbox.',
            isActive: false,
          },
          {
            number: 'Phase 04',
            label: 'Validate',
            description:
              'Audit-ready evidence, third-party validation, and certification submission.',
            isActive: false,
          },
          {
            number: 'Phase 05',
            label: 'Scale',
            description:
              'Expand coverage as you grow — new frameworks, new markets, new buyer requirements.',
            isActive: false,
          },
          {
            number: 'Phase 06',
            label: 'Evolve',
            description:
              'Continuous improvement and horizon scanning so trust stays ahead of the threat.',
            isActive: false,
          },
        ],
      },
      {
        blockName: 'Metrics Band',
        blockType: 'metricsBand',
        metrics: [
          {
            value: '73%',
            qualifier: 'of enterprise buyers',
            description:
              'require vendor security certification before commercial contracts proceed to legal review.',
          },
          {
            value: '6wk',
            qualifier: 'Median certification time',
            description:
              'From engagement to ISO 27001 certificate in hand — faster than any comparable consultancy.',
          },
          {
            value: '£2.8M',
            qualifier: 'Avg deal value unlocked',
            description:
              'Enterprise contract value enabled directly by Trust Architecture engagements across our client base.',
          },
        ],
      },
      {
        blockName: 'Testimonial',
        blockType: 'testimonial',
        quote:
          "We'd been stuck on the enterprise shortlist for three months. GRCMANA got us through ISO 27001 in six weeks and we closed the deal the month after. It wasn't paperwork — it was a commercial unlock.",
        boldedPhrase: 'closed the deal the month after.',
        authorName: 'James Whitfield',
        authorRole: 'Founder & CEO, RegTech Ltd.',
      },
      {
        blockName: 'Product Preview',
        blockType: 'productPreview',
        eyebrow: 'Trust Maturity Model',
        heading: 'See exactly',
        headingAccent: 'where you stand.',
        body: 'The Trust Maturity Assessment gives you a scored baseline across every domain so you know what to fix, in what order, before an enterprise buyer asks.',
        previewImage: previewImage.id,
      },
      {
        blockName: 'Community Strip',
        blockType: 'communityStrip',
        overline: 'The Trust Collective',
        headline: 'Join a community of founders building',
        headlineAccent: 'enterprise-grade trust',
        statValue: '16k+',
        statLabel: 'Members · Cyber Resilience Network',
        cta: {
          type: 'custom',
          label: 'Join the Collective →',
          url: '/community',
        },
      },
      {
        blockName: 'CTA Close',
        blockType: 'ctaClose',
        eyebrow: 'Ready when you are',
        heading: 'Stop losing deals to',
        headingAccent: 'trust deficits.',
        body: "Book a free 30-minute Discovery Call. We'll identify your biggest trust gap and map a clear path to your first certification.",
        primaryCta: {
          type: 'custom',
          label: 'Book a Discovery Call →',
          url: '/contact',
        },
        secondaryCta: {
          type: 'custom',
          label: 'Download the GRC Playbook',
          url: '/resources/grc-playbook',
        },
        note: 'No commitment · Response within 24 hours · Fixed-fee only',
      },
    ],
    meta: {
      description:
        'GRCMANA helps high-growth B2B tech startups close the Enterprise Trust Gap through security, governance, and AI resilience.',
      image: metaImage.id,
      title: 'GRCMANA — Close the Enterprise Trust Gap',
    },
  }
}
