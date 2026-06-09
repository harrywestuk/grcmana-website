# T1 — Data Layer Brief

**Terminal:** T1  
**Sprint:** Article Build Sprint  
**Date:** 2026-06-09  
**Status:** Ready to start

---

## Objective

Migrate the `posts` collection to `articles`, create the `authors`, `tags` collections, and extend the existing `categories` collection. Export stable TypeScript types to unblock T2.

---

## Specs

All collection specs are located in `/docs/collections/`. Read each spec in full before starting.

| Spec          | Path                            |
| ------------- | ------------------------------- |
| `article.md`  | `/docs/collections/article.md`  |
| `author.md`   | `/docs/collections/author.md`   |
| `category.md` | `/docs/collections/category.md` |
| `tag.md`      | `/docs/collections/tag.md`      |

---

## Execution Order

Complete in this sequence. Do not proceed to the next step until the current step is committed.

### Step 1 — Extend `categories`

File: `src/collections/Categories.ts`

- Add `description: textarea`
- Add `parent: relationship → categories` with `filterOptions` excluding categories that already have a parent
- Add SEO tab via `@payloadcms/plugin-seo/fields`
- Add `defaultPopulate: { title: true, slug: true }`
- Remove `position: undefined` from `slugField()`

### Step 2 — Create `tags`

File: `src/collections/Tags.ts`

- New collection. Lean — `title`, `slug`, `defaultPopulate` only
- Access: `read: anyone`, all mutations `authenticated`
- Register in `payload.config.ts`

### Step 3 — Create `authors`

File: `src/collections/Authors/index.ts`

- New collection. Full spec in `author.md`
- Create hook files:
  - `src/collections/Authors/hooks/revalidateAuthor.ts`
- Access: `read: authenticatedOrPublished`, mutations `authenticated`
- Register in `payload.config.ts`

### Step 4 — Migrate `posts` → `articles`

- Rename `src/collections/Posts/` → `src/collections/Articles/`
- Rename hook files:
  - `hooks/revalidatePost.ts` → `hooks/revalidateArticle.ts`
  - `hooks/populateAuthors.ts` — rewrite to query `authors` collection, expand populated fields to `id`, `name`, `avatar`, `bio`, `linkedIn`
- Update collection slug: `posts` → `articles`
- Update all internal references from `posts` to `articles`
- Add all new fields per `article.md` spec
- Change `authors` field `relationTo: 'users'` → `relationTo: 'authors'`
- Rename `relatedPosts` → `relatedArticles`, update `relationTo: 'articles'`
- Add `filterOptions` to `relatedArticles` to exclude current document by `id`
- Update `defaultPopulate` to include `excerpt`
- Update `admin.preview` and `admin.livePreview` collection reference to `articles`
- Deregister `Posts`, register `Articles` in `payload.config.ts`

### Step 5 — Seed data

Create one seed article covering all fields so T2 has real data to build against:

- Status: `published`
- All required fields populated
- At least one author, category, tag assigned
- `heroImage` populated
- `content` with at least one `h2`, one `h3`, one `Banner` block, one `Code` block

---

## Commit Strategy

| Commit                                       | Content |
| -------------------------------------------- | ------- |
| `feat: extend categories collection`         | Step 1  |
| `feat: add tags collection`                  | Step 2  |
| `feat: add authors collection`               | Step 3  |
| `feat: migrate posts to articles collection` | Step 4  |
| `chore: seed article data`                   | Step 5  |

**After Step 4 is committed — notify T2 that types are stable and it can start.**

---

## Key Constraints

- Do not modify anything in `src/components/` — that is T3's domain
- Do not modify any existing page routes — that is T2's domain
- `payload-types.ts` will auto-regenerate on each collection change — do not manually edit it
- If a hook file is renamed, search the entire codebase for any existing imports and update them

---

## Definition of Done

- [ ] All four collections registered in `payload.config.ts`
- [ ] `payload-types.ts` generated without errors
- [ ] Seed article visible in Payload admin
- [ ] No TypeScript errors across collection files
- [ ] T2 notified that types are stable
