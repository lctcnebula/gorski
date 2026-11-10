"use client";
import { useState } from "react";
import { adminApi, adminInput } from "@/lib/admin-client";

export function AdminPassword() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  return <section className="mt-8 max-w-xl rounded-xl border border-line bg-white p-5 sm:p-7" aria-labelledby="password-title">
    <h2 id="password-title" className="text-xl font-semibold">Change password</h2>
    <p className="mt-2 text-sm text-ink-soft">Use at least 12 characters. Other signed-in devices will need to sign in again.</p>
    <form className="mt-6 space-y-5" onSubmit={async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      setMessage("");
      if (data.get("newPassword") !== data.get("confirmPassword")) { setMessage("New passwords do not match."); return; }
      setBusy(true);
      try {
        await adminApi("change-password", { currentPassword: data.get("currentPassword"), newPassword: data.get("newPassword") });
        form.reset(); setMessage("Password changed. This device is still signed in.");
      } catch (error) { setMessage(error instanceof Error ? error.message : "Could not change password."); }
      finally { setBusy(false); }
    }}>
      {[['currentPassword', 'Current password', 'current-password'], ['newPassword', 'New password', 'new-password'], ['confirmPassword', 'Confirm new password', 'new-password']].map(([name, label, autoComplete]) => <label key={name} className="block text-sm font-medium">{label}<input name={name} type="password" autoComplete={autoComplete} required minLength={name === 'currentPassword' ? 1 : 12} maxLength={256} disabled={busy} className={`${adminInput} mt-2`} /></label>)}
      <button type="submit" disabled={busy} className="btn btn-primary">{busy ? "Saving…" : "Update password"}</button>
      {message && <p role="status" className="text-sm text-ink-soft">{message}</p>}
    </form>
  </section>;
}
