// Inner pages: language switch, header tone, mobile menu, brush underlines, screenshot gallery, copy buttons.
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const root = document.documentElement;
  const year = $("#year"); if (year) year.textContent = new Date().getFullYear();

  /* ---------- language ---------- */
  const titles = { en: document.title, ru: document.body.dataset.titleRu || document.title };
  const descMeta = $('meta[name="description"]');
  const descs = { en: descMeta ? descMeta.content : "", ru: document.body.dataset.descRu || "" };
  let lang = root.dataset.lang === "ru" ? "ru" : "en";
  function applyLang() {
    root.dataset.lang = lang; root.lang = lang;
    document.title = titles[lang];
    if (descMeta && descs[lang]) descMeta.content = descs[lang];
    $$(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    $$("img[data-ru]").forEach(img => {
      if (!img.dataset.en) img.dataset.en = img.getAttribute("src");
      const want = img.dataset[lang]; if (want && img.getAttribute("src") !== want) img.src = want;
    });
    $$("[data-alt-ru]").forEach(el => {
      if (!el.dataset.altEn) el.dataset.altEn = el.getAttribute("alt") || "";
      el.setAttribute("alt", lang === "ru" ? el.dataset.altRu : el.dataset.altEn);
    });
    $$("[data-label-ru]").forEach(el => {
      if (!el.dataset.labelEn) el.dataset.labelEn = el.getAttribute("aria-label") || "";
      el.setAttribute("aria-label", lang === "ru" ? el.dataset.labelRu : el.dataset.labelEn);
    });
    $$('a[href="/"][data-home]').forEach(a => a.setAttribute("href", lang === "ru" ? "/ru" : "/"));
    document.dispatchEvent(new CustomEvent("qg:lang", { detail: lang }));
  }
  $$(".lang button").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang; store.set("qg-lang", lang); applyLang();
  }));
  applyLang();

  /* ---------- header ---------- */
  const header = $(".site-header");
  const toned = $$("[data-tone]").filter(el => el !== header);
  function updateHeader() {
    header.classList.toggle("is-scrolled", scrollY > 30);
    const y = 32;
    for (const el of toned) {
      const r = el.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { header.dataset.tone = el.dataset.tone; break; }
    }
  }
  let ticking = false;
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; updateHeader(); }); } }, { passive: true });
  updateHeader();
  const nav = $(".nav"), menuBtn = $(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => { const o = !nav.classList.contains("is-open"); nav.classList.toggle("is-open", o); menuBtn.setAttribute("aria-expanded", String(o)); });
    $$(".nav-links a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); }));
  }

  /* ---------- brush underlines draw in ---------- */
  const brushIO = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); brushIO.unobserve(e.target); } }), { threshold: .6 });
  $$(".brush-u").forEach(el => brushIO.observe(el));

  /* ---------- copy buttons ---------- */
  $$("[data-copy]").forEach(btn => btn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(btn.dataset.copy); } catch (e) { return; }
    const spans = $$("span", btn); const old = spans.map(s => s.textContent);
    spans.forEach(s => { s.textContent = s.lang === "ru" ? "Скопировано" : "Copied"; });
    setTimeout(() => spans.forEach((s, i) => { s.textContent = old[i]; }), 1600);
  }));

  /* ---------- screenshot strip + lightbox ---------- */
  const strip = $("#shots");
  if (strip) {
    const items = $$(".shot", strip), total = items.length;
    const cur = $("#shotsCur"), bar = $("#shotsBar"), prev = $("#shotsPrev"), next = $("#shotsNext");
    const pad = (n) => String(n).padStart(2, "0");
    let idx = 0;
    function current() {
      const left = strip.getBoundingClientRect().left + parseFloat(getComputedStyle(strip).scrollPaddingLeft || 0);
      let best = 0, bestD = Infinity;
      items.forEach((it, i) => { const d = Math.abs(it.getBoundingClientRect().left - left); if (d < bestD) { bestD = d; best = i; } });
      return best;
    }
    function sync() {
      idx = current();
      const atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4;
      if (atEnd) idx = Math.max(idx, total - 1 - Math.max(0, Math.floor(strip.clientWidth / items[0].offsetWidth) - 1));
      cur.textContent = pad(idx + 1);
      bar.style.width = (100 / total) + "%";
      bar.style.transform = `translateX(${idx * 100}%)`;
      prev.disabled = strip.scrollLeft <= 4;
      next.disabled = atEnd;
    }
    let pending = null, pendingT = 0;
    const go = (i) => {
      i = Math.max(0, Math.min(total - 1, i)); pending = i; clearTimeout(pendingT); pendingT = setTimeout(() => { pending = null; }, 700);
      strip.scrollTo({ left: items[i].offsetLeft - parseFloat(getComputedStyle(strip).scrollPaddingLeft || 0), behavior: "smooth" });
    };
    prev.addEventListener("click", () => go((pending ?? idx) - 1));
    next.addEventListener("click", () => go((pending ?? idx) + 1));
    let st = 0; strip.addEventListener("scroll", () => { cancelAnimationFrame(st); st = requestAnimationFrame(sync); }, { passive: true });
    addEventListener("resize", sync);
    sync();

    const lb = $("#lightbox");
    if (lb && typeof lb.showModal === "function") {
      const lbImg = $("img", lb), lbN = $(".lb-n", lb), lbT = $(".lb-t", lb);
      let open = 0;
      function show(i) {
        open = (i + total) % total;
        const src = $("img", items[open]);
        lbImg.src = src.currentSrc || src.src; lbImg.alt = src.alt;
        lbN.textContent = pad(open + 1) + " / " + pad(total);
        const caps = $$(".cap [lang]", items[open]).filter(s => s.lang === lang);
        lbT.textContent = caps.length ? caps[0].textContent : src.alt;
      }
      items.forEach((it, i) => $("button", it).addEventListener("click", () => { show(i); lb.showModal(); }));
      $(".lb-prev", lb).addEventListener("click", () => show(open - 1));
      $(".lb-next", lb).addEventListener("click", () => show(open + 1));
      $(".lb-close", lb).addEventListener("click", () => lb.close());
      lb.addEventListener("click", (e) => { if (e.target === lb || e.target.tagName === "FIGURE") lb.close(); });
      lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(open - 1); if (e.key === "ArrowRight") show(open + 1); });
      let sx = null;
      lb.addEventListener("pointerdown", (e) => { sx = e.clientX; });
      lb.addEventListener("pointerup", (e) => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) show(open + (dx < 0 ? 1 : -1)); });
      lb.addEventListener("close", () => go(open));
      document.addEventListener("qg:lang", () => { if (lb.open) show(open); });
    }
  }

  /* ---------- trailer: pause when it scrolls away ---------- */
  const video = $("#trailerVideo");
  if (video) new IntersectionObserver((es) => { if (!es[0].isIntersecting && !video.paused) video.pause(); }, { threshold: .2 }).observe(video);

})();
