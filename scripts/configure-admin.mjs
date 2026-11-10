import fs from 'node:fs';
import { randomBytes, scryptSync } from 'node:crypto';
import webpush from 'web-push';
if (fs.existsSync('.vercel/admin-env.json')) throw new Error('Admin configuration already exists.');
const password=randomBytes(24).toString('base64url');
const salt=randomBytes(16).toString('hex');
const vapid=webpush.generateVAPIDKeys();
const settings={ADMIN_EMAIL:'admin@gorskichiro.com',ADMIN_PASSWORD_HASH:salt+':'+scryptSync(password,salt,64).toString('hex'),SESSION_SECRET:randomBytes(48).toString('base64url'),DATA_ENCRYPTION_KEY:randomBytes(32).toString('hex'),VAPID_PUBLIC_KEY:vapid.publicKey,VAPID_PRIVATE_KEY:vapid.privateKey,VAPID_SUBJECT:'mailto:admin@gorskichiro.com',PUBLIC_APP_URL:'https://gorski-chiropractic.vercel.app',CRON_SECRET:randomBytes(32).toString('hex')};
let env=fs.readFileSync('.env.local','utf8');
for(const [key,value] of Object.entries(settings)){env=env.replace(new RegExp('^'+key+'=.*\\n?','m'),'');env+='\n'+key+'='+JSON.stringify(value);}
fs.writeFileSync('.env.local',env+'\n',{mode:0o600});
fs.mkdirSync('.vercel',{recursive:true});fs.writeFileSync('.vercel/admin-access.txt','Doctor dashboard\nhttps://gorski-chiropractic.vercel.app/admin\nLogin: '+settings.ADMIN_EMAIL+'\nPassword: '+password+'\nKeep this file private.\n',{mode:0o600});
fs.writeFileSync('.vercel/admin-env.json',JSON.stringify(settings),{mode:0o600});
console.log('Secure settings generated. Credentials saved privately in .vercel/admin-access.txt.');
