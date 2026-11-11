"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { assessmentQuestions } from "@/lib/assessment";
import { SITE } from "@/lib/site";

const steps = [
  { title: "About you", questions: [] as number[] },
  { title: "Your migraines", questions: [0, 1, 2, 3, 4] },
  { title: "Symptoms", questions: [5, 6, 7, 8, 9] },
  { title: "Triggers", questions: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19] },
  { title: "Managing them", questions: [20, 21, 22] },
  { title: "Daily life", questions: [23, 24, 25, 26, 27, 28, 29] },
];

export function NativeForm({ form }: { form: "appointments" | "assessment" | "event" }) {
  const router=useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const requestId = useRef<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const stepped = form === "assessment";
  const last = !stepped || step === steps.length - 1;
  /** Reports the first invalid field in a step; returns false if it needs attention. */
  function validStep(index: number) {
    const fields = Array.from(formRef.current?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(`[data-step="${index}"] :is(input,textarea)`) ?? []);
    const invalid = fields.find(field => !field.checkValidity());
    if (!invalid) return true;
    setStep(index);
    requestAnimationFrame(() => { invalid.closest("fieldset,label")?.scrollIntoView({ block: "center" }); invalid.reportValidity(); });
    return false;
  }
  function go(next: number) {
    if (next > step && !validStep(step)) return;
    setStep(next); setError("");
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
  const inputClass = "mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-lg text-ink";
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (stepped) {
      if (!last) { go(step + 1); return; }
      for (let index = 0; index < steps.length; index++) if (!validStep(index)) return;
    }
    setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    requestId.current ??= crypto.randomUUID();
    const payload = Object.fromEntries(data.entries());
    try {
      const response = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        ...payload, id: requestId.current, kind: form, consent: data.get("consent") === "on", smsMarketing: data.get("smsMarketing") === "on", smsUpdates: data.get("smsUpdates") === "on",
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
  return <form ref={formRef} onSubmit={submit} noValidate={stepped} className="native-form scroll-mt-28 space-y-7 rounded-xl bg-white p-5 sm:p-8">
    <h2 className="display text-3xl">{form === "appointments" ? "Request an appointment" : form === "assessment" ? "Migraine Severity Assessment" : "Register for an event"}</h2>
    {stepped && <div>
      <p className="text-base font-medium text-ink-soft">Step {step + 1} of {steps.length} · <span className="text-ink">{steps[step].title}</span></p>
      <ol className="mt-3 grid grid-cols-6 gap-1.5" aria-hidden>{steps.map((item, index) => <li key={item.title} className={`h-1.5 rounded-full ${index <= step ? "bg-brand" : "bg-line"}`} />)}</ol>
    </div>}
    <div data-step={0} hidden={stepped && step !== 0} className="grid gap-6 sm:grid-cols-2">
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
    {stepped && steps.slice(1).map((item, offset) => <div key={item.title} data-step={offset + 1} hidden={step !== offset + 1} className="space-y-7">
      {item.questions.map(index => { const q = assessmentQuestions[index]; return <fieldset key={q.id}>
        <legend className="text-lg font-medium">{q.label.replace(/_{3,}/, "…").replace(/\s+\.$/, ".")}</legend>
        <div className="mt-3 flex flex-wrap gap-2">{q.options.map(option => <label key={option} className="cursor-pointer">
          <input type="radio" name={q.id} value={option} required className="peer sr-only" />
          <span className="block rounded-lg border border-line px-4 py-2.5 text-base text-ink-soft transition-colors peer-checked:border-brand peer-checked:bg-brand-soft peer-checked:text-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand hover:border-ink-soft">{option}</span>
        </label>)}</div>
      </fieldset>; })}
    </div>)}
    <div data-step={steps.length - 1} hidden={!last} className="space-y-7">
    <label className="block text-lg font-medium">{form === "event" ? "Event or workshop you are interested in" : "Anything else you would like us to know?"}<textarea name="message" rows={4} maxLength={3000} className={inputClass} /></label>
    <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="flex items-start gap-3 text-base text-ink-soft"><input name="smsMarketing" type="checkbox" className="mt-1 size-5 shrink-0 accent-brand" /><span>I consent to receive marketing text messages about special offers, discounts, and service updates from {SITE.name} at the phone number provided. Message frequency varies. Message &amp; data rates may apply. Text HELP for assistance, reply STOP to opt out.</span></label>
    <label className="flex items-start gap-3 text-base text-ink-soft"><input name="smsUpdates" type="checkbox" className="mt-1 size-5 shrink-0 accent-brand" /><span>I consent to receive non-marketing text messages from {SITE.name} about appointment scheduling, appointment reminders, and care-related updates. Message frequency varies. Message &amp; data rates may apply. Text HELP for assistance, reply STOP to opt out.</span></label>
    <label className="flex items-start gap-3 text-base text-ink-soft"><input name="consent" type="checkbox" required className="mt-1 size-5 shrink-0 accent-brand" /><span>I agree that the office may use this information to respond to my request. <span aria-hidden>*</span></span></label>
    <p className="text-base font-semibold text-ink"><Link className="underline underline-offset-4 hover:text-brand" href="/terms-and-conditions">Terms and Conditions</Link> <span aria-hidden className="text-muted">|</span> <Link className="underline underline-offset-4 hover:text-brand" href="/privacy-policy">Privacy Policy</Link></p>
    </div>
    {error && <p role="alert" className="rounded-lg bg-brand-soft p-4 text-brand-deep">{error}</p>}
    <div className="flex flex-wrap items-center gap-3">
      {stepped && step > 0 && <button type="button" onClick={() => go(step - 1)} className="btn btn-outline">Back</button>}
      <button disabled={busy} type="submit" className="btn btn-primary disabled:opacity-60">{busy ? "Sending…" : last ? "Send securely" : "Next"}</button>
    </div>
    <p className="text-sm text-muted">This form is for office requests and is not monitored for emergencies.</p>
  </form>;
}
