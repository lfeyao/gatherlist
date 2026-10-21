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

Before starting this original event-discovery project, Codex prepared a local TickerToThesis queue-publication fix at `/Users/daiyu/Documents/codex-ambassador-application/case-study/TickerToThesis`, branch `codex/atomic-handoff-publication`. Two regression tests failed on the existing code; the fix stages a complete request before renaming it into the visible queue. All four targeted tests then passed. It is uncommitted and unpublished. It does not establish Codex authorship of the fork's three earlier Muse integration commits. Gatherlist is the stronger original application example.

## Interface redesign — October 20, 2026

The user asked for a polished interface with a less generic visual identity. The redesigned application uses a self-hosted Instrument Sans type system, compact navigation, a working page header, supplier rows with comparable metrics, expandable match explanations, consistent SVG controls, and a collapsible mobile event brief. The old marketing hero, table illustration and lettermark were removed. "Sourcing desk" is a functional working title; the user has not selected a permanent name or logo. Existing source records and the localStorage key are preserved.

Browser verification covers 1280px desktop, 768px tablet and a 320px phone iframe viewport. At 320px, a filter overflow was found and fixed; body scroll width then matched its 320px viewport. The mobile listing dialog fit within its viewport without horizontal overflow. Bookmarking retained keyboard focus; removing the last shortlist item restored focus to the Shortlist navigation. Supplier match explanations and shortlist export controls were checked after the redesign. These viewport checks are browser simulations, not physical-device testing.

Font source: https://github.com/google/fonts/tree/main/ofl/instrumentsans ; its OFL license ships with the font. No packages or system tools were installed.

## Customer-led mood discovery redesign

The user redirected the app around people, vibe and cost, then requested nine graphic mood groups with three groups per row and venue suggestions beneath each. Replaced the research-desk home with the photographic discovery grid, compact guest/budget controls, mood exploration, venue detail dialogs and a deduplicated shortlist. Research, CSV and source tools remain accessible under Manage listings. The name and logo are still undecided.

Expanded the public-source starter from four to eleven leads using official Herb & Wood, MCASD and Mingei pages. Nine overlapping mood groupings are explicitly editorial; no verified prices or availability were invented. Photos retain source and photographer credit. CUCINA/The Prado imagery is identified as general venue photography.

Preserved browser records, saved IDs and the existing storage key. Added one-time starter migrations and whitelisted mood data that survives CSV export/import. Unassigned user records remain discoverable outside the nine named mood groups. WebMCP now exposes the selected mood and each record’s editorial moods.

Validation: 19 automated tests passed, including mood coverage, grouping, unassigned records and CSV round trips. Browser checks covered nine groups in three desktop columns, selected-mood expansion, venue details, save/shortlist, the 40-person capacity exclusion, a $1,000 fictional-demo budget exclusion, clear demo labeling, and 320/768 px layouts. At 320 px neither the body nor guest/budget form overflowed. Temporary browser test changes were restored to 24 guests, $1,800, My research and no test bookmarks. No tools or packages were installed.

## Distinct places in distinct categories

The user identified repeated venues across mood groups. Replaced the overlapping starter assignments with one primary mood per venue, tightened the nine themes, and researched thirteen additional venues to supply 18 distinct places. Different rooms at Herb & Wood, MCASD and Mingei count as the same place; old room records stay available for review, saved lists and exports but do not pad discovery. No fictional venues fill gaps.

The listing editor now uses a single primary-mood radio group. Validation and CSV import retain one mood; the grouping logic also handles legacy multiple-mood data, deduplicates room aliases and assigns before selected-category filtering. A one-time migration adds new leads and updates curated mood assignments while preserving edited fields, saved IDs and later deletions.

The nine groups are Candlelit dinners; Courtyards & gardens; Art & design; Ocean views; Old-world charm; Chef-led dining; Beer & lawn games; Rooftop nights; Hidden lounges. Each has two distinct venue businesses in the default 24-person view. Real capacity and budget filters may reduce the count; they never borrow a venue from another group to fill a slot.

Validation: 22 tests passed, including 18 unique featured venue IDs and business identities, single primary mood/CSV round trip, legacy room-alias deduplication, stable selected-category membership and migration preservation. Browser inspection confirmed 18 cards, 18 unique IDs and nine groups, all with two venues. No broken loaded images were reported. Selected Art & design retained exactly Bread & Salt and Mingei.

Additional browser checks: saving a new Bread & Salt lead produced a single shortlist card; removing the test bookmark restored the initial state. The listing editor contained ten mood radios (nine categories plus Not assigned), zero mood checkboxes and exactly one checked option. At 320 px there were still 18 unique cards with no horizontal overflow; the 768 px layout used two columns.

## Dark appearance

Added a top-right Appearance menu with System, Light and Dark. The default follows the device; an explicit choice persists in a separate browser key. A small head script applies the palette before the stylesheet paints, follows system changes only in System mode, and tolerates unavailable storage. Dark styling covers forms, dialogs, selected guest counts, source-management tools and shortlist surfaces. Venue photos remain unchanged. Three behavioral tests cover startup, system changes, persistence, invalid preferences and unavailable storage; all 25 project tests pass. Browser verification confirmed that Dark survives reload, preserves all 18 venue cards and renders advanced forms with dark controls.
