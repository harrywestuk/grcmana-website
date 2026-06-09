# T2 — Pages Brief

**Terminal:** T2  
**Sprint:** Article Build Sprint  
**Date:** 2026-06-09  
**Status:** Waiting on T1 — start once T1 commits Step 4 and confirms types are stable

---

## Objective

Build the three page routes that consume the `articles`, `authors`, and `categories` collections. All pages use components built by T3 — coordinate on interfaces if a component is not yet available.

---

## Specs

| Spec          | Path                                   |
| ------------- | -------------------------------------- |
| `article.md`  | `/docs/collections/article.md`         |
| `author.md`   | `/docs/collections/author.md`          |
| `category.md` | `/docs/collections/category.md`        |
| Design system | `/docs/design-system/design-system.md` |

---

## Prerequisites

Before writing any code:

1. Confirm T1 has committed Step 4 and `payload-types.ts` is stable
2. Read the design system doc at `/docs/design-system/design-system.md`
3. Review existing page routes in the codebase for structural patterns to follow

---

## Execution Order

### Page 1 — `/blog/[slug]` (Article Page)

File: `src/app/(frontend)/blog/[slug]/page.tsx`

**Layout:**

- Hero — see Hero Evaluation below
- Two-column layout: floating TOC on left, `RichText` content on right
- `AuthorBio` below content
- `CTABlock` at bottom

**Data fetching:**

- Fetch single article by `slug` from `articles` collection
- Use `generateStaticParams` to pre-render all published articles
- Use `generateMetadata` to populate SEO fields from `meta.*`
- Return 404 if article not found or not published

**Hero Evaluation:**

- Review `PostHero` at `/src/heros/PostHero` first
- If `PostHero` supports `heroImage`, `heroImageAlt`, `heroStyle` variants and title — extend it
- If it does not meet the brief — T3 will build `ArticleHero`. Coordinate with T3 before proceeding

**TOC behaviour:**

- Floating on desktop, collapsed/hidden on mobile
- Highlight active heading on scroll
- Sourced from `article.toc` array (populated by Payload `afterRead` hook)

---

### Page 2 — `/categories/[slug]` (Category Landing Page)

File: `src/app/(frontend)/categories/[slug]/page.tsx`

**Layout:**

- Hero — evaluate `HighImpact`, `MediumImpact`, `LowImpact` at `/src/heros/`. Choose the most appropriate for a category landing page context
- Category `description` below hero if populated
- Grid of `ArticleCard` components filtered by category
- `Pagination` component from `src/components/Pagination`
- Sub-categories listed if `parent` relationship exists

**Data fetching:**

- Fetch category by `slug` from `categories` collection
- Fetch published articles where `categories` includes this category
- Use `generateStaticParams` for all published categories
- Use `generateMetadata` from `meta.*`
- Return 404 if category not found

---

### Page 3 — `/authors/[slug]` (Author Profile Page)

File: `src/app/(frontend)/authors/[slug]/page.tsx`

**Layout:**

- Hero — evaluate `HighImpact`, `MediumImpact`, `LowImpact` at `/src/heros/`. Choose the most appropriate for an author profile context
- Author avatar, name, role, bio via `Media` component from `src/components/Media`
- Expertise tag badges
- Credentials with verification links (Credly badge where `verificationPlatform === 'credly'`)
- Organisations list
- Social links
- Grid of `ArticleCard` components filtered by author
- `bioExtended` richText via `RichText` component from `src/components/RichText`

**Data fetching:**

- Fetch author by `slug` from `authors` collection
- Fetch published articles where `authors` includes this author
- Use `generateStaticParams` for all published authors
- Use `generateMetadata` from `meta.*`
- Return 404 if author not found

---

## Shared Patterns

Apply consistently across all three pages:

- **Loading states** — use `loading.tsx` per route segment
- **Error handling** — use `error.tsx` per route segment
- **Breadcrumbs** — render breadcrumb trail consistent with pattern: `Articles > {Category} > {Sub-category} > {Slug}`
- **Revalidation** — all pages use on-demand revalidation triggered by Payload hooks. Do not use time-based revalidation

---

## Key Constraints

- Do not build components — that is T3's domain. Import from `src/components/`
- If a component you need is not yet built by T3, stub it with a placeholder and leave a `// TODO: replace with T3 component` comment
- Use `payload-types.ts` for all type imports — do not define collection types manually
- Follow existing page route structure in the codebase for consistency

---

## Definition of Done

- [ ] `/blog/[slug]` renders a published article with hero, two-col layout, TOC, author bio, CTA
- [ ] `/categories/[slug]` renders category with hero, article grid, pagination
- [ ] `/authors/[slug]` renders author profile with credentials, expertise badges, article grid
- [ ] `generateStaticParams` implemented on all three routes
- [ ] `generateMetadata` implemented on all three routes
- [ ] 404 handling on all three routes
- [ ] No TypeScript errors
