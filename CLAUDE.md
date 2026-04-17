# Tempo

Sustainable adaptive fashion brand. Desta & Yishak Consulting client.

## What we're building
Next.js 15 App Router, TypeScript strict, Tailwind, shadcn/ui, Vercel.
AI features: Fit Concierge (streaming) and Passport Narrator (non-streaming), both on claude-sonnet-4-5.
DPP: ESPR-aligned digital product passports with QR codes.
Accessibility: WCAG 2.1 AA is the floor, not the ceiling.

## How to verify any change
Before saying "done":
1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm build`
4. For components: open the page in preview, tab through every interactive element, confirm focus rings show.
5. For data: confirm all 6 SKUs (TMP-001 through TMP-006) work where relevant.

## Hard rules
- No em dashes in any copy. Use ", " instead.
- Every image has meaningful alt text describing action, not condition. Never "wheelchair user" as alt. Prefer "person seated at a cafe wearing the charcoal Seated-Cut Trouser."
- Every interactive element is keyboard-reachable.
- Every form control has a linked label.
- Every dynamic update announces via aria-live where appropriate.
- No color-alone information conveyance.
- No auto-playing media.
- No motion on elements when prefers-reduced-motion is set.
- No "inspired by" or "overcoming" language in code comments, copy, or UI.
- Advisors are "advisors and co-designers," never "inspiration."
- Disabled people are referred to as disabled people (identity-first) unless a specific advisor has stated otherwise.

## Architecture references
- Passport data: src/data/passports.ts
- Product data: src/data/products.ts
- AI routes: src/app/api/concierge and src/app/api/narrator
- Components: src/components (ui, layout, product, passport)

## Delegation pattern
When a task has multiple parallel sub-tasks (build component + seed data + write test), spawn clone subagents via Task() rather than doing them sequentially. Each clone inherits this CLAUDE.md.