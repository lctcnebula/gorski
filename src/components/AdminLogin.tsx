"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export function AdminLogin() {
  const router=useRouter();
  const [error,setError]=useState("");const [busy,setBusy]=useState(false);
  return <main id="main" className="grid min-h-svh place-items-center px-5 py-12"><form className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-sm" onSubmit={async e=>{
    e.preventDefault();setBusy(true);setError("");const data=new FormData(e.currentTarget);
    try {const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(data))});const d=await r.json();if(!r.ok)throw new Error(d.error);router.replace('/admin');router.refresh();}catch(err){setError(err instanceof Error?err.message:'Please try again.');setBusy(false);}
  }}><Link href="/" className="text-sm text-brand">Gorski Chiropractic</Link><h1 className="display mt-8 text-4xl">Your office, at a glance.</h1><p className="mt-4 text-base text-ink-soft">Sign in to review requests and manage notifications.</p>
    <label className="mt-8 block text-sm font-semibold">Email<input type="email" name="email" autoComplete="username" required className="mt-2 w-full rounded-lg border border-line p-3 text-base" /></label>
    <label className="mt-5 block text-sm font-semibold">Password<input type="password" name="password" autoComplete="current-password" required className="mt-2 w-full rounded-lg border border-line p-3 text-base" /></label>
    {error&&<p role="alert" className="mt-4 text-sm text-brand-deep">{error}</p>}<button disabled={busy} className="btn btn-primary mt-7 w-full disabled:opacity-50">{busy?'Signing in…':'Sign in'}</button><Link href="/" className="btn btn-outline mt-3 w-full">Back to website</Link>
  </form></main>;
}
