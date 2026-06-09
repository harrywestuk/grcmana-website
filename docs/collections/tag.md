# Tag Collection Spec

**Status:** draft  
**Last Updated:** 2026-06-09  
**Owner:** Harry / GRCMANA  
**Collection Slug:** `tags`

---

## Purpose

Stores a flat taxonomy of tags used across `articles` and vault collections. Tags are more granular than categories — used for filtering, discovery, and related content surfacing. No hierarchy.

---

## Dependencies

None.

---

## Imports

```ts
import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'
```

---

## defaultPopulate

```ts
defaultPopulate: {
  title: true,
  slug: true,
}
```

---

## Fields

### Core

| Field   | Type | Required | Notes                                                                |
| ------- | ---- | -------- | -------------------------------------------------------------------- |
| `title` | text | yes      | Used as admin title and display label                                |
| `slug`  | text | yes      | Auto-generated from `title` via `slugField()`. Unique per collection |

---

## Hooks

### `beforeChange`

- **`slug`** — auto-generated from `title` if empty

---

## Access Control

| Operation | Rule                              |
| --------- | --------------------------------- |
| `read`    | `anyone` — tags are always public |
| `create`  | `authenticated`                   |
| `update`  | `authenticated`                   |
| `delete`  | `authenticated`                   |

---

## Admin Config

```ts
admin: {
  useAsTitle: 'title',
  defaultColumns: ['title', 'slug'],
}
```

---

## Relationship to Other Collections

- `articles.tags` → references this collection (hasMany)

---

## Open Questions

- [x] Tag landing pages: deferred. Low content volume at launch creates thin page risk. Revisit when tags have 10+ articles each. Add `noindex` to tag routes in the interim.

---

## Changelog

| Date       | Change                                                                                |
| ---------- | ------------------------------------------------------------------------------------- |
| 2026-06-09 | Initial spec created                                                                  |
| 2026-06-09 | Closed open question: tag landing pages deferred. Thin content risk at current volume |
