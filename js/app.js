/* ------------------------------------------------------------------
   JAWARC — app: router, page transition, header/menu, hero, gallery,
   archive filtering, lightbox, enquiry form.
   Works by simply opening index.html (hash routing, no server needed).
------------------------------------------------------------------- */
(function () {
  "use strict";

  const { $, $$, esc, pad2, cn, clamp, reduced, finePointer, Scroll, Reveal, Parallax } = window.JW;
  const V = window.JV;
  const D = window.JAWARC_DATA;
  const C = window.JAWARC_CONFIG;
  const site = D.site;

  // header + footer are persistent: render them first so every later lookup finds them
  $("#header-mount").innerHTML = V.headerHTML();
  $("#footer-mount").innerHTML = V.footerHTML();
  const view = $("#view");
  let cleanups = [];
  const onCleanup = (fn) => cleanups.push(fn);
  let current = { path: "/", query: {} };

  /* ================= routing ================= */
  function parseHash() {
    let h = location.hash || "#/";
    if (h.charAt(1) !== "/") h = "#/";
    const [p, q] = h.slice(1).split("?");
    const query = {};
    (q || "").split("&").forEach((kv) => {
      if (!kv) return;
      const [k, v] = kv.split("=");
      query[decodeURIComponent(k)] = decodeURIComponent(v || "");
    });
    let path = p.replace(/\/+$/, "") || "/";
    return { path, query };
  }

  function titleFor(t) {
    return t ? t + " — " + site.name : site.name + " — " + site.descriptor;
  }

  function render() {
    cleanups.forEach((f) => f());
    cleanups = [];
    Reveal.reset();
    Parallax.reset();
    hidePreview(true);

    const route = parseHash();
    current = route;
    const path = route.path;
    let html = "", title = "", init = null;

    if (path === "/") { html = V.homeView(); init = initHome; title = ""; }
    else if (path === "/projects") {
      const f = route.query.c;
      const valid = f && V.categoryCounts().some((c) => c.id === f);
      const state = { filter: valid ? f : "all", view: "grid" };
      html = V.projectsView(state); init = () => initArchive(state); title = "Projects";
    } else if (path.indexOf("/projects/") === 0) {
      const r = V.projectView(path.slice(10));
      html = r.html; title = r.title; init = () => { lightboxItems = r.items; };
    } else if (path === "/art") { html = V.artView(); init = initArt; title = "Art & Experiments"; }
    else if (path === "/studio") { html = V.studioView(); title = "Studio"; }
    else if (path === "/contact") { html = V.contactView(); init = initForm; title = "Contact"; }
    else { html = V.notFoundView(); title = "Page not found"; }

    view.innerHTML = html;
    document.title = titleFor(title);
    Scroll.toTop(true);
    // restart page-enter fade
    view.classList.remove("page-enter");
    void view.offsetWidth;
    view.classList.add("page-enter");

    updateHeaderRoute(path);
    barLast = 0;
    setBar("top");
    if (menuOpen) setMenu(false);

    Reveal.scan(view);
    Parallax.scan(view);
    if (init) init();
    Scroll.kick();
  }

  /* ================= page transition curtain ================= */
  const curtain = $("#curtain");
  let phase = "idle", timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const setPhase = (p) => { phase = p; curtain.setAttribute("data-phase", p); };
  const release = () => { setPhase("out"); later(() => setPhase("idle"), 900); };

  function go(href) {
    const target = href;
    const now = location.hash || "#/";
    if (target === now) return;
    const samePath = target.split("?")[0] === now.split("?")[0];
    if (reduced() || phase !== "idle" || samePath) { location.hash = target; return; }
    setPhase("in");
    later(() => { location.hash = target; }, 620);
    later(() => { if (phase === "in") release(); }, 620 + 3000);
  }

  window.addEventListener("hashchange", () => {
    if (location.hash && location.hash.charAt(1) !== "/") return;
    render();
    if (phase === "in") { clearTimers(); later(release, 90); }
  });

  /* ================= header / menu ================= */
  const header = $("#site-header");
  const panel = $("#menu-panel");
  const menuBtn = $("#menu-btn");
  let menuOpen = false, bar = "top", barLast = 0;

  function applyHeader() {
    const blend = menuOpen || bar === "top";
    header.classList.toggle("mix-blend-difference", blend);
    header.classList.toggle("bg-ink", !blend);
    const hidden = !menuOpen && bar === "hidden";
    header.classList.toggle("-translate-y-full", hidden);
    header.classList.toggle("translate-y-0", !hidden);
  }
  function setBar(b) {
    if (bar === b) return;
    bar = b;
    applyHeader();
  }
  // top: transparent + difference blend; past the hero it hides on the way down, returns solid on the way up.
  Scroll.onFrame((y) => {
    const dy = y - barLast;
    if (y < 80) setBar("top");
    else if (dy > 6 && y > 200) setBar("hidden");
    else if (dy < -6) setBar("solid");
    if (Math.abs(dy) > 6) barLast = y;
  });

  function updateHeaderRoute(path) {
    const active = (href) => path === href || path.indexOf(href + "/") === 0;
    $$("[data-nav]", header).forEach((el) => {
      const on = active(el.getAttribute("data-nav"));
      if (on) el.setAttribute("aria-current", "page"); else el.removeAttribute("aria-current");
      const dot = $("[data-dot]", el);
      dot.classList.toggle("scale-100", on);
      dot.classList.toggle("opacity-100", on);
      dot.classList.toggle("scale-0", !on);
      dot.classList.toggle("opacity-0", !on);
    });
    $$("[data-menu-link]", panel).forEach((el) => {
      const href = el.getAttribute("data-menu-link");
      const on = href === "/" ? path === "/" : active(href);
      if (on) el.setAttribute("aria-current", "page"); else el.removeAttribute("aria-current");
      const dot = $("[data-active-dot]", el);
      dot.classList.toggle("hidden", !on);
    });
  }

  function setMenu(open) {
    if (open === menuOpen) return;
    menuOpen = open;
    panel.toggleAttribute("data-open", open);
    panel.setAttribute("aria-hidden", String(!open));
    menuBtn.setAttribute("aria-expanded", String(open));
    $("[data-m1]", menuBtn).classList.toggle("-translate-y-full", open);
    $("[data-m2]", menuBtn).classList.toggle("-translate-y-full", open);
    const b1 = $("[data-b1]", menuBtn), b2 = $("[data-b2]", menuBtn);
    b1.classList.toggle("top-1/2", open); b1.classList.toggle("rotate-45", open); b1.classList.toggle("top-0", !open);
    b2.classList.toggle("top-1/2", open); b2.classList.toggle("-rotate-45", open); b2.classList.toggle("bottom-0", !open);
    applyHeader();
    if (open) Scroll.lock(); else Scroll.unlock();
  }
  menuBtn.addEventListener("click", () => setMenu(!menuOpen));
  window.matchMedia("(min-width: 64rem)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ================= global keyboard ================= */
  window.addEventListener("keydown", (e) => {
    if (lbOpen) return lbKey(e);
    if (!menuOpen) return;
    if (e.key === "Escape") { setMenu(false); menuBtn.focus(); }
    else if (e.key === "Tab") {
      const f = [menuBtn].concat($$("a[href]", panel));
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ================= delegated clicks ================= */
  document.addEventListener("click", (e) => {
    const t = e.target;
    const link = t.closest("a[data-link]");
    if (link) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      go(link.getAttribute("href"));
      return;
    }
    const skip = t.closest("[data-skip]");
    if (skip) { e.preventDefault(); $("#main").focus(); return; }
    if (t.closest('[data-action="top"]')) { Scroll.toTop(false); return; }
    const lb = t.closest("[data-lb]");
    if (lb) { openLightbox(Number(lb.getAttribute("data-lb")), lb); return; }
    const nudge = t.closest("[data-nudge]");
    if (nudge) {
      const sc = nudge.parentElement.previousElementSibling;
      if (sc) sc.scrollBy({ left: Number(nudge.getAttribute("data-nudge")) * sc.clientWidth * 0.8, behavior: reduced() ? "auto" : "smooth" });
      return;
    }
    const film = t.closest("[data-film]");
    if (film) { setFilm(Number(film.getAttribute("data-film")), film); return; }
    const play = t.closest("[data-play]");
    if (play) { playVideo(play); return; }
    const fb = t.closest("[data-filter]");
    if (fb) { chooseFilter(fb.getAttribute("data-filter")); return; }
    const vb = t.closest("[data-view]");
    if (vb) { chooseView(vb.getAttribute("data-view")); return; }
    const af = t.closest("[data-art-filter]");
    if (af) { chooseArt(af.getAttribute("data-art-filter")); return; }
  });

  /* ================= HOME ================= */
  function initHome() {
    const root = $("#hero");
    if (!root) return;
    let r1 = 0, r2 = 0;
    r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => root.setAttribute("data-ready", "")); });
    onCleanup(() => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); });
    if (reduced()) return;

    // scroll scrub — compositor-only transforms/opacity on separate layers
    const g = (n) => $('[data-g="' + n + '"]', root);
    const el = { fl: g("fl"), fr: g("fr"), wl: g("wl"), wr: g("wr"), detail: g("detail"), ground: g("ground"), copy: g("copy"), word: g("wordmark") };
    ["fl", "fr", "wl", "wr", "detail"].forEach((k) => (el[k].style.willChange = "transform"));
    const layer = $(".hero-layer", root);
    let unit = 1, range = 1, top = 0, lastP = -1;
    const easeIn = (t) => t * t;
    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const seg = (p, s, d) => clamp((p - s) / d, 0, 1);
    const f2 = (n) => n.toFixed(2);

    function apply(y) {
      const p = clamp((y - top) / range, 0, 1);
      if (p === lastP) return;
      lastP = p;
      el.fl.style.transform = "translate3d(" + f2(-1500 * unit * easeIn(seg(p, 0, 0.72))) + "px,0,0)";
      el.fr.style.transform = "translate3d(" + f2(1500 * unit * easeIn(seg(p, 0, 0.72))) + "px,0,0)";
      el.wl.style.transform = "translate3d(" + f2(-1150 * unit * easeInOut(seg(p, 0.05, 0.86))) + "px,0,0)";
      el.wr.style.transform = "translate3d(" + f2(1150 * unit * easeInOut(seg(p, 0.05, 0.86))) + "px,0,0)";
      el.detail.style.transform = "scale(" + (1 + 0.14 * p).toFixed(4) + ")";
      el.detail.style.opacity = String(1 - seg(p, 0.76, 0.24));
      el.ground.style.opacity = String(1 - seg(p, 0.5, 0.3));
      const c = seg(p, 0, 0.22);
      el.copy.style.opacity = String(1 - c);
      el.copy.style.transform = "translate3d(0," + f2(-40 * c) + "px,0)";
      const w = seg(p, 0.5, 0.3);
      el.word.style.opacity = String(1 - w);
      el.word.style.transform = "translate3d(0," + f2(-18 * w) + "%,0)";
    }
    function measure() {
      const W = layer.offsetWidth, H = layer.offsetHeight;
      unit = Math.max(W / 1600, H / 1000);
      const ox = (W - 1600 * unit) / 2, oy = H - 1000 * unit;
      el.detail.style.transformOrigin = f2(ox + 800 * unit) + "px " + f2(oy + 640 * unit) + "px";
      range = Math.max(1, root.offsetHeight - window.innerHeight);
      top = root.getBoundingClientRect().top + window.scrollY;
      lastP = -1;
      apply(window.scrollY);
    }
    measure();
    const off = Scroll.onFrame(apply);
    window.addEventListener("resize", measure, { passive: true });
    onCleanup(() => { off(); window.removeEventListener("resize", measure); });

    // pointer parallax — fine pointers only, eased, stops when settled
    if (finePointer()) {
      const layers = $$("[data-depth]", root);
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      const loop = () => {
        cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
        for (const l of layers) {
          const d = Number(l.getAttribute("data-depth"));
          l.style.transform = "translate3d(" + (-cx * d).toFixed(2) + "px," + (-cy * d * 0.6).toFixed(2) + "px,0)";
        }
        raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(loop) : 0;
      };
      const move = (e) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 2;
        ty = (e.clientY / window.innerHeight - 0.5) * 2;
        if (!raf) raf = requestAnimationFrame(loop);
      };
      window.addEventListener("pointermove", move, { passive: true });
      onCleanup(() => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); });
    }
  }

  /* horizontal drag scroller (delegated) */
  const drag = { el: null, startX: 0, startScroll: 0, id: 0 };
  document.addEventListener("pointerdown", (e) => {
    const sc = e.target.closest && e.target.closest("[data-scroller]");
    if (!sc || e.pointerType !== "mouse" || e.button !== 0) return;
    drag.el = sc; drag.startX = e.clientX; drag.startScroll = sc.scrollLeft; drag.id = e.pointerId;
    try { sc.setPointerCapture(e.pointerId); } catch (_) {}
    sc.style.scrollSnapType = "none";
  });
  document.addEventListener("pointermove", (e) => {
    if (!drag.el) return;
    drag.el.scrollLeft = drag.startScroll - (e.clientX - drag.startX);
  }, { passive: true });
  const endDrag = () => { if (drag.el) { drag.el.style.scrollSnapType = ""; drag.el = null; } };
  document.addEventListener("pointerup", endDrag);
  document.addEventListener("pointercancel", endDrag);

  /* films */
  function setFilm(i, btn) {
    const v = D.videos[i];
    const stage = $("[data-film-stage]");
    stage.innerHTML = V.videoPlayer(v) + V.videoMeta(v);
    Reveal.scan(stage);
    $$("[data-film]").forEach((b) => {
      const on = b === btn;
      if (on) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
      b.classList.toggle("opacity-100", on);
      b.classList.toggle("opacity-50", !on);
      b.classList.toggle("hover:opacity-100", !on);
    });
  }
  function findVideo(id) {
    let v = D.videos.find((x) => x.id === id);
    if (v) return v;
    V.projects.forEach((p) => p.chapters.forEach((c) => { if (c.type === "video" && c.video.id === id) v = c.video; }));
    return v;
  }
  function playVideo(btn) {
    const v = findVideo(btn.getAttribute("data-play"));
    const box = btn.closest("[data-video]");
    if (!v || !box) return;
    $$("[data-poster]", box).forEach((n) => n.remove());
    if (v.src) {
      box.insertAdjacentHTML("beforeend", '<video class="absolute inset-0 h-full w-full bg-black object-contain" src="' + esc(v.src) + '" controls autoplay playsinline preload="none" aria-label="' + esc(v.title) + '"></video>');
    } else if (v.embed) {
      const src = v.embed.provider === "youtube"
        ? "https://www.youtube-nocookie.com/embed/" + v.embed.id + "?autoplay=1&rel=0"
        : "https://player.vimeo.com/video/" + v.embed.id + "?autoplay=1";
      box.insertAdjacentHTML("beforeend", '<iframe class="absolute inset-0 h-full w-full" src="' + src + '" title="' + esc(v.title) + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>');
    }
  }

  /* compare slider (delegated) */
  document.addEventListener("input", (e) => {
    const box = e.target.closest && e.target.closest("[data-compare]");
    if (!box || e.target.type !== "range") return;
    const pos = Number(e.target.value);
    $("[data-compare-before]", box).style.clipPath = "inset(0 " + (100 - pos) + "% 0 0)";
    $("[data-compare-handle]", box).style.left = pos + "%";
  });

  /* ================= list morph (FLIP) ================= */
  function morph(ul, entries, o) {
    const old = new Map();
    Array.from(ul.children).forEach((el) => { if (el.dataset.key && !el.dataset.leaving) old.set(el.dataset.key, el); });
    const first = new Map();
    old.forEach((el, k) => first.set(k, el.getBoundingClientRect()));
    const keep = new Set(entries.map((e) => e.key));
    const pr = ul.getBoundingClientRect();
    Array.from(old.keys()).forEach((k) => {
      if (keep.has(k)) return;
      const el = old.get(k);
      const r = first.get(k);
      el.dataset.leaving = "1";
      Object.assign(el.style, { position: "absolute", left: r.left - pr.left + "px", top: r.top - pr.top + "px", width: r.width + "px", height: r.height + "px", margin: "0", pointerEvents: "none" });
      const an = el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: o.scale ? "scale(0.97)" : "none" }], { duration: o.exitMs, easing: "ease", fill: "forwards" });
      an.onfinish = () => el.remove();
      old.delete(k);
    });
    const els = new Map(), added = [];
    entries.forEach((en, i) => {
      let el = old.get(en.key);
      if (!el) {
        const t = document.createElement("template");
        t.innerHTML = en.create();
        el = t.content.firstElementChild;
        added.push(el);
      } else en.update(el, i);
      ul.appendChild(el);
      els.set(en.key, el);
    });
    entries.forEach((en) => {
      const f = first.get(en.key);
      if (!f) return;
      const el = els.get(en.key), l = el.getBoundingClientRect();
      const dx = f.left - l.left, dy = f.top - l.top, sx = l.width ? f.width / l.width : 1, sy = l.height ? f.height / l.height : 1;
      if (Math.abs(dx) + Math.abs(dy) < 1 && Math.abs(sx - 1) + Math.abs(sy - 1) < 0.01) return;
      el.animate(
        [{ transformOrigin: "0 0", transform: "translate(" + dx + "px," + dy + "px) scale(" + sx + "," + sy + ")" }, { transformOrigin: "0 0", transform: "none" }],
        { duration: o.layoutMs, easing: "cubic-bezier(0.16,1,0.3,1)" }
      );
    });
    added.forEach((el) => {
      el.animate(o.up ? [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }] : [{ opacity: 0 }, { opacity: 1 }], { duration: o.enterMs, easing: "cubic-bezier(0.16,1,0.3,1)" });
    });
    Reveal.scan(ul);
    Parallax.scan(ul);
  }
  const countText = (n, one, many) => n + " " + (n === 1 ? one : many);

  /* ================= PROJECTS archive ================= */
  let archive = null;
  function initArchive(state) {
    archive = state;
    const wrap = $("[data-archive]");
    // hover preview follows the pointer on list rows (fine pointers, lg+)
    if (finePointer()) {
      const over = (e) => {
        const row = e.target.closest && e.target.closest("[data-preview]");
        if (row) showPreview(V.getProject(row.getAttribute("data-preview")));
      };
      const out = (e) => { if (!(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest("[data-preview]"))) hidePreview(); };
      wrap.addEventListener("pointerover", over);
      wrap.addEventListener("pointerout", out);
      wrap.addEventListener("focusin", over);
      wrap.addEventListener("focusout", () => hidePreview());
      window.addEventListener("pointermove", pvMove, { passive: true });
      onCleanup(() => window.removeEventListener("pointermove", pvMove));
    }
  }
  function visibleProjects() {
    return archive.filter === "all" ? V.projects : V.projects.filter((p) => p.categories.indexOf(archive.filter) >= 0);
  }
  function chooseFilter(id) {
    if (!archive || id === archive.filter) return;
    archive.filter = id;
    hidePreview();
    $$("[data-filter]").forEach((b) => {
      const on = b.getAttribute("data-filter") === id;
      b.setAttribute("aria-pressed", String(on));
      b.className = V.filterBtnCls(on);
      $("[data-ul]", b).className = V.underlineCls(on, true);
    });
    const url = "#/projects" + (id === "all" ? "" : "?c=" + id);
    history.replaceState(null, "", url);
    renderResults(false);
  }
  function chooseView(v) {
    if (!archive || v === archive.view) return;
    archive.view = v;
    hidePreview();
    $$("[data-view]").forEach((b) => {
      const on = b.getAttribute("data-view") === v;
      b.setAttribute("aria-pressed", String(on));
      b.className = V.viewBtnCls(on);
    });
    renderResults(true);
  }
  function renderResults(rebuild) {
    const vis = visibleProjects();
    const box = $("[data-results]");
    $("[data-count]").textContent = countText(vis.length, "project", "projects");
    let ul = $("[data-list]", box);
    if (!vis.length) {
      if (ul) ul.remove();
      if (!$("[data-empty]", box)) box.insertAdjacentHTML("beforeend", '<p data-empty class="meta py-24 text-sub">No projects in this category yet.</p>');
      return;
    }
    const empty = $("[data-empty]", box);
    if (empty) empty.remove();
    const gridView = archive.view === "grid";
    if (rebuild || !ul) {
      if (ul) ul.remove();
      box.insertAdjacentHTML("beforeend", '<ul data-list class="' + V.listCls(archive.view) + '">' + vis.map((p, i) => V.archiveItem(p, i, archive.view)).join("") + "</ul>");
      Reveal.scan(box);
      Parallax.scan(box);
      return;
    }
    morph(ul, vis.map((p, i) => ({
      key: p.slug,
      create: () => V.archiveItem(p, i, archive.view),
      update: (el, idx) => {
        const idxEl = $("[data-idx]", el);
        if (idxEl) idxEl.textContent = pad2(idx + 1);
        if (gridView) {
          const r = V.rhythmAt(idx);
          el.className = cn(r.span, r.offset);
          const fig = $("[data-img-reveal]", el);
          if (fig) fig.style.aspectRatio = r.ratio;
        }
      },
    })), gridView
      ? { up: true, scale: true, enterMs: 700, exitMs: 700, layoutMs: 700 }
      : { up: false, enterMs: 500, exitMs: 500, layoutMs: 500 });
  }

  /* hover preview (list rows) */
  const pv = { x: 0, y: 0, cx: 0, cy: 0, raf: 0, on: false };
  function pvLoop() {
    pv.cx += (pv.x - pv.cx) * 0.14;
    pv.cy += (pv.y - pv.cy) * 0.14;
    const box = $("#hover-preview");
    if (box) box.style.transform = "translate3d(" + pv.cx.toFixed(1) + "px," + pv.cy.toFixed(1) + "px,0)";
    pv.raf = pv.on || Math.abs(pv.x - pv.cx) + Math.abs(pv.y - pv.cy) > 0.3 ? requestAnimationFrame(pvLoop) : 0;
  }
  function pvMove(e) { pv.x = e.clientX; pv.y = e.clientY; if (pv.on && !pv.raf) pv.raf = requestAnimationFrame(pvLoop); }
  function showPreview(p) {
    const box = $("#hover-preview");
    if (!box || !p) return;
    const inner = $("[data-hp]", box);
    const m = p.cover;
    if (!pv.on) { pv.cx = pv.x; pv.cy = pv.y; }
    pv.on = true;
    inner.style.aspectRatio = String(m.width / m.height);
    inner.innerHTML = '<img src="' + m.src + '" alt="" class="absolute inset-0 h-full w-full object-cover" decoding="async">';
    inner.style.opacity = "1";
    inner.style.clipPath = "inset(0 0 0 0)";
    if (!pv.raf) pv.raf = requestAnimationFrame(pvLoop);
  }
  function hidePreview() {
    pv.on = false;
    const box = $("#hover-preview");
    if (!box) return;
    const inner = $("[data-hp]", box);
    inner.style.opacity = "0";
    inner.style.clipPath = "inset(12% 12% 12% 12%)";
  }

  /* ================= ART gallery ================= */
  let artFilter = "all";
  function initArt() { artFilter = "all"; lightboxItems = artLbItems(); }
  function artVisible() {
    return artFilter === "all" ? D.art : D.art.filter((a) => a.kind === artFilter);
  }
  function artLbItems() {
    return artVisible().map((a) => Object.assign({}, a.media, { caption: a.title + " — " + V.ART_KIND[a.kind] }));
  }
  function chooseArt(id) {
    if (id === artFilter) return;
    artFilter = id;
    $$("[data-art-filter]").forEach((b) => {
      const on = b.getAttribute("data-art-filter") === id;
      b.setAttribute("aria-pressed", String(on));
      b.className = V.filterBtnCls(on);
      $("[data-ul]", b).className = V.underlineCls(on, false);
    });
    const vis = artVisible();
    lightboxItems = artLbItems();
    $("[data-count]").textContent = countText(vis.length, "plate", "plates");
    morph($("[data-art] [data-list]"), vis.map((a, i) => ({
      key: a.id,
      create: () => V.artItem(a, i),
      update: (el, idx) => {
        $("[data-idx]", el).textContent = pad2(idx + 1);
        const b = $("[data-lb]", el);
        if (b) b.setAttribute("data-lb", String(idx));
      },
    })), { up: false, enterMs: 500, exitMs: 500, layoutMs: 700 });
  }

  /* ================= Lightbox ================= */
  const lb = $("#lightbox");
  let lightboxItems = [], lbOpen = false, lbIndex = 0, lbReturn = null, lbBusy = 0, swipe = null;
  const lbImg = $("[data-lb-stage]", lb);

  function lbPaint() {
    const m = lightboxItems[lbIndex];
    const r = m.width / m.height;
    lbImg.style.aspectRatio = String(r);
    lbImg.style.width = "min(100%, calc(70svh * " + r + "))";
    lbImg.innerHTML = '<img src="' + m.src + '" alt="' + esc(m.alt) + '" class="h-full w-full object-contain" decoding="async">';
    $("[data-lb-count]", lb).textContent = pad2(lbIndex + 1) + " / " + pad2(lightboxItems.length);
    $("[data-lb-caption]", lb).textContent = m.caption || m.alt;
    const multi = lightboxItems.length > 1;
    $$("[data-lb-step]", lb).forEach((b) => (b.hidden = !multi));
  }
  function openLightbox(i, from) {
    if (!lightboxItems.length) return;
    lbReturn = from || document.activeElement;
    lbIndex = clamp(i, 0, lightboxItems.length - 1);
    lbPaint();
    lb.removeAttribute("hidden");
    void lb.offsetWidth;
    lb.setAttribute("data-open", "");
    lbOpen = true;
    Scroll.lock();
    $("[data-lb-close]", lb).focus();
  }
  function closeLightbox() {
    if (!lbOpen) return;
    lbOpen = false;
    lb.removeAttribute("data-open");
    setTimeout(() => { if (!lbOpen) lb.setAttribute("hidden", ""); }, 350);
    Scroll.unlock();
    if (lbReturn && lbReturn.focus) lbReturn.focus();
  }
  function lbStep(d) {
    if (lbBusy) return;
    const n = lightboxItems.length;
    if (n < 2) return;
    lbBusy = 1;
    lbImg.classList.add("lb-out");
    setTimeout(() => {
      lbIndex = (lbIndex + d + n) % n;
      lbPaint();
      lbImg.classList.remove("lb-out");
      lbBusy = 0;
    }, 300);
  }
  function lbKey(e) {
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") lbStep(1);
    else if (e.key === "ArrowLeft") lbStep(-1);
    else if (e.key === "Tab") {
      const f = $$("button:not([hidden])", lb);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  lb.addEventListener("click", (e) => {
    if (e.target.closest("[data-lb-close]")) closeLightbox();
    else if (e.target.closest('[data-lb-step="-1"]')) lbStep(-1);
    else if (e.target.closest('[data-lb-step="1"]')) lbStep(1);
  });
  lb.addEventListener("pointerdown", (e) => { if (e.target.closest("[data-lb-area]")) swipe = { x: e.clientX, y: e.clientY }; });
  lb.addEventListener("pointerup", (e) => {
    const s = swipe; swipe = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.4) lbStep(dx < 0 ? 1 : -1);
  });

  /* ================= Enquiry form ================= */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function initForm() {
    const form = $("[data-enquiry]");
    if (!form) return;
    const status = $("[data-status]", form);
    const submit = $('[type="submit"]', form);

    function validate(f) {
      const e = {};
      const name = String(f.get("name") || "").trim();
      const email = String(f.get("email") || "").trim();
      const message = String(f.get("message") || "").trim();
      if (name.length < 2) e.name = "Please enter your name.";
      if (!email) e.email = "Please enter your email address.";
      else if (!EMAIL_RE.test(email)) e.email = "That email address doesn’t look right.";
      if (!f.get("type")) e.type = "Please choose what the enquiry is about.";
      if (message.length < 10) e.message = "Please tell us a little about the project (at least 10 characters).";
      return e;
    }
    function showErrors(errs) {
      $$("[data-field]", form).forEach((fd) => {
        const n = fd.getAttribute("data-field");
        const p = $("[data-err]", fd);
        const ctl = $("input, select, textarea", fd);
        if (errs[n]) {
          p.hidden = false;
          p.innerHTML = '<span aria-hidden="true">— </span>' + esc(errs[n]);
          ctl.setAttribute("aria-invalid", "true");
          ctl.setAttribute("aria-describedby", "err-" + n);
        } else {
          p.hidden = true;
          ctl.removeAttribute("aria-invalid");
          ctl.removeAttribute("aria-describedby");
        }
      });
    }
    function mailto(d) {
      if (!C.email) return null;
      const body = (d.get("message") || "") + "\n\n— " + (d.get("name") || "") + "\n" + (d.get("email") || "") + "\n" + (d.get("phone") || "");
      return "mailto:" + C.email + "?subject=" + encodeURIComponent("Enquiry — " + (d.get("type") || "")) + "&body=" + encodeURIComponent(body);
    }
    const say = (html) => { status.innerHTML = html; requestAnimationFrame(() => status.focus()); };

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      if (String(data.get("company") || "")) return; // honeypot
      const errs = validate(data);
      showErrors(errs);
      const first = Object.keys(errs)[0];
      if (first) { status.innerHTML = ""; const c = $('[name="' + first + '"]', form); if (c) c.focus(); return; }
      if (!C.formEndpoint) {
        const m = mailto(data);
        say('<div class="meta space-y-3 border-l border-main pl-4 text-main"><p><strong class="font-medium">Your message has not been sent.</strong> Online enquiries are not switched on yet.</p>' +
          (C.email ? '<p><a href="' + esc(m) + '" class="underline underline-offset-4">Open it in your email app instead</a>, or write to ' + esc(C.email) + ".</p>" : '<p class="text-sub">Contact details are still to be supplied.</p>') + "</div>");
        return;
      }
      submit.disabled = true; submit.textContent = "Sending…";
      try {
        const res = await fetch(C.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: data });
        if (!res.ok) throw new Error("Request failed (" + res.status + ")");
        form.reset();
        say('<p class="meta border-l border-main pl-4 text-main">Thank you — your enquiry has been sent.</p>');
      } catch (_) {
        say('<p role="alert" class="meta border-l border-main pl-4 text-main">The message could not be sent. Please try again, or use the contact details instead.</p>');
      }
      submit.disabled = false; submit.textContent = "Send enquiry";
    });
  }


  /* ================= Intro film (footer): lazy-load, play only while visible ================= */
  (function introFilm() {
    const box = $("[data-intro]");
    if (!box) return;
    const vid = $("video", box);
    const mobileMq = window.matchMedia("(max-width: 767px)");
    const A = "assets/video/jawarc-intro";
    const pick = () => (mobileMq.matches ? { src: A + "-m.mp4", poster: A + "-poster-m.webp" } : { src: A + ".mp4", poster: A + "-poster.webp" });
    vid.muted = true;
    vid.setAttribute("muted", "");
    if (reduced()) return; // poster only
    let loaded = false, visible = false;
    const play = () => { const p = vid.play(); if (p && p.catch) p.catch(() => {}); };
    const load = () => {
      const s = pick();
      vid.poster = s.poster;
      vid.src = s.src;
      vid.load();
      loaded = true;
      if (visible) play();
    };
    new IntersectionObserver((en) => { if (en[0].isIntersecting && !loaded) load(); }, { rootMargin: "500px 0px" }).observe(box);
    new IntersectionObserver((en) => {
      visible = en[0].isIntersecting;
      if (!loaded) return;
      if (visible) play(); else vid.pause();
    }, { threshold: 0.15 }).observe(box);
    // phone <-> desktop crossing (rotate / resize): swap to the matching crop, keep the position
    mobileMq.addEventListener("change", () => {
      if (!loaded) return;
      const t = vid.currentTime;
      const s = pick();
      vid.poster = s.poster;
      vid.src = s.src;
      vid.addEventListener("loadedmetadata", () => { try { vid.currentTime = Math.min(t, vid.duration || t); } catch (_) {} if (visible) play(); }, { once: true });
    });
  })();

  /* ================= boot ================= */
  Scroll.init();
  render();
})();
