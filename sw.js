// Red Sands: Desert Hero - offline ishlash uchun service worker
const C=`red-sands-v2`,CDN=`https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`;
const SHELL=[`./`,`index.html`,`manifest.json`];
self.addEventListener(`install`,e=>{e.waitUntil(caches.open(C).then(async c=>{
 await Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})));
 await c.add(new Request(CDN,{mode:`cors`})).catch(()=>{});
}).then(()=>self.skipWaiting()))});
self.addEventListener(`activate`,e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener(`fetch`,e=>{
 const r=e.request;if(r.method!==`GET`)return;
 const u=new URL(r.url);if(u.origin!==location.origin&&r.url!==CDN)return;
 e.respondWith(caches.match(r,{ignoreSearch:true,ignoreVary:true}).then(hit=>{
  const net=fetch(r).then(res=>{if(res&&res.status===200){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>hit);
  return hit||net;
 }));
});
