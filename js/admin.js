/*
 * admin.js - Admin pages of Hayyak:
 *   admin.html          Admin Dashboard (list of sites with Edit / Delete)
 *   admin-add.html      Add Site
 *   admin-edit.html?id= Edit Site
 *   admin-delete.html?id= Delete Site (confirmation page)
 *
 * Hayyak keeps its data in the browser:
 *   - the list of sites (localStorage, key "hayyak.sites", read by js/sites.js), so every
 *     page (Home, Heritage Sites, Site Details) shows the added, edited or deleted sites;
 *   - the photos the admin chooses (Cache Storage, served by sw.js) under paths such as
 *     "images/uploads/site-17-1.jpg", so they appear in their original size and quality,
 *     exactly like the photos in the images folder.
 *
 * Load order on every admin page: js/sites.js, js/layout.js, js/admin.js
 */
(function () {
  "use strict";

  /* ---------- Only the admin can open these pages ---------- */
  const user = Hayyak.getUser();
  if (!user || user.role !== "admin") {
    window.location.replace("login.html");
    return;
  }

  /* ---------- Page texts ---------- */
  Hayyak.addText({
    ar: {
      ad_kicker: "لوحة تحكم المشرف",
      ad_title: "إدارة المواقع التراثية",
      ad_sub: "أضف مواقع جديدة، وعدّل بيانات المواقع الحالية أو احذفها.",
      ad_add_title: "إضافة موقع تراثي", ad_add_sub: "عبّئ بيانات الموقع بالعربي والإنجليزي ثم اضغط حفظ.",
      ad_edit_title: "تعديل موقع تراثي", ad_edit_sub: "عدّل البيانات التي تريدها ثم اضغط حفظ التعديلات.",
      ad_del_title: "حذف موقع تراثي", ad_del_sub: "تأكد من الموقع قبل حذفه، فلا يمكن التراجع عن الحذف.",
      st_sites: "موقع تراثي", st_cities: "مدن", st_types: "تصنيفات",
      ad_search: "ابحث في المواقع", ad_search_ph: "ابحث باسم الموقع أو المدينة…",
      ad_add_btn: "إضافة موقع", ad_view_sites: "عرض المواقع التراثية",
      col_photo: "الصورة", col_name: "اسم الموقع", col_city: "المدينة", col_type: "التصنيف", col_actions: "الإجراءات",
      act_view: "عرض", act_edit: "تعديل", act_delete: "حذف",
      ad_empty: "لا توجد مواقع مطابقة.", ad_none: "لا توجد مواقع بعد. ابدأ بإضافة موقع.",
      ad_reset: "استرجاع البيانات الأصلية",
      ad_reset_q: "سيتم حذف كل الإضافات والتعديلات واسترجاع المواقع الأصلية. هل أنت متأكد؟",
      msg_added: "تمت إضافة الموقع بنجاح.", msg_updated: "تم حفظ التعديلات بنجاح.", msg_deleted: "تم حذف الموقع بنجاح.",
      msg_reset: "تم استرجاع البيانات الأصلية.",
      sec_names: "اسم الموقع", sec_place: "المدينة والتصنيف", sec_desc: "الوصف", sec_visit: "معلومات الزيارة", sec_photos: "الصور",
      f_nameAr: "الاسم بالعربي", f_nameEn: "الاسم بالإنجليزي",
      f_city: "المدينة", f_type: "التصنيف", f_choose: "اختر…",
      f_descAr: "الوصف بالعربي", f_descEn: "الوصف بالإنجليزي",
      f_addrAr: "العنوان بالعربي", f_addrEn: "العنوان بالإنجليزي",
      f_hoursAr: "ساعات العمل بالعربي", f_hoursEn: "ساعات العمل بالإنجليزي",
      f_optional: "اختياري",
      f_photos_hint: "اختر من صورة إلى 5 صور من جهازك. الصورة الأولى تظهر كغلاف للموقع.",
      f_photos_btn: "اختر الصور", f_photo_remove: "حذف الصورة", f_cover: "الغلاف",
      btn_save_add: "حفظ الموقع", btn_save_edit: "حفظ التعديلات", btn_cancel: "إلغاء",
      btn_confirm_del: "تأكيد الحذف",
      e_required: "هذا الحقل مطلوب.",
      e_max: "النص أطول من المسموح ({n} حرف).",
      e_dup: "يوجد موقع آخر بنفس الاسم.",
      e_photo_req: "أضف صورة واحدة على الأقل.",
      e_photo_max: "يمكنك إضافة 5 صور كحد أقصى.",
      e_photo_type: "الملف المختار ليس صورة.",
      e_form: "راجع الحقول المحددة باللون الأحمر.",
      e_storage: "تعذّر الحفظ في المتصفح. افتح الموقع من الخادم المحلي، أو اختر صورًا أصغر.",
      e_not_found: "الموقع غير موجود. ربما تم حذفه.",
      ad_back: "العودة إلى لوحة التحكم",
      del_warn: "سيتم حذف هذا الموقع وكل تقييماته ومراجعاته من حيّاك، ولن يظهر للسياح بعد الآن.",
      lbl_city: "المدينة", lbl_type: "التصنيف", lbl_photos: "عدد الصور"
    },
    en: {
      ad_kicker: "Admin dashboard",
      ad_title: "Manage heritage sites",
      ad_sub: "Add new sites, and edit or delete the current ones.",
      ad_add_title: "Add a heritage site", ad_add_sub: "Fill in the site's details in Arabic and English, then click Save.",
      ad_edit_title: "Edit a heritage site", ad_edit_sub: "Change the details you want, then click Save changes.",
      ad_del_title: "Delete a heritage site", ad_del_sub: "Check the site before deleting it. Deleting cannot be undone.",
      st_sites: "Heritage sites", st_cities: "Cities", st_types: "Classifications",
      ad_search: "Search sites", ad_search_ph: "Search by site name or city…",
      ad_add_btn: "Add site", ad_view_sites: "View heritage sites",
      col_photo: "Photo", col_name: "Site name", col_city: "City", col_type: "Classification", col_actions: "Actions",
      act_view: "View", act_edit: "Edit", act_delete: "Delete",
      ad_empty: "No matching sites.", ad_none: "There are no sites yet. Start by adding one.",
      ad_reset: "Restore the original data",
      ad_reset_q: "All additions and changes will be removed and the original sites restored. Are you sure?",
      msg_added: "The site was added successfully.", msg_updated: "The changes were saved successfully.", msg_deleted: "The site was deleted successfully.",
      msg_reset: "The original data has been restored.",
      sec_names: "Site name", sec_place: "City and classification", sec_desc: "Description", sec_visit: "Visit information", sec_photos: "Photos",
      f_nameAr: "Name in Arabic", f_nameEn: "Name in English",
      f_city: "City", f_type: "Classification", f_choose: "Choose…",
      f_descAr: "Description in Arabic", f_descEn: "Description in English",
      f_addrAr: "Address in Arabic", f_addrEn: "Address in English",
      f_hoursAr: "Working hours in Arabic", f_hoursEn: "Working hours in English",
      f_optional: "optional",
      f_photos_hint: "Choose 1 to 5 photos from your device. The first photo is used as the site's cover.",
      f_photos_btn: "Choose photos", f_photo_remove: "Remove photo", f_cover: "Cover",
      btn_save_add: "Save site", btn_save_edit: "Save changes", btn_cancel: "Cancel",
      btn_confirm_del: "Confirm delete",
      e_required: "This field is required.",
      e_max: "The text is too long (maximum {n} characters).",
      e_dup: "Another site already has this name.",
      e_photo_req: "Add at least one photo.",
      e_photo_max: "You can add up to 5 photos.",
      e_photo_type: "The selected file is not an image.",
      e_form: "Please check the fields marked in red.",
      e_storage: "Could not save in the browser. Open the website through the local server, or choose smaller photos.",
      e_not_found: "The site could not be found. It may have been deleted.",
      ad_back: "Back to the dashboard",
      del_warn: "This site and all its ratings and reviews will be deleted from Hayyak, and tourists will no longer see it.",
      lbl_city: "City", lbl_type: "Classification", lbl_photos: "Photos"
    }
  });

  /* ---------- Data helpers ---------- */
  const SITES_KEY = "hayyak.sites";           // same key that js/sites.js reads
  const REVIEWS_KEY = "hayyakReviews";        // reviews used by the Site Details page
  const MAX_PHOTOS = 5;
  const LIMITS = { nameAr: 150, nameEn: 150, addressAr: 255, addressEn: 255, workingHoursAr: 200, workingHoursEn: 200, descriptionAr: 2000, descriptionEn: 2000 };

  /* cities and classifications used across Hayyak (Arabic and English together) */
  /* the City table: the cities that already have sites, plus the main cities and regions of the Kingdom */
  const BASE_CITIES = [
    ["Riyadh", "الرياض"], ["Jeddah", "جدة"], ["AlUla", "العلا"], ["Diriyah", "الدرعية"], ["Asir", "عسير"],
    ["Makkah", "مكة المكرمة"], ["Madinah", "المدينة المنورة"], ["Taif", "الطائف"], ["Dammam", "الدمام"],
    ["Al-Ahsa", "الأحساء"], ["Qatif", "القطيف"], ["Hail", "حائل"], ["Tabuk", "تبوك"], ["Al-Qassim", "القصيم"],
    ["Najran", "نجران"], ["Jazan", "جازان"], ["Al-Baha", "الباحة"], ["Al-Jouf", "الجوف"],
    ["Northern Borders", "الحدود الشمالية"], ["Abha", "أبها"], ["Yanbu", "ينبع"], ["Shaqra", "شقراء"]
  ];
  const BASE_TYPES = [["Museum", "متحف"], ["Fort", "قلعة"], ["Traditional Market", "سوق تقليدي"],
                      ["Historic District", "حي تاريخي"], ["Archaeological Site", "موقع أثري"],
                      ["Palace", "قصر"], ["Heritage Village", "قرية تراثية"], ["Historic Mosque", "مسجد تاريخي"],
                      ["Heritage Park", "حديقة تراثية"]];

  function saveSites(list) {
    try {
      localStorage.setItem(SITES_KEY, JSON.stringify(list));
      heritageSites.length = 0;
      list.forEach(function (s) { heritageSites.push(s); });
      return true;
    } catch (e) { return false; }
  }
  function copySites() { return heritageSites.map(function (s) { return JSON.parse(JSON.stringify(s)); }); }
  function findSite(id) { return heritageSites.filter(function (s) { return String(s.siteID) === String(id); })[0] || null; }
  function nextId() { return heritageSites.reduce(function (m, s) { return Math.max(m, Number(s.siteID) || 0); }, 0) + 1; }

  function pairs(base, enKey, arKey) {
    const list = base.slice();
    heritageSites.forEach(function (s) {
      if (s[enKey] && !list.some(function (p) { return p[0] === s[enKey]; })) list.push([s[enKey], s[arKey] || s[enKey]]);
    });
    return list;
  }
  function cityPairs() { return pairs(BASE_CITIES, "cityEn", "cityAr"); }
  function typePairs() { return pairs(BASE_TYPES, "classificationEn", "classificationAr"); }

  function ar() { return Hayyak.getLang() === "ar"; }
  function pick(site, base) { return site[base + (ar() ? "Ar" : "En")] || site[base + (ar() ? "En" : "Ar")] || ""; }
  const esc = Hayyak.esc;
  const $ = function (id) { return document.getElementById(id); };
  function param(name) { return new URLSearchParams(location.search).get(name); }
  function norm(v) { return String(v || "").trim().replace(/\s+/g, " ").toLowerCase(); }

  /* ---------- Photo storage (see sw.js) ---------- */
  const UPLOADS = "hayyak-uploads";
  function isUpload(path) { return typeof path === "string" && path.indexOf("images/uploads/") === 0; }
  function absUrl(path) { return new URL(path, location.href).href; }
  /* true when the browser can keep original photos under images/uploads/ (website opened through http://localhost) */
  function uploadsReady() {
    if (!("serviceWorker" in navigator) || !("caches" in window) || !/^https?:$/.test(location.protocol)) return Promise.resolve(false);
    return navigator.serviceWorker.register("sw.js")
      .then(function () { return navigator.serviceWorker.ready; })
      .then(function () { return true; })
      .catch(function () { return false; });
  }
  function readAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      const r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }
  function removeUploads(paths) {
    if (!("caches" in window)) return Promise.resolve();
    return caches.open(UPLOADS).then(function (cache) {
      return Promise.all((paths || []).filter(isUpload).map(function (p) { return cache.delete(absUrl(p)); }));
    }).catch(function () {});
  }

  function showAlert(el, key, type) {
    if (!el) return;
    el.className = "form-alert " + (type || "");
    el.setAttribute("data-key", key || "");
    el.textContent = key ? Hayyak.t(key) : "";
    el.hidden = !key;
  }

  const page = document.body.getAttribute("data-page");

  /* =========================================================
     1) Admin Dashboard
     ========================================================= */
  if (page === "admin-dashboard") {
    const tbody = $("ad-rows"), empty = $("ad-empty"), search = $("ad-search");
    const flash = $("ad-flash");
    const highlight = param("id");

    const msg = param("msg");
    if (msg) showAlert(flash, "msg_" + msg, "success");

    function renderStats() {
      const cities = {}, types = {};
      heritageSites.forEach(function (s) { cities[s.cityEn] = 1; types[s.classificationEn] = 1; });
      $("st-sites").textContent = heritageSites.length;
      $("st-cities").textContent = Object.keys(cities).length;
      $("st-types").textContent = Object.keys(types).length;
    }

    function renderRows() {
      const q = norm(search.value);
      const rows = heritageSites.filter(function (s) {
        if (!q) return true;
        return [s.nameAr, s.nameEn, s.cityAr, s.cityEn, s.classificationAr, s.classificationEn].some(function (v) { return norm(v).indexOf(q) !== -1; });
      });
      empty.hidden = rows.length > 0;
      empty.textContent = Hayyak.t(heritageSites.length ? "ad_empty" : "ad_none");
      tbody.innerHTML = rows.map(function (s) {
        const photo = (s.photos && s.photos[0]) || "images/hero.jpg";
        const hl = String(s.siteID) === String(highlight) ? ' class="is-new"' : "";
        return "<tr" + hl + ">" +
          '<td class="ad-photo"><img src="' + esc(photo) + '" alt="" loading="lazy"></td>' +
          '<td class="ad-name"><strong dir="auto">' + esc(pick(s, "name")) + '</strong><span dir="auto">' + esc(ar() ? s.nameEn : s.nameAr) + "</span></td>" +
          '<td data-label="' + esc(Hayyak.t("col_city")) + '">' + esc(pick(s, "city")) + "</td>" +
          '<td data-label="' + esc(Hayyak.t("col_type")) + '"><span class="ad-chip">' + esc(pick(s, "classification")) + "</span></td>" +
          '<td class="ad-actions">' +
            '<a class="ad-act" href="site-details.html?id=' + s.siteID + '">' + Hayyak.t("act_view") + "</a>" +
            '<a class="ad-act edit" href="admin-edit.html?id=' + s.siteID + '">' + Hayyak.t("act_edit") + "</a>" +
            '<a class="ad-act del" href="admin-delete.html?id=' + s.siteID + '">' + Hayyak.t("act_delete") + "</a>" +
          "</td></tr>";
      }).join("");
    }

    search.addEventListener("input", renderRows);
    $("ad-reset").addEventListener("click", function () {
      if (!window.confirm(Hayyak.t("ad_reset_q"))) return;
      try { localStorage.removeItem(SITES_KEY); } catch (e) {}
      const done = function () { window.location.href = "admin.html?msg=reset"; };
      if ("caches" in window) caches.delete(UPLOADS).then(done, done); else done();
    });
    document.addEventListener("hayyak:lang", function () { renderRows(); showAlert(flash, flash.getAttribute("data-key"), "success"); });

    renderStats();
    renderRows();
  }

  /* =========================================================
     2) Add Site and Edit Site (same form)
     ========================================================= */
  if (page === "admin-add" || page === "admin-edit") {
    const isEdit = page === "admin-edit";
    const form = $("site-form");
    const alertBox = form.querySelector(".form-alert");
    let site = null;
    let photos = [];   // [{ src, file }]: src is a saved path, or a preview of a new file

    if (isEdit) {
      site = findSite(param("id"));
      if (!site) {
        form.hidden = true;
        $("ad-missing").hidden = false;
        return;
      }
      photos = (site.photos || []).map(function (src) { return { src: src }; });
    }

    /* fill the City and Classification lists */
    function fillSelect(sel, list, current) {
      sel.innerHTML = '<option value="" data-i18n="f_choose">' + Hayyak.t("f_choose") + "</option>" +
        list.map(function (p) {
          return '<option value="' + esc(p[0]) + '"' + (p[0] === current ? " selected" : "") + ">" + esc(ar() ? p[1] : p[0]) + "</option>";
        }).join("");
    }
    function fillLists() {
      fillSelect(form.elements.city, cityPairs(), form.elements.city.value || (site && site.cityEn));
      fillSelect(form.elements.classification, typePairs(), form.elements.classification.value || (site && site.classificationEn));
    }
    fillLists();

    const textFields = ["nameAr", "nameEn", "descriptionAr", "descriptionEn", "addressAr", "addressEn", "workingHoursAr", "workingHoursEn"];
    if (site) textFields.forEach(function (f) { form.elements[f].value = site[f] || ""; });

    /* ----- field errors ----- */
    function setError(name, key, n) {
      const field = form.querySelector('[data-field="' + name + '"]');
      const msg = field.querySelector(".error");
      field.classList.toggle("invalid", !!key);
      msg.setAttribute("data-key", key || "");
      msg.setAttribute("data-n", n || "");
      msg.textContent = key ? Hayyak.t(key).replace("{n}", n || "") : "";
      const input = field.querySelector("input, select, textarea");
      if (input) input.setAttribute("aria-invalid", key ? "true" : "false");
      return !key;
    }
    function checkText(name, required) {
      const v = form.elements[name].value.trim();
      if (required && !v) return setError(name, "e_required");
      if (LIMITS[name] && v.length > LIMITS[name]) return setError(name, "e_max", LIMITS[name]);
      if ((name === "nameAr" || name === "nameEn") && v) {
        const dup = heritageSites.some(function (s) {
          return (!site || String(s.siteID) !== String(site.siteID)) && norm(s[name]) === norm(v);
        });
        if (dup) return setError(name, "e_dup");
      }
      return setError(name, "");
    }
    function checkSelect(name) { return setError(name, form.elements[name].value ? "" : "e_required"); }
    function checkPhotos() {
      if (!photos.length) return setError("photos", "e_photo_req");
      if (photos.length > MAX_PHOTOS) return setError("photos", "e_photo_max");
      return setError("photos", "");
    }

    /* clear a field's error as soon as the admin fixes it */
    textFields.forEach(function (f) {
      form.elements[f].addEventListener("input", function () {
        if (form.querySelector('[data-field="' + f + '"]').classList.contains("invalid")) checkText(f, f === "nameAr" || f === "nameEn");
        showAlert(alertBox, "");
      });
    });
    ["city", "classification"].forEach(function (f) {
      form.elements[f].addEventListener("change", function () { checkSelect(f); showAlert(alertBox, ""); });
    });

    /* ----- photos: choose from the device, preview, remove ----- */
    const grid = $("photo-grid"), picker = form.elements.photoFiles;
    function renderPhotos() {
      grid.innerHTML = photos.map(function (p, i) {
        return '<li class="ad-thumb">' +
          '<img src="' + esc(p.src) + '" alt="">' +
          (i === 0 ? '<span class="ad-cover" data-i18n="f_cover">' + Hayyak.t("f_cover") + "</span>" : "") +
          '<button type="button" class="ad-thumb-x" data-i="' + i + '" aria-label="' + esc(Hayyak.t("f_photo_remove")) + '">&times;</button></li>';
      }).join("");
      $("photo-count").textContent = photos.length + " / " + MAX_PHOTOS;
    }
    grid.addEventListener("click", function (e) {
      const btn = e.target.closest(".ad-thumb-x");
      if (!btn) return;
      photos.splice(Number(btn.getAttribute("data-i")), 1);
      renderPhotos();
      checkPhotos();
    });
    picker.addEventListener("change", function () {
      const files = Array.prototype.slice.call(picker.files);
      picker.value = "";
      if (files.some(function (f) { return !/^image\//.test(f.type); })) { setError("photos", "e_photo_type"); return; }
      if (photos.length + files.length > MAX_PHOTOS) { setError("photos", "e_photo_max"); return; }
      files.forEach(function (f) { photos.push({ src: URL.createObjectURL(f), file: f }); });
      renderPhotos();
      checkPhotos();
    });
    uploadsReady();   // get the photo helper ready while the admin fills in the form

    /* keep each new photo in its original size and quality, and return the saved paths */
    function storePhotos(siteID) {
      return uploadsReady().then(function (useUploads) {
        const stamp = Date.now();
        return Promise.all(photos.map(function (p, i) {
          if (!p.file) return p.src;
          if (!useUploads) return readAsDataUrl(p.file);   // fallback when the site is opened as a file
          const ext = ((p.file.name.match(/\.([a-z0-9]+)$/i) || [])[1] || "jpg").toLowerCase();
          const path = "images/uploads/site-" + siteID + "-" + stamp + "-" + (i + 1) + "." + ext;
          return caches.open(UPLOADS)
            .then(function (cache) {
              return cache.put(absUrl(path), new Response(p.file, { headers: { "Content-Type": p.file.type || "image/jpeg" } }));
            })
            .then(function () { return path; });
        }));
      });
    }
    renderPhotos();

    /* ----- save ----- */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      showAlert(alertBox, "");
      const ok = [
        checkText("nameAr", true), checkText("nameEn", true),
        checkSelect("city"), checkSelect("classification"),
        checkText("descriptionAr"), checkText("descriptionEn"),
        checkText("addressAr"), checkText("addressEn"),
        checkText("workingHoursAr"), checkText("workingHoursEn"),
        checkPhotos()
      ].every(Boolean);
      if (!ok) {
        showAlert(alertBox, "e_form", "error");
        const first = form.querySelector(".invalid input, .invalid select, .invalid textarea, .invalid button");
        if (first) first.focus();
        return;
      }

      const city = cityPairs().filter(function (p) { return p[0] === form.elements.city.value; })[0];
      const type = typePairs().filter(function (p) { return p[0] === form.elements.classification.value; })[0];
      const siteID = isEdit ? site.siteID : nextId();
      const submit = form.querySelector("button[type=submit]");
      submit.disabled = true;

      storePhotos(siteID).then(function (paths) {
        const data = {
          siteID: siteID,
          nameAr: "", nameEn: "",
          cityAr: city[1], cityEn: city[0],
          classificationAr: type[1], classificationEn: type[0],
          photos: paths
        };
        textFields.forEach(function (f) { data[f] = form.elements[f].value.trim().replace(/[ \t]+/g, " "); });

        const list = copySites();
        if (isEdit) {
          const i = list.findIndex(function (s) { return String(s.siteID) === String(site.siteID); });
          list[i] = Object.assign({}, list[i], data);
        } else {
          list.push(data);
        }
        if (!saveSites(list)) {
          removeUploads(paths.filter(function (p) { return !site || (site.photos || []).indexOf(p) === -1; }));
          showAlert(alertBox, "e_storage", "error");
          submit.disabled = false;
          return;
        }
        /* photos the admin removed while editing are deleted too */
        const removed = isEdit ? (site.photos || []).filter(function (p) { return paths.indexOf(p) === -1; }) : [];
        return removeUploads(removed).then(function () {
          showAlert(alertBox, isEdit ? "msg_updated" : "msg_added", "success");
          setTimeout(function () {
            window.location.href = "admin.html?msg=" + (isEdit ? "updated" : "added") + "&id=" + data.siteID;
          }, 1200);
        });
      }).catch(function () {
        showAlert(alertBox, "e_storage", "error");
        submit.disabled = false;
      });
    });

    /* re-translate lists and messages when the language changes */
    document.addEventListener("hayyak:lang", function () {
      fillLists();
      renderPhotos();
      form.querySelectorAll(".error[data-key]").forEach(function (el) {
        const k = el.getAttribute("data-key");
        el.textContent = k ? Hayyak.t(k).replace("{n}", el.getAttribute("data-n") || "") : "";
      });
      if (alertBox.getAttribute("data-key")) alertBox.textContent = Hayyak.t(alertBox.getAttribute("data-key"));
    });
  }

  /* =========================================================
     3) Delete Site (confirmation page)
     ========================================================= */
  if (page === "admin-delete") {
    const site = findSite(param("id"));
    const card = $("del-card");
    if (!site) {
      card.hidden = true;
      $("ad-missing").hidden = false;
      return;
    }

    function render() {
      const photo = (site.photos && site.photos[0]) || "images/hero.jpg";
      $("del-photo").src = photo;
      $("del-name").textContent = pick(site, "name");
      $("del-name-alt").textContent = ar() ? site.nameEn : site.nameAr;
      $("del-city").textContent = pick(site, "city");
      $("del-type").textContent = pick(site, "classification");
      $("del-count").textContent = (site.photos || []).length;
    }
    render();
    document.addEventListener("hayyak:lang", render);

    $("del-confirm").addEventListener("click", function () {
      const list = copySites().filter(function (s) { return String(s.siteID) !== String(site.siteID); });
      if (!saveSites(list)) { showAlert($("del-alert"), "e_storage", "error"); return; }
      /* a deleted site's reviews are deleted with it */
      try {
        const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY));
        if (Array.isArray(reviews)) {
          localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews.filter(function (r) { return String(r.siteID) !== String(site.siteID); })));
        }
      } catch (e) {}
      const done = function () { window.location.href = "admin.html?msg=deleted"; };
      removeUploads(site.photos).then(done, done);
    });
  }
})();
