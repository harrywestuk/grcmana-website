---
feature: article-layout
branch: feat/article-layout
status: ready
---

# Article Two Column Layout — Implementation Specification

> **Source mockup:** `/docs/specs/article-layout/mockup.html`
> **Stack:** Next.js · PayloadCMS · Tailwind or CSS Modules
> **Version:** 1.0 · June 2026

---

## Goal

Implement a robust, performant, and production-ready implementation of the primary Article Layout Grid for the GRCMANA article page based on the layout specification and structural mocks.

The grid system must flawlessly orchestrate the spatial and visual relationship between the left-hand column (Sticky TOC) and the right-hand column (Article Body / AIO Snippet / Article Footer), maintaining absolute vertical alignment across components, handling structural responsive reflows below 1100px without layout shifts, and preserving sticky layout behaviors without overflow-induced breakages.

## Design

### Article Layout Grid Wrapper

The foundational structural container that houses the main text body and layout columns, centering content across viewports and enforcing strict width boundaries. It ensures that the article body never exceeds standard readability thresholds while allowing supplementary structural content to sit alongside it symmetrically.

* **Layout Model:** Uses an outer container tracking `padding-inline: var(--gutter)` (48px) with an inner wrapper tracking `max-width: 1060px` centered via `margin-inline: auto`.
* **Grid Engine:** Configured explicitly with `display: grid`, `grid-template-columns: 220px minmax(0, 720px)`, and `gap: 64px`.
* **Responsive Reflow Breakpoint:** At `max-width: 1100px`, the layout engine drops columns to `grid-template-columns: 1fr`, reducing max-width boundaries smoothly to `720px` to maintain focused text density on tablet and mobile viewports.
* **Overflow Handling:** Constrains the outer page container using `overflow-x: clip` rather than `overflow-x: hidden` to ensure modern browsers do not truncate or isolate the layout container, keeping sticky calculation trees fully active.

### Sticky Table of Contents (Left Column)

A highly tracking navigation column occupying the left 220px layout block, providing real-time reading landmarks and contextual tracking for the reader without entering the content block. It stays locked within view as long as the reader remains inside the boundaries of the main content column.

* **Layout Positioning:** Assigned explicitly to `grid-column: 1` inside the wrapper block, utilizing `position: sticky` and `top: 100px` to account for the fixed global navigation bar.
* **Sizing Bounds:** Enforces a rigid `width: 220px` footprint, ensuring text elements wrap gracefully within the structural sidebar column.
* **Visibility States:** Hidden cleanly via `display: none` at the `max-width: 1100px` breakpoint, letting content flow sequentially into a single column.
* **Interaction Hooks:** Connects with an IntersectionObserver tracking `.article-body h2[id]` components using a root margin of `-20% 0% -72% 0%` to toggle active navigation state modifiers dynamically without layout thrashing.

### Right Column Container (Article Body & AIO Snippet)

The central readable canvas housing the article content, typography trees, and structural blocks like the streamlined Key Takeaways module. It enforces clear reading paths and maintains an optimal horizontal character limit for rapid comprehension.

* **Layout Positioning:** Maps to `grid-column: 2` with a flexible boundary limits matching `max-width: 720px` or `minmax(0, 720px)`.
* **Responsive Reflow:** At the `max-width: 1100px` breakpoint, the container transitions to `grid-column: 1` to merge effortlessly into the single-column scrolling hierarchy.
* **Rich Content Block Insulation:** Inherits standard typographic spacing rules where child blocks use uniform vertical margins, allowing embedded modules like the modern `Key Takeaways` component to sit flush inside the column container.

### Integrated Article Footer

The terminal metadata, taxonomy, and author details section closing the text layout. It ensures layout continuity by sharing the exact column architecture as the text sections, avoiding mismatched indentation or awkward alignment breaking the left visual line.

* **Layout Mechanics:** Implements the exact structural grid settings as the primary article wrapper (`display: grid`, `grid-template-columns: 220px minmax(0, 720px)`, `gap: 64px`).
* **Column Alignment Engine:** Employs an empty structural placeholder element (`<div class="article-footer__placeholder"></div>`) locked explicitly in `grid-column: 1` to hold the exact width footprint of the TOC.
* **Metadata Alignment:** Maps the content wrapper elements directly into `grid-column: 2`, ensuring that tax tags, share triggers, and author bios line up perfectly with the left margin of the text content above.
* **Responsive State:** At `max-width: 1100px`, the placeholder is toggled to `display: none` and the content wrapper shifts seamlessly to `grid-column: 1` to match the layout cascade.
