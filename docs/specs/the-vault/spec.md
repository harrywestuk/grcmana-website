# Multi-Framework Vault Engine — Implementation Specification

**feature:** multi-framework-vault  
**branch:** feat/multi-framework-vault  
**status:** approved-spec  
**version:** 2.2 · June 2026  
**supersedes:** v1.0 (June 2026)

> **Source architecture:** Dynamic Hub & Spoke Paradigm  
> **Upstream dependencies:** Next.js (App Router) · PayloadCMS 3.x · Lexical Editor Core · Postgres (Drizzle ORM)

---

## Changelog

**v2.2** — frameworks collection content field

| #   | Change                                                                     | Reason                                                          |
| --- | -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| 9   | `hubDescription` (textarea) replaced with `hubContent` (Lexical rich text) | Hub page is an editorial landing page — plain text insufficient |

**v2.1** — Open questions resolved

| #   | Change                                                              | Reason                                                           |
| --- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 5   | `vault` versions/drafts config added (Section 7)                    | Confirmed required — matches `articles` collection behaviour     |
| 6   | `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` env var documented (Section 8)      | Not yet in `.env` — must be added before HubSpot component build |
| 7   | `grc-hub/iso-27001/8-28-*` added to 301 redirect list (Section 9.2) | Confirmed legacy path requiring redirect                         |
| 8   | `resources/frameworks/*` deferred — no redirects (Section 9.6)      | Value in new model undecided. Remains on Webflow                 |

**v2.0** — Architectural fixes from spec review

| #   | Change                                                           | Reason                                                                             |
| --- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | Vault slug uniqueness scoped per framework, not globally         | Global uniqueness blocks valid duplicate slugs across frameworks                   |
| 2   | `sortOrder` (integer) field added. `controlMapping` sort removed | String sort on values like `Annex A.5.1`, `A.5.10` produces wrong order            |
| 3   | HubSpot client boundary explicitly defined                       | HubSpot embed scripts require a Client Component — RSC cannot inject them directly |
| 4   | Discrete collections architecture superseded                     | See Architecture Decision below                                                    |

---

## Architecture Decision: Single Vault Collection

> **Supersedes:** the discrete-collections-per-framework pattern referenced in `articles.md` (`iso-27001`, `soc-2` as separate collections extending `vaultBaseFields`).

**Decision:** All vault content lives in a **single `vault` collection**, related to a `frameworks` collection via a required relationship field.

**Rationale:**

The discrete collections model was authored when 2–3 frameworks were in scope. The vault roadmap now targets **15+ frameworks**. At that scale, discrete collections produce:

- 15+ collection config files to maintain
- Duplicated hooks, admin config, and revalidation logic per framework
- Fragmented admin UI
- Blocked AI pipeline queries (RAG must query across a single surface)

The single `vault` collection eliminates all of the above. The `vaultBaseFields` concept is preserved — it becomes the field definition of this single collection rather than a shared layer across many.

**Impact on `articles.md`:** The line referencing discrete vault collections must be updated to reflect this decision. The `articles` collection remains unchanged and continues to serve `/blog`.

---

## Goal

Implement a highly scalable, performant, and decoupled content delivery framework for domain-specific compliance standards (e.g., ISO 27001, SOC 2).

This system completely isolates technical compliance guides from the general marketing blog, enforces a strict 2-click maximum hierarchy to maximise topical authority, and automates new framework expansions via relational taxonomy — allowing 15+ standards with 100+ articles each to deploy dynamically without schema fragmentation or code duplication.

---

## 1. Data Model Architecture (PayloadCMS Collections)

The system decouples framework configuration from individual content nodes using a **One-to-Many Relational Taxonomy Model**.

### Collection 1: `frameworks` (Hub Configuration Anchor)

Centralised dictionary defining global framework variables, metadata, and conversion configuration.

| Field           | Type              | Required    | Notes                                                                      |
| --------------- | ----------------- | ----------- | -------------------------------------------------------------------------- |
| `name`          | Text              | yes         | Formal compliance name (e.g., ISO 27001, SOC 2)                            |
| `slug`          | Text              | yes, unique | URL path token (e.g., `iso-27001`, `soc-2`)                                |
| `hubContent`    | Lexical Rich Text | yes         | Full editorial content for the hub landing page — see Lexical config below |
| `hubspotFormId` | Text              | no          | HubSpot Form GUID for this framework's lead pipeline                       |

#### `hubContent` Lexical Editor Config

The hub page is an editorial landing page. It requires the full block set — identical to the `vault` article content field.

```ts
editor: lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
    BlocksFeature({ blocks: [Banner, Code, MediaBlock, Table, StatsBlock] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
    HorizontalRuleFeature(),
  ],
})
```

> This is the same config as the `vault` collection `content` field. Keep them in sync — if a block is added to vault articles, it should also be available on hub pages.

### Collection 2: `vault` (Spoke Resource Table)

Single collection housing all compliance content nodes across all frameworks.

| Field                 | Type                        | Required | Notes                                                                                            |
| --------------------- | --------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `title`               | Text                        | yes      | Value-first article title                                                                        |
| `slug`                | Text                        | yes      | Final URL node. **Unique per framework — see constraint below**                                  |
| `content`             | Lexical Rich Text           | yes      | Supports Banner, Code, MediaBlock, Table, Stats blocks                                           |
| `framework`           | Relationship → `frameworks` | yes      | Associates article to its parent framework                                                       |
| `controlMapping`      | Text                        | yes      | Compliance clause reference (e.g., `Annex A.5.1`, `CC 6.1`). Display only — not used for sorting |
| `sortOrder`           | Number (integer)            | yes      | Explicit integer sort key. Controls article order within a framework                             |
| `technicalComplexity` | Select                      | no       | `Low` / `Medium` (default) / `High`                                                              |

#### Slug Uniqueness Constraint

**v1.0 issue:** slug was defined as globally unique across the entire vault collection. This blocks valid cases where two frameworks share a slug (e.g., both ISO 27001 and SOC 2 having an `/overview` article).

**v2.0 fix:** uniqueness is enforced as a **composite constraint on `[framework, slug]`**, not on `slug` alone.

Implementation in PayloadCMS:

```ts
// In vault collection config
hooks: {
  beforeValidate: [
    async ({ data, req, operation, originalDoc }) => {
      if (!data?.slug || !data?.framework) return data

      const existing = await req.payload.find({
        collection: 'vault',
        where: {
          and: [
            { 'framework': { equals: data.framework } },
            { 'slug': { equals: data.slug } },
            // Exclude current doc on update
            ...(operation === 'update' ? [{ id: { not_equals: originalDoc.id } }] : []),
          ],
        },
        limit: 1,
      })

      if (existing.totalDocs > 0) {
        throw new Error(`Slug "${data.slug}" already exists in this framework.`)
      }

      return data
    },
  ],
}
```

#### `sortOrder` Field

**v1.0 issue:** articles were sorted via `sort: 'controlMapping'` (string). String sorting on values like `Annex A.5.1`, `Annex A.5.10`, `Annex A.5.2` produces alphabetically wrong order.

**v2.0 fix:** `sortOrder` is an explicit integer field. All queries sort by `sort: 'sortOrder'`.

```ts
{
  name: 'sortOrder',
  type: 'number',
  required: true,
  defaultValue: 0,
  admin: {
    description: 'Integer sort position within this framework. Lower = earlier in the index.',
  },
}
```

`controlMapping` is retained as a **display field** (shown in the article body and index) but is never used as a sort key.

---

## 2. Dynamic Routing Engine

### File Structure

```text
app/
└── vault/
    └── [frameworkSlug]/
        ├── page.tsx              ← Framework Hub  (/vault/iso-27001)
        └── [articleSlug]/
            └── page.tsx          ← Spoke Article  (/vault/iso-27001/access-control)
```

### Path 1: Framework Hub — `/app/vault/[frameworkSlug]/page.tsx`

**Query logic:**

```ts
// Step 1: Resolve framework by slug
const framework = await payload.find({
  collection: 'frameworks',
  where: { slug: { equals: params.frameworkSlug } },
  limit: 1,
})

if (!framework.docs[0]) notFound()

// Step 2: Fetch all articles for this framework
const articles = await payload.find({
  collection: 'vault',
  where: { framework: { equals: framework.docs[0].id } },
  sort: 'sortOrder',
  limit: 200,
})
```

**Static generation:**

```ts
export async function generateStaticParams() {
  const frameworks = await payload.find({
    collection: 'frameworks',
    limit: 100,
  })

  return frameworks.docs.map((f) => ({ frameworkSlug: f.slug }))
}
```

**Click depth:** Hub pages sit 1 click from the homepage, exposing all spokes to immediate crawler parsing.

### Path 2: Spoke Article — `/app/vault/[frameworkSlug]/[articleSlug]/page.tsx`

**Query logic — two-step resolution (avoids dot-notation risk):**

```ts
// Step 1: Resolve framework ID from slug
const framework = await payload.find({
  collection: 'frameworks',
  where: { slug: { equals: params.frameworkSlug } },
  limit: 1,
})

if (!framework.docs[0]) notFound()

// Step 2: Resolve article by slug + framework ID
const article = await payload.find({
  collection: 'vault',
  where: {
    and: [
      { slug: { equals: params.articleSlug } },
      { framework: { equals: framework.docs[0].id } },
    ],
  },
  limit: 1,
})

if (!article.docs[0]) notFound()
```

> **Note:** The two-step pattern (resolve framework first, then query vault by ID) is used instead of dot-notation (`framework.slug`) to ensure reliable query behaviour with the Postgres/Drizzle adapter. Test dot-notation early and consider promoting to single-query if validated.

**Static generation:**

```ts
export async function generateStaticParams() {
  const articles = await payload.find({
    collection: 'vault',
    depth: 1, // Populates framework relationship
    limit: 2000,
  })

  return articles.docs.map((a) => ({
    frameworkSlug: (a.framework as Framework).slug,
    articleSlug: a.slug,
  }))
}
```

---

## 3. Component Architecture

### Component A: `VaultReferenceGuide` (Spoke Navigator)

Injected at the bottom of every vault article. Renders an index of all articles in the current framework, sorted by `sortOrder`, highlighting the active entry.

**Data resolution** (server-side, same request as the article):

```ts
const allArticles = await payload.find({
  collection: 'vault',
  where: { framework: { equals: currentArticle.framework.id } },
  sort: 'sortOrder',
  select: { title: true, slug: true, controlMapping: true, sortOrder: true },
  limit: 200,
})
```

**Layout:** Unrounded line matrix (Vercel-inspired). Each row shows `controlMapping` + `title` as a linked entry. Active article is highlighted. Adjacent entries visible immediately above and below to drive sequential reading.

**Purpose:** Keeps users inside the framework funnel. Replaces generic pagination with a contextually aligned compliance index.

---

### Component B: `FrameworkConversionBlock` (Contextual CTA)

Injects the correct HubSpot form based on the article's parent framework. Falls back to a generic CTA if no `hubspotFormId` is set.

#### RSC / Client Boundary

**v1.0 issue:** The spec implied server-side HubSpot script injection. HubSpot embed scripts are client-side only and cannot run in an RSC.

**v2.0 fix:** Split into two components with an explicit boundary.

**Server component** (reads framework config, passes `formId` as prop):

```tsx
// components/vault/FrameworkConversionBlock.tsx
import { HubSpotForm } from '@/components/HubSpotForm'
import { GenericCTA } from '@/components/GenericCTA'

interface Props {
  framework: {
    hubspotFormId?: string
    name: string
  }
}

export function FrameworkConversionBlock({ framework }: Props) {
  if (framework.hubspotFormId) {
    return <HubSpotForm formId={framework.hubspotFormId} />
  }

  return <GenericCTA frameworkName={framework.name} />
}
```

**Client component** (handles HubSpot script injection):

```tsx
// components/HubSpotForm.tsx
'use client'

import { useEffect, useRef } from 'react'

interface Props {
  formId: string
}

export function HubSpotForm({ formId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.hbspt || !containerRef.current) return

    window.hbspt.forms.create({
      portalId: process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID,
      formId,
      target: `#hs-form-${formId}`,
    })
  }, [formId])

  return <div id={`hs-form-${formId}`} ref={containerRef} />
}
```

> The HubSpot script (`//js.hsforms.net/forms/embed/v2.js`) is loaded once globally in `layout.tsx` via `next/script`. The `HubSpotForm` component only calls `hbspt.forms.create()` — it does not re-inject the script.

---

## 4. ISR / Caching Strategy

With 15+ frameworks × 100+ articles = 1,500+ pages, on-demand revalidation is the correct pattern (consistent with the existing `articles` collection approach inherited from the Payload Website template).

```ts
// In vault article afterChange hook
export const revalidateVaultArticle: CollectionAfterChangeHook = async ({ doc, req }) => {
  const framework = doc.framework as Framework

  // Revalidate the specific article
  req.payload.logger.info(`Revalidating /vault/${framework.slug}/${doc.slug}`)

  // Revalidate the parent hub (article list may have changed)
  req.payload.logger.info(`Revalidating /vault/${framework.slug}`)

  revalidatePath(`/vault/${framework.slug}/${doc.slug}`)
  revalidatePath(`/vault/${framework.slug}`)
}
```

Follow the existing `revalidateArticle` hook pattern in the codebase for the implementation wrapper.

---

## 5. Lexical Block Dependencies

The `vault` collection content field requires the following Lexical blocks. Those marked **Needs Build** do not exist in the `articles` collection and must be created before vault content authoring can begin.

| Block        | Status        | Source                |
| ------------ | ------------- | --------------------- |
| `Banner`     | ✅ Exists      | Clone from `articles` |
| `Code`       | ✅ Exists      | Clone from `articles` |
| `MediaBlock` | ✅ Exists      | Clone from `articles` |
| `Table`      | 🔴 Needs Build | New block             |
| `StatsBlock` | 🔴 Needs Build | New block             |

`Table` and `StatsBlock` are **dependency blockers** for vault content authoring. They must be built before the content pipeline opens.

---

## 6. Migration Scope

The current site has a large volume of compliance content in the wrong locations. All URLs below require 301 redirects to their new vault paths.

### 6.1 Framework Hubs

| Current URL       | New URL            |
| ----------------- | ------------------ |
| `/hubs/iso-27001` | `/vault/iso-27001` |
| `/hubs/soc-2`     | `/vault/soc-2`     |
| `/learn/grc`      | `/vault/grc`       |
| `/learn/soc-2`    | `/vault/soc-2`     |

### 6.2 ISO 27001 Annex A Articles (`/blog/` → `/vault/iso-27001/`)

The following articles currently live in `/blog/` and must be migrated to `/vault/iso-27001/`. The slug maps directly (strip the `iso-27001-` prefix where applicable).

**Annex 5 — Organisational Controls (confirmed in sitemap):**

| Current                                                                       | New                                                                            |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `/blog/iso-27001-annex-a-5-1-information-security-policy`                     | `/vault/iso-27001/annex-a-5-1-information-security-policy`                     |
| `/blog/iso-27001-annex-a-5-2-information-security-roles-and-responsibilities` | `/vault/iso-27001/annex-a-5-2-information-security-roles-and-responsibilities` |
| `/blog/iso-27001-annex-a-5-3-segregation-of-duties`                           | `/vault/iso-27001/annex-a-5-3-segregation-of-duties`                           |
| `/blog/iso-27001-annex-a-5-10-*` through `5-36-*`                             | `/vault/iso-27001/[matching-slug]`                                             |

> **Full migration list:** Pull all `/blog/iso-27001-*` URLs from `current-sitemap.xml` and map to `/vault/iso-27001/[slug]`. Estimated volume: **100+ articles**.

**Other blog content to migrate:**

| Current                                                    | New                                                               |
| ---------------------------------------------------------- | ----------------------------------------------------------------- |
| `/blog/access-control-policy`                              | `/vault/iso-27001/access-control-policy`                          |
| `/blog/acceptable-use-policy`                              | `/vault/iso-27001/acceptable-use-policy`                          |
| `/blog/information-security-policy`                        | `/vault/iso-27001/information-security-policy`                    |
| `/blog/asset-management-policy`                            | `/vault/iso-27001/asset-management-policy`                        |
| `/blog/how-long-does-a-soc-2-audit-take`                   | `/vault/soc-2/how-long-does-a-soc-2-audit-take`                   |
| `/blog/how-to-identify-and-close-gaps-in-soc-2-compliance` | `/vault/soc-2/how-to-identify-and-close-gaps-in-soc-2-compliance` |
| `/blog/3-reasons-why-startups-need-soc-2`                  | `/vault/soc-2/3-reasons-why-startups-need-soc-2`                  |

> Blog articles that are **comparison content** (e.g., `ISO 27001 vs SOC 2`) stay in `/blog/` per the vault content policy defined in `the-vault.md`.

### 6.3 GRC Learn Content (`/learn/grc/` → `/vault/grc/`)

The current sitemap has 25+ articles under `/learn/grc/`. All map directly:

| Current                            | New                                |
| ---------------------------------- | ---------------------------------- |
| `/learn/grc/what-is-grc`           | `/vault/grc/what-is-grc`           |
| `/learn/grc/risk-management`       | `/vault/grc/risk-management`       |
| `/learn/grc/compliance-automation` | `/vault/grc/compliance-automation` |
| `/learn/grc/[slug]`                | `/vault/grc/[slug]`                |

### 6.4 Resources / Frameworks

The `/resources/frameworks/` path (100+ entries in sitemap) maps to the broader vault taxonomy. Routing strategy for these to be confirmed — they may map to `/vault/[framework]/` hub pages or a dedicated glossary.

### 6.5 Migration Implementation Notes

- 301 redirects should be defined in `next.config.ts` under `redirects()`
- For large volumes, generate the redirects array programmatically from the sitemap
- Validate all redirects return `HTTP 301` (not `302`) before launch — permanent redirects are required for link equity transfer
- Submit the updated sitemap to Google Search Console immediately after launch

---

## 7. Vault Versions / Drafts Config

`vault` articles must support drafts and versioning, consistent with the `articles` collection.

```ts
versions: {
  drafts: {
    autosave: { interval: 100 },
    schedulePublish: true,
  },
  maxPerDoc: 50,
}
```

Access control follows the same pattern as `articles`:

| Operation | Rule                                                                      |
| --------- | ------------------------------------------------------------------------- |
| `read`    | `authenticatedOrPublished` — published articles public, drafts admin only |
| `create`  | `authenticated`                                                           |
| `update`  | `authenticated`                                                           |
| `delete`  | `authenticated`                                                           |

The `revalidateVaultArticle` hook (Section 4) already handles revalidation on publish. No additional hook logic is required for draft support.

---

## 8. Environment Variables

The following environment variable must be added to `.env` and `.env.example` before the HubSpot component can be built or tested.

```bash
# HubSpot
NEXT_PUBLIC_HUBSPOT_PORTAL_ID=your_portal_id_here
```

> `NEXT_PUBLIC_` prefix is required — this value is read client-side by the `HubSpotForm` component. It is not a secret. Retrieve it from HubSpot → Settings → Account Setup → Account ID.

Also ensure the HubSpot global script is loaded in `app/layout.tsx`:

```tsx
import Script from 'next/script'

// Inside <body>, before closing tag
<Script
  src="//js.hsforms.net/forms/embed/v2.js"
  strategy="lazyOnload"
/>
```

---

## 9. Build Order

The logical build order is:

1. **`frameworks` and `vault` collections** in Payload
2. **`Table` and `StatsBlock` Lexical blocks** — unblock content authoring
3. **Dynamic routes** — hub and spoke pages with `generateStaticParams`
4. **`VaultReferenceGuide` and `FrameworkConversionBlock`** components
5. **301 redirects** — generate programmatically from the sitemap
6. **`.env`** — add `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` before touching the HubSpot component

---

## 10. Migration Scope (Updated)

### 10.1 Framework Hubs

| Current URL       | New URL            |
| ----------------- | ------------------ |
| `/hubs/iso-27001` | `/vault/iso-27001` |
| `/hubs/soc-2`     | `/vault/soc-2`     |
| `/learn/grc`      | `/vault/grc`       |
| `/learn/soc-2`    | `/vault/soc-2`     |

### 10.2 Legacy GRC Hub Path

| Current URL                                                              | New URL                                                                |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `/grc-hub/iso-27001/8-28-security-testing-in-development-and-acceptance` | `/vault/iso-27001/8-28-security-testing-in-development-and-acceptance` |

> Check the full `/grc-hub/` path in the CMS — there may be additional entries beyond this one not captured in the sitemap snapshot.

### 10.3 ISO 27001 Annex A Articles (`/blog/` → `/vault/iso-27001/`)

| Current                                                                       | New                                                                            |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `/blog/iso-27001-annex-a-5-1-information-security-policy`                     | `/vault/iso-27001/annex-a-5-1-information-security-policy`                     |
| `/blog/iso-27001-annex-a-5-2-information-security-roles-and-responsibilities` | `/vault/iso-27001/annex-a-5-2-information-security-roles-and-responsibilities` |
| `/blog/iso-27001-annex-a-5-3-segregation-of-duties`                           | `/vault/iso-27001/annex-a-5-3-segregation-of-duties`                           |
| `/blog/iso-27001-annex-a-5-10-*` through `5-36-*`                             | `/vault/iso-27001/[matching-slug]`                                             |

> Pull all `/blog/iso-27001-*` URLs from `current-sitemap.xml` to generate the complete redirect list. Estimated volume: **100+ articles**.

### 10.4 Other Blog Articles

| Current                                                    | New                                                               |
| ---------------------------------------------------------- | ----------------------------------------------------------------- |
| `/blog/access-control-policy`                              | `/vault/iso-27001/access-control-policy`                          |
| `/blog/acceptable-use-policy`                              | `/vault/iso-27001/acceptable-use-policy`                          |
| `/blog/information-security-policy`                        | `/vault/iso-27001/information-security-policy`                    |
| `/blog/asset-management-policy`                            | `/vault/iso-27001/asset-management-policy`                        |
| `/blog/how-long-does-a-soc-2-audit-take`                   | `/vault/soc-2/how-long-does-a-soc-2-audit-take`                   |
| `/blog/how-to-identify-and-close-gaps-in-soc-2-compliance` | `/vault/soc-2/how-to-identify-and-close-gaps-in-soc-2-compliance` |
| `/blog/3-reasons-why-startups-need-soc-2`                  | `/vault/soc-2/3-reasons-why-startups-need-soc-2`                  |

> Blog articles that are comparison content (e.g., `ISO 27001 vs SOC 2`) stay in `/blog/` per the vault content policy in `the-vault.md`.

### 10.5 GRC Learn Content (`/learn/grc/` → `/vault/grc/`)

| Current             | New                 |
| ------------------- | ------------------- |
| `/learn/grc/[slug]` | `/vault/grc/[slug]` |

25+ articles — slugs map directly, no transformation required.

### 10.6 `resources/frameworks/*` — Deferred

**Decision:** Out of scope for this build. The `/resources/frameworks/` path is a legacy Webflow glossary of 100+ GRC framework reference pages. Its value in the new model is undecided.

**Interim action:** No 301 redirects. These URLs remain live on Webflow until a decision is made. Do not let them 404.

**Recommendation for future iteration:** If the glossary is revived, it maps cleanly to `/vault/glossary/[framework-slug]` and would warrant its own collection spec at that point.

### 10.7 Migration Implementation Notes

- 301 redirects defined in `next.config.ts` under `redirects()`
- For the 100+ ISO 27001 articles, generate the redirects array programmatically from `current-sitemap.xml` — do not hardcode manually
- All redirects must return `HTTP 301` (permanent), not `302` — required for link equity transfer
- Submit updated sitemap to Google Search Console immediately post-launch
- Validate redirects with a crawl tool (e.g., Screaming Frog) before go-live

---

## 11. Open Questions

All questions from v1.0 are now closed. No open questions remain.

| #   | Question                                   | Resolution                                         |
| --- | ------------------------------------------ | -------------------------------------------------- |
| 1   | `resources/frameworks/*` redirect strategy | Deferred. Remains on Webflow. No redirects for now |
| 2   | `vault` versions/drafts                    | ✅ Confirmed. Config added — see Section 7          |
| 3   | `grc-hub/iso-27001/8-28-*` legacy path     | ✅ Confirmed 301 redirect — see Section 10.2         |
| 4   | `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` in `.env`  | ✅ Must be added pre-build — see Section 8          |