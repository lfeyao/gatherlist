# Saveurel

A visual venue discovery and shortlist app for small gatherings in San Diego. Built collaboratively with Codex on October 20, 2026. Saveurel is the current working identity, with a crescent-and-table emblem. Trademark clearance has not been performed; the repository and URL retain the original Gatherlist identifier.

## Try it

The private Site is registered at https://gatherlist-daiyu.lfeyao.chatgpt.site . See the deployment receipt for publication status. It is owner-private; this is not yet a public application example.

```sh
npm test
npm run preview
```

Open http://127.0.0.1:8765 . Node 22 and Python 3 are sufficient; no package installation, API key or build step is needed. Instrument Sans and Cormorant Garamond are self-hosted with their OFL licenses in `dist/fonts/`.

## What works

- Room view: rotate nine moods with arrows, keyboard or touch swipes; room photography, site colours and venue suggestions change together. Switch to the equal-size Mood grid at any time. Your view and mood are remembered.

- Toggle Light/Dark with the header sun/moon icon. The initial appearance follows the system until you choose; the choice persists separately from venue data.
- Sign up / Log in uses hosted ChatGPT authentication and returns to a protected workspace. The workspace records the authenticated member in managed Cloudflare D1. The existing owner-private audience remains unchanged. Shortlists and research remain browser-local; signup records are durable.

- Browse nine photographic mood groups, three across on desktop, with two different venues directly beneath each mood; no venue repeats across categories.
- Start with guest count, browse the mood, then compare estimated cost or an honest quote-needed label.
- Open venue details, save a unique shortlist, or refine city, category, hours, budget, date and required features.
- Paste listing text, extract explicit fields locally, then review and save.
- Add and edit listings with source URLs, notes, review status and explicit availability dates.
- Compare flat, hourly and per-person prices as event estimates; distinguish fit, missing information and exclusions.
- Save a shortlist and export a Markdown brief with sources, estimates and open questions.
- Import UTF-8 CSV with quoted and multiline fields, all-or-nothing validation, duplicate skipping and import preview. Export a portable CSV backup.
- Feature 18 distinct San Diego venues across nine primary moods, plus a sourced caterer. Older room records remain available for review, saved lists and export; eight fictional demo listings stay separate.
- Persist workspace data in this browser; a read-only WebMCP tool exposes the current brief, chosen mood and matches to a browser agent.

## Boundaries

This version is a sourcing tool. No automated social-platform collection, messaging, payments or booking is implemented. The text extractor and matcher use local rules, not a model or an AI service. Unknown fields remain unknown; provider quality, credentials, availability and final quotes need direct confirmation. Browser-local records do not sync across devices. The static Site source contains only public research and fictional fixtures; user-entered data stays in localStorage.

## Build evidence

- `docs/build-record.md`: scope, Codex attribution, verification and limits.
- `docs/sources.md`: primary sources behind the San Diego starter.
- `docs/business-plan.md`: how to validate a small matching service around this tool.
- `docs/application-draft.md`: program answers and a 30-second introduction script.
- `docs/test-output.txt`: automated checks.

The project is original code in this chat. Greg Isenberg's episode supplied the business inspiration; the app does not use his code or imply his endorsement. TickerToThesis is a separate upstream-derived project and is not the basis of this app.

## Signup database

Cloudflare D1 binding `DB` stores the `members` table: site-scoped authenticated user ID (primary key), email, optional display name, original signup timestamp, and most recent workspace visit. Returning visitors update their identity and last-seen timestamp without duplicate rows. Passwords remain with ChatGPT.

`POST /api/account` registers the authenticated visitor on workspace arrival and requires a same-origin browser request. `GET /api/account` returns only that visitor’s record. Neither accepts a user ID from the browser. `/account` displays the signed-in visitor’s profile. There is no public member directory or anonymous signup write. The owner can inspect records in Sites Settings’ database viewer. Marketing subscriptions are not collected or implied.

The former static interface is preserved in `ui/` (HTML) and `public/` (assets). Vinext serves the existing design with protected account routes. Generate schema-only migrations with `npm run db:generate`, build through the Sites helper, and apply migrations locally before browser QA. Sites applies production migrations during publication. Local test identities are never copied into production.

Verification: 30 tests including real SQLite signup persistence, idempotent enrollment, per-user reads, cross-origin rejection, and unavailable database handling. Local browser flow uses the starter’s development-only identity; live identity must come from dispatch.
