/* Hayyak reviews: original star-picker interface + shared Firebase Firestore storage. */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  if (!$('sd-review-form')) return;
  if (!window.HayyakFirebase || !window.HayyakFirebase.db) {
    const status = $('sd-review-status');
    if (status) {
      status.hidden = false;
      status.textContent = "Reviews could not connect. Check your connection and refresh the page.";
      status.classList.add('is-error');
    }
    console.error('Hayyak Reviews: Firebase Firestore SDK or initialization unavailable.');
    return;
  }
  window.HayyakReviewLoaded = true;
  const { auth, db } = window.HayyakFirebase;
  const params = new URLSearchParams(window.location.search);
  const siteID = (params.get('id') || params.get('siteID') || '').trim();
  if (!siteID) return;
  const collection = db.collection('reviews');
  const locale = {
    en: {
      eyebrow:'Share your experience', title:'Write a review', signin:'Log in to leave a review. Anyone can read existing reviews.',
      login:'Log in to write a review', rating:'Rate this site (1 to 5)', text:'Your review', placeholder:'Tell other visitors about your experience…',
      submit:'Post review', update:'Save changes', cancel:'Cancel', edit:'Edit', delete:'Delete',
      already:'You have already reviewed this site. You can edit or delete your review below.',
      invalid:'Select a rating from 1 to 5 and enter review text.', saved:'Your review was published.',
      updated:'Your review was updated.', deleted:'Your review was deleted.',
      confirm:'Delete your review? This cannot be undone.', working:'Saving…',
      failed:'Unable to save the review. Please check the connection and Firebase rules.',
      loading:'Loading reviews…', loadError:'Unable to load reviews. Check the connection or Firestore permissions and refresh.'
    },
    ar: {
      eyebrow:'شارك تجربتك', title:'أضف تقييمك', signin:'سجّل الدخول لإضافة تقييم. يمكنك قراءة تقييمات الزوار بدون تسجيل.',
      login:'سجّل الدخول لكتابة تقييم', rating:'تقييم الموقع (من ١ إلى ٥)', text:'اكتب تجربتك', placeholder:'شاركنا تجربتك مع هذا الموقع التراثي…',
      submit:'نشر التقييم', update:'حفظ التعديلات', cancel:'إلغاء', edit:'تعديل', delete:'حذف',
      already:'لقد قيّمت هذا الموقع من قبل. يمكنك تعديل تقييمك أو حذفه أدناه.',
      invalid:'اختر تقييمًا من ١ إلى ٥ واكتب نص التقييم.', saved:'تم نشر تقييمك بنجاح.',
      updated:'تم تحديث تقييمك.', deleted:'تم حذف تقييمك.',
      confirm:'هل تريد حذف تقييمك؟ لا يمكن التراجع عن الحذف.', working:'جارٍ الحفظ…',
      failed:'تعذّر حفظ التقييم. تحقق من الاتصال وقواعد Firebase.',
      loading:'جارٍ تحميل التقييمات…', loadError:'تعذّر تحميل التقييمات. تحقق من الاتصال أو صلاحيات Firebase ثم حدّث الصفحة.'
    }
  };
  const L = key => locale[Hayyak.getLang() === 'en' ? 'en' : 'ar'][key];
  const escapeHTML = Hayyak.esc;
  const form = $('sd-review-form');
  let user = null, reviews = [], editing = false, ready = false, busy = false, loadError = '';
  const status = $('sd-review-status');
  const own = () => reviews.find(r => user && r.userID === user.uid);
  const docID = () => siteID + '_' + user.uid;
  const starString = n => '★★★★★'.slice(0, Math.round(n)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(n));
  function feedback(text, error) {
    const el = $('sd-review-feedback');
    el.textContent = text || '';
    el.hidden = !text;
    el.classList.toggle('is-error', !!error);
  }
  function reset() {
    editing = false;
    form.reset();
    $('sd-review-edit-id').value = '';
    feedback('');
  }
  function render() {
    document.querySelector('.sd-review-compose').querySelector('[data-i18n="sd_write_eyebrow"]').textContent=L('eyebrow');
    document.querySelector('.sd-review-compose').querySelector('[data-i18n="sd_write_title"]').textContent=L('title');
    document.querySelector('.sd-review-compose').querySelector('[data-i18n="sd_choose_rating"]').textContent=L('rating');
    document.querySelector('.sd-review-compose').querySelector('[data-i18n="sd_review_text"]').textContent=L('text');
    $('sd-review-text').placeholder=L('placeholder');
    $('sd-review-submit').textContent=editing?L('update'):L('submit');
    $('sd-review-cancel').textContent=L('cancel');
    $('sd-review-login').textContent=L('login');
    $('sd-review-cancel').hidden=!editing;
    const mine=own();
    $('sd-review-hint').textContent=!user?L('signin'):(mine&&!editing?L('already'):'');
    $('sd-review-login').hidden=!!user;
    form.hidden=!user || (!!mine&&!editing);
    const list=$('sd-review-list');
    if (status) {
      status.hidden = ready && !loadError;
      status.textContent = loadError || L('loading');
      status.classList.toggle('is-error', !!loadError);
    }
    $('sd-no-reviews').hidden=!ready || !!loadError || reviews.length>0;
    const valid=reviews.map(r=>Number(r.rating)).filter(n=>Number.isInteger(n)&&n>=1&&n<=5);
    $('sd-score').hidden=!valid.length;
    if(valid.length){
      const avg=valid.reduce((a,b)=>a+b,0)/valid.length;
      $('sd-avg').textContent=avg.toFixed(1);
      $('sd-avg-stars').textContent=starString(avg);
      $('sd-review-count').textContent=reviews.length+' '+Hayyak.t('sd_review_word');
    }
    // Always render a real review card for each Firestore review. Keep this
    // independent from the scroll/reveal animation used elsewhere in Hayyak.
    let reviewCards = '';
    try {
      reviewCards=reviews.map((r,i)=>{
      const who=String(r.reviewer||'Visitor');
      const dt=r.createdAt&&typeof r.createdAt.toDate==='function' ? r.createdAt.toDate() : null;
      const date=dt?dt.toLocaleDateString(Hayyak.getLang()==='ar'?'ar-SA':'en-GB',{year:'numeric',month:'long',day:'numeric'}):'';
      const isOwner=!!user&&r.userID===user.uid;
      const buttons=isOwner?'<div class="sd-review-actions"><button type="button" data-review-action="edit">'+L('edit')+'</button><button type="button" class="is-delete" data-review-action="delete">'+L('delete')+'</button></div>':'';
      return '<li class="sd-review"><span class="sd-avatar" aria-hidden="true">'+escapeHTML(who.trim().charAt(0))+'</span>'+ 
        '<div class="sd-review-body"><div class="sd-review-head"><strong dir="auto">'+escapeHTML(who)+'</strong><span class="sd-stars" aria-label="'+Number(r.rating)+'/5">'+starString(Number(r.rating))+'</span></div>'+ 
        '<p dir="auto">'+escapeHTML(r.text||'')+'</p>'+(date?'<time class="sd-review-date">'+escapeHTML(date)+'</time>':'')+buttons+'</div></li>';
      }).join('');
    } catch (err) {
      console.error('Hayyak: failed to render review comments',err);
      if (status) {
        status.hidden = false;
        status.classList.add('is-error');
        status.textContent = Hayyak.getLang()==='ar'
          ? 'تعذّر عرض التعليقات. تحقق من وحدة التحكم (Console) ثم أعد تحميل الصفحة.'
          : 'Unable to display review comments. Check the browser console and reload.';
      }
      return;
    }
    list.innerHTML = reviewCards;
    list.hidden = false;
    list.removeAttribute('data-reveal');
    list.classList.add('sd-reviews-loaded');
    // Individual cards arrive after the scroll observer ran. They must not
    // inherit hidden animation attributes or styles from older deployments.
    list.querySelectorAll('.sd-review').forEach(card => {
      card.removeAttribute('data-reveal');
      card.classList.add('is-in');
      card.style.opacity = '1';
      card.style.visibility = 'visible';
      card.style.transform = 'none';
    });
    list.dataset.reviewCount = String(reviews.length);
    if (reviews.length && !list.querySelector('.sd-review')) {
      console.error('Hayyak: Firestore reviews exist but none reached the review list');
      if (status) {
        status.hidden = false;
        status.classList.add('is-error');
        status.textContent = Hayyak.getLang()==='ar'
          ? 'تم تحميل التقييمات ولكن تعذّر عرض التعليقات.'
          : 'Ratings loaded but review comments could not be displayed.';
      }
    }
  }
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!user||busy)return;
    const chosen=form.querySelector('input[name="rating"]:checked');
    const rating=chosen?Number(chosen.value):NaN;
    const text=$('sd-review-text').value.trim();
    if(!Number.isInteger(rating)||rating<1||rating>5||!text){feedback(L('invalid'),true);return;}
    busy=true;$('sd-review-submit').disabled=true;feedback(L('working'));
    try{
      if(editing){
        if(!own())throw new Error(L('failed'));
        await collection.doc(docID()).update({rating,text,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
      }else{
        if(own())throw new Error(L('already'));
        await collection.doc(docID()).set({siteID,userID:user.uid,reviewer:user.displayName||user.email.split('@')[0],rating,text,createdAt:firebase.firestore.FieldValue.serverTimestamp(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
      }
      const msg=editing?L('updated'):L('saved');
      reset();render();feedback(msg);
    }catch(err){console.error('Review save failed',err);feedback(err.message||L('failed'),true);}
    finally{busy=false;$('sd-review-submit').disabled=false;}
  });
  $('sd-review-cancel').addEventListener('click',()=>{reset();render();});
  $('sd-review-list').addEventListener('click',async e=>{
    const button=e.target.closest('button[data-review-action]');
    if(!button||!user||!own()||busy)return;
    if(button.dataset.reviewAction==='edit'){
      const item=own();editing=true;
      $('sd-review-edit-id').value=docID();
      $('sd-review-text').value=item.text||'';
      const radio=form.querySelector('input[name="rating"][value="'+item.rating+'"]');
      if(radio)radio.checked=true;
      render();feedback('');form.scrollIntoView({behavior:'smooth',block:'center'});
    }else if(button.dataset.reviewAction==='delete'){
      if(!window.confirm(L('confirm')))return;
      busy=true;
      try{await collection.doc(docID()).delete();reset();render();feedback(L('deleted'));}
      catch(err){console.error('Review deletion failed',err);feedback(err.message||L('failed'),true);}
      finally{busy=false;}
    }
  });
  auth.onAuthStateChanged(next=>{user=next;if(!user)reset();render();});
  render();
  collection.where('siteID','==',siteID).onSnapshot(s=>{
    reviews=s.docs.map(d=>({id:d.id,...d.data()}));
    reviews.sort((a,b)=>(b.createdAt?.toMillis?.()||0)-(a.createdAt?.toMillis?.()||0)||b.id.localeCompare(a.id));
    ready=true;loadError='';
    try { render(); } catch(err) {
      console.error('Hayyak review display failed:',err);
      if (status) { status.hidden=false; status.classList.add('is-error');
        status.textContent='Reviews loaded but comments could not be displayed. Check Console.'; }
    }
  },error=>{console.error('Review loading failed',error);ready=true;loadError=L('loadError')+' ('+error.code+')';render();});
  document.addEventListener('hayyak:lang',()=>{ if(loadError) loadError=L('loadError'); render(); });
})();
