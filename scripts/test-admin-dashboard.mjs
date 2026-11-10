import assert from 'node:assert/strict';
import fs from 'node:fs';
import { randomUUID, createHmac, createCipheriv, randomBytes } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

// Run against a local server only. Fixtures never create push delivery jobs.
const base = 'http://localhost:3000';
const sql = neon(process.env.DATABASE_URL);
const ids = Array.from({length: 52}, () => randomUUID());
const client = `dashboard-qa-${randomUUID()}`;
let cookie = '';
async function request(path, body, origin = base) {
  return fetch(base + path, { method: body === undefined ? 'GET' : 'POST', headers: {
    'Content-Type': 'application/json', Origin: origin, 'x-vercel-forwarded-for': client,
    ...(cookie ? { Cookie: cookie } : {}),
  }, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'manual' });
}
function encrypt(value) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(process.env.DATA_ENCRYPTION_KEY, 'hex'), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(value)), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map(part => part.toString('base64url')).join('.');
}
try {
  assert.equal((await request('/api/admin/submissions')).status, 401);
  const access = fs.readFileSync('.vercel/admin-access.txt', 'utf8');
  const password = access.match(/^Password: (.+)$/m)[1];
  const login = await request('/api/admin/login', { email: process.env.ADMIN_EMAIL, password });
  assert.equal(login.status, 200, 'Local login failed');
  cookie = login.headers.get('set-cookie').split(';')[0];
  const payload = {name:'Dashboard QA', email:'qa@example.invalid', phone:'5550100000', consent:true, answers:{}};
  await sql.transaction(ids.map((id, index) => sql`INSERT INTO submissions(id,kind,payload,status,created_at)
    VALUES(${id},${index < 26 ? 'appointments' : 'event'},${encrypt({...payload,id,kind:index < 26 ? 'appointments' : 'event'})},${index < 26 ? 'new' : 'reviewed'},'2100-01-02T12:00:00Z')`));
  const range = 'from=2100-01-02T00%3A00%3A00Z&to=2100-01-03T00%3A00%3A00Z';
  const first = await (await request('/api/admin/submissions?' + range)).json();
  assert.equal(first.total, 52); assert.equal(first.items.length, 50);
  assert.equal(first.counts.reduce((sum,row)=>sum+row.count,0), 52);
  const second = await (await request('/api/admin/submissions?' + range + '&page=2')).json();
  assert.equal(second.items.length, 2);
  assert.equal(new Set([...first.items,...second.items].map(item=>item.id)).size, 52);
  const filtered = await (await request('/api/admin/submissions?' + range + '&kind=event&status=reviewed')).json();
  assert.equal(filtered.total, 26); assert.ok(filtered.items.every(item=>item.kind==='event' && item.status==='reviewed'));
  const empty = await (await request('/api/admin/submissions?from=2100-01-01T00%3A00%3A00Z&to=2100-01-02T00%3A00%3A00Z')).json();
  assert.equal(empty.total, 0, 'End boundary must be exclusive');
  for (const query of ['page=-1','page=1.5','kind=invalid','from=no-date','from=2100-01-03T00:00:00Z&to=2100-01-02T00:00:00Z']) {
    assert.equal((await request('/api/admin/submissions?' + query)).status, 400);
  }
  const detail = await (await request('/api/admin/submission?id=' + ids[51])).json();
  assert.equal(detail.item.id, ids[51], 'Deep links work outside page one');
  assert.equal((await request('/api/admin/status', {id:ids[51],status:'completed'})).status, 200);
  const updated = await (await request('/api/admin/submission?id=' + ids[51])).json();
  assert.equal(updated.item.status, 'completed');
  assert.equal((await request('/api/admin/change-password', {currentPassword:'wrong-password',newPassword:'not-a-real-password-123'})).status, 400);
  assert.equal((await request('/api/admin/change-password', {currentPassword:password,newPassword:'short'})).status, 400);
  assert.equal((await request('/api/admin/change-password', {}, 'https://untrusted.invalid')).status, 403);
  const html = await (await request('/admin')).text();
  assert.ok(html.includes('Back to website')); assert.ok(html.includes('Recent submissions'));
  assert.equal((await request('/api/admin/logout', {})).status, 200);
  cookie=''; assert.equal((await request('/api/admin/submissions')).status, 401);
  console.log('PASS: authentication, date boundaries, type/status filters, full totals, pagination, deep links, status changes, password validation, CSRF, dashboard render, and logout.');
} finally {
  await sql`DELETE FROM submissions WHERE id=ANY(${ids}::uuid[])`;
  for (const group of ['login','password']) {
    const key=createHmac('sha256',process.env.SESSION_SECRET).update(`${group}:${client}`).digest('hex');
    await sql`DELETE FROM rate_limits WHERE key=${key}`;
  }
  console.log('Dashboard fixtures removed.');
}
