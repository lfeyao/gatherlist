# Contributing to Saveurel

Saveurel is an early prototype. Useful contributions include accessibility fixes, reproducible bugs, source corrections, matching edge cases and documentation that makes the tool easier to run or adapt.

Use Node 24 LTS. Install the locked dependencies with `npm ci`, then run `npm run dev` and open http://127.0.0.1:5173. Run `npm test` for application logic. The portable-server checks use `node --test deploy/oracle/app/*.test.mjs`.

Describe the user-visible problem, your change and relevant verification in a pull request. Keep venue source links and uncertain fields intact. Do not infer live availability, complete event prices, venue endorsements or customer adoption. Do not commit member data, tokens, environment files or private deployment settings.

Discovery records are in `public/discovery.js`, matching and import/export logic in `public/core.js`, and the account helpers in `lib/accounts.mjs`. UI HTML lives in `ui/`. Account records and browser-local shortlists are separate stores.

The Sites starter supplies development-only authentication. Do not treat browser-provided headers as authenticated identity outside the Sites environment. The portable deployment uses an independent owner-restricted OIDC flow documented under `deploy/oracle/`.

Venue photos are owned by third parties. Link source material and preserve credit; do not contribute photos without suitable rights. Font and component notices retain their own licenses.
