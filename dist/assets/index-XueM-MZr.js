(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function o(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(s){if(s.ep)return;s.ep=!0;const a=o(s);fetch(s.href,a)}})();const n={documents:[],searchQuery:"",selectedDoc:null,currentPage:1,inDocSearchQuery:"",readingProgress:{}},w=document.getElementById("dashboard-view"),u=document.getElementById("reading-view"),m=document.getElementById("document-grid"),C=document.getElementById("search-input"),I=document.getElementById("back-button"),y=document.getElementById("read-doc-title"),b=document.getElementById("read-doc-author"),f=document.getElementById("doc-search-input"),c=document.getElementById("doc-search-clear"),g=document.getElementById("pages-list"),l=document.getElementById("text-container"),k=document.getElementById("prev-page"),E=document.getElementById("next-page"),D=document.getElementById("page-indicator"),d=document.getElementById("menu-collections");async function B(){A(),await M(),O(),h()}function A(){try{const t=localStorage.getItem("quietude_progress");t&&(n.readingProgress=JSON.parse(t))}catch(t){console.error("Failed to load reading progress from localStorage",t)}}function T(t,e,o){n.readingProgress[t]={page:e,percent:o};try{localStorage.setItem("quietude_progress",JSON.stringify(n.readingProgress))}catch(r){console.error("Failed to save reading progress",r)}}async function M(){try{const t=await fetch("/data/index.json");if(!t.ok)throw new Error("Failed to load documents list index");n.documents=await t.json()}catch(t){console.error("Fetch index error:",t),m.innerHTML=`
      <div class="col-span-full py-16 text-center text-red-500 font-medium">
        Gagal memuat koleksi perpustakaan. Pastikan server dev berjalan.
      </div>
    `}}function O(){C.addEventListener("input",t=>{n.searchQuery=t.target.value.trim().toLowerCase(),h()}),I.addEventListener("click",()=>{L()}),E.addEventListener("click",()=>{n.selectedDoc&&n.currentPage<n.selectedDoc.page_count&&p(n.currentPage+1)}),k.addEventListener("click",()=>{n.currentPage>1&&p(n.currentPage-1)}),f.addEventListener("input",t=>{n.inDocSearchQuery=t.target.value,n.inDocSearchQuery.length>0?c.classList.remove("hidden"):c.classList.add("hidden"),v()}),c.addEventListener("click",()=>{f.value="",n.inDocSearchQuery="",c.classList.add("hidden"),v()}),document.querySelectorAll(".sidebar-doc-link").forEach(t=>{t.addEventListener("click",e=>{e.preventDefault();const o=t.getAttribute("data-doc-id");o&&P(o)})}),d.addEventListener("click",t=>{t.preventDefault(),L()})}function h(){const t=n.documents.filter(e=>{const o=e.title.toLowerCase().includes(n.searchQuery),r=e.author.toLowerCase().includes(n.searchQuery),s=e.summary.toLowerCase().includes(n.searchQuery);return o||r||s});if(t.length===0){m.innerHTML=`
      <div class="col-span-full py-16 text-center text-stone-400 font-medium">
        Tidak ada dokumen yang cocok dengan "${n.searchQuery}".
      </div>
    `;return}m.innerHTML=t.map(e=>{const o=n.readingProgress[e.id]||{percent:0};let r="POLICY",s="Added Today",a=!0,i="",x="";return e.id==="analisis_makroekonomi_indonesia_2026"?(r="ECONOMICS",s="Added Oct 12",i="background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url('/images/macro_cover.png'); background-size: cover; background-position: center;"):e.id==="cost_effectiveness_analysis_mbg"?(r="POLICY",s="Added Nov 03",i="background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.8)), url('/images/mbg_cover.png'); background-size: cover; background-position: center;"):(r="FISCAL",s="Added Today",a=!1,x=`<p class="text-[13px] text-stone-600 font-sans leading-relaxed line-clamp-4 mt-2">
        Sebuah kajian mendalam mengenai pergeseran mekanisme subsidi komoditas energi dan sosial di Indonesia dari skema menyeluruh (universal) menuju bantuan langsung sasaran (targeted).
      </p>`),a?`
        <div class="flex flex-col space-y-4 group cursor-pointer" data-id="${e.id}">
          <!-- Card Cover Body -->
          <div style="${i}" class="aspect-[2/3] w-full bg-stone-900 rounded-md p-6 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-md">
            <!-- Category Pill -->
            <div>
              <span class="inline-block px-3 py-1 bg-white/10 backdrop-blur-md text-[10px] tracking-widest text-white uppercase rounded font-medium">${r}</span>
            </div>
            <!-- Title & Author Overlay Box (White base) -->
            <div class="bg-white p-5 rounded shadow-sm">
              <h4 class="font-serif text-lg text-stone-900 leading-snug font-bold line-clamp-2">${e.title}</h4>
              <p class="text-xs text-stone-500 font-medium tracking-wide uppercase mt-2">${e.author}</p>
            </div>
          </div>
          <!-- Card Progress Footer (Below the card) -->
          <div class="space-y-2 px-1">
            <div class="flex items-center justify-between text-[11px] text-stone-500 font-medium">
              <span>${s}</span>
              <span>${o.percent}%</span>
            </div>
            <div class="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
              <div style="width: ${o.percent}%" class="h-full bg-brandGreen rounded-full"></div>
            </div>
          </div>
        </div>
      `:`
        <div class="flex flex-col space-y-4 group cursor-pointer" data-id="${e.id}">
          <!-- Card Cover Body -->
          <div class="aspect-[2/3] w-full bg-[#fbf8f3] border border-stone-200 rounded-md p-8 flex flex-col justify-between shadow-sm transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-md">
            <div class="space-y-4">
              <!-- Category Pill -->
              <div>
                <span class="inline-block px-3 py-1 bg-stone-100 text-[10px] tracking-widest text-stone-600 uppercase rounded font-medium border border-stone-200">${r}</span>
              </div>
              <!-- Title & Author & Description -->
              <div class="space-y-2">
                <h4 class="font-serif text-2xl text-stone-900 font-bold leading-tight line-clamp-3">${e.title}</h4>
                <p class="text-xs text-stone-400 italic">Oleh ${e.author}</p>
                ${x}
              </div>
            </div>
            <div class="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
              Research Essay
            </div>
          </div>
          <!-- Card Progress Footer -->
          <div class="space-y-2 px-1">
            <div class="flex items-center justify-between text-[11px] text-stone-500 font-medium">
              <span>${s}</span>
              <span>${o.percent}%</span>
            </div>
            <div class="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
              <div style="width: ${o.percent}%" class="h-full bg-brandGreen rounded-full"></div>
            </div>
          </div>
        </div>
      `}).join(""),document.querySelectorAll("#document-grid > div").forEach(e=>{e.addEventListener("click",()=>{const o=e.getAttribute("data-id");o&&P(o)})})}async function P(t){try{w.classList.add("hidden"),u.classList.remove("hidden"),u.classList.add("flex"),y.textContent="Loading...",b.textContent="",l.innerHTML='<div class="py-16 text-center text-stone-400 font-medium">Memuat isi dokumen...</div>',g.innerHTML="";const e=await fetch(`/data/${t}.json`);if(!e.ok)throw new Error("Gagal mengambil teks dokumen lengkap");const o=await e.json();n.selectedDoc=o,y.textContent=o.title,b.textContent=`Oleh ${o.author}`,S(t);const r=n.readingProgress[t]||{page:1,percent:0};n.currentPage=r.page,n.inDocSearchQuery="",f.value="",c.classList.add("hidden"),$(),p(n.currentPage)}catch(e){console.error("Open reading mode error:",e),l.innerHTML=`
      <div class="py-16 text-center text-red-500 font-medium">
        Gagal memuat teks lengkap. Pastikan server dev berjalan dengan lancar.
      </div>
    `}}function L(){n.selectedDoc=null,u.classList.add("hidden"),u.classList.remove("flex"),w.classList.remove("hidden"),S("collections"),h()}function S(t){if(t==="collections"){d.classList.add("text-stone-900","bg-[#f5efe6]","font-medium"),d.classList.remove("text-stone-500","hover:text-stone-900","hover:bg-stone-100/50");const e=d.querySelector("svg");e&&e.classList.add("text-stone-700")}else{d.classList.remove("text-stone-900","bg-[#f5efe6]","font-medium"),d.classList.add("text-stone-500","hover:text-stone-900","hover:bg-stone-100/50");const e=d.querySelector("svg");e&&e.classList.remove("text-stone-700")}document.querySelectorAll(".sidebar-doc-link").forEach(e=>{const o=e.getAttribute("data-doc-id"),r=e.querySelector("svg");o===t?(e.classList.add("text-stone-900","bg-[#f5efe6]","font-medium"),e.classList.remove("text-stone-500","hover:text-stone-900","hover:bg-stone-100/50"),r&&(r.classList.remove("text-stone-400"),r.classList.add("text-stone-700"))):(e.classList.remove("text-stone-900","bg-[#f5efe6]","font-medium"),e.classList.add("text-stone-500","hover:text-stone-900","hover:bg-stone-100/50"),r&&(r.classList.remove("text-stone-700"),r.classList.add("text-stone-400")))})}function $(){n.selectedDoc&&(g.innerHTML=Array.from({length:n.selectedDoc.page_count},(t,e)=>{const o=e+1,r=o===n.currentPage;return`
      <li>
        <button 
          data-page="${o}" 
          class="w-full text-left py-1 px-2.5 rounded transition text-[13px] font-medium ${r?"bg-[#e6dfd3] text-stone-900 font-bold":"text-stone-500 hover:bg-stone-100 hover:text-stone-800"}"
        >
          Page ${o}
        </button>
      </li>
    `}).join(""),g.querySelectorAll("button").forEach(t=>{t.addEventListener("click",()=>{const e=parseInt(t.getAttribute("data-page"));p(e)})}))}function p(t){if(!n.selectedDoc)return;n.currentPage=t;const e=n.selectedDoc.page_count,o=Math.round(t/e*100);T(n.selectedDoc.id,t,o),$();const r=g.querySelector(`button[data-page="${t}"]`);r&&r.scrollIntoView({block:"nearest",behavior:"smooth"}),D.textContent=`Page ${t} of ${e}`,k.disabled=t===1,E.disabled=t===e,v(),l.scrollTop=0}function v(){if(!n.selectedDoc)return;const t=n.selectedDoc.pages.find(s=>s.page_number===n.currentPage);if(!t){l.innerHTML='<p class="text-stone-400 italic">Halaman tidak ditemukan.</p>';return}let e=t.text;e=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");let r=e.split(/\n\s*\n/).map(s=>s.trim()).filter(s=>s.length>0).map(s=>`<p class="font-serif text-[17px] text-stone-800 leading-relaxed mb-6 select-text text-justify">${s.replace(/\n/g," ")}</p>`).join("");if(n.inDocSearchQuery.trim().length>0){const s=j(n.inDocSearchQuery.trim()),a=new RegExp(`(${s})`,"gi");r=r.replace(a,'<mark class="bg-amber-100 text-stone-900 px-0.5 rounded border-b border-amber-400">$1</mark>')}l.innerHTML=r}function j(t){return t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}document.addEventListener("DOMContentLoaded",B);
