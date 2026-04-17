# Tempo — CICDC 2026 Demo Site

## Source of Truth Documents
- `docs/Tempo_Pitch_Script.md` — pitch narrative, product names, financial figures
- `docs/Tempo_Deck_Specification.md` — visual brand direction and design system
- `docs/Tempo_QA_Curriculum.md` — competitive positioning and Q&A strategy

## Tech Stack
- Next.js 15 (App Router, TypeScript strict mode)
- Tailwind CSS 4 + shadcn/ui
- Anthropic SDK for AI features (claude-sonnet-4-5 model)
- Deploy target: Vercel

## Design System
- Primary background: #E8DFD2 (warm sand)
- Secondary background: #FAFAF7 (off-white)
- Primary text: #1A1A1A (deep charcoal)
- Accent amber: #C29E5F (numbers, emphasis)
- Accent sage: #7A8B75 (positive states, CTAs)
- Accent terracotta: #C4725A (alerts — use sparingly)
- Headlines: Playfair Display
- Body: Inter

## Brand Voice Rules

### Identity-First Language
- USE: "disabled customer," "wheelchair user," "post-stroke customer"
- NEVER USE: "differently-abled," "special needs," "handicapable," "people suffering from"

### Caregiver Language
- Must be in FIRST or SECOND person
- USE: "for your client," "you can help your patient"
- NEVER: "for their caregiver," "for the caregiver" (third person is wrong)

### Prohibited Framings
- NEVER: "inspired by," "brave," "overcoming," "despite their condition"
- NEVER: "everyone deserves" (charity framing)
- NEVER: "it's the right thing to do"
- USE: "designed with disabled advisors," "built for the adaptive customer"
- USE: business framing — market opportunity, user need, product feature

### Ablesaviorism Check
- Never center the non-disabled founder's journey
- Never use disability as a tragic backstory device
- Always: disabled people are experts, advisors, co-designers — credited and compensated

## Code Rules
- No localStorage or sessionStorage anywhere
- No authentication (marketing site)
- No real payment processing — use "Notify me when available" pattern
- No cookie banners or GDPR friction
- No stock photos of disabled people
- WCAG 2.1 AA is a hard requirement — if a feature can't ship accessible, it doesn't ship

## Before Declaring Any Task Done
```bash
pnpm lint && pnpm typecheck && pnpm build
```

## AI Features
- Model: claude-sonnet-4-5 (not claude-3-5-sonnet, not claude-opus)
- Route: /api/fit-concierge (POST, streaming)
- Route: /api/passport-narrator (POST, non-streaming)
- API key via ANTHROPIC_API_KEY env var

## Accessibility Requirements
- All interactive elements keyboard-reachable via Tab
- Focus rings visible (using --color-amber, 2px solid, 2px offset)
- All images: meaningful alt text (never "image" or "photo")
- Color contrast: minimum 4.5:1 for normal text, 3:1 for large text
- Accessibility statement: /accessibility (first-class nav item, not footer link)

## Comment Policy
- Write zero comments by default
- Only comment when the WHY is non-obvious: a hidden constraint, an adaptive-specific behavior
- Never: "// This handles the X case" — name the variable better instead
