
(function () {
  "use strict";

  const $ = id => document.getElementById(id);

  const TEXT = {
    ar: {
      back: "← العودة إلى المواقع التراثية",
      notFound: "الموقع غير موجود أو تعذر تحميل بياناته.",
      missing: "غير متوفر",
      about: "عن الموقع",
      visit: "معلومات الزيارة",
      location: "الموقع والعنوان",
      hours: "ساعات العمل",
      category: "التصنيف",
      reviews: "تقييمات الزوار",
      noReviews: "لا توجد تقييمات لهذا الموقع بعد.",
      count: "تقييم",
      photo: "الصورة غير متوفرة"
    },
    en: {
      back: "← Back to heritage sites",
      notFound: "The site could not be found or its data could not be loaded.",
      missing: "Not available",
      about: "About Site",
      visit: "Visit Information",
      location: "Location & Address",
      hours: "Working Hours",
      category: "Classification",
      reviews: "Visitor Reviews",
      noReviews: "No reviews for this site yet.",
      count: "reviews",
      photo: "Photo not available"
    }
  };

  let lang = "ar", site = null, currentPhotoIdx = 0, photos = [];

  function getLang() {
    if (window.Hayyak && typeof Hayyak.getLang === "function") return Hayyak.getLang();
    try {
      const x = localStorage.getItem("hayyak.lang") || localStorage.getItem("hayyakLang");
      if (x === "ar" || x === "en") return x;
    } catch(e) {}
    return document.documentElement.lang === "en" ? "en" : "ar";
  }

  const t = key => (TEXT[lang] && TEXT[lang][key]) ? TEXT[lang][key] : key;

  function findSite() {
    const p = new URLSearchParams(location.search);
    let id = p.get("id") || p.get("siteID");
    const list = window.heritageSites || (typeof heritageSites !== "undefined" ? heritageSites : []);
    if (!id || !Array.isArray(list)) return null;
    id = id.trim().replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 1632));
    return list.find(s => String(s.siteID) === String(id) || String(s.id) === String(id)) || null;
  }

  function setupGallery() {
    const main = $("details-main-photo");
    const note = $("details-photo-message");
    const thumbs = $("details-thumbnails");
    const prevBtn = $("details-prev-btn");
    const nextBtn = $("details-next-btn");

    if (!main) return;

    photos = Array.isArray(site.photos) ? site.photos.filter(Boolean) : [];
    if (!photos.length) {
      main.hidden = true;
      if (note) { note.hidden = false; note.textContent = t("photo"); }
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      return;
    }

    function showIndex(index) {
      if (index < 0) index = photos.length - 1;
      if (index >= photos.length) index = 0;
      currentPhotoIdx = index;

      main.hidden = false;
      if (note) note.hidden = true;
      main.alt = lang === "ar" ? site.nameAr : site.nameEn;
      main.src = photos[currentPhotoIdx];

      if (thumbs) {
        const buttons = thumbs.querySelectorAll(".details-thumb-button");
        buttons.forEach((btn, idx) => {
          btn.classList.toggle("is-active", idx === currentPhotoIdx);
        });
      }
    }

    if (photos.length > 1) {
      if (prevBtn) {
        prevBtn.style.display = "flex";
        prevBtn.onclick = () => showIndex(currentPhotoIdx - 1);
      }
      if (nextBtn) {
        nextBtn.style.display = "flex";
        nextBtn.onclick = () => showIndex(currentPhotoIdx + 1);
      }
    } else {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
    }

    if (thumbs) {
      thumbs.textContent = "";
      if (photos.length > 1) {
        photos.forEach((src, idx) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "details-thumb-button" + (idx === 0 ? " is-active" : "");
          b.setAttribute("aria-label", lang === "ar" ? site.nameAr : site.nameEn);

          const img = document.createElement("img");
          img.src = src;
          img.alt = "";
          img.loading = "lazy";

          b.appendChild(img);
          b.addEventListener("click", () => showIndex(idx));
          thumbs.appendChild(b);
        });
      }
    }

    showIndex(0);
  }

  function renderReviews() {
    const list = $("details-review-list");
    const summary = $("details-rating-summary");
    const empty = $("details-no-reviews");

    if (!list) return;

    let reviewsList = [];
    try {
      const raw = localStorage.getItem("hayyakReviews");
      reviewsList = raw ? JSON.parse(raw) : (window.heritageReviews || []);
    } catch(e) {
      reviewsList = window.heritageReviews || [];
    }

    const items = reviewsList.filter(r => String(r.siteID) === String(site.siteID));
    list.textContent = "";

    if (empty) empty.hidden = items.length > 0;
    if (summary) summary.hidden = items.length === 0;

    if (items.length && summary) {
      const valid = items.map(r => Number(r.rating)).filter(n => Number.isFinite(n) && n >= 1 && n <= 5);
      if (valid.length) {
        const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
        const starsStr = "★".repeat(Math.round(avg)) + "☆".repeat(5 - Math.round(avg));
        summary.textContent = starsStr + "  " + avg.toFixed(1) + " / 5 (" + items.length + " " + t("count") + ")";
      }
    }

    items.forEach(r => {
      const li = document.createElement("li");
      li.className = "details-review";

      const head = document.createElement("div");
      head.className = "details-review-head";

      const name = document.createElement("strong");
      name.textContent = r.reviewer || r.userName || t("missing");

      const rating = document.createElement("span");
      rating.className = "details-stars";
      const num = Math.max(0, Math.min(5, Math.round(Number(r.rating) || 0)));
      rating.textContent = "★".repeat(num) + "☆".repeat(5 - num);

      const date = document.createElement("time");
      date.className = "details-review-date";
      date.textContent = r.date ? new Date(r.date).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US") : "";

      head.append(name, rating, date);

      const body = document.createElement("p");
      body.textContent = r.text || r.comment || "";

      li.append(head, body);
      list.appendChild(li);
    });
  }

  function translate() {
    lang = getLang();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    const errorEl = $("details-error");
    const articleEl = $("site-details");

    if (!site) {
      if (errorEl) { errorEl.hidden = false; errorEl.textContent = t("notFound"); }
      if (articleEl) articleEl.hidden = true;
      return;
    }

    if (errorEl) errorEl.hidden = true;
    if (articleEl) articleEl.hidden = false;

    const i18nMapping = {
      details_back: "back",
      details_about: "about",
      details_visit_info: "visit",
      details_location: "location",
      details_hours: "hours",
      details_category: "category",
      details_reviews_title: "reviews",
      details_no_reviews: "noReviews"
    };

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = i18nMapping[el.dataset.i18n];
      if (key) el.textContent = t(key);
    });

    const name = lang === "ar" ? site.nameAr : site.nameEn;
    const classification = lang === "ar" ? site.classificationAr : site.classificationEn;
    const city = lang === "ar" ? site.cityAr : site.cityEn;
    const description = lang === "ar" ? site.descriptionAr : site.descriptionEn;
    const address = lang === "ar" ? site.addressAr : site.addressEn;
    const workingHours = lang === "ar" ? site.workingHoursAr : site.workingHoursEn;

    document.title = name + " | Hayyak";

    if ($("details-name")) $("details-name").textContent = name;
    if ($("details-classification")) $("details-classification").textContent = classification;
    if ($("details-city")) $("details-city").textContent = city;
    if ($("details-description")) $("details-description").textContent = description;
    
    if ($("details-address")) $("details-address").textContent = address || t("missing");
    if ($("details-hours")) $("details-hours").textContent = workingHours || t("missing");
    if ($("details-category")) $("details-category").textContent = classification || t("missing");

    setupGallery();
    renderReviews();
  }

  document.addEventListener("DOMContentLoaded", () => {
    site = findSite();
    translate();
  });

  document.addEventListener("hayyak:lang", translate);
  document.addEventListener("langchange", translate);
})();