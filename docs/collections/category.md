# Category Collection Spec

**Status:** draft  
**Last Updated:** 2026-06-09  
**Owner:** Harry / GRCMANA  
**Collection Slug:** `categories`  
**Migrated From:** existing `categories` collection (extended)

---

## Purpose

Stores the primary content taxonomy used across `articles` and vault collections. Supports category landing pages, article card badges, and hierarchical sub-categories.

---

## Dependencies

| Collection   | Relationship              | Required |
| ------------ | ------------------------- | -------- |
| `categories` | self-referential (parent) | no       |
| `media`      | upload (ogImage)          | no       |

---

## Imports

```ts
import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
```

---

## defaultPopulate

```ts
defaultPopulate: {
  title: true,
  slug: true,
}
```

> Scoped to fields needed for badge rendering on article cards. Prevents full document hydration on relationship queries.

---

## Fields

### Core

| Field         | Type                      | Required | Notes                                                                                                                                                             |
| ------------- | ------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | text                      | yes      | Used as admin title                                                                                                                                               |
| `slug`        | text                      | yes      | Auto-generated from `title` via `slugField()`. Unique per collection                                                                                              |
| `description` | textarea                  | no       | Used on category landing pages and SEO fallback                                                                                                                   |
| `parent`      | relationship → categories | no       | Max depth of one. Enables breadcrumb pattern: Articles > {Category} > {Sub-category} > {Slug}. `filterOptions` must exclude categories that already have a parent |

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

- **`slug`** — auto-generated from `title` if empty

---

## Access Control

| Operation | Rule                                    |
| --------- | --------------------------------------- |
| `read`    | `anyone` — categories are always public |
| `create`  | `authenticated`                         |
| `update`  | `authenticated`                         |
| `delete`  | `authenticated`                         |

---

## Admin Config

```ts
admin: {
  useAsTitle: 'title',
  defaultColumns: ['title', 'slug', 'parent'],
}
```

---

## Routing

| Route                |
| -------------------- |
| `/categories/[slug]` |

---

## Relationship to Other Collections

- `articles.categories` → references this collection (hasMany)
- `authors.expertise` — author-specific tags, not linked to this collection

---

## Migration Notes (categories → categories)

| Item                 | Action                                                                |
| -------------------- | --------------------------------------------------------------------- |
| Existing fields      | `title`, `slug` — no change                                           |
| New fields           | `description`, `colour`, `parent`, SEO tab                            |
| Existing data        | Safe to extend — no breaking changes                                  |
| `slugField` position | Remove `position: undefined`. Let Payload use default tab positioning |

---

## Open Questions

- [x] Category landing pages: required at launch. Critical for SEO topical authority, breadcrumb integrity, and E-E-A-T signals.
- [x] `colour`: removed. Frontend renders categories consistently. Can be revisited if needed.
- [x] `parent`: max depth of one. Supports breadcrumb pattern: Articles > {Category} > {Sub-category} > {Slug}. `filterOptions` excludes categories that already have a parent.

---

## Changelog

| Date       | Change                                                                         |
| ---------- | ------------------------------------------------------------------------------ |
| 2026-06-09 | Initial spec created. Extended from existing `categories` collection           |
| 2026-06-09 | Removed `colour` field. Locked `parent` to max depth of one with filterOptions |
| 2026-06-09 | Closed remaining open question: category landing pages required at launch      |
