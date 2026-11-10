"use client";
import { useEffect, useState } from "react";
import { assessmentQuestions } from "@/lib/assessment";
import { adminApi, adminInput, submissionLabels, type AdminSubmission } from "@/lib/admin-client";
import { renderEmailTemplate } from "@/lib/email-templates";
import { Icon } from "./Icon";

export function AdminSubmissionDetail({ item, onClose, onStatus, busy }: { item: AdminSubmission; onClose: () => void; onStatus: (status: string) => void; busy: boolean }) {
  const [contactEmail, setContactEmail] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    void adminApi("contact-emails", undefined, controller.signal).then(data => {
      if (!controller.signal.aborted) setContactEmail(data.contacts[0]?.email || "");
    }).catch(() => {});
    return () => controller.abort();
  }, []);
  const [compose, setCompose] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  function draft(confirmation: boolean) {
    const email = renderEmailTemplate(item.kind, confirmation ? "confirmation" : "reply", item.name, undefined, contactEmail);
    setSubject(email.subject);
    setBody(email.text);
    setCompose(true);
  }
  return <aside className="min-w-0 rounded-xl border border-line bg-white p-5 sm:p-6" aria-labelledby="request-title">
    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wide text-brand">{submissionLabels[item.kind]}</p><h2 id="request-title" className="display mt-2 break-words text-3xl">{item.name}</h2></div><button className="grid size-11 shrink-0 place-items-center rounded-lg border border-line" aria-label="Close submission" onClick={onClose}><Icon name="close" className="size-4" /></button></div>
    <p className="mt-2 text-sm text-ink-soft">Received {new Date(item.createdAt).toLocaleString()}</p>
    <div className="mt-5 flex flex-col items-start gap-3"><a href={`mailto:${item.email}`} className="break-all text-sm text-brand underline">{item.email}</a><a href={`tel:${item.phone}`} className="text-sm text-brand underline">{item.phone}</a></div>
    <label className="mt-6 block text-sm font-medium">Request status<select disabled={busy} value={item.status} onChange={event => onStatus(event.target.value)} className={`${adminInput} mt-2`}><option value="new">New</option><option value="reviewed">Reviewed</option><option value="completed">Completed</option></select></label>
    <dl className="mt-6 space-y-5 border-t border-line pt-6">
      {Object.entries({ Address: item.address, Occupation: item.occupation, Hobbies: item.hobbies, "Preferred date": item.preferredDate, [item.kind === "event" ? "Event or workshop" : "Message"]: item.message }).filter(([, value]) => value).map(([label, value]) => <div key={label}><dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed">{value}</dd></div>)}
      {item.kind === "assessment" && assessmentQuestions.map(question => <div key={question.id}><dt className="text-sm text-ink-soft">{question.label}</dt><dd className="mt-1 text-sm font-medium">{item.answers[question.id] || "Not provided"}</dd></div>)}
      <div><dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Consent</dt><dd className="mt-1 text-sm">{item.consent ? "Provided" : "Not provided"}</dd></div>
    </dl>
    <div className="mt-6 border-t border-line pt-6"><h3 className="font-semibold">Respond to this request</h3><div className="mt-3 flex flex-wrap gap-2"><button className="btn btn-outline" onClick={() => draft(true)}>Confirmation</button><button className="btn btn-primary" onClick={() => draft(false)}>Write reply</button></div></div>
    {compose && <div className="mt-5 space-y-4"><label className="block text-sm font-medium">To<input className={`${adminInput} mt-2`} value={item.email} readOnly /></label><label className="block text-sm font-medium">Subject<input className={`${adminInput} mt-2`} maxLength={200} value={subject} onChange={event => setSubject(event.target.value)} /></label><label className="block text-sm font-medium">Message<textarea className={`${adminInput} mt-2 min-h-56`} maxLength={3000} value={body} onChange={event => setBody(event.target.value)} /></label><div className="flex flex-wrap gap-2"><a className="btn btn-primary" href={`mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>Open in email app</a><button className="btn btn-outline" onClick={() => setCompose(false)}>Cancel</button></div><p className="text-sm text-ink-soft">Review and send in your email app. Delivery is not tracked in this dashboard.</p></div>}
  </aside>;
}
