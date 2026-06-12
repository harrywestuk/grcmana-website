---
feature: custom-cursor
branch: feat/custom-cursor
status: ready
---

# Custom Interactive Cursor — Implementation Specification

**Source mockup:** `grcmana-article-v3.html`[cite: 6]
**Stack:** Next.js · Tailwind or CSS Modules[cite: 6]
**Version:** 1.0 · June 2026[cite: 6]

## Goal

Implement an interactive, fluid `Custom Cursor` platform component (`C-03`) that replaces native operating system target arrows with a dual-element brand asset tracking setup.

The layout setup must coordinate an inner structural indicator responding instantaneously alongside an outer lagging circle indicator running frame-by-frame interpolation vectors to capture premium visual execution traces.

## Design

### Custom Cursor Structural Elements

The foundational design anatomy blocks required to construct the interactive tracking cluster.

* **Structural Setup:** Composed of two separate, layer-separated floating element markup classes: an inner lead point (`.c-dot`) and a trailing lag enclosure (`.c-ring`).
* **Lead Point Anatomy (.c-dot):** Set up as an absolute `width: 8px` and `height: 8px` circular point powered by full-opacity background token `var(--signal-500)`.
* **Lag Enclosure Anatomy (.c-ring):** Structured initially as a wider `width: 32px` and `height: 32px` profile bound by a delicate `1.5px solid rgba(232,255,71,0.45)` ring border.
* **Universal Component Baselines:** Both classes map strictly to `position: fixed`, `pointer-events: none` (to prevent blocking target hit elements), `border-radius: 50%`, and use center alignments defined by `transform: translate(-50%, -50%)` configurations.
* **Layer Depth Engine:** Set to highest visibility stack priorities utilizing `z-index: 9999` (`.c-dot`) and `z-index: 9998` (`.c-ring`) to ensure assets float over global view boundaries.

### Interactive Motion & Trajectory Loop

The lightweight frame script executing tracking transformations dynamically across coordinates.

* **Lead Point Movement:** Updates raw position values instantly across active user axes upon receiving raw mouse pointer signals:

```js
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
```

* **Lag Enclosure Interpolation:** Evaluates lagging vectors frame-by-frame using requestAnimationFrame loops, updating internal tracking locations via a steady linear step multiplier to match pointer paths smoothly:

```js
rx += (mx - rx) * 0.11; // 11% frame-by-frame spring delay step logic
  ry += (my - ry) * 0.11;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
```

### Target Hover State Transformations

The conditional interactive modifier structure handling component scaling states when navigating across target activation areas.

* **Hardware Support Checks:** Component initialization must be enclosed safely within modern media query environments restricting script loads strictly to standard fine pointer interfaces: @media (pointer: fine) { html { cursor: none; } }.
* **Activation Selector Triggers:** Captures entry cues via target element node monitoring: document.querySelectorAll('a, button, .article-card').
* **Hover State Classes:** Appends class helper .hovering directly onto parent container bodies upon valid intersectionsi.
* **Transform Metrics:** Shifts the inner indicator scale factor cleanly via .c-dot { transform: translate(-50%,-50%) scale(2); } while expanding the trailing frame perimeter down to a wide width: 48px and height: 48px footprint.
* **Transition Timings:** State switches run smoothly on top of explicit engine variables, matching --dur-fast (150ms) timelines for inner targets and --dur-base (250ms) for outer frames.
