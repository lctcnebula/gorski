import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(path, mocks) {
  const output=ts.transpileModule(fs.readFileSync(path,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  const loadedModule={exports:{}};
  vm.runInNewContext(output,{module:loadedModule,exports:loadedModule.exports,require:name=>name in mocks?mocks[name]:require(name),process,Buffer,Request,Response,URL,console},{filename:path});
  return loadedModule.exports;
}
let stored;
let activeSession;
const sql=async (parts,...values)=>{
  const query=parts.join('?');
  if(query.includes('SELECT value FROM admin_settings'))return stored?[{value:stored}]:[];
  if(query.includes('INSERT INTO admin_settings')){
    if(stored&&stored!==values[1])return [];
    stored=values[0];return [{key:'password_hash'}];
  }
  throw new Error('Unexpected query');
};
const database={database:()=>sql};
const security=load('src/lib/server/security.ts',{
  'server-only':{},'next/headers':{cookies:async()=>({})},
  'iron-session':{getIronSession:async()=>activeSession},'./db':database,
});
process.env.SESSION_SECRET='test-session-secret-not-used-for-real-cookies';
process.env.PUBLIC_APP_URL='http://localhost:3000';
process.env.ADMIN_PASSWORD_HASH=security.hashPassword('old-password-for-testing');
const oldSession={authenticated:true,version:await security.authVersion(),save:async()=>{}};
activeSession={...oldSession};
const route=load('src/app/api/admin/[...action]/route.ts',{
  '@/lib/server/db':database,
  '@/lib/server/security':{...security,rateLimit:async()=>true},
  '@/lib/server/push':{},
  '@/lib/server/email-settings':{},
  '@/lib/email-settings':load('src/lib/email-settings.ts',{}),
  '@/lib/admin-filters':load('src/lib/admin-filters.ts',{}),
});
function change(body){return route.POST(new Request('http://localhost:3000/api/admin/change-password',{
  method:'POST',headers:{Origin:'http://localhost:3000','Content-Type':'application/json'},body:JSON.stringify(body),
}),{params:Promise.resolve({action:['change-password']})});}
assert.equal((await change({currentPassword:'wrong',newPassword:'new-password-for-testing'})).status,400);
assert.equal(stored,undefined);
assert.equal((await change({currentPassword:'old-password-for-testing',newPassword:'old-password-for-testing'})).status,400);
assert.equal((await change({currentPassword:'old-password-for-testing',newPassword:'new-password-for-testing'})).status,200);
assert.equal(security.passwordMatches('new-password-for-testing',stored),true);
assert.equal(security.passwordMatches('old-password-for-testing',stored),false);
assert.equal(await security.authenticated(),true,'Current session should stay signed in');
activeSession=oldSession;
assert.equal(await security.authenticated(),false,'Previous sessions must be invalidated');
console.log('PASS: wrong current password, unchanged password, persistent password hash, current session retained, and other sessions invalidated.');
