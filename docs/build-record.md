# Codex build record

Date: October 20, 2026 (America/Los_Angeles).

## Human direction

The user asked to build something following Greg Isenberg's linked post, chose small-event venues and vendors, and chose San Diego as the initial market. This does not establish the user's residence or an existing event-organizing track record.

## Codex contribution

In this chat, Codex researched the reference and official local supplier pages, designed the application, wrote the HTML/CSS/JavaScript, implemented extraction, matching, persistence, CSV import/export, shortlist export and a read-only browser-agent interface, and wrote and ran the tests. The user chose the market and city and can review and steer the product.

The rules-based text extractor is not a model-backed feature. The accurate product claim is "built with Codex", not "Codex independently runs a sourcing business". Artoo's participation in this build has not been established.

## Verification

- Automated tests cover price normalization, capacity and minimum guests, city/category exclusions, unknown values, feature extraction, date validation, ranking, CSV quoting and validation, formula escaping, demo labels, provenance and proposal uncertainty. The exact results are in test-output.txt.
- Browser QA on the local Site: reviewed desktop layout; pasted a synthetic listing; checked extracted city, capacity and price range; saved it; saw the expected fit; starred it; opened Shortlist; invoked Markdown export and saw its success state. Removed the temporary fixture afterward; the starter list returned to four leads.
- WebMCP: confirmed registration; read matches with valid empty input; verified unexpected input fails without modifying state.
- Browser persistence, CSV import dialog, demo separation and final screenshot are recorded during final QA.

## Limits

No paying customers, vendor partnerships, revenue, delivered event, time savings benchmark or independently verified supplier quality is claimed. No messages were sent to venues. The Site starts owner-private. A public link or public source repository must be made available before using it as public application evidence. Mobile breakpoints are implemented; no physical-device mobile test was performed.

## Earlier separate fork work

Before the user chose Gatherlist, Codex prepared a local TickerToThesis queue-publication fix at `/Users/daiyu/Documents/codex-ambassador-application/case-study/TickerToThesis`, branch `codex/atomic-handoff-publication`. Two regression tests failed on the existing code; the fix stages a complete request before renaming it into the visible queue. All four targeted tests then passed. It is uncommitted and unpublished. It does not establish Codex authorship of the fork's three earlier Muse integration commits. Gatherlist is the stronger original application example.

## Interface redesign — October 20, 2026

The user asked for a polished interface with a less generic visual identity. The redesigned application uses a self-hosted Instrument Sans type system, compact navigation, a working page header, supplier rows with comparable metrics, expandable match explanations, consistent SVG controls, and a collapsible mobile event brief. The old marketing hero, table illustration and lettermark were removed. "Sourcing desk" is a functional working title; the user has not selected a permanent name or logo. Existing source records and the localStorage key are preserved.

Browser verification covers 1280px desktop, 768px tablet and a 320px phone iframe viewport. At 320px, a filter overflow was found and fixed; body scroll width then matched its 320px viewport. The mobile listing dialog fit within its viewport without horizontal overflow. Bookmarking retained keyboard focus; removing the last shortlist item restored focus to the Shortlist navigation. Supplier match explanations and shortlist export controls were checked after the redesign. These viewport checks are browser simulations, not physical-device testing.

Font source: https://github.com/google/fonts/tree/main/ofl/instrumentsans ; its OFL license ships with the font. No packages or system tools were installed.
