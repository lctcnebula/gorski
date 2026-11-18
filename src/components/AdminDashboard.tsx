"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi as api, adminInput, formCatalog, submissionLabel, submissionLabels, statusLabels, type AdminSubmission as Item } from "@/lib/admin-client";
import { dateBounds } from "@/lib/admin-filters";
import { AdminBlog } from "./AdminBlog";
import { AdminContactEmails } from "./AdminContactEmails";
import { AdminEmailTemplates } from "./AdminEmailTemplates";
import { AdminPassword } from "./AdminPassword";
import { AdminSubmissionDetail } from "./AdminSubmissionDetail";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{outcome:string}> };
type Count = {status:string;kind:string;count:number};
function keyBytes(value:string){const raw=atob(value.replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(raw,c=>c.charCodeAt(0));}
function localDate(date:Date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function Badge({status}:{status:string}){return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status==='new'?'bg-brand-soft text-brand':status==='completed'?'bg-sage-soft text-sage':'bg-paper-2 text-ink-soft'}`}>{statusLabels[status] || status}</span>;}

export function AdminDashboard({ initialSelectedId }: { initialSelectedId?: string }){
  const router=useRouter();
  const pushRegistration=useRef<ServiceWorkerRegistration|null>(null);
  const details=useRef<HTMLDivElement>(null);
  const requestController=useRef<AbortController|null>(null);
  const [installPrompt,setInstallPrompt]=useState<InstallPrompt|null>(null);
  const [view,setView]=useState<'dashboard'|'submissions'|'blog'|'password'|'emails'|'templates'>('dashboard');
  const [items,setItems]=useState<Item[]>([]),[counts,setCounts]=useState<Count[]>([]),[total,setTotal]=useState(0);
  const [formCounts,setFormCounts]=useState<{kind:string;count:number}[]>([]);
  const [selected,setSelected]=useState<Item|null>(null),[statusBusy,setStatusBusy]=useState(false);
  const [page,setPage]=useState(1),[kind,setKind]=useState('all'),[filterStatus,setFilterStatus]=useState('all');
  const [dates,setDates]=useState({from:'',to:''}),[dateDraft,setDateDraft]=useState({from:'',to:''}),[range,setRange]=useState('all');
  const [loading,setLoading]=useState(true),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const [pushEnabled,setPushEnabled]=useState(false),[pushBusy,setPushBusy]=useState(false),[pushSupported,setPushSupported]=useState(false);
  useEffect(()=>{const handler=(event:Event)=>{event.preventDefault();setInstallPrompt(event as InstallPrompt);};window.addEventListener('beforeinstallprompt',handler);return()=>window.removeEventListener('beforeinstallprompt',handler);},[]);
  const refresh=useCallback(async()=>{
    requestController.current?.abort();
    const controller=new AbortController();requestController.current=controller;
    setLoading(true);
    try{
      const query=new URLSearchParams({page:String(page),kind,status:filterStatus});
      const bounds=dateBounds(dates.from,dates.to);
      if(bounds.from)query.set('from',bounds.from);if(bounds.to)query.set('to',bounds.to);
      const data=await api(`submissions?${query}`,undefined,controller.signal);
      if(controller.signal.aborted)return;
      setItems(data.items);setCounts(data.counts);setFormCounts(data.formCounts || []);setTotal(data.total);setError('');
    }catch(e){
      if(controller.signal.aborted)return;
      setError(e instanceof Error?e.message:'Could not load requests.');
      if(e instanceof Error&&e.message.startsWith('Session expired'))router.replace('/admin/login');
    }finally{if(!controller.signal.aborted)setLoading(false);}
  },[page,kind,filterStatus,dates,router]);
  useEffect(()=>{let disposed=false;void Promise.resolve().then(()=>{if(!disposed)void refresh();});const timer=setInterval(refresh,30000);return()=>{disposed=true;clearInterval(timer);requestController.current?.abort();};},[refresh]);
  useEffect(()=>{
    if(!initialSelectedId)return;
    const controller=new AbortController();
    void api(`submission?id=${encodeURIComponent(initialSelectedId)}`,undefined,controller.signal).then(data=>{
      if(!controller.signal.aborted){setSelected(data.item);setKind(data.item.kind);setView('submissions');}
    }).catch(e=>{if(!controller.signal.aborted)setError(e instanceof Error?e.message:'Could not open submission.');});
    return()=>controller.abort();
  },[initialSelectedId]);
  useEffect(()=>{
    let cancelled=false;
    async function setupPush(){
      if(!window.isSecureContext||!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window)){
        setNotice('Notifications require HTTPS and a supported browser, such as Chrome on Android.');
        return;
      }
      try{
        await navigator.serviceWorker.register('/admin/sw.js',{scope:'/admin',updateViaCache:'none'});
        const registration=await navigator.serviceWorker.ready;
        if(cancelled)return;
        pushRegistration.current=registration;
        setPushSupported(true);
        const sub=await registration.pushManager.getSubscription();
        if(sub&&Notification.permission==='granted'){
          await api('subscribe',sub.toJSON());
          if(!cancelled)setPushEnabled(true);
        }
      }catch{
        if(!cancelled)setNotice('Could not set up notifications. Reload and try enabling alerts again.');
      }
    }
    void setupPush();
    return()=>{cancelled=true;};
  },[]);

  async function notifications(mode:'enable'|'disable'|'test'){
    setPushBusy(true);setNotice('');
    try{
      const registration=pushRegistration.current;
      if(!registration)throw new Error('Notifications are still starting. Please try again.');
      // Ask directly from the tap, before any asynchronous subscription or network work.
      if(mode==='enable'&&await Notification.requestPermission()!=='granted'){
        throw new Error('Allow notifications for this site in browser settings. On Android, also allow notifications for your browser in Settings.');
      }
      let sub=await registration.pushManager.getSubscription();
      if(mode==='enable'){
        const settings=await api('settings');
        if(!settings.vapidPublicKey)throw new Error('Notifications are not configured on the server.');
        sub??=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:keyBytes(settings.vapidPublicKey)});
        await api('subscribe',sub.toJSON());setPushEnabled(true);setNotice('Notifications enabled on this device.');
      }
      if(mode==='disable'){
        if(sub){await api('unsubscribe',{endpoint:sub.endpoint});await sub.unsubscribe();}
        setPushEnabled(false);setNotice('Notifications disabled on this device.');
      }
      if(mode==='test'){
        if(!sub||Notification.permission!=='granted'){
          setPushEnabled(false);throw new Error('Enable alerts on this device before sending a test.');
        }
        await api('subscribe',sub.toJSON());
        await api('test-push',{endpoint:sub.endpoint});setNotice('Test notification sent.');
      }
    }catch(e){setNotice(e instanceof Error?e.message:'Could not update notifications.');}finally{setPushBusy(false);}
  }

  async function status(value:string){
    if(!selected)return;
    setStatusBusy(true);
    try{await api('status',{id:selected.id,status:value});setSelected({...selected,status:value});await refresh();}
    catch(e){setError(e instanceof Error?e.message:'Could not update request.');}
    finally{setStatusBusy(false);}
  }
  function preset(value:string){
    const now=new Date(),start=new Date(now);
    if(value==='7')start.setDate(start.getDate()-6);
    if(value==='30')start.setDate(start.getDate()-29);
    const next=value==='all'?{from:'',to:''}:{from:localDate(start),to:localDate(now)};
    setDates(next);setDateDraft(next);setRange(value);setPage(1);
  }
  function select(item:Item){setSelected(item);requestAnimationFrame(()=>{details.current?.scrollIntoView({block:'nearest'});});}
  const sum=(predicate:(row:Count)=>boolean)=>counts.filter(predicate).reduce((value,row)=>value+row.count,0);
  const visible=view==='dashboard'?items.slice(0,8):items;
  const tabs=[['dashboard','Dashboard'],['submissions','Submissions'],['blog','Blog'],['templates','Email Templates'],['emails','Contact Emails'],['password','Change Password']] as const;
  function openInbox(formKind:string){setKind(formKind);setView('submissions');setPage(1);setSelected(null);}
  const activeForm=formCatalog.find(form=>form.kind===kind);
  return <main id="main" className="mx-auto max-w-[1500px] px-4 py-6 sm:px-8 sm:py-8">
    <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-line pb-4">
      <Link href="/" className="text-sm font-semibold text-ink">Gorski Chiropractic</Link>
      <nav aria-label="Dashboard" className="-mx-3 flex flex-wrap items-center">
        {tabs.map(([key,label])=><button key={key} onClick={()=>{setView(key);setPage(1);if(key==='dashboard'||key==='submissions'){setKind('all');setSelected(null);}}} aria-current={view===key?'page':undefined} className={`min-h-11 px-3 text-sm font-medium transition-colors ${view===key?'text-brand':'text-ink-soft hover:text-ink'}`}>{label}</button>)}
        <Link href="/" className="flex min-h-11 items-center px-3 text-sm font-medium text-ink-soft hover:text-ink">Website</Link>
        <button className="min-h-11 px-3 text-sm font-medium text-ink-soft hover:text-ink" onClick={async()=>{try{await api('logout',{});router.replace('/admin/login');router.refresh();}catch{setError('Could not sign out. Please try again.');}}}>Logout</button>
      </nav>
    </header>
    {error&&<p role="alert" className="mt-5 rounded-lg bg-brand-soft p-4 text-sm">{error}</p>}
    {view==='submissions'&&<nav aria-label="Form inboxes" className="mt-5 flex flex-wrap gap-x-5 border-b border-line text-sm">{[{kind:'all',title:'All forms'},...formCatalog].map(form=><button key={form.kind} onClick={()=>openInbox(form.kind)} aria-current={kind===form.kind?'page':undefined} className={`-mb-px min-h-11 border-b-2 font-medium ${kind===form.kind?'border-brand text-brand':'border-transparent text-ink-soft hover:text-ink'}`}>{form.title}</button>)}</nav>}
    {view==='blog'?<AdminBlog/>:view==='password'?<AdminPassword/>:view==='emails'?<AdminContactEmails/>:view==='templates'?<AdminEmailTemplates/>:<>
      <section className="mt-6 rounded-xl border border-line bg-white p-4 sm:p-5" aria-label="Submission filters">
        <div className="flex flex-wrap gap-2">{[['all','All time'],['today','Today'],['7','Last 7 days'],['30','Last 30 days']].map(([value,label])=><button key={value} onClick={()=>preset(value)} aria-pressed={range===value} className={`min-h-11 rounded-full border px-4 text-sm ${range===value?'border-brand bg-brand-soft font-semibold text-brand':'border-line text-ink-soft'}`}>{label}</button>)}</div>
        <form className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]" onSubmit={event=>{event.preventDefault();if(dateDraft.from&&dateDraft.to&&dateDraft.from>dateDraft.to){setError('Choose an end date on or after the start date.');return;}setDates(dateDraft);setRange('custom');setPage(1);}}>
          <label className="text-xs font-semibold text-ink-soft">From<input aria-label="From date" type="date" value={dateDraft.from} onChange={event=>setDateDraft({...dateDraft,from:event.target.value})} className={`${adminInput} mt-1`}/></label>
          <label className="text-xs font-semibold text-ink-soft">To<input aria-label="To date" type="date" min={dateDraft.from||undefined} value={dateDraft.to} onChange={event=>setDateDraft({...dateDraft,to:event.target.value})} className={`${adminInput} mt-1`}/></label>
          <label className="text-xs font-semibold text-ink-soft">Type<select value={kind} onChange={event=>{setKind(event.target.value);setPage(1);}} className={`${adminInput} mt-1`}><option value="all">All types</option>{Object.entries(submissionLabels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
          <label className="text-xs font-semibold text-ink-soft">Status<select value={filterStatus} onChange={event=>{setFilterStatus(event.target.value);setPage(1);}} className={`${adminInput} mt-1`}><option value="all">All statuses</option>{Object.entries(statusLabels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
          <button type="submit" className="btn btn-outline self-end">Apply dates</button>
        </form>
      </section>
      {view==='dashboard'&&<section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Forms overview">{formCatalog.map(form=><article key={form.kind} className="rounded-xl border border-line bg-white p-5"><div className="flex items-start justify-between gap-3"><h2 className="font-semibold">{form.title}</h2><span className="display text-3xl text-brand">{loading?'…':formCounts.find(row=>row.kind===form.kind)?.count || 0}</span></div><p className="mt-2 text-sm text-ink-soft">{form.description}</p><button className="btn btn-outline mt-4" onClick={()=>openInbox(form.kind)}>{form.action}</button><Link href={form.href} className="mt-3 block text-sm text-brand underline">Open website form</Link></article>)}</section>}
      <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-8" aria-label="Submission totals" aria-busy={loading}>
        {[['Total requests',total],['New',sum(row=>row.status==='new')],['Reviewed',sum(row=>row.status==='reviewed')],['Completed',sum(row=>row.status==='completed')],['Appointments',sum(row=>row.kind==='appointments')],['Assessments',sum(row=>row.kind==='assessment')],['Events',sum(row=>row.kind==='event')],['Contacts',sum(row=>row.kind==='contact')]].map(([label,count])=><div key={label} className="rounded-xl border border-line bg-white p-4"><div className="display text-3xl tabular-nums text-brand">{loading?'…':count}</div><h2 className="mt-2 text-xs font-medium text-ink-soft">{label}</h2></div>)}
      </section>
      <p className="mt-2 text-xs text-ink-soft">Totals reflect the selected date, type, and status filters.</p>
      <section className="mt-7" aria-label="Submissions">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">{view==='dashboard'?'Recent submissions':activeForm?activeForm.title+' inbox':'All submissions'}</h2><p className="mt-1 text-sm text-ink-soft">{activeForm&&view==='submissions'?activeForm.description+' ':''}{loading?'Loading requests…':`${total} matching ${total===1?'request':'requests'}`}</p></div><div className="flex gap-2">{view==='dashboard'&&<button className="btn btn-outline" onClick={()=>{setView('submissions');setPage(1);}}>View all</button>}<button className="btn btn-outline" disabled={loading} onClick={()=>void refresh()}>Refresh</button></div></div>
        <div className={`mt-4 grid items-start gap-5 ${selected?'xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,1fr)]':''}`}>
          <div className="min-w-0 rounded-xl border border-line bg-white" aria-busy={loading}>
            {loading?<p className="p-8 text-center text-sm text-ink-soft">Loading submissions…</p>:!visible.length?<div className="p-10 text-center"><h3 className="text-lg font-semibold">No submissions in this view</h3><p className="mt-2 text-sm text-ink-soft">Try another date range, type, or status.</p></div>:<>
              <div className="divide-y divide-line md:hidden">{visible.map(item=><article key={item.id} className="p-4"><div className="flex items-start justify-between gap-2"><h3 className="min-w-0 break-words font-semibold">{item.name}</h3><Badge status={item.status}/></div><p className="mt-2 text-sm text-ink-soft">{submissionLabel(item)}</p><p className="mt-1 break-all text-sm text-ink-soft">{item.email}</p><div className="mt-3 flex items-center justify-between gap-2"><time className="text-xs text-ink-soft">{new Date(item.createdAt).toLocaleString()}</time><button className="btn btn-outline" onClick={()=>select(item)}>View</button></div></article>)}</div>
              <div className="hidden overflow-x-auto md:block"><table className="w-full text-left text-sm"><thead className="bg-paper-2 text-xs text-ink-soft"><tr>{['Name / email','Type','Received','Status',''].map((label,index)=><th key={index} scope="col" className="px-4 py-3 font-semibold">{label||<span className="sr-only">Actions</span>}</th>)}</tr></thead><tbody className="divide-y divide-line">{visible.map(item=><tr key={item.id} className={selected?.id===item.id?'bg-brand-soft/40':''}><td className="max-w-64 px-4 py-4"><div className="break-words font-medium">{item.name}</div><div className="mt-1 break-all text-xs text-ink-soft">{item.email}</div></td><td className="px-4 py-4 text-ink-soft">{submissionLabel(item)}</td><td className="px-4 py-4"><time className="whitespace-nowrap text-xs text-ink-soft">{new Date(item.createdAt).toLocaleDateString()}<br/>{new Date(item.createdAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</time></td><td className="px-4 py-4"><Badge status={item.status}/></td><td className="px-4 py-4"><button aria-label={`View submission from ${item.name}`} className="min-h-11 rounded-lg border border-line px-3 text-sm font-medium text-brand" onClick={()=>select(item)}>View</button></td></tr>)}</tbody></table></div>
            </>}
            {view==='submissions'&&<div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3"><button className="min-h-11 px-2 text-sm disabled:opacity-40" disabled={page===1||loading} onClick={()=>setPage(value=>value-1)}>Previous</button><span className="text-xs text-ink-soft">Page {page} of {Math.max(1,Math.ceil(total/50))}</span><button className="min-h-11 px-2 text-sm disabled:opacity-40" disabled={page*50>=total||loading} onClick={()=>setPage(value=>value+1)}>Next</button></div>}
          </div>
          {selected&&<div ref={details} className="min-w-0 scroll-mt-5"><AdminSubmissionDetail key={selected.id} item={selected} busy={statusBusy} onStatus={value=>void status(value)} onClose={()=>{setSelected(null);if(initialSelectedId)router.replace('/admin');}}/></div>}
        </div>
      </section>
    <section className="mt-6 rounded-xl border border-line bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-semibold">Device notifications</h2><p className="mt-1 text-sm text-ink-soft">{pushEnabled?'This device receives new request alerts.':'Enable alerts to know when a form is submitted.'}</p></div><div className="flex flex-wrap gap-2">{installPrompt&&<button className="btn btn-outline" onClick={async()=>{await installPrompt.prompt();await installPrompt.userChoice;setInstallPrompt(null);}}>Install app</button>}{pushSupported&&<><button disabled={pushBusy} className="btn btn-primary" onClick={()=>notifications(pushEnabled?'disable':'enable')}>{pushEnabled?'Disable alerts':'Enable alerts'}</button>{pushEnabled&&<button disabled={pushBusy} className="btn btn-outline" onClick={()=>notifications('test')}>Send test</button>}</>}</div></div><p className="mt-3 text-sm text-muted">On Android: open this dashboard in Chrome, tap Enable alerts, and allow notifications. Use Install app or the browser menu to add it to your home screen. To install on iPhone or iPad: Share, then Add to Home Screen. Enable alerts from the installed app.</p>{notice&&<p role="status" className="mt-3 text-sm text-brand">{notice}</p>}</section>
    </>}
  </main>;
}
