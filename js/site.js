(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  $("#year").textContent = new Date().getFullYear();

  /* ================= i18n ================= */
  const T = {
    "nav.games": ["Games", "Игры"],
    "nav.play": ["Play", "Играть"],
    "nav.studio": ["Studio", "Студия"],
    "nav.contact": ["Write to us", "Написать нам"],
    "hero.sub": ["Indie games for mobile & PC", "Инди-игры для смартфонов и ПК"],
    "hero.cta": ["See the games", "Смотреть игры"],
    "hero.tag": ["<span>Small</span><span>Ideas</span><span>Big</span><span>Worlds</span>", "<span>Маленькие</span><span>Идеи</span><span>Большие</span><span>Миры</span>"],
    "hero.tagline": ["Small ideas · Big worlds", "Маленькие идеи · Большие миры"],
    "hero.now": ["Now on Google Play: The Knight and the Hamster", "Уже в Google Play: The Knight and the Hamster"],
    "m.status": ["Status", "Статус"],
    "kh.stamp": ["Out now", "Вышла"], "dd.stamp": ["In development", "В работе"], "sec.stamp": ["Sealed", "Печать"],
    "play.longer": ["Want a longer run? Play The Knight and the Hamster", "Хотите забег подольше? Сыграйте в The Knight and the Hamster"],
    "gate.skip": ["Skip intro", "Пропустить"],
    "games.title": ["Three games.\nOne under seal.", "Три игры.\nОдна под печатью."],
    "games.lead": ["One is out now, one is being forged, one is still under seal. Break it if you dare.", "Одна уже вышла, вторая куётся, третья пока под печатью. Сломайте её, если решитесь."],
    "m.genre": ["Genre", "Жанр"],
    "m.platform": ["Platform", "Платформа"],
    "m.release": ["Release", "Релиз"],
    "kh.status": ["Out now on Google Play", "Уже в Google Play"],
    "kh.genre": ["Action roguelite deckbuilder", "Экшен-рогалик и декбилдер"],
    "kh.platform": ["Android · fully offline · no forced ads", "Android · полностью офлайн · без навязчивой рекламы"],
    "kh.desc": ["Tactical card combat, a faithful hamster companion and a village you rebuild between runs. Every fifth wave brings a new boss.", "Тактические бои картами, верный хомяк-напарник и деревня, которую вы отстраиваете между забегами. На каждой пятой волне новый босс."],
    "kh.play": ["Get it on Google Play", "Скачать в Google Play"],
    "kh.page": ["Game page", "Страница игры"],
    "dd.status": ["In development", "В разработке"],
    "dd.genre": ["Pixel-art adventure", "Пиксельное приключение"],
    "dd.platform": ["PC and consoles", "ПК и консоли"],
    "dd.release": ["To be announced", "Дата будет объявлена"],
    "dd.desc": ["A retro pixel-art adventure that never plays the same way twice. In active development at Qaymaq.", "Ретро-приключение в пиксель-арте, где ничего не идёт по плану. Сейчас в активной разработке."],
    "dd.ask": ["Ask us about Doom's Day", "Спросить о Doom's Day"],
    "sec.status": ["Sealed", "Запечатано"],
    "sec.title": ["Name classified", "Название засекречено"],
    "sec.classified": ["Classified", "Засекречено"],
    "sec.release": ["When the seal breaks", "Когда треснет печать"],
    "sec.desc": ["We can't say its name yet. We can say it's coming.", "Имя пока не скажем. Но она уже в пути."],
    "sec.hold": ["Hold to break the seal", "Удерживайте, чтобы сломать печать"],
    "sec.after1": ["Ink is not the only color.", "Тушь — не единственный цвет."],
    "sec.after2": ["The next signal comes soon. Bookmark this page.", "Скоро новый сигнал. Добавьте страницу в закладки."],
    "sec.reseal": ["Seal it again", "Запечатать снова"],
    "play.title": ["Slash the falling leaves", "Рубите падающие листья"],
    "play.desc": ["The cat guards the pass. Swipe across red leaves to cut them. Three leaves on the ground and the round is over. Cut a drop of ink and it ends at once.", "Кот охраняет перевал. Проведите по красным листьям, чтобы разрубить их. Три листа на земле, и раунд окончен. Разрубите каплю туши, и он закончится сразу."],
    "play.score": ["Score", "Счёт"],
    "play.best": ["Best", "Рекорд"],
    "play.lives": ["Lives", "Жизни"],
    "play.sound": ["Sound", "Звук"],
    "play.ready": ["Ready, ronin?", "Готовы, ронин?"],
    "play.hint": ["Swipe or drag across the leaves. Leave the ink alone.", "Проводите по листьям пальцем или мышью. Тушь не трогайте."],
    "play.start": ["Start", "Начать"],
    "play.again": ["Play again", "Ещё раунд"],
    "play.over": ["Round over", "Раунд окончен"],
    "play.inked": ["You cut the ink", "Вы разрубили тушь"],
    "play.newbest": ["New best. The cat approves.", "Новый рекорд. Кот одобряет."],
    "play.tryagain": ["The leaves won this one.", "В этот раз победили листья."],
    "studio.title": ["How we make games", "Как мы делаем игры"],
    "studio.lead": ["We make bright, readable games by hand. Cozy, chaotic, mysterious or funny, each one starts with a clear feeling of who the player wants to be.", "Мы делаем яркие и понятные игры вручную и с душой. Уютные, хаотичные, загадочные или смешные, каждая начинается с ясного ощущения, кем игрок хочет себя почувствовать."],
    "s1.t": ["Idea", "Идея"],
    "s1.d": ["Find the fantasy, the mood and the visual hook.", "Найти фантазию, настроение и визуальный крючок."],
    "s2.t": ["Prototype", "Прототип"],
    "s2.d": ["Make the core interaction playable, fast.", "Быстро сделать основное действие играбельным."],
    "s3.t": ["Playtest", "Плейтест"],
    "s3.d": ["Watch players discover what works.", "Смотреть, что игроки находят сами."],
    "s4.t": ["Polish", "Полировка"],
    "s4.d": ["Refine feedback, feel, flow and charm.", "Довести до ума отклик, ощущения, ритм и обаяние."],
    "studio.place": ["Made in the Samarkand Region, Uzbekistan", "Сделано в Самаркандской области, Узбекистан"],
    "contact.title": ["Write to the studio", "Напишите нам"],
    "contact.lead": ["Publishing, partnerships, press, or a game you want to make together.", "Издание, партнёрство, пресса или игра, которую хочется сделать вместе."],
    "contact.biz": ["Partnerships and publishing", "Сотрудничество и издание"],
    "contact.players": ["Player support and data requests", "Поддержка игроков и запросы о данных"],
    "contact.phone": ["Phone", "Телефон"],
    "copy": ["Copy", "Копировать"],
    "copied": ["Copied", "Скопировано"],
    "f.privacy": ["Privacy Policy", "Политика конфиденциальности"],
    "f.terms": ["Terms of Service", "Условия использования"],
    "f.place": ["Samarkand Region, Uzbekistan", "Самаркандская область, Узбекистан"],
    "marquee": ["The Knight and the Hamster|Doom's Day|Sealed project|Samarkand", "The Knight and the Hamster|Doom's Day|Проект под печатью|Самарканд"],
  };
  let lang = store.get("qg-lang") || ((navigator.language || "en").toLowerCase().startsWith("ru") ? "ru" : "en");
  const t = (k) => (T[k] ? T[k][lang === "ru" ? 1 : 0] : k);
  const GLYPHS = "QAYMKXZRSTЖЯФШЮДЛБ";
  function scramble(el, to) {
    if (reduce) { el.textContent = to; return; }
    const block = el.closest("h2, h3") || el; const from = el.textContent;
    el.textContent = to; const hTo = block.offsetHeight; el.textContent = from; const hFrom = block.offsetHeight;
    block.style.minHeight = Math.max(hTo, hFrom) + "px";
    const len = Math.max(from.length, to.length), start = performance.now(), dur = 560; let lastTick = 0;
    (function step(now) {
      const p = clamp((now - start) / dur, 0, 1);
      if (p < 1 && now - lastTick < 40) { requestAnimationFrame(step); return; }
      lastTick = now; let out = "";
      for (let i = 0; i < len; i++) { const ch = to[i]; if (ch === undefined) continue; out += (p > (i / len) * .7 + .3 || ch === " " || ch === "\n") ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]; }
      el.textContent = out;
      if (p < 1) requestAnimationFrame(step); else { el.textContent = to; block.style.minHeight = ""; }
    })(start);
  }
  function applyLang(animate) {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(el => {
      const v = t(el.dataset.i18n);
      if (el.textContent === v) return;
      if (animate && el.closest("h2, h3")) scramble(el, v); else el.textContent = v;
    });
    $$("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    buildMarquee();
    if (typeof showShots === "function" && phoneEls && phoneEls.length) showShots(true);
    if (window.__dojoLang) window.__dojoLang();
  }
  $$(".lang button").forEach(b => b.addEventListener("click", () => {
    if (b.dataset.lang === lang) return;
    lang = b.dataset.lang; store.set("qg-lang", lang); applyLang(true);
  }));

  /* ================= marquee ================= */
  const mq = $("#marquee");
  function buildMarquee() {
    const parts = t("marquee").split("|");
    const item = () => {
      const d = document.createElement("div"); d.className = "marquee-item";
      parts.forEach((p, i) => {
        const s = document.createElement("span"); s.textContent = p; d.appendChild(s);
        const sep = document.createElement("span"); sep.className = i === 1 ? "k" : "sep"; if (i === 1) sep.textContent = "猫"; d.appendChild(sep);
      });
      return d;
    };
    mq.innerHTML = ""; for (let i = 0; i < 4; i++) mq.appendChild(item());
    mqW = mq.firstElementChild.offsetWidth || 1;
  }
  let mqX = 0, lastY = scrollY, vel = 0, mqDir = 1, mqW = 1, lastT = performance.now();
  function tickMarquee(now) {
    const dt = Math.min((now - lastT) / 1000, .05); lastT = now;
    const dy = scrollY - lastY; lastY = scrollY; vel = lerp(vel, dy, .1);
    if (!mqOn || reduce) return;
    const w = mqW;
    mqDir = lerp(mqDir, vel < -0.5 ? -1 : 1, .06);
    mqX -= (40 + Math.min(Math.abs(vel) * 14, 200)) * dt * mqDir;
    if (mqX <= -w) mqX += w; if (mqX > 0) mqX -= w;
    mq.style.transform = `translate3d(${mqX}px,0,0)`;
  }

  /* ================= header ================= */
  const header = $(".site-header");
  const toneSections = [[".hero", "paper"], [".marquee", "night"], [".games", "night"], [".play", "paper"], [".studio", "paper"], [".contact", "shu"], [".site-footer", "night"]];
  function updateHeader() {
    header.classList.toggle("is-scrolled", scrollY > 30);
    const y = 32;
    for (const [sel, tone] of toneSections) {
      const r = $(sel).getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { header.dataset.tone = tone; break; }
    }
  }
  const nav = $(".nav"), menuBtn = $(".menu-btn");
  menuBtn.addEventListener("click", () => { const o = !nav.classList.contains("is-open"); nav.classList.toggle("is-open", o); menuBtn.setAttribute("aria-expanded", String(o)); });
  $$(".nav-links a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); }));

  /* ================= sun (painted) ================= */
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const sun = $("#sun");
  let sunAnim = 0, sunCache = null;
  function paintSun(progressive) {
    const box = sun.parentElement.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const S = Math.max(200, Math.round(box.width * dpr));
    if (sun.width !== S) { sun.width = S; sun.height = S; }
    const fresh = !sunCache || sunCache.width !== S;
    const off = fresh ? document.createElement("canvas") : sunCache; if (fresh) { off.width = off.height = S; sunCache = off; }
    const o = off.getContext("2d"); const R = S * .4, cx = S / 2, cy = S / 2; const r = rng(42);
    if (fresh) {
    // smooth, noise-displaced rim
    const N = 360, ph = [r() * 6, r() * 6, r() * 6];
    o.beginPath();
    for (let i = 0; i <= N; i++) {
      const a = i / N * Math.PI * 2;
      const rr = R * (1 + Math.sin(a * 3 + ph[0]) * .012 + Math.sin(a * 7 + ph[1]) * .008 + Math.sin(a * 17 + ph[2]) * .004);
      i ? o.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : o.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
    }
    o.closePath();
    const g = o.createRadialGradient(cx - R * .25, cy - R * .3, R * .1, cx, cy, R * 1.02);
    g.addColorStop(0, "#de2b33"); g.addColorStop(.7, "#d2202a"); g.addColorStop(1, "#c01922");
    o.fillStyle = g; o.fill();
    // horizontal brush texture, clipped to the disc
    o.save(); o.clip(); o.lineCap = "round";
    for (let i = 0; i < 1600; i++) {
      const x = cx + (r() * 2 - 1) * R, y = cy + (r() * 2 - 1) * R, dark = r() < .55, len = R * (.06 + r() * .3), th = (r() - .5) * .16;
      o.globalAlpha = dark ? .04 + r() * .09 : .03 + r() * .07; o.strokeStyle = dark ? "#8f0d16" : "#f2565c"; o.lineWidth = S * (.002 + r() * .008);
      o.beginPath(); o.moveTo(x - Math.cos(th) * len / 2, y - Math.sin(th) * len / 2); o.lineTo(x + Math.cos(th) * len / 2, y + Math.sin(th) * len / 2); o.stroke();
    }
    o.restore();
    // dry-brush rim on the left side, like the key art
    o.lineCap = "round";
    for (let i = 0; i < 480; i++) {
      const a = Math.PI * (.5 + r() * 1.2), rr = R * (1.01 + Math.pow(r(), 1.7) * .19);
      o.globalAlpha = .28 + r() * .5; o.strokeStyle = "#d21f28"; o.lineWidth = S * (.001 + r() * .004);
      o.beginPath(); o.arc(cx, cy, rr, a, a + .04 + r() * .3); o.stroke();
    }
    o.globalAlpha = 1;
    }
    const c = sun.getContext("2d");
    cancelAnimationFrame(sunAnim);
    if (!progressive || reduce) { c.clearRect(0, 0, S, S); c.drawImage(off, 0, 0); dispatchEvent(new Event("qg:sun")); return; }
    const t0 = performance.now(), dur = 1300, start = -Math.PI * .6;
    (function step(now) {
      const k = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3);
      c.clearRect(0, 0, S, S); c.save(); c.beginPath();
      const rad = R * 1.25 * e;
      for (let i = 0; i <= 240; i++) { const a = i / 240 * Math.PI * 2, rr = rad * (1 + (Math.sin(a * 5 + start) * .05 + Math.sin(a * 11 - start * 2) * .03) * (1 - e)); i ? c.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr) : c.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
      c.closePath(); c.clip(); c.globalAlpha = Math.min(1, .35 + e);
      c.drawImage(off, 0, 0); c.restore(); c.globalAlpha = 1;
      if (k < 1) sunAnim = requestAnimationFrame(step); else { c.clearRect(0, 0, S, S); c.drawImage(off, 0, 0); dispatchEvent(new Event("qg:sun")); }
    })(t0);
  }

  /* ================= leaves ================= */
  const lc = $("#leaves"), lx = lc.getContext("2d");
  let LW = 0, LH = 0, leaves = [], pointer = { x: -999, y: -999, vx: 0, vy: 0 }, leavesOn = true;
  function sizeLeaves() {
    const dpr = Math.min(devicePixelRatio || 1, 2); const b = lc.getBoundingClientRect();
    const oldW = LW, oldH = LH;
    LW = b.width; LH = b.height; lc.width = LW * dpr; lc.height = LH * dpr; lx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = reduce ? 10 : Math.round(clamp(LW / 62, 10, 24));
    if (leaves.length && oldW) { for (const l of leaves) { l.x *= LW / oldW; l.y *= LH / (oldH || LH); } while (leaves.length < n) leaves.push(newLeaf(true)); leaves.length = n; }
    else leaves = Array.from({ length: n }, (_, i) => newLeaf(true, i));
  }
  function newLeaf(anywhere, i = 0) {
    const ink = Math.random() < .22;
    return { x: Math.random() * LW, y: anywhere ? Math.random() * LH : -20, vx: 0, vy: 0, s: 6 + Math.random() * 9, rot: Math.random() * 6.28, vr: (Math.random() - .5) * .04, ph: Math.random() * 6.28, sp: .35 + Math.random() * .55, ink };
  }
  function leafPath(c, s) { c.beginPath(); c.moveTo(-s, 0); c.quadraticCurveTo(-s * .2, -s * .42, s, 0); c.quadraticCurveTo(-s * .2, s * .42, -s, 0); c.fill(); }
  let wind = 0;
  function tickLeaves(time) {
    if (!leavesOn) return;
    lx.clearRect(0, 0, LW, LH);
    wind = lerp(wind, clamp(vel * .08, -2, 2), .05);
    for (const l of leaves) {
      const dx = l.x - pointer.x, dy = l.y - pointer.y, d2 = dx * dx + dy * dy;
      if (d2 < 120 * 120) { const d = Math.sqrt(d2) || 1, f = (1 - d / 120) * 1.6; l.vx += dx / d * f + pointer.vx * .02; l.vy += dy / d * f + pointer.vy * .02; l.vr += (Math.random() - .5) * .02; }
      l.vx *= .94; l.vy *= .94;
      l.x += Math.sin(time * .0011 + l.ph) * .7 + .35 + wind + l.vx;
      l.y += l.sp + l.vy;
      l.rot += l.vr + Math.sin(time * .002 + l.ph) * .01;
      if (l.y > LH + 20 || l.x > LW + 30 || l.x < -30) Object.assign(l, newLeaf(false), { x: Math.random() * LW * 1.1 - LW * .1 });
      lx.save(); lx.translate(l.x, l.y); lx.rotate(l.rot);
      lx.fillStyle = l.ink ? "rgba(20,19,18,.85)" : "#cf1f28"; leafPath(lx, l.s);
      lx.restore();
    }
  }

  /* ================= hero parallax ================= */
  const hero = $(".hero"), layers = $$("[data-depth]", hero), heroCenter = $(".hero-center"), pupil = $(".hero-mark .m-pupil"), heroMark = $(".hero-mark");
  let px = 0, py = 0, tx = 0, ty = 0;
  hero.addEventListener("pointermove", (e) => {
    if (reduce) return;
    const b = hero.getBoundingClientRect();
    tx = (e.clientX - b.left) / b.width - .5; ty = (e.clientY - b.top) / b.height - .5;
    pointer.vx = e.clientX - b.left - pointer.x; pointer.vy = e.clientY - b.top - pointer.y;
    pointer.x = e.clientX - b.left; pointer.y = e.clientY - b.top;
    if (pupil) {
      const m = heroMark.getBoundingClientRect(); const ex = m.left + m.width * .373, ey = m.top + m.height * .579;
      const ang = Math.atan2(e.clientY - ey, e.clientX - ex), dist = Math.min(Math.hypot(e.clientX - ex, e.clientY - ey) / 40, 9);
      pupil.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist * .7}px)`;
    }
  });
  function originFromBox(el) { try { const b = el.getBBox(); el.style.transformOrigin = `${(b.x + b.width / 2).toFixed(1)}px ${(b.y + b.height / 2).toFixed(1)}px`; } catch (e) {} }
  $$(".hero-mark .m-spin, .hero-mark .m-swirl").forEach(originFromBox);
  const spinG = $(".hero-mark .m-spin");
  if (spinG && !reduce) {
    heroMark.addEventListener("pointerenter", () => { if (!spinG.classList.contains("is-spinning")) spinG.classList.add("is-spinning"); });
    spinG.addEventListener("animationend", () => spinG.classList.remove("is-spinning"));
  }
  hero.addEventListener("pointerleave", () => { tx = ty = 0; pointer.x = pointer.y = -999; if (pupil) pupil.style.transform = ""; });
  function tickHero() {
    if (reduce || !heroOn) return;
    px = lerp(px, tx, .06); py = lerp(py, ty, .06);
    const sy = Math.min(scrollY, innerHeight * 1.2);
    for (const el of layers) {
      const d = +el.dataset.depth;
      el.style.transform = `translate3d(${(-px * 26 * d).toFixed(2)}px, ${(-py * 16 * d + Math.max(0, sy * (.5 - d) * .18)).toFixed(2)}px, 0)`;
    }
    heroCenter.style.transform = `translate(-50%, calc(-50% + ${(sy * .28).toFixed(1)}px)) scale(${(1 - sy / innerHeight * .08).toFixed(4)})`;
    heroCenter.style.opacity = String(clamp(1 - sy / (innerHeight * .75), 0, 1));
  }

  /* ================= stacking panels + spotlight + tilt ================= */
  const panels = $$(".panel");
  panels.forEach(p => p.addEventListener("pointermove", (e) => { const b = p.getBoundingClientRect(); p.style.setProperty("--mx", (e.clientX - b.left) + "px"); p.style.setProperty("--my", (e.clientY - b.top) + "px"); }));
  function tickStack() {
    if (innerWidth <= 760) { panels.forEach(p => { p.style.transform = ""; p.style.filter = ""; }); return; }
    for (let i = 0; i < panels.length - 1; i++) {
      const p = panels[i], n = panels[i + 1];
      const pr = p.getBoundingClientRect(), nr = n.getBoundingClientRect();
      const prog = clamp(1 - (nr.top - pr.top) / (pr.height + innerHeight * .26), 0, 1);
      p.style.transform = `scale(${(1 - prog * .05).toFixed(4)})`;
      const rb = p.querySelector(".rod.bot"); if (rb) rb.style.opacity = prog > .02 ? "0" : "";
      p.style.filter = prog > 0.01 ? `brightness(${(1 - prog * .35).toFixed(3)})` : "";
    }
  }
  const cart = $("#cart");
  if (cart && fine && !reduce) {
    const w = cart.parentElement;
    w.addEventListener("pointermove", (e) => { const b = w.getBoundingClientRect(); const x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5; cart.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 18}deg) translateZ(20px)`; });
    w.addEventListener("pointerleave", () => { cart.style.transform = ""; });
  }

  /* ================= phone screenshots carousel ================= */
  const SHOTS = {
    en: ["/assets/site/kh2_en_01.webp", "/assets/site/kh2_en_02.webp", "/assets/site/kh2_en_03.webp", "/assets/site/kh2_en_04.webp", "/assets/site/kh2_en_05.webp", "/assets/site/kh2_en_06.webp", "/assets/site/kh2_en_07.webp", "/assets/site/kh2_en_08.webp"],
    ru: ["/assets/site/kh2_ru_01.webp", "/assets/site/kh2_ru_02.webp", "/assets/site/kh2_ru_03.webp", "/assets/site/kh2_ru_04.webp", "/assets/site/kh2_ru_05.webp", "/assets/site/kh2_ru_06.webp", "/assets/site/kh2_ru_07.webp", "/assets/site/kh2_ru_08.webp"]
  };
  const SHOT_ALT = { en: ["Epic boss fights", "Pick your power: legendary cards", "Block at the right moment", "Rebuild your village", "Hamsters and hats", "Master six weapons", "New quests every day", "Grow stronger every run"],
    ru: ["Эпичные битвы с боссами", "Выберите силу: легендарные карты", "Блок в нужный момент", "Отстройте деревню", "Хомяки и шляпы", "Шесть видов оружия", "Новые задания каждый день", "Сильнее с каждым забегом"] };
  const phoneEls = $$(".phone"); let shotBase = 0, phonesOn = false, phonesHover = false, shotTick = 0;
  const shotIdx = [1, 0, 2];
  function showShots(instant) {
    const set = SHOTS[lang === "ru" ? "ru" : "en"], alts = SHOT_ALT[lang === "ru" ? "ru" : "en"];
    phoneEls.forEach((ph, k) => {
      const idx = shotIdx[k] % set.length;
      if (!instant && k !== shotBase) return;
      setTimeout(() => {
        const [a, b] = ph.querySelectorAll("img"); const on = a.classList.contains("is-off") ? b : a, off = on === a ? b : a;
        if (on.src === set[idx] && !instant) return;
        off.src = set[idx]; off.alt = alts[idx]; on.alt = "";
        const swap = () => { off.classList.remove("is-off"); on.classList.add("is-off"); };
        if (off.decode) off.decode().then(swap, swap); else swap();
      }, instant ? 0 : k * 160);
    });
  }
  if (phoneEls.length) {
    new IntersectionObserver((e) => { phonesOn = e[0].isIntersecting; }, { threshold: .2 }).observe($(".phones"));
    $(".phones").addEventListener("pointerenter", () => { phonesHover = true; });
    $(".phones").addEventListener("pointerleave", () => { phonesHover = false; });
    if (!reduce) setInterval(() => {
      if (!phonesOn || phonesHover || document.hidden) return;
      const k = [1, 0, 2][shotTick % 3]; shotTick++;
      let next = (Math.max(...shotIdx) + 1) % 8; while (shotIdx.includes(next)) next = (next + 1) % 8;
      shotIdx[k] = next; shotBase = k; showShots(false);
    }, 2400);
  }

  /* ================= reveal observers ================= */
  const io = new IntersectionObserver((ents) => {
    ents.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      if (el.classList.contains("brush-u")) el.classList.add("is-in");
      if (el.hasAttribute("data-scramble") && !el.dataset.done) { el.dataset.done = "1"; scramblePixel(el, el.textContent); }
      io.unobserve(el);
    });
  }, { threshold: .4 });
  $$(".brush-u, [data-scramble]").forEach(el => io.observe(el));
  let pixelBusy = false;
  function scramblePixel(el, to) {
    if (reduce || pixelBusy) return; pixelBusy = true;
    el.style.minHeight = el.offsetHeight + "px";
    const pool = "█▓▒░▄▀■□"; const start = performance.now(); let lastTick = 0;
    (function step(now) {
      const p = clamp((now - start) / 1100, 0, 1);
      if (p < 1 && now - lastTick < 80) { requestAnimationFrame(step); return; }
      lastTick = now; let o = "";
      for (let i = 0; i < to.length; i++) o += (p * to.length > i || to[i] === " ") ? to[i] : pool[(Math.random() * pool.length) | 0];
      el.textContent = o;
      if (p < 1) requestAnimationFrame(step); else { el.textContent = to; el.style.minHeight = ""; pixelBusy = false; }
    })(start);
  }
  const ddTitle = $("#dd-title"), ddPanel = $(".p-dd"); let ddLast = 0;
  if (ddTitle && fine) ddTitle.addEventListener("pointerenter", () => { const now = performance.now(); if (now - ddLast > 6000) { ddLast = now; scramblePixel(ddTitle, "Doom's Day"); } });

  /* ================= studio trail ================= */
  const trail = $("#trail"), tip = $("#trailTip"), pathWrap = $(".path-wrap"), steps = $$(".step");
  let trailFracs = [], trailPlayed = false;
  function layoutTrail() {
    if (!trail) return;
    const wb = pathWrap.getBoundingClientRect(); const svg = trail.ownerSVGElement;
    svg.setAttribute("viewBox", `0 0 ${wb.width.toFixed(1)} ${wb.height.toFixed(1)}`);
    const pts = steps.map(st => { const r = st.querySelector(".seal").getBoundingClientRect(); return [r.left - wb.left + r.width / 2, r.top - wb.top + r.height / 2]; });
    if (!pts.length) return;
    const all = [[pts[0][0] - 40, pts[0][1] + 6], ...pts, [pts[pts.length - 1][0] + 70, pts[pts.length - 1][1] - 18]];
    let d = `M${all[0][0].toFixed(1)} ${all[0][1].toFixed(1)}`;
    for (let i = 0; i < all.length - 1; i++) {
      const p0 = all[Math.max(i - 1, 0)], p1 = all[i], p2 = all[i + 1], p3 = all[Math.min(i + 2, all.length - 1)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    trail.setAttribute("d", d);
    const total = trail.getTotalLength(); trailFracs = pts.map(q => {
      let best = 0, bd = 1e9; for (let k = 0; k <= 200; k++) { const pt = trail.getPointAtLength(total * k / 200); const dd = (pt.x - q[0]) ** 2 + (pt.y - q[1]) ** 2; if (dd < bd) { bd = dd; best = k / 200; } } return best; });
  }
  function stampAll() { steps.forEach(st => st.classList.add("is-stamped")); trail.style.strokeDashoffset = "0"; }
  function playTrail() {
    if (trailPlayed) return; trailPlayed = true;
    if (reduce || getComputedStyle(trail.ownerSVGElement).display === "none") { stampAll(); return; }
    layoutTrail();
    const total = trail.getTotalLength(), t0 = performance.now(), dur = 2000;
    (function step(now) {
      const k = clamp((now - t0) / dur, 0, 1), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      trail.style.strokeDashoffset = String(1 - e);
      const pt = trail.getPointAtLength(total * e); tip.setAttribute("cx", pt.x); tip.setAttribute("cy", pt.y); tip.style.opacity = k < 1 ? "1" : "0";
      trailFracs.forEach((f, i) => { if (e >= f - .01) steps[i].classList.add("is-stamped"); });
      if (k < 1) requestAnimationFrame(step); else stampAll();
    })(t0);
  }
  if (trail) {
    document.querySelector(".steps").classList.add("js-steps");
    layoutTrail();
    new IntersectionObserver((en, ob) => { if (en[0].isIntersecting) { playTrail(); ob.disconnect(); } }, { threshold: .45 }).observe(pathWrap);
    addEventListener("resize", () => { layoutTrail(); if (trailPlayed) trail.style.strokeDashoffset = "0"; });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutTrail);
  }
  function tickTrail() {}

  /* ================= copy buttons ================= */
  $$("[data-copy]").forEach(b => b.addEventListener("click", () => {
    const done = () => { b.textContent = t("copied"); setTimeout(() => { b.textContent = t("copy"); }, 1600); };
    const fallback = () => { const a = b.previousElementSibling; const r = document.createRange(); r.selectNodeContents(a); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
    try { navigator.clipboard.writeText(b.dataset.copy).then(done, fallback); } catch (e) { fallback(); }
  }));

  /* ================= sealed project ================= */
  const sec = $("#secret"), holdBtn = $("#hold"), prog = $("#hold .prog"), bigSeal = $("#bigSeal"), paint = $("#paint");
  let holdT0 = 0, holding = false, holdRaf = 0;
  const HOLD = 1300;
  function holdStep(now) {
    if (!holding) return;
    const p = clamp((now - holdT0) / HOLD, 0, 1);
    prog.style.strokeDashoffset = String(1 - p);
    if (p >= 1) { holding = false; bigSeal.classList.remove("is-shaking"); breakSeal(true); return; }
    holdRaf = requestAnimationFrame(holdStep);
  }
  function holdStart(e) { if (sec.classList.contains("is-broken") || holding) return; if (e && e.preventDefault) e.preventDefault(); holding = true; holdT0 = performance.now(); bigSeal.classList.add("is-shaking"); holdRaf = requestAnimationFrame(holdStep); }
  function holdEnd() { if (!holding) return; holding = false; cancelAnimationFrame(holdRaf); bigSeal.classList.remove("is-shaking"); prog.style.transition = "stroke-dashoffset .4s"; prog.style.strokeDashoffset = "1"; setTimeout(() => { prog.style.transition = ""; }, 420); }
  holdBtn.addEventListener("pointerdown", holdStart);
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev => holdBtn.addEventListener(ev, holdEnd));
  holdBtn.addEventListener("keydown", (e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) holdStart(e); });
  holdBtn.addEventListener("keyup", (e) => { if (e.key === " " || e.key === "Enter") holdEnd(); });
  holdBtn.addEventListener("contextmenu", (e) => e.preventDefault());
  function splatter(c, w, h, cx, cy, n, spread, seed) {
    const r = rng(seed); const cols = ["#18c4d6", "#ffc83a", "#18c4d6", "#ede7db"];
    return Array.from({ length: n }, (_, i) => {
      const a = r() * 6.28, d = (i === 0 ? 0 : 14 + Math.pow(r(), .7) * spread);
      const big = i < 4 || r() < .12;
      return { x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d * .82, rad: big ? 16 + r() * 34 : 2 + r() * 9, col: cols[(r() * cols.length) | 0], a, seed: r() * 1e6, drip: big && r() < .5 ? 24 + r() * 70 : 0, streak: !big && r() < .35 };
    });
  }
  function blobPath(c, x, y, rad, seed) {
    const r = rng(seed | 0), n = 16, pts = [];
    for (let k = 0; k < n; k++) { const a = k / n * 6.28, rr = rad * (.72 + r() * .5 + (r() < .18 ? .45 : 0)); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
    c.beginPath(); c.moveTo((pts[0][0] + pts[n - 1][0]) / 2, (pts[0][1] + pts[n - 1][1]) / 2);
    for (let k = 0; k < n; k++) { const p = pts[k], q = pts[(k + 1) % n]; c.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); }
    c.closePath();
  }
  function drawBlobs(c, blobs, cx, cy, e) {
    for (const bl of blobs) {
      const x = lerp(cx, bl.x, e), y = lerp(cy, bl.y, e), rad = bl.rad * Math.min(1, e * 1.4);
      c.fillStyle = bl.col;
      if (bl.streak) {
        c.globalAlpha = .85; c.beginPath(); const tx = x - Math.cos(bl.a) * rad * 5 * e, ty = y - Math.sin(bl.a) * rad * 5 * e;
        c.moveTo(tx, ty); c.lineTo(x + Math.sin(bl.a) * rad * .5, y - Math.cos(bl.a) * rad * .5); c.lineTo(x - Math.sin(bl.a) * rad * .5, y + Math.cos(bl.a) * rad * .5); c.closePath(); c.fill();
      }
      c.globalAlpha = .18; blobPath(c, x, y, rad * 1.5, bl.seed + 7); c.fill();
      c.globalAlpha = .94; blobPath(c, x, y, rad, bl.seed); c.fill();
      if (bl.drip) {
        const L = bl.drip * e, wd = rad * .32;
        c.beginPath(); c.moveTo(x - wd, y); c.quadraticCurveTo(x - wd * .5, y + L * .6, x - wd * .55, y + L); c.arc(x, y + L, wd * .55, Math.PI, 0, true); c.quadraticCurveTo(x + wd * .5, y + L * .6, x + wd, y); c.closePath(); c.fill();
      }
    }
    c.globalAlpha = 1;
  }
  const tease = $("#tease");
  function paintTease() {
    const b = tease.getBoundingClientRect(); if (!b.width) return; const dpr = Math.min(devicePixelRatio || 1, 2);
    tease.width = b.width * dpr; tease.height = b.height * dpr; const c = tease.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let k = 0; k < 28; k++) { const r = rng(100 + k); const cx = b.width * (.04 + ((k % 7) + r()) / 7 * .92), cy = b.height * (.08 + (((k / 7) | 0) + r()) / 4 * .84); drawBlobs(c, splatter(c, b.width, b.height, cx, cy, 9, 60, 300 + k), cx, cy, 1); }
  }
  function breakSeal(animate) {
    sec.classList.add("is-broken"); store.set("qg-seal", "broken");
    const b = paint.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2);
    paint.width = b.width * dpr; paint.height = b.height * dpr; const c = paint.getContext("2d"); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = b.width / 2, cy = b.height * .38;
    const blobs = splatter(c, b.width, b.height, cx, cy, 52, Math.min(b.width, b.height) * .38, Date.now() % 9999);
    const t0 = performance.now(), dur = animate && !reduce ? 700 : 1;
    (function step(now) {
      const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
      c.clearRect(0, 0, b.width, b.height); drawBlobs(c, blobs, cx, cy, e);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  const redact = $("#redact"), ghost = redact && redact.querySelector(".ghost");
  if (ghost && !reduce) {
    const abc = "ABDEFGHKLMNORSTUVWXYZ";
    const word = (n) => Array.from({ length: n }, () => abc[(Math.random() * abc.length) | 0]).join("");
    setInterval(() => {
      const r0 = redact.getBoundingClientRect(); if (r0.bottom < 0 || r0.top > innerHeight || sec.classList.contains("is-broken")) return;
      ghost.classList.add("fade");
      setTimeout(() => { ghost.textContent = word(4 + ((Math.random() * 3) | 0)) + " " + word(4 + ((Math.random() * 3) | 0)); ghost.classList.remove("fade"); }, 900);
    }, 3200);
  }
  $("#reseal").addEventListener("click", () => { sec.classList.remove("is-broken"); store.set("qg-seal", ""); prog.style.strokeDashoffset = "1"; const c = paint.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, paint.width, paint.height); });

  /* ================= mini-game: leaf cutter ================= */
  (function dojoGame() {
    const box = $("#dojo"), cv = $("#game"), c = cv.getContext("2d"), over = $("#over"), startBtn = $("#start");
    const scoreEl = $("#score"), bestEl = $("#best"), livesEl = $("#lives"), overTitle = $("#overTitle"), overText = $("#overText"), finalEl = $("#final"), soundBtn = $("#sound");
    let W = 0, H = 0, dpr = 1, items = [], bits = [], drops = [], trailPts = [], floats = [];
    let state = "idle", score = 0, lives = 3, best = +(store.get("qg-best") || 0), spawnT = 0, gt = 0, last = 0, visible = true, endReason = "";
    let soundOn = false, actx = null;
    bestEl.textContent = best;
    let bg = null;
    function size() {
      const b = box.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2);
      W = b.width; H = b.height; cv.width = W * dpr; cv.height = H * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0);
      bg = document.createElement("canvas"); bg.width = cv.width; bg.height = cv.height;
      const g = bg.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = "#f6f2ea"; g.fillRect(0, 0, W, H);
      const sunC = document.getElementById("sun"); const sd = Math.min(W, H) * .36;
      if (sunC && sunC.width) { g.globalCompositeOperation = "multiply"; g.drawImage(sunC, W * .8 - sd / 2, H * .22 - sd / 2, sd, sd); g.globalCompositeOperation = "source-over"; }
      const rangeI = document.querySelector(".l-range");
      if (rangeI && rangeI.complete && rangeI.naturalWidth) { const rw = W * 1.1, rh = rw * rangeI.naturalHeight / rangeI.naturalWidth; g.globalCompositeOperation = "multiply"; g.drawImage(rangeI, -W * .05, H - rh, rw, rh); g.globalCompositeOperation = "source-over"; }
      const cliff = document.querySelector(".l-cliff");
      if (cliff && cliff.complete && cliff.naturalWidth) {
        const cw = Math.min(W * .46, 360), ch = cw * cliff.naturalHeight / cliff.naturalWidth;
        const tmp = document.createElement("canvas"); tmp.width = Math.round(cw * dpr); tmp.height = Math.round(ch * dpr); const tg = tmp.getContext("2d");
        tg.fillStyle = "#fff"; tg.fillRect(0, 0, tmp.width, tmp.height); tg.drawImage(cliff, 0, 0, tmp.width, tmp.height);
        const fade = tg.createLinearGradient(tmp.width * .7, 0, tmp.width, 0); fade.addColorStop(0, "rgba(255,255,255,0)"); fade.addColorStop(1, "rgba(255,255,255,1)");
        tg.fillStyle = fade; tg.fillRect(0, 0, tmp.width, tmp.height);
        g.globalCompositeOperation = "multiply"; g.drawImage(tmp, -cw * .06, H - ch, cw, ch); g.globalCompositeOperation = "source-over";
      }
    }
    function beep(type) {
      if (!soundOn) return;
      try {
        actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        const now = actx.currentTime;
        if (type === "swish") {
          const len = .18, buf = actx.createBuffer(1, actx.sampleRate * len, actx.sampleRate), d = buf.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
          const src = actx.createBufferSource(); src.buffer = buf; const f = actx.createBiquadFilter(); f.type = "bandpass"; f.frequency.setValueAtTime(5200, now); f.frequency.exponentialRampToValueAtTime(1600, now + len);
          const g = actx.createGain(); g.gain.value = .22; src.connect(f).connect(g).connect(actx.destination); src.start();
        } else {
          const o = actx.createOscillator(), g = actx.createGain();
          o.type = type === "ink" ? "sawtooth" : "triangle";
          o.frequency.setValueAtTime(type === "ink" ? 140 : 720, now); o.frequency.exponentialRampToValueAtTime(type === "ink" ? 50 : 380, now + .16);
          g.gain.setValueAtTime(.18, now); g.gain.exponentialRampToValueAtTime(.001, now + .2); o.connect(g).connect(actx.destination); o.start(); o.stop(now + .22);
        }
      } catch (e) {}
    }
    soundBtn.addEventListener("click", () => { soundOn = !soundOn; soundBtn.setAttribute("aria-pressed", String(soundOn)); if (soundOn) beep("cut"); });
    function setLives() { $$("i", livesEl).forEach((el, i) => el.classList.toggle("lost", i >= lives)); }
    function spawn() {
      const level = Math.min(gt / 1000 / 40, 1);
      const ink = Math.random() < .12 + level * .12;
      const s = ink ? 15 + Math.random() * 6 : 15 + Math.random() * 10;
      items.push({ x: W * (.1 + Math.random() * .8), y: -30, vy: (45 + Math.random() * 40 + level * 70) * (H / 600), ph: Math.random() * 6.28, amp: 18 + Math.random() * 40, s: s * Math.max(W / 700, .75), rot: Math.random() * 6.28, vr: (Math.random() - .5) * 2, ink, x0: 0 });
      items[items.length - 1].x0 = items[items.length - 1].x;
    }
    function reset() { items = []; bits = []; drops = []; floats = []; score = 0; lives = 3; gt = 0; spawnT = 0; scoreEl.textContent = "0"; setLives(); }
    function start() { reset(); state = "play"; over.hidden = true; box.classList.add("is-playing"); last = performance.now(); }
    function end(reason) {
      state = "over"; endReason = reason; box.classList.remove("is-playing");
      const nb = score > best; if (nb) { best = score; store.set("qg-best", String(best)); bestEl.textContent = best; }
      overTitle.textContent = reason === "ink" ? t("play.inked") : t("play.over");
      finalEl.hidden = false; finalEl.textContent = score;
      overText.textContent = nb && score > 0 ? t("play.newbest") : t("play.tryagain");
      startBtn.firstElementChild.textContent = t("play.again"); over.hidden = false; $("#overLink").hidden = false;
    }
    window.__dojoLang = () => {
      if (state === "over") { overTitle.textContent = endReason === "ink" ? t("play.inked") : t("play.over"); overText.textContent = t("play.tryagain"); startBtn.firstElementChild.textContent = t("play.again"); }
    };
    startBtn.addEventListener("click", start);
    function local(e) { const b = cv.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top, time: performance.now() }; }
    let down = false;
    cv.addEventListener("pointerdown", (e) => { down = true; cv.setPointerCapture(e.pointerId); trailPts = [local(e)]; });
    cv.addEventListener("pointermove", (e) => {
      if (!down && e.pointerType !== "mouse") return;
      if (!down) return;
      const p = local(e), prev = trailPts[trailPts.length - 1]; trailPts.push(p);
      if (state === "play" && prev) slash(prev, p);
    });
    const up = () => { down = false; };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    let strokeHits = 0, lastSwish = 0;
    function segDist(px, py, a, b) { const dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy || 1; const k = clamp(((px - a.x) * dx + (py - a.y) * dy) / l2, 0, 1); return Math.hypot(px - (a.x + dx * k), py - (a.y + dy * k)); }
    function slash(a, b) {
      const sp = Math.hypot(b.x - a.x, b.y - a.y); if (sp < 4) return;
      const now = performance.now(); if (now - lastSwish > 160 && sp > 14) { beep("swish"); lastSwish = now; strokeHits = 0; }
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        if (segDist(it.x, it.y, a, b) < it.s * 1.15) {
          items.splice(i, 1);
          const ang = Math.atan2(b.y - a.y, b.x - a.x);
          if (it.ink) { beep("ink"); for (let k = 0; k < 40; k++) drops.push({ x: it.x, y: it.y, vx: (Math.random() - .5) * 600, vy: (Math.random() - .5) * 600, r: 3 + Math.random() * 14, life: 1, ink: true }); lives = 0; setLives(); state = "dying"; setTimeout(() => end("ink"), 260); return; }
          beep("cut"); strokeHits++;
          const gain = strokeHits; score += gain; scoreEl.textContent = score;
          if (strokeHits > 1) floats.push({ x: it.x, y: it.y, txt: "x" + strokeHits, life: 1 });
          for (const side of [-1, 1]) bits.push({ x: it.x, y: it.y, vx: Math.cos(ang + side * 1.57) * 90 + (b.x - a.x) * 2, vy: Math.sin(ang + side * 1.57) * 90 - 40, rot: it.rot, vr: side * 6, s: it.s, side, life: 1 });
          for (let k = 0; k < 10; k++) drops.push({ x: it.x, y: it.y, vx: (Math.random() - .5) * 260, vy: (Math.random() - .7) * 260, r: 1.5 + Math.random() * 3.5, life: 1 });
        }
      }
    }
    function drawLeaf(it, half) {
      c.save(); c.translate(it.x, it.y); c.rotate(it.rot); const s = it.s;
      if (half) { c.beginPath(); c.rect(-s * 1.2, half < 0 ? -s : 0, s * 2.4, s); c.clip(); }
      c.fillStyle = "#cf1f28"; c.beginPath(); c.moveTo(-s, 0); c.quadraticCurveTo(-s * .1, -s * .62, s * 1.1, 0); c.quadraticCurveTo(-s * .1, s * .62, -s, 0); c.fill();
      c.strokeStyle = "rgba(120,10,16,.7)"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-s * 1.25, 0); c.lineTo(s * .9, 0); c.stroke();
      c.restore();
    }
    function drawInk(it) {
      c.save(); c.translate(it.x, it.y); c.fillStyle = "#141312"; const s = it.s;
      c.beginPath(); for (let k = 0; k <= 12; k++) { const a = k / 12 * 6.28, rr = s * (1 + Math.sin(a * 3 + it.ph + gt * .004) * .12); c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * 1.08 - (Math.sin(a) < -.5 ? s * .3 : 0)); } c.fill();
      c.fillStyle = "rgba(241,237,229,.55)"; c.beginPath(); c.arc(-s * .35, -s * .3, s * .18, 0, 6.28); c.fill(); c.restore();
    }
    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible || !W) return;
      const dt = Math.min((now - last) / 1000, .05); last = now;
      c.drawImage(bg, 0, 0, W, H);
      if (state === "play") {
        gt += dt * 1000; spawnT -= dt * 1000;
        if (spawnT <= 0) { spawn(); spawnT = Math.max(900 - gt / 60, 360) * (.7 + Math.random() * .6); }
      }
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        if (state === "play") { it.y += it.vy * dt; it.x = it.x0 + Math.sin(it.y * .012 + it.ph) * it.amp; it.rot += it.vr * dt; }
        if (it.y > H + 30) { items.splice(i, 1); if (!it.ink && state === "play") { lives--; setLives(); if (lives <= 0) end("leaves"); } continue; }
        it.ink ? drawInk(it) : drawLeaf(it);
      }
      for (let i = bits.length - 1; i >= 0; i--) { const b = bits[i]; b.vy += 600 * dt; b.x += b.vx * dt; b.y += b.vy * dt; b.rot += b.vr * dt; b.life -= dt * .9; if (b.life <= 0 || b.y > H + 40) { bits.splice(i, 1); continue; } c.globalAlpha = clamp(b.life, 0, 1); drawLeaf(b, b.side); c.globalAlpha = 1; }
      for (let i = drops.length - 1; i >= 0; i--) { const d = drops[i]; d.vy += 500 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.vx *= .97; d.life -= dt * (d.ink ? .6 : 1.4); if (d.life <= 0) { drops.splice(i, 1); continue; } c.globalAlpha = clamp(d.life, 0, 1); c.fillStyle = d.ink ? "#141312" : "#b5121b"; c.beginPath(); c.arc(d.x, d.y, d.r, 0, 6.28); c.fill(); c.globalAlpha = 1; }
      for (let i = floats.length - 1; i >= 0; i--) { const f = floats[i]; f.y -= 40 * dt; f.life -= dt; if (f.life <= 0) { floats.splice(i, 1); continue; } c.globalAlpha = f.life; c.fillStyle = "#141312"; c.font = "900 34px 'Sofia Sans Extra Condensed', sans-serif"; c.fillText(f.txt, f.x + 12, f.y); c.globalAlpha = 1; }
      const cutoff = now - 180; while (trailPts.length && trailPts[0].time < cutoff) trailPts.shift();
      if (trailPts.length > 2) {
        const P = trailPts, n = P.length, L = [], R = [], Lr = [], Rr = [];
        for (let i = 0; i < n; i++) {
          const a = P[Math.max(i - 1, 0)], b = P[Math.min(i + 1, n - 1)];
          let nx = -(b.y - a.y), ny = b.x - a.x; const ln = Math.hypot(nx, ny) || 1; nx /= ln; ny /= ln;
          const k = i / (n - 1), w = 1 + Math.pow(k, .9) * 9 * (1 - Math.pow(k, 8) * .55);
          L.push([P[i].x + nx * w, P[i].y + ny * w]); R.push([P[i].x - nx * w, P[i].y - ny * w]);
          Lr.push([P[i].x + nx * w * .3, P[i].y + ny * w * .3]); Rr.push([P[i].x - nx * w * .3, P[i].y - ny * w * .3]);
        }
        const poly = (A, B, col, al) => { c.globalAlpha = al; c.fillStyle = col; c.beginPath(); c.moveTo(A[0][0], A[0][1]); for (const q of A) c.lineTo(q[0], q[1]); for (let i = B.length - 1; i >= 0; i--) c.lineTo(B[i][0], B[i][1]); c.closePath(); c.fill(); };
        poly(L, R, "#141312", .88); poly(Lr, Rr, "#cf1f28", .95);
        c.globalAlpha = .35; c.strokeStyle = "#141312"; c.lineWidth = 1;
        for (const off of [-1.4, 1.4]) { c.beginPath(); for (let i = 0; i < n; i++) { const q = L[i], z = R[i]; const x = q[0] + (z[0] - q[0]) * (.5 + off * .45), y = q[1] + (z[1] - q[1]) * (.5 + off * .45); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
        c.globalAlpha = 1;
      }
      if (state === "idle" && !reduce) { if (Math.random() < .02 && items.length < 6) spawn(); for (const it of items) { it.y += it.vy * dt * .5; it.x = it.x0 + Math.sin(it.y * .012 + it.ph) * it.amp; } }
    }
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; last = performance.now(); }, { threshold: .05 }).observe(box);
    let lastW = 0;
    addEventListener("resize", () => { const w = box.getBoundingClientRect().width; if (Math.abs(w - lastW) < 2) return; lastW = w; size(); });
    let sunT = 0; addEventListener("qg:sun", () => { clearTimeout(sunT); sunT = setTimeout(() => { size(); if (bg) c.drawImage(bg, 0, 0, W, H); }, 250); });
    size(); setLives(); requestAnimationFrame(frame);
    const paintIdle = () => { if (bg && W) c.drawImage(bg, 0, 0, W, H); };
    addEventListener("resize", paintIdle); paintIdle();
    [".l-cliff", ".l-range"].forEach(sel => { const im = document.querySelector(sel); if (im && !im.complete) im.addEventListener("load", size, { once: true }); });
  })();

  /* ================= gate (intro) ================= */
  function runGate() {
    const skipGate = reduce || store.sget("qg-gate") === "seen";
    if (skipGate) { paintSun(false); return; }
    store.sset("qg-gate", "seen");
    document.body.classList.add("gate-on", "is-locked");
    const gate = document.createElement("div"); gate.className = "gate"; gate.setAttribute("aria-hidden", "true");
    const svgFull = `<svg class="mark" viewBox="0 0 462.5 437.5" style="--eye-x:157.1px;--eye-y:191.6px;--hc-x:157.5px;--hc-y:152.2px"><g class="m-ghost"><path fill="#6f6f6f" d="M110.0 22.5 104.0 31.2 96.5 48.2 89.8 70.5 84.0 96.2 79.8 134.2 79.8 153.5 81.5 174.2 78.8 185.8 77.8 198.8 73.0 203.8 56.2 206.2 51.5 208.5 49.2 211.2 49.8 214.2 52.5 217.2 61.2 221.8 74.8 225.8 78.2 231.0 77.5 236.0 74.8 239.0 61.2 243.2 55.2 247.0 54.8 250.0 57.2 253.2 63.8 256.2 75.2 258.5 105.0 259.0 121.0 270.2 135.5 278.0 153.5 284.8 166.8 288.2 181.8 290.8 193.5 284.5 196.5 284.0 200.8 285.2 203.0 287.5 204.0 293.2 231.8 294.0 262.0 291.8 288.0 286.8 305.2 281.2 322.5 273.2 332.5 267.0 333.5 262.5 337.8 258.8 371.2 258.5 383.5 256.0 391.0 251.5 391.8 248.0 390.5 246.2 384.0 242.8 371.8 239.0 368.2 233.8 369.0 228.8 371.8 225.8 391.8 218.8 396.2 215.0 397.2 211.2 396.0 209.2 391.0 206.5 375.5 203.8 370.8 198.8 369.8 185.0 367.2 175.0 369.0 140.8 365.2 139.8 361.8 134.5 363.2 128.2 368.0 123.8 363.2 89.2 356.8 62.8 349.5 41.5 342.5 27.8 334.5 18.5 326.2 14.2 317.5 13.5 310.8 15.5 304.8 19.5 297.5 27.0 291.2 35.8 281.2 54.0 274.0 70.5 269.5 74.5 264.8 74.8 237.2 68.2 220.2 67.2 192.2 72.2 188.0 77.8 183.8 79.0 179.5 77.8 176.8 75.0 160.2 40.5 152.5 28.8 143.2 19.0 135.5 14.5 126.8 13.5 117.0 16.5Z"/></g><g class="m-swirl" fill="#ff1f3d"><path d="M79.5 144.0 68.8 155.0 57.8 167.8 48.5 180.2 42.2 190.2 36.0 202.5 32.2 212.0 29.0 223.5 27.5 232.0 26.8 239.8 26.8 251.2 28.2 263.5 28.8 248.5 29.8 241.2 31.2 234.8 35.0 225.5 38.5 220.5 40.5 218.5 40.8 218.8 36.8 236.8 35.0 248.0 34.2 256.0 34.2 267.0 34.8 271.8 38.0 286.0 43.0 301.8 48.8 315.8 55.8 329.2 61.5 338.5 69.0 348.8 77.0 358.0 87.0 367.8 95.8 375.0 106.8 382.8 116.8 388.8 127.0 394.0 140.5 399.8 152.8 404.0 168.2 408.2 180.2 410.8 197.0 413.2 210.8 414.5 221.8 415.0 240.2 414.8 228.5 412.5 214.8 409.0 185.5 399.2 185.5 398.8 194.5 399.0 216.8 397.8 228.8 398.0 199.8 391.0 177.5 384.0 160.0 377.2 141.8 368.8 124.2 358.8 108.2 347.5 93.0 334.2 80.8 321.2 81.2 321.0 96.0 330.8 109.8 338.5 126.5 346.5 141.8 352.5 159.5 358.0 176.2 361.8 189.5 363.8 204.5 365.0 222.2 365.0 236.8 363.8 251.2 361.2 263.5 358.0 275.0 353.8 279.5 351.5 272.2 353.0 264.8 353.2 257.2 352.2 248.5 349.8 248.5 349.2 259.8 349.0 274.8 346.0 293.0 340.0 311.2 332.2 285.5 336.8 265.5 338.8 252.5 339.2 239.5 339.0 222.5 337.2 211.0 334.8 207.5 333.2 217.2 330.0 223.8 327.0 206.2 329.5 196.2 330.0 185.2 329.8 175.2 328.8 165.2 327.0 155.5 324.5 145.2 321.0 137.5 317.8 127.5 312.8 119.0 307.8 105.2 298.2 92.0 287.5 95.8 296.2 102.0 307.5 101.5 307.8 93.5 304.0 86.2 299.0 80.2 293.2 74.5 285.8 70.5 278.5 67.2 269.8 66.5 266.2 67.5 266.0 79.0 271.5 75.0 267.0 68.5 257.5 65.5 257.0 59.8 255.0 57.2 253.5 54.8 250.8 54.2 249.0 54.8 247.2 57.2 245.0 62.5 242.5 60.8 232.0 61.0 221.8 53.5 218.2 50.0 215.0 49.0 213.0 49.2 210.5 51.8 208.0 57.0 205.8 64.5 204.5 65.0 204.0 67.2 198.0 71.5 189.5 78.0 179.2 81.0 175.5 81.2 171.5 79.5 154.0Z"/><path d="M429.2 204.2 424.5 197.5 421.8 194.8 417.8 192.0 420.2 194.5 421.8 196.8 426.0 206.0 425.8 206.5 423.0 202.5 419.0 198.5 413.8 194.8 407.0 191.5 400.5 189.5 393.5 188.2 388.5 187.8 378.5 187.8 391.5 192.2 400.2 196.8 407.2 202.2 409.8 205.2 411.8 209.0 415.2 222.2 415.2 233.0 414.0 237.5 411.8 242.2 408.5 246.8 404.5 250.8 397.8 255.8 392.0 259.0 383.0 263.0 373.5 266.2 362.5 269.2 350.8 271.8 337.2 274.0 323.0 275.8 336.8 279.2 344.8 280.8 352.5 281.2 357.0 280.5 357.2 281.0 352.8 284.5 346.5 287.5 340.8 289.5 324.0 293.5 304.8 296.2 284.0 297.8 262.5 297.8 274.8 300.5 285.5 302.0 300.0 303.0 314.5 303.0 333.0 301.8 353.0 299.0 373.8 294.5 384.8 291.0 385.5 291.0 387.8 293.8 390.8 295.8 394.5 297.0 398.0 297.5 401.8 297.5 407.2 296.8 415.0 294.5 418.2 293.0 422.2 290.2 426.2 286.2 430.2 280.5 434.5 270.8 436.5 263.2 437.8 255.5 438.2 250.0 438.2 238.5 437.2 229.0 434.5 216.8 432.2 210.5Z"/><path d="M421.5 48.8 403.5 46.0 386.8 46.0 379.2 47.0 371.0 49.0 366.0 50.8 359.8 53.8 354.5 57.2 351.0 60.8 354.8 61.0 361.0 62.2 367.8 65.0 372.5 69.0 374.5 72.5 375.2 76.0 374.5 82.0 372.2 87.2 367.5 94.0 361.2 100.2 354.2 105.8 346.5 110.8 337.5 115.5 326.2 120.2 315.8 123.8 303.0 127.0 288.8 129.5 280.0 130.2 296.8 129.8 309.0 128.8 316.8 127.5 324.8 125.2 329.8 123.2 341.2 117.2 352.8 110.0 364.0 101.2 367.2 99.8 370.0 99.8 375.0 100.8 378.2 102.0 380.5 104.0 381.2 105.8 381.2 109.0 379.8 112.5 375.0 118.5 367.2 124.8 358.2 129.8 349.8 132.8 356.5 131.0 363.5 128.5 377.0 121.8 385.0 116.5 392.2 110.8 403.5 99.5 410.2 91.0 414.5 84.8 418.8 77.5 421.5 70.8 422.2 67.0 422.0 62.8 420.8 60.0 418.0 57.5 413.2 55.8 408.8 55.2 401.2 55.8 397.0 56.8 396.0 56.5 399.8 53.2 405.8 50.8 413.0 49.2Z"/><path d="M284.5 32.5 268.2 30.2 255.0 29.2 233.0 29.0 221.8 29.5 205.0 31.0 190.5 33.0 173.0 36.2 159.8 39.5 163.2 45.8 174.0 44.0 182.0 43.2 183.5 43.5 178.8 46.8 173.2 49.5 167.2 51.8 185.8 50.2 212.0 49.5 239.2 49.8 257.8 50.5 248.5 48.5 240.5 45.0 237.8 42.5 237.2 41.5 237.2 40.5 238.8 38.5 242.0 36.8 245.8 35.5 255.5 33.5 268.5 32.2Z"/><path d="M81.0 115.2 76.0 118.5 68.8 124.2 57.0 135.5 46.8 147.5 34.8 163.8 43.5 155.5 55.8 145.8 69.5 136.8 79.8 131.5Z"/></g><g class="m-head"><path fill="var(--bone)" d="M110.0 22.5 104.0 31.2 96.5 48.2 89.8 70.5 84.0 96.2 79.8 134.2 79.8 153.5 81.5 174.2 78.8 185.8 77.8 198.8 73.0 203.8 56.2 206.2 51.5 208.5 49.2 211.2 49.8 214.2 52.5 217.2 61.2 221.8 74.8 225.8 78.2 231.0 77.5 236.0 74.8 239.0 61.2 243.2 55.2 247.0 54.8 250.0 57.2 253.2 63.8 256.2 75.2 258.5 105.0 259.0 121.0 270.2 135.5 278.0 153.5 284.8 166.8 288.2 181.8 290.8 193.5 284.5 196.5 284.0 200.8 285.2 203.0 287.5 204.0 293.2 231.8 294.0 262.0 291.8 288.0 286.8 305.2 281.2 322.5 273.2 332.5 267.0 333.5 262.5 337.8 258.8 371.2 258.5 383.5 256.0 391.0 251.5 391.8 248.0 390.5 246.2 384.0 242.8 371.8 239.0 368.2 233.8 369.0 228.8 371.8 225.8 391.8 218.8 396.2 215.0 397.2 211.2 396.0 209.2 391.0 206.5 375.5 203.8 370.8 198.8 369.8 185.0 367.2 175.0 369.0 140.8 365.2 139.8 361.8 134.5 363.2 128.2 368.0 123.8 363.2 89.2 356.8 62.8 349.5 41.5 342.5 27.8 334.5 18.5 326.2 14.2 317.5 13.5 310.8 15.5 304.8 19.5 297.5 27.0 291.2 35.8 281.2 54.0 274.0 70.5 269.5 74.5 264.8 74.8 237.2 68.2 220.2 67.2 192.2 72.2 188.0 77.8 183.8 79.0 179.5 77.8 176.8 75.0 160.2 40.5 152.5 28.8 143.2 19.0 135.5 14.5 126.8 13.5 117.0 16.5Z"/><path fill="#060709" fill-rule="evenodd" d="M332.8 266.5 325.0 260.5 316.5 252.2 310.8 245.2 307.0 239.5 294.8 239.8 282.0 239.0 263.2 254.5 247.2 266.2 223.8 281.8 204.0 293.2 217.0 294.0 231.8 294.0 243.8 293.5 262.0 291.8 280.8 288.5 294.2 285.0 309.0 279.8 322.5 273.2 328.0 270.0Z M369.0 140.8 365.2 144.5 360.0 150.8 351.5 162.8 351.5 163.8 353.2 167.5 354.5 174.2 354.2 185.2 352.8 192.8 350.8 199.0 345.5 210.5 339.0 220.8 332.0 229.2 326.8 234.0 320.8 237.0 325.5 243.2 331.5 249.2 343.8 259.0 365.2 259.0 376.2 257.8 385.5 255.2 389.2 253.2 391.0 251.5 391.8 250.0 391.8 248.0 390.5 246.2 384.0 242.8 373.8 239.8 359.8 237.5 363.5 230.5 365.2 226.2 376.0 224.5 386.5 221.2 391.8 218.8 394.2 217.0 396.2 215.0 397.2 212.8 397.2 211.2 396.0 209.2 394.2 208.0 390.2 206.2 381.5 204.5 370.2 204.0 370.2 188.8 369.0 181.0 367.2 175.0 367.2 170.2 368.8 155.8Z M331.2 16.2 329.2 15.2 323.8 13.8 316.0 13.8 310.2 15.8 307.0 17.8 302.8 21.2 296.5 28.2 288.5 40.2 281.2 54.0 272.8 73.5 271.0 76.0 269.8 76.2 260.2 73.2 248.0 70.2 237.2 68.2 228.2 67.2 220.2 67.2 213.0 68.0 199.5 70.5 191.2 72.8 207.5 92.8 224.8 116.0 240.5 139.0 254.2 161.2 259.2 158.2 273.0 154.2 287.0 151.5 299.0 150.2 314.0 150.2 321.5 151.0 329.8 152.5 334.5 153.8 339.8 155.8 341.0 155.8 345.8 148.5 352.5 139.8 356.0 135.8 363.2 128.8 355.8 131.5 351.2 132.8 350.2 132.5 359.2 129.0 364.0 126.5 368.0 123.8 365.2 100.8 354.2 109.2 345.5 115.0 335.5 120.8 325.5 125.2 316.8 127.8 307.0 129.2 286.5 130.5 277.5 130.5 290.5 129.0 303.0 126.8 315.8 123.5 327.5 119.5 335.2 116.2 349.8 108.5 358.2 102.5 364.5 96.8 362.0 83.5 356.2 61.5 350.8 60.8 353.2 58.0 354.8 57.0 354.8 56.2 349.5 41.5 345.0 32.0 341.5 26.2 336.2 20.0Z M123.5 14.0 119.5 15.2 113.5 19.0 109.0 23.8 104.0 31.2 100.5 38.2 96.5 48.2 92.0 62.2 88.2 76.5 84.0 96.2 81.8 110.8 80.5 122.2 79.8 134.2 79.8 153.5 81.5 174.2 79.8 180.5 78.2 189.8 78.2 204.2 67.5 204.2 59.0 205.5 55.5 206.5 52.2 208.0 50.2 209.5 49.2 211.2 49.2 213.0 50.2 215.0 52.5 217.2 58.8 220.8 65.8 223.2 71.5 224.8 83.5 226.5 85.2 230.8 88.8 237.2 88.0 237.8 82.8 238.0 72.8 239.8 62.5 242.8 56.2 246.0 54.8 247.8 54.8 250.0 55.5 251.5 59.2 254.5 63.8 256.2 70.2 257.8 84.0 259.2 99.0 259.2 105.8 258.5 111.8 263.8 121.0 270.2 127.0 273.8 140.8 280.2 158.8 286.2 174.0 289.8 181.8 290.8 202.2 279.8 224.8 266.0 247.0 250.8 257.2 243.0 265.5 236.0 259.8 232.5 256.0 228.8 254.0 225.8 252.0 221.2 248.8 210.5 247.0 200.5 246.2 191.2 246.2 183.2 247.0 176.0 246.8 174.2 242.8 166.8 232.8 150.5 218.0 128.5 204.5 109.8 190.5 91.5 176.5 74.8 169.0 57.5 162.5 44.5 158.0 36.8 150.5 26.2 143.2 19.0 136.8 15.0 131.0 13.5 126.8 13.5ZM117.0 159.5 118.2 157.8 120.5 156.0 127.5 154.2 134.0 154.2 141.8 155.8 146.0 157.5 144.5 163.8 143.2 173.5 143.2 183.2 144.5 192.2 146.8 200.0 149.8 206.2 153.0 210.8 158.0 215.0 160.5 216.2 163.2 217.0 168.0 217.0 171.8 215.5 175.8 212.0 178.0 208.8 180.8 203.0 183.2 194.5 184.8 185.5 187.0 187.8 191.8 194.2 198.8 206.0 197.2 208.2 191.0 214.5 186.0 218.5 179.0 223.0 170.0 227.0 162.0 228.8 156.2 228.8 150.0 227.2 143.5 224.2 137.2 220.0 130.0 213.0 123.5 204.0 119.2 195.2 116.8 187.2 115.2 177.5 115.5 165.2 116.2 161.2Z"/><path fill="var(--bone)" d="M164.2 167.2 170.5 172.0 170.8 182.0 170.0 195.5 169.0 201.8 167.0 205.2 165.5 204.0 164.8 202.2 162.8 189.2 162.5 176.2 163.0 170.8Z"/></g><g class="m-eye"><path fill="var(--bone)" d="M117.0 159.5 120.5 156.0 127.5 154.2 137.5 154.8 146.0 157.5 144.5 163.8 143.2 173.5 143.2 183.2 144.5 192.2 146.8 200.0 149.8 206.2 153.0 210.8 158.0 215.0 163.2 217.0 168.0 217.0 171.8 215.5 175.8 212.0 178.0 208.8 180.8 203.0 183.2 194.5 184.8 185.5 191.8 194.2 198.2 205.0 198.5 206.5 191.0 214.5 186.0 218.5 179.0 223.0 170.0 227.0 162.0 228.8 156.2 228.8 150.0 227.2 143.5 224.2 137.2 220.0 130.0 213.0 123.5 204.0 119.2 195.2 116.8 187.2 115.2 177.5 115.5 165.2Z"/><path fill="#060709" d="M164.2 167.2 170.5 172.0 170.8 182.0 170.0 195.5 169.0 201.8 167.0 205.2 165.5 204.0 164.8 202.2 162.8 189.2 162.5 176.2 163.0 170.8Z" opacity="0"/></g><g class="m-cross" stroke="#ff2f3a" stroke-width="3" stroke-linecap="round"><path d="M157.1 120.2V146.2M157.1 237.0V263.0M81.2 191.6H107.2M207.0 191.6H233.0"/></g><line class="m-slash" x1="19.2" y1="3.5" x2="295.8" y2="311.0" stroke="#ff3b3b" stroke-width="5" stroke-linecap="round" pathLength="1" style="filter:drop-shadow(0 0 6px #ff2a36)"/></svg>`;
    const half = (cls) => `<div class="gate-half ${cls}"><div class="gate-stage">${svgFull}<div class="gate-word"><span>QAY</span><span>MAQ</span></div><div class="gate-games">GAMES</div></div></div>`;
    gate.innerHTML = half("a") + half("b") +
      '<canvas class="gate-sparks"></canvas>' +
      '<div class="gate-slash"></div>' +
      `<button class="gate-skip" type="button">${t("gate.skip")}</button>`;
    { const narrow = document.documentElement.clientWidth <= 760, x1 = narrow ? .30 : .41, x2 = narrow ? .70 : .59; const sl = gate.querySelector(".gate-slash");
      const dx = (x2 - x1) * document.documentElement.clientWidth, dy = innerHeight; sl.style.left = (x1 * 100) + "%"; sl.style.width = Math.hypot(dx, dy) + "px"; sl.style.setProperty("--ang", Math.atan2(dy, dx) + "rad"); }
    document.body.appendChild(gate);
    setTimeout(() => { const keep = sunAnim; paintSun(false); const sc0 = sun.getContext("2d"); sc0.clearRect(0, 0, sun.width, sun.height); }, 600);
    $$(".m-swirl", gate).forEach(originFromBox);
    // sparks
    const sc = gate.querySelector(".gate-sparks"), sx = sc.getContext("2d"); const sd = Math.min(devicePixelRatio || 1, 2);
    const VW = document.documentElement.clientWidth, VH = sc.clientHeight || innerHeight;
    sc.width = Math.round(VW * sd); sc.height = Math.round(VH * sd); sx.setTransform(sd, 0, 0, sd, 0, 0);
    let sparks = [], sparkOn = true;
    (function sparkLoop() {
      if (!sparkOn) return; requestAnimationFrame(sparkLoop);
      sx.setTransform(1, 0, 0, 1, 0, 0); sx.clearRect(0, 0, sc.width, sc.height); sx.setTransform(sd, 0, 0, sd, 0, 0);
      for (const s of sparks) { s.x += s.vx; s.y += s.vy; s.vy -= .01; s.vx *= .985; s.life -= .006; sx.globalAlpha = Math.max(s.life, 0); sx.fillStyle = "#ff2f3a"; sx.beginPath(); sx.arc(s.x, s.y, s.r, 0, 6.28); sx.fill(); }
      sparks = sparks.filter(s => s.life > 0);
    })();
    const burst = (n) => { for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, v = 1 + Math.random() * 4, d0 = Math.min(VW, VH) * (.2 + Math.random() * .12); sparks.push({ x: VW / 2 + Math.cos(a) * d0, y: VH * .4 + Math.sin(a) * d0, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 1 + Math.random() * 2.6, life: 1 }); } };
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const add = (c) => gate.classList.add(c);
    let cutDone = false;
    function cut() {
      if (cutDone) return; cutDone = true; timers.forEach(clearTimeout);
      ["t-eye", "t-head", "t-swirl", "t-word1", "t-word2", "t-games"].forEach(add);
      add("t-cut");
      setTimeout(() => { add("is-cut"); document.body.classList.remove("gate-on", "is-locked"); }, 230);
      let gone = false;
      const finish = () => { if (gone) return; gone = true; sparkOn = false; gate.remove(); paintSun(true); };
      gate.querySelector(".gate-half.b").addEventListener("transitionend", (e) => { if (e.target === e.currentTarget && e.propertyName === "opacity") finish(); });
      setTimeout(finish, 1700);
    }
    const begin = () => {
    at(150, () => add("t-eye"));
    at(520, () => add("t-cross"));
    at(880, () => add("t-ghost"));
    at(1060, () => add("t-slash"));
    at(1180, () => { add("t-head"); burst(30); });
    at(1380, () => { add("t-swirl"); burst(50); });
    at(1800, () => { add("t-word1"); add("t-shake"); });
    at(2000, () => { add("t-word2"); gate.classList.remove("t-shake"); void gate.offsetWidth; add("t-shake"); });
    at(2250, () => add("t-games"));
    at(2900, cut);
    };
    const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    Promise.race([fontsReady, new Promise(r => setTimeout(r, 1200))]).then(() => requestAnimationFrame(() => requestAnimationFrame(begin)));
    gate.querySelector(".gate-skip").addEventListener("click", cut);
    gate.addEventListener("click", (e) => { if (e.target.closest(".gate-skip")) return; cut(); });
    addEventListener("keydown", function k(e) { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { cut(); removeEventListener("keydown", k); } });
  }

  /* ================= loop ================= */
  let heroOn = true, mqOn = false, stackOn = false, trailOn = false, lastScroll = -1;
  function loop(time) {
    tickMarquee(time);
    if (heroOn) tickHero();
    if (stackOn) tickStack();
    if (trailOn) tickTrail();
    if (scrollY !== lastScroll) { lastScroll = scrollY; updateHeader(); }
    if (!reduce && heroOn) tickLeaves(time);
    requestAnimationFrame(loop);
  }
  const vis = (el, fn) => new IntersectionObserver((e) => fn(e[0].isIntersecting), { threshold: 0 }).observe(el);
  vis(hero, (v) => { heroOn = v; leavesOn = v; });
  vis($(".marquee"), (v) => { mqOn = v; });
  vis($("#stack"), (v) => { stackOn = v; });
  vis($(".path-wrap"), (v) => { trailOn = v; });
  let lastVW = innerWidth;
  addEventListener("resize", () => { sizeLeaves(); if (Math.abs(innerWidth - lastVW) < 2) return; lastVW = innerWidth; paintSun(false); paintTease(); });

  applyLang(false);
  if (store.get("qg-seal") === "broken") requestAnimationFrame(() => breakSeal(false));
  sizeLeaves(); paintTease();
  if (reduce) { tickLeaves(0); }
  runGate();
  requestAnimationFrame(loop);
})();
