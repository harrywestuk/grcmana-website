# Author Collection Spec

**Status:** draft  
**Last Updated:** 2026-06-09  
**Owner:** Harry / GRCMANA  
**Collection Slug:** `authors`

---

## Purpose

Stores author and contributor profiles. Supports public-facing profile pages at `/authors/[slug]` to reinforce E-E-A-T signals. Decoupled from the `users` collection — `users` handles authentication only.

---

## Dependencies

| Collection | Relationship             | Required |
| ---------- | ------------------------ | -------- |
| `media`    | upload (avatar, ogImage) | no       |

---

## Imports

```ts
import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'
```

---

## defaultPopulate

Controls which fields Payload returns when `authors` is referenced from another collection (e.g. `articles`).

```ts
defaultPopulate: {
  name: true,
  slug: true,
  avatar: true,
  role: true,
  bio: true,
}
```

---

## Fields

### Core

| Field    | Type   | Required | Notes                                                               |
| -------- | ------ | -------- | ------------------------------------------------------------------- |
| `name`   | text   | yes      | Used as admin title and display name                                |
| `slug`   | text   | yes      | Auto-generated from `name` via `slugField()`. Unique per collection |
| `role`   | text   | no       | e.g. "Founder", "Guest Author", "Contributor"                       |
| `status` | select | yes      | Managed via Payload versions/drafts                                 |

### Profile Tab

| Field         | Type               | Required | Notes                                                               |
| ------------- | ------------------ | -------- | ------------------------------------------------------------------- |
| `avatar`      | upload → media     | no       | Profile image. Displayed on article bylines and author profile page |
| `bio`         | textarea           | no       | Short bio. 150–300 chars. Used on article bylines                   |
| `bioExtended` | richText (Lexical) | no       | Long-form bio for the public profile page                           |

### Credentials Tab

Supports E-E-A-T signals — demonstrates real-world expertise and experience.

| Field             | Type   | Required | Notes                                                                             |
| ----------------- | ------ | -------- | --------------------------------------------------------------------------------- |
| `credentials`     | array  | no       | Professional qualifications (e.g. CISSP, ISO 27001 Lead Auditor)                  |
| `expertise`       | array  | no       | Author-specific topic tags. Rendered as badges on profile page and article byline |
| `yearsExperience` | number | no       | Years of relevant experience                                                      |
| `organisations`   | array  | no       | Past/current organisations. Name + role + URL                                     |

#### `credentials` Sub-fields

| Field                  | Type   | Notes                                                                                          |
| ---------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| `title`                | text   | Credential name (e.g. CISSP)                                                                   |
| `issuer`               | text   | Issuing body (e.g. ISC2, ISACA, Microsoft)                                                     |
| `year`                 | number | Year awarded                                                                                   |
| `verificationUrl`      | text   | Full URL to verified credential. Prefer Credly badge URL. Fallback to issuer verification page |
| `verificationPlatform` | select | `credly`, `issuer`, `other`                                                                    |

**`verificationPlatform` options:**

- `credly` — verified badge on Credly (preferred)
- `issuer` — direct link to issuer verification page (e.g. Microsoft Learn, ISC2 verify)
- `other` — any other third-party verification platform

> Credly is the preferred platform as it provides machine-readable, third-party verified badges that reinforce E-E-A-T. If a credential is not on Credly, link directly to the issuer's verification page rather than leaving unverified.

#### `organisations` Sub-fields

| Field  | Type | Notes                |
| ------ | ---- | -------------------- |
| `name` | text | Organisation name    |
| `role` | text | Role held            |
| `url`  | text | Organisation website |

### Social Tab

All fields are full URLs. All optional.

| Field       | Type | Notes                       |
| ----------- | ---- | --------------------------- |
| `website`   | text | Personal or company website |
| `linkedIn`  | text | LinkedIn profile            |
| `twitter`   | text | X / Twitter profile         |
| `github`    | text | GitHub profile              |
| `youtube`   | text | YouTube channel             |
| `medium`    | text | Medium profile              |
| `facebook`  | text | Facebook profile or page    |
| `instagram` | text | Instagram profile           |
| `pinterest` | text | Pinterest profile           |
| `tiktok`    | text | TikTok profile              |

### SEO Tab

Managed via `@payloadcms/plugin-seo` fields:

| Field              | Notes                 |
| ------------------ | --------------------- |
| `meta.title`       | `hasGenerateFn: true` |
| `meta.description` | —                     |
| `meta.image`       | upload → media        |

Uses `OverviewField` and `PreviewField` with `hasGenerateFn: true`.

---

## Hooks

### `beforeChange`

- **`slug`** — auto-generated from `name` if empty

### `afterChange`

- **`revalidateAuthor`** — trigger Next.js revalidation for `/authors/[slug]`

### `afterDelete`

- **`revalidateDelete`** — trigger Next.js revalidation on delete

---

## Access Control

| Operation | Rule                                                                      |
| --------- | ------------------------------------------------------------------------- |
| `read`    | `authenticatedOrPublished` — published profiles public, drafts admin only |
| `create`  | `authenticated`                                                           |
| `update`  | `authenticated`                                                           |
| `delete`  | `authenticated`                                                           |

---

## Admin Config

```ts
admin: {
  useAsTitle: 'name',
  defaultColumns: ['name', 'role', 'slug', 'status'],
  livePreview: {
    url: ({ data, req }) => generatePreviewPath({
      slug: data?.slug,
      collection: 'authors',
      req,
    }),
  },
  preview: (data, { req }) => generatePreviewPath({
    slug: data?.slug as string,
    collection: 'authors',
    req,
  }),
}
```

---

## Versions

```ts
versions: {
  drafts: {
    autosave: { interval: 100 },
    schedulePublish: true,
  },
  maxPerDoc: 50,
}
```

---

## Routing

| Route             |
| ----------------- |
| `/authors/[slug]` |

---

## E-E-A-T Notes

The following fields directly support Google's E-E-A-T evaluation:

| Signal                | Field                                                     |
| --------------------- | --------------------------------------------------------- |
| **Experience**        | `yearsExperience`, `organisations`                        |
| **Expertise**         | `credentials` (byline + profile page), `expertise` badges |
| **Authoritativeness** | `linkedIn`, `website`, public profile page                |
| **Trustworthiness**   | `bio`, `bioExtended`, verified credentials                |

Ensure every published author has at minimum: `avatar`, `bio`, `role`, and one social link.

---

## Relationship to Articles Collection

- `articles.authors` → references this collection (hasMany)
- `articles.populatedAuthors` → populated at read time from this collection
- Fields hydrated into `populatedAuthors`: `id`, `name`, `avatar`, `bio`, `linkedIn`

---

## Open Questions

- [x] `credentials`: display on both article byline and profile page. Byline shows credential titles as compact badges. Profile page shows full detail including issuer, year, and verification link.
- [x] `expertise` categories: author-specific taxonomy using tags. Rendered as badges on the author profile page. Not linked to the shared `categories` collection.
- [x] Guest author onboarding: admin-created only for now. Self-serve form deferred.

---

## Changelog

| Date       | Change                                                                                                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-09 | Initial spec created                                                                                                              |
| 2026-06-09 | Expanded Social Tab — added GitHub, YouTube, Medium, Facebook, Instagram, Pinterest, TikTok                                       |
| 2026-06-09 | Expanded credentials sub-fields — added verificationUrl and verificationPlatform (Credly preferred)                               |
| 2026-06-09 | Closed open questions: credentials on byline + profile, expertise as author-specific tag badges, guest authors admin-created only |
