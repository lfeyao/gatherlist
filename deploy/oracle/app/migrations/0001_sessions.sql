CREATE TABLE sessions (
 token_hash TEXT PRIMARY KEY NOT NULL,
 user_id TEXT NOT NULL,
 email TEXT NOT NULL,
 full_name TEXT,
 expires_at INTEGER NOT NULL
);
CREATE TABLE login_flows (
 token_hash TEXT PRIMARY KEY NOT NULL,
 state TEXT NOT NULL,
 nonce TEXT NOT NULL,
 verifier TEXT NOT NULL,
 return_to TEXT NOT NULL,
 expires_at INTEGER NOT NULL
);
CREATE INDEX sessions_expiration ON sessions(expires_at);
CREATE INDEX login_expiration ON login_flows(expires_at);
