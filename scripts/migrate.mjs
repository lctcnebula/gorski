import fs from 'node:fs';
import { neon } from '@neondatabase/serverless';
const sql=neon(process.env.DATABASE_URL);
const commands=fs.readFileSync(new URL('./schema.sql',import.meta.url),'utf8').split(';').map(s=>s.trim()).filter(Boolean);
for(const command of commands) await sql.query(command);
console.log('Database schema is ready.');
