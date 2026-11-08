/* Shared Reviews feature — Firebase Auth + Cloud Firestore; no PHP or localhost needed. */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const { auth, db } = window.HayyakFirebase;
  const sid = new URLSearchParams(location.search).get('id') || new URLSearchParams(location.search).get('siteID');
  if (!sid || !$('rv-editor')) return;
  let reviews = [], editing = false, ready = false, currentAuth = null;
  const copy = {
    en: { title:'Add your review', edit:'Edit your review', login:'Log in to add a review.', rating:'Rating (1–5 stars)', text:'Your review',save:'Submit review',update:'Save changes',cancel:'Cancel',editBtn:'Edit',delBtn:'Delete',confirm:'Delete your review?',already:'You have already reviewed this site. You may edit or delete your review.',empty:'Select a star rating and enter your review.',load:'Loading reviews…',error:'Could not load reviews. Check your Firebase settings and connection.',saved:'Review saved.',deleted:'Review deleted.',cancelled:'Deletion cancelled.',working:'Saving…',loginLink:'Log in'},
    ar: { title:'أضف تقييمك', edit:'تعديل تقييمك', login:'سجّل الدخول لإضافة تقييم.', rating:'التقييم (من ١ إلى ٥ نجوم)', text:'نص التقييم',save:'إرسال التقييم',update:'حفظ التعديلات',cancel:'إلغاء',editBtn:'تعديل',delBtn:'حذف',confirm:'هل تريد حذف تقييمك؟',already:'لقد قيّمت هذا الموقع بالفعل. يمكنك تعديل تقييمك أو حذفه.',empty:'اختر عدد النجوم واكتب تقييمك.',load:'جارٍ تحميل التقييمات…',error:'تعذّر تحميل التقييمات. تحقق من إعدادات Firebase والاتصال.',saved:'تم حفظ التقييم.',deleted:'تم حذف التقييم.',cancelled:'تم إلغاء الحذف.',working:'جارٍ الحفظ…',loginLink:'تسجيل الدخول'}
  };
  const t = (key) => copy[Hayyak.getLang() === 'ar' ? 'ar' : 'en'][key];
  const esc = Hayyak.esc;
  const reviewsRef = db.collection('reviews');
  const docId = () => sid + '_' + currentAuth.uid;
  const own = () => reviews.find(r => currentAuth && r.userID === currentAuth.uid);
  const stars = (v) => '★★★★★'.slice(0, Math.round(v)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(v));
  const setStatus = (message, error) => { $('rv-status').textContent = message; $('rv-status').classList.toggle('rv-error', !!error); };
  function render() {
    if (!ready) return;
    const list = $('sd-review-list');
    const valid = reviews.map(r => Number(r.rating)).filter(r => Number.isInteger(r) && r >= 1 && r <= 5);
    const count = reviews.length;
    $('sd-no-reviews').hidden = count !== 0;
    $('sd-score').hidden = valid.length === 0;
    if (valid.length) {
      const avg = valid.reduce((x,y) => x+y,0) / valid.length;
      $('sd-avg').textContent = avg.toFixed(1);
      $('sd-avg-stars').textContent = stars(avg);
      $('sd-review-count').textContent = count + ' ' + Hayyak.t('sd_review_word');
    }
    list.innerHTML = reviews.map((r,i) => {
      const date = r.createdAt && r.createdAt.toDate ? r.createdAt.toDate().toLocaleDateString(Hayyak.getLang() === 'ar' ? 'ar-SA' : 'en-GB') : '';
      const owner = currentAuth && r.userID === currentAuth.uid;
      return '<li class="sd-review" style="--d:' + (i%3) + '"><span class="sd-avatar" aria-hidden="true">' + esc((r.reviewer || '?').charAt(0)) + '</span>' +
        '<div class="sd-review-body"><div class="sd-review-head"><strong dir="auto">' + esc(r.reviewer || '') + '</strong><span class="sd-stars" aria-label="' + Number(r.rating) + '/5">' + stars(Number(r.rating)) + '</span></div>' +
        '<p dir="auto">' + esc(r.text || '') + '</p><time class="sd-review-date">' + esc(date) + '</time>' +
        (owner ? '<div class="rv-card-buttons"><button type="button" data-review-edit="1">' + t('editBtn') + '</button><button type="button" data-review-delete="1">' + t('delBtn') + '</button></div>' : '') + '</div></li>';
    }).join('');
    $('rv-form-title').textContent = editing ? t('edit') : t('title');
    $('rv-rating-label').textContent = t('rating');
    $('rv-text-label').textContent = t('text');
    $('rv-save').textContent = editing ? t('update') : t('save');
    $('rv-cancel').textContent = t('cancel');
    const signedIn = !!currentAuth;
    const found = own();
    $('rv-form').hidden = !signedIn || (!!found && !editing);
    $('rv-login-message').hidden = signedIn && (!found || editing);
    if (!signedIn) $('rv-login-message').innerHTML = '<a href="login.html">' + t('login') + '</a>';
    else if (found && !editing) $('rv-login-message').textContent = t('already');
    else $('rv-login-message').textContent = '';
    $('rv-cancel').hidden = !editing;
  }
  $('rv-form').addEventListener('submit', async e => {
    e.preventDefault();
    if (!currentAuth) return;
    const rating = Number($('rv-rating').value);
    const text = $('rv-text').value.trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !text) { setStatus(t('empty'),true); return; }
    const button = $('rv-save');
    button.disabled = true;
    setStatus(t('working'));
    try {
      if (editing) {
        await reviewsRef.doc(docId()).update({rating,text,updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
      } else {
        if (own()) throw new Error(t('already'));
        await reviewsRef.doc(docId()).set({siteID:String(sid),userID:currentAuth.uid,reviewer:currentAuth.displayName || currentAuth.email.split('@')[0],rating,text,createdAt:firebase.firestore.FieldValue.serverTimestamp(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()});
      }
      editing = false;
      $('rv-form').reset();
      setStatus(t('saved'));
    } catch (err) { setStatus(err.message || t('error'),true); }
    finally { button.disabled = false; render(); }
  });
  $('rv-cancel').addEventListener('click', () => { editing = false; $('rv-form').reset(); setStatus(''); render(); });
  $('sd-review-list').addEventListener('click', async e => {
    if (!currentAuth || !own()) return;
    if (e.target.closest('[data-review-edit]')) {
      editing = true;
      $('rv-rating').value = String(own().rating);
      $('rv-text').value = own().text;
      setStatus(''); render();
      $('rv-editor').scrollIntoView({behavior:'smooth',block:'center'});
    } else if (e.target.closest('[data-review-delete]')) {
      if (!window.confirm(t('confirm'))) { setStatus(t('cancelled')); return; }
      try { await reviewsRef.doc(docId()).delete(); editing = false; $('rv-form').reset(); setStatus(t('deleted')); }
      catch (err) { setStatus(err.message || t('error'),true); }
    }
  });
  setStatus(t('load'));
  auth.onAuthStateChanged(user => { currentAuth = user; if (ready) render(); });
  reviewsRef.where('siteID','==',String(sid)).onSnapshot(snapshot => {
    reviews = snapshot.docs.map(doc => ({id:doc.id, ...doc.data()}));
    reviews.sort((a,b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0) || b.id.localeCompare(a.id));
    ready = true;
    setStatus(''); render();
  }, error => { ready = true; setStatus(t('error') + ' ' + error.message,true); render(); });
  document.addEventListener('hayyak:lang',render);
  window.HayyakReviews = {render};
})();
