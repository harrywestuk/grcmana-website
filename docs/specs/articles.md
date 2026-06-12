# Article Page — Implementation Specification

> **Source mockup:** `grcmana-article-v3.html`
> **Routes:** `/blog/{slug}`
> **Stack:** Next.js · PayloadCMS · Tailwind or CSS Modules
> **Version:** 1.0 · June 2025

---

## Table of Contents

- [Article Page — Implementation Specification](#article-page--implementation-specification)
  - [Table of Contents](#table-of-contents)
  - [Component Inventory](#component-inventory)
  - [Page-Level Configuration](#page-level-configuration)
    - [Routes](#routes)
    - [Fonts](#fonts)
    - [Body-level requirements](#body-level-requirements)
  - [Layout Architecture](#layout-architecture)
    - [Critical layout rules](#critical-layout-rules)
  - [Component Specifications](#component-specifications)
    - [C-01 Nav](#c-01-nav)
    - [C-02 Reading Progress Bar](#c-02-reading-progress-bar)
    - [C-03 Custom Cursor](#c-03-custom-cursor)
    - [C-04 Article Header](#c-04-article-header)
      - [Sub-elements (top to bottom)](#sub-elements-top-to-bottom)
    - [C-05 Sticky TOC](#c-05-sticky-toc)
      - [Sub-elements](#sub-elements)
    - [C-06 AIO Snippet](#c-06-aio-snippet)
      - [Sub-elements](#sub-elements-1)
    - [C-07 Article Body](#c-07-article-body)
    - [C-08 Inline Stat Callout](#c-08-inline-stat-callout)
    - [C-09 Pull Quote](#c-09-pull-quote)
    - [C-10 Code Block](#c-10-code-block)
    - [C-11 Article Footer](#c-11-article-footer)
      - [Sub-elements](#sub-elements-2)
    - [C-12 Related Articles](#c-12-related-articles)
    - [C-13 Article Card](#c-13-article-card)
      - [Sub-elements](#sub-elements-3)
    - [C-14 CTA Close](#c-14-cta-close)
    - [C-15 Footer](#c-15-footer)
  - [Interactive Behaviours](#interactive-behaviours)
    - [Scroll reveal](#scroll-reveal)
    - [TOC active tracking](#toc-active-tracking)
  - [CMS Data Model](#cms-data-model)
    - [Article collection (PayloadCMS)](#article-collection-payloadcms)
    - [Content block types](#content-block-types)
    - [Author collection](#author-collection)
  - [Token Requirements](#token-requirements)

---

## Component Inventory

Use the **Status** column to map each component against what currently exists in the build.

| ID   | Component                 | Type          | Status                               |
| ---- | ------------------------- | ------------- | ------------------------------------ |
| C-01 | Nav                       | Global        | `[ ] exists` `[ ] partial` `[ ] new` |
| C-02 | Reading Progress Bar      | Page-level    | `[ ] exists` `[ ] partial` `[ ] new` |
| C-03 | Custom Cursor             | Global        | `[ ] exists` `[ ] partial` `[ ] new` |
| C-04 | Article Header            | Page-specific | `[ ] exists` `[ ] partial` `[ ] new` |
| C-05 | Sticky TOC                | Page-specific | `[ ] exists` `[ ] partial` `[ ] new` |
| C-06 | AIO Snippet               | Article block | `[ ] exists` `[ ] partial` `[ ] new` |
| C-07 | Article Body (typography) | Article block | `[ ] exists` `[ ] partial` `[ ] new` |
| C-08 | Inline Stat Callout       | Article block | `[ ] exists` `[ ] partial` `[ ] new` |
| C-09 | Pull Quote                | Article block | `[ ] exists` `[ ] partial` `[ ] new` |
| C-10 | Code Block                | Article block | `[ ] exists` `[ ] partial` `[ ] new` |
| C-11 | Article Footer            | Page-specific | `[ ] exists` `[ ] partial` `[ ] new` |
| C-12 | Related Articles          | Section       | `[ ] exists` `[ ] partial` `[ ] new` |
| C-13 | Article Card              | Reusable      | `[ ] exists` `[ ] partial` `[ ] new` |
| C-14 | CTA Close                 | Global        | `[ ] exists` `[ ] partial` `[ ] new` |
| C-15 | Footer                    | Global        | `[ ] exists` `[ ] partial` `[ ] new` |

**Type definitions:**

- **Global** — already built for the homepage; import and reuse, no modification.
- **Page-level** — behaviour scoped to the article page only; may not have a homepage equivalent.
- **Page-specific** — unique to the article template.
- **Article block** — a rich-text block type in PayloadCMS; rendered inline within `article-body`.
- **Section** — a full-width page section.
- **Reusable** — a card/tile component that appears in multiple contexts.

---

## Page-Level Configuration

### Routes

All blog articles are served at `/blog/[slug]`.

| Route pattern  | Example                                       |
| -------------- | --------------------------------------------- |
| `/blog/[slug]` | `/blog/why-iso-27001-closes-enterprise-deals` |

### Fonts

All three typefaces must be loaded globally. Prefer `font-display: swap` and `preconnect` hints.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
```

### Body-level requirements

```css
html { scroll-behavior: smooth; }
@media (pointer: fine) { html { cursor: none; } }
body { overflow-x: clip; } /* NOT hidden — clip preserves position:sticky on TOC */
```

The `overflow-x: clip` value is non-negotiable. Using `overflow-x: hidden` will break the sticky TOC. `clip` prevents horizontal overflow without creating a scroll container.

---

## Layout Architecture

The article page uses three distinct layout zones:

```
┌─────────────────────────────────────────────────┐
│  NAV (fixed, 60px, full-width)                  │
├─────────────────────────────────────────────────┤
│  ARTICLE HEADER                                 │
│  container--narrow (720px), centred             │
│  padding-top: section-y-hero + 60px nav offset  │
├─────────────────────────────────────────────────┤
│  ARTICLE LAYOUT GRID                            │
│  max-width: 1060px, centred                     │
│  grid: 220px | 64px gap | minmax(0, 720px)      │
│  ┌──────────┐         ┌─────────────────────┐   │
│  │ Sticky   │         │ Article Body        │   │
│  │ TOC      │         │ (right column)      │   │
│  │ 220px    │         │ 720px max           │   │
│  └──────────┘         └─────────────────────┘   │
├─────────────────────────────────────────────────┤
│  ARTICLE FOOTER (same grid — footer flush with  │
│  article body left edge via placeholder cell)   │
├─────────────────────────────────────────────────┤
│  RELATED ARTICLES (container-max, full-width)   │
├─────────────────────────────────────────────────┤
│  CTA CLOSE (container--narrow, full-width band) │
├─────────────────────────────────────────────────┤
│  FOOTER (container-max, full-width)             │
└─────────────────────────────────────────────────┘
```

### Critical layout rules

**The grid collapses below 1100px.** At ≤1100px: `grid-template-columns: 1fr`, TOC hidden, article takes full width.

**The Article Footer must use the same grid class as the article body.** If the footer uses a different container, its left edge will not align with the article text above it. The correct pattern uses an empty placeholder div in the left (TOC) column:

```html
<div class="article-layout__inner">
  <div class="article-footer__placeholder"></div>  <!-- holds TOC column width -->
  <div class="article-footer__content">
    <!-- tags, share, author bio -->
  </div>
</div>
```

The placeholder is hidden via `display: none` in the ≤1100px breakpoint.

---

## Component Specifications

---

### C-01 Nav

**Reuse from homepage. No modifications required for the article page.**

The nav is fixed at `z-index: 200`, `height: 60px`. The article header `padding-top` must account for this offset: `calc(var(--section-y-hero) + 60px)`.

---

### C-02 Reading Progress Bar

**New. Article page only.**

A 2px Signal 500 bar fixed at the top of the viewport, filling left-to-right as the user scrolls.

```
Position: fixed, top: 0, left: 0
z-index: 300 (above nav at 200)
Height: 2px
Background: var(--signal-500)
Initial width: 0%
Transition: width 100ms linear
```

**JS logic:**
```js
const total = document.documentElement.scrollHeight - window.innerHeight;
const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
bar.style.width = Math.min(pct, 100) + '%';
```
Attach to `window` scroll event. No debounce — 100ms linear transition handles visual smoothness.

**z-index note:** Must be above the nav (200) to render correctly, but the 2px height means it never occludes nav content.

---

### C-03 Custom Cursor

**Reuse from homepage. No modifications required.**

Signal 500 dot (8px) + lagging ring (32px, `rgba(232,255,71,0.45)` border). On hover over interactive elements: dot scales 2×, ring expands to 48px. Activated only for `pointer: fine` devices (i.e., not touch).

---

### C-04 Article Header

**New. Page-specific.**

Centred column layout using `--container-narrow` (720px). Consists of six sub-elements stacked vertically.

#### Sub-elements (top to bottom)

**Breadcrumb**
```
Font: DM Mono, 9px, uppercase, 0.12em letter-spacing
Colour: --ink-200 (interactive items) / --ink-300 (active/current)
Separator: "/" in --ink-600
Layout: flex row, centred, gap: 8px
Pattern: Blog  /  {article title truncated}
```

**Category tag row**
```
Component: .a-tag (reuse badge component)
Category tag: Signal 500 text, rgba(232,255,71,0.25) border
Additional tags: --ink-300 text, --border border (standard tag style)
Layout: flex row, centred, gap: 8px
CMS source: article.category + article.tags[]
```

**Article title (h1)**
```
Font: DM Serif Display, clamp(36px, 5vw, 60px), weight 400
Line-height: 1.05
Letter-spacing: -0.025em
Colour: --white
Italic signal accent: <em> → font-style: italic, color: --signal-500
Margin-bottom: 28px
CMS source: article.title (rich text to support <em>)
```

**Deck / subtitle**
```
Font: Syne, 17px, weight 400, line-height 1.65
Colour: --ink-200
Max-width: 580px (centred within narrow container)
Margin-bottom: 36px
CMS source: article.deck (plain text, ~120 chars max)
```

**Author row**
```
Layout: flex row, centred, gap: 12px, margin-bottom: 36px
Avatar: 36px circle, --ink-700 bg, --signal-500 initials in DM Mono 11px
Name: Syne 14px, weight 700, --white
Role: Syne 13px, --ink-300
CMS source: article.author → author.name, author.role, author.initials
```

**Meta bar**
```
Layout: flex row, centred, border-top + border-bottom: 1px solid --border
Padding-block: 14px
Three items separated by 1px --border vertical dividers:
  - Reading time: DM Mono 9px, --ink-300, dot prefix
  - Copy link: DM Mono 9px, --ink-200, hover: --signal-500 (interactive)
  - Published date: DM Mono 9px, --ink-300, dot prefix
CMS source: article.readingTime (number), article.publishedAt (date)
```

**Background glow**
```
Decorative radial gradient: rgba(232,255,71,0.04), centred at 50% 60%
Position: absolute, inset: 0, pointer-events: none
```

---

### C-05 Sticky TOC

**STATUS:** `IN PROGRESS`

**New. Article page only.**

Positioned in the left column of the article grid. Sticks to `top: 88px` (60px nav + 28px breathing room) as the user scrolls through the article.

```
Position: sticky, top: 88px
Width: 220px (set by grid column)
Hidden below 1100px viewport width
```

#### Sub-elements

**Label**
```
Text: "In this article"
Font: DM Mono, 9px, uppercase, 0.12em letter-spacing
Colour: --ink-300
Border-bottom: 1px solid --border, padding-bottom: 12px
```

**Nav items**
```
Font: DM Mono, 10px, 0.04em letter-spacing (not uppercase — full heading text)
Colour (inactive): --ink-300
Colour (active):   --signal-500
Border-left: 2px solid transparent (inactive) → 2px solid --signal-500 (active)
Left rail: 1px solid --border on the nav container
Padding: 9px 8px 9px 14px
Transition: color + border-color, --dur-fast, --ease-out
Hover: --ink-100, border-left: --border-hover
```

**Active state — JS (IntersectionObserver)**
```js
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocLinks.forEach(link => {
          link.classList.toggle('toc__item--active',
            link.getAttribute('href') === '#' + id);
        });
      }
    });
  },
  { rootMargin: '-20% 0% -72% 0%', threshold: 0 }
);
```
`rootMargin: '-20% 0% -72% 0%'` activates the TOC item when the heading is in the upper-third of the viewport — the natural "currently reading" zone, not the very top edge.

Every `h2` in the article body must have an `id` attribute matching the TOC link `href`.

**Divider**
```
Height: 1px, background: --border
Margin: 20px 0 16px
```

**CTA button**
```
Text: "Book a Call →"
Font: DM Mono, 9px, uppercase, 0.08em letter-spacing
Background: --signal-500
Colour: --ink-900
Padding: 9px 14px
Layout: flex, space-between (text left, arrow right)
Hover: --signal-400
Border-radius: 0
```

---

### C-06 AIO Snippet

**STATUS:** `COMPLETE`

**New. Article block type in CMS.**

A structured summary block optimised for AI search engine extraction. Sits at the top of the article body, before the lead paragraph.

```
Background: rgba(232,255,71,0.06)   [--signal-a06]
Border: 1px solid rgba(232,255,71,0.15)
Padding: 24px
Margin-bottom: 40px
```

#### Sub-elements

**Header row**
```
Layout: flex, space-between, border-bottom: 1px solid --border, padding-bottom: 10px
Left label: "Verified Executive Summary // LLM-Abstract"
  → DM Mono, 9px, uppercase, 0.1em tracking, --signal-500
Right label: "Optimized for AI Search Engines"
  → DM Mono, 8px, uppercase, --ink-300
```

**Core summary**
```
Font: Syne, 14.5px, line-height 1.6, --ink-100
<strong> → --white
Max ~2–3 sentences. Should be self-contained, factually precise,
structured to be parseable by LLMs as a knowledge snippet.
CMS source: article.aioSummary.core (rich text with bold support)
```

**Fact grid**
```
Layout: 2×2 CSS grid (1fr 1fr), gap: 12px
Collapses to 1 column below 600px viewport
Each cell (.aio-fact):
  Background: --ink-950
  Border: 1px solid --border
  Padding: 12px 16px
  Term: DM Mono, 8.5px, uppercase, --ink-300, margin-bottom: 2px
  Definition: Syne, 13px, weight 600, --ink-100
CMS source: article.aioSummary.facts[] (array of {term, definition}, max 4)
```

---

### C-07 Article Body

**New. Typography styles applied to the `<article>` element.**

These are not discrete components — they are typographic styles applied to semantic HTML elements within the article body. In PayloadCMS, most of this is rendered from the rich text editor output.

| Element            | Font                    | Size    | Line-height | Colour                   |
| ------------------ | ----------------------- | ------- | ----------- | ------------------------ |
| Lead paragraph     | Syne                    | 19px    | 1.7         | --ink-100                |
| Body paragraph     | Syne                    | 16px    | 1.8         | --ink-200                |
| `<strong>` in body | Syne 700                | inherit | —           | --ink-100                |
| `<a>` in body      | —                       | inherit | —           | --signal-500 + underline |
| H2 section heading | DM Serif Display        | 32px    | 1.1         | --white                  |
| H2 `<em>` accent   | DM Serif Display italic | inherit | —           | --signal-500             |
| H3 subheading      | Syne 700                | 18px    | —           | --white                  |
| List item          | Syne                    | 16px    | 1.7         | --ink-200                |
| List item bullet   | 4px circle, --ink-500   | —       | —           | —                        |

**H2 section heading spacing:**
```
margin-top: 64px
padding-top: 64px
border-top: 1px solid --border
margin-bottom: 20px
```
Each H2 must have a unique `id` attribute for TOC anchor linking.

**Lead paragraph:**
The first paragraph in the article body should have `.lead` class applied. In PayloadCMS, this can be a specific block type or a class applied via the Lexical editor.

---

### C-08 Inline Stat Callout

**New. Article block type in CMS.**

A 3-column grid of metric callouts. Used once per article, typically after the opening paragraphs to anchor the article's core claims with data.

```
Layout: CSS grid, 3 columns, 1px gap, background: --border (creates hairline dividers)
Margin: 48px 0
```

**Each cell:**
```
Background: --ink-800
Padding: 28px 24px
Value: DM Serif Display, 40px, --signal-500
Label: DM Mono, 9px, uppercase, 0.1em tracking, --ink-300
```

**CMS source:** `article.statCallout[]` — array of `{value: string, label: string}`, max 3 items.

---

### C-09 Pull Quote

**New. Article block type in CMS.**

An extended quotation, visually distinguished from body copy by a Signal yellow left border and tinted background.

```
Margin: 48px 0
Padding: 28px 32px
Border-left: 3px solid --signal-500
Background: rgba(232,255,71,0.06)   [--signal-a06]
```

**Quote text:**
```
Font: DM Serif Display italic, 22px, line-height 1.4, --white
```

**CMS source:** `article.content[]` block type `pullQuote` with field `quote: richText`.

No attribution line in this variant — pull quotes are editorial emphasis, not testimonials. If attribution is needed, use the Testimonial component.

---

### C-10 Code Block

**New. Article block type in CMS.**

Used to display policy excerpts, framework timelines, and configuration snippets. Not a generic code editor — content is authored in the CMS as structured text.

```text
Background: --ink-950
Border: 1px solid --border
Margin: 32px 0
overflow-x: auto
```

**Header bar:**

```text
Background: --ink-800
Padding: 10px 16px
Border-bottom: 1px solid --border
Left label: DM Mono, 9px, uppercase, --ink-300 (e.g. "Trust Architecture Framework · Phase timeline")
Right label: DM Mono, 9px, --signal-500 (e.g. "Weeks 1–6")
```

**Content area:**

```text
Font: DM Mono, 13px, line-height 1.6, --ink-200
Padding: 20px
Syntax highlight tokens:
  .k (keywords):  --signal-500
  .s (strings):   --success (#22c55e)
  .c (comments):  --ink-400 (intentionally darker — meta-text)
```

**CMS source:** `article.content[]` block type `codeBlock` with fields `headerLabel`, `headerTag`, `code: text`.

---

### C-11 Article Footer

**New. Page-specific. Must be grid-aligned.**

The article footer must use the same `article-layout__inner` grid class as the article body. This ensures the tags, share buttons, and author bio share their left edge exactly with the article text above — at every viewport width.

**Critical structure:**

```html
<div class="article-footer">
  <div class="article-layout__inner">
    <div class="article-footer__placeholder"></div> <!-- left column placeholder -->
    <div class="article-footer__content">
      <!-- tags, share, author bio -->
    </div>
  </div>
</div>
```

**Do not** use `max-width: container-narrow` centred independently — this will misalign at wide viewports.

#### Sub-elements

**Tags row**

```text
Label: DM Mono, 9px, uppercase, --ink-400 ("Tags")
Tags: DM Mono, 9px, uppercase, --ink-300, border: 1px solid --border
Tag hover: --white, border: --border-hover
CMS source: article.tags[] (relationship to Tag collection)
```

**Share row**

```text
Label: DM Mono, 9px, uppercase, --ink-300 ("Share")
Buttons: DM Mono, 9px, uppercase, --ink-300, border: 1px solid --border
Hover: --white, border: --border-hover
Actions: "LinkedIn →" (share to LinkedIn with article URL), "Copy link" (clipboard)
```

**Author bio card**

```text
Background: --ink-800
Border: 1px solid --border
Padding: 28px
Layout: flex row, gap: 20px, align-items: flex-start
Avatar: 52px circle, --ink-700 bg, --signal-500 initials in DM Mono 14px
Eyebrow: DM Mono, 9px, uppercase, --ink-300 ("Author")
Name: Syne 700, 16px, --white
Bio copy: Syne, 14px, --ink-300, line-height 1.6
CMS source: article.author → author.name, author.bio, author.initials
```

---

### C-12 Related Articles

**New. Section.**

Full-width section with Ink 800 background, sitting between the article footer and the CTA Close. Uses the standard `container` (1200px).

```text
Background: --ink-800
Border-top: 1px solid --border
Padding-block: --section-y (120px)
```

**Section header:**

```text
Eyebrow: "More from the Blog"
Headline: DM Serif Display, "Keep reading." with italic Signal accent on "reading."
Font sizes: standard s-header__h2 spec
Margin-bottom from grid: 52px
```

**Grid:**

```text
3 columns, 1px gap, background: --border (hairline grid lines)
```

**CMS source:** `article.relatedArticles[]` — max 3 manually selected or auto-populated Article references.

---

### C-13 Article Card

**New. Reusable.**

Used in Related Articles. May also be used on the Blog index page.

```text
Background: --ink-800
Padding: 36px
Border-top: 2px solid transparent
Transition: all --dur-base --ease-out
```

**Hover state:**

```text
Background: --ink-700
Border-top: 2px solid --signal-500
Transform: translateY(-2px)
```

#### Sub-elements

**Context row (top)**

```text
Layout: flex, gap: 8px
Category tag: DM Mono 8px, --signal-500, border: rgba(232,255,71,0.2)
Reading time: DM Mono 8px, --ink-300
```

**Title**

```text
Font: Syne 700, 17px, line-height 1.3, --white
Margin-bottom: 12px
flex: 1 (pushes meta to bottom of card regardless of title length)
```

**Excerpt**

```text
Font: Syne, 13px, --ink-300, line-height 1.6
Margin-bottom: 24px
```

**Meta row (bottom)**

```text
Layout: flex, space-between
Border-top: 1px solid --border, padding-top: 14px
Author: DM Mono 8px, --ink-300
Date: DM Mono 8px, --ink-300
```

**CMS source:** Populated from Article collection. Required fields: `title`, `slug`, `category`, `readingTime`, `excerpt`, `author.name`, `publishedAt`.

---

### C-14 CTA Close

**Reuse from homepage. No modifications required.**

Dark Zone 3 — Ink 950 background, `--section-y-hero` padding, narrow container, Signal italic headline, primary + ghost CTA pair, DM Mono trust note below.

---

### C-15 Footer

**Reuse from homepage. No modifications required.**

Five-column grid with brand column, certification badges, and four link columns. Ink 950 background.

---

## Interactive Behaviours

Four JS behaviours run on the article page. All are pure vanilla JS — no library required.

| Behaviour           | Trigger               | Notes                                                       |
| ------------------- | --------------------- | ----------------------------------------------------------- |
| Reading progress    | `window` scroll event | Updates `width` on `#progress` bar                          |
| Scroll reveal       | IntersectionObserver  | Adds `.in` class on 8% threshold; runs once per element     |
| TOC active tracking | IntersectionObserver  | `rootMargin: '-20% 0% -72% 0%'` for mid-viewport activation |
| Custom cursor       | `mousemove` event     | Dot follows instantly; ring interpolates at 11% per frame   |

### Scroll reveal

```js
const io = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }),
  { threshold: 0.08 }
);
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```

Initial state: `opacity: 0; transform: translateY(16px)`. Final state: `opacity: 1; transform: translateY(0)`. Uses `--dur-slow` (400ms) + `--ease-out`. Wrap in `@media (prefers-reduced-motion: no-preference)`.

### TOC active tracking

Observes all `h2[id]` elements within `.article-body`. Activates the corresponding TOC link when the heading enters the trigger zone. Only one link is active at a time.

The `rootMargin: '-20% 0% -72% 0%'` creates a trigger band from 20% to 28% down the viewport — the heading activates when it's in the natural reading position, not when it just enters the screen edge.

---

## CMS Data Model

### Article collection (PayloadCMS)

| Field                 | Type                               | Required | Notes                                    |
| --------------------- | ---------------------------------- | -------- | ---------------------------------------- |
| `title`               | Rich text (inline)                 | ✓        | Supports `<em>` for Signal italic accent |
| `slug`                | Text (unique)                      | ✓        | Auto-generated from title                |
| `deck`                | Text                               | ✓        | Subtitle. Max ~120 chars                 |
| `category`            | Relationship → Category            | ✓        | Single category                          |
| `tags`                | Relationship → Tag (array)         | —        | Max ~5                                   |
| `author`              | Relationship → Author              | ✓        |                                          |
| `publishedAt`         | Date                               | ✓        |                                          |
| `readingTime`         | Number                             | ✓        | Minutes. Manually set or auto-calculated |
| `deck`                | Text                               | ✓        | Header subtitle, ~120 chars              |
| `aioSsnippet.heading` | Text                               | —        | AIO snippet heading (e.g. Key Takeaways) |
| `aioSsnippet.summary` | Rich text                          | —        | AIO snippet summary paragraph            |
| `aioSsnippet.facts`   | Array: `{term, definition}`        | —        | Max 4 items                              |
| `content`             | Blocks (rich text + custom blocks) | ✓        | See block types below                    |
| `relatedArticles`     | Relationship → Article (array)     | —        | Max 3                                    |
| `seo.title`           | Text                               | —        | Overrides default title tag              |
| `seo.description`     | Text                               | —        |                                          |
| `seo.ogImage`         | Media                              | —        |                                          |

### Content block types

| Block type    | Fields                                        | Maps to component        |
| ------------- | --------------------------------------------- | ------------------------ |
| `richText`    | `content: Lexical richText`                   | C-07 Article Body        |
| `statCallout` | `stats[]: {value, label}`                     | C-08 Inline Stat Callout |
| `pullQuote`   | `quote: text`                                 | C-09 Pull Quote          |
| `codeBlock`   | `headerLabel, headerTag, code: text`          | C-10 Code Block          |
| `aioSnippet`  | `core: richText, facts[]: {term, definition}` | C-06 AIO Snippet         |

### Author collection

| Field      | Type | Notes                                       |
| ---------- | ---- | ------------------------------------------- |
| `name`     | Text | Display name                                |
| `initials` | Text | 2 chars for avatar (e.g. "HA")              |
| `role`     | Text | e.g. "Founder, GRCMANA"                     |
| `bio`      | Text | Long-form, shown in article footer bio card |

---

## Token Requirements

All tokens are defined globally in the design system. The table below confirms which are required for the article page and flags any that may not yet be in the global CSS file.

| Token                           | Value                           | Used in                                 |
| ------------------------------- | ------------------------------- | --------------------------------------- |
| `--ink-950` through `--ink-100` | See design system               | Throughout                              |
| `--signal-500`                  | `#e8ff47`                       | Progress bar, TOC active, CTA, accents  |
| `--signal-a06`                  | `rgba(232,255,71,0.06)`         | AIO snippet bg, pull quote bg           |
| `--signal-a12`                  | `rgba(232,255,71,0.12)`         | AIO snippet hover states                |
| `--border`                      | `rgba(255,255,255,0.05)`        | All hairline dividers                   |
| `--border-hover`                | `rgba(255,255,255,0.10)`        | Hover states                            |
| `--section-y`                   | `120px`                         | Article layout, related articles        |
| `--section-y-hero`              | `160px`                         | Article header, CTA Close               |
| `--container-narrow`            | `720px`                         | Article header, article footer collapse |
| `--container-max`               | `1200px`                        | Related articles, footer                |
| `--ease-out`                    | `cubic-bezier(0.16, 1, 0.3, 1)` | All transitions                         |
| `--dur-fast`                    | `150ms`                         | Micro-interactions                      |
| `--dur-base`                    | `250ms`                         | Card hovers                             |
| `--dur-slow`                    | `400ms`                         | Scroll reveal                           |
| `--gap-tight`                   | `8px`                           | Eyebrow → headline                      |
| `--gap-base`                    | `20px`                          | Headline → body                         |
| `--gap-loose`                   | `40px`                          | Body → CTA                              |