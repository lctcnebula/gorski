import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const require = createRequire(import.meta.url);
function load(path, mocks = {}) {
  const output = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const loaded = { exports: {} };
  vm.runInNewContext(output, { module: loaded, exports: loaded.exports, require: name => name in mocks ? mocks[name] : require(name), process, Buffer, Request, Response, URL, console });
  return loaded.exports;
}
let stored;
let signedIn = true;
const sql = async (parts, ...values) => {
  const query = parts.join('?');
  if (query.includes("SELECT value FROM admin_settings")) return stored ? [{value:stored}] : [];
  if (query.includes("INSERT INTO admin_settings")) { stored = values[0]; return []; }
  throw new Error('Unexpected query');
};
const settingsSchema = load('src/lib/email-settings.ts');
const site = load('src/lib/site.ts');
const templates = load('src/lib/email-templates.ts',{'./site':site,'./email-settings':settingsSchema});
const serverSettings = load('src/lib/server/email-settings.ts', {
  'server-only': {}, react: {...React, cache: fn => fn}, 'next/server': {connection:async()=>{}},
  './db': {database:()=>sql}, '../email-settings': settingsSchema, '../email-templates': templates,
});
const route = load('src/app/api/admin/[...action]/route.ts', {
  '@/lib/server/db': {database:()=>sql}, '@/lib/server/security': {authenticated:async()=>signedIn, sameOrigin: request=>request.headers.get('origin')==='https://test.example'},
  '@/lib/server/push': {}, '@/lib/admin-filters': {}, '@/lib/email-settings': settingsSchema, '@/lib/server/email-settings': serverSettings, '@/lib/email-templates': templates,
});
function save(body, origin='https://test.example') { return route.POST(new Request('https://test.example/api/admin/contact-emails', {method:'POST',headers:{Origin:origin},body:JSON.stringify(body)}), {params:Promise.resolve({action:['contact-emails']})}); }
const contacts = [{label:'General enquiries',email:'HELLO@example.com'},{label:'Appointments',email:'bookings@example.com'},{label:'Events',email:'events@example.com'}];
assert.equal((await save({contacts}, 'https://evil.example')).status,403);
signedIn=false;assert.equal((await save({contacts})).status,401);signedIn=true;
assert.equal((await save({contacts:[{label:'x',email:'bad'}]})).status,400);
assert.equal((await save({contacts:[contacts[0],contacts[0]]})).status,400);
assert.equal((await save({contacts})).status,200);
const saved = await serverSettings.readEmailSettings();
assert.equal(saved.contacts.length,3);assert.equal(saved.contacts[0].email,'hello@example.com');
const Link=({href,children,...props})=>React.createElement('a',{href,...props},children);
const image=({src,alt,width,height,className})=>React.createElement('img',{src,alt,width,height,className});
const footer=load('src/components/Footer.tsx',{'next/image':image,'next/link':Link,'@/lib/site':site,'./Icon':{Icon:()=>null},'./BackToTop':{BackToTop:()=>null},'@/lib/server/email-settings':serverSettings});
const html=renderToStaticMarkup(await footer.Footer());
for (const contact of saved.contacts) assert.ok(html.includes(`mailto:${contact.email}`));
const wrappers={Stagger:({children})=>React.createElement('div',{},children),StaggerItem:({children})=>React.createElement('div',{},children),Reveal:({children})=>React.createElement('div',{},children)};
const contactPage=load('src/app/(site)/contact-us/page.tsx', {'next/link':Link,'@/components/Icon':{Icon:()=>null},'@/components/Motion':wrappers,'@/components/Sections':{CONTAINER:'',PageHero:()=>null},'@/lib/content':{CONTACT:{}},'@/lib/site':site,'@/lib/server/email-settings':serverSettings});
const contactHtml=renderToStaticMarkup(await contactPage.default());
for (const contact of saved.contacts) assert.ok(contactHtml.includes(`mailto:${contact.email}`));
assert.equal((await save({contacts:[]})).status,200);
assert.equal((await serverSettings.publicContactEmails()).length,0);
assert.ok(!renderToStaticMarkup(await footer.Footer()).includes('mailto:hello@example.com'));
const subjects = new Set();
for (const kind of settingsSchema.formKinds) {
  const confirmation=templates.renderTemplate(templates.emailTemplates[kind].confirmation,{name:'<script>bad()</script>',contactEmail:'office@example.com'});
  subjects.add(confirmation.subject);
  assert.ok(!confirmation.html.includes('<script>'));
  assert.ok(confirmation.html.includes('&lt;script&gt;'));
  assert.ok(confirmation.text.includes('office@example.com'));
  const reply=templates.renderTemplate(templates.mergeTemplates({[kind]:{reply:{subject:'Edited {{name}}',body:'Hi {{name}} ({{email}}), {{message}}'}}})[kind].reply,{name:'Alex',email:'a@b.co',message:'Your next steps.'});
  assert.ok(reply.text.includes('Your next steps.'));
  assert.ok(!reply.text.includes('{{'));
  assert.ok(reply.subject.startsWith('Edited Alex'));
  assert.ok(reply.text.includes('a@b.co'));
}
assert.equal(subjects.size,3);
console.log('PASS: authenticated email editing, CSRF, validation, normalization, footer/contact rendering, removal, form-specific templates, and HTML escaping. No production data changed.');
