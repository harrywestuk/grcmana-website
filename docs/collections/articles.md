# Article Collection Spec

**Status:** draft  
**Last Updated:** 2026-06-09  
**Owner:** Harry / GRCMANA  
**Collection Slug:** `articles`  
**Migrated From:** `posts` collection

---

## Purpose

Stores long-form editorial content published on the Blog surface. Vault content is handled by discrete vault collections (e.g. `iso-27001`, `soc-2`) which extend a shared `vaultBaseFields` layer.

---

## Dependencies

| Collection   | Relationship                    | Required |
| ------------ | ------------------------------- | -------- |
| `authors`    | relationship (hasMany)          | yes      |
| `categories` | relationship (hasMany)          | yes      |
| `tags`       | relationship (hasMany)          | no       |
| `media`      | upload (heroImage, SEO ogImage) | no       |

---

## Imports

All imports required in the collection file:

```ts
import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidateArticle } from './hooks/revalidateArticle'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'
```

> **Note:** `revalidatePost` → renamed to `revalidateArticle`. Hook file must be updated accordingly.

---

## defaultPopulate

Controls which fields Payload returns when `articles` is referenced from another collection. Prevents full document hydration on relationship queries.

```ts
defaultPopulate: {
  title: true,
  slug: true,
  excerpt: true,
  categories: true,
  meta: {
    image: true,
    description: true,
  },
}
```

> `excerpt` added vs `posts`. Used for card rendering without fetching full content.

---

## Fields

### Core

| Field         | Type     | Required | Notes                                                              |
| ------------- | -------- | -------- | ------------------------------------------------------------------ |
| `title`       | text     | yes      | Used as admin title                                                |
| `slug`        | text     | yes      | Auto-generated from title via `slugField()`. Unique per collection |
| `excerpt`     | textarea | no       | 150 chars. Used on cards and meta description fallback             |
| `status`      | select   | yes      | Managed via Payload versions/drafts                                |
| `publishedAt` | date     | no       | Auto-set on first publish via `beforeChange` hook                  |
| `featured`    | checkbox | no       | Surfaces content in featured slots                                 |

### Hero (Content Tab)

| Field          | Type           | Required | Notes                          |
| -------------- | -------------- | -------- | ------------------------------ |
| `heroImage`    | upload → media | no       | —                              |
| `heroImageAlt` | text           | no       | Required if heroImage is set   |
| `heroStyle`    | select         | no       | `image`, `gradient`, `minimal` |

### Content (Content Tab)

| Field      | Type               | Required | Notes                                                                               |
| ---------- | ------------------ | -------- | ----------------------------------------------------------------------------------- |
| `content`  | richText (Lexical) | yes      | `label: false` to suppress admin UI label. Supports Banner, Code, MediaBlock blocks |
| `readTime` | number             | no       | Auto-calculated via `beforeChange` hook. Disabled in admin                          |
| `toc`      | array              | no       | Auto-generated from Lexical heading nodes via `afterRead` hook                      |

#### Lexical Editor Config

```ts
editor: lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
    HorizontalRuleFeature(),
  ],
})
```

**Blocks:**

- `Banner` — callout/alert block
- `Code` — syntax-highlighted code block
- `MediaBlock` — image/video embed block

### Meta Tab

| Field             | Type                      | Required | Notes                                                          |
| ----------------- | ------------------------- | -------- | -------------------------------------------------------------- |
| `categories`      | relationship → categories | no       | hasMany                                                        |
| `tags`            | relationship → tags       | no       | hasMany                                                        |
| `relatedArticles` | relationship → articles   | no       | hasMany. `filterOptions` must exclude current document by `id` |

### Authors (Sidebar)

| Field              | Type                   | Required | Notes                                                                                              |
| ------------------ | ---------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `authors`          | relationship → authors | no       | hasMany. References `authors` collection, not `users`                                              |
| `populatedAuthors` | array                  | no       | Read-only. Auto-populated via `afterRead` hook. `access.update: () => false`. Disabled in admin UI |

#### `populatedAuthors` Sub-fields

| Field      | Type           | Notes              |
| ---------- | -------------- | ------------------ |
| `id`       | text           | Author document ID |
| `name`     | text           | Display name       |
| `avatar`   | upload → media | Profile image      |
| `bio`      | textarea       | Short bio          |
| `linkedIn` | text           | Profile URL        |

> **Note:** `posts` only populated `id` and `name` because it referenced `users` (locked access control). The new `authors` collection has no such restriction — populate all display fields directly.

### SEO Tab

Managed via `@payloadcms/plugin-seo` fields:

| Field              | Notes                 |
| ------------------ | --------------------- |
| `meta.title`       | `hasGenerateFn: true` |
| `meta.description` | —                     |
| `meta.image`       | upload → media        |

Uses `OverviewField` and `PreviewField` with `hasGenerateFn: true`.

---

## Select Field Options

### `heroStyle`

- `image` — full hero image
- `gradient` — branded gradient, no image
- `minimal` — title only, no visual treatment

---

## Hooks

### `beforeChange`

- **`publishedAt`** — auto-set to `new Date()` on first publish if not already set. Checks `siblingData._status === 'published'`
- **`readTime`** — calculate from `content` Lexical word count (approx 200 wpm)

### `afterRead`

- **`populatedAuthors`** — hydrate author fields (`id`, `name`, `avatar`, `bio`, `linkedIn`) from `authors` collection
- **`toc`** — extract `h2` and `h3` heading nodes from Lexical content and return as ordered array

### `afterChange`

- **`revalidateArticle`** — trigger Next.js revalidation for `/blog/[slug]`

### `afterDelete`

- **`revalidateDelete`** — trigger Next.js revalidation on delete

---

## Access Control

| Operation | Rule                                                                      |
| --------- | ------------------------------------------------------------------------- |
| `read`    | `authenticatedOrPublished` — published articles public, drafts admin only |
| `create`  | `authenticated`                                                           |
| `update`  | `authenticated`                                                           |
| `delete`  | `authenticated`                                                           |

---

## Admin Config

```ts
admin: {
  useAsTitle: 'title',
  defaultColumns: ['title', 'slug', 'status', 'publishedAt'],
  livePreview: {
    url: ({ data, req }) => generatePreviewPath({
      slug: data?.slug,
      collection: 'articles',
      req,
    }),
  },
  preview: (data, { req }) => generatePreviewPath({
    slug: data?.slug as string,
    collection: 'articles',
    req,
  }),
}
```

> Both `livePreview.url` and `preview` are required. `livePreview` powers the live preview panel while editing. `preview` powers the static preview button in the admin toolbar.

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

| Route          |
| -------------- |
| `/blog/[slug]` |

---

## Migration Notes (posts → articles)

| Item                   | Action                                                                       |
| ---------------------- | ---------------------------------------------------------------------------- |
| Collection slug        | `posts` → `articles`                                                         |
| File                   | `Posts.ts` → `Articles.ts`                                                   |
| Hook file              | `revalidatePost.ts` → `revalidateArticle.ts`. Update all internal references |
| `authors` field        | Change `relationTo: 'users'` → `relationTo: 'authors'`                       |
| `populateAuthors` hook | Rewrite to query `authors` collection. Expand populated fields               |
| `relatedPosts` field   | Rename to `relatedArticles`. Update `relationTo: 'articles'`                 |
| `defaultPopulate`      | Add `excerpt: true`                                                          |
| Existing post data     | Requires a migration script if live data exists in `posts`                   |

---

## Open Questions

- [x] TOC: auto-generated only. Edit headings in content body to update TOC. No manual override.
- [x] `relatedArticles`: manually curated only. Auto-suggestion deferred to a future iteration.
- [x] `populatedAuthors` sub-fields: confirmed as `id`, `name`, `avatar`, `bio`, `linkedIn`. Validate against `Authors` collection spec when built.

---

## Changelog

| Date       | Change                                                                                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-09 | Initial spec created. Migrated and extended from `posts` collection                                                                                      |
| 2026-06-09 | Removed vault fields (`type`, `gated`, `difficulty`). Vaults moved to discrete collections                                                               |
| 2026-06-09 | Added: imports, defaultPopulate, admin.preview, relatedArticles filterOptions note, populatedAuthors sub-fields, label:false on content, migration notes |
| 2026-06-09 | Closed open questions: TOC auto-only, relatedArticles manual curation, populatedAuthors fields confirmed                                                 |
