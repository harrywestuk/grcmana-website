# GRCMANA Brand Design System v1.2

> **Version:** v1.2 — 2025 · **Owner:** GRCMANA (part of The Mana Consortium)
> Primary palette, typography, components, and usage rules for dark and light surfaces.

---

## Table of Contents

- [GRCMANA Brand Design System v1.2](#grcmana-brand-design-system-v12)
  - [Table of Contents](#table-of-contents)
  - [1. Visual Identity \& Brand Vibe](#1-visual-identity--brand-vibe)
  - [2. Layout](#2-layout)
    - [Spacing Scale](#spacing-scale)
    - [Page \& Container Widths](#page--container-widths)
    - [Container Modifier Rules](#container-modifier-rules)
    - [Container-to-Section Mapping](#container-to-section-mapping)
    - [Horizontal Gutter (responsive)](#horizontal-gutter-responsive)
    - [Section Vertical Rhythm](#section-vertical-rhythm)
    - [Reference Tokens \& Container](#reference-tokens--container)
    - [Full-Bleed Rule (Dark Zones)](#full-bleed-rule-dark-zones)
    - [Section Anatomy Templates](#section-anatomy-templates)
      - [Canonical Page Flow](#canonical-page-flow)
      - [Template 1 — Standard Feature Section](#template-1--standard-feature-section)
      - [Template 2 — Hero Section](#template-2--hero-section)
      - [Template 3 — Dark Zone / Full-Bleed Band](#template-3--dark-zone--full-bleed-band)
      - [Template 4 — Product Preview Section (Split Container)](#template-4--product-preview-section-split-container)
      - [Template 5 — Testimonial Section](#template-5--testimonial-section)
      - [Template 6 — CTA Close Section](#template-6--cta-close-section)
      - [Template 7 — Narrow Copy / Editorial Section](#template-7--narrow-copy--editorial-section)
    - [HubSpot Implementation](#hubspot-implementation)
  - [3. Colour System](#3-colour-system)
    - [Brand — Signal Yellow](#brand--signal-yellow)
    - [Neutrals — Ink Ramp](#neutrals--ink-ramp)
    - [Semantic — Status \& Feedback (Dark)](#semantic--status--feedback-dark)
    - [Semantic — Light Mode (darkened for AA on white)](#semantic--light-mode-darkened-for-aa-on-white)
    - [Dark-Mode Pairings](#dark-mode-pairings)
    - [Light-Mode Pairings](#light-mode-pairings)
  - [4. Typography](#4-typography)
    - [Type Scale (tokens)](#type-scale-tokens)
    - [Display Scale Usage](#display-scale-usage)
    - [Sans Scale Usage](#sans-scale-usage)
    - [Mono Scale Usage](#mono-scale-usage)
    - [Canonical Pairings](#canonical-pairings)
    - [Eyebrow Label Rules](#eyebrow-label-rules)
    - [Body Copy Bold Rule](#body-copy-bold-rule)
  - [5. Button System](#5-button-system)
    - [Variants (Dark)](#variants-dark)
    - [Sizes](#sizes)
    - [States](#states)
    - [Light-Surface Variants](#light-surface-variants)
    - [CTA Pair Pattern](#cta-pair-pattern)
  - [6. Form Elements](#6-form-elements)
  - [7. Badges \& Tags](#7-badges--tags)
  - [8. Card Components](#8-card-components)
    - [Hover Elevation](#hover-elevation)
    - [Core Cards](#core-cards)
    - [Testimonial Component](#testimonial-component)
    - [Proof Strip Component](#proof-strip-component)
    - [Product Preview Component](#product-preview-component)
    - [Section Tabs Component](#section-tabs-component)
    - [Inline Stat Component](#inline-stat-component)
  - [9. Alerts \& Notifications](#9-alerts--notifications)
  - [10. Navigation Component](#10-navigation-component)
    - [Global Nav Structure](#global-nav-structure)
    - [Mega-Menu Item Anatomy](#mega-menu-item-anatomy)
    - [Mega-Menu Group Structure](#mega-menu-group-structure)
    - [Light Mode Nav](#light-mode-nav)
  - [11. Light Mode — Page Anatomy](#11-light-mode--page-anatomy)
    - [Surface Hierarchy](#surface-hierarchy)
    - [The Dark-Zone Pattern (canonical)](#the-dark-zone-pattern-canonical)
    - [Cursor Behaviour](#cursor-behaviour)
  - [12. Token Reference](#12-token-reference)
    - [Spacing \& Layout](#spacing--layout)
    - [Radius](#radius)
    - [Shadows (Dark)](#shadows-dark)
    - [Shadows (Light)](#shadows-light)
    - [Borders](#borders)
    - [Light-Mode Text](#light-mode-text)
    - [Motion](#motion)
    - [Scroll Reveal Pattern](#scroll-reveal-pattern)
  - [13. Usage Rules](#13-usage-rules)
    - [✓ Do](#-do)
    - [✗ Never](#-never)
  - [Strategic Implementation Directive](#strategic-implementation-directive)
    - [**Phase 0: Token Foundation**](#phase-0-token-foundation)
    - [**Phase 1: Mode Architecture**](#phase-1-mode-architecture)
    - [**Phase 2: Component Construction**](#phase-2-component-construction)
    - [**Phase 3: Webflow / Platform Migration**](#phase-3-webflow--platform-migration)
    - [**Phase 4: Trust Surfaces**](#phase-4-trust-surfaces)

---

## 1. Visual Identity & Brand Vibe

* **Aesthetic:** "Tech-native authority." High-contrast, sharp-cornered, utility-first — engineered to make GRC look like a solvable engineering problem rather than a paperwork exercise.
* **Signature move:** `DM Serif Display` italic paired with a Signal Yellow accent (yellow text on dark, highlighter swatch on light). This is the single most recognisable GRCMANA visual cue.
* **Hard rule:** Zero border radius, everywhere. Sharp corners are a brand signature across buttons, cards, inputs, modals, and images, in both modes.
* **Primary Goal:** Premium, precise, and credible. Signal Yellow is used scarcely and intentionally so it always reads as a signal, never as decoration.

## 2. Layout

All spacing, padding, and margins resolve from a single scale applied at three levels — **page**, **section**, and **container**. Never hardcode pixel spacing; reference the tokens so rhythm stays consistent and responsive. The page-level tokens (`--container-*`, `--gutter`, `--section-y`) are what inset content from the viewport edge — without them, content runs full-bleed on every breakpoint.

### Spacing Scale

The foundation for every padding, margin, and gap value in the system.

* `--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 20 · `--space-6` 24
* `--space-8` 32 · `--space-10` 40 · `--space-12` 48 · `--space-16` 64 · `--space-20` 80 · `--space-24` 96
* `--space-30` 120 · `--space-40` 160 (px) — reserved for section vertical rhythm only.

### Page & Container Widths

The container is the max-width wrapper that centres and constrains content. Three widths cover all layouts.

* **`--container-max` `1200px`:** Default content width for standard pages and component grids.
* **`--container-narrow` `720px`:** Long-form reading — guides, articles, single-column copy.
* **`--container-wide` `1440px`:** Dashboards, wide hero layouts, dense data surfaces.

### Container Modifier Rules

`container--narrow` and `container--wide` are modifier classes — they only set `max-width`. They carry none of the base layout properties (`width: 100%`, `margin-inline: auto`, `padding-inline: var(--gutter)`). Using either modifier without the base class produces a left-anchored, unguttered block with no centring. The error is easy to introduce and difficult to spot unless sections are compared side by side.

**Hard rule: modifier classes are always additive. Always combine with the base `.container`.**

```html
<!-- ✓ Correct -->
<div class="container container--wide">...</div>
<div class="container container--narrow">...</div>

<!-- ✗ Wrong — left-anchored, no gutter, no centring -->
<div class="container--wide">...</div>
<div class="container--narrow">...</div>
```

**Split-container rule:** When a section contains a standard-width header and a wider or narrower content block, use two separate container divs — never stretch a single container to accommodate both. The section header must always use `.container` (1200px) to align with the page grid. Only the content artefact gets the alternate-width container. The practical template for this is Template 4 in Section Anatomy Templates below.

### Container-to-Section Mapping

Different section types use different container widths. This mapping is a hard rule — mixing widths without intention breaks the visual alignment that makes a page feel structured.

| Section type | Container | Rationale |
|---|---|---|
| Hero headline + body copy | `--container-narrow` (720px) | Constrains line length; copy reads as intentional, not sprawling |
| Feature grids, card grids, two-column layouts | `--container-max` (1200px) | Standard page rhythm for most content sections |
| Product previews, UI screenshots, data tables | `--container-wide` (1440px) | Let the artefact breathe; feels immersive rather than boxed |
| Dark zone bands (ticker, metrics, CTA close) | Full-bleed background + `--container-max` inner | Background always edge-to-edge; content aligns with page grid |

### Horizontal Gutter (responsive)

The gutter is the page-level horizontal padding — the minimum inset between content and the viewport edge. It steps down at each breakpoint and always resolves from the spacing scale.

* **Desktop (default):** `--gutter: var(--space-12)` → 48px.
* **Tablet (≤ 1024px):** `--gutter: var(--space-8)` → 32px.
* **Mobile (≤ 640px):** `--gutter: var(--space-5)` → 20px.

### Section Vertical Rhythm

`--section-y` is the vertical padding above and below each page section, setting the overall page rhythm. Premium, spacious layouts require genuinely generous padding — the "breathing room" quality that makes a page feel expensive is almost entirely a function of this token.

* **Desktop (default):** `--section-y: var(--space-30)` → 120px.
* **Hero / CTA-close (desktop):** `--section-y-hero: var(--space-40)` → 160px — applied to the hero section, the metrics dark zone, and the CTA-close section only. These three moments are where extra air drives the most impact.
* **Mobile (≤ 640px):** `--section-y: var(--space-20)` → 80px.

### Reference Tokens & Container

```css
:root {
  --container-max:    1200px;
  --container-narrow: 720px;
  --container-wide:   1440px;
  --gutter:         var(--space-12);  /* 48px desktop */
  --section-y:      var(--space-30);  /* 120px desktop */
  --section-y-hero: var(--space-40);  /* 160px — hero, metrics band, CTA close */

  /* Semantic gap tokens — use within section intros and hero stacks */
  --gap-tight:  8px;   /* eyebrow → headline */
  --gap-base:  20px;   /* headline → body copy */
  --gap-loose: 40px;   /* body copy → CTA pair */
}

@media (max-width: 1024px) { :root { --gutter: var(--space-8); } }   /* 32px */
@media (max-width: 640px)  {
  :root { --gutter: var(--space-5); --section-y: var(--space-20); }   /* 20px / 80px */
}

.container {
  width: 100%;
  max-width: var(--container-max);
  margin-inline: auto;
  padding-inline: var(--gutter);
}

section {
  padding-block: var(--section-y);
}

section.hero,
section.cta-close,
section.metrics-band {
  padding-block: var(--section-y-hero);
}
```

### Full-Bleed Rule (Dark Zones)

Section *backgrounds* always run edge-to-edge; the *content* inside them is constrained by a container. This is what lets the dark-zone pattern (Section 11) read as full-width Ink bands while their content stays aligned with the rest of the page. Never constrain a dark zone's background to the container width — the band must touch both viewport edges, with only its inner content insetting via `.container`.

### Section Anatomy Templates

Every section on every page follows one of these seven patterns. Copy the relevant template and fill in the content — never freestyle the container structure. The section header must always use `.container` (1200px) regardless of what the content below it uses.

#### Canonical Page Flow

The reference sequence for a homepage or landing page. Every new page starts from this skeleton and removes or reorders sections as needed.

```
Nav ························ Sticky, 60px, Ink 900 + backdrop blur
├── Hero ··················· Template 2 · container--narrow · section-y-hero
├── Proof Strip ············ Template 3 · Ink 800 band · section-y
├── Feature Section ········ Template 1 · standard · section-y
├── Framework Section ······ Template 1 · Ink 950 bg · section-y
├── Metrics Band ··········· Template 3 · Dark Zone 2 · Ink 950 · section-y-hero
├── Testimonial ············ Template 5 · standard · section-y
├── Product Preview ········ Template 4 · split container · section-y
├── Community Strip ········ Template 3 · border band · section-y compressed
├── CTA Close ·············· Template 6 · Dark Zone 3 · Ink 950 · section-y-hero
└── Footer ················· Ink 950 · 64px block padding
```

---

#### Template 1 — Standard Feature Section

Use for: service cards, framework phases, two-column features, blog lists, stat card grids — any section whose header and content share the same 1200px max-width.

```html
<section class="[name]">
  <div class="container">                        <!-- 1200px · guttered · centred -->

    <div class="s-header">
      <span class="eyebrow">Label</span>         <!-- DM Mono · max 3 words · no punctuation -->
      <h2>Headline with <em>italic signal accent</em></h2>
      <p>Supporting body copy. Max ~460px natural width via s-header__body class.</p>
    </div>

    <div class="[content-grid]">                 <!-- grid, list, or two-column layout -->
      <!-- cards, panels, etc. -->
    </div>

  </div>
</section>
```

> **Key rule:** A background colour on this section type lives on the `<section>` element, not the `.container`. Set `background: var(--ink-950)` on the section to create a full-bleed dark band while keeping content on the grid.

---

#### Template 2 — Hero Section

Use for: the page hero only. One per page. The narrow container constrains headline line length to a deliberate, intentional width. The padding-top accounts for the fixed nav height (60px).

```html
<section class="hero">              <!-- padding: calc(section-y-hero + 60px) top, section-y-hero bottom -->
  <div class="container container--narrow">    <!-- 720px · copy line length controlled here -->

    <span class="eyebrow">Max 3 words</span>   <!-- gap-tight below -->
    <h1>Headline with <em>italic signal accent</em></h1>   <!-- gap-base below -->
    <p>Body copy. Naturally constrained to a readable line length by the narrow container.</p>

    <div class="cta-pair">                     <!-- gap-loose above -->
      <a href="#" class="btn btn--primary btn--lg">Primary Action →</a>
      <a href="#" class="btn btn--ghost btn--lg">Secondary Action</a>
    </div>

    <!-- Optional: trust badge strip -->
    <div class="hero__trust">
      <span class="trust-badge">ISO 27001</span>
      <span class="trust-badge">ISO 42001</span>
      <!-- ... -->
    </div>

  </div>
</section>
```

> **Key rule:** Never widen this container to make the headline span more of the viewport. The narrow constraint is intentional — it makes the headline feel authored, not stretched.

---

#### Template 3 — Dark Zone / Full-Bleed Band

Use for: metrics band, proof strip, ticker, any section that uses a full-bleed surface change to create page rhythm. The background lives on the `<section>` element — never on `.container`.

```html
<!-- Background on <section> — this is what makes it full-bleed -->
<section class="[name]">            <!-- bg, border-top/bottom, padding-block all on section -->
  <div class="container">          <!-- 1200px · content aligned with page grid -->

    <div class="[content-grid]">
      <!-- metric items, proof items, logo strip, etc. -->
    </div>

  </div>
</section>
```

CSS for the section:

```css
.metrics-band {
  background: var(--ink-950);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding-block: var(--section-y-hero);  /* extra air for key dark zones */
}

.proof-strip {
  background: var(--ink-800);            /* lighter surface variation */
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding-block: var(--section-y);
}
```

> **Key rule:** Never put `background` on `.container`. A background on the container produces a 1200px-wide coloured rectangle on the page — not a full-bleed band. The section element IS the band; the container is only for constraining the content inside it.

---

#### Template 4 — Product Preview Section (Split Container)

Use for: any section that has a standard-width section header and a wider content artefact (dashboards, screenshots, data tables, code blocks). This is always two separate container divs — never a single stretched container.

```html
<section class="[name]">

  <!-- Header: ALWAYS standard container → aligns with every other section header -->
  <div class="container">
    <div class="s-header">
      <span class="eyebrow">Label</span>
      <h2>Headline</h2>
      <p>Body copy.</p>
    </div>
  </div>

  <!-- Artefact only: wide container → gives product room to breathe -->
  <div class="container container--wide">
    <div class="product-preview">
      <!-- dashboard, screenshot, data table, code block, etc. -->
    </div>
  </div>

</section>
```

> **Key rule:** If the section header is inside the wide container, it will be visibly wider than every other section header on the page. The misalignment is subtle on the left edge and becomes obvious when scrolling past adjacent sections. The header div and the artefact div are always separate. No exceptions.

---

#### Template 5 — Testimonial Section

Use for: single-quote testimonial blocks. The `.testimonial` component manages its own internal max-width (760px) and centring — the outer container stays at the standard 1200px.

```html
<section class="[name]">
  <div class="container">                         <!-- 1200px outer — do not use narrow here -->

    <div class="testimonial">                     <!-- component handles 760px max-width + centring -->
      <span class="testimonial__mark" aria-hidden="true">"</span>
      <blockquote class="testimonial__quote">
        Quote text. One bolded phrase of <strong>max 6 words — always the punchline</strong>.
      </blockquote>
      <div class="testimonial__attr">
        <div class="testimonial__rule"></div>
        <div>
          <div class="testimonial__name">Name</div>
          <div class="testimonial__role">Title, Company</div>
        </div>
      </div>
    </div>

  </div>
</section>
```

> **Key rule:** Do not put `container--narrow` on the outer container to try to match the testimonial width. The `.testimonial` component already constrains itself. Nesting a narrow container inside a standard container creates a double-inset that produces unexpected gutter behaviour at some breakpoints.

---

#### Template 6 — CTA Close Section

Use for: the page-closing CTA only. Always Dark Zone 3. Always uses `section-y-hero` padding. One per page, always the last content section before the footer.

```html
<!-- Always Dark Zone 3 · always last before footer -->
<section class="cta-close">               <!-- bg: ink-950 · padding: section-y-hero -->
  <div class="container container--narrow">   <!-- narrow keeps the copy intentional and focal -->

    <span class="eyebrow">Closing eyebrow</span>
    <h2>Headline with <em>italic signal accent</em></h2>
    <p>One or two tight lines. Direct. No padding copy.</p>

    <div class="cta-pair">
      <a href="#" class="btn btn--primary btn--lg">Primary Action →</a>
      <a href="#" class="btn btn--ghost btn--lg">Secondary Action</a>
    </div>

    <!-- Optional: DM Mono trust note below CTA pair -->
    <p class="cta-note">Brief reassurance · No commitment · Fixed-fee only</p>

  </div>
</section>
```

> **Key rule:** This section is always Ink 950 — one step darker than the page default — to signal closure. Signal Yellow is used at full opacity on the italic headline accent; this is one of the three permitted moments for full-opacity Signal on a dark ground.

---

#### Template 7 — Narrow Copy / Editorial Section

Use for: long-form articles, guides, announcement copy, single-column editorial content. The narrow container naturally constrains line length to a comfortable reading width (~66 characters at `--text-base`).

```html
<section class="[name]">
  <div class="container container--narrow">    <!-- 720px · comfortable reading line length -->

    <span class="eyebrow">Label</span>
    <h2>Headline</h2>
    <p>Long-form body copy. Line length is naturally constrained to a readable width
    by the narrow container — no explicit max-width on the paragraph required.</p>

    <!-- Additional paragraphs, lists, subheadings as needed -->

  </div>
</section>
```

> **Key rule:** Do not use this template for sections that contain cards, grids, or multi-column components. The narrow container will clip them. Use Template 1 (standard) and set `max-width` on the prose elements individually if a mixed layout is needed.

---

### HubSpot Implementation

HubSpot wraps drag-and-drop content in `.dnd-section > .row-fluid`. Apply the gutter and vertical rhythm to the section and the max-width to its inner row, so full-bleed backgrounds and inset content both come for free:

```css
.dnd-section {
  padding-block: var(--section-y);
  padding-inline: var(--gutter);
}
.dnd-section > .row-fluid {
  max-width: var(--container-max);
  margin-inline: auto;
}
```

## 3. Colour System

The palette is built on **Signal Yellow** (the one brand colour), an extended **Ink** neutral ramp, and a small semantic set. Dark mode is the default; light mode is a fully specified variant built on warm paper.

### Brand — Signal Yellow

* **Signal 400:** `#f0ff5a` — lighter / hover state.
* **Signal 500:** `#e8ff47` — **PRIMARY brand yellow.** CTAs, active states, key data points.
* **Signal 600:** `#d4f53c` — slightly warmer variant.
* **Signal 700:** `#b8d930` — dark surfaces / print; better contrast on white (used for eyebrows and accents on light).
* **Signal alphas:** `rgba(232,255,71,0.12)` and `rgba(232,255,71,0.06)` — subtle glows and tinted fills on dark surfaces.

### Neutrals — Ink Ramp

* **Ink 950:** `#07080a` — deepest near-black.
* **Ink 900:** `#0a0b0d` — **primary dark background.**
* **Ink 800:** `#111215` — raised surface / card.
* **Ink 700:** `#1a1c20` — elevated surface.
* **Ink 600 / 500 / 400:** `#252830` / `#363a44` / `#4d5260` — borders, dividers, mid tones.
* **Ink 300 / 200 / 100:** `#6b7280` / `#9ca3af` / `#d1d5db` — muted to light text.
* **Ink 50:** `#f5f3ef` — **warm off-white paper; the light-mode background.**
* **White:** `#ffffff`.

### Semantic — Status & Feedback (Dark)

* **Success:** `#22c55e` — compliant, passed, positive delta.
* **Warning:** `#f59e0b` — in progress, overdue, attention needed.
* **Danger:** `#ef4444` — critical findings, errors, non-conformances.
* **Info:** `#06b6d4` — informational, regulatory updates.

### Semantic — Light Mode (darkened for AA on white)

* **Success:** `#16a34a` · **Warning:** `#d97706` · **Danger:** `#dc2626` · **Info:** `#0891b2`.

### Dark-Mode Pairings

* **Primary Dark:** Signal 500 on Ink 900 — hero, CTA backgrounds, key data. Maximum contrast and brand impact.
* **Subtle Signal:** Low-opacity Signal on dark cards — data labels, secondary metadata, mono UI elements.
* **Outlined Signal:** Signal border (`rgba(232,255,71,0.2)`) with transparent fill — secondary tags, non-filled interactive states.
* **Cert Badge (Dark):** Low-contrast white-on-dark — footers and trust surfaces where subtlety beats emphasis.

### Light-Mode Pairings

* **Primary CTA (Light):** Ink 900 background with Signal text. Ink anchors the yellow rather than letting it float — the canonical light-mode primary CTA.
* **Signal Fill (Light):** Signal Yellow background with Ink text. For small secondary components only (buttons, tags, avatars).
* **Highlighter Accent (Light):** Signal as a text-highlight swatch behind italic serif words — the light-mode equivalent of the dark-mode signal italic. Same signature, different technique.
* **Cert Badge (Light):** Ink-mid text on paper/white with a hairline border — light-mode footers, proposals, trust surfaces.

## 4. Typography

A complete **three-font system**: Display for authority, Sans for clarity, Mono for precision. No other typefaces — no Inter, Roboto, or system fonts.

* **Display — `DM Serif Display`** (Georgia, serif fallback): Hero headlines, section titles, and metric values. The italic variant carries the brand. Tight negative tracking (`-0.02em` to `-0.03em`).
* **Sans — `Syne`** (system-ui fallback): UI headings, card titles, body copy. Weights 400 / 600 / 700 / 800.
* **Mono — `DM Mono`** (Courier New fallback): Buttons, labels, navigation, metadata, tags, eyebrows. Always UPPERCASE with `0.08–0.12em` letter-spacing.

### Type Scale (tokens)

* `--text-xs` 10px · `--text-sm` 12px · `--text-base` 14px · `--text-md` 16px · `--text-lg` 20px
* `--text-xl` 24px · `--text-2xl` 32px · `--text-3xl` 40px · `--text-4xl` 52px · `--text-5xl` 68px · `--text-6xl` 88px

### Display Scale Usage

* **6XL / 88px** (line-height 1.0, `-0.03em`) — hero H1, italic variant.
* **5XL / 68px** (line-height 1.0, `-0.025em`) — section CTA with Signal italic accent.
* **4XL / 52px** (line-height 1.05, `-0.02em`) — section H2.
* **3XL / 40px** (line-height 1.1, `-0.015em`) — H3 / card hero.

### Sans Scale Usage

* **800 / 22px** — UI headings, nav items, component titles.
* **700 / 16px** — service names, feature titles, card labels.
* **400 / 15px** (line-height 1.65) — body copy, descriptions, supporting text.

### Mono Scale Usage

* **MD / 13px / 500** — CTAs, buttons, primary actions.
* **SM / 10px / 400** (`0.1em`) — navigation, tags, metadata.
* **XS / 9px / 400** (`0.12em`) — eyebrows, timestamps, captions, legal.

### Canonical Pairings

* **Hero / Editorial:** `DM Mono` eyebrow → `DM Serif Display` H1 (with Signal italic em) → `Syne` body.
* **UI / Data:** `Syne` UI label → `DM Serif Display` metric value → `DM Mono` metadata → `Syne` body. On light, wrap the metric value in an Ink 900 swatch so the Signal yellow reads.

### Eyebrow Label Rules

Eyebrows are the most overused and most abused element in marketing typography. These rules are non-negotiable.

* **Maximum 3 words.** Eyebrows are signposts, not sentences.
* **No trailing punctuation.** No full stops, colons, or em-dashes at the end.
* **Sentence case always.** `Trust architecture` not `Trust Architecture` or `TRUST ARCHITECTURE`.
* **Muted colour always.** Eyebrows never use Signal Yellow except directly above a hero CTA on a dark ground.
* **Format:** `DM Mono`, 10px, uppercase, `0.1em` letter-spacing, `--ink-300` on dark / `--lm-text-muted` on light.

### Body Copy Bold Rule

One bolded phrase per paragraph is permitted to surface the key claim for skim readers. Use `Syne` 700.

* Bold the claim, not the flourish — the bolded phrase should be the single thing a reader walking away would remember.
* Maximum 6 words. Longer than six words means the claim isn't sharp enough.
* Never bold more than one phrase in the same paragraph.

## 5. Button System

All buttons use `DM Mono`, uppercase, letter-spaced `0.08em`. **No border radius.** Trailing arrows (`→ ↗ ↓`) are common.

### Variants (Dark)

* **Primary:** Signal 500 fill, Ink 900 text. Hover lifts (`translateY(-2px)`) with a Signal glow shadow.
* **Secondary:** Transparent with a hairline white border; hover brightens border and adds a faint fill.
* **Signal Outline:** Transparent with a Signal border (`rgba(232,255,71,0.25)`); hover fills to `rgba(232,255,71,0.06)`.
* **Ghost:** Transparent, muted white text; hover brightens to full white. No border.
* **Danger:** Danger fill, white text.

### Sizes

* **Small** 9px / `8px 14px` · **Medium** 11px / `12px 22px` · **Large** 12px / `16px 32px` · **X-Large** 13px / `20px 40px`.

### States

* **Loading:** opacity 0.6, `cursor: wait`, non-interactive.
* **Disabled:** opacity 0.3, `cursor: not-allowed`, non-interactive.

### Light-Surface Variants

* **Primary CTA:** Ink 900 fill, Signal text (premium light CTA). Disabled drops to ~35% opacity.
* **Signal Fill:** Signal 500 fill, Ink text — secondary highlight action.
* **Outlined:** Transparent, Ink text, `rgba(0,0,0,0.2)` border.
* **Ghost:** Transparent, Ink 300 text, no border.
* **Danger:** `#dc2626` fill, white text.

### CTA Pair Pattern

Every major section ends with exactly two CTAs — a primary and a secondary. A single isolated CTA is never used on a key conversion section.

* **Composition:** `[Primary: filled]` + `[Secondary: ghost or outline]`, always in that order, horizontal stack on desktop, vertical stack on mobile.
* **Label formula:** Verb-first, maximum 3 words. Examples: `Book a Call` / `See How It Works` · `Get Started` / `View Case Studies` · `Start Free` / `Talk to Sales`.
* **Spacing:** `--gap-loose` (40px) between body copy and the CTA pair. `--space-4` (16px) gap between the two buttons.
* **Never** place three CTAs in a pair. If a third action is needed, it goes below as a text link in `DM Mono`, muted, not as a third button.

## 6. Form Elements

Inputs, selects, checkboxes, and toggles — sharp-cornered and precise. Labels and inputs use `DM Mono`.

* **Labels:** `DM Mono`, 9px, uppercase, `0.1em`, muted.
* **Inputs (Dark):** `DM Mono` 12px, near-transparent fill (`rgba(255,255,255,0.03)`), hairline border. Focus shifts the border to Signal (`rgba(232,255,71,0.4)`) with a faint Signal-tinted background.
* **Inputs (Light):** White fill, `rgba(0,0,0,0.12)` border; focus darkens the border to `rgba(0,0,0,0.35)` with a soft `rgba(0,0,0,0.05)` focus ring.
* **Success / Error states:** Coloured borders (success / danger) with a matching hint or error message below.
* **Hints:** Small muted `DM Mono` below the field. **Error messages:** Danger-coloured.
* **Select:** Custom chevron via inline SVG; no native appearance.
* **Checkboxes:** Square (no radius); checked state uses a Signal fill / accent.
* **Toggle:** Two-state switch with a `DM Mono` label; "on" state reads as active.

## 7. Badges & Tags

Status indicators, certification badges, and semantic tags for data surfaces. All `DM Mono`, uppercase.

* **Status Tags:** `Live` (pulsing dot), `Certified`, `Compliant` (success), `In Progress` (warning), `Critical Finding` (danger), `New Regulation` (info), `Archived` (neutral). Outlined style with a small leading dot.
* **Solid Tags:** Filled tags for emphasis — e.g. `ISO 42001`, `AI Governance`, `New`, `Featured`.
* **Certification Badges (Footer / Trust):** Low-contrast outlined badges — `ISO 27001`, `ISO 42001`, `ISO 9001`, `Cyber Essentials`, `EU AI Act Ready`, `NIST AI RMF`.
* **Light Mode:** Tinted semantic backgrounds (`~8%` alpha) with AA-accessible borders and text; the `AI Governance` accent tag uses an Ink 900 fill with Signal text. Cert badges become Ink-mid text on white with a hairline border.

## 8. Card Components

Cards sit on dark surfaces with hairline borders (`rgba(255,255,255,0.05)`) and zero radius. Resting borders are deliberately subtle — depth is communicated through spacing and type weight, not cage lines.

### Hover Elevation

All interactive cards share the same hover state: border shifts to `--border-hover` (`rgba(255,255,255,0.10)`) and the card lifts with `transform: translateY(-2px)`. Transition uses `--duration-base` (250ms) + `--ease-out`. This applies to Service, Featured, and Proof Strip cards.

### Core Cards

* **Service Card:** Eyebrow tag (`01 — Service`), glyph icon, `Syne` title, body copy, and a Signal-outline action. An accent variant adds a Signal top-border sweep.
* **Featured Card:** Highlighted variant — Signal-bordered icon, a primary CTA, and a `Most Popular` tag.
* **Stat Card:** Large `DM Serif Display` metric value with a unit (e.g. `6wk`), a `Syne` label, and a `DM Mono` sub-line.
* **Data Cards:** Composite score with progress bar, framework coverage table (success/warning tags), and a quick-actions list of full-width buttons.
* **Light Mode:** White surface, hairline border, Signal icon fills. Featured cards take a 2px Ink 900 border. Metric values stay inside an Ink swatch so the yellow reads against paper. Subtle card shadows replace heavy borders.

### Testimonial Component

A structured quotation block — not a blockquote. Anatomy top to bottom:

1. **Opening mark:** Large `"` in `DM Serif Display`, Signal 500, no italic. Decorative; `aria-hidden`.
2. **Quote body:** `DM Serif Display` regular, `--text-2xl` (32px) on desktop, `--text-xl` (24px) on mobile. One to three sentences. **One phrase of 3–6 words is bolded** — always the punchline a skim reader should retain, never a flourish.
3. **Attribution row:** `Syne` 700 name + `Syne` 400 muted title, separated by a comma. E.g. *Sarah Chen, Head of InfoSec, Fintech Co.*
4. **Company logo:** SVG, height 20px, `--ink-200` fill on dark / `--ink-600` on light. Right-aligned or centred depending on layout.

Dark and light variants both required. On light, the quote body is `--lm-text-primary`; the bolded phrase wraps in a Signal highlighter swatch (the canonical light-mode accent technique).

### Proof Strip Component

A social proof band that pairs client logos with outcome statements. More credible than a logo parade because each mark is attached to a specific result.

* **Layout:** Horizontal scroll on mobile, fixed grid on desktop. Each item: [SVG logo] + [outcome sentence below or beside].
* **Logo:** SVG only, height 24px, muted fill (`--ink-300` on dark / `--lm-text-muted` on light). Never coloured brand logos — monochrome keeps the band clean.
* **Outcome sentence:** `DM Serif Display` italic, `--text-base` (14px), `--ink-200` on dark. One sentence, one outcome, past tense. E.g. *Closed a £400k enterprise deal after ISO 27001 certification.*
* **Never:** Use the Proof Strip as a decorative element. Every logo must have a verified outcome sentence. No placeholder logos.

### Product Preview Component

An inline dark card that renders actual product output — not a description of it. Used within feature sections to show the platform in action.

* **Anatomy:** Dark card (Ink 800 background, `--border` hairline, zero radius) with a top chrome bar (Ink 900, 36px tall, three dot indicators at left in `--ink-600`). Content area below the chrome.
* **Content:** Risk heatmaps, framework coverage tables, ISO evidence excerpts, policy diffs, audit logs. Whatever is most relevant to the section context.
* **Typography inside:** `DM Mono` for data, labels, and code. `Syne` for prose within the preview. All text sized down by one step from the surrounding page — the preview is a nested context.
* **Width:** Full `--container-wide` (1440px) when used as a hero-adjacent element; `--container-max` (1200px) when embedded in a two-column feature layout.

### Section Tabs Component

Horizontal tab navigation used at section level to switch between related content groups without a page reload. Distinct from global navigation.

* **Format:** `DM Mono` uppercase, 10px, `0.08em` letter-spacing. Tab labels max 2 words.
* **Active state:** Signal 500 `2px` bottom border, full-opacity label. Not a filled pill — the underline is the signal, not the fill.
* **Inactive state:** `--ink-300` label, no border.
* **Hover:** `--ink-100` label, no border.
* **Track:** A `1px` `--border` rule spans the full tab row width below all tabs.
* **Use for:** Switching between service categories, Trust Architecture phases, or framework types within a single section.

### Inline Stat Component

A metric callout that lives within a copy section, rather than in an isolated card. Used on proof and enterprise pages.

* **Anatomy:** `DM Serif Display`, `--text-4xl` (52px), Signal 500 on dark / Ink 900 on light. One line max. Unit or qualifier in `DM Mono`, `--text-sm` (12px), muted, directly below. E.g. `264%` → `increase in pipeline close rate`.
* **Usage:** Always surrounded by body copy context — never floating in empty space. Typically set in a two or three column inline grid alongside other stats.
* **Limit:** Maximum three inline stats per section. More than three reads as a stat card, which is a different component.

## 9. Alerts & Notifications

Inline alerts, toasts, and system messages — each keyed to a semantic colour via a left accent.

* **Signal:** Brand / regulatory headline alerts (e.g. *EU AI Act — Enforcement Active*).
* **Success:** Passed audits, completed milestones.
* **Warning:** Overdue reviews, attention items.
* **Danger:** Critical findings and conformance issues.
* **Info:** Framework updates and guidance.
* **Anatomy:** Leading icon (`⬡ ✓ ⚠ ✗ i`), a `Syne` bold title, and muted body copy.
* **Toasts:** Compact pill with a leading status dot (success / danger) and a short message.
* **Light Mode:** White card + left semantic border + soft box shadow. The Signal eyebrow steps down to **Signal 700 (`#b8d930`)** for contrast on white; semantic colours use the AA variants.

## 10. Navigation Component

The navigation is a trust surface — it positions GRCMANA before a prospect has read a single word of copy. Every element of the nav must carry its weight.

### Global Nav Structure

`[Logo] — [Mega-menu links] — [Utility: "Ask the Trust Architect"] — [Ghost: Log In] — [Primary: Book a Call]`

* **Logo:** Left-aligned. Links to homepage.
* **Mega-menu links:** Centre or left of centre. Max 4 top-level items.
* **Persistent CTAs:** Always visible. Ghost + Primary pair, right-aligned. Ghost = `Log In` or equivalent. Primary = the highest-value conversion action in `DM Mono` uppercase, Signal 500 fill.
* **Utility CTA:** Optional. An "Ask the Trust Architect" AI entry point if the product supports it — ghost style, left of the persistent CTAs.
* **Background:** Ink 900 with a `1px` `--border` bottom rule on dark. On light, `--lm-bg-raised` (white) with a `--lm-rule` bottom rule. Sticky on scroll.

### Mega-Menu Item Anatomy

Each item in a dropdown group is a two-line structure. This is the single most important nav pattern — it turns wayfinding into positioning.

```
[Icon or glyph — optional, 16px, --ink-300]
[DM Mono, 10px, uppercase, 0.08em — item title]
[Syne, 13px, --ink-300 on dark / --lm-text-muted on light — one-line description, max ~40 chars]
```

Example: `AI Governance` → *Assess and govern your AI risk landscape.*

* The description line is not optional. Every nav item must have one. If you cannot write a one-line description, the item should not exist in the nav.
* Descriptions are sentence case, end with a full stop, and speak directly to the value — not the feature name rephrased.

### Mega-Menu Group Structure

Groups are titled with a `DM Mono` uppercase category label (`--ink-500` on dark) that acts as a non-interactive divider. Items sit below in a single column or a two-column grid depending on count.

* 1–4 items: single column.
* 5–8 items: two-column grid.
* Never more than 8 items per group.

### Light Mode Nav

White surface (`--lm-bg-raised`), `--lm-rule` bottom border. All nav link text in `--lm-text-muted`; hover in `--lm-text-primary`. The persistent primary CTA remains Ink 900 fill with Signal text — the canonical light-mode CTA treatment.

## 11. Light Mode — Page Anatomy

Light mode is a **premium paper experience with intentional dark anchors**, not "dark mode with gaps."

### Surface Hierarchy

* **`--lm-bg-sunken` `#edeae4`:** Inset / recessed areas, inactive input backgrounds.
* **`--lm-bg` `#f5f3ef` (Ink 50):** Primary page background — warm paper. All body sections default here.
* **`--lm-bg-raised` `#ffffff`:** Elevated surfaces — cards, nav, footer, modals, popovers.
* **Dark Zone `#0a0b0d` (Ink 900):** Intentional dark bands. Signal Yellow is used at full opacity *only* here.

### The Dark-Zone Pattern (canonical)

The reference light-mode layout flows: **Nav → Ticker (Dark Zone 1) → Paper sections → Metrics Band (Dark Zone 2) → Paper sections → CTA Close (Dark Zone 3) → Footer.**

* Dark zones do two jobs: create visual rhythm so the light page never reads flat, and give Signal Yellow a dark ground at the highest-conversion moments.
* **Never exceed three dark zones** on a single page.
* **Never use a dark zone for decoration** — each must carry key content or drive a conversion (live intel ticker, proof-point metrics, closing CTA).

### Cursor Behaviour

* **Dark mode:** Default Signal Yellow dot; a Signal-bordered ring lags behind. On hover the dot scales 2× and the ring expands to 48px.
* **Light mode:** Default Ink dot (a yellow dot would be invisible on paper); ring is Ink 900 at 20% opacity. On hover the dot flips to Signal Yellow — a deliberate brand flash on interaction.

## 12. Token Reference

CSS custom properties for implementation in Webflow, code, or design tools. (Spacing and layout tokens are documented in full in Section 2.)

### Spacing & Layout

* **Spacing:** `--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 20 · `--space-6` 24 · `--space-8` 32 · `--space-10` 40 · `--space-12` 48 · `--space-16` 64 · `--space-20` 80 · `--space-24` 96 · `--space-30` 120 · `--space-40` 160 (px).
* **Containers:** `--container-max` 1200px · `--container-narrow` 720px · `--container-wide` 1440px.
* **Layout:** `--gutter` (48 / 32 / 20px responsive) · `--section-y` (120 / 80px responsive) · `--section-y-hero` 160px.
* **Semantic gaps:** `--gap-tight` 8px · `--gap-base` 20px · `--gap-loose` 40px.

### Radius

* `--radius-none` `0px` — **brand default: sharp corners everywhere, both modes.**
* `--radius-sm` `2px` · `--radius-md` `4px` — reserved; used sparingly if ever.

### Shadows (Dark)

* `--shadow-sm` `0 1px 3px rgba(0,0,0,0.4)`
* `--shadow-md` `0 4px 16px rgba(0,0,0,0.5)`
* `--shadow-glow` `0 0 32px rgba(232,255,71,0.12)`

### Shadows (Light)

* `--lm-shadow-card` `0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)` — default card lift.
* `--lm-shadow-raised` `0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)` — featured / active lift.

### Borders

* **Dark:** `--border` `rgba(255,255,255,0.05)` · `--border-hover` `rgba(255,255,255,0.10)`.
* **Light:** `--lm-rule` `rgba(0,0,0,0.08)` · `--lm-rule-mid` `rgba(0,0,0,0.12)` · `--lm-rule-strong` `rgba(0,0,0,0.20)`.

### Light-Mode Text

* `--lm-text-primary` `#0a0b0d` — headings, primary UI text.
* `--lm-text-mid` `#363a44` — body copy, secondary content.
* `--lm-text-muted` `#6b7280` — captions, nav links, placeholders.
* `--lm-text-faint` `#9ca3af` — hints, disabled, legal.

### Motion

* `--ease-out` `cubic-bezier(0.16, 1, 0.3, 1)` — standard easing for all transitions.
* `--ease-in` `cubic-bezier(0.7, 0, 0.84, 0)`.
* `--duration-fast` 150ms (micro-interactions) · `--duration-base` 250ms (default) · `--duration-slow` 400ms (reveals, top-border sweeps).

### Scroll Reveal Pattern

All major content sections animate in on scroll. The pattern uses the existing motion tokens — no additional library required.

```css
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity  var(--duration-slow) var(--ease-out),
    transform var(--duration-slow) var(--ease-out);
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

```js
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

**Sibling stagger:** When multiple `.reveal` elements share a parent (e.g. a card grid), stagger their `transition-delay` by 80ms per sibling — `0ms, 80ms, 160ms, 240ms`. Cap at 4 siblings before the stagger resets; beyond 4 the delay becomes perceptible as lag rather than choreography.

**Accessibility:** Always wrap animations in `@media (prefers-reduced-motion: no-preference)` — users who have requested reduced motion see elements in their final visible state with no animation.

## 13. Usage Rules

Non-negotiable rules to maintain visual integrity across all touchpoints.

### ✓ Do

* **Use Signal Yellow sparingly.** Reserve `#e8ff47` for the single most important element per view — CTA, active state, or key data point. Scarcity equals impact.
* **Pair `DM Serif Display` with italic Signal accents.** The italic serif + yellow combination is the distinctive GRCMANA signature — use it on hero, CTA, and section intros.
* **Use `DM Mono` for all labels, buttons, and metadata.** Monospace on interactive and data elements signals precision and technical authority. UPPERCASE + `0.08–0.12em`.
* **Use the highlighter technique on light.** On paper, Signal italic accents become a solid swatch behind the em word — like a highlighter pen. Never float yellow text on paper; always wrap it in a swatch (it fails WCAG otherwise).
* **Always pair CTAs.** Every key section ends with a primary + secondary CTA pair. A single isolated CTA is not used on conversion sections. Labels are verb-first, maximum 3 words.
* **Give sections room to breathe.** Apply `--section-y-hero` (160px) to hero, metrics band, and CTA-close sections. Never undershoot section padding — perceived quality scales directly with vertical air.
* **Attach an outcome to every client logo.** The Proof Strip component always pairs a logo with a specific, verified outcome sentence. A logo without an outcome is decoration.
* **Keep eyebrows short and muted.** Maximum 3 words, no trailing punctuation, sentence case, muted colour. An eyebrow that is long, bold, or Signal-coloured is not an eyebrow — it is a second headline.

### ✗ Never

* **Use rounded corners.** Zero border radius, everywhere — buttons, cards, inputs, modals, images.
* **Use Signal Yellow as a large background fill.** Yellow works for small elements (buttons, tags, swatches). Large yellow sections erode the premium feel.
* **Introduce additional typefaces.** The three-font system is complete — no Inter, no Roboto, no system fonts. `Syne` covers all UI copy at every weight.
* **Exceed three dark zones on a light-mode page.** More than three breaks the light-mode identity — the page reads as dark mode with gaps, not premium light with intentional anchors.
* **Place three buttons in a CTA pair.** Two buttons maximum. A third action, if necessary, becomes a text link in `DM Mono`, muted, beneath the pair — never a third button.
* **Use a nav item without a description line.** Every mega-menu item requires a one-line value description. An item that cannot be described in one sentence should not be in the nav.
* **Bold more than one phrase per paragraph.** One bolded punchline per paragraph, maximum 6 words. Bolding multiple phrases dilutes all of them.

---

## Strategic Implementation Directive

### **Phase 0: Token Foundation**

* Define the full `:root` token set (Signal ramp, Ink ramp, semantic dark + light, type scale, spacing, radius, shadows, motion, gap) before building any component.
* Set global defaults: dark mode `background: var(--ink-900)`, `color: var(--white)`; sharp corners (`--radius-none`) as the universal default.
* Define layout tokens up front (`--container-*`, `--gutter`, `--section-y`, `--section-y-hero`, `--gap-*`) and a base `.container` — without them, content runs full-bleed at every breakpoint and sections collapse to pocket-sized padding.

### **Phase 1: Mode Architecture**

* Treat dark mode as primary and light mode as a fully specified variant — not an afterthought. Map every dark token to its light equivalent (surfaces, text hierarchy, AA-accessible semantics, Signal 700 for accents on white).
* Establish the dark-zone scaffold for light pages: Ticker → Metrics → CTA, three maximum, each earning its place.

### **Phase 2: Component Construction**

* Build the core kit in token-driven order: Navigation → Buttons → Forms → Badges/Tags → Cards → Alerts. Ship dark and light variants together for each.
* Bake the signature into reusable primitives: the `DM Serif Display` italic + Signal accent (dark = coloured text, light = highlighter swatch) and the `DM Mono` uppercase label.
* Build the social proof layer — Proof Strip and Testimonial components — before any marketing page goes live. These are the highest-ROI components on enterprise-facing pages.
* Implement the scroll reveal pattern (`.reveal`) as a global interaction layer alongside cursor behaviour.

### **Phase 3: Webflow / Platform Migration**

* Port tokens to the target platform (Webflow brand migration is the pending blocker for deeper CSS work). Use CSS custom properties so values resolve from one source of truth.
* Implement cursor behaviour (Signal dot + lagging ring on dark; Ink dot flipping to Signal on hover on light) as a global interaction layer.

### **Phase 4: Trust Surfaces**

* Apply the cert-badge and data-card patterns to footers, proposals, and the Trust Centre — subtle, verified, strictly professional, with Signal reserved for the highest-conversion moments.