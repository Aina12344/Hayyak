/*
 * site-details.js - Heritage site details page (site-details.html?id=1)
 * 1) Finds the site in heritageSites (js/sites.js)
 * 2) Full-screen photo gallery: cross-fade, slow zoom, auto-play with progress bar,
 *    arrows, thumbnails, keyboard (← →) and swipe on phones
 * 3) About, visit information and a Google Maps link
 * 4) Visitor reviews (read from localStorage "hayyakReviews" or window.heritageReviews)
 * 5) More sites in the same city
 * 6) Scroll animations (fade-up when a block enters the screen) and a light parallax
 * All motion is switched off for people who choose "reduce motion" on their device.
 */
(function () {
  "use strict";

  Hayyak.addText({
    ar: {
      sd_back: "المواقع التراثية", sd_prev: "الصورة السابقة", sd_next: "الصورة التالية",
      sd_about: "عن الموقع", sd_visit: "معلومات الزيارة",
      sd_location: "الموقع والعنوان", sd_hours: "ساعات العمل", sd_category: "التصنيف",
      sd_map: "افتح في خرائط Google", sd_missing: "غير متوفر",
      sd_reviews_eyebrow: "آراء الزوار", sd_reviews: "التقييمات",
      sd_no_reviews: "لا توجد تقييمات لهذا الموقع بعد.", sd_review_word: "تقييم",
      sd_more: "مواقع أخرى في ", sd_more_type: "مواقع مشابهة",
      sd_not_found: "الموقع غير موجود أو تعذّر تحميل بياناته.", sd_photo: "صورة"
    },
    en: {
      sd_back: "Heritage sites", sd_prev: "Previous photo", sd_next: "Next photo",
      sd_about: "About the site", sd_visit: "Visit information",
      sd_location: "Location", sd_hours: "Working hours", sd_category: "Classification",
      sd_map: "Open in Google Maps", sd_missing: "Not available",
      sd_reviews_eyebrow: "Visitor voices", sd_reviews: "Reviews",
      sd_no_reviews: "No reviews for this site yet.", sd_review_word: "reviews",
      sd_more: "More in ", sd_more_type: "Similar sites",
      sd_not_found: "The site could not be found or its data could not be loaded.", sd_photo: "Photo"
    }
  });

  const $ = function (id) { return document.getElementById(id); };
  const esc = Hayyak.esc;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const AUTOPLAY_MS = 6500;
  /* hidden-until-scrolled styles only apply when this script runs, so the page is never blank */
  if (!reduceMotion) document.documentElement.classList.add("motion");

  let site = null, photos = [], current = 0, timer = null, paused = false, started = false;

  function lang() { return Hayyak.getLang(); }
  function pick(obj, base) { return obj[base + (lang() === "ar" ? "Ar" : "En")]; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function findSite() {
    const p = new URLSearchParams(location.search);
    let id = p.get("id") || p.get("siteID");
    if (!id || typeof heritageSites === "undefined" || !Array.isArray(heritageSites)) return null;
    id = id.trim().replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 1632); }); // Arabic digits
    return heritageSites.filter(function (s) { return String(s.siteID) === id; })[0] || null;
  }

  /* ---------- Title: each word slides up one after the other ---------- */
  function renderTitle(text) {
    const h = $("sd-name");
    h.setAttribute("aria-label", text);
    h.innerHTML = text.split(/\s+/).map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + esc(w) + "</span></span>";
    }).join(" ");
    h.classList.remove("in");
    void h.offsetWidth;              // restart the animation
    h.classList.add("in");
  }

  /* ---------- Gallery ---------- */
  function buildGallery() {
    photos = (site.photos || []).filter(Boolean);
    const slides = $("sd-slides"), thumbs = $("sd-thumbs"), controls = $("sd-controls");
    const alt = pick(site, "name");

    slides.innerHTML = photos.map(function (src, i) {
      return '<figure class="sd-slide' + (i === 0 ? " is-active" : "") + '">' +
        '<img src="' + esc(src) + '" alt="' + esc(alt) + " – " + Hayyak.t("sd_photo") + " " + (i + 1) + '"' +
        (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + "></figure>";
    }).join("");

    const many = photos.length > 1;
    controls.hidden = !many;
    thumbs.hidden = !many;
    $("sd-total").textContent = pad(photos.length);

    thumbs.innerHTML = many ? photos.map(function (src, i) {
      return '<button type="button" class="sd-thumb' + (i === 0 ? " is-active" : "") + '" data-i="' + i + '" aria-label="' +
        Hayyak.t("sd_photo") + " " + (i + 1) + '"><img src="' + esc(src) + '" alt="" loading="lazy"></button>';
    }).join("") : "";

    show(current < photos.length ? current : 0, true);
  }

  function show(i, instant) {
    if (!photos.length) return;
    current = (i + photos.length) % photos.length;
    document.querySelectorAll(".sd-slide").forEach(function (s, k) { s.classList.toggle("is-active", k === current); });
    document.querySelectorAll(".sd-thumb").forEach(function (b, k) {
      b.classList.toggle("is-active", k === current);
      b.setAttribute("aria-current", k === current ? "true" : "false");
    });
    $("sd-current").textContent = pad(current + 1);
    restartTimer(instant);
  }

  /* auto-play with a thin progress bar; pauses on hover, focus, or when the tab is hidden */
  function restartTimer() {
    clearTimeout(timer);
    const bar = $("sd-progress-bar");
    bar.style.transition = "none";
    bar.style.transform = "scaleX(0)";
    if (reduceMotion || photos.length < 2 || paused) return;
    void bar.offsetWidth;
    bar.style.transition = "transform " + AUTOPLAY_MS + "ms linear";
    bar.style.transform = "scaleX(1)";
    timer = setTimeout(function () { show(current + 1); }, AUTOPLAY_MS);
  }
  function setPaused(v) { paused = v; restartTimer(); }

  function wireGallery() {
    const hero = document.querySelector(".sd-hero");
    const forward = function () { show(current + 1); };
    const back = function () { show(current - 1); };
    $("sd-next").addEventListener("click", forward);
    $("sd-prev").addEventListener("click", back);
    $("sd-thumbs").addEventListener("click", function (e) {
      const b = e.target.closest(".sd-thumb");
      if (b) show(Number(b.getAttribute("data-i")));
    });
    hero.addEventListener("mouseenter", function () { setPaused(true); });
    hero.addEventListener("mouseleave", function () { setPaused(false); });
    hero.addEventListener("focusin", function () { setPaused(true); });
    hero.addEventListener("focusout", function () { setPaused(false); });
    document.addEventListener("visibilitychange", function () { setPaused(document.hidden); });

    /* keyboard: the arrow that points to the next photo depends on the reading direction */
    document.addEventListener("keydown", function (e) {
      if (e.target.closest("input, textarea, select")) return;
      const rtl = document.documentElement.dir === "rtl";
      if (e.key === "ArrowLeft") (rtl ? forward : back)();
      if (e.key === "ArrowRight") (rtl ? back : forward)();
    });

    /* swipe on touch screens */
    let x0 = null;
    hero.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const rtl = document.documentElement.dir === "rtl";
      if (Math.abs(dx) > 45) ((dx < 0) !== rtl ? forward : back)();
      x0 = null;
    });
  }

  /* ---------- Text content ---------- */
  function renderInfo() {
    const name = pick(site, "name");
    document.title = name + " | Hayyak";
    renderTitle(name);
    $("sd-type").textContent = pick(site, "classification");
    $("sd-city").textContent = pick(site, "city");
    $("sd-description").textContent = pick(site, "description") || "";

    const address = site.addressAr || site.addressEn ? pick(site, "address") : site.address;
    const hours = site.workingHoursAr || site.workingHoursEn ? pick(site, "workingHours") : site.workingHours;
    $("sd-address").textContent = address || Hayyak.t("sd_missing");
    $("sd-hours").textContent = hours || Hayyak.t("sd_missing");
    $("sd-category").textContent = pick(site, "classification") || Hayyak.t("sd_missing");

    const q = encodeURIComponent(site.nameEn + ", " + site.cityEn + ", Saudi Arabia");
    $("sd-map").href = "https://www.google.com/maps/search/?api=1&query=" + q;
  }

  function stars(n) {
    const r = Math.max(0, Math.min(5, Math.round(n)));
    return "★★★★★".slice(0, r) + "☆☆☆☆☆".slice(0, 5 - r);
  }

  function renderReviews() {
    let all = [];
    try {
      const raw = localStorage.getItem("hayyakReviews");
      all = raw ? JSON.parse(raw) : (window.heritageReviews || []);
    } catch (e) { all = window.heritageReviews || []; }
    const items = (Array.isArray(all) ? all : []).filter(function (r) { return String(r.siteID) === String(site.siteID); });

    const list = $("sd-review-list");
    $("sd-no-reviews").hidden = items.length > 0;
    $("sd-score").hidden = items.length === 0;

    const valid = items.map(function (r) { return Number(r.rating); }).filter(function (n) { return n >= 1 && n <= 5; });
    if (valid.length) {
      const avg = valid.reduce(function (a, b) { return a + b; }, 0) / valid.length;
      $("sd-avg").textContent = avg.toFixed(1);
      $("sd-avg-stars").textContent = stars(avg);
      $("sd-review-count").textContent = items.length + " " + Hayyak.t("sd_review_word");
    }

    list.innerHTML = items.map(function (r, i) {
      const who = r.reviewer || r.userName || Hayyak.t("sd_missing");
      const date = r.date ? new Date(r.date).toLocaleDateString(lang() === "ar" ? "ar-SA" : "en-GB", { year: "numeric", month: "long", day: "numeric" }) : "";
      return '<li class="sd-review" data-reveal="up" style="--d:' + (i % 3) + '">' +
        '<span class="sd-avatar" aria-hidden="true">' + esc(String(who).trim().charAt(0)) + "</span>" +
        '<div class="sd-review-body"><div class="sd-review-head"><strong dir="auto">' + esc(who) + "</strong>" +
        '<span class="sd-stars" aria-label="' + (Number(r.rating) || 0) + '/5">' + stars(Number(r.rating) || 0) + "</span></div>" +
        "<p dir=\"auto\">" + esc(r.text || r.comment || "") + "</p>" +
        (date ? '<time class="sd-review-date">' + esc(date) + "</time>" : "") + "</div></li>";
    }).join("");
  }

  /* other sites in the same city (or same classification if the city has no others) */
  function renderMore() {
    let others = heritageSites.filter(function (s) { return s.siteID !== site.siteID && s.cityEn === site.cityEn; });
    let title = Hayyak.t("sd_more") + pick(site, "city");
    if (!others.length) {
      others = heritageSites.filter(function (s) { return s.siteID !== site.siteID && s.classificationEn === site.classificationEn; });
      title = Hayyak.t("sd_more_type");
    }
    others = others.slice(0, 3);
    $("sd-more").hidden = !others.length;
    $("sd-more-h").textContent = title;
    $("sd-more-grid").innerHTML = others.map(function (s, i) {
      const n = esc(pick(s, "name"));
      return '<a class="sd-more-card" data-reveal="up" style="--d:' + i + '" href="site-details.html?id=' + s.siteID + '">' +
        '<span class="sd-more-img"><img src="' + esc((s.photos || [])[0] || "") + '" alt="" loading="lazy"></span>' +
        '<span class="sd-more-txt"><span class="sd-more-type">' + esc(pick(s, "classification")) + "</span>" +
        '<span class="sd-more-name">' + n + '</span></span><span class="sd-more-go" aria-hidden="true">' + Hayyak.icon("chevron") + "</span></a>";
    }).join("");
  }

  /* ---------- Motion ---------- */
  let observer = null;
  function watchReveals() {
    const els = document.querySelectorAll("[data-reveal]:not(.is-in)");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); observer.unobserve(en.target); }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    }
    els.forEach(function (el) { observer.observe(el); });
  }

  /* the photo moves a little slower than the page, and the title fades as you scroll */
  function parallax() {
    if (reduceMotion) return;
    const slides = $("sd-slides"), inner = document.querySelector(".sd-hero-in");
    let ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        const y = Math.min(window.scrollY, window.innerHeight);
        slides.style.transform = "translate3d(0," + (y * 0.25) + "px,0)";
        inner.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.7)));
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Start ---------- */
  function render() {
    if (!site) {
      $("sd-error").hidden = false;
      $("sd-error").textContent = Hayyak.t("sd_not_found");
      document.body.classList.remove("over-hero");
      return;
    }
    $("sd-article").hidden = false;
    renderInfo();
    buildGallery();
    renderReviews();
    renderMore();
    Hayyak.applyIcons();
    document.querySelectorAll("[data-i18n-label]").forEach(function (b) {
      b.setAttribute("aria-label", Hayyak.t(b.getAttribute("data-i18n-label")));
    });
    watchReveals();
  }

  site = findSite();
  render();
  if (site) {
    wireGallery();
    parallax();
    requestAnimationFrame(function () { document.body.classList.add("sd-ready"); });
  }
  document.addEventListener("hayyak:lang", render);
})();
