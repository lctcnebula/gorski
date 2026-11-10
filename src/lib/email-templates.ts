import { SITE } from "./site";
import type { FormKind } from "./email-settings";
export type TemplateKind = "confirmation" | "reply";
export const emailTemplates: Record<FormKind, Record<TemplateKind, { title: string; subject: string; body: string }>> = {
  appointments: {
    confirmation: { title: "Appointment request received", subject: "We received your appointment request", body: "Hi {{name}},\n\nThank you for requesting an appointment with Gorski Chiropractic. Our office has received your request and will contact you to discuss availability.\n\nThis email confirms receipt of your request only. Your appointment is not booked until our office confirms a date and time.\n\nIf you need to reach us sooner, please call {{phone}}." },
    reply: { title: "Appointment follow-up", subject: "Following up on your appointment request", body: "Hi {{name}},\n\nThank you for your interest in an appointment with Gorski Chiropractic.\n\n{{message}}\n\nPlease reply to this email or call {{phone}} if you have any questions." },
  },
  assessment: {
    confirmation: { title: "Assessment received", subject: "We received your assessment", body: "Hi {{name}},\n\nThank you for completing your assessment. Our office has received it and will contact you about the next steps.\n\nFor your privacy, your answers are not included in this email. This acknowledgment does not provide a diagnosis or replace a consultation.\n\nYou can reach our office at {{phone}}." },
    reply: { title: "Assessment follow-up", subject: "Next steps after your assessment", body: "Hi {{name}},\n\nThank you for taking the time to complete your assessment.\n\n{{message}}\n\nPlease call {{phone}} to discuss any personal health information with our office." },
  },
  event: {
    confirmation: { title: "Event registration received", subject: "We received your event registration", body: "Hi {{name}},\n\nThank you for registering your interest in a Gorski Chiropractic event or workshop. Our office has received your registration and will follow up with event details and availability.\n\nYour place is confirmed only when our team contacts you.\n\nFor questions, please call {{phone}}." },
    reply: { title: "Event registration follow-up", subject: "About your event registration", body: "Hi {{name}},\n\nThank you for your interest in our event or workshop.\n\n{{message}}\n\nPlease reply to this email or call {{phone}} if you need help." },
  },
};
export function renderEmailTemplate(kind: FormKind, type: TemplateKind, name: string, message = "Our office will contact you to discuss the next steps.", contactEmail = "") {
  const template = emailTemplates[kind][type];
  const values: Record<string, string> = { name, message, phone: SITE.phone };
  const text = template.body.replace(/\{\{(name|message|phone)\}\}/g, (_, key) => values[key]) + `\n\n${SITE.name}\n${SITE.phone}${contactEmail ? `\n${contactEmail}` : ""}`;
  const escape = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
  const html = `<!doctype html><html><body style="margin:0;background:#faf6f0;font-family:Arial,sans-serif;color:#231f20"><table role="presentation" style="width:100%;padding:32px 16px"><tr><td><table role="presentation" style="max-width:600px;width:100%;margin:auto;background:#fff;border:1px solid #e8dfd7;border-radius:12px"><tr><td style="padding:28px 32px;border-bottom:3px solid #944a46;font-size:20px;font-weight:bold">${escape(SITE.name)}</td></tr><tr><td style="padding:32px;font-size:16px;line-height:1.7"><h1 style="font-size:24px;line-height:1.3">${escape(template.title)}</h1>${text.split('\n\n').map(paragraph => `<p>${escape(paragraph).replace(/\n/g, '<br>')}</p>`).join('')}</td></tr></table></td></tr></table></body></html>`;
  return { subject: `${template.subject} | ${SITE.shortName}`, text, html };
}
