---
feature: reading-progress-bar
branch: feat/reading-progress-bar
status: ready
---

# Reading Progress Bar — Implementation Specification

> **Source mockup:** `docs/mockups/grcmana-article-v4.html`
> **Stack:** Next.js · Tailwind or CSS Modules
> **Version:** 1.0 · June 2026

---

## Goal

Implement a lightweight, highly performant, and visual-first `Reading Progress Bar` component (`C-02`) fixed to the top view boundary of the article layout page.

The progress indicator must accurately measure real-time document scroll tracking, filling from left to right as the user reads, executing transitions flawlessly at a low calculation cost without causing reflow bottlenecks or blocking core client threads.

## Design

### Fixed Progress Track & Bar

The global visual indicator layout positioning rule applied to ensure the execution trace tracks explicitly on top of all header structural components.

* **Layout Positioning:** Affixed using `position: fixed`, `top: 0`, and `left: 0` to anchor layout rendering directly at the viewport ceiling[cite: 6].
* **Layer Depth Hierarchy:** Explicitly bound to `z-index: 300` to guarantee layout stacking renders safely on top of the floating navigation container (`z-index: 200`) without clipping[cite: 6].
* **Sizing Dimensions:** Maintained at a clean, sharp, macro-typography height threshold of `height: 2px`[cite: 6].
* **Visual Color Space:** Drives foreground execution fills utilizing the global system brand accent token `var(--signal-500)` (`#e8ff47`).
* **Visual Transition Curves:** Governed via an un-debounced, fluid transition rule mapped to `width 100ms linear` to mask tracking jumps cleanly during erratic mouse wheel actions[cite: 6].

### Scroll State Evaluation Engine

The lightweight browser event tracking loop engineered to calculate active viewport coordinates dynamically.

* **Execution Trigger:** Connected directly to a passive browser `window` scroll event listener interface to bypass scroll locking parameters.
* **Metric Calculation Strategy:** Determines tracking percentages utilizing mathematical ratios mapping current positions to total remaining text canvas heights:

```js
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
  progressBar.style.width = Math.min(pct, 100) + '%';
```

* **Boundary Safeguards:** Clamped securely inside a Math.min(pct, 100) logic boundary check to ensure client browser elastic scroll values never force fill outputs past a clean 100% visual marker.
