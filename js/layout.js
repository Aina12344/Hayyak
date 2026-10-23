/*
 * layout.js - loaded on EVERY page.
 * 1) Language (Arabic / English) and text direction
 * 2) Session helpers (login state, Log out)
 * 3) Icons (simple line icons, use <span data-icon="pin"></span>)
 * 4) Shared header and footer
 *
 * Page requirements: an empty <div id="site-header"></div> at the top of <body>
 * and <div id="site-footer"></div> at the bottom, then:
 *   <script src="js/layout.js"></script>
 */
(function () {
  "use strict";

  /* ---------- 1. Translations ---------- */
  const TEXT = {
    ar: {
      nav_home: "الرئيسية", nav_sites: "المواقع التراثية", nav_visits: "زياراتي القادمة",
      login: "تسجيل الدخول", register: "إنشاء حساب", logout: "تسجيل الخروج",
      lang_switch: "EN", menu: "القائمة", hello: "أهلًا،",
      footer_about: "دليلك إلى المواقع التراثية والسياحية في المملكة، في مكان واحد.", footer_cities: "المدن", footer_account: "حسابي", footer_team: "فريق العمل", team_names: "Rema Aldosari · Haifa Alsulami · Wejdan Alkaladi · Dana Alattas · Shahad Alenzi", quick_cities: "مدن:", banner_t: "احفظ المواقع التي تودّ زيارتها", banner_d: "سجّل وأضفها إلى قائمة زياراتي القادمة.", banner_btn: "أنشئ حساب", banner_btn_in: "زياراتي القادمة",
      footer_links: "روابط", footer_types: "التصنيفات", footer_project: "عن المشروع",
      footer_course: "مقرر IT 320 – جامعة الملك سعود",
      footer_group: "المجموعة 3 – الشعبة 56579", footer_sup: "بإشراف: Dr. Rana Alkhadi", rights: "جميع الحقوق محفوظة",

      hero_eyebrow: "اكتشف تراث المملكة",
      hero_title: "كنوز المملكة التراثية في مكان واحد",
      hero_sub: "ابحث عن المواقع التراثية في كل منطقة، واعرف موقعها وساعات عملها وتصنيفها، واقرأ تجارب من زارها قبلك.",
      hero_explore: "استكشف المواقع", hero_how: "كيف يعمل حيّاك؟",
      f_q: "عمّ تبحث؟", f_city: "المدينة", f_type: "التصنيف", all: "الكل",
      search_label: "ابحث عن موقع تراثي", search_placeholder: "ابحث عن موقع تراثي أو مدينة…", search_btn: "بحث",
      ft1_t: "كل المعلومات في مكان واحد", ft1_d: "الموقع والوصف والصور لكل موقع.",
      ft2_t: "ساعات العمل محدّثة", ft2_d: "اعرف متى تزور قبل ما تطلع.",
      ft3_t: "تقييمات الزوار", ft3_d: "تجارب حقيقية تساعدك تختار.",
      ft4_t: "زياراتي القادمة", ft4_d: "احفظ المواقع ونظّم رحلتك.",
      featured_eyebrow: "مختارات حيّاك", featured_title: "مواقع تستحق الزيارة", view_all: "عرض كل المواقع", view_cities: "عرض كل المدن",
      view_details: "عرض التفاصيل",
      types_eyebrow: "تصفّح حسب", types_title: "التصنيف",
      cities_eyebrow: "تصفّح حسب", cities_title: "المدن",
      sites_word: "مواقع", site_word: "موقع",
      how_eyebrow: "كيف يساعدك حيّاك؟", how_title: "خطّط لزيارتك القادمة بسهولة",
      how1_t: "اكتشف", how1_d: "ابحث وصفِّ المواقع حسب المدينة والتصنيف.",
      how2_t: "قيّم", how2_d: "اكتب تقييمك ومراجعتك للمواقع التي زرتها.",
      how3_t: "خطّط", how3_d: "احفظ المواقع في قائمة زياراتي القادمة.",
      cta_btn: "أنشئ حسابك الآن", cta_btn_in: "اذهب إلى زياراتي القادمة",
      st_sites: "موقع تراثي", st_cities: "مدن ومناطق", st_types: "تصنيفات", st_langs: "لغتان: عربي وإنجليزي"
    },
    en: {
      nav_home: "Home", nav_sites: "Heritage Sites", nav_visits: "My Upcoming Visits",
      login: "Log in", register: "Sign up", logout: "Log out",
      lang_switch: "عربي", menu: "Menu", hello: "Hello,",
      footer_about: "Your guide to heritage and tourist sites across Saudi Arabia, in one place.", footer_cities: "Cities", footer_account: "My account", footer_team: "Team", team_names: "Rema Aldosari · Haifa Alsulami · Wejdan Alkaladi · Dana Alattas · Shahad Alenzi", quick_cities: "Cities:", banner_t: "Save the sites you want to visit", banner_d: "Sign up and add them to My Upcoming Visits.", banner_btn: "Sign up", banner_btn_in: "My Upcoming Visits",
      footer_links: "Links", footer_types: "Classifications", footer_project: "About the project",
      footer_course: "IT 320 – King Saud University",
      footer_group: "Group 3 – Section 56579", footer_sup: "Supervised by Dr. Rana Alkhadi", rights: "All rights reserved",

      hero_eyebrow: "Discover the Kingdom's heritage",
      hero_title: "The Kingdom's heritage treasures in one place",
      hero_sub: "Find heritage sites in every region, check their location, working hours and classification, and read what other visitors thought.",
      hero_explore: "Explore sites", hero_how: "How Hayyak works",
      f_q: "What are you looking for?", f_city: "City", f_type: "Classification", all: "All",
      search_label: "Search for a heritage site", search_placeholder: "Search for a heritage site or city…", search_btn: "Search",
      ft1_t: "Everything in one place", ft1_d: "Location, description and photos for every site.",
      ft2_t: "Up-to-date hours", ft2_d: "Know when to go before you set off.",
      ft3_t: "Visitor reviews", ft3_d: "Real experiences to help you choose.",
      ft4_t: "My Upcoming Visits", ft4_d: "Save sites and organise your trip.",
      featured_eyebrow: "Hayyak picks", featured_title: "Sites worth a visit", view_all: "View all sites", view_cities: "View all cities",
      view_details: "View details",
      types_eyebrow: "Browse by", types_title: "Classification",
      cities_eyebrow: "Browse by", cities_title: "Cities",
      sites_word: "sites", site_word: "site",
      how_eyebrow: "How Hayyak helps", how_title: "Plan your next visit with ease",
      how1_t: "Discover", how1_d: "Search and filter sites by city and classification.",
      how2_t: "Review", how2_d: "Rate and review the sites you have visited.",
      how3_t: "Plan", how3_d: "Save sites to My Upcoming Visits.",
      cta_btn: "Create your account", cta_btn_in: "Go to My Upcoming Visits",
      st_sites: "Heritage sites", st_cities: "Cities and regions", st_types: "Classifications", st_langs: "Languages: Arabic and English"
    }
  };

  const LANG_KEY = "hayyak.lang";
  const USER_KEY = "hayyakUser";

  function getLang() {
    try { return localStorage.getItem(LANG_KEY) || "ar"; } catch (e) { return "ar"; }
  }
  function t(key) { return (TEXT[getLang()] || TEXT.ar)[key] || key; }

  /* Fills every element that has data-i18n / data-i18n-placeholder */
  function applyLang() {
    const lang = getLang();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
  }
  function setLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyLang();
    renderFooter();
    document.dispatchEvent(new CustomEvent("hayyak:lang", { detail: lang }));
  }

  /* ---------- 2. Session helpers ---------- */
  /* Other pages call Hayyak.login({ name, role }) after a successful login.
     role is "tourist" or "admin". */
  function getUser() {
    try { return JSON.parse(sessionStorage.getItem(USER_KEY)); } catch (e) { return null; }
  }
  function login(user) {
    try { sessionStorage.setItem(USER_KEY, JSON.stringify(user)); } catch (e) {}
  }
  function logout() {
    try { sessionStorage.removeItem(USER_KEY); } catch (e) {}
    window.location.href = "index.html";
  }

  /* ---------- 3. Icons ---------- */
  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    /* classifications */
    museum: '<path d="M3 9 12 4l9 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
    fort: '<path d="M4 21V8h3v2h2V8h2v2h2V8h2v2h2V8h3v13zM10 21v-4a2 2 0 0 1 4 0v4"/>',
    market: '<path d="M4 9 5.5 4h13L20 9M4 9h16M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5 11v9h14v-9M10 20v-5h4v5"/>',
    district: '<path d="M3 21V11l5-4 5 4v10M13 21V8l4-3 4 3v13M7 21v-4h2v4M16 12h2M16 16h2M2 21h20"/>',
    ruins: '<path d="M5 21V8M10 21V8M14 21v-7M19 21V8M3 8h13l-1-3H4zM16 8h5M2 21h20"/>',
    sites: '<path d="M3 21h18M5 21V10l7-5 7 5v11M10 21v-6h4v6"/>',
    city: '<path d="M3 21h18M5 21V8h6v13M11 21V4h8v17M7 11h2M7 15h2M14 8h2M14 12h2M14 16h2"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1.1M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    lang: '<path d="M4 6h9M8.5 4v2M6 6c.5 3 2.5 5.5 5 7M11 6c-.5 3-2.5 5.5-5 7M13 20l4-9 4 9M14.5 17h5"/>'
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || "") + "</svg>";
  }
  function applyIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (el) {
      if (!el.firstChild) el.innerHTML = icon(el.getAttribute("data-icon"));
    });
  }

  /* ---------- 4. Header and footer ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function currentPage() {
    const p = window.location.pathname.split("/").pop();
    return p || "index.html";
  }

  function navLink(href, key, user, touristOnly) {
    if (touristOnly && !(user && user.role === "tourist")) return "";
    const current = currentPage() === href ? ' aria-current="page"' : "";
    return '<a href="' + href + '"' + current + ' data-i18n="' + key + '">' + t(key) + "</a>";
  }

  function renderHeader() {
    const host = document.getElementById("site-header");
    if (!host) return;
    const user = getUser();

    const auth = user
      ? '<span class="user-name">' + esc(user.name || "") + "</span>" +
        '<button type="button" class="link-btn" id="logout-btn" data-i18n="logout">' + t("logout") + "</button>"
      : '<a class="link-btn" href="login.html" data-i18n="login">' + t("login") + "</a>" +
        '<a class="btn btn-green btn-sm" href="register.html" data-i18n="register">' + t("register") + "</a>";

    host.innerHTML =
      '<header class="site-header">' +
        '<div class="bar wrap">' +
          '<a class="brand" href="index.html" aria-label="Hayyak"><img class="brand-logo" src="images/logo.png" alt="حيّاك"></a>' +
          '<nav class="site-nav" id="site-nav">' +
            navLink("index.html", "nav_home", user) +
            navLink("sites.html", "nav_sites", user) +
            navLink("upcoming.html", "nav_visits", user, true) +
          "</nav>" +
          '<div class="actions">' +
            '<button type="button" class="link-btn" id="lang-btn" data-i18n="lang_switch">' + t("lang_switch") + "</button>" +
            auth +
          "</div>" +
          '<button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">' + icon("menu") + "</button>" +
        "</div>" +
      "</header>";

    document.getElementById("lang-btn").addEventListener("click", function () {
      setLang(getLang() === "ar" ? "en" : "ar");
    });
    const out = document.getElementById("logout-btn");
    if (out) out.addEventListener("click", logout);

    const header = host.querySelector(".site-header");
    const toggle = document.getElementById("nav-toggle");
    toggle.addEventListener("click", function () {
      const open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    /* adds a shadow once the page is scrolled */
    const onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  const FOOTER_CITIES = [["Riyadh","الرياض"],["Jeddah","جدة"],["AlUla","العلا"],["Diriyah","الدرعية"],["Asir","عسير"]];

  function renderFooter() {
    const host = document.getElementById("site-footer");
    if (!host) return;
    const user = getUser();
    const ar = getLang() === "ar";
    function link(href, key) { return '<li><a href="' + href + '" data-i18n="' + key + '">' + t(key) + "</a></li>"; }
    const account = user
      ? (user.role === "tourist" ? link("upcoming.html", "nav_visits") : "") +
        '<li><button type="button" class="link-btn" id="footer-logout" data-i18n="logout">' + t("logout") + "</button></li>"
      : link("login.html", "login") + link("register.html", "register");

    host.innerHTML =
      '<footer class="site-footer">' +
        '<div class="wrap footer-grid">' +
          '<div class="footer-brand">' +
            '<a href="index.html" class="footer-logo"><img src="images/logo.png" alt="حيّاك"></a>' +
            '<p data-i18n="footer_about">' + t("footer_about") + "</p>" +
          "</div>" +
          '<div><h4 data-i18n="footer_links">' + t("footer_links") + "</h4><ul>" +
            link("index.html", "nav_home") + link("sites.html", "nav_sites") + "</ul></div>" +
          '<div><h4 data-i18n="footer_cities">' + t("footer_cities") + "</h4><ul>" +
            FOOTER_CITIES.map(function (c) {
              return '<li><a href="sites.html?city=' + c[0] + '">' + (ar ? c[1] : c[0]) + "</a></li>";
            }).join("") + "</ul></div>" +
          '<div><h4 data-i18n="footer_account">' + t("footer_account") + "</h4><ul>" + account + "</ul></div>" +
        "</div>" +
        '<div class="wrap footer-bottom">' +
          '<span>&copy; 2026 Hayyak | حيّاك · <span data-i18n="rights">' + t("rights") + "</span></span>" +
        "</div>" +
      "</footer>";
    const fo = document.getElementById("footer-logout");
    if (fo) fo.addEventListener("click", logout);
  }


  renderHeader();
  renderFooter();
  applyLang();
  applyIcons();

  /* Lets a page add its own translations: Hayyak.addText({ ar: {...}, en: {...} }) */
  function addText(extra) {
    Object.keys(extra).forEach(function (lang) {
      if (TEXT[lang]) Object.assign(TEXT[lang], extra[lang]);
    });
    applyLang();
  }

  /* Public API for the other pages */
  window.Hayyak = { t: t, getLang: getLang, setLang: setLang, applyLang: applyLang,
                    getUser: getUser, login: login, logout: logout, esc: esc,
                    icon: icon, applyIcons: applyIcons, addText: addText };
})();
