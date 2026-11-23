/* ------------------------------------------------------------------
   JAWARC — core helpers & lightweight motion engine (no libraries)
   - one scroll loop for everything (header, hero, parallax)
   - smooth wheel scrolling that only runs while moving
   - one shared IntersectionObserver for every reveal
------------------------------------------------------------------- */
(function () {
  "use strict";

  const mq = (q) => window.matchMedia(q).matches;
  const reduced = () => mq("(prefers-reduced-motion: reduce)");
  const finePointer = () => mq("(hover: hover) and (pointer: fine)");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad2 = (n) => String(n).padStart(2, "0");
  const cn = (...a) => a.filter(Boolean).join(" ");

  /* ---------------- Scroll: one loop, smooth wheel ---------------- */
  const Scroll = (function () {
    let target = 0, current = 0, raf = 0, last = 0, lastSet = -1, locks = 0;
    let tween = null, tickRaf = 0;
    const fns = new Set();

    const maxY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    function runFrame() {
      tickRaf = 0;
      const y = window.scrollY;
      fns.forEach((fn) => fn(y));
    }
    function schedule() {
      if (!tickRaf) tickRaf = requestAnimationFrame(runFrame);
    }
    function setY(y) {
      lastSet = Math.round(y);
      window.scrollTo(0, y);
    }
    function stopAnim() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      tween = null;
    }

    function step(now) {
      const dt = Math.min(64, now - last);
      last = now;
      if (tween) {
        const t = clamp((now - tween.t0) / tween.dur, 0, 1);
        const e = t >= 1 ? 1 : Math.min(1, 1.001 - Math.pow(2, -10 * t));
        current = tween.from + (tween.to - tween.from) * e;
        target = current;
        setY(current);
        if (t >= 1) { raf = 0; tween = null; return; }
        raf = requestAnimationFrame(step);
        return;
      }
      const k = 1 - Math.pow(1 - 0.1, dt / 16.667);
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.4) { current = target; raf = 0; }
      else raf = requestAnimationFrame(step);
      setY(current);
    }

    function onWheel(e) {
      if (e.defaultPrevented || e.ctrlKey || locks > 0) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // horizontal: native
      if (e.target.closest && e.target.closest("textarea, select, [data-native-scroll]")) return;
      e.preventDefault();
      if (!raf || tween) { stopAnim(); current = target = window.scrollY; }
      const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1;
      target = clamp(target + e.deltaY * unit, 0, maxY());
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(step); }
    }

    function onScroll() {
      const y = window.scrollY;
      if (Math.abs(y - lastSet) > (raf ? 60 : 1.5)) { // keyboard, scrollbar, anchor…
        stopAnim();
        current = target = y;
      }
      schedule();
    }

    return {
      init() {
        current = target = window.scrollY;
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", schedule, { passive: true });
        // JS wheel-smoothing is opt-in (JAWARC_CONFIG.smoothScroll): native scrolling runs on the
        // compositor thread and is the smoothest/lowest-lag option on most machines.
        if (!reduced() && window.JAWARC_CONFIG && window.JAWARC_CONFIG.smoothScroll) window.addEventListener("wheel", onWheel, { passive: false });
      },
      onFrame(fn) { fns.add(fn); return () => fns.delete(fn); },
      kick: schedule,
      toTop(immediate) {
        stopAnim();
        if (immediate || reduced()) {
          current = target = 0;
          setY(0);
          schedule();
          return;
        }
        const from = window.scrollY;
        if (from < 2) return;
        tween = { from, to: 0, t0: performance.now(), dur: 1600 };
        last = performance.now();
        raf = requestAnimationFrame(step);
      },
      lock() {
        locks += 1;
        stopAnim();
        document.documentElement.style.overflow = "hidden";
      },
      unlock() {
        locks = Math.max(0, locks - 1);
        if (locks === 0) {
          document.documentElement.style.overflow = "";
          current = target = window.scrollY;
        }
      },
    };
  })();

  /* ---------------- Reveal: one shared observer ---------------- */
  const Reveal = (function () {
    let io = null;
    const cbs = new WeakMap();
    function get() {
      if (io) return io;
      io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (!en.isIntersecting) continue;
            const fn = cbs.get(en.target);
            cbs.delete(en.target);
            io.unobserve(en.target);
            if (fn) fn();
          }
        },
        { rootMargin: "0px 0px -7% 0px", threshold: 0.01 }
      );
      return io;
    }
    function onEnter(el, cb) {
      cbs.set(el, cb);
      get().observe(el);
    }
    return {
      scan(root) {
        $$("[data-reveal], [data-img-reveal], [data-split], [data-line]", root).forEach((el) => {
          if (el.hasAttribute("data-in")) return;
          onEnter(el, () => el.setAttribute("data-in", ""));
        });
      },
      reset() {
        if (io) io.disconnect();
        io = null;
      },
    };
  })();

  /* ---------------- Parallax: visible items only, one rAF ---------------- */
  const Parallax = (function () {
    const items = new Map();
    let io = null, off = null;
    function update() {
      const vh = window.innerHeight;
      const rects = [];
      items.forEach((it) => { if (it.visible) rects.push([it, it.root.getBoundingClientRect()]); });
      for (const [it, rect] of rects) {
        const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
        const c = clamp(progress, -1, 1);
        it.layer.style.transform = "translate3d(0," + ((-c * rect.height * it.amount) / 100).toFixed(2) + "px,0)";
      }
    }
    return {
      scan(root) {
        if (reduced()) return;
        if (!io) {
          io = new IntersectionObserver(
            (entries) => {
              let any = false;
              for (const en of entries) {
                const it = items.get(en.target);
                if (!it) continue;
                it.visible = en.isIntersecting;
                it.layer.style.willChange = it.visible ? "transform" : "";
                any = any || it.visible;
              }
              if (any) update();
            },
            { rootMargin: "20% 0px" }
          );
          off = Scroll.onFrame(update);
        }
        $$("[data-parallax]", root).forEach((el) => {
          const amount = parseFloat(el.getAttribute("data-parallax"));
          const layer = $(".reveal-par", el);
          if (!layer || !(amount > 0) || items.has(el)) return;
          items.set(el, { root: el, layer, amount, visible: false });
          io.observe(el);
        });
      },
      reset() {
        if (io) io.disconnect();
        if (off) off();
        io = null; off = null;
        items.clear();
      },
    };
  })();

  window.JW = { mq, reduced, finePointer, clamp, $, $$, esc, pad2, cn, Scroll, Reveal, Parallax };
})();
