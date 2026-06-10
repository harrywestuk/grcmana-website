# TypeScript: exactOptionalPropertyTypes

**Status:** Deferred  
**Identified:** 2026-06-10  
**Introduced in:** `836d6fa` (update: refactor Tailwind to CSS4)  

---

## What it is

`exactOptionalPropertyTypes` is a TypeScript compiler option (available since TS 4.4) that tightens the behaviour of optional properties.

Without it, an optional prop `foo?: string` accepts both `string` and `undefined` — you can write `foo={undefined}` and TypeScript won't complain. With it enabled, `foo?: string` means the prop must either be a `string` or **omitted entirely**. Passing `undefined` explicitly is a type error.

---

## How it got in

The flag was added to `tsconfig.json` in commit `836d6fa` alongside the Tailwind CSS4 refactor. The codebase was never updated to comply with it, so the first time Next.js ran a full TypeScript check at build time (on Vercel), the deployment failed with 33+ type errors across 14 files.

---

## What broke

All errors followed the same pattern — passing `value | undefined` to a prop that, under this flag, no longer accepts `undefined`:

| File | Pattern |
|---|---|
| `playwright.config.ts` | `workers: process.env.CI ? 1 : undefined` |
| `src/Header/Component.client.tsx` | `onClick={condition ? handler : undefined}` |
| `src/app/(frontend)/posts/page.tsx` | `currentPage={posts.page}` (possibly undefined) |
| `src/blocks/Form/**` (7 files) | `width={field.width}`, `required={field.required}` |
| `src/blocks/Code/Component.tsx` | `language={block.language}` |
| `src/blocks/MediaBlock/Component.tsx` | `src={staticImage}` |
| `src/components/Media/ImageMedia/index.tsx` | `fill`, `height`, `width`, `priority`, `loading` |
| `src/endpoints/seed/contact-form.ts` | Payload seed data shape |
| `src/fields/linkGroup.ts` | `appearances: false \| LinkAppearances[] \| undefined` |
| `src/payload.config.ts` | `region: string \| undefined` in S3 config |
| `src/providers/HeaderTheme/index.tsx` | Context default value shape |
| `src/providers/Theme/index.tsx` | Context default value shape |
| `src/utilities/buildMenuTree.ts` | Indexed access `columns[colKey]` → `T \| undefined` |

---

## What was done

The flag was removed from `tsconfig.json` to unblock the deployment. Two incidental fixes made while investigating were kept:

- `playwright.config.ts` — `workers` now conditionally spread instead of set to `undefined`
- `src/Header/Component.client.tsx` — `onClick` now conditionally spread on the mobile nav link
- `src/utilities/buildMenuTree.ts` — `columns[colKey] ?? []` to satisfy the still-active `noUncheckedIndexedAccess` rule

---

## Enabling it properly

`exactOptionalPropertyTypes` is a worthwhile strictness upgrade — it forces call sites to be explicit about whether they intend to pass a value or omit a prop entirely, catching a class of subtle bugs. To re-enable it cleanly:

1. Add `"exactOptionalPropertyTypes": true` back to `tsconfig.json`
2. Run `pnpm tsc --noEmit` to surface all violations
3. Fix each call site using one of these patterns:

```ts
// Before — passes undefined, rejected by the flag
<Component prop={condition ? value : undefined} />

// After option A — conditional spread (omits the prop entirely)
<Component {...(condition ? { prop: value } : {})} />

// After option B — assert non-null if you know it's defined
<Component prop={value!} />

// After option C — provide a safe fallback
<Component prop={value ?? defaultValue} />
```

The Form blocks (`width`, `required`) and Media component (`fill`, `height`, `width`) are the highest-volume fixes and follow a consistent pattern, so they could be batched.
