# Saveurel

A visual venue discovery and shortlist app for small gatherings in San Diego. Built collaboratively with Codex on October 20, 2026. Saveurel is the current working identity, with a crescent-and-table emblem. Trademark clearance has not been performed; the repository and URL retain the original Gatherlist identifier.

![Saveurel room view, local development preview](docs/saveurel-preview.png)

## Try it

Source and screenshots are available in this repository. Start with the [case study](docs/case-study.md). The hosted preview at https://gatherlist-daiyu.lfeyao.chatgpt.site is owner-private; the source can be reviewed without access to that preview.

```sh
npm ci
npm test
npm run dev
```

Open http://127.0.0.1:5173. Use Node 24 LTS (the root package requires at least Node 22.13). The development server uses the starter’s local test identity; it is not proof of production authentication. No model API key is needed for browsing or matching. Instrument Sans and Cormorant Garamond are self-hosted with their OFL licenses in `public/fonts/`.

Additional portable-server checks: `node --test deploy/oracle/app/*.test.mjs`. See [Oracle deployment instructions](deploy/oracle/README.md) for the independent Node/SQLite version.

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
- `docs/case-study.md`: product overview, human direction, Codex contribution and current status.
- `docs/test-output.txt`: automated checks.

The venue discovery interface and business logic were developed in this chat on top of an OpenAI Sites starter and third-party dependencies. Greg Isenberg's episode supplied the business inspiration; the app does not use his code or imply his endorsement. TickerToThesis is a separate upstream-derived project and is not the basis of this app.

## Signup database

Cloudflare D1 binding `DB` stores the `members` table: site-scoped authenticated user ID (primary key), email, optional display name, original signup timestamp, and most recent workspace visit. Returning visitors update their identity and last-seen timestamp without duplicate rows. Passwords remain with ChatGPT.

`POST /api/account` registers the authenticated visitor on workspace arrival and requires a same-origin browser request. `GET /api/account` returns only that visitor’s record. Neither accepts a user ID from the browser. `/account` displays the signed-in visitor’s profile. There is no public member directory or anonymous signup write. The owner can inspect records in Sites Settings’ database viewer. Marketing subscriptions are not collected or implied.

The former static interface is preserved in `ui/` (HTML) and `public/` (assets). Vinext serves the existing design with protected account routes. Generate schema-only migrations with `npm run db:generate`, build through the Sites helper, and apply migrations locally before browser QA. Sites applies production migrations during publication. Local test identities are never copied into production.

Verification: 30 tests including real SQLite signup persistence, idempotent enrollment, per-user reads, cross-origin rejection, and unavailable database handling. Local browser flow uses the starter’s development-only identity; live identity must come from dispatch.

## Oracle private preview

A portable Node/SQLite deployment is prepared under `deploy/oracle/`. See [deployment instructions](deploy/oracle/README.md). It uses standard OIDC and an owner email allowlist rather than trusting Sites-injected identity headers. Oracle resources and a real OIDC round-trip must be verified before reporting the preview live.

## License, contributing and asset rights

Saveurel’s original code is available under the [MIT license](LICENSE). This grant excludes third-party photography, fonts and other material governed by separate terms.

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, useful contributions and verification. Venue photography remains owned by its respective rights holders; linked images are not licensed for redistribution by this repository. Font, starter and component notices retain their own terms. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
