---
feature: article-header
branch: feat/article-header
status: approved-production
---

# Article Header Component (C-04) — Centered Editorial Stack

> **Source mockup verification:** `image_790a3c.png`
> **Upstream framework dependencies:** Next.js · PayloadCMS[cite: 9]
> **Version:** 3.0 · June 2026[cite: 9]

---

## Goal

Implement a distraction-free, highly scannable, and typographically dominant article header canvas. This structure strips out all box boundaries, decorative lines, and avatar containers, relying entirely on clean vertical tracking rules to position context, title, and metadata[cite: 11].

## Layout Architecture & Grid Mechanics

### 1. Structural Sizing Constraints

* **Column Bounds:** The interior container uses an tight layout envelope constrained to `max-width: var(--container-narrow)` (720px) to prevent headline reading lengths from overflowing optimal tracking parameters[cite: 9, 11].
* **Alignment Axis:** All elements are strictly bound to a unified vertical center line via `text-align: center` and `display: flex; flex-direction: column; align-items: center;`[cite: 11].
* **Vertical Spacing Buffer:** A clean breathing envelope is established using a master offset rule: `padding-top: calc(var(--section-y-hero) + 60px)` (clearing the fixed primary navbar safely) and `padding-bottom: 48px`[cite: 11].

### 2. Typographic Component Layers

#### Layer 1: Context Navigation Eyebrow (Top Placement)

* **Role:** Orients the user structurally within platform hubs (e.g., Blog or Vault spaces)[cite: 11, 13].
* **Typography:** `font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 400; letter-spacing: 0.12em; text-transform: uppercase;`[cite: 9, 14].
* **Color System:** All text tokens map to `--ink-200`[cite: 14]. Visual split tokens render explicitly as an un-spaced `>` character mapped to `--ink-300` to maintain baseline weight harmony[cite: 14].
* **Bottom Layout Margin:** Enforces a rigid spacing threshold of `margin-bottom: 24px`[cite: 13].

#### Layer 2: Main Title Headline (H1)

* **Typography:** `font-family: 'DM Serif Display', Georgia, serif; line-height: 1.05; letter-spacing: -0.025em; font-weight: 400;`[cite: 9, 11].
* **Responsive Scaling Fluidity:** Handled via a strict calculation curve: `font-size: clamp(38px, 5.5vw, 64px);`[cite: 11, 14].
* **Color Channels:** Default string fragments print in raw `--white`[cite: 9]. Inline thematic focus fragments are captured within `em` elements, transitioning to `font-style: italic;` and explicitly colored with brand token `--signal-500`[cite: 9].
* **Bottom Layout Margin:** Enforces a layout gap parameter of `margin-bottom: 36px`[cite: 11, 14].

#### Layer 3: Flat Editorial Metadata Row (Bottom Placement)

* **Role:** Attributes editorial source authority without creating structural layout clutter[cite: 11].
* **Layout Engine:** Rendered as a single flat string row via inline layout methods or `display: flex; justify-content: center; gap: 0;`[cite: 11, 14].
* **Typography:** `font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 400; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-300);`[cite: 11, 14].
* **Author Override Rule:** To establish an authoritative presence, the author name skips standard monospace behaviors, tracking instead to `font-family: 'Syne'; font-size: 13px; font-weight: 700; color: var(--white); text-transform: none; letter-spacing: normal;`[cite: 11, 14].
* **Data Field Splitters:** Individual fields are segmented via a middle dot character (`"·"`) set to color token `--ink-600` with horizontal spacing buffers defined cleanly via `margin-inline: 8px;`[cite: 11, 14].
