# Saveurel private Oracle preview

This deployment preserves the current interface while removing the production dependency on Cloudflare Workers and D1. It uses Node.js, a SQLite database on a persistent Docker volume, and standard OpenID Connect sign-in. Sites remains a separate deployment. Existing source files are not changed to impersonate Sites identity on Oracle.

The preview requires an explicit email allowlist. All HTML pages require a valid server-side session. Incoming `oai-authenticated-user-*` headers are ignored. OAuth uses authorization code flow with PKCE, state, nonce, and a single-use server-side flow record. The signed-in identity must have a verified email matching the allowlist. Session cookies contain opaque random tokens; only their hashes are stored in SQLite. Tokens expire after 24 hours. There is no customer self-registration or cloud administration permission granted to the application.

## Oracle resources

Proposed configuration, not proof of launch: San Jose (`us-sanjose-1`), `VM.Standard.A1.Flex`, 1 OCPU, 6 GB RAM, Ubuntu 24.04 Minimal ARM, default approximately 47 GB boot volume. Stay within the account's Always Free limits. Do not select paid shapes, upgrade the trial, or assume trial credit makes a resource Always Free. Capacity is only established by a successful launch.

The server uses an existing SSH public key. The corresponding private key stays on the owner's device/1Password agent. Confirm before installing that administrator key or exposing the server. Restrict SSH to the operator's source IP; expose HTTPS for the sign-in-protected preview. Do not expose port 3000 or the SQLite volume. Use a hostname and valid TLS certificate before OAuth.

## Identity configuration

Use an Oracle identity-domain confidential application with Authorization Code + PKCE. Register the exact callback `${APP_ORIGIN}/auth/callback`; request only `openid email profile`. Assign only the owner, require assignment, and do not grant Oracle API roles or client-credentials access. Do not enable self-registration or alter the domain's administrator policies. Save client secrets only in `deploy/oracle/oracle.env` on the host (mode 600), never in Git. A sign-in attempt must confirm Oracle supplies a verified email claim before the preview is declared working.

## Deployment

1. Install Docker, the Compose plugin, and Caddy from trusted Ubuntu/vendor sources on the instance.
2. Transfer a source checkout or archive over authenticated SSH; keep the GitHub repository private and never copy a GitHub token into the VM.
3. Copy `oracle.env.example` to `oracle.env`, supply the actual HTTPS origin, owner email allowlist, and identity settings. Keep this file outside the Docker build context and chmod 600 it.
4. From this directory run `docker compose build` and `docker compose up -d`. The application applies append-only schema migrations before starting. Docker creates the persistent `saveurel-data` volume.
5. Configure Caddy from `Caddyfile.example` with the actual hostname. The app listens only on the host loopback port 3000; Caddy terminates HTTPS.
6. Verify `/healthz`, anonymous redirect, real owner sign-in, private HTML access, persistent signup record, restart persistence, logout, and denied access from another account before handoff.

Back up SQLite using its online backup API, not by copying a live WAL database. Store backups privately and test restoration before relying on them. A boot volume is persistent storage, not a backup.

## Tests

`node --test deploy/oracle/app/*.test.mjs` covers private configuration, safe redirects, secured cookies, bound SQLite queries, forwarded-header rejection, same-origin writes, private HTML, and session/database persistence across a process restart. Test users are created only in temporary local databases. `npm test` checks the existing browsing and account logic. Real Oracle OIDC round-trip and remote Docker execution remain deployment checks.

The members table is compatible with the Sites schema, but user IDs are identity-provider-specific. Do not merge accounts by email or overwrite existing member IDs during migration. Export/check the live database before any data cutover; preserve it until migration is verified. Shortlists and venue research are still browser-local.

Oracle's discovery document advertises a shared issuer (`https://identity.oraclecloud.com/`) and domain-specific endpoints. Set both `OIDC_ISSUER` and `OIDC_DISCOVERY_URL`. The server checks the exact issuer and restricts metadata endpoints to the configured discovery origin, then uses the provider's advertised JWKS for token verification. It retrieves userinfo with subject matching when required email claims are absent from the ID token.
