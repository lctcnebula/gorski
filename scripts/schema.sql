CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('appointments','assessment','event')),
  payload text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewed','completed')),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS submissions_created ON submissions (created_at DESC);
CREATE TABLE IF NOT EXISTS rate_limits (key text PRIMARY KEY, count int NOT NULL, expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS push_subscriptions (id text PRIMARY KEY, payload text NOT NULL, created_at timestamptz NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS push_deliveries (
  submission_id uuid NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  subscription_id text NOT NULL REFERENCES push_subscriptions(id) ON DELETE CASCADE,
  state text NOT NULL DEFAULT 'pending',
  attempts int NOT NULL DEFAULT 0,
  PRIMARY KEY(submission_id, subscription_id)
);
ALTER TABLE push_deliveries ADD COLUMN IF NOT EXISTS last_attempt_at timestamptz;

CREATE TABLE IF NOT EXISTS admin_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT NOW()
);
