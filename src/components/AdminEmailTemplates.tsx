"use client";
import { useState } from "react";
import { submissionLabels } from "@/lib/admin-client";
import { emailTemplates, renderEmailTemplate, type TemplateKind } from "@/lib/email-templates";
import { formKinds, type FormKind } from "@/lib/email-settings";

export function AdminEmailTemplates() {
  const [kind, setKind] = useState<FormKind>("appointments");
  const [type, setType] = useState<TemplateKind>("confirmation");
  const template = emailTemplates[kind][type];
  const preview = renderEmailTemplate(kind, type, "Alex", "Our team will be in touch to help you with the next steps.");
  return <section className="mt-7" aria-labelledby="templates-title">
    <h2 id="templates-title" className="text-xl font-semibold">Email templates</h2>
    <p className="mt-2 text-sm text-ink-soft">Fixed confirmation and follow-up templates for each form. Names and office contact details are filled in when you prepare a response.</p>
    <div className="mt-5 flex flex-wrap gap-2">{formKinds.map(form => <button key={form} className={`btn ${kind === form ? "btn-primary" : "btn-outline"}`} aria-pressed={kind === form} onClick={() => setKind(form)}>{submissionLabels[form]}</button>)}</div>
    <div className="mt-5 grid items-start gap-5 lg:grid-cols-[300px_1fr]">
      <div className="rounded-xl border border-line bg-white p-4"><p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">{submissionLabels[kind]}</p>{(["confirmation", "reply"] as const).map(value => <button key={value} onClick={() => setType(value)} aria-pressed={type === value} className={`mb-2 w-full rounded-lg border p-4 text-left ${type === value ? "border-brand bg-brand-soft" : "border-line"}`}><span className="block text-sm font-semibold">{emailTemplates[kind][value].title}</span><span className="mt-1 block text-xs text-ink-soft">{value === "confirmation" ? "Receipt acknowledgment" : "Office follow-up"}</span></button>)}</div>
      <article className="overflow-hidden rounded-xl border border-line bg-white"><div className="border-b border-line p-5"><h3 className="font-semibold">{template.title}</h3><p className="mt-2 text-sm text-ink-soft"><strong>Subject:</strong> {preview.subject}</p></div><div className="border-b-4 border-brand p-6 font-semibold">Gorski Chiropractic Center</div><div className="whitespace-pre-wrap p-6 text-sm leading-relaxed text-ink-soft">{preview.text}</div></article>
    </div>
  </section>;
}
