/* home.js - renders the home page content from heritageSites (js/sites.js). */
(function () {
  "use strict";

  const CITY_COVER = { Riyadh: 2, Jeddah: 5, AlUla: 8, Diriyah: 11, Asir: 15 }; // siteID used as city photo

  const esc = Hayyak.esc;
  function lang() { return Hayyak.getLang(); }
  function pick(obj, base) { return obj[base + (lang() === "ar" ? "Ar" : "En")]; }
  function byId(id) { return heritageSites.filter(function (s) { return s.siteID === id; })[0]; }
  function photo(s) { return s && s.photos && s.photos[0] ? s.photos[0] : ""; }
  function countLabel(n) { return n + " " + Hayyak.t(n === 1 ? "site_word" : "sites_word"); }

  /* Groups sites by city or classification: [{ en, ar, n, sites }] */
  function group(field) {
    const map = {}, order = [];
    heritageSites.forEach(function (s) {
      const k = s[field + "En"];
      if (!map[k]) { map[k] = { en: k, ar: s[field + "Ar"], n: 0, sites: [] }; order.push(k); }
      map[k].n++; map[k].sites.push(s);
    });
    return order.map(function (k) { return map[k]; });
  }

  /* Moving strip of ALL heritage sites. The list is repeated twice so the
     animation can loop without a gap; the copy is hidden from screen readers. */
  function renderFeatured() {
    const cards = heritageSites.map(function (s) {
      const name = esc(pick(s, "name"));
      return (
        '<a class="site-card" href="site-details.html?id=' + s.siteID + '">' +
          '<img src="' + photo(s) + '" alt="' + name + '" loading="lazy">' +
          '<span class="badge">' + esc(pick(s, "classification")) + "</span>" +
          '<span class="site-info">' +
            '<span class="site-name">' + name + "</span>" +
            '<span class="site-city">' + Hayyak.icon("pin") + esc(pick(s, "city")) + "</span>" +
          "</span>" +
        "</a>"
      );
    }).join("");
    const dir = lang() === "ar" ? "rtl" : "ltr";
    document.getElementById("featured").innerHTML =
      '<div class="marquee-track">' +
        '<div class="marquee-set" dir="' + dir + '">' + cards + "</div>" +
        '<div class="marquee-set" dir="' + dir + '" aria-hidden="true">' + cards.replace(/<a /g, '<a tabindex="-1" ') + "</div>" +
      "</div>";
  }


  function renderCities() {
    document.getElementById("city-list").innerHTML = group("city").map(function (g) {
      const cover = byId(CITY_COVER[g.en]) || g.sites[0];
      const name = esc(lang() === "ar" ? g.ar : g.en);
      return '<a class="city-card" href="sites.html?city=' + encodeURIComponent(g.en) + '">' +
        '<img src="' + photo(cover) + '" alt="' + name + '" loading="lazy">' +
        '<span class="city-info"><span class="city-name">' + name + "</span>" +
        '<span class="city-count">' + countLabel(g.n) + "</span></span></a>";
    }).join("");
  }

  function renderCta() {
    const user = Hayyak.getUser();
    const btn = document.getElementById("cta-btn");
    if (!user) return;
    if (user.role === "tourist") {
      btn.href = "upcoming.html";
      btn.setAttribute("data-i18n", "cta_btn_in");
      btn.textContent = Hayyak.t("cta_btn_in");
    } else {
      btn.style.display = "none";   // admins don't need the sign-up button
    }
  }

  function renderAll() {
    renderCta();
    renderFeatured();
    renderCities();
  }

  /* Search: sends the text to the Heritage Sites page */
  document.getElementById("search-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const q = document.getElementById("q").value.trim();
    window.location.href = "sites.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  });

  renderAll();
  document.addEventListener("hayyak:lang", renderAll);
})();
