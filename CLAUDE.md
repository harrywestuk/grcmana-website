# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Skills

- This project uses the Payload CMS skill at `.claude/skills/payload/`.
- Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## Stack

- Framework: Next.js 16 (App Router, TypeScript strict mode)
- CMS: PayloadCMS 3.x (runs inside Next.js, no separate server)
- Database: Supabase (PostgreSQL via `@payloadcms/db-postgres`)
- Media: S3-compatible via `@payloadcms/storage-s3` (Supabase Storage bucket)
- Email: Resend via `@payloadcms/email-resend`
- Hosting: Vercel
- Styling: Tailwind CSS v4 + CSS variables
- UI components: shadcn/ui (Radix primitives)
- Package manager: pnpm

## Commands

```bash
pnpm dev                      # Start dev server (localhost:3000)
pnpm build                    # Build for production (also runs next-sitemap postbuild)
pnpm start                    # Serve production build
pnpm lint                     # Run ESLint
pnpm lint:fix                 # Auto-fix ESLint issues

# Payload CLI
pnpm payload generate:types   # Regenerate src/payload-types.ts after schema changes
pnpm payload generate:importmap
pnpm payload migrate:create   # Create a new DB migration
pnpm payload migrate          # Run pending migrations (required before pnpm start in prod)

# Tests
pnpm test:int                 # Vitest integration tests (tests/int/**/*.int.spec.ts)
pnpm test:e2e                 # Playwright E2E tests (tests/e2e/**)
pnpm test                     # Both int + e2e
```

## Architecture

### Routing layout

```text
src/app/
  (payload)/           # Payload admin + API routes — never modify
    admin/             # Admin panel
    api/               # REST API endpoints
  (frontend)/          # All public-facing pages
    [slug]/            # Dynamic pages (CMS-driven)
    posts/             # Blog listing + [slug]
    search/            # Search results page
    next/              # Next.js-specific routes (preview, revalidation)
    (sitemaps)/        # XML sitemap routes
```

### Source layout

```text
src/
  payload.config.ts    # Root Payload config
  payload-types.ts     # Auto-generated — never edit by hand
  collections/         # Pages, Posts, Media, Categories, Users
  blocks/              # Layout builder blocks (config + React component per block)
  heros/               # Hero variants
  plugins/             # All Payload plugins wired in plugins/index.ts
  fields/              # Shared Payload field configs (defaultLexical, etc.)
  hooks/               # Payload collection/global hooks
  access/              # Reusable Payload access control functions
  endpoints/           # Custom Payload endpoints (seed lives here)
  Header/ Footer/      # Global config + React components for site header/footer
  components/          # Shared React components
  providers/           # React context providers
  utilities/           # Pure functions (generateMeta, getURL, generatePreviewPath, etc.)
  search/              # Search plugin field overrides + beforeSync hook
```

### Path aliases

- `@/` → `src/` (defined in tsconfig)
- `@payload-config` → `src/payload.config.ts`

### Data fetching

Always use Payload's **Local API** server-side. Example pattern from pages:

```ts
const payload = await getPayload({ config: configPromise })
const doc = await payload.findByID({ collection: 'pages', id, draft })
```

Never call Supabase directly from the frontend — all data goes through Payload collections.

### ISR / cache invalidation

Collections (Pages, Posts) have `afterChange` hooks that call `revalidatePath` / `revalidateTag`. The `/next/revalidate` endpoint handles on-demand revalidation triggered by Payload webhooks. Redirects revalidation is in `src/hooks/revalidateRedirects.ts`.

### Draft / Live Preview

Pages and Posts use Payload versioning with `drafts: true`. Draft preview URL is generated via `src/utilities/generatePreviewPath.ts` and routed through `/next/preview`. Live Preview is enabled in the Payload admin config with three breakpoints (mobile/tablet/desktop).

### Scheduled publish / Jobs

The jobs queue handles scheduled publishing. Cron is protected by `CRON_SECRET` — the `Authorization: Bearer <token>` header is checked in `payload.config.ts` `jobs.access.run`.

### Plugins active

- `@payloadcms/plugin-seo` — SEO fields on Pages + Posts
- `@payloadcms/plugin-redirects` — manages URL redirects, triggers ISR
- `@payloadcms/plugin-nested-docs` — nested Categories
- `@payloadcms/plugin-form-builder` — embeddable forms
- `@payloadcms/plugin-search` — full-text search over Posts

## Architecture Rules

- PayloadCMS routes live at `/app/(payload)/**` — never touch this routing
- All public pages live in `/app/(frontend)/**`
- Use React Server Components by default; `'use client'` only when needed
- Prefer Local API over REST API for server-side data fetching
- No direct Supabase client calls from the frontend — all data through Payload collections

## Code Conventions

- TypeScript: no `any`, explicit return types on all functions
- File naming: kebab-case for files, PascalCase for components
- Co-locate component styles; no global CSS except `/app/globals.css`
- After any schema change, run `pnpm payload generate:types` to update `payload-types.ts`
- For Postgres schema changes in development, `push: true` is active — migrations are only needed for production deploys

## Tailwind CSS

- Version: v4
- Configuration goes in globals.css under @theme
- Do not create tailwind.config.ts

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Supabase PostgreSQL connection string (pooling mode) |
| `PAYLOAD_SECRET` | 32+ char secret for Payload |
| `NEXT_PUBLIC_SERVER_URL` | Canonical URL |
| `RESEND_API_KEY` | Resend email API key |
| `S3_BUCKET` | Supabase Storage bucket name |
| `S3_ACCESS_KEY_ID` | S3-compatible access key |
| `S3_SECRET_ACCESS_KEY` | S3-compatible secret key |
| `S3_REGION` | S3 region |
| `S3_ENDPOINT` | S3 endpoint URL (Supabase Storage URL) |
| `CRON_SECRET` | Bearer token for Vercel Cron job authentication |

## What NOT to do

- Don't use Supabase Auth — use Payload's built-in auth
- Don't use the Pages Router
- Don't install mongoose or MongoDB adapters
- Don't put business logic in components — extract to `lib/` or `utilities/`
- Don't edit `src/payload-types.ts` by hand — regenerate it
- Don't set `push: false` in development unless the database is pointed at production
