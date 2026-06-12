# AIO Snippet — Implementation Specification

> **Source mockup:** `grcmana-article-v3.html`
> **Stack:** Next.js · PayloadCMS · Tailwind or CSS Modules
> **Version:** 1.0 · June 2026

---

## Goal

A structured summary block optimised for AI search engine extraction. Sits at the top of the article body, before the lead paragraph.

**Mockup:** `docs/specs/aio-snippet/mockup.html`

## Data Model

The content must be editable within an `Article` record in the `Article Collection`, including:

| Field                 | Type                               | Required | Notes                                    |
| --------------------- | ---------------------------------- | -------- | ---------------------------------------- |
| `aioSsnippet.heading` | Text                               | —        | AIO snippet heading (e.g. Key Takeaways) |
| `aioSsnippet.summary` | Rich text                          | —        | AIO snippet summary paragraph            |
| `aioSsnippet.facts`   | Array: `{term, definition}`        | —        | Max 4 items                              |

## Design

### Header row

* **Layout**: flex, space-between, border-bottom: 1px solid --border, padding-bottom: 10px
* **Left label**: "Key Takeaways"
  → DM Mono, 9px, uppercase, 0.1em tracking, --signal-500

## Summary

* **Font**: Syne, 14.5px, line-height 1.6, --ink-100 `<strong>` → --white
* Max ~2–3 sentences. Should be self-contained, factually precise, structured to be parseable by LLMs as a knowledge snippet.
* **CMS source:** article.aioSsnippet.summary (rich text with bold support)

## Fact grid

* **Layout:** 2×2 CSS grid (1fr 1fr), gap: 12px
* Collapses to 1 column below 600px viewport
* Each cell (.aio-fact):
  * Background: --ink-950
  * Border: 1px solid --border
  * Padding: 12px 16px
  * Term: DM Mono, 8.5px, uppercase, --ink-300, margin-bottom: 2px
  * Definition: Syne, 13px, weight 600, --ink-100
* **CMS source:** article.aioSummary.facts[] (array of {term, definition}, max 4)
