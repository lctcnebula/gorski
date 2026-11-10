"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { assessmentQuestions } from "@/lib/assessment";

export function NativeForm({ form }: { form: "appointments" | "assessment" | "event" }) {
  const router=useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const requestId = useRef<string | null>(null);
  const inputClass = "mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-lg text-ink";
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    requestId.current ??= crypto.randomUUID();
    const payload = Object.fromEntries(data.entries());
    try {
      const response = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        ...payload, id: requestId.current, kind: form, consent: data.get("consent") === "on",
        answers: Object.fromEntries(assessmentQuestions.map(q => [q.id, data.get(q.id) || ""])),
      }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not save your form.");
      setSaved(true);
      if (form === "assessment") router.push("/thank-you-for-assessment-submission");
    } catch (err) { setError(err instanceof Error ? err.message : "Please try again or call the office."); }
    finally { setBusy(false); }
  }
  if (saved) return <div role="status" className="rounded-xl bg-sage-soft p-8 text-ink"><h2 className="display text-3xl">Thank you. We received your request.</h2><p className="mt-4">Our office will review your information and contact you. Your appointment is confirmed only when you hear from us.</p></div>;
  return <form onSubmit={submit} className="native-form space-y-7 rounded-xl bg-white p-5 sm:p-8">
    <h2 className="display text-3xl">{form === "appointments" ? "Request an appointment" : form === "assessment" ? "Migraine Severity Assessment" : "Register for an event"}</h2>
    <div className="grid gap-6 sm:grid-cols-2">
      <label className="text-lg font-medium sm:col-span-2">Full name <span aria-hidden>*</span><input name="name" required minLength={2} maxLength={150} autoComplete="name" className={inputClass} /></label>
      <label className="text-lg font-medium">Email <span aria-hidden>*</span><input name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} /></label>
      <label className="text-lg font-medium">Phone <span aria-hidden>*</span><input name="phone" type="tel" required minLength={7} maxLength={40} autoComplete="tel" className={inputClass} /></label>
      {form === "appointments" && <label className="text-lg font-medium">Preferred date<input name="preferredDate" type="date" min={new Date().toLocaleDateString("en-CA")} className={inputClass} /><span className="mt-2 block text-sm text-muted">We will contact you to confirm availability.</span></label>}
      {form === "assessment" && <>
        <label className="text-lg font-medium sm:col-span-2">Address<input name="address" required maxLength={500} autoComplete="street-address" className={inputClass} /></label>
        <label className="text-lg font-medium">Occupation<input name="occupation" required maxLength={200} className={inputClass} /></label>
        <label className="text-lg font-medium">Hobbies<input name="hobbies" required maxLength={500} className={inputClass} /></label>
      </>}
    </div>
    {form === "assessment" && <fieldset className="space-y-6 border-t border-line pt-6"><legend className="px-2 text-lg font-semibold">Your migraine experience</legend>{assessmentQuestions.map(q => <label key={q.id} className="block text-lg font-medium">{q.label}<select name={q.id} required defaultValue="" className={inputClass}><option value="" disabled>Select an answer</option>{q.options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>)}</fieldset>}
    <label className="block text-lg font-medium">{form === "event" ? "Event or workshop you are interested in" : "Anything else you would like us to know?"}<textarea name="message" rows={4} maxLength={3000} className={inputClass} /></label>
    <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="flex items-start gap-3 text-base text-ink-soft"><input name="consent" type="checkbox" required className="mt-1 size-5 shrink-0 accent-brand" /><span>I agree that the office may use this information to respond to my request. <Link className="underline" href="/privacy-policy">Privacy policy</Link>.</span></label>
    {error && <p role="alert" className="rounded-lg bg-brand-soft p-4 text-brand-deep">{error}</p>}
    <button disabled={busy} type="submit" className="btn btn-primary disabled:opacity-60">{busy ? "Sending…" : "Send securely"}</button>
    <p className="text-sm text-muted">This form is for office requests and is not monitored for emergencies.</p>
  </form>;
}
