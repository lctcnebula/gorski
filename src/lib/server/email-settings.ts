import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { database } from "./db";
import { emailSettingsSchema, emptyEmailSettings } from "../email-settings";
import { mergeTemplates, parseTemplateOverrides, type TemplateOverrides } from "../email-templates";

export async function readEmailSettings() {
  const sql = database();
  const rows = await sql`SELECT value FROM admin_settings WHERE key='email_settings'`;
  return rows[0] ? emailSettingsSchema.parse(JSON.parse(rows[0].value)) : emptyEmailSettings;
}
// Request-scoped reads keep the footer and contact page consistent after a save.
export const publicContactEmails = cache(async () => {
  await connection();
  try { return (await readEmailSettings()).contacts; }
  catch { console.error("Public contact emails are temporarily unavailable."); return []; }
});

export async function readTemplateOverrides(): Promise<TemplateOverrides> {
  const rows = await database()`SELECT value FROM admin_settings WHERE key='email_templates'`;
  return rows[0] ? parseTemplateOverrides(JSON.parse(rows[0].value)) : {};
}
export async function readEmailTemplates() { return mergeTemplates(await readTemplateOverrides()); }
