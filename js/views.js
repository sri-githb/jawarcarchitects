/* ------------------------------------------------------------------
   JAWARC — page & component templates (plain strings, no framework)
------------------------------------------------------------------- */
(function () {
  "use strict";

  const { esc, pad2, cn } = window.JW;
  const D = window.JAWARC_DATA;
  const C = window.JAWARC_CONFIG;
  const site = D.site;

  /* ---------------- data helpers ---------------- */
  const projects = D.projects.slice().sort((a, b) => a.order - b.order);
  const getProject = (slug) => projects.find((p) => p.slug === slug);
  const getFeatured = () => projects.filter((p) => p.featured);
  const getAdjacent = (slug) => {
    const i = projects.findIndex((p) => p.slug === slug);
    if (i < 0) return {};
    return { prev: projects[(i - 1 + projects.length) % projects.length], next: projects[(i + 1) % projects.length] };
  };
  const categoryCounts = () =>
    D.categories
      .map((c) => ({ id: c.id, label: c.label, count: projects.filter((p) => p.categories.indexOf(c.id) >= 0).length }))
      .filter((c) => c.count > 0);
  const artKindCounts = () =>
    D.artKinds
      .map((k) => ({ id: k.id, label: k.label, count: D.art.filter((a) => a.kind === k.id).length }))
      .filter((k) => k.count > 0);
  const categoryLabel = (id) => (D.categories.find((c) => c.id === id) || {}).label || id;
  const formatYear = (y) => (y ? String(y) : "Year TBC");
  const formatLocation = (l) => (l == null ? "Location TBC" : l);
  const ART_KIND = { sketch: "Sketch", drawing: "Drawing", concept: "Concept", "3d": "3D experiment", study: "Material study" };

  /* ---------------- primitives ---------------- */
  const a = (path, cls, inner, extra) =>
    '<a href="#' + path + '" data-link' + (cls ? ' class="' + cls + '"' : "") + (extra ? " " + extra : "") + ">" + inner + "</a>";

  const arrowIcon = (cls) =>
    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" class="' +
    cn("shrink-0 transition-transform duration-500 ease-out-expo", cls) +
    '"><path d="M3 15L15 3M6 3h9v9" stroke="currentColor" stroke-width="1.2"/></svg>';

  const ARROW = arrowIcon("group-hover:translate-x-0.5 group-hover:-translate-y-0.5");

  const tbc = (t) =>
    '<span data-placeholder class="text-dim italic underline decoration-hair decoration-dotted underline-offset-4">' +
    esc(t || "To be supplied") + "</span>";

  const sampleTag = (cls) =>
    C.showSampleTags
      ? '<span class="' + cn("eyebrow inline-block rounded-full border border-hair px-2.5 py-0.5 text-[0.625rem] text-sub", cls) + '">Sample</span>'
      : "";

  const section = (theme, cls, inner, tag, extra) => {
    tag = tag || "section";
    return "<" + tag + ' class="' + cn("theme-" + theme, "relative bg-page text-main", cls) + '"' + (extra ? " " + extra : "") + ">" + inner + "</" + tag + ">";
  };

  const eyebrow = (inner, cls) =>
    '<p class="' + cn("eyebrow flex items-center gap-4 text-sub", cls) + '"><span>' + inner + "</span></p>";

  const splitText = (text, as, cls, delay) => {
    const tokens = text.split(" ");
    const plain = text.replace(/\*/g, "");
    const inner = tokens
      .map((tok, i) => {
        const italic = tok.charAt(0) === "*" && tok.charAt(tok.length - 1) === "*" && tok.length > 2;
        const word = italic ? tok.slice(1, -1) : tok;
        return (
          '<span aria-hidden="true"><span class="split-word" style="--i:' + i + '"><span' + (italic ? ' class="italic"' : "") + ">" +
          esc(word) + "</span></span>" + (i < tokens.length - 1 ? " " : "") + "</span>"
        );
      })
      .join("");
    return "<" + as + ' data-split aria-label="' + esc(plain) + '" class="' + (cls || "") + '" style="--d:' + (delay || 0) + '">' + inner + "</" + as + ">";
  };

  const reveal = (as, o, inner) =>
    "<" + as + ' data-reveal="' + (o.variant || "up") + '" class="' + (o.cls || "") + '" style="--d:' + (o.delay || 0) + '">' + inner + "</" + as + ">";

  const drawLine = (delay, cls) =>
    '<div data-line aria-hidden="true" class="' + (cls || "h-px w-full bg-hair") + '" style="--d:' + (delay || 0) + '"></div>';

  /* The one image primitive: clip-path reveal, counter-scale, parallax, hover scale, lightbox. */
  function figure(media, o) {
    o = o || {};
    const parallax = o.parallax || 0;
    const aspect = o.ratio || media.width + " / " + media.height;
    const img =
      '<img src="' + media.src + '" alt="' + esc(media.alt) + '" width="' + media.width + '" height="' + media.height + '" ' +
      (o.priority ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"') +
      ' decoding="async" draggable="false" class="block h-full w-full object-cover">';
    const inner =
      '<div data-img-reveal' + (parallax ? ' data-parallax="' + parallax + '"' : "") +
      ' class="' + cn("group relative w-full", o.cls) + '" style="aspect-ratio:' + aspect + ";--d:" + (o.delay || 0) + '">' +
      '<div class="reveal-mask"><div class="reveal-par" style="--par:' + parallax + '"><div class="reveal-intro">' +
      '<div class="' + cn("reveal-hover", media.tone === "mono-hover" && "mono-hover") + '">' + img + "</div></div></div></div></div>";
    const canOpen = o.lb !== undefined;
    return (
      '<figure class="m-0 w-full">' +
      (canOpen
        ? '<button type="button" data-lb="' + o.lb + '" aria-label="View full screen: ' + esc(media.alt) +
          '" class="block w-full text-left">' + inner + "</button>"
        : inner) +
      "</figure>"
    );
  }

  const caption = (m) =>
    '<p class="meta mt-3 flex items-baseline justify-between gap-6 text-dim"><span>' + esc(m.caption || m.alt) + "</span>" +
    (m.kind ? '<span class="eyebrow shrink-0 text-[0.65rem]">' + esc(m.kind) + "</span>" : "") + "</p>";

  /* ---------------- contact list ---------------- */
  const LINK = "underline decoration-hair underline-offset-[6px] transition-colors hover:decoration-current";
  function contactList(cls) {
    const wa = (C.whatsapp || "").replace(/[^\d]/g, "");
    const socials = (C.social || []).filter((s) => s.href);
    const rows = [
      ["Email", C.email ? '<a href="mailto:' + esc(C.email) + '" class="' + LINK + '">' + esc(C.email) + "</a>" : tbc()],
      ["Phone", C.phone ? '<a href="tel:' + esc(C.phone.replace(/[^\d+]/g, "")) + '" class="' + LINK + '">' + esc(C.phone) + "</a>" : tbc()],
      ["WhatsApp", wa ? '<a href="https://wa.me/' + wa + '" target="_blank" rel="noopener noreferrer" class="' + LINK + '">Message on WhatsApp</a>' : tbc()],
      ["Studio", C.address ? '<span class="whitespace-pre-line">' + esc(C.address) + "</span>" : tbc()],
      [
        "Social",
        socials.length
          ? '<span class="flex flex-wrap gap-x-5 gap-y-1">' +
            socials.map((s) => '<a href="' + esc(s.href) + '" target="_blank" rel="noopener noreferrer" class="' + LINK + '">' + esc(s.label) + "</a>").join("") +
            "</span>"
          : tbc(),
      ],
    ];
    return (
      '<dl class="' + (cls || "") + '">' +
      rows
        .map(
          (r) =>
            '<div class="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-hair py-4 first:border-t-0 sm:grid-cols-[8rem_1fr]">' +
            '<dt class="eyebrow pt-0.5 text-sub">' + r[0] + '</dt><dd class="meta text-main">' + r[1] + "</dd></div>"
        )
        .join("") +
      "</dl>"
    );
  }

  /* ---------------- header / menu / footer ---------------- */
  const NAV_ALL = [{ href: "/", label: "Home" }].concat(D.nav);

  function headerHTML() {
    return (
      '<header id="site-header" class="fixed inset-x-0 top-0 z-[70] text-white transition-transform duration-500 ease-out-expo mix-blend-difference translate-y-0">' +
      '<div class="flex h-[var(--header-h)] items-center justify-between px-[var(--gutter)]">' +
      a("/", "flex shrink-0 items-center", '<img src="assets/logo.svg" alt="' + esc(site.name) + '" width="260" height="81" decoding="async" class="block h-9 w-auto sm:h-[2.6rem]">', 'aria-label="' + esc(site.name) + ' — home"') +
      '<div class="flex items-center gap-10">' +
      '<nav aria-label="Primary" class="hidden items-center gap-9 lg:flex">' +
      D.nav
        .filter((item) => item.href !== "/contact")
        .map((item) =>
          a(
            item.href,
            "eyebrow group relative py-2",
            '<span class="inline-flex items-center gap-2"><span aria-hidden="true" data-dot class="h-[5px] w-[5px] rounded-full bg-current transition-all duration-500 ease-out-expo scale-0 opacity-0"></span>' +
              esc(item.label) + "</span>" +
              '<span aria-hidden="true" class="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover:scale-x-100"></span>',
            'data-nav="' + item.href + '"'
          )
        )
        .join("") +
      a("/contact", "btn-nav group", '<span>Enquire</span>' + arrowIcon("h-[14px] w-[14px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"), 'data-cta="header"') +
      "</nav>" +
      '<button id="menu-btn" type="button" aria-expanded="false" aria-controls="menu-panel" class="eyebrow group flex items-center gap-3 py-2 lg:hidden">' +
      '<span class="relative block h-[0.9rem] min-w-[3.4rem] overflow-hidden text-left">' +
      '<span data-m1 class="block transition-transform duration-500 ease-out-expo">Menu</span>' +
      '<span data-m2 aria-hidden="true" class="absolute left-0 top-full block transition-transform duration-500 ease-out-expo">Close</span></span>' +
      '<span aria-hidden="true" class="relative block h-[9px] w-6">' +
      '<span data-b1 class="absolute left-0 h-px w-full bg-current transition-all duration-500 ease-out-expo top-0"></span>' +
      '<span data-b2 class="absolute left-0 h-px w-full bg-current transition-all duration-500 ease-out-expo bottom-0"></span></span>' +
      "</button></div></div></header>" +
      '<div id="menu-panel" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true" data-native-scroll class="menu-panel theme-dark fixed inset-0 z-[65] overflow-y-auto bg-ink text-fg">' +
      '<div class="flex min-h-full flex-col justify-between gap-14 px-[var(--gutter)] pb-10 pt-[calc(var(--header-h)+2.5rem)] lg:grid lg:grid-cols-12 lg:gap-x-10">' +
      '<nav aria-label="Menu" class="lg:col-span-7"><ul class="menu-list flex flex-col">' +
      NAV_ALL.map(
        (item, i) =>
          '<li class="menu-item overflow-hidden border-t border-hair first:border-t-0"><div class="menu-item-in" style="--i:' + i + '">' +
          a(
            item.href,
            "group flex items-baseline gap-5 py-3 sm:gap-8",
            '<span class="eyebrow w-7 shrink-0 text-dim">' + pad2(i) + "</span>" +
              '<span class="font-display display-md transition-transform duration-700 ease-out-expo group-hover:translate-x-3 sm:group-hover:translate-x-5">' + esc(item.label) + "</span>" +
              '<span aria-hidden="true" data-active-dot class="ml-1 hidden h-2 w-2 self-center rounded-full bg-fg"></span>',
            'data-menu-link="' + item.href + '"'
          ) + "</div></li>"
      ).join("") +
      "</ul></nav>" +
      '<div class="menu-contact flex flex-col justify-end lg:col-span-4 lg:col-start-9"><p class="eyebrow mb-5 text-sub">' + esc(site.name) + "</p>" + contactList() + "</div>" +
      "</div></div>"
    );
  }

  /* Brand film: dim "JAWARC ARCHITECTS" lit by a swinging pendulum lamp. Poster until it plays. */
  function introFilm() {
    const poster = window.matchMedia("(max-width: 767px)").matches ? "assets/video/jawarc-intro-poster-m.webp" : "assets/video/jawarc-intro-poster.webp";
    return (
      '<div data-intro role="img" aria-label="' + esc(site.name) + '" class="intro-film aspect-[960/692] w-full md:aspect-video md:max-h-[92svh]">' +
      '<video muted loop playsinline preload="none" disablepictureinpicture disableremoteplayback aria-hidden="true" tabindex="-1" poster="' + poster + '"></video></div>'
    );
  }

  function footerHTML() {
    const year = new Date().getFullYear();
    return (
      '<footer class="theme-dark relative overflow-hidden bg-page text-main">' +
      introFilm() +
      '<div class="gutter-x grid gap-16 pb-20 pt-16 lg:grid-cols-12 lg:gap-10 lg:pt-24">' +
      '<div class="lg:col-span-5"><img src="assets/logo.svg" alt="' + esc(site.name) + '" width="260" height="81" loading="lazy" decoding="async" class="block h-[3.75rem] w-auto lg:h-[4.5rem]"><p class="font-display display-sm mt-8 max-w-sm text-main">' + esc(site.descriptor) + "</p></div>" +
      '<nav aria-label="Footer" class="lg:col-span-3 lg:col-start-7"><p class="eyebrow mb-5 text-sub">Index</p><ul class="space-y-2">' +
      NAV_ALL.map((n) => "<li>" + a(n.href, "meta text-main underline-offset-[6px] hover:underline", esc(n.label), '') + "</li>").join("") +
      "</ul></nav>" +
      '<div class="lg:col-span-3"><p class="eyebrow mb-3 text-sub">Contact</p>' + contactList() + "</div></div>" +
      '<div class="gutter-x flex flex-wrap items-center justify-between gap-4 border-t border-hair py-6">' +
      '<p class="meta text-sub">© ' + year + " " + esc(site.name) + ". All rights reserved.</p>" +
      '<button type="button" data-action="top" class="eyebrow flex items-center gap-3 text-main">Back to top' +
      '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 13V1M2 6l5-5 5 5" stroke="currentColor" stroke-width="1.2"/></svg></button></div>' +
      "</footer>"
    );
  }

  /* ---------------- project card ---------------- */
  function projectCard(p, o) {
    const cats = p.categories.map(categoryLabel).join(" · ");
    return (
      '<article class="' + cn("group", o.cls) + '">' +
      a(
        "/projects/" + p.slug,
        "block",
        figure(p.cover, { ratio: o.ratio, priority: o.priority, parallax: o.parallax == null ? 4 : o.parallax, delay: o.delay }) +
          '<div class="mt-4 flex items-start justify-between gap-6"><div>' +
          '<p class="eyebrow flex items-center gap-3 text-dim"><span data-idx>' + o.index + "</span>" + (p.isSample ? sampleTag() : "") + "</p>" +
          '<h3 class="font-display display-sm mt-1.5 transition-transform duration-700 ease-out-expo group-hover:translate-x-1.5">' + esc(p.title) + "</h3></div>" +
          '<div class="meta shrink-0 pt-4 text-right text-sub"><p>' + esc(cats) + "</p><p>" + esc(formatLocation(p.location)) + " · " + esc(formatYear(p.year)) + "</p></div></div>",
      ) +
      "</article>"
    );
  }

  /* ---------------- HOME ---------------- */
  const LETTERS = "JAWARC".split("");
  const SVG = 'viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false" class="hero-art"';

  function heroHTML() {
    const desc = site.descriptor.split(" & ");
    return (
      '<section id="hero" aria-label="Introduction" class="hero theme-dark relative bg-ink text-fg">' +
      '<div class="sticky top-0 h-svh overflow-hidden">' +
      // back: sunlit interior behind the cut
      '<div data-depth="6" aria-hidden="true" class="hero-layer absolute -inset-[3%]"><div class="hero-plane h-full w-full">' +
      '<div class="hero-art" style="background:#f4f4f2"></div>' +
      "<svg data-g=\"detail\" " + SVG + ">" +
      '<defs><radialGradient id="hp-glow" cx="800" cy="300" r="560" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffffff" stop-opacity="1"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="hp-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4d4cf"/><stop offset="1" stop-color="#bdbdb7"/></linearGradient></defs>' +
      '<rect width="1600" height="1000" fill="url(#hp-glow)"/>' +
      '<rect x="640" y="360" width="320" height="14" fill="#161616"/><rect x="640" y="374" width="320" height="40" fill="#161616" opacity="0.08"/>' +
      '<rect x="738" y="0" width="14" height="834" fill="#161616"/><rect x="826" y="0" width="7" height="834" fill="#161616" opacity="0.8"/><rect x="878" y="0" width="20" height="834" fill="#161616"/>' +
      '<rect x="-400" y="834" width="2400" height="300" fill="url(#hp-floor)"/>' +
      '<polygon points="640,1000 748,834 842,834 800,1000" fill="#ffffff" opacity="0.55"/><polygon points="842,834 1000,834 1060,1000 900,1000" fill="#000" opacity="0.08"/>' +
      '<rect x="851" y="788" width="8" height="46" fill="#161616"/><circle cx="855" cy="780" r="5.5" fill="#161616"/></svg>' +
      "</div></div>" +
      // middle + near: wall planes and fins (each its own compositor layer)
      '<div data-depth="16" aria-hidden="true" class="hero-layer absolute -inset-[3%]"><div class="hero-walls h-full w-full relative">' +
      "<svg data-g=\"wl\" " + SVG + ">" +
      '<defs><linearGradient id="hw-l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#242424"/><stop offset="1" stop-color="#101010"/></linearGradient>' +
      '<linearGradient id="hw-slot-l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060606"/><stop offset="1" stop-color="#1c1c1c"/></linearGradient>' +
      '<pattern id="hw-boards-l" width="16" height="30" patternUnits="userSpaceOnUse"><rect y="29" width="16" height="1" fill="#ffffff" opacity="0.055"/></pattern></defs>' +
      '<rect x="-200" y="-100" width="840" height="1200" fill="url(#hw-l)"/><rect x="-200" y="-100" width="840" height="1200" fill="url(#hw-boards-l)"/>' +
      [60, 190, 320, 450].map((x) => '<g><rect x="' + x + '" y="130" width="54" height="470" fill="url(#hw-slot-l)"/><rect x="' + x + '" y="600" width="54" height="2" fill="#ffffff" opacity="0.14"/></g>').join("") +
      '<rect x="-200" y="676" width="840" height="9" fill="#2f2f2f"/><rect x="636" y="-100" width="4" height="1200" fill="#ffffff" opacity="0.09"/></svg>' +
      "<svg data-g=\"wr\" " + SVG + ">" +
      '<defs><linearGradient id="hw-r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0f0f0f"/><stop offset="1" stop-color="#262626"/></linearGradient>' +
      '<linearGradient id="hw-slot-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060606"/><stop offset="1" stop-color="#1c1c1c"/></linearGradient>' +
      '<pattern id="hw-boards-r" width="16" height="30" patternUnits="userSpaceOnUse"><rect y="29" width="16" height="1" fill="#ffffff" opacity="0.055"/></pattern></defs>' +
      '<rect x="960" y="-100" width="840" height="1200" fill="url(#hw-r)"/><rect x="960" y="-100" width="840" height="1200" fill="url(#hw-boards-r)"/>' +
      [190, 330, 470].map((y, i) => '<g><rect x="1030" y="' + y + '" width="' + (i === 1 ? 300 : 210) + '" height="64" fill="url(#hw-slot-r)"/><rect x="1030" y="' + (y + 64) + '" width="' + (i === 1 ? 300 : 210) + '" height="2" fill="#ffffff" opacity="0.14"/></g>').join("") +
      '<rect x="960" y="560" width="840" height="9" fill="#2f2f2f"/><rect x="960" y="-100" width="4" height="1200" fill="#ffffff" opacity="0.09"/></svg>' +
      "<svg data-g=\"fl\" " + SVG + '><rect x="548" y="-100" width="152" height="1200" fill="#080808"/><rect x="698" y="-100" width="2" height="1200" fill="#ffffff" opacity="0.2"/></svg>' +
      "<svg data-g=\"fr\" " + SVG + '><rect x="900" y="-100" width="152" height="1200" fill="#080808"/><rect x="900" y="-100" width="2" height="1200" fill="#ffffff" opacity="0.2"/></svg>' +
      "</div></div>" +
      // front: ground shadow
      '<div data-depth="30" aria-hidden="true" class="hero-layer absolute -inset-[3%]">' +
      "<svg data-g=\"ground\" " + SVG + '><defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.7"/></linearGradient></defs><rect y="700" width="1600" height="300" fill="url(#hg)"/></svg></div>' +
      // copy
      '<div class="pointer-events-none absolute inset-x-[var(--gutter)] bottom-[clamp(1.25rem,4.6vh,3rem)] z-10 text-white mix-blend-difference">' +
      '<div class="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">' +
      '<h1 data-g="wordmark" aria-label="' + esc(site.shortName) + '" class="font-brand order-2 text-[clamp(3.3rem,9vw,9.6rem)] font-normal uppercase leading-[0.88] tracking-[-0.02em] sm:order-1">' +
      LETTERS.map((c, i) => '<span aria-hidden="true" class="hero-letter inline-block overflow-hidden pb-[0.07em] align-top"><span style="--i:' + i + '">' + c + "</span></span>").join("") +
      "</h1>" +
      '<div data-g="copy" class="order-1 sm:order-2 sm:text-right"><p data-hero style="--d:1500" class="eyebrow max-w-[16rem] leading-relaxed">' +
      desc.map((part, i) => '<span class="block">' + esc(part) + (i < desc.length - 1 ? " &amp;" : "") + "</span>").join("") +
      "</p>" +
      a("/projects", "btn-nav btn-hero group pointer-events-auto mt-6", '<span>View projects</span>' + arrowIcon("h-[14px] w-[14px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"), 'data-cta="hero"') +
      "</div></div></div>" +
      "</div></section>"
    );
  }

  const SLOTS = [
    { cls: "lg:col-span-8", ratio: "3 / 2", par: 5 },
    { cls: "lg:col-span-4 lg:mt-[16vw]", ratio: "4 / 5", par: 8 },
    { cls: "lg:col-span-5 lg:col-start-2 lg:-mt-[2vw]", ratio: "4 / 5", par: 6 },
    { cls: "lg:col-span-6 lg:col-start-7 lg:mt-[9vw]", ratio: "3 / 2", par: 5 },
    { cls: "lg:col-span-12", ratio: "21 / 9", par: 8 },
  ];

  function featuredWorks() {
    const featured = getFeatured().slice(0, SLOTS.length);
    return section(
      "light",
      "pb-28 pt-24 lg:pb-44 lg:pt-36",
      '<div class="gutter-x"><div class="mb-16 flex flex-col gap-8 lg:mb-28 lg:flex-row lg:items-end lg:justify-between">' +
        "<div>" + splitText("Selected *work*", "h2", "font-display display-lg") + "</div>" +
        reveal("div", { cls: "lg:pb-3" },
          a("/projects", "group eyebrow inline-flex items-center gap-3 border-b border-current pb-1.5",
            "All projects (" + pad2(projects.length) + ")" + arrowIcon("group-hover:translate-x-0.5 group-hover:-translate-y-0.5"), '')) +
        "</div>" +
        '<div class="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-y-20">' +
        featured.map((p, i) => projectCard(p, { index: pad2(i + 1), ratio: SLOTS[i].ratio, parallax: SLOTS[i].par, cls: SLOTS[i].cls + (i === featured.length - 1 ? " md:col-span-2" : "") })).join("") +
        "</div>" +
        reveal("div", { cls: "mt-20 flex justify-center lg:mt-32" },
          a("/projects", "btn btn-solid group", "<span>View all projects</span>" + ARROW, '')) +
        "</div>"
    );
  }

  function studioIntro() {
    const f = getFeatured();
    const image = (f[1] && f[1].hero) || (f[0] && f[0].hero);
    return section(
      "dark",
      "pt-28 lg:pt-44",
      '<div class="gutter-x grid gap-12 lg:grid-cols-12 lg:gap-10"><div class="lg:col-span-9 lg:col-start-4">' +
        '<h2 id="studio-heading" class="sr-only">Studio</h2>' +
        splitText(D.studio.intro, "p", "font-display text-[clamp(1.9rem,4.1vw,4rem)] leading-[1.06] tracking-[-0.02em]") +
        reveal("div", { delay: 200, cls: "mt-12" },
          a("/studio", "btn btn-ghost group", "<span>About the studio</span>" + ARROW, '')) +
        "</div></div>" +
        (image ? '<div class="mt-24 lg:mt-40">' + figure(image, { ratio: "21 / 9", parallax: 10 }) + "</div>" : "")
    );
  }

  function servicesSection() {
    return section(
      "dark",
      "py-28 lg:py-44",
      '<div class="gutter-x"><div class="mb-14 grid gap-8 lg:mb-24 lg:grid-cols-12 lg:gap-10">' +
        splitText("What the studio *does*", "h2", "font-display display-md lg:col-span-9 lg:col-start-4") +
        "</div><ul><li aria-hidden=\"true\">" + drawLine() + "</li>" +
        D.services
          .map((s, i) => {
            const inner =
              '<div class="group grid grid-cols-[2.25rem_1fr] items-baseline gap-x-4 gap-y-2 py-6 transition-[padding] duration-700 ease-out-expo hover:pl-3 sm:grid-cols-[3.5rem_1fr_auto] lg:grid-cols-12 lg:gap-x-10 lg:py-8">' +
              '<span class="eyebrow text-dim lg:col-span-3">' + pad2(i + 1) + "</span>" +
              '<span class="font-display display-md lg:col-span-5">' + esc(s.title) + "</span>" +
              '<span class="meta col-start-2 text-sub sm:col-start-auto lg:col-span-3">' + esc(s.description) + "</span>" +
              '<span class="hidden justify-self-end sm:block lg:col-span-1">' +
              (s.category ? arrowIcon("text-sub group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-main") : "") + "</span></div>";
            return (
              "<li>" +
              reveal("div", { variant: "fade", delay: i * 40 },
                s.category ? a("/projects?c=" + s.category, "block", inner, 'aria-label="' + esc(s.title) + ' — view related projects"') : inner) +
              drawLine(i * 60) + "</li>"
            );
          })
          .join("") +
        "</ul>" +
        reveal("div", { cls: "mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 lg:mt-20" },
          a("/contact", "btn btn-solid group", "<span>Discuss your project</span>" + ARROW, '') +
          '<span class="meta text-sub">Residential, commercial and interior briefs.</span>') +
        "</div>"
    );
  }

  /* Horizontal strip: native scrolling + drag + buttons */
  function dragScroller(items, label) {
    return (
      "<div>" +
      '<div data-scroller role="region" aria-label="' + esc(label) + '" tabindex="0" data-native-scroll-x ' +
      'class="no-scrollbar flex snap-x snap-proximity gap-6 overflow-x-auto px-[var(--gutter)] pb-2 lg:gap-8">' +
      items
        .map((it, i) => {
          const ratio = it.media.width / it.media.height;
          return (
            '<figure class="m-0 shrink-0 snap-start select-none" style="width:calc(clamp(15rem, 34vw, 30rem) * ' + Math.min(ratio, 1.6) + ')">' +
            figure(it.media, { ratio: "auto", delay: Math.min(i, 3) * 90, cls: "!aspect-auto h-[clamp(15rem,34vw,30rem)] w-full" }) +
            '<figcaption class="mt-3 flex items-center justify-between gap-4"><span class="meta text-main">' + esc(it.title) + "</span>" +
            '<span class="eyebrow flex items-center gap-2 text-sub">' + (it.isSample ? sampleTag() : "") + esc(it.kind) + "</span></figcaption></figure>"
          );
        })
        .join("") +
      '<div aria-hidden="true" class="w-[calc(var(--gutter)-1.5rem)] shrink-0"></div></div>' +
      '<div class="gutter-x mt-8 flex items-center gap-3">' +
      ["prev", "next"]
        .map(
          (d) =>
            '<button type="button" data-nudge="' + (d === "next" ? 1 : -1) + '" aria-label="' + (d === "next" ? "Scroll right" : "Scroll left") +
            '" class="grid h-12 w-12 place-items-center rounded-full border border-hair transition-colors hover:bg-main hover:text-page">' +
            '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"' + (d === "prev" ? ' class="rotate-180"' : "") +
            '><path d="M2 9h13M10 4l5 5-5 5" stroke="currentColor" stroke-width="1.2"/></svg></button>'
        )
        .join("") +
      "</div></div>"
    );
  }

  function artPreview() {
    const items = D.art.slice(0, 9).map((x) => ({ title: x.title, kind: ART_KIND[x.kind] || x.kind, media: x.media, isSample: x.isSample }));
    return section(
      "light",
      "py-28 lg:py-44",
      '<div class="gutter-x mb-14 flex flex-col gap-8 lg:mb-20 lg:flex-row lg:items-end lg:justify-between"><div>' +
        splitText("Sketches, studies & *experiments*", "h2", "font-display display-lg max-w-4xl") + "</div>" +
        a("/art", "btn btn-ghost group self-start lg:mb-3 lg:self-auto", "<span>Open the archive</span>" + ARROW, '') +
        "</div>" + dragScroller(items, "Art and explorations")
    );
  }

  /* Poster-first player */
  function videoPlayer(video, ratio) {
    ratio = ratio || "21 / 9";
    const has = !!(video.src || video.embed);
    return (
      '<div class="relative w-full overflow-hidden bg-ink" style="aspect-ratio:' + ratio + '" data-video="' + esc(video.id) + '">' +
      '<div class="absolute inset-0" data-poster>' + figure(video.poster, { ratio: ratio }) + "</div>" +
      '<div class="absolute inset-0 grid place-items-center bg-black/15" data-poster>' +
      (has
        ? '<button type="button" data-play="' + esc(video.id) + '" aria-label="Play ' + esc(video.title) + '" ' +
          'class="group grid h-24 w-24 place-items-center rounded-full border border-white/60 text-white backdrop-blur-[2px] transition-colors duration-500 hover:bg-white hover:text-black sm:h-28 sm:w-28">' +
          '<svg width="22" height="24" viewBox="0 0 22 24" fill="currentColor" aria-hidden="true"><path d="M2 1.5v21L20 12z"/></svg></button>'
        : '<p class="eyebrow rounded-full border border-white/40 bg-black/40 px-5 py-3 text-white">Video to be supplied</p>') +
      "</div></div>"
    );
  }
  function videoMeta(v) {
    return (
      '<div class="mt-5 flex flex-wrap items-baseline justify-between gap-3"><p class="font-display display-sm">' + esc(v.title) + "</p>" +
      '<p class="meta flex items-center gap-3 text-sub">' + (v.isSample ? sampleTag() : "") + esc(v.kind) +
      (v.duration ? " · " + esc(v.duration) : "") + (v.year ? " · " + v.year : "") + "</p></div>" +
      (v.description ? '<p class="meta mt-2 max-w-xl text-sub">' + esc(v.description) + "</p>" : "")
    );
  }
  function filmSection() {
    const videos = D.videos;
    const cur = videos[0];
    return section(
      "dark",
      "py-28 lg:py-44",
      '<div class="gutter-x mb-14 grid gap-8 lg:mb-20 lg:grid-cols-12 lg:gap-10">' +
        splitText("Selected *films*", "h2", "font-display display-lg lg:col-span-9 lg:col-start-4") + "</div>" +
        '<div class="gutter-x grid gap-10 lg:grid-cols-12 lg:gap-10" data-films>' +
        '<div class="lg:col-span-9"><div data-film-stage>' + videoPlayer(cur) + videoMeta(cur) + "</div></div>" +
        '<ol class="lg:col-span-3" aria-label="Films">' +
        videos
          .map(
            (v, i) =>
              '<li class="border-t border-hair last:border-b"><button type="button" data-film="' + i + '"' + (i === 0 ? ' aria-current="true"' : "") +
              ' class="' + (i === 0 ? "opacity-100" : "opacity-50 hover:opacity-100") +
              ' grid w-full grid-cols-[2rem_1fr] items-baseline gap-3 py-5 text-left transition-opacity duration-500">' +
              '<span class="eyebrow text-dim">' + pad2(i + 1) + '</span><span><span class="font-display display-sm block">' + esc(v.title) +
              '</span><span class="eyebrow mt-1 block text-sub">' + esc(v.kind) + "</span></span></button></li>"
          )
          .join("") +
        "</ol></div>"
    );
  }

  function contactCta() {
    return section(
      "light",
      "py-28 lg:py-44",
      '<div class="gutter-x grid gap-12 lg:grid-cols-12 lg:gap-10"><div class="lg:col-span-9 lg:col-start-4">' +
        splitText("Planning a *project?*", "h2", "font-display display-xl") +
        reveal("div", { delay: 150, cls: "mt-14 flex flex-wrap items-center gap-x-10 gap-y-6" },
          a("/contact", "btn btn-solid btn-lg group", "<span>Send an enquiry</span>" + ARROW, '') +
          (C.email ? '<a href="mailto:' + esc(C.email) + '" class="meta underline decoration-hair underline-offset-[6px] hover:decoration-current">' + esc(C.email) + "</a>" : "")) +
        "</div></div>"
    );
  }

  const homeView = () => heroHTML() + featuredWorks() + studioIntro() + servicesSection() + artPreview() + filmSection() + contactCta();

  /* ---------------- PROJECTS (archive) ---------------- */
  const RHYTHM = [
    { span: "lg:col-span-7", ratio: "3 / 2", offset: "" },
    { span: "lg:col-span-5", ratio: "4 / 5", offset: "lg:mt-[7vw]" },
    { span: "lg:col-span-5", ratio: "4 / 5", offset: "" },
    { span: "lg:col-span-7", ratio: "3 / 2", offset: "lg:mt-[7vw]" },
    { span: "lg:col-span-4", ratio: "4 / 5", offset: "" },
    { span: "lg:col-span-4", ratio: "4 / 5", offset: "lg:mt-[5vw]" },
    { span: "lg:col-span-4", ratio: "4 / 5", offset: "lg:mt-[10vw]" },
  ];
  const rhythmAt = (i) => RHYTHM[i % RHYTHM.length];

  const filterBtnCls = (active) =>
    cn("eyebrow group relative px-3 py-2.5 transition-colors duration-500", active ? "text-main" : "text-sub hover:text-main");
  const underlineCls = (active, hover) =>
    cn("absolute inset-x-3 bottom-1 h-px origin-left bg-current transition-transform duration-500 ease-out-expo", active ? "scale-x-100" : hover ? "scale-x-0 group-hover:scale-x-100" : "scale-x-0");
  const viewBtnCls = (active) =>
    cn("eyebrow rounded-full px-4 py-2 transition-colors duration-500", active ? "bg-main text-page" : "text-sub hover:text-main");

  function filterButtons(all, active, attr, hover) {
    return all
      .map(
        (f) =>
          '<button type="button" aria-pressed="' + (active === f.id) + '" ' + attr + '="' + f.id + '" class="' + filterBtnCls(active === f.id) + '">' +
          esc(f.label) + '<sup class="ml-1 text-[0.6rem] text-dim">' + pad2(f.count) + "</sup>" +
          '<span aria-hidden="true" data-ul class="' + underlineCls(active === f.id, hover) + '"></span></button>'
      )
      .join("");
  }

  function archiveItem(p, i, view) {
    if (view === "grid") {
      const r = rhythmAt(i);
      return '<li data-key="' + p.slug + '" class="' + cn(r.span, r.offset) + '">' + projectCard(p, { index: pad2(i + 1), ratio: r.ratio, priority: i < 2 }) + "</li>";
    }
    return (
      '<li data-key="' + p.slug + '" class="border-b border-hair first:border-t">' +
      a("/projects/" + p.slug,
        "group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 py-6 transition-[padding,opacity] duration-700 ease-out-expo hover:pl-3 lg:grid-cols-12 lg:gap-x-8 lg:py-8",
        '<span data-idx class="eyebrow text-dim lg:col-span-1">' + pad2(i + 1) + "</span>" +
          '<span class="font-display display-md flex flex-wrap items-center gap-x-4 lg:col-span-6">' + esc(p.title) + (p.isSample ? sampleTag() : "") + "</span>" +
          '<span class="meta col-start-2 text-sub lg:col-span-2 lg:col-start-auto">' + esc(p.categories.map(categoryLabel).join(" · ")) + "</span>" +
          '<span class="meta col-start-2 text-sub lg:col-span-2 lg:col-start-auto">' + esc(formatLocation(p.location)) + "</span>" +
          '<span class="meta col-start-2 text-sub lg:col-span-1 lg:col-start-auto lg:text-right">' + esc(formatYear(p.year)) + "</span>",
        'data-preview="' + p.slug + '"') +
      "</li>"
    );
  }
  const listCls = (view) =>
    view === "grid"
      ? "relative grid grid-cols-1 items-start gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-y-24"
      : "relative";

  function projectsViewBase(state) {
    const filters = categoryCounts();
    const all = [{ id: "all", label: "All", count: projects.length }].concat(filters);
    const visible = state.filter === "all" ? projects : projects.filter((p) => p.categories.indexOf(state.filter) >= 0);
    return section(
      "dark",
      "min-h-svh pt-[calc(var(--header-h)+5rem)] lg:pt-[calc(var(--header-h)+8rem)]",
      '<div class="gutter-x mb-16 grid gap-8 lg:mb-24 lg:grid-cols-12 lg:gap-10"><div class="lg:col-span-9 lg:col-start-4">' +
        splitText("Projects", "h1", "font-display display-xl") + "</div></div>" +
        '<div class="gutter-x" data-archive>' +
        '<div class="flex flex-col gap-6 border-y border-hair py-5 md:flex-row md:items-center md:justify-between">' +
        '<div role="group" aria-label="Filter projects by category" data-filters class="-mx-1 flex flex-wrap gap-x-1 gap-y-1">' + filterButtons(all, state.filter, "data-filter", true) + "</div>" +
        '<div class="flex items-center gap-6"><p class="meta text-sub" role="status" aria-live="polite" data-count>' + visible.length + " " + (visible.length === 1 ? "project" : "projects") + "</p>" +
        '<div role="group" aria-label="View" class="flex items-center gap-1 rounded-full border border-hair p-1">' +
        ["grid", "list"].map((v) => '<button type="button" aria-pressed="' + (state.view === v) + '" data-view="' + v + '" class="' + viewBtnCls(state.view === v) + '">' + (v === "grid" ? "Grid" : "List") + "</button>").join("") +
        "</div></div></div>" +
        '<div class="pb-28 pt-12 lg:pb-44 lg:pt-20" data-results>' +
        (visible.length === 0
          ? '<p class="meta py-24 text-sub">No projects in this category yet.</p>'
          : '<ul data-list class="' + listCls(state.view) + '">' + visible.map((p, i) => archiveItem(p, i, state.view)).join("") + "</ul>") +
        "</div></div>" +
        '<div id="hover-preview" aria-hidden="true" class="pointer-events-none fixed left-0 top-0 z-[60] hidden lg:block"><div data-hp class="relative -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-surface transition-[opacity,clip-path] duration-500 ease-out-expo" style="width:clamp(14rem, 22vw, 22rem);aspect-ratio:1.5;opacity:0;clip-path:inset(12% 12% 12% 12%)"></div></div>'
    );
  }

  const projectsView = (s) => projectsViewBase(s) + contactCta();

  /* ---------------- PROJECT DETAIL ---------------- */
  const ratioFor = (m, min) => {
    const r = m.width / m.height;
    return min > 1 ? Math.max(r, min) + " / 1" : m.width + " / " + m.height;
  };

  function compareSlider(c) {
    const ratio = c.after.width + " / " + c.after.height;
    return (
      '<div data-compare class="relative w-full select-none overflow-hidden" style="aspect-ratio:' + ratio + '">' +
      '<div class="absolute inset-0">' + figure(c.after, { ratio: ratio }) + "</div>" +
      '<div data-compare-before class="absolute inset-0" style="clip-path:inset(0 50% 0 0)">' + figure(c.before, { ratio: ratio }) + "</div>" +
      '<span class="eyebrow pointer-events-none absolute left-4 top-4 bg-ink/70 px-3 py-1.5 text-fg">' + esc(c.labels[0]) + "</span>" +
      '<span class="eyebrow pointer-events-none absolute right-4 top-4 bg-ink/70 px-3 py-1.5 text-fg">' + esc(c.labels[1]) + "</span>" +
      '<input type="range" min="0" max="100" step="0.5" value="50" aria-label="Compare ' + esc(c.labels[0]) + " and " + esc(c.labels[1]) +
      '" class="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0" style="touch-action:pan-y">' +
      '<div aria-hidden="true" data-compare-handle class="pointer-events-none absolute inset-y-0 z-[5] w-px bg-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-white" style="left:50%">' +
      '<span class="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-black/50 text-white backdrop-blur-sm">' +
      '<svg width="22" height="12" viewBox="0 0 22 12" fill="none"><path d="M6 1L1 6l5 5M16 1l5 5-5 5" stroke="currentColor" stroke-width="1.2"/></svg></span></div></div>'
    );
  }

  function chapterHTML(c, lb) {
    const add = (m) => lb.items.push(m) - 1;
    switch (c.type) {
      case "full": {
        return '<div class="mt-24 lg:mt-40">' + figure(c.media, { ratio: ratioFor(c.media, 2.1), parallax: 8, lb: add(c.media) }) + caption(c.media) + "</div>";
      }
      case "pair": {
        const right = c.offset !== "left";
        const ia = add(c.media[0]);
        const ib = add(c.media[1]);
        return (
          '<div class="gutter-x mt-24 grid grid-cols-1 gap-8 lg:mt-40 lg:grid-cols-12 lg:gap-10">' +
          '<div class="' + cn("lg:col-span-7", right ? "" : "lg:order-2 lg:col-start-6") + '">' + figure(c.media[0], { parallax: 5, lb: ia }) + caption(c.media[0]) + "</div>" +
          '<div class="' + cn("lg:col-span-4 lg:mt-[12vw]", right ? "lg:col-start-9" : "lg:order-1 lg:col-start-1 lg:row-start-1") + '">' + figure(c.media[1], { parallax: 9, delay: 120, lb: ib }) + caption(c.media[1]) + "</div></div>"
        );
      }
      case "trio": {
        return (
          '<div class="gutter-x mt-24 grid grid-cols-1 gap-8 md:grid-cols-3 lg:mt-40 lg:gap-10">' +
          c.media.map((m, i) =>
            '<div class="' + (i === 1 ? "md:mt-[8vw]" : i === 2 ? "md:mt-[3vw]" : "") + '">' +
            figure(m, { ratio: ratioFor(m, 0.8), parallax: 4 + i * 3, delay: i * 110, lb: add(m) }) + caption(m) + "</div>").join("") + "</div>"
        );
      }
      case "text-image": {
        const left = c.side !== "right";
        const idx = add(c.media);
        return (
          '<div class="gutter-x mt-24 grid grid-cols-1 items-center gap-10 lg:mt-40 lg:grid-cols-12 lg:gap-10">' +
          '<div class="' + cn("lg:col-span-4", left ? "lg:order-1 lg:col-start-2" : "lg:order-2 lg:col-start-8") + '">' +
          (c.heading ? splitText(c.heading, "h3", "font-display display-md") : "") +
          reveal("p", { delay: 150, cls: "lede mt-6 max-w-md text-sub" }, esc(c.body)) + "</div>" +
          '<div class="' + cn("lg:col-span-6", left ? "lg:order-2 lg:col-start-7" : "lg:order-1 lg:col-start-1") + '">' + figure(c.media, { parallax: 6, lb: idx }) + caption(c.media) + "</div></div>"
        );
      }
      case "sticky": {
        return (
          '<div class="gutter-x mt-24 grid grid-cols-1 gap-10 lg:mt-40 lg:grid-cols-12 lg:gap-10"><div class="lg:col-span-4">' +
          '<div class="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">' +
          (c.heading ? splitText(c.heading, "h3", "font-display display-md") : "") +
          reveal("p", { delay: 150, cls: "lede mt-6 max-w-sm text-sub" }, esc(c.body)) + "</div></div>" +
          '<div class="flex flex-col gap-8 lg:col-span-7 lg:col-start-6 lg:gap-14">' +
          c.media.map((m) => "<div>" + figure(m, { parallax: 4, lb: add(m) }) + caption(m) + "</div>").join("") + "</div></div>"
        );
      }
      case "drawings": {
        const n = c.media.length;
        return (
          '<section class="theme-light relative mt-28 bg-page py-24 text-main lg:mt-48 lg:py-40" aria-label="' + esc(c.title || "Drawings") + '"><div class="gutter-x">' +
          '<div class="mb-14 flex items-end justify-between gap-6 lg:mb-20">' + splitText(c.title || "Drawings", "h3", "font-display display-lg") + "</div>" +
          '<div class="' + cn("grid grid-cols-1 gap-8 lg:gap-12", n === 1 ? "lg:mx-auto lg:max-w-5xl" : n === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3") + '">' +
          c.media.map((m, i) => '<div><div class="border border-hair">' + figure(m, { delay: i * 100, lb: add(m) }) + "</div>" + caption(m) + "</div>").join("") +
          "</div></div></section>"
        );
      }
      case "compare": {
        add(c.before);
        add(c.after);
        return (
          '<div class="gutter-x mt-24 lg:mt-40">' +
          (c.title ? '<div class="mb-8 flex items-baseline justify-between gap-6">' + splitText(c.title, "h3", "font-display display-md") + "</div>" : "") +
          compareSlider(c) + "</div>"
        );
      }
      case "video": {
        return (
          '<div class="gutter-x mt-24 lg:mt-40">' + videoPlayer(c.video) +
          '<div class="mt-4 flex flex-wrap items-center justify-between gap-3"><p class="font-display display-sm">' + esc(c.video.title) + "</p>" +
          '<p class="meta flex items-center gap-3 text-sub">' + (c.video.isSample ? sampleTag() : "") + esc(c.video.kind) + "</p></div></div>"
        );
      }
    }
    return "";
  }

  function projectView(slug) {
    const p = getProject(slug);
    if (!p) return { html: notFoundView(), items: [], title: "Page not found" };
    const adj = getAdjacent(slug);
    const hero = p.hero || p.cover;
    const facts = [
      ["Location", p.location == null ? tbc() : esc(p.location)],
      ["Category", esc(p.categories.map(categoryLabel).join(", "))],
      ["Year", p.year == null ? tbc() : String(p.year)],
      ["Status", p.status == null ? tbc() : esc(p.status)],
    ];
    const lb = { items: [hero] };
    const chapters = p.chapters.map((c) => chapterHTML(c, lb)).join("");
    const specRows = [{ label: "Area", value: p.area }].concat(p.specs.map((s) => ({ label: s.label, value: s.value })));
    const html =
      "<article>" +
      section(
        "dark",
        "pt-[calc(var(--header-h)+4rem)] lg:pt-[calc(var(--header-h)+7rem)]",
        '<div class="gutter-x">' +
          eyebrow(esc(p.typology) + (p.isSample ? sampleTag("ml-1") : ""), "mb-8") +
          splitText(p.title, "h1", "font-display display-xl max-w-[16ch]") +
          reveal("dl", { delay: 250, cls: "mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-hair pt-6 lg:mt-24 lg:grid-cols-4" },
            facts.map((f) => '<div><dt class="eyebrow text-sub">' + f[0] + '</dt><dd class="meta mt-1.5 text-main">' + f[1] + "</dd></div>").join("")) +
          "</div>" +
          '<div class="mt-12 lg:mt-16">' + figure(hero, { ratio: "2.1 / 1", priority: true, parallax: 10, cls: "min-h-[56svh] !aspect-auto sm:!aspect-[2.1/1]" }) + "</div>" +
          '<div class="gutter-x mt-24 grid gap-10 lg:mt-40 lg:grid-cols-12 lg:gap-10"><div class="lg:col-span-6 lg:col-start-4">' +
          p.description.map((para, i) => reveal("p", { delay: i * 80, cls: "lede mb-6 text-main" }, esc(para))).join("") + "</div>" +
          '<div class="lg:col-span-3"><p class="eyebrow mb-3 text-sub">Services</p><ul class="meta space-y-1 text-main">' + p.services.map((s) => "<li>" + esc(s) + "</li>").join("") + "</ul></div></div>" +
          chapters +
          '<div class="gutter-x mt-28 grid gap-10 lg:mt-48 lg:grid-cols-12 lg:gap-10"><dl class="lg:col-span-9 lg:col-start-4">' +
          specRows.map((r) => '<div class="grid grid-cols-[8rem_1fr] gap-4 border-t border-hair py-4 last:border-b sm:grid-cols-[14rem_1fr]"><dt class="meta text-sub">' + esc(r.label) + '</dt><dd class="meta text-main">' + (r.value == null ? tbc() : esc(r.value)) + "</dd></div>").join("") +
          "</dl></div>" +
          '<div class="gutter-x mt-24 grid gap-8 lg:mt-40 lg:grid-cols-12 lg:gap-10"><div class="lg:col-span-9 lg:col-start-4">' +
          reveal("p", { cls: "font-display display-md max-w-[18ch]" }, "Planning something similar?") +
          reveal("div", { delay: 120, cls: "mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" },
            a("/contact", "btn btn-solid group", "<span>Start a project</span>" + ARROW, '') +
            a("/projects", "btn btn-ghost group", "<span>More projects</span>" + ARROW, '')) +
          "</div></div>" + projectNav(adj.prev, adj.next, p.slug)
      ) +
      "</article>";
    return { html: html, items: lb.items, title: p.title };
  }

  function projectNav(prev, next, current) {
    if (!next || next.slug === current) return "";
    return (
      '<nav aria-label="More projects" class="mt-28 border-t border-hair lg:mt-48"><div class="gutter-x flex items-center justify-between py-6">' +
      (prev && prev.slug !== next.slug
        ? a("/projects/" + prev.slug, "group eyebrow flex items-center gap-3", arrowIcon("-rotate-90 group-hover:-translate-x-1") + '<span><span class="sr-only">Previous project: </span>' + esc(prev.title) + "</span>", '')
        : "<span></span>") +
      a("/projects", "eyebrow underline-offset-[6px] hover:underline", "All projects", '') + "</div>" +
      a("/projects/" + next.slug, "group block",
        '<div class="gutter-x pb-6 pt-10 lg:pt-16"><p class="eyebrow text-sub">Next project</p><p class="font-display display-xl mt-4 transition-transform duration-700 ease-out-expo group-hover:translate-x-3">' + esc(next.title) + "</p></div>" +
        '<div class="overflow-hidden">' + figure(next.hero || next.cover, { ratio: "3.2 / 1", cls: "!aspect-[2/1] sm:!aspect-[3.2/1]" }) + "</div>",
        '') +
      "</nav>"
    );
  }

  /* ---------------- ART ---------------- */
  function artItem(x, i) {
    return (
      '<li data-key="' + x.id + '" class="mb-14 break-inside-avoid lg:mb-20">' +
      figure(x.media, { parallax: 0, lb: i }) +
      '<p class="meta mt-3 flex items-baseline justify-between gap-4"><span class="text-main"><span class="text-dim" data-idx>' + pad2(i + 1) + "</span>&ensp;" + esc(x.title) + "</span>" +
      '<span class="eyebrow flex items-center gap-2 text-[0.65rem] text-sub">' + (x.isSample ? sampleTag() : "") + esc(ART_KIND[x.kind]) + "</span></p>" +
      (x.medium || x.year ? '<p class="meta text-dim">' + esc([x.medium, x.year].filter(Boolean).join(" · ")) + "</p>" : "") +
      "</li>"
    );
  }
  function artViewBase() {
    const filters = artKindCounts();
    const all = [{ id: "all", label: "All", count: D.art.length }].concat(filters);
    return section(
      "dark",
      "min-h-svh pb-28 pt-[calc(var(--header-h)+5rem)] lg:pb-44 lg:pt-[calc(var(--header-h)+8rem)]",
      '<div class="gutter-x mb-16 grid gap-8 lg:mb-24 lg:grid-cols-12 lg:gap-10"><div class="lg:col-span-9 lg:col-start-4">' +
        splitText("Art & *Experiments*", "h1", "font-display display-xl") + "</div></div>" +
        '<div class="gutter-x" data-art>' +
        '<div class="flex flex-wrap items-center justify-between gap-4 border-y border-hair py-5">' +
        '<div role="group" aria-label="Filter by type" data-art-filters class="-mx-1 flex flex-wrap gap-y-1">' + filterButtons(all, "all", "data-art-filter", false) + "</div>" +
        '<p class="meta text-sub" role="status" aria-live="polite" data-count>' + D.art.length + " plates</p></div>" +
        '<ul data-list class="relative mt-12 gap-x-8 [column-fill:balance] sm:columns-2 lg:mt-20 lg:columns-3 lg:gap-x-12">' + D.art.map(artItem).join("") + "</ul></div>"
    );
  }

  const artView = () => artViewBase() + contactCta();

  /* ---------------- STUDIO ---------------- */
  function studioView() {
    const arch = D.studio.architect;
    return section(
      "dark",
      "pt-[calc(var(--header-h)+5rem)] lg:pt-[calc(var(--header-h)+8rem)]",
      '<div class="gutter-x grid gap-8 lg:grid-cols-12 lg:gap-10"><div class="lg:col-span-9 lg:col-start-4">' +
        splitText(D.studio.intro, "h1", "font-display text-[clamp(2rem,4.4vw,4.2rem)] leading-[1.06] tracking-[-0.02em]") + "</div></div>" +
        // architect
        '<div class="gutter-x mt-28 grid gap-12 lg:mt-48 lg:grid-cols-12 lg:gap-10"><div class="lg:col-span-4 lg:col-start-4">' +
        figure(arch.portrait, { ratio: "4 / 5", parallax: 4 }) + (D.studio.photographsAreSample && C.showSampleTags ? '<p class="mt-3">' + sampleTag() + "</p>" : "") + "</div>" +
        '<div class="lg:col-span-4 lg:col-start-9 lg:pt-4"><p class="font-display display-md">' + (arch.name ? esc(arch.name) : tbc("Name to be supplied")) + "</p>" +
        '<p class="eyebrow mt-3 text-sub">' + esc(arch.role) + "</p>" +
        reveal("p", { delay: 120, cls: "lede mt-8 text-sub" }, arch.bio ? esc(arch.bio) : tbc("Profile to be supplied by the architect.")) + "</div></div>" +
        // practice
        '<div class="gutter-x mt-28 grid gap-10 lg:mt-48 lg:grid-cols-12 lg:gap-10"><div class="lg:col-span-7 lg:col-start-4">' +
        D.studio.practice.map((p, i) => reveal("p", { delay: i * 80, cls: "lede mb-5 text-sub" }, tbc(p))).join("") + "</div></div>" +
        // services
        '<div class="gutter-x mt-28 grid gap-10 lg:mt-48 lg:grid-cols-12 lg:gap-10"><ul class="lg:col-span-9 lg:col-start-4"><li aria-hidden="true">' + drawLine() + "</li>" +
        D.services.map((s) =>
          '<li><div class="grid grid-cols-1 gap-1 py-5 sm:grid-cols-[1fr_1.2fr] sm:gap-8"><p class="font-display display-sm">' + esc(s.title) + '</p><p class="meta text-sub">' + esc(s.description) + "</p></div>" + drawLine() + "</li>").join("") +
        "</ul></div>" +
        // photographs
        '<div class="gutter-x mt-28 lg:mt-48">' + (D.studio.photographsAreSample && C.showSampleTags ? '<div class="mb-10 flex items-center gap-4">' + sampleTag() + "</div>" : "") +
        '<div class="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">' +
        '<div class="md:col-span-7">' + figure(D.studio.photographs[0], { parallax: 5 }) + "</div>" +
        '<div class="md:col-span-4 md:col-start-9 md:mt-[10vw]">' + figure(D.studio.photographs[1], { parallax: 8, delay: 120 }) + "</div>" +
        '<div class="md:col-span-8 md:col-start-3">' + figure(D.studio.photographs[2], { parallax: 5 }) + "</div></div></div>" +
        // contact
        '<div class="gutter-x mt-28 grid gap-10 pb-28 lg:mt-48 lg:grid-cols-12 lg:gap-10 lg:pb-44"><div class="lg:col-span-6 lg:col-start-4">' + contactList() +
        a("/contact", "btn btn-solid group mt-10", "<span>Start a project with " + esc(site.shortName) + "</span>" + ARROW, '') + "</div></div>"
    );
  }

  /* ---------------- CONTACT ---------------- */
  const inputCls =
    "block w-full border-0 border-b border-hair bg-transparent px-0 py-3 text-base text-main placeholder:text-dim transition-colors focus:border-main focus:outline-none aria-[invalid=true]:border-main";
  const field = (label, name, control) =>
    '<div data-field="' + name + '"><label class="block"><span class="eyebrow text-sub">' + label + "</span>" + control + '</label><p id="err-' + name + '" data-err class="meta mt-2 text-main" hidden></p></div>';
  const ENQUIRY_TYPES = ["New building", "Interior design", "Renovation or extension", "Commercial space", "Something else"];

  function contactView() {
    return section(
      "dark",
      "min-h-svh pb-28 pt-[calc(var(--header-h)+5rem)] lg:pb-44 lg:pt-[calc(var(--header-h)+8rem)]",
      '<div class="gutter-x grid gap-16 lg:grid-cols-12 lg:gap-10"><div class="lg:col-span-5">' +
        splitText("Start a *conversation*", "h1", "font-display display-lg") +
        '<div class="mt-14 lg:mt-24">' + contactList() + "</div></div>" +
        '<div class="lg:col-span-6 lg:col-start-7 lg:pt-16">' +
        '<form data-enquiry novalidate aria-describedby="form-status" class="space-y-9">' +
        field("Name", "name", '<input name="name" type="text" autocomplete="name" required class="' + inputCls + '">') +
        '<div class="grid gap-9 sm:grid-cols-2">' +
        field("Email", "email", '<input name="email" type="email" autocomplete="email" required class="' + inputCls + '">') +
        field("Phone (optional)", "phone", '<input name="phone" type="tel" autocomplete="tel" class="' + inputCls + '">') + "</div>" +
        field("Enquiry about", "type",
          '<select name="type" required class="' + inputCls + ' appearance-none bg-transparent"><option value="" selected disabled class="bg-ink">Select</option>' +
          ENQUIRY_TYPES.map((t) => '<option value="' + esc(t) + '" class="bg-ink">' + esc(t) + "</option>").join("") + "</select>") +
        field("Project", "message", '<textarea name="message" rows="5" required class="' + inputCls + ' resize-y"></textarea>') +
        '<div aria-hidden="true" class="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Company<input name="company" type="text" tabindex="-1" autocomplete="off"></label></div>' +
        '<div class="flex flex-wrap items-center gap-6"><button type="submit" class="eyebrow rounded-full bg-main px-8 py-4 text-page transition-transform duration-500 ease-out-expo hover:scale-[1.03] disabled:opacity-50">Send enquiry</button></div>' +
        '<div id="form-status" data-status tabindex="-1" role="status" aria-live="polite" class="outline-none"></div>' +
        "</form></div></div>"
    );
  }

  function notFoundView() {
    return section(
      "dark",
      "flex min-h-svh items-end pb-24 pt-40",
      '<div class="gutter-x w-full">' + eyebrow("404") + '<h1 class="font-display display-xl mt-6">Not found</h1>' +
        '<p class="lede mt-6 max-w-md text-sub">This page doesn’t exist, or has moved.</p>' +
        a("/projects", "eyebrow mt-10 inline-block border-b border-current pb-1.5", "View projects", '') + "</div>"
    );
  }

  window.JV = {
    projects, getProject, categoryCounts, artKindCounts, categoryLabel, ART_KIND,
    headerHTML, footerHTML, homeView, projectsView, projectView, artView, studioView, contactView, notFoundView,
    archiveItem, artItem, listCls, rhythmAt, filterBtnCls, underlineCls, viewBtnCls, filterButtons, videoPlayer, videoMeta,
  };
})();
