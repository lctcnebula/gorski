"use client";
import { useEffect, useState } from "react";
import { adminApi, adminInput, formCatalog } from "@/lib/admin-client";
import { renderTemplate, templateEditSchema, templateKinds, templatePlaceholders, type EmailTemplates, type TemplateKind } from "@/lib/email-templates";
import type { FormKind } from "@/lib/email-settings";

const typeLabels: Record<TemplateKind, string> = { confirmation: "Confirmation", reply: "Follow-up reply" };
const options = formCatalog.flatMap(form => templateKinds.map(type => ({ kind: form.kind as FormKind, type, label: `${form.title} — ${typeLabels[type]}` })));

export function AdminEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplates | null>(null);
  const [defaults, setDefaults] = useState<EmailTemplates | null>(null);
  const [active, setActive] = useState(options[0]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    void adminApi("email-templates", undefined, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      setTemplates(data.templates); setDefaults(data.defaults);
      setSubject(data.templates[options[0].kind][options[0].type].subject);
      setBody(data.templates[options[0].kind][options[0].type].body);
    }).catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, []);

  if (failed) return <p className="mt-7 rounded-lg bg-brand-soft p-4 text-sm">Could not load email templates. Reload the page to try again.</p>;
  if (!templates || !defaults) return <p className="mt-7 text-sm text-ink-soft">Loading email templates…</p>;

  const saved = templates[active.kind][active.type];
  const dirty = subject !== saved.subject || body !== saved.body;
  const isDefault = subject === defaults[active.kind][active.type].subject && body === defaults[active.kind][active.type].body;
  const preview = renderTemplate({ ...saved, subject, body }, { name: "Alex Smith", email: "alex@example.com", message: "Our team will be in touch to help you with the next steps." });

  function choose(option: typeof options[number]) {
    if (dirty && !confirm("Discard unsaved changes to this template?")) return;
    const next = templates![option.kind][option.type];
    setActive(option); setSubject(next.subject); setBody(next.body); setMessage("");
  }
  async function save(nextSubject = subject, nextBody = body) {
    const parsed = templateEditSchema.safeParse({ kind: active.kind, type: active.type, subject: nextSubject, body: nextBody });
    if (!parsed.success) { setMessage(parsed.error.issues[0].message); return; }
    setBusy(true); setMessage("");
    try {
      const data = await adminApi("email-templates", parsed.data);
      setTemplates(data.templates);
      setSubject(data.templates[active.kind][active.type].subject); setBody(data.templates[active.kind][active.type].body);
      setMessage("Template saved.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save template."); }
    finally { setBusy(false); }
  }

  return <section className="mt-7 grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]" aria-label="Email templates">
    <nav aria-label="Templates" className="rounded-xl border border-line bg-white p-2 lg:sticky lg:top-6">
      {options.map(option => {
        const current = option.kind === active.kind && option.type === active.type;
        return <button key={option.label} onClick={() => choose(option)} aria-current={current ? "true" : undefined} className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium ${current ? "bg-brand-soft text-brand" : "text-ink-soft hover:bg-paper-2"}`}>{option.label}</button>;
      })}
    </nav>
    <div className="min-w-0 rounded-xl border border-line bg-white p-5 sm:p-6">
      <form onSubmit={event => { event.preventDefault(); void save(); }}>
        <label className="block text-sm font-semibold">Subject<input className={`${adminInput} mt-2`} maxLength={200} value={subject} onChange={event => { setSubject(event.target.value); setMessage(""); }} /></label>
        <label className="mt-5 block text-sm font-semibold">Body<textarea className={`${adminInput} mt-2 min-h-72 font-normal leading-relaxed`} maxLength={5000} value={body} onChange={event => { setBody(event.target.value); setMessage(""); }} /></label>
        <p className="mt-2 text-xs text-ink-soft">Available placeholders: {templatePlaceholders.map(key => <code key={key} className="mr-1.5 rounded bg-paper-2 px-1 py-0.5">{`{{${key}}}`}</code>)}<br />The office name, phone, and first contact email are added as a signature automatically.</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button type="submit" disabled={busy || !dirty} className="btn btn-primary disabled:opacity-50">{busy ? "Saving…" : "Save template"}</button>
          {!isDefault && <button type="button" disabled={busy} className="btn btn-outline" onClick={() => { if (confirm("Restore the original text for this template?")) { const original = defaults[active.kind][active.type]; void save(original.subject, original.body); } }}>Restore default</button>}
          {message && <p role="status" className="text-sm text-ink-soft">{message}</p>}
        </div>
      </form>
      <h3 className="mt-8 border-t border-line pt-6 font-semibold">Preview <span className="font-normal text-ink-soft">(sample data)</span></h3>
      <p className="mt-2 text-sm text-ink-soft"><strong className="text-ink">Subject:</strong> {preview.subject}</p>
      <iframe title="Email preview" srcDoc={preview.html} sandbox="" className="mt-3 h-[560px] w-full rounded-lg border border-line bg-paper" />
    </div>
  </section>;
}
