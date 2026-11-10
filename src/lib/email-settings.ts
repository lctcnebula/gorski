import { z } from "zod";

export const formKinds = ["appointments", "assessment", "event"] as const;
export type FormKind = typeof formKinds[number];
const address = z.string().trim().email().max(254).transform(value => value.toLowerCase());
export const emailSettingsSchema = z.object({
  contacts: z.array(z.object({ label: z.string().trim().min(1).max(60), email: address })).max(5),
}).superRefine((value, ctx) => {
  if (new Set(value.contacts.map(contact => contact.email)).size !== value.contacts.length) ctx.addIssue({ code: "custom", path: ["contacts"], message: "Each contact email must be unique." });
});
export type EmailSettings = z.infer<typeof emailSettingsSchema>;
export const emptyEmailSettings: EmailSettings = { contacts: [] };
