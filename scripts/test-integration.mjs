import assert from 'node:assert/strict';
import fs from 'node:fs';
import { randomUUID, createHmac } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { assessmentQuestions } from '../src/lib/assessment.ts';

const base=process.env.TEST_BASE_URL||'http://localhost:3000';
if(!['http://localhost:3000','https://gorski-chiropractic.vercel.app'].includes(base))throw new Error('Unapproved test URL');
const access=fs.readFileSync('.vercel/admin-access.txt','utf8');
const password=access.match(/^Password: (.+)$/m)[1];
const sql=neon(process.env.DATABASE_URL);
let cookie='';const ids=[];const testClient='qa-'+randomUUID();
async function request(path,body,origin=base){return fetch(base+path,{method:body?'POST':'GET',redirect:'manual',headers:{'Content-Type':'application/json',Origin:origin,'x-vercel-forwarded-for':testClient,...(cookie?{Cookie:cookie}:{})},body:body?JSON.stringify(body):undefined});}
try {
  assert.equal((await request('/api/admin/submissions')).status,401);
  assert.equal((await request('/admin')).status,307);
  assert.equal((await request('/api/admin/login',{email:process.env.ADMIN_EMAIL,password:'wrong-password'})).status,401);
  const login=await request('/api/admin/login',{email:process.env.ADMIN_EMAIL,password});assert.equal(login.status,200);
  const setCookie=login.headers.get('set-cookie');assert.match(setCookie,/HttpOnly/i);assert.match(setCookie,/SameSite=strict/i);cookie=setCookie.split(';')[0];
  assert.equal((await request('/api/admin/submissions')).status,200);
  assert.equal((await request('/api/submissions',{},'https://example.invalid')).status,403);
  assert.equal((await request('/api/submissions',{name:'Incomplete'})).status,400);
  assert.equal((await request('/api/admin/subscribe',{endpoint:'http://127.0.0.1/private',keys:{}})).status,400);
  for(const kind of ['appointments','assessment','event']) {
    const id=randomUUID();ids.push(id);
    const payload={id,kind,name:'QA Synthetic Patient',email:'qa@example.invalid',phone:'5550100000',address:'Test address',occupation:'Test',hobbies:'Test',consent:true,answers:Object.fromEntries(assessmentQuestions.map(q=>[q.id,q.options[0]]))};
    assert.equal((await request('/api/submissions',payload)).status,200);
    assert.equal((await request('/api/submissions',payload)).status,200);
    const rows=await sql`SELECT payload FROM submissions WHERE id=${id}`;assert.equal(rows.length,1);assert.ok(!rows[0].payload.includes('QA Synthetic Patient'));
    const data=await (await request('/api/admin/submissions')).json();assert.equal(data.items.find(i=>i.id===id).name,payload.name);
    assert.equal((await request('/api/admin/status',{id,status:'reviewed'})).status,200);
  }
  const manifest=await (await request('/admin/manifest.webmanifest')).json();assert.equal(manifest.display,'standalone');assert.equal(manifest.start_url,'/admin');
  assert.equal((await request('/admin/sw.js')).status,200);
  assert.equal((await request('/api/admin/logout',{})).status,200);
  cookie='';assert.equal((await request('/api/admin/submissions')).status,401);
  console.log('PASS: authentication, authorization, CSRF, validation, three native forms, idempotency, encrypted storage, status updates, PWA assets, logout.');
} finally {
  for(const id of ids) await sql`DELETE FROM submissions WHERE id=${id}`;
  for(const group of ['submission','login']){const key=createHmac('sha256',process.env.SESSION_SECRET).update(group+':'+testClient).digest('hex');await sql`DELETE FROM rate_limits WHERE key=${key}`;}
  console.log('Synthetic submissions removed.');
}
