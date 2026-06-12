# Decision Brief: Turbopack × pnpm Global Virtual Store in Git Worktrees

**Status:** For review
**Context:** GRCMANA website — Next.js 16 + PayloadCMS, Turbopack/Webpack coexistence
**Scope:** Enabling parallel Claude Code agent sessions, each in a dedicated git worktree, to run `generate:types`, `tsc --noEmit`, `pnpm lint`, and `pnpm build` without per-worktree `node_modules` bloat.

---

## TL;DR

Our original `next.config` plan (set `turbopack.root` to the main repo root) would **not** have worked — the team was right to flag it. But the fix we landed on (widen the root to the common ancestor of the repo and the pnpm store, which on our machines resolves to `$HOME`) is the heaviest of several viable options.

**Recommendation:** Relocate the pnpm store *inside* the repo so the symlink targets fall under the main repo root, then pin `turbopack.root` to the main repo root with the simple git-worktree detection we already wrote. This keeps the global-virtual-store dedup we adopted, keeps Turbopack parity with production, and gives a tight, bounded root — no `$HOME` scan, no runtime `pnpm store path` probe.

**Immediate unblock (optional):** `next build --webpack` in the worktree validation script sidesteps the bug entirely while we make the store change.

---

## 1. The constraint, and why the first plan failed

Turbopack refuses to resolve files whose real path sits outside `turbopack.root` (a deliberate design choice for cache validation, reduced filesystem watching, and fewer resolution steps).

`enableGlobalVirtualStore: true` is fundamentally at odds with this. With it enabled, the top-level symlinks in `node_modules` (including `node_modules/next` itself) point to the global store's `links/` directory, which lives *outside* the project — not into an in-tree `node_modules/.pnpm`. Turbopack follows the symlink to its real path, finds it outside the root, and fails before it even reaches regular external-import handling.

This is tracked upstream in **vercel/next.js#93556** ("Turbopack fails to resolve `next/package.json` with pnpm v11 `enableGlobalVirtualStore`"). The issue is **open with no resolution timeline**. Two facts from it are decisive for us:

- Setting `turbopack.root` to the app root is **not sufficient** — confirming our original plan was incomplete.
- The maintainer-acknowledged workaround is to set `turbopack.root` to the **common ancestor of the app root and the real path of `node_modules/next`**. This is exactly what our `findCommonAncestor` refinement computes — so that refinement is *correct*, not over-engineering.
- The failure **does not reproduce under Webpack** (`next dev --webpack` / `next build --webpack`).

So the disagreement isn't about correctness. The common-ancestor approach works. The question is whether widening the root to `$HOME` is the right trade, or whether we can avoid widening at all.

---

## 2. Two facts that lower the stakes

**This is a local-development-only problem.** pnpm **automatically disables the global virtual store in CI** (where caches are cold). Vercel and our CI already build with a normal `node_modules` layout, so **production Turbopack builds never hit this bug.** Implication: we should *not* add runtime `execSync` probes to `next.config` that run on every invocation including Vercel — that adds fragility to the one environment that was never broken. Any worktree-specific logic must be hard-gated so it's inert outside a local worktree.

**Our worktrees run one-shot validation, not long-lived `next dev`.** The "filesystem watching overhead" that the Turbopack docs warn about is largely irrelevant for one-shot `build`/`tsc`/`lint` — nothing stays watching after the command exits. The real residual cost of an over-wide root is **initial filesystem-scan time on every build**, multiplied across every agent. So tighter is still better, just for a different reason than "watch overhead."

Also worth naming: **only `pnpm build` touches Turbopack.** `generate:types`, `tsc --noEmit`, and `lint` resolve through Node/pnpm and work regardless of the root. We are solving this for one of our four commands.

---

## 3. Options considered

| # | Approach | How it escapes the constraint | Trade-off |
|---|----------|-------------------------------|-----------|
| 1 | **Relocate store under the repo** (recommended) | Brings dep real-paths *inside* the root; `turbopack.root` = main repo root suffices | One-time store-dir config + per-dev setup; assumes worktrees nested under repo (they are) |
| 2 | **Common-ancestor / `$HOME` root** (current team proposal) | Widens root to cover the external store | Turbopack rooted at `$HOME`; slower initial scan per build; runtime `pnpm store path` probe |
| 3 | **`next build --webpack` in worktrees** | Webpack has no out-of-root symlink rule | Bundler parity drift — a Turbopack-specific build error wouldn't surface until the main/CI build |
| 4 | **Drop GVS, classic per-worktree `pnpm install`** | `.pnpm` lives in-tree; root = worktree root | Reintroduces the per-worktree metadata duplication we adopted GVS to avoid |

Options 1–4 are all genuinely correct; they differ in cost. Option 4 contradicts our reason for using GVS in the first place, so it's listed for completeness only.

---

## 4. Recommended approach

**Relocate the pnpm store into the repo, then keep the simple worktree-detection root.**

The global virtual store's links live at `{storeDir}/links`, and `storeDir` is configurable. If we point it inside the repo, the link targets resolve to `…/grcmana-website/.pnpm-store/links/…` — under the main repo root. Combined with worktrees living at `.claude/worktrees/<name>` (also under the repo root), the main repo root now contains **everything** Turbopack must resolve: worktree source, the workspace `node_modules`, and the store links. No need to widen to `$HOME`, and no `pnpm store path` probe.

The store stays on the same filesystem as the repo (it already was, under `/home/<user>`), so hard-linking is unaffected, and all worktrees continue to share a single store — we keep the dedup that motivated GVS.

### 4.1 Precondition — satisfied

This relies on worktrees being **nested under the main repo**, so that (a) pnpm's walk-up resolution from a worktree reaches the workspace `pnpm-workspace.yaml` and `node_modules`, and (b) the worktree source falls under `turbopack.root`. Claude creates worktrees at `.claude/worktrees/<name>`, which is under the repo root — so this holds. **If we ever move worktrees to a sibling location on disk, this approach (and the walk-up resolution it depends on) breaks, and we'd need per-worktree installs or symlinks instead.**

### 4.2 `next.config.ts` — simplified

Replace the `findCommonAncestor` / `pnpm store path` block with:

```typescript
import { execSync } from 'child_process'
// ...existing imports

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// --- Turbopack root: pin to the main repo root when inside a git worktree ---
// Store is relocated into <repo>/.pnpm-store, so the main repo root contains
// everything Turbopack must resolve: worktree source (.claude/worktrees/*),
// the workspace node_modules, and the global virtual store links.
// No need to widen to $HOME; no pnpm-store probe.
let turbopackRoot = path.resolve(dirname)
try {
  const gitCommonDir = execSync('git rev-parse --git-common-dir', {
    encoding: 'utf8',
    cwd: dirname,
  }).trim()
  if (path.isAbsolute(gitCommonDir)) {
    // Inside a worktree: common-dir is absolute -> its parent is the main repo root.
    turbopackRoot = path.dirname(gitCommonDir)
  }
} catch {
  turbopackRoot = path.resolve(dirname)
}
// ---------------------------------------------------------------------------

// ...rest unchanged, with:  turbopack: { root: turbopackRoot },
```

In the main checkout, `git rev-parse --git-common-dir` returns relative `.git`, the `isAbsolute` gate is false, and the root stays as `dirname` (which *is* the repo root) — so the main build and Vercel are untouched. And because GVS is disabled in CI, Vercel's symlinks never leave the project regardless.

### 4.3 Store relocation — portable across the team

The store path is absolute and therefore machine-specific, so it must **not** be committed. We generate a git-ignored `.npmrc` at the main repo root via a one-time, idempotent setup script that each developer runs after cloning.

`scripts/setup-store.sh` (committed):

```bash
#!/usr/bin/env bash
set -euo pipefail

# Resolve the MAIN repo root whether run from the main checkout or a worktree.
GIT_COMMON_DIR="$(git rev-parse --git-common-dir)"
if [[ "$GIT_COMMON_DIR" = /* ]]; then
  MAIN_ROOT="$(cd "$(dirname "$GIT_COMMON_DIR")" && pwd)"   # worktree: parent of absolute .git
else
  MAIN_ROOT="$(git rev-parse --show-toplevel)"             # main checkout
fi

STORE_DIR="$MAIN_ROOT/.pnpm-store"
printf 'store-dir=%s\n' "$STORE_DIR" > "$MAIN_ROOT/.npmrc"
echo "store-dir set to $STORE_DIR (written to $MAIN_ROOT/.npmrc)"
```

`.gitignore` additions:

```
.npmrc
.pnpm-store/
```

Then, once, from the main checkout:

```bash
bash scripts/setup-store.sh
pnpm install   # rebuilds node_modules with symlinks now pointing into <repo>/.pnpm-store/links
```

> **Verify first (and prefer if it works):** if pnpm on our version resolves a **relative** `store-dir` predictably against the workspace root, we can commit a single line — `store-dir=.pnpm-store` — in the root `.npmrc` and drop the setup script entirely. This needs a quick test across a main checkout *and* a worktree (relative paths can resolve against cwd, which differs per worktree and would silently fragment the store). Use the absolute-path script as the safe default until confirmed.

---

## 5. Fallback — ship this minute if an agent is blocked

Add `--webpack` to the worktree build command:

```jsonc
// package.json (worktree validation only — NOT the production build)
"build:check": "next build --webpack"
```

Webpack is immune to the out-of-root symlink check, and since only `build` touches the bundler, the other three commands are unaffected. The cost is bundler parity: a Turbopack-specific build error wouldn't be caught in worktree validation — but the real Turbopack build still runs in the main checkout / CI / Vercel. Treat this as an interim smoke-test, not the long-term answer.

---

## 6. Residual risks / things to watch

- **Nested-worktree resolution boundary.** With `root` = repo root, a worktree build's resolution boundary spans the whole repo, including sibling worktrees. For one-shot validation this is a non-issue (no persistent watchers; Turbopack only compiles the import graph, which never reaches another worktree's source). The only place it could bite is a long-lived `next dev` in the *main* checkout while agents churn files under `.claude/worktrees/` — worth a glance if dev feels noisy.
- **`NODE_PATH` under GVS.** pnpm's docs note that with a global virtual store, `NODE_PATH` must include both the project root `node_modules` and `node_modules/.pnpm/node_modules` for correct resolution by some CLI tools. Confirm our `generate:types` / lint tooling resolves cleanly from a worktree after the change.
- **`.pnpm-store/` size in-repo.** The store now lives in the repo tree (git-ignored). Hard-linked content means low byte cost, but confirm tooling that scans the repo (search indexers, Docker build contexts, `tsc` include globs) excludes it.
- **Store relocation is a one-time rebuild.** Existing `node_modules` must be reinstalled once after the store-dir change so symlinks repoint.

---

## 7. Open questions for the team

1. Do we accept relocating the store into the repo as the canonical approach, or do we prefer the `$HOME` common-ancestor route for any reason (e.g., a shared system store across multiple unrelated repos that we want to preserve)?
2. Can someone verify relative `store-dir` resolution on our pnpm version (§4.3 note)? If it holds, we commit one line and drop the script.
3. Do we want `next build --webpack` wired in as a standing fast-validation path for agents regardless, or only as a temporary fallback?

---

## References

- vercel/next.js#93556 — Turbopack fails to resolve `next/package.json` with pnpm v11 `enableGlobalVirtualStore` — https://github.com/vercel/next.js/issues/93556
- Turbopack `root` configuration — https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
- pnpm settings (`enableGlobalVirtualStore`, `NODE_PATH` behaviour) — https://pnpm.io/settings
- pnpm `store` CLI (`{storeDir}/links`, garbage collection) — https://pnpm.io/cli/store
- pnpm 10.12 global virtual store introduction / CI auto-disable — https://socket.dev/blog/pnpm-introduces-global-virtual-store-and-expanded-version-catalogs
- Next.js 16 Turbopack-default and `--webpack` opt-out — https://nextjs.org/blog (Next.js 16 release)