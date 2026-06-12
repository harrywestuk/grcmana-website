---
feature: author-bio
branch: feat/author-bio
status: ready
---

# Author Bio Card — Implementation Specification

**Source mockup:** `docs/specs/author-bio-box/mockup.html`
**Stack:** Next.js · PayloadCMS · Tailwind or CSS Modules
**Version:** 1.0 · June 2026

## Goal

Implement a robust, performant, and production-ready implementation of the Author Bio Card component (`C-11`) at the base of the primary Article Layout Grid.

The component must transform the old, clinical "disclaimer" layout into a visually authoritative expert showcase by establishing a clean structural card layout, integrating a dedicated circular avatar graphic, and ensuring perfect responsive execution on smaller screen sizes without layout thrashing.

## Design

### Author Bio Card Container

The outer containment block that structures the author's showcase, visually separating it from the core article text stream to emphasize professional authority. It anchors the terminal metadata experience directly inside the article content's right-hand layout column.

* **Visual Styles:** Features a solid container background set to `var(--ink-800)` bound by a precise `1px solid var(--border)` hairline frame.
* **Spacers & Padding:** Implements uniform interior spacing utilizing an explicit `padding: 28px` declaration on all sides.
* **Layout Engine:** Drives structural alignment using `display: flex`, matching a layout `gap: 20px`, and setting `align-items: flex-start` to maintain a strict top-aligned rhythm between media elements and text.

### Author Avatar Element

A dedicated high-visibility circular profile indicator designed to immediately elevate author trust by providing a concrete human connection. It houses the author's professional image assets or fallback typographic signifiers within a highly controlled layout box.

* **Sizing Bounds:** Constrained to rigid structural bounds with an unyielding footprint of `width: 52px` and `height: 52px`.
* **Geometric Profiles:** Enforces an absolute circular frame utilizing a `border-radius: 50%` declaration.
* **Interior Styling & Typography:** Configured with a background color matching `var(--ink-700)`, an edge trim of `1px solid var(--border)`, and central alignment handling via `display: flex`, `align-items: center`, and `justify-content: center`. Fallback initials render strictly using `font-family: 'DM Mono'`, `font-size: 14px`, `font-weight: 500`, and color value `var(--signal-500)`.
* **Layout Isolation:** Injected with `flex-shrink: 0` to structurally protect the element from collapsing when long biographical blocks are passed to adjacent flex text nodes.

**IMPORTANT:** This should use the **profile image** in the `avatar` field of the author profile

### Biographical Content Block

The flexible text container node that hosts the hierarchical copy tree detailing the author's specific market credentials and domain expertise.

* **Layout Positioning:** Assigned a layout distribution parameter of `flex: 1` to expand naturally across the remainder of the horizontal card footprint.
* **Eyebrow Label:** Employs a fixed indicator text ("Author") set to `font-family: 'DM Mono'`, `font-size: 9px`, `letter-spacing: 0.12em`, `text-transform: uppercase`, and color tracking to `var(--ink-300)` with a spacing boundary of `margin-bottom: 4px`.
* **Display Name:** Rendered as a distinct header element using `font-family: 'Syne'`, `font-size: 16px`, `font-weight: 700`, color value `var(--white)`, and an baseline buffer matching `margin-bottom: 8px`.
* **Biographical Copy:** Driven by body rules set to `font-family: 'Syne'`, `font-size: 14px`, line-height mechanics scaling to `1.6`, and text coloring restricted to `var(--ink-300)` to present readable text hierarchies.

### Responsive Flex Adaptation

The conditional layout override rule that handles space restrictions across compact mobile viewing environments to prevent truncation or visual truncation.

* **Breakdown Boundary:** Configured with an explicit media query breakpoint targeting environments at or below `max-width: 550px`.
* **Layout Structural Reorientation:** Shifts the foundational container properties from horizontal tracking down to a vertical stack via `flex-direction: column`.
* **Grid Recalibration:** Drops the alignment footprint spacing parameters to a localized setting of `gap: 16px` to keep layouts compact on compact mobile screens.
