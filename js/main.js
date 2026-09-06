(function () {
  "use strict";

  var ICONS = {
    wifi: '<path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/>',
    pool: '<path d="M3 17c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0"/><path d="M3 21c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 4.5 0 3 1.5 4.5 0" opacity=".5"/><path d="M7 13V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v7"/>',
    balcony: '<path d="M4 21V9l8-6 8 6v12"/><path d="M4 21h16M8 21v-6h8v6"/>',
    kitchen: '<path d="M4 3v18M4 8h5M4 3h16v18H9V3"/><circle cx="16" cy="13" r="3"/>',
    parking: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9"/>',
    pets: '<circle cx="7" cy="9" r="2"/><circle cx="17" cy="9" r="2"/><circle cx="4" cy="14" r="1.6"/><circle cx="20" cy="14" r="1.6"/><path d="M12 12c-3 0-5.5 2.2-5.5 4.6 0 1.9 1.7 2.9 3.4 2.1.7-.3 1.4-.5 2.1-.5s1.4.2 2.1.5c1.7.8 3.4-.2 3.4-2.1C17.5 14.2 15 12 12 12Z"/>',
    checkin: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5"/><path d="m9.5 14 2 2 3.5-4"/>',
    tv: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    view: '<circle cx="12" cy="12" r="9"/><path d="M3 13c2-2 4.5-2 6.5 0s4.5 2 6.5 0 3.5-2 5-1"/>',
    coffee: '<path d="M4 9h13a3 3 0 0 1 0 6h-1"/><path d="M4 9v6a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V9"/><path d="M7 5c0 1-1 1-1 2M11 5c0 1-1 1-1 2"/>',
    beach: '<path d="M4 21c4-6 12-6 16 0"/><path d="M12 21V9"/><path d="M12 9c0-3.5-2-5-2-5s4 .5 6 4"/>',
    elevator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 9l3-3 3 3M9 15l3 3 3-3"/>'
  };

  function iconSvg(key) {
    var p = ICONS[key] || ICONS.view;
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }

  var STORAGE_LANG = "ns_lang";
  var supported = ["en", "pt", "fr", "es"];
  var current = "pt";

  function detectLang() {
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    if (supported.indexOf(nav) !== -1) return nav;
    return "en";
  }

  function setText(el, val) {
    el.innerHTML = val;
  }

  function renderAmenities(dict) {
    var grid = document.getElementById("amenitiesGrid");
    grid.innerHTML = "";
    dict.amenities.items.forEach(function (item) {
      var card = document.createElement("div");
      card.className = "amenity-card";
      card.innerHTML = '<span class="amenity-icon">' + iconSvg(item.icon) + "</span><span>" + item.label + "</span>";
      grid.appendChild(card);
    });
  }

  function renderNearby(dict) {
    var list = document.getElementById("nearbyList");
    list.innerHTML = "";
    dict.location.nearby.forEach(function (text) {
      var li = document.createElement("li");
      li.textContent = text;
      list.appendChild(li);
    });
  }

  function renderReviews(dict) {
    var grid = document.getElementById("reviewsGrid");
    grid.innerHTML = "";
    dict.reviews.items.forEach(function (r) {
      var card = document.createElement("figure");
      card.className = "review-card";
      card.innerHTML =
        '<div class="review-stars" aria-hidden="true">★★★★★</div><blockquote>“' +
        r.quote +
        '”</blockquote><figcaption>' +
        r.author +
        "</figcaption>";
      grid.appendChild(card);
    });
  }

  function applyLang(lang) {
    if (supported.indexOf(lang) === -1) lang = "en";
    current = lang;
    var dict = window.I18N[lang];
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var path = el.getAttribute("data-i18n").split(".");
      var val = dict;
      for (var i = 0; i < path.length; i++) {
        val = val && val[path[i]];
      }
      if (typeof val === "string") setText(el, val);
    });

    renderAmenities(dict);
    renderNearby(dict);
    renderReviews(dict);

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    try {
      window.__ns_lang = lang;
    } catch (e) {}
  }

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(btn.getAttribute("data-lang"));
      var mobileNav = document.querySelector(".mobile-nav");
      if (mobileNav) mobileNav.classList.remove("open");
    });
  });

  applyLang(detectLang());

  /* Theme toggle */
  (function () {
    var t = document.querySelector("[data-theme-toggle]"),
      r = document.documentElement;
    var d = matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
    r.setAttribute("data-theme", d);
    if (t) {
      t.addEventListener("click", function () {
        d = d === "dark" ? "light" : "dark";
        r.setAttribute("data-theme", d);
        t.setAttribute("aria-label", "Switch to " + (d === "dark" ? "light" : "dark") + " mode");
        t.innerHTML =
          d === "dark"
            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      });
    }
  })();

  /* Mobile nav */
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.classList.toggle("open", open);
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.classList.remove("open");
      });
    });
  }

  /* Header scroll behavior */
  (function () {
    var header = document.querySelector(".site-header");
    var lastY = window.scrollY;
    window.addEventListener(
      "scroll",
      function () {
        var y = window.scrollY;
        header.classList.toggle("scrolled", y > 10);
        if (y > lastY && y > 140) header.classList.add("hidden");
        else header.classList.remove("hidden");
        lastY = y;
      },
      { passive: true }
    );
  })();

  /* Lightbox for gallery */
  (function () {
    var lightbox = document.getElementById("lightbox");
    var lightboxImg = document.getElementById("lightboxImg");
    if (!lightbox) return;
    document.querySelectorAll(".g-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var full = btn.getAttribute("data-full");
        var altText = btn.querySelector("img").getAttribute("alt");
        lightboxImg.setAttribute("src", full);
        lightboxImg.setAttribute("alt", altText);
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
      });
    });
    function close() {
      lightbox.hidden = true;
      document.body.style.overflow = "";
    }
    lightbox.querySelector(".lightbox-close").addEventListener("click", close);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  })();
})();
