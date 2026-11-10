const CACHE = 'gorski-admin-offline-v1';
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.add('/admin/offline.html'))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
// Never cache authenticated pages, form responses, or patient data.
self.addEventListener('fetch', event => {
  if(event.request.mode === 'navigate') event.respondWith(fetch(event.request).catch(() => caches.match('/admin/offline.html')));
});
self.addEventListener('push', event => {
  let data={};try{const payload=event.data.json();if(payload&&typeof payload==='object')data=payload;}catch{}
  event.waitUntil(self.registration.showNotification(data.title||'Gorski Office',{body:data.body||'A new website request is waiting.',icon:'/images/icon-192.png',badge:'/images/icon-192.png',tag:data.tag||'gorski-submission',data:{url:typeof data.url==='string'&&/^\/admin(?:[/?]|$)/.test(data.url)?data.url:'/admin'}}));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = event.notification.data?.url;
  const path = typeof target === 'string' && /^\/admin(?:[/?]|$)/.test(target) ? target : '/admin';
  const url = new URL(path, self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const client = windows.find(c => {
      const location = new URL(c.url);
      return location.origin === self.location.origin && /^\/admin(?:[/?]|$)/.test(location.pathname);
    });
    if(client){
      const navigated = await client.navigate(url);
      return (navigated || client).focus();
    }
    return self.clients.openWindow(url);
  })());
});
