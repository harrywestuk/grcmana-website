# Component Command — Draft for Review

This file is a draft of the `.claude/commands/component.md` slash command.
When approved, copy the content between the `---` markers into `.claude/commands/component.md`.

---

## How to install

```bash
mkdir -p .claude/commands
cp docs/component-command.md .claude/commands/component.md
# Then remove the preamble above the command body below
```

---

<!-- BEGIN COMMAND — copy from here into .claude/commands/component.md -->

## Generate Component

Create a frontend React component named **$ARGUMENTS** for the GRCMANA website.

## What to build

- Component file: `src/components/$ARGUMENTS/index.tsx`
- If the component needs client-side behaviour (hooks, browser events, refs): add `'use client'` as the very first line. Otherwise omit it — the default is a React Server Component.
- No Storybook story is needed. This project does not use Storybook.

---

## File conventions

- **Named export only.** No default exports.
- **Props type before the component.** Define a `type $ARGUMENTSProps = { ... }` (or `Props` if the file is unambiguous) and annotate the component as `React.FC<$ARGUMENTSProps>`.
- **No `any`.** Explicit return types on all functions.
- **File naming:** the directory is PascalCase (`$ARGUMENTS/`), the file is `index.tsx`.
- **Path alias:** import from `@/` (maps to `src/`). Never use relative `../../` paths.
- **`cn()` for conditional classNames:** import from `@/utilities/ui`.
- **Payload types:** if the component consumes Payload CMS data, import the generated type from `@/payload-types` — never write inline type shapes that duplicate the schema.

Example skeleton:

```tsx
// 'use client'   ← add only if hooks/browser APIs are used

import React from 'react'
// import { cn } from '@/utilities/ui'   ← add if merging class strings

type $ARGUMENTSProps = {
  // define props here
}

export const $ARGUMENTS: React.FC<$ARGUMENTSProps> = ({ /* destructure props */ }) => {
  return (
    // JSX
  )
}
```

---

## Design system — required reading before writing any JSX

The full design system is in `docs/design-system/design-system.md`. The rules below are the most critical; do not deviate from them.

### Typography — three fonts, three Tailwind utilities

| Role | Font | Tailwind class | Fallback (for reference) |
| --- | --- | --- | --- |
| Display / headlines | DM Serif Display | `font-display` | Georgia, serif |
| Body / UI | Syne | `font-sans` | system-ui, sans-serif |
| Labels / mono | DM Mono | `font-mono` | monospace |

DM Mono is always `uppercase` with `tracking-[0.08em]` to `tracking-[0.12em]`.

### Colours — signal is scarce

All design system colours are available as Tailwind utilities:

```text
Dark backgrounds : bg-ink-900 (page) · bg-ink-950 (dark zone) · bg-ink-800 (card)
Text            : text-white · text-ink-200 (body) · text-ink-300 (muted) · text-ink-100 (light)
Signal yellow   : text-signal-500 / bg-signal-500 — ONE prominent use per view. Never as a large fill.
Borders         : border-ds-border (resting) · border-ds-border-hover (hover) · border-ds-border-signal (signal outline)
Semantic        : text-ds-success · text-ds-warning · text-ds-danger · text-ds-info
Signal alphas   : bg-signal-a12 · bg-signal-a06 · bg-signal-a04 · bg-signal-a03
```

Signal yellow on the italic `<em>` in headings is the brand signature:

```tsx
<em className="italic text-signal-500">accent word</em>
```

### Shape — zero border radius

No `rounded-*` classes on GRCMANA components. Zero border radius everywhere: buttons, cards, inputs, images, modals. No exceptions.

### Spacing — semantic tokens available as Tailwind utilities

```text
Gap tokens    : gap-tight (8px) · gap-base (20px) · gap-loose (40px)
               Also usable as: mt-loose, mb-base, px-tight, etc.
Section y     : py-section-y (120px desktop, 72px mobile)
               py-section-hero (160px desktop, 96px mobile) — hero, metrics band, CTA close only
Gutter        : handled by .container — do not re-apply manually
```

### Motion

```text
Duration  : duration-fast (150ms) · duration-base (250ms) · duration-slow (400ms)
Easing    : ease-brand (cubic-bezier(0.16,1,0.3,1)) — brand standard for all transitions
```

All interactive elements use `transition-all duration-base ease-brand`.

---

## Styling approach — Tailwind-first

**Use Tailwind utility classes for everything.** The GRCMANA design system tokens are registered in `@theme` in `globals.css` and resolve as Tailwind utilities. Do not use inline `style` props except for the specific cases listed below.

| Use case | Approach |
| --- | --- |
| Colour, background, border, text | Tailwind (`bg-ink-900`, `text-signal-500`, `border-ds-border`) |
| Spacing, padding, gap | Tailwind (`py-section-y`, `gap-loose`, `px-8`) |
| Hover / focus states | Tailwind (`hover:border-ds-border-hover`, `hover:-translate-y-0.5`) |
| Responsive breakpoints | Tailwind (`md:grid-cols-3`) |
| Conditional classes | `cn()` from `@/utilities/ui` |
| Reusable multi-property patterns | Named class in `globals.css` (`.eyebrow`, `.container`, `.grid-phases`) |
| `clamp()` responsive font sizes | Named class in `globals.css` (`.text-display-h1`, `.text-display-h2`, etc.) |
| Truly dynamic computed values | Inline `style` — last resort only |

**Named display heading classes** (apply alongside `font-display font-normal`):

| Class | Use |
| --- | --- |
| `.text-display-h1` | H1 hero (`clamp(52px, 8vw, 88px)`) |
| `.text-display-cta` | CTA close headline (`clamp(36px, 5vw, 60px)`) |
| `.text-display-h2` | Standard section H2 (`clamp(36px, 4vw, 52px)`) |
| `.text-display-h3` | H3 / card hero (`clamp(28px, 3vw, 40px)`) |
| `.text-metric` | Metric numeral (`clamp(48px, 6vw, 72px)`) |

Usage:

```tsx
<h2 className="font-display font-normal text-display-h2 reveal">…</h2>
```

---

## Layout — containers and sections

Sections use one of these structures — choose the right one:

```tsx
// Template 1 — Standard section (most components)
<section className="py-section-y">
  <div className="container">        {/* 1200px centred with gutter */}
    {/* content */}
  </div>
</section>

// Template 2 — Hero section
<section className="py-section-hero">
  <div className="container container--narrow">   {/* 720px */}
    {/* headline, body, CTA pair */}
  </div>
</section>

// Template 3 — Dark zone / full-bleed band
<section className="bg-ink-950 border-y border-ds-border py-section-y">
  <div className="container">
    {/* content */}
  </div>
</section>

// Template 4 — Split container (standard header + wide artefact)
<section className="py-section-y">
  <div className="container">          {/* header always at 1200px */}
    <div className="s-header">…</div>
  </div>
  <div className="container container--wide">   {/* artefact at 1440px */}
    {/* product preview, screenshot, table */}
  </div>
</section>
```

**Hard rule:** Background colour lives on `<section>`, never on `.container`. A background on `.container` produces a 1200px rectangle, not a full-bleed band.

**Hard rule:** `container--narrow` and `container--wide` are modifiers — always pair with the base `container` class.

---

## Section header anatomy

Every section that has a header follows this stack, top to bottom:

```tsx
{eyebrow && (
  <span className="reveal eyebrow">{eyebrow}</span>
)}
{(heading || headingAccent) && (
  <h2 className={`reveal font-display font-normal text-display-h2 ${body ? 'mb-base' : 'mb-loose'}`}>
    {heading}
    {heading && headingAccent && ' '}
    {headingAccent && (
      <em className="italic text-signal-500">{headingAccent}</em>
    )}
  </h2>
)}
{body && (
  <p className="reveal font-sans text-[16px] leading-[1.65] text-ink-200">
    {body}
  </p>
)}
```

Eyebrow rules:

- Max 3 words. No trailing punctuation. Sentence case.
- The `.eyebrow` CSS class handles font, size, transform, and colour — never override the colour to Signal unless directly above a hero CTA on a dark ground (use `.eyebrow--signal` modifier in that case).

---

## Scroll reveal

Add `className="reveal"` to any element that should animate in on scroll. For staggered siblings in a grid, add `data-d="1"`, `data-d="2"`, `data-d="3"` (max 4 steps before the stagger resets). The animation is defined in `globals.css` and driven by `ScrollReveal` already mounted in the layout — no extra setup required.

```tsx
<div className="reveal" data-d="1">First card</div>
<div className="reveal" data-d="2">Second card</div>
<div className="reveal" data-d="3">Third card</div>
```

---

## CTA pair pattern

Every section with a primary action must end with a primary + secondary pair. Never a single isolated CTA on a conversion section.

```tsx
<div className="flex items-center gap-3.5 flex-wrap mt-loose">
  {/* Primary — Signal fill */}
  <Link
    href={primaryHref}
    className="font-mono text-[12px] font-medium tracking-[0.08em] uppercase bg-signal-500 text-ink-900 px-8 py-4 inline-flex items-center gap-1.5 no-underline transition-all duration-base ease-brand hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
  >
    Primary Action →
  </Link>
  {/* Secondary — ghost */}
  <Link
    href={secondaryHref}
    className="font-mono text-[12px] font-medium tracking-[0.08em] uppercase bg-transparent text-ink-200 px-8 py-4 border border-ds-border inline-flex items-center gap-1.5 no-underline transition-all duration-base ease-brand hover:border-ds-border-hover hover:text-white"
  >
    Secondary Action
  </Link>
</div>
```

Label formula: verb-first, maximum 3 words. Example: `Book a Call` / `See How It Works`.

---

## Card pattern

Cards sit on raised surfaces with a hairline border and zero radius. Interactive cards lift on hover — achieved entirely with Tailwind, no JS required.

```tsx
<div className="reveal bg-ink-800 border border-ds-border p-8 transition-all duration-base ease-brand hover:border-ds-border-hover hover:-translate-y-0.5">
  {/* card content */}
</div>
```

---

## Checklist before finishing

- [ ] Named export (not default)
- [ ] Props type defined above the component
- [ ] No `any`, explicit return types
- [ ] `'use client'` present only if hooks or browser APIs are used
- [ ] No `rounded-*` classes on any element
- [ ] All colours, spacing, and motion use Tailwind utilities backed by design system tokens
- [ ] No inline `style` props except for truly dynamic computed values
- [ ] Signal yellow used for exactly one prominent accent per view; not as a large fill
- [ ] `.reveal` applied to elements that should animate in on scroll
- [ ] If the component introduces new layout-level CSS (grids, responsive helpers, multi-property patterns), add it to `globals.css` under the appropriate section — not inside the component file

<!-- END COMMAND -->
