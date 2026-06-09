# T3 — Components Brief

**Terminal:** T3  
**Sprint:** Article Build Sprint  
**Date:** 2026-06-09  
**Status:** Ready to start — no dependency on T1 or T2

---

## Objective

Build all components required by the article, category, and author pages. Wrap existing UI primitives and functional components wherever possible — do not rebuild what already exists.

---

## References

Read before writing any code:

| Reference              | Path                                   |
| ---------------------- | -------------------------------------- |
| Design system          | `/docs/design-system/design-system.md` |
| UI components          | `src/components/ui/`                   |
| Functional components  | `src/components/`                      |
| Existing hero sections | `src/heros/`                           |

**Existing UI primitives available:**
`button`, `card`, `checkbox`, `input`, `label`, `pagination`, `select`, `textarea`

**Existing functional components available:**
`Card`, `CollectionArchive`, `CustomCursor`, `Link`, `Media`, `Pagination`, `RichText`, `ScrollReveal`

---

## Execution Order

### Step 1 — Hero Evaluation (do this first)

Review all existing hero sections at `/src/heros/`:

| Hero           | Current Use                          |
| -------------- | ------------------------------------ |
| `GrcmanaHero`  | Homepage only — do not modify        |
| `HighImpact`   | Evaluate for category + author pages |
| `MediumImpact` | Evaluate for category + author pages |
| `LowImpact`    | Evaluate for category + author pages |
| `PostHero`     | Evaluate for article page            |

**For `PostHero`:** Does it support `heroImage`, `heroImageAlt`, `heroStyle` variants (`image`, `gradient`, `minimal`) and title?

- If yes — extend it to support the `articles` collection fields. Do not rebuild.
- If no — build `ArticleHero` as a new component in `src/components/ArticleHero/`

**For category + author pages:** Choose the most appropriate existing hero from `HighImpact`, `MediumImpact`, `LowImpact`. Extend if needed. Only build new if none meet the brief.

**Notify T2 of your decision** on hero components before T2 starts building pages.

---

### Step 2 — `CategoryBadge`

File: `src/components/CategoryBadge/index.tsx`

- Renders a category as a compact badge
- Props: `title`, `slug`, `href` (links to `/categories/[slug]`)
- Uses design system tokens for typography and spacing
- No colour — consistent styling only

---

### Step 3 — `ArticleCard`

File: `src/components/ArticleCard/index.tsx`

- Wraps existing `Card` component from `src/components/ui/card`
- Props: `title`, `slug`, `excerpt`, `heroImage`, `publishedAt`, `categories`, `authors`, `readTime`
- Renders `CategoryBadge` for each category
- Uses `Media` component from `src/components/Media` for `heroImage`
- Uses `Link` component from `src/components/Link` for card link
- Thumbnail, title, excerpt, meta (date + read time), category badges

---

### Step 4 — `TableOfContents`

File: `src/components/TableOfContents/index.tsx`

- Props: `toc` array (from `article.toc` — ordered array of `{ id, text, level }`)
- Floating on desktop, hidden on mobile
- Highlights active heading on scroll using `IntersectionObserver`
- Smooth scroll to heading on click
- No external libraries — native browser APIs only

---

### Step 5 — `ArticleLayout`

File: `src/components/ArticleLayout/index.tsx`

- Two-column wrapper: `TableOfContents` on left (floating/sticky), content on right
- Props: `toc`, `children`
- Desktop: side-by-side columns. Mobile: single column, TOC hidden
- Uses design system spacing and breakpoint tokens

---

### Step 6 — `AuthorBio`

File: `src/components/AuthorBio/index.tsx`

Two variants — `byline` and `full`:

**`byline`** (used at bottom of article):

- Avatar via `Media` component
- Name, role, short `bio`
- Credential titles as compact badges
- LinkedIn link via `Link` component

**`full`** (used on author profile page):

- Everything in `byline` plus:
- Expertise tags as badges
- Full credentials with issuer, year, verification link
- Credly badge embed if `verificationPlatform === 'credly'`
- Organisations list
- All social links

Props: `author`, `variant: 'byline' | 'full'`

---

### Step 7 — `CTABlock`

File: `src/components/CTABlock/index.tsx`

- Uses `Button` component from `src/components/ui/button`
- Props: `heading`, `subheading`, `primaryCTA: { label, href }`, `secondaryCTA?: { label, href }`
- Uses design system tokens for layout and typography
- Consistent with existing CTA patterns in the codebase if any exist

---

## Key Constraints

- Always check `src/components/` and `src/components/ui/` before building anything new
- Never modify `GrcmanaHero` — homepage only
- All components must be TypeScript with explicit prop types
- Use design system tokens from `/docs/design-system/design-system.md` — no hardcoded values
- Export each component from its own `index.tsx` following existing conventions

---

## Coordination with T2

- Notify T2 of hero evaluation decision (Step 1) before T2 starts
- If T2 stubs a component with a `// TODO` placeholder, prioritise building that component next
- T2 imports from `src/components/` — keep exports clean and consistently named

---

## Definition of Done

- [ ] Hero evaluation complete and T2 notified
- [ ] `CategoryBadge` built and exported
- [ ] `ArticleCard` built using existing `Card` primitive
- [ ] `TableOfContents` built with scroll-aware active state
- [ ] `ArticleLayout` two-column layout with sticky TOC
- [ ] `AuthorBio` built with `byline` and `full` variants
- [ ] `CTABlock` built using existing `Button` primitive
- [ ] All components TypeScript with explicit prop types
- [ ] No hardcoded design values — design system tokens used throughout
- [ ] No TypeScript errors
