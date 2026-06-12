---
feature: blog-listings-matrix
branch: feat/blog-listings-matrix
status: ready
---

# Blog Listings Matrix — Implementation Specification

> **Source mockup:** `/docs/specs/blog-listing/mockup.html`
> **Stack:** Next.js · PayloadCMS · Tailwind or CSS Modules
> **Version:** 1.0 · June 2026

---

## Goal

Implement a performant, production-ready implementation of the Vercel-inspired Blog Listings Matrix for the GRCMANA index page based on the verified design layouts.

This page operates under a strict text-first constraint where articles do not utilize featured images. The layout architecture must flawlessly execute an infinite grid matrix using dashed column channels, integrate a sharp geometric category/search filter utility bar, and handle responsive viewport transitions cleanly down to mobile scales without triggering layout shifts or border overlapping issues.

## Design

### Master Layout Page Intro

The foundational introductory area that anchors the top of the blog index canvas, establishing brand orientation and displaying global platform diagnostics.

* **Sizing Bounds:** Constrained horizontally to match the master system grid via `max-width: var(--container-max)` (1200px) and padded internally via `padding-inline: 32px`.
* **Layout Mechanics:** Implements structural padding values defined by `margin-bottom: 48px` to provide breathing room before the utility toolbar.
* **Typographic System:** The primary label uses monospace tokens (`font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-400);`). The page title utilizes standard headline settings (`font-family: 'DM Serif Display', Georgia, serif; font-size: 56px; font-weight: 400; letter-spacing: -0.01em;`).

### High-Trust Filter & Search Utility Bar

A highly optimized utility band splitting the horizontal plane to handle taxonomy routing on the left and content filtering inputs on the right, matching the Vercel paradigm but translated to GRCMANA's sharp geometric style guide.

* **Layout Positioning:** Positioned inline using `display: flex; justify-content: space-between; align-items: center; gap: 24px;` with horizontal containment locked to `max-width: var(--container-max)`.
* **Filter Navigation Rails (Left):** Employs raw text links under an unrounded font behavior (`font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-300);`). Active tracking overrides background pills with a crisp bottom underline marker (`position: relative; color: var(--white);`) using an absolute-positioned border rule: `height: 1px; background: var(--signal-500);`.
* **Search Input Container (Right):** Modeled with zero border-radius to preserve technical styling bounds. Uses an input framework configured with `background: var(--ink-950); border: 1px solid var(--border); font-family: 'DM Mono', monospace; font-size: 11px; width: 240px;`. Focus hooks toggle the outer bounds smoothly to `border-color: var(--signal-500);`.
* **Monospace Feed Integration:** Pairs a sharp terminal-style RSS button (`width: 38px; height: 38px; border: 1px solid var(--border);`) next to the search input, utilizing layout color shifts to `background: var(--ink-800); border-color: var(--border-hover);` on hover vectors.
* **Responsive Reflow:** At `max-width: 768px`, the entire toolbar transitions via `flex-direction: column; align-items: flex-start; gap: 20px;`, allowing the category list and search block to stack sequentially.

### Infinite Column Matrix Grid

The core infinite grid display container that handles structural grouping and splits cell boundaries via full-height infinite column divider vectors.

* **Grid Engine:** Configured explicitly using a 3-column matrix definition: `display: grid; grid-template-columns: repeat(3, 1fr);` bounded by an outer wrapper running a master border rule: `border-left: 1px dashed var(--border); border-right: 1px dashed var(--border);`.
* **Responsive Reflow Breakpoints:** At `max-width: 1024px`, the grid scales down seamlessly to `grid-template-columns: repeat(2, 1fr);`. At mobile scales (`max-width: 730px`), it collapses completely to `grid-template-columns: 1fr;` with the right border toggled off via `border-right: none;`.

### Matrix Card Component (`C-05`)

A text-only card component that fills each grid location, balancing content density and metadata tracing to replace missing image anchors seamlessly.

* **Sizing Bounds & Spacing:** Padded internally to enforce uniform spacing gaps matching `padding: 48px 32px 64px 32px;`.
* **Infinite Layout Channels:** To maintain the infinite vertical border line grid, cell blocks are styled via `border-bottom: 1px dashed var(--border);`. Horizontal cell lines are drawn selectively by skipping trailing columns using selector overrides: `.matrix-item:not(:nth-child(3n)) { border-right: 1px dashed var(--border); }`.
* **Responsive Border Reflow:** At the `max-width: 1024px` threshold, column borders re-evaluate to drop 3rd-column tracking and capture paired layouts via `.matrix-item:not(:nth-child(2n)) { border-right: 1px dashed var(--border); }`. Below `730px`, all right border styles drop completely via `border-right: none !important;`.
* **Headline Component System:** Card titles employ your signature editorial font behaviors (`font-family: 'DM Serif Display', Georgia, serif; font-size: 26px; font-weight: 400; line-height: 1.25; color: var(--white); margin-bottom: 16px;`). Focus nodes bounded by standard `em` tags display un-skewed italic behaviors and inherit colors natively from parent elements.
* **Excerpt Text Clamping:** Summaries are limited to exactly three lines using text-truncation clamps: `display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;`.
* **GTM Interaction Triggers:** On user hover vectors, the cell backdrop darkens gently via `background-color: rgba(255, 255, 255, 0.01);`. The card headline text transitions smoothly to brand highlight `var(--signal-500)` and taxonomy headers lift to `var(--white)` using standard transition speeds (`var(--dur-fast)`).
