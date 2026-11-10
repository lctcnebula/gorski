"use client";
import { useEffect, useState } from "react";
import { adminApi, adminInput } from "@/lib/admin-client";
import { emailSettingsSchema, type EmailSettings } from "@/lib/email-settings";

export function AdminContactEmails() {
  const [contacts, setContacts] = useState<EmailSettings["contacts"]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    void adminApi("contact-emails", undefined, controller.signal).then(data => {
      if (!controller.signal.aborted) { setContacts(data.contacts); setFailed(false); }
    }).catch(() => { if (!controller.signal.aborted) { setFailed(true); setMessage("Could not load contact emails. Please try again."); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [version]);
  function update(index: number, field: "label" | "email", value: string) {
    setContacts(current => current.map((contact, position) => position === index ? { ...contact, [field]: value } : contact));
    setMessage("");
  }
  return <section className="mt-7 max-w-3xl rounded-xl border border-line bg-white p-5 sm:p-7">
    <h2 className="text-xl font-semibold">Website contact emails</h2>
    <p className="mt-2 text-sm text-ink-soft">Add up to five email addresses. Their labels and addresses appear in the website footer and Contact Us page after saving.</p>
    <p className="mt-2 text-sm text-ink-soft">These are public contact addresses. Changing them does not change your admin sign-in.</p>
    {loading ? <p className="mt-6 text-sm">Loading email addresses…</p> : failed ? <button className="btn btn-outline mt-5" onClick={() => { setLoading(true); setVersion(value => value + 1); }}>Try again</button> :
      <form className="mt-6 space-y-5" onSubmit={async event => {
        event.preventDefault();
        const parsed = emailSettingsSchema.safeParse({ contacts });
        if (!parsed.success) { setMessage(parsed.error.issues[0].message); return; }
        setBusy(true); setMessage("");
        try { const data = await adminApi("contact-emails", parsed.data); setContacts(data.contacts); setMessage("Saved. Your website footer and Contact Us page now use these email addresses."); }
        catch (error) { setMessage(error instanceof Error ? error.message : "Could not save email addresses."); }
        finally { setBusy(false); }
      }}>
        {contacts.length === 0 && <p className="rounded-lg bg-paper p-4 text-sm text-ink-soft">No public contact emails added yet. Add the addresses you want visitors to use.</p>}
        {contacts.map((contact, index) => <fieldset key={index} disabled={busy} className="rounded-xl border border-line p-4"><legend className="px-1 text-sm font-semibold">Contact {index + 1}</legend><div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Label<input className={`${adminInput} mt-2`} value={contact.label} onChange={event => update(index, "label", event.target.value)} placeholder="e.g. General enquiries" maxLength={60} required /></label>
          <label className="text-sm font-medium">Email address<input className={`${adminInput} mt-2`} type="email" value={contact.email} onChange={event => update(index, "email", event.target.value)} placeholder="office@example.com" maxLength={254} required /></label>
        </div><button type="button" className="mt-3 min-h-11 text-sm font-medium text-brand" onClick={() => { setContacts(current => current.filter((_, position) => position !== index)); setMessage(""); }}>Remove contact {index + 1}</button></fieldset>)}
        <div className="flex flex-wrap gap-2"><button type="button" disabled={contacts.length >= 5 || busy} className="btn btn-outline" onClick={() => { setContacts(current => [...current, { label: "", email: "" }]); setMessage(""); }}>Add email</button><button type="submit" disabled={busy} className="btn btn-primary">{busy ? "Saving…" : "Save contact emails"}</button><a href="/contact-us" target="_blank" rel="noreferrer" className="btn btn-outline">View Contact Us</a></div>
      </form>}
    {message && <p role="status" className="mt-4 text-sm text-ink-soft">{message}</p>}
  </section>;
}
