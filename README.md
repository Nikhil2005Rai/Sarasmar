# SARASMER — Skills Meet Opportunity

A full-stack Next.js platform where **verified student skills** meet **real company projects**. Students build a profile, prove skills through assessments, publish the weeks they're free, and get matched. Companies post scoped projects and get a ranked list of students by verified fit and availability.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router)**, TypeScript strict | Server Components + Server Actions, first-class on Vercel |
| Database | **Neon Postgres** + **Prisma 7** (Rust-free client, `@prisma/adapter-pg`) | Small serverless bundle, no native query engine, uses Neon's pooled endpoint at runtime |
| Auth | **Auth.js v5** (credentials + optional Google), JWT sessions | Edge-safe middleware for protected routes and role redirects |
| Validation | **Zod** — shared by forms, Server Actions and the route handler | One schema, validated on both sides |
| Forms | React Hook Form + `@hookform/resolvers/zod` | |
| State | **Zustand** (UI: menu, cursor) · **TanStack Query** (live company matching) | |
| Styling | Tailwind + CSS-variable design tokens, `cva` + `tailwind-merge` + `clsx` | |
| Primitives | Radix (Dialog, Switch, ToggleGroup, Slot), all restyled | No shadcn defaults |
| Motion | Framer Motion (layout, gestures, reveals) · GSAP ScrollTrigger (pinned horizontal journey) · Lenis (smooth scroll, driven by GSAP's ticker) | |
| 3D | React Three Fiber + Drei — the hero emblem | Procedural lighting (Lightformers), no HDR downloads |
| Fonts | `next/font/local` — Cormorant Garamond (display) + Inter Tight (UI) + JetBrains Mono (data) | Self-hosted, preloaded, `display: swap`; no build-time network fetch |

---

## Run locally

```bash
pnpm install
cp .env.example .env            # fill in DATABASE_URL, DIRECT_URL, AUTH_SECRET
pnpm db:deploy                  # apply prisma/migrations to your database
pnpm db:seed                    # 10 students, 5 companies, 12 projects, applications
pnpm dev                        # http://localhost:3000
```

Demo accounts (password **`sarasmer2026`**):

- Student — `vaibhav@sarasmer.dev`
- Company — `hiring@northwind.dev`

Handy flags: add `?gl=1` / `?gl=0` to the homepage URL to force the WebGL hero or the static fallback.

---

## Deploy to Vercel + Neon

1. **Neon** → create a project and a `sarasmer` database. Copy two connection strings:
   - **Pooled** (host contains `-pooler`) → `DATABASE_URL`
   - **Direct** (no `-pooler`) → `DIRECT_URL`
   Keep `?sslmode=require` on both.
2. **Vercel** → import the repo. Framework preset: Next.js. Package manager: pnpm.
3. Add environment variables (Production + Preview):
   `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` (`npx auth secret`), `AUTH_TRUST_HOST=true`, and optionally `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.
4. Deploy. The `vercel-build` script runs `prisma generate && prisma migrate deploy && next build`, so the schema is applied automatically.
5. Seed once from your machine, pointed at Neon:
   ```bash
   DIRECT_URL="postgresql://…neon.tech/sarasmer?sslmode=require" pnpm db:seed
   ```
6. **Google OAuth** (optional): authorised redirect URI `https://<your-domain>/api/auth/callback/google`. The Google button only renders when both Google env vars are set. The role picked on `/signup` is carried through OAuth in a short-lived cookie.

> The Neon integration in the Vercel marketplace can inject `DATABASE_URL` for you. If you use it, add `DIRECT_URL` yourself (the unpooled string) for migrations.

---

## What's where

```
src/
  app/
    page.tsx                     Homepage (hero → how → why → split → verification → marketplace → story)
    (auth)/login, signup         Split auth layout, role segmented control; actions.ts = Server Actions
    dashboard/student            Greeting, availability widget, profile ring, verified skills, matched projects
      actions.ts                 ▶ Server Actions: setAvailability, applyToProject
    dashboard/company            Requirement form + live ranked matches + your projects
      actions.ts                 ▶ Server Action: createProject (Zod-validated)
    opportunities/               Marketplace, filtered on the server via URL search params
    opportunities/[id]           Detail page with personal fit score and apply
    api/matches                  Route Handler used by TanStack Query for live matching
    api/auth/[...nextauth]       Auth.js
  auth.ts / auth.config.ts       Full config (Node) / edge-safe config (middleware)
  middleware.ts                  Protects /dashboard/*, role-based redirects
  components/
    brand/                       S mark, wordmark, S divider, S loader
    three/hero-scene.tsx         R3F emblem, rings, orbiting nodes, gold connection lines
    motion/                      Reveal/SplitReveal, Magnetic, TiltCard, CountUp/ProgressRing
    home/ dashboard/ marketplace/ auth/ layout/ ui/
  lib/
    matching.ts                  Match score: 70% verified-skill fit + 30% availability overlap
    queries.ts, validations.ts, db.ts, fonts.ts
prisma/
  schema.prisma, migrations/, seed.ts
```

### Matching model

`score = 70 × skillFit + 30 × availabilityOverlap`

- **skillFit**: for each required skill, a verified skill counts as its assessment score (0–1); an unverified one counts 0.28; missing counts 0. Averaged across required skills.
- **availabilityOverlap**: fraction of the project window the student is marked available for (0 if unavailable).

---

## Design tokens

Defined once in `src/app/globals.css` (hex + RGB channels) and mapped in `tailwind.config.ts`, so opacity modifiers work (`bg-navy-900/70`, `border-gold/40`).

| Token | Value | Use |
|---|---|---|
| `navy-900` | `#0B172A` | Hero, footer, dark statements |
| `navy-800` / `navy-700` | `#142B4A` / `#111F33` | Dark cards |
| `ivory` / `warm-white` | `#F8F5EF` / `#FFFDF8` | Light surfaces / cards on light |
| `royal` | `#3568B8` | Links, primary actions, student accents |
| `gold` / `gold-soft` | `#D9A441` / `#F0D59A` | Verification, KPIs, premium CTA |
| `lavender` / `peach` | `#8A78C7` / `#E8A27C` | Secondary accent / warmth |
| `line-light` / `line-dark` | `#E5E0D6` / `rgba(217,164,65,.18)` | Hairlines |

Type scale: `display-xl` `clamp(3.5rem, 8vw, 7rem)` / 0.95 / −0.03em, `display-l` `clamp(2.5rem, 5vw, 4rem)`, `eyebrow` 12px uppercase 0.18em. Card radius 14–18px. Shadows are navy-tinted, layered, low opacity. Easing: `cubic-bezier(0.22,1,0.36,1)` for reveals, `cubic-bezier(0.65,0,0.35,1)` for scroll-linked motion.

Balance: light for work surfaces (marketplace, dashboards, forms), navy for statements (hero, Why, company panel, story, footer), gold/royal only for accents.

---

## Where the S motif is reused

The S is one set of paths (`S_PATHS` in `components/brand/s-mark.tsx`), reused everywhere:

- **Hero 3D emblem**: the same control points lifted into `TubeGeometry` (gold metal, glass royal strand, ivory hairline) in `three/hero-scene.tsx`
- **Hero background**: layered gradient S-curves drawn on load
- **Navbar / sidebar / favicon**: static mark (`app/icon.svg`)
- **Section divider**: `SDivider`, an S-wave drawn by scroll with a sparkle at the centre
- **How it works**: an S-wave progress indicator (desktop) and an S-curve timeline spine (mobile)
- **Split section**: the moving S-shaped edge that reveals the company panel
- **Brand story**: a large mark whose strands are drawn by scroll position
- **Loading states**: `SLoader`, a looping stroke-draw (dashboard `loading.tsx`, live matching)
- **Auth**: the drawn mark on the dark panel; the **empty state** in the marketplace; the **404** page

---

## Motion and accessibility

- Reveals stagger 60–90ms, 24px → 0, once. Headlines use masked word reveals that keep the real text for screen readers.
- Card tilt is capped at 6° (spring 150/20). Magnetic buttons move up to 6px. Both are off on touch devices.
- Hero parallax runs at 0.1× / 0.25× / 0.5×. The emblem scales and fades as you scroll away.
- `prefers-reduced-motion` turns off Lenis, the GSAP pin (you get a vertical timeline instead), parallax, tilt and the custom cursor, and swaps transforms for opacity.
- The 3D scene needs a wide viewport, WebGL, 4+ cores and 4GB+ of memory. Otherwise it falls back to the static SVG emblem. It also pauses rendering when the hero is off-screen.

---

## Notes and next steps

- **Assessments**: "Take assessment" is present in the UI, but the assessment engine itself (timed tasks and scoring) isn't built. `StudentSkill.score` / `verifiedAt` is where results would land.
- **File uploads**: avatars and CV uploads are not wired yet. UploadThing would slot into `app/api/uploadthing` and fill `User.image`, which also completes the profile-strength ring.
- **Cross-route S morph**: route changes use a fade (`app/template.tsx`). A true shared-element morph of the S between routes would need a persistent layout wrapper around every page.
- The migration SQL in `prisma/migrations/20260926000000_init` was hand-written to match the schema, following Prisma's conventions. As a one-time sanity check, run `pnpm db:migrate` against a scratch or dev database. It should report that the schema is already in sync and create no new migration.
