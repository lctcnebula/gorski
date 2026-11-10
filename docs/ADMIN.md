# Doctor dashboard

- Production dashboard: https://gorski-chiropractic.vercel.app/admin
- Login credentials are stored privately in `.vercel/admin-access.txt` on the development machine. This file is excluded from deployment and version control.
- The public website uses three native forms: appointments, migraine assessment, and event registration. The assessment preserves the 30 multiple-choice questions from the original form.
- The dashboard lists submissions, shows their details, and supports New, Reviewed, and Completed statuses.

## Storage and security

Neon Postgres is provisioned through Vercel Marketplace on the free plan and connected to this Vercel project. Submission contents and push subscriptions are encrypted with AES-256-GCM before storage. The database stores submission type, timestamps, and status separately. Keep the encryption key backed up securely: changing or losing it makes existing encrypted records unreadable.

The password is stored as a salted scrypt hash. Sessions use encrypted, HttpOnly, SameSite cookies with an eight-hour expiry. API routes independently check authentication. Mutations check Origin, public forms and login are rate limited, and submissions use UUID idempotency keys. Private responses are not cached. No patient data is included in push notification text or cached for offline access.

## Install and enable notifications

Open `/admin` and sign in. On supported browsers, use Install app or the browser installation control. On iPhone/iPad, use Safari Share > Add to Home Screen, then open that installed app. Choose Enable alerts and allow notifications. Use Send test to check delivery on that device.

Web Push requires the user's permission. Alerts are sent immediately after a saved submission. Failed deliveries are stored in an outbox and retried on subsequent submissions and by the daily Vercel cron. Expired subscriptions are removed. The service worker caches only a generic offline page, never inbox records.

## Environment variables

`DATABASE_URL` is supplied by the Neon integration. Server-only variables: `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `DATA_ENCRYPTION_KEY`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, `PUBLIC_APP_URL`, `CRON_SECRET`. They are configured in Vercel production. Local copies live in ignored `.env.local`.

Run `node --env-file=.env.local scripts/migrate.mjs` for idempotent database setup. `scripts/configure-admin.mjs` is a guarded initial setup script, not a routine deployment command. Do not rerun it to rotate the encryption key.

## Validation

`node --env-file=.env.local scripts/test-integration.mjs` requires a local server and removes its synthetic submissions after testing. It checks authentication, authorization, CSRF, invalid input, all three form types, idempotency, encrypted storage, status changes, manifest/service-worker delivery, and logout.

The browser test confirmed login, native appointment submission, inbox retrieval, PWA registration, and the blocked-notification state. The test browser denies notification permission, so actual notification delivery must be confirmed on the doctor's enabled device with Send test.

## Form inboxes and contact emails

The dashboard has dedicated inboxes for appointment requests, migraine assessments, and event registrations. The overview cards count each form separately within the selected date and status filters. Each inbox retains the full submission details, including assessment answers and the event or workshop enquiry.

Use **Contact emails** to add, edit, or remove up to five labeled public email addresses. These are stored in `admin_settings` under `email_settings` and are read when the public footer and Contact Us page render. No public email addresses are assumed from the admin login. Changing contact emails does not change login credentials.

## Fixed response templates

**Email templates** previews the confirmation and follow-up text for each of the three forms. The six templates live in `src/lib/email-templates.ts`. The submission's Confirmation and Write reply buttons use the corresponding form's template, fill in the visitor's name, and add the first public contact email to the signature if one is configured. Appointment and event acknowledgments do not claim that a booking has been confirmed. Assessment acknowledgments omit questionnaire answers.

Responses open in the staff member's email app for review and sending. There is no automatic email delivery or email log in this implementation.

`node scripts/test-contact-emails.mjs` tests settings validation, authorization, public rendering, deletion, template selection, and escaping with an isolated in-memory store. It does not change production contacts.
