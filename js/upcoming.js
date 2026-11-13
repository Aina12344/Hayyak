/* My Upcoming Visits: user-scoped saved site IDs, shared by details and upcoming pages. */
(function () {
  "use strict";
  const dictionary = {
    ar: {uv_kicker:"خطط لرحلتك",uv_title:"زياراتي القادمة",uv_intro:"احتفظ بالمواقع التراثية التي ترغب بزيارتها في مكان واحد.",uv_saved:"المواقع المحفوظة",uv_empty_title:"لم تحفظ أي موقع بعد",uv_empty_text:"تصفح المواقع التراثية وأضف المواقع التي تود زيارتها.",uv_explore:"استكشف المواقع",uv_add:"أضف إلى زياراتي القادمة",uv_remove:"إزالة من زياراتي القادمة",uv_details:"عرض التفاصيل",uv_login:"سجّل الدخول أولًا لحفظ المواقع في زياراتك القادمة.",uv_login_btn:"تسجيل الدخول",uv_count:"موقع محفوظ",uv_count_many:"مواقع محفوظة",uv_removed:"تمت إزالة الموقع من زياراتك القادمة.",uv_added:"تمت إضافة الموقع إلى زياراتك القادمة."},
    en: {uv_kicker:"Plan your journey",uv_title:"My Upcoming Visits",uv_intro:"Keep the heritage sites you want to visit together in one place.",uv_saved:"Saved sites",uv_empty_title:"No saved sites yet",uv_empty_text:"Explore heritage sites and save the places you want to visit.",uv_explore:"Explore sites",uv_add:"Add to My Upcoming Visits",uv_remove:"Remove from My Upcoming Visits",uv_details:"View details",uv_login:"Log in to save sites to your upcoming visits.",uv_login_btn:"Log in",uv_count:"site saved",uv_count_many:"sites saved",uv_removed:"Site removed from your upcoming visits.",uv_added:"Site added to your upcoming visits."}
  };
  Hayyak.addText(dictionary);
  const key = function () {
    const u = Hayyak.getUser();
    if (!u || u.role !== 'tourist' || !(u.uid || u.email)) return null;
    return 'hayyak.upcoming.' + (u.uid || u.email.toLowerCase());
  };
  function get() {
    const k=key(); if (!k) return [];
    try { const v=JSON.parse(localStorage.getItem(k)||'[]'); return Array.isArray(v)?v.map(String):[]; } catch(e) { return []; }
  }
  function has(id) { return get().includes(String(id)); }
  function toggle(id) {
    const k=key(); if (!k) return null;
    const ids=get(), sid=String(id), index=ids.indexOf(sid);
    if(index<0) ids.push(sid); else ids.splice(index,1);
    try { localStorage.setItem(k,JSON.stringify(ids)); } catch(e) { return null; }
    document.dispatchEvent(new CustomEvent('hayyak:upcoming'));
    return index<0;
  }
  window.HayyakUpcoming={get,has,toggle};
  const $=id=>document.getElementById(id);
  function render() {
    const content=$('uv-content'); if(!content) return;
    const notice=$('uv-notice'), logged=!!key();
    content.hidden=!logged; notice.hidden=logged;
    if(!logged) { notice.innerHTML='<p>'+Hayyak.esc(Hayyak.t('uv_login'))+'</p><a class="btn btn-primary" href="login.html">'+Hayyak.esc(Hayyak.t('uv_login_btn'))+'</a>'; return; }
    const ids=get();
    const sites=ids.map(id=>(typeof heritageSites!=='undefined'?heritageSites:[]).find(s=>String(s.siteID)===id)).filter(Boolean);
    $('uv-empty').hidden=sites.length>0;
    $('uv-count').textContent=sites.length+' '+Hayyak.t(sites.length===1?'uv_count':'uv_count_many');
    const lang=Hayyak.getLang()==='ar'?'Ar':'En';
    $('uv-grid').innerHTML=sites.map(s=>'<article class="uv-card"><a href="site-details.html?id='+encodeURIComponent(s.siteID)+'" class="uv-card-image"><img loading="lazy" src="'+Hayyak.esc((s.photos||[])[0]||'images/hero.jpg')+'" alt="'+Hayyak.esc(s['name'+lang])+'"></a><div class="uv-card-body"><p class="uv-card-city">'+Hayyak.esc(s['city'+lang]||'')+' · '+Hayyak.esc(s['classification'+lang]||'')+'</p><h3>'+Hayyak.esc(s['name'+lang])+'</h3><div class="uv-card-actions"><a class="btn btn-primary" href="site-details.html?id='+encodeURIComponent(s.siteID)+'">'+Hayyak.esc(Hayyak.t('uv_details'))+'</a><button type="button" class="uv-remove" data-remove="'+Hayyak.esc(s.siteID)+'">'+Hayyak.esc(Hayyak.t('uv_remove'))+'</button></div></div></article>').join('');
  }
  if($('uv-content')) {
    $('uv-grid').addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(b){toggle(b.dataset.remove);render();}});
    document.addEventListener('hayyak:lang',render);
    document.addEventListener('hayyak:auth',render);
    render();
  }
  function detailButton() {
    const anchor=$('uv-detail-action'); if(!anchor) return;
    const id=new URLSearchParams(location.search).get('id')||new URLSearchParams(location.search).get('siteID');
    if(!id) {anchor.hidden=true;return;}
    anchor.hidden=false;
    const logged=!!key(), saved=has(id);
    anchor.textContent=Hayyak.t(saved?'uv_remove':'uv_add');
    anchor.setAttribute('aria-pressed',String(saved));
    anchor.classList.toggle('is-saved',saved);
    anchor.onclick=function(){if(!logged){location.href='login.html';return;}toggle(id);detailButton();};
  }
  if($('uv-detail-action')) {
    detailButton(); document.addEventListener('hayyak:lang',detailButton);
    document.addEventListener('hayyak:auth',detailButton);
  }
})();
