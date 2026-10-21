# San Diego small gatherings

A visual venue discovery and shortlist app for small gatherings in San Diego. Built collaboratively with Codex on October 20, 2026. The permanent name and logo are undecided; the repository and URL retain the original Gatherlist identifier.

## Try it

The private Site is registered at https://gatherlist-daiyu.lfeyao.chatgpt.site . See the deployment receipt for publication status. It is owner-private; this is not yet a public application example.

```sh
npm test
npm run preview
```

Open http://127.0.0.1:8765 . Node 22 and Python 3 are sufficient; no package installation, API key or build step is needed. Instrument Sans is self-hosted with its OFL license in `dist/fonts/`.

## What works

- Browse nine photographic mood groups, three across on desktop, with venues directly beneath each mood.
- Start with guest count, browse the mood, then compare estimated cost or an honest quote-needed label.
- Open venue details, save a unique shortlist, or refine city, category, hours, budget, date and required features.
- Paste listing text, extract explicit fields locally, then review and save.
- Add and edit listings with source URLs, notes, review status and explicit availability dates.
- Compare flat, hourly and per-person prices as event estimates; distinguish fit, missing information and exclusions.
- Save a shortlist and export a Markdown brief with sources, estimates and open questions.
- Import UTF-8 CSV with quoted and multiline fields, all-or-nothing validation, duplicate skipping and import preview. Export a portable CSV backup.
- Keep eleven public-source San Diego leads separate from eight fictional demo listings.
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
