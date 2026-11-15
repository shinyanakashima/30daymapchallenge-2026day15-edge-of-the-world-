(() => {
  "use strict";

  // ---------- constants ----------
  const CLIP = 178.5; // degrees from the centre that are drawn
  const EARTH_R = 6371; // km
  const CIRCLE_KM = 500;
  const DEFAULT = { lat: 51.45, lon: -2.58, name: "Bristol", ja: "ブリストル", country: "United Kingdom" };
  const REF_CITIES = [
    { name: "Tokyo", ja: "東京", lat: 35.687, lon: 139.749 },
    { name: "New York", ja: "ニューヨーク", lat: 40.752, lon: -73.982 },
    { name: "London", ja: "ロンドン", lat: 51.502, lon: -0.119 },
    { name: "Sydney", ja: "シドニー", lat: -33.918, lon: 151.183 },
    { name: "São Paulo", ja: "サンパウロ", lat: -23.557, lon: -46.627 },
    { name: "Cairo", ja: "カイロ", lat: 30.052, lon: 31.248 },
    { name: "Mumbai", ja: "ムンバイ", lat: 19.017, lon: 72.857 },
    { name: "Mexico City", ja: "メキシコシティ", lat: 19.442, lon: -99.131 },
  ];
  const COLORS = {
    outside: "#1d242a",
    ocean: "#cad9de",
    graticule: "rgba(35, 70, 88, 0.22)",
    land: "#f4f0e6",
    border: "rgba(110, 104, 90, 0.55)",
    circleFill: "rgba(194, 65, 45, 0.22)",
    circleStroke: "rgba(160, 45, 30, 0.85)",
    edge: "#c2412d",
    edgeText: "#f2d9d3",
    city: "#23313a",
    centre: "#23313a",
    me: "#1f6fb2",
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ---------- strings ----------
  const STR = {
    en: {
      kicker: "#30DayMapChallenge 2026 · Day 15 · Inside out",
      title: "Your town, the edge of the world",
      lede: "Slide to turn the map inside out. Your town ends up all the way around the outside of the world.",
      yourTown: "Your town",
      townOnMap: (n) => `${n} (your town)`,
      searchLabel: "Search for a town",
      searchPlaceholder: "Change your town: search (e.g. New York)",
      useLocation: "Use where I am",
      circles: "Equal circles",
      flipNormal: "Normal",
      flipInside: "Inside out",
      flipLabel: "Turn the map inside out",
      play: "Play",
      pickBtn: "Make this your town",
      close: "Close",
      rulerNear: (n) => `${n}: 0 km`,
      rulerFar: "Farthest: 20,000 km",
      popNote: "You can also click a point on the map.",
      details: "Details",
      centreLabel: "Centre of the inside-out map",
      stretchCaption: "Stretch on the inside-out map (relative to the centre)",
      city: "City",
      distance: "From centre",
      length: "Length",
      area: "Area",
      formula: "Length ×&nbsp;2&nbsp;/&nbsp;(1&nbsp;+&nbsp;cos&nbsp;<i>c</i>), area × its square. <i>c</i> = angular distance from the centre.",
      circleLegend: "Every circle has the same 500 km radius on the ground.",
      about: "About this map",
      aboutH1: "What is wrong with this map",
      aboutP1: "This is a stereographic projection. It keeps angles correct, so small shapes look right, but sizes grow the farther you go from the centre.",
      aboutP2: "On a Mercator map, things get bigger the farther they are from the equator. On this map, things get bigger the farther they are from the centre.",
      aboutP3: "At the left end of the slider the map is centred on your town, like an ordinary map. Moving the slider turns the centre away, until it reaches the point on the exact opposite side of the Earth. In this projection the point opposite the centre is stretched to infinite size, so your town can no longer be drawn as a point: it wraps around the whole map as its outer edge. The area within 500 km of it (the red band) then fills 89% of the map, and the rest of the world is squeezed into the middle.",
      notesH: "Notes",
      note1: "The map is cut at 178.5° from the centre. On the inside-out map, the small area within 1.5° (about 170 km) of your town cannot be drawn; the outer circle stands for it.",
      note2: "Your location is used only inside your browser. It is not sent anywhere and not saved. It is not written to the address bar.",
      note3: 'Data: <a href="https://www.naturalearthdata.com/">Natural Earth</a> (public domain): Admin 0 countries 1:110m and 1:50m (via <a href="https://github.com/topojson/world-atlas">world-atlas</a>), Populated Places 1:10m.',
      credit: 'Data: <a href="https://www.naturalearthdata.com/">Natural Earth</a>',
      ocean: "Ocean",
      land: "Land",
      edgeRow: "the edge",
      noResults: "No matching town",
      myLocation: "Where you are",
      myLocationInline: "where you are",
      pointName: "Point on the map",
      theSelected: "your town",
      shareCaption: (n, m, e) => [`${m}% of this map is within 500 km of ${n}`, `That area is ${e}% of the Earth's surface.`],
      near: "near",
      geoUnsupported: "This browser cannot provide a location.",
      geoWaiting: "Getting your location…",
      geoDenied: "Location permission was not given.",
      geoFailed: "Could not get your location.",
      geoUsed: "Your location is used only in this browser. It is not sent or saved.",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      mapLabel: (n) => `Stereographic world map that turns inside out: ${n} becomes the outer edge of the world.`,
    },
    ja: {
      kicker: "#30DayMapChallenge 2026 · Day 15 · Inside out",
      title: "あなたの町が、世界の果てになる",
      lede: "スライダーで地図を裏返すと、あなたの町が世界の外周になります。",
      yourTown: "あなたの町",
      townOnMap: (n) => `${n}（あなたの町）`,
      searchLabel: "町を検索",
      searchPlaceholder: "あなたの町を変える：検索（例：帯広、New York）",
      useLocation: "現在地にする",
      circles: "同じ大きさの円",
      flipNormal: "ふつう",
      flipInside: "裏返し",
      flipLabel: "地図を裏返す",
      play: "再生",
      pickBtn: "ここをあなたの町にする",
      close: "閉じる",
      rulerNear: (n) => `${n}：0 km`,
      rulerFar: "いちばん遠い：20,000 km",
      popNote: "地図上の地点をクリックしても選べます。",
      details: "詳細",
      centreLabel: "裏返した地図の中心",
      stretchCaption: "裏返した地図での伸び率（中心を1とする）",
      city: "都市",
      distance: "中心から",
      length: "長さ",
      area: "面積",
      formula: "長さは 2&nbsp;/&nbsp;(1&nbsp;+&nbsp;cos&nbsp;<i>c</i>) 倍、面積はその2乗倍。<i>c</i> は中心からの角距離。",
      circleLegend: "どの円も、地上では同じ半径500 kmです。",
      about: "この地図について",
      aboutH1: "この地図のどこがおかしいか",
      aboutP1: "これはステレオ図法（平射図法）の世界地図です。角度が正しい図法なので小さな形は正しく見えますが、中心から離れるほど大きく描かれます。",
      aboutP2: "メルカトル図法では赤道から離れるほど大きくなります。この地図では、中心から離れるほど大きくなります。",
      aboutP3: "スライダーの左端では、あなたの町を中心にしたふつうの地図です。スライダーを動かすと中心が移っていき、右端で地球のちょうど裏側の地点に着きます。この図法では中心の裏側の点が無限大に引き伸ばされるので、あなたの町は点として描けなくなり、地図全体を囲む外周になります。このとき、町から500 km以内（赤い帯）が地図の89%を占め、残りの世界は中央に押し込まれます。",
      notesH: "注記",
      note1: "中心から178.5°より外側は切り取っています。裏返した地図では、あなたの町から1.5°（約170 km）以内は描けないため、外周の円がその場所を表します。",
      note2: "位置情報はブラウザの中だけで使い、どこにも送信せず、保存もしません。アドレスバーにも書き込みません。",
      note3: '出典：<a href="https://www.naturalearthdata.com/">Natural Earth</a>（パブリックドメイン）。国境 1:110m・1:50m（<a href="https://github.com/topojson/world-atlas">world-atlas</a> 経由）、Populated Places 1:10m。',
      credit: '出典：<a href="https://www.naturalearthdata.com/">Natural Earth</a>',
      ocean: "海",
      land: "陸",
      edgeRow: "外周",
      noResults: "該当する町がありません",
      myLocation: "現在地",
      myLocationInline: "現在地",
      pointName: "地図上の地点",
      theSelected: "あなたの町",
      shareCaption: (n, m, e) => [`この地図の${m}%は、${n}から500 km以内`, `地球の表面では、わずか${e}%の範囲です`],
      near: "付近",
      geoUnsupported: "このブラウザでは位置情報を使えません。",
      geoWaiting: "現在地を取得しています…",
      geoDenied: "位置情報の利用が許可されませんでした。",
      geoFailed: "現在地を取得できませんでした。",
      geoUsed: "位置情報はこのブラウザの中だけで使い、送信・保存はしません。",
      zoomIn: "拡大",
      zoomOut: "縮小",
      mapLabel: (n) => `裏返るステレオ図法の世界地図。${n}が世界の外周になります。`,
    },
  };
  let lang = "en";
  try { if (localStorage.getItem("lang") === "ja") lang = "ja"; } catch (e) { /* storage unavailable */ }
  const t = (k) => STR[lang][k];

  // ---------- DOM ----------
  const $ = (id) => document.getElementById(id);
  const canvas = $("map");
  const ctx = canvas.getContext("2d");
  const els = {
    q: $("q"), results: $("results"), geo: $("geo"), circles: $("circles"),
    zoomIn: $("zoomIn"), zoomOut: $("zoomOut"), status: $("status"), flip: $("flip"), play: $("play"),
    selName: $("selName"), selCoord: $("selCoord"), ctrCoord: $("ctrCoord"), ctrKind: $("ctrKind"),
    stretchBody: $("stretchBody"), circleLegend: $("circleLegend"),
    townBtn: $("townBtn"), townPop: $("townPop"), details: $("details"), about: $("about"),
    detailsBtn: $("detailsBtn"), aboutBtn: $("aboutBtn"),
  };

  // ---------- state ----------
  const state = {
    sel: { ...DEFAULT, source: "default" }, // your town
    t: 0, // 0 = ordinary map centred on your town, 1 = inside out (centred on the opposite side)
    centre: [DEFAULT.lon, DEFAULT.lat], // [lon, lat], derived from sel and t
    k: 1, // zoom set by the viewer, on top of the automatic zoom
    tx: 0, ty: 0, // pan set by the viewer (d3.zoom transform)
    showCircles: false,
    myLoc: null, // [lon, lat], kept in memory only
  };
  let world110 = null, world50 = null; // { land, borders, countries }
  let places = null, searchIndex = null, countryLabels = null;
  let width = 0, height = 0, dpr = 1, cx = 0, cy = 0, baseScale = 1;
  let ox = 0, oy = 0; // where the map centre is on screen (after the viewer's pan and zoom)
  let anim = null, playTimer = 0;

  const projection = d3.geoStereographic().clipAngle(CLIP).precision(0.4);
  const path = d3.geoPath(projection, ctx);
  const graticule = d3.geoGraticule10();
  const circleGen = d3.geoCircle().radius((CIRCLE_KM / EARTH_R) * 180 / Math.PI).precision(3);
  // Equal circles placed at fixed angular distances from the map centre, so the
  // growth toward the edge reads along each radius.
  const TISSOT_C = [0, 45, 90, 120, 145, 160, 168, 173];
  function tissotCircles() {
    const rot = d3.geoRotation([-state.centre[0], -state.centre[1]]);
    const out = [];
    TISSOT_C.forEach((cDeg, i) => {
      const n = cDeg === 0 ? 1 : 8;
      for (let j = 0; j < n; j++) {
        const a = ((j * 45 + (i % 2) * 22.5) * Math.PI) / 180;
        const c = (cDeg * Math.PI) / 180;
        const lat = Math.asin(Math.cos(a) * Math.sin(c));
        const lon = Math.atan2(Math.sin(a) * Math.sin(c), Math.cos(c));
        out.push(circleGen.center(rot.invert([(lon * 180) / Math.PI, (lat * 180) / Math.PI]))());
      }
    });
    return out;
  }

  // ---------- helpers ----------
  const RAD = Math.PI / 180;
  function antipode(lon, lat) {
    return [wrapLon(lon + 180), -lat];
  }
  function wrapLon(lon) {
    return ((((lon + 180) % 360) + 360) % 360) - 180;
  }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function fmtLat(v) { return `${Math.abs(v).toFixed(2)}°${v >= 0 ? "N" : "S"}`; }
  function fmtLon(v) { return `${Math.abs(v).toFixed(2)}°${v >= 0 ? "E" : "W"}`; }
  function fmtCoord(lat, lon) { return `${fmtLat(lat)}, ${fmtLon(lon)}`; }
  function fmtFactor(v) {
    if (!isFinite(v)) return "∞";
    if (v < 10) return `×${v.toFixed(2)}`;
    if (v < 100) return `×${v.toFixed(1)}`;
    if (v < 1e7) return `×${Math.round(v).toLocaleString("en-US")}`;
    const e = Math.floor(Math.log10(v));
    return `×${(v / 10 ** e).toFixed(1)}e${e}`;
  }
  function norm(s) {
    return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  }
  function displayName(sel) {
    if (sel.source === "geo") return t("myLocation");
    if (lang === "ja" && sel.ja) return sel.ja;
    if (sel.name) return sel.name;
    return t("pointName");
  }
  function shortName() {
    const s = state.sel;
    if (s.source === "geo") return t("myLocationInline");
    return (lang === "ja" ? s.ja : s.name) || t("theSelected");
  }
  function setStatus(msg) { els.status.textContent = msg || ""; }

  // ---------- turning inside out ----------
  // The centre travels from your town along a great circle heading east, 180° to the
  // opposite side. Heading east keeps the path away from the poles (unless the town
  // is at a pole), so the map turns without sudden flips.
  function centreFor(sel, tt) {
    const d = Math.PI * tt, th = Math.PI / 2;
    const p1 = sel.lat * RAD, l1 = sel.lon * RAD;
    const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(th));
    const l2 = l1 + Math.atan2(Math.sin(th) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
    return [wrapLon(l2 / RAD), p2 / RAD];
  }
  // Zoom chosen so that your town moves steadily from the centre (t = 0) out to
  // the edge circle (t = 1): its distance from the centre on screen is t times the
  // final edge radius. At t = 0 this shows about 115° around your town, like an
  // ordinary map.
  function autoK(tt) {
    const edge = Math.tan((CLIP / 2) * RAD);
    const half = Math.min(90 * tt, CLIP / 2) * RAD; // half the angle from the centre to your town
    if (half < 1e-4) return edge / (Math.PI / 2);
    return Math.max(1, edge * tt / Math.tan(half));
  }
  function insideOut() { return state.t >= 0.999; }

  function setT(tt) {
    state.t = clamp01(tt);
    state.centre = centreFor(state.sel, state.t);
    els.flip.value = String(Math.round(state.t * 1000));
  }

  function stopPlay() {
    if (anim) { anim.stop(); anim = null; }
    clearTimeout(playTimer);
  }

  function playTo(target, duration) {
    stopPlay();
    if (reduceMotion.matches) { setT(target); render(false); updateInfo(); return; }
    const from = state.t;
    if (Math.abs(target - from) < 1e-4) { setT(target); render(false); updateInfo(); return; }
    const ms = duration * Math.abs(target - from);
    anim = d3.timer((elapsed) => {
      const u = Math.min(1, elapsed / ms);
      setT(from + (target - from) * d3.easeCubicInOut(u));
      if (u >= 1) { anim.stop(); anim = null; render(false); updateInfo(); }
      else render(true);
    });
  }

  // show your town as an ordinary map, then turn it inside out
  function playFromStart(delay) {
    stopPlay();
    if (reduceMotion.matches) { setT(1); render(false); updateInfo(); return; }
    setT(0);
    render(false);
    updateInfo();
    playTimer = setTimeout(() => playTo(1, 4200), delay);
  }

  // ---------- layout ----------
  function resize() {
    hatchPattern = null;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // the map fills the space between the two bars (and beside an open drawer on wide screens)
    const top = document.querySelector(".topbar").getBoundingClientRect().bottom;
    const bottom = document.querySelector(".bottombar").getBoundingClientRect().top;
    document.documentElement.style.setProperty("--top-h", `${top}px`);
    document.documentElement.style.setProperty("--bottom-h", `${height - bottom}px`);
    const drawerOpen = !els.details.hidden || !els.about.hidden;
    const left = 0;
    const availW = width - (drawerOpen && width >= 760 ? 380 : 0);
    cx = left + availW / 2;
    cy = (top + bottom) / 2;
    const margin = width < 760 ? 24 : 36;
    const radius = Math.max(60, Math.min(availW, bottom - top) / 2 - margin);
    baseScale = radius / Math.tan((CLIP / 2) * RAD); // d3 stereographic: r = scale · tan(c / 2)
    render();
  }

  function scaleNow() { return baseScale * autoK(state.t) * state.k; }

  // The viewer's pan and zoom follow d3.zoom's model (screen = k · p + [x, y]), with
  // the map laid out around (cx, cy) at k = 1, so wheel zoom stays under the pointer.
  function updateProjection() {
    ox = state.k * cx + state.tx;
    oy = state.k * cy + state.ty;
    projection
      .rotate([-state.centre[0], -state.centre[1]])
      .scale(scaleNow())
      .translate([ox, oy]);
  }

  // ---------- drawing ----------
  let rafId = 0, fullTimer = 0;
  function requestRender(fast) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => { rafId = 0; render(fast); });
    clearTimeout(fullTimer);
    if (fast) fullTimer = setTimeout(() => { if (!anim) render(false); }, 180);
  }

  function render(fast) {
    updateProjection();
    const world = (!fast && world50) || world110 || world50;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = COLORS.outside;
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath(); path({ type: "Sphere" });
    ctx.fillStyle = COLORS.ocean; ctx.fill();

    ctx.save();
    ctx.beginPath(); path({ type: "Sphere" }); ctx.clip();

    ctx.beginPath(); path(graticule);
    ctx.lineWidth = 0.6; ctx.strokeStyle = COLORS.graticule; ctx.stroke();

    if (world) {
      ctx.beginPath(); path(world.land);
      ctx.fillStyle = COLORS.land; ctx.fill();
      ctx.lineWidth = 0.6; ctx.strokeStyle = COLORS.border; ctx.stroke();
      ctx.beginPath(); path(world.borders);
      ctx.lineWidth = 0.5; ctx.stroke();
    }

    if (state.showCircles) {
      ctx.lineWidth = 1;
      for (const c of tissotCircles()) {
        ctx.beginPath(); path(c);
        ctx.fillStyle = COLORS.circleFill; ctx.fill();
        ctx.strokeStyle = COLORS.circleStroke; ctx.stroke();
      }
    }

    const boxes = [];
    drawShareBand();
    drawRings(boxes);
    drawTown(boxes);
    drawCities(boxes);
    if (!fast) drawCountryLabels(boxes);
    drawMyLocation();
    ctx.restore();

    drawEdge();
    drawShareCaption();
  }

  // The band within SHARE_KM of your town. On the inside-out map it takes most of
  // the disc, while on the globe it is a tiny patch.
  const SHARE_KM = 500;
  function shareNumbers() {
    const half = (CLIP / 2) * RAD;
    const rel = Math.tan((Math.PI - SHARE_KM / EARTH_R) / 2) / Math.tan(half);
    return { map: 1 - rel * rel, earth: (1 - Math.cos(SHARE_KM / EARTH_R)) / 2, rel };
  }
  function edgeRadius() { return scaleNow() * Math.tan((CLIP / 2) * RAD); }

  let hatchPattern = null;
  function hatch() {
    if (hatchPattern) return hatchPattern;
    const c = document.createElement("canvas");
    const n = Math.round(9 * dpr);
    c.width = c.height = n;
    const g = c.getContext("2d");
    g.strokeStyle = "rgba(194, 65, 45, 0.38)"; g.lineWidth = 1.1 * dpr;
    g.beginPath(); g.moveTo(-1, n + 1); g.lineTo(n + 1, -1); g.stroke();
    hatchPattern = ctx.createPattern(c, "repeat");
    hatchPattern.setTransform(new DOMMatrix([1 / dpr, 0, 0, 1 / dpr, 0, 0]));
    return hatchPattern;
  }

  function drawShareBand() {
    if (!insideOut()) return;
    const rEdge = edgeRadius(), r = rEdge * shareNumbers().rel;
    if (r > Math.hypot(width, height)) return;
    ctx.beginPath();
    ctx.arc(ox, oy, rEdge, 0, 2 * Math.PI);
    ctx.arc(ox, oy, r, 0, 2 * Math.PI, true);
    ctx.fillStyle = hatch(); ctx.fill();
    ctx.beginPath(); ctx.arc(ox, oy, r, 0, 2 * Math.PI);
    ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(194, 65, 45, 0.8)"; ctx.stroke();
  }

  function drawShareCaption() {
    if (!insideOut()) return;
    const rEdge = edgeRadius(), n = shareNumbers(), r = rEdge * n.rel;
    const y = oy + (r + rEdge) / 2;
    if (r > Math.hypot(width, height) || y > height - 10) return;
    const [l1, l2] = t("shareCaption")(shortName(), Math.round(n.map * 100), (n.earth * 100).toFixed(2));
    let fs = 14; // shrink to fit the band on small screens
    ctx.font = `700 ${fs}px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif`;
    while (fs > 9 && ctx.measureText(l1).width > rEdge * 1.45) {
      fs -= 1;
      ctx.font = `700 ${fs}px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif`;
    }
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `700 ${fs}px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif`;
    ctx.lineWidth = 4; ctx.strokeStyle = "rgba(250,248,243,0.92)";
    ctx.strokeText(l1, ox, y - fs * 0.7); ctx.fillStyle = COLORS.edge; ctx.fillText(l1, ox, y - fs * 0.7);
    ctx.font = `${fs - 1}px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif`;
    ctx.strokeText(l2, ox, y + fs * 0.7); ctx.fillStyle = "#3a2a26"; ctx.fillText(l2, ox, y + fs * 0.7);
    ctx.textAlign = "start";
  }

  // Circles at fixed ground distances from your town (concentric once the map is
  // inside out), and a ruler from the centre to the edge that names them:
  // the centre is the farthest point from your town, the edge is your town.
  const RING_KM = [200, 1000, 2000, 5000, 10000];
  const RULER_KM = [200, 500, 1000, 2000, 5000, 10000];
  const RULER_ANGLE = -35 * RAD; // up and to the right of the centre
  function drawRings(boxes) {
    if (!insideOut()) return;
    const diag = Math.hypot(width, height);
    const R = scaleNow();
    const radiusFor = (km) => R * Math.tan((Math.PI - km / EARTH_R) / 2);
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(35, 49, 58, 0.4)";
    for (const km of RING_KM) {
      const r = radiusFor(km);
      if (r > diag || r < 6) continue;
      ctx.beginPath(); ctx.arc(ox, oy, r, 0, 2 * Math.PI); ctx.stroke();
    }
    ctx.restore();

    // ruler
    const rEdge = edgeRadius();
    const ux = Math.cos(RULER_ANGLE), uy = Math.sin(RULER_ANGLE);
    const nx = -uy, ny = ux; // label side: below-right of the line
    const at = (r) => [ox + ux * r, oy + uy * r];
    const end = at(Math.min(rEdge, diag * 2));
    ctx.save();
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(end[0], end[1]);
    ctx.lineWidth = 5; ctx.strokeStyle = "rgba(250, 248, 243, 0.75)"; ctx.stroke();
    ctx.lineWidth = 1.6; ctx.strokeStyle = COLORS.city; ctx.stroke();

    const name = shortName();
    const marks = [
      { r: rEdge, text: t("rulerNear")(name), strong: true, at: "edge" },
      { r: 0, text: t("rulerFar"), strong: true, at: "centre" },
      ...RULER_KM.map((km) => ({ r: radiusFor(km), text: `${km.toLocaleString("en-US")} km` })),
    ];
    const placed = [];
    for (const m of marks) {
      if (m.r > diag * 2) continue;
      const [x, y] = at(m.r);
      // tick
      ctx.beginPath(); ctx.moveTo(x - nx * 4, y - ny * 4); ctx.lineTo(x + nx * 4, y + ny * 4);
      ctx.lineWidth = 1.6; ctx.strokeStyle = COLORS.city; ctx.stroke();
      if (!m.strong && placed.some((r) => Math.abs(r - m.r) < 34)) continue;
      if (x < -50 || y < -20 || x > width + 50 || y > height + 20) continue;
      placed.push(m.r);
      ctx.font = `${m.strong ? 700 : 600} 11px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif`;
      ctx.textBaseline = "middle"; ctx.textAlign = "start";
      let lx = x + nx * 9, ly = y + ny * 9;
      const w = ctx.measureText(m.text).width;
      // edge label: ends just inside the edge; centre label: to the lower left, away from the ruler
      if (m.at === "edge") { lx = x - ux * 12 + nx * 10 - w; ly = y - uy * 12 + ny * 10; }
      if (m.at === "centre") { lx = x - 10 - w; ly = y + 14; }
      ctx.lineWidth = 3.5; ctx.strokeStyle = "rgba(250, 248, 243, 0.92)";
      ctx.strokeText(m.text, lx, ly);
      ctx.fillStyle = m.strong ? COLORS.edge : COLORS.city; ctx.fillText(m.text, lx, ly);
      boxes.push([lx - 2, ly - 8, lx + w + 2, ly + 8]);
    }
    ctx.restore();
  }

  // Your town as a point, while it can still be drawn as one.
  function drawTown(boxes) {
    const town = [state.sel.lon, state.sel.lat];
    if (d3.geoDistance(town, state.centre) > (CLIP - 0.5) * RAD) return;
    const alpha = 1 - clamp01((state.t - 0.9) / 0.09);
    if (alpha <= 0) return;
    const p = projection(town);
    if (!p || p[0] < -40 || p[1] < -40 || p[0] > width + 40 || p[1] > height + 40) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 2 * Math.PI);
    ctx.fillStyle = COLORS.edge; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "#fff"; ctx.stroke();
    ctx.font = "700 13px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif";
    ctx.textBaseline = "middle"; ctx.textAlign = "start";
    const label = t("townOnMap")(shortName());
    haloText(label, p[0] + 11, p[1], COLORS.edge);
    boxes.push([p[0] - 8, p[1] - 10, p[0] + 14 + ctx.measureText(label).width, p[1] + 10]);
    ctx.restore();
  }

  // Country names, shown where the local scale is large enough for them.
  function drawCountryLabels(boxes) {
    if (!countryLabels) return;
    const s = scaleNow();
    const clipRad = (CLIP - 1) * RAD;
    const slack = width < 760 ? 0.8 : 1.2;
    ctx.font = "600 10px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (const [en, ja, lon, lat, minLabel] of countryLabels) {
      const c = d3.geoDistance([lon, lat], state.centre);
      if (c > clipRad) continue;
      const local = s / (1 + Math.cos(c)); // px per radian at that point
      const z = Math.log2((local * 2 * Math.PI) / 256); // equivalent web-map zoom
      if (z < minLabel - slack) continue;
      const p = projection([lon, lat]);
      if (!p || p[0] < 0 || p[1] < 0 || p[0] > width || p[1] > height) continue;
      const text = lang === "ja" && ja ? ja : en.toUpperCase();
      const w = ctx.measureText(text).width + 6, h = 14;
      const box = [p[0] - w / 2, p[1] - h / 2, p[0] + w / 2, p[1] + h / 2];
      if (boxes.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) continue;
      boxes.push(box);
      ctx.lineWidth = 3; ctx.strokeStyle = "rgba(244,240,230,0.8)";
      ctx.strokeText(text, p[0], p[1]);
      ctx.fillStyle = "rgba(92, 86, 72, 0.9)"; ctx.fillText(text, p[0], p[1]);
    }
    ctx.textAlign = "start";
  }

  function haloText(text, x, y, color) {
    ctx.lineWidth = 3; ctx.strokeStyle = "rgba(244,240,230,0.9)";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = color; ctx.fillText(text, x, y);
  }

  function drawMyLocation() {
    if (!state.myLoc || state.sel.source === "geo") return;
    if (d3.geoDistance(state.myLoc, state.centre) > (CLIP - 0.3) * RAD) return;
    const p = projection(state.myLoc);
    if (!p || p[0] < -20 || p[1] < -20 || p[0] > width + 20 || p[1] > height + 20) return;
    ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(31, 111, 178, 0.18)"; ctx.fill();
    ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, 2 * Math.PI);
    ctx.fillStyle = COLORS.me; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "#fff"; ctx.stroke();
    ctx.font = "600 11px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif";
    ctx.textBaseline = "middle"; ctx.textAlign = "start";
    haloText(t("myLocation"), p[0] + 10, p[1], COLORS.me);
  }

  function drawCities(boxes) {
    const placed = [];
    ctx.font = "600 11px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif";
    ctx.textBaseline = "middle"; ctx.textAlign = "start";
    const rad = (CLIP - 0.5) * RAD;
    for (const c of REF_CITIES) {
      if (d3.geoDistance([c.lon, c.lat], state.centre) > rad) continue;
      const p = projection([c.lon, c.lat]);
      if (!p || p[0] < -20 || p[1] < -20 || p[0] > width + 20 || p[1] > height + 20) continue;
      ctx.fillStyle = COLORS.city;
      ctx.beginPath(); ctx.arc(p[0], p[1], 2.5, 0, 2 * Math.PI); ctx.fill();
      placed.push([p, c]);
    }
    for (const [p, c] of placed) {
      if (placed.some(([q]) => q !== p && Math.hypot(q[0] - p[0], q[1] - p[1]) < 24)) continue;
      const label = lang === "ja" ? c.ja : c.name;
      const box = [p[0] - 4, p[1] - 8, p[0] + 8 + ctx.measureText(label).width, p[1] + 8];
      if (boxes.some((b) => box[0] < b[2] && box[2] > b[0] && box[1] < b[3] && box[3] > b[1])) continue;
      ctx.fillStyle = COLORS.city;
      ctx.lineWidth = 3; ctx.strokeStyle = "rgba(244,240,230,0.85)";
      ctx.strokeText(label, p[0] + 5, p[1]);
      ctx.fillText(label, p[0] + 5, p[1]);
      boxes.push(box);
    }
  }

  // The outer circle. It only stands for your town once the map is inside out,
  // so the name fades in near the end of the turn.
  function drawEdge() {
    const r = edgeRadius();
    const diag = Math.hypot(width, height);
    if (r > diag * 3) return; // edge far off screen
    const alpha = clamp01((state.t - 0.8) / 0.19);
    ctx.save();
    ctx.beginPath(); ctx.arc(ox, oy, r, 0, 2 * Math.PI);
    ctx.lineWidth = 3; ctx.strokeStyle = COLORS.edge; ctx.globalAlpha = 0.25 + 0.75 * alpha; ctx.stroke();
    if (alpha <= 0) { ctx.restore(); return; }
    ctx.globalAlpha = alpha;
    const label = displayName(state.sel);
    const unit = (lang === "ja" ? label : label.toUpperCase()) + (lang === "ja" ? "　·　" : "  ·  ");
    const fontSize = width < 760 ? 12 : 14;
    ctx.font = `600 ${fontSize}px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif`;
    ctx.fillStyle = COLORS.edgeText;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const tr = r + fontSize * 0.95;
    const spacing = lang === "ja" ? 1 : 1.5;
    const chars = Array.from(unit);
    const widths = chars.map((ch) => ctx.measureText(ch).width + spacing);
    const unitW = widths.reduce((a, b) => a + b, 0);
    const circ = 2 * Math.PI * tr;
    const n = Math.max(1, Math.floor(circ / unitW));
    const stretch = circ / (n * unitW); // spread to close the loop evenly
    let a = -Math.PI / 2;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < chars.length; j++) {
        const w = widths[j] * stretch;
        const mid = a + (w / 2) / tr;
        const x = ox + tr * Math.cos(mid), y = oy + tr * Math.sin(mid);
        if (x > -20 && y > -20 && x < width + 20 && y < height + 20) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(mid + Math.PI / 2);
          ctx.fillText(chars[j], 0, 0);
          ctx.restore();
        }
        a += w / tr;
      }
    }
    ctx.restore();
  }

  // ---------- info panel ----------
  function updateInfo() {
    const s = state.sel;
    const centre = antipode(s.lon, s.lat); // centre of the inside-out map
    const name = displayName(s);
    const country = s.source === "geo" ? "" : (s.country ? ` (${s.country})` : "");
    els.selName.textContent = name + country;
    $("townName").textContent = name;
    els.selCoord.textContent = fmtCoord(s.lat, s.lon);
    els.ctrCoord.textContent = fmtCoord(centre[1], centre[0]);
    canvas.setAttribute("aria-label", STR[lang].mapLabel(name));

    const rows = REF_CITIES.map((c) => {
      const d = d3.geoDistance([c.lon, c.lat], centre);
      const len = 2 / (1 + Math.cos(d));
      return { label: lang === "ja" ? c.ja : c.name, d, len, area: len * len };
    });
    if (state.myLoc && s.source !== "geo") {
      const d = d3.geoDistance(state.myLoc, centre);
      const len = 2 / (1 + Math.cos(d));
      rows.push({ label: t("myLocation"), d, len, area: len * len, me: true });
    }
    const visible = rows.filter((r) => r.d <= CLIP * RAD);
    visible.sort((a, b) => a.d - b.d);
    visible.push({ label: `${name} (${t("edgeRow")})`, d: Math.PI, len: Infinity, area: Infinity, edge: true });
    els.stretchBody.replaceChildren(...visible.map((r) => {
      const tr = document.createElement("tr");
      if (r.edge) tr.className = "edge";
      if (r.me) tr.className = "me";
      const km = Math.round((r.d * EARTH_R) / 100) * 100;
      const cells = [r.label, `${km.toLocaleString("en-US")} km`,
        r.edge ? "∞" : fmtFactor(r.len),
        r.edge ? "∞" : fmtFactor(r.area)];
      for (const v of cells) { const td = document.createElement("td"); td.textContent = v; tr.appendChild(td); }
      return tr;
    }));
    const n = shareNumbers();
    const [l1, l2] = t("shareCaption")(shortName(), Math.round(n.map * 100), (n.earth * 100).toFixed(2));
    $("shareNote").textContent = lang === "ja" ? `${l1}。${l2}。` : `${l1}. ${l2}`;
    updateCentreKind();
  }

  function updateCentreKind() {
    const w = world50 || world110;
    if (!w) { els.ctrKind.textContent = "—"; return; }
    const centre = antipode(state.sel.lon, state.sel.lat);
    const hit = w.countries.find((f) => d3.geoContains(f, centre));
    els.ctrKind.textContent = hit ? `${t("land")} — ${hit.properties.name}` : t("ocean");
  }

  // ---------- selection ----------
  // A new town keeps the current view: same slider position, same zoom. The map
  // only turns to the new town. (Play shows the ordinary-to-inside-out turn again.)
  function select(sel, { updateUrl = true } = {}) {
    stopPlay();
    hidePick();
    const from = state.centre.slice();
    state.sel = sel;
    const to = centreFor(sel, state.t);
    const dist = d3.geoDistance(from, to);
    if (reduceMotion.matches || dist < 1e-6) {
      state.centre = to;
      render(false);
    } else {
      const interp = d3.geoInterpolate(from, to);
      const ms = 600 + 700 * (dist / Math.PI);
      anim = d3.timer((elapsed) => {
        const u = Math.min(1, elapsed / ms);
        state.centre = interp(d3.easeCubicInOut(u));
        if (u >= 1) { anim.stop(); anim = null; state.centre = to; render(false); }
        else render(true);
      });
    }
    updateInfo();
    if (updateUrl) writeUrl();
  }

  function nearestPlace(lon, lat, maxKm) {
    if (!places) return null;
    let best = null, bestD = maxKm / EARTH_R;
    for (const p of places) {
      if (Math.abs(p[4] - lat) > 3) continue;
      const d = d3.geoDistance([lon, lat], [p[5], p[4]]);
      if (d < bestD) { bestD = d; best = p; }
    }
    return best;
  }

  function selFromPoint(lon, lat, source) {
    lon = wrapLon(lon);
    const p = nearestPlace(lon, lat, 60);
    if (p) {
      return { lat, lon, name: `Near ${p[0]}`, ja: `${p[2] || p[0]}${STR.ja.near}`, country: p[3], source };
    }
    return { lat, lon, name: "", ja: "", country: "", source };
  }

  // ---------- URL ----------
  function writeUrl() {
    const s = state.sel;
    let url = location.pathname;
    if (s.source !== "geo") {
      const params = new URLSearchParams();
      params.set("lat", s.lat.toFixed(2));
      params.set("lon", s.lon.toFixed(2));
      if (s.name) params.set("name", s.name);
      url += "?" + params.toString();
    }
    try { history.replaceState(null, "", url); } catch (e) { /* ignore */ }
  }

  function readUrl() {
    const p = new URLSearchParams(location.search);
    if (!p.has("lat") || !p.has("lon")) return null;
    const lat = parseFloat(p.get("lat")), lon = parseFloat(p.get("lon"));
    if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
    const name = (p.get("name") || "").slice(0, 80);
    return { lat, lon, name, ja: "", country: "", source: "url" };
  }

  // ---------- search ----------
  function buildIndex() {
    searchIndex = places.map((p) => {
      const keys = [norm(p[0])];
      if (p[1]) keys.push(norm(p[1]));
      if (p[2]) { keys.push(p[2]); keys.push(p[2].replace(/[市都区町村]$/, "")); }
      return keys;
    });
  }

  function search(qRaw) {
    const q = norm(qRaw);
    if (!q || !searchIndex) return [];
    const out = [];
    for (let i = 0; i < places.length; i++) {
      let score = 9;
      for (const k of searchIndex[i]) {
        if (k === q) { score = 0; break; }
        if (k.startsWith(q)) score = Math.min(score, 1);
        else if (k.includes(" " + q) || k.includes("-" + q)) score = Math.min(score, 2);
        else if (q.length >= 3 && k.includes(q)) score = Math.min(score, 3);
      }
      if (score < 9) out.push([score, i]);
    }
    out.sort((a, b) => a[0] - b[0] || places[b[1]][6] - places[a[1]][6]);
    return out.slice(0, 8).map((x) => places[x[1]]);
  }

  let activeIdx = -1, currentResults = [];
  function showResults(list) {
    currentResults = list;
    activeIdx = list.length ? 0 : -1;
    els.results.replaceChildren();
    if (!els.q.value.trim()) { closeResults(); return; }
    if (!list.length) {
      const li = document.createElement("li");
      li.textContent = t("noResults"); li.setAttribute("aria-disabled", "true");
      els.results.appendChild(li);
    }
    list.forEach((p, i) => {
      const li = document.createElement("li");
      li.id = `opt-${i}`;
      li.setAttribute("role", "option");
      li.textContent = lang === "ja" && p[2] ? `${p[2]} ${p[0]}` : p[0];
      const small = document.createElement("small");
      small.textContent = p[3];
      li.appendChild(small);
      li.addEventListener("mousedown", (e) => { e.preventDefault(); choose(p); });
      els.results.appendChild(li);
    });
    els.results.hidden = false;
    els.q.setAttribute("aria-expanded", "true");
    highlight();
  }
  function highlight() {
    [...els.results.querySelectorAll("[role=option]")].forEach((li, i) => li.setAttribute("aria-selected", String(i === activeIdx)));
    if (activeIdx >= 0) {
      els.q.setAttribute("aria-activedescendant", `opt-${activeIdx}`);
      const li = $(`opt-${activeIdx}`); if (li) li.scrollIntoView({ block: "nearest" });
    } else els.q.removeAttribute("aria-activedescendant");
  }
  function closeResults() {
    els.results.hidden = true;
    els.q.setAttribute("aria-expanded", "false");
    els.q.removeAttribute("aria-activedescendant");
  }
  function choose(p) {
    setTownPop(false);
    setStatus("");
    select({ lat: p[4], lon: p[5], name: p[0], ja: p[2], country: p[3], source: "search" });
  }

  els.q.addEventListener("input", () => showResults(search(els.q.value)));
  els.q.addEventListener("focus", () => { if (els.q.value.trim()) showResults(search(els.q.value)); });
  els.q.addEventListener("blur", closeResults);
  els.q.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" && currentResults.length) { activeIdx = (activeIdx + 1) % currentResults.length; highlight(); e.preventDefault(); }
    else if (e.key === "ArrowUp" && currentResults.length) { activeIdx = (activeIdx - 1 + currentResults.length) % currentResults.length; highlight(); e.preventDefault(); }
    else if (e.key === "Enter" && activeIdx >= 0 && currentResults[activeIdx]) { choose(currentResults[activeIdx]); e.preventDefault(); }
    else if (e.key === "Escape") { closeResults(); }
  });

  // ---------- map interaction ----------
  // Zoom only (wheel, pinch, buttons), always about the map centre. The map is not
  // dragged: what sits at the centre is decided by your town and the slider.
  const canvasSel = d3.select(canvas);
  // Drag pans, wheel / pinch zooms. Neither changes your town.
  const zoom = d3.zoom()
    .scaleExtent([0.2, 600])
    .clickDistance(5)
    .on("start", (e) => {
      if (e.sourceEvent) { hidePick(); stopPlay(); } // the viewer takes over: stop any turn in progress
      if (e.sourceEvent && e.sourceEvent.type !== "wheel") canvas.classList.add("dragging");
    })
    .on("zoom", (e) => {
      state.k = e.transform.k;
      state.tx = e.transform.x;
      state.ty = e.transform.y;
      requestRender(true);
    })
    .on("end", () => canvas.classList.remove("dragging"));
  canvasSel.call(zoom).on("dblclick.zoom", null);

  // A click only offers to make that point your town; nothing changes until the
  // button in the bubble is pressed.
  const pick = $("pick");
  let pickPoint = null;
  function hidePick() { pick.hidden = true; pickPoint = null; }
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const pt = [e.clientX - rect.left, e.clientY - rect.top];
    updateProjection();
    const ll = projection.invert(pt);
    if (!ll || !isFinite(ll[0]) || !isFinite(ll[1]) || d3.geoDistance(ll, state.centre) > CLIP * RAD) { hidePick(); return; }
    pickPoint = selFromPoint(ll[0], ll[1], "click");
    $("pickWhere").textContent = `${pickPoint.name ? displayName(pickPoint) + " · " : ""}${fmtCoord(pickPoint.lat, pickPoint.lon)}`;
    pick.hidden = false;
    const w = pick.offsetWidth, h = pick.offsetHeight;
    pick.style.left = `${Math.max(8, Math.min(width - w - 8, pt[0] - w / 2))}px`;
    pick.style.top = `${pt[1] - h - 12 < 8 ? pt[1] + 14 : pt[1] - h - 12}px`;
  });
  $("pickBtn").addEventListener("click", () => {
    if (!pickPoint) return;
    const sel = pickPoint;
    hidePick();
    setStatus("");
    select(sel);
  });
  $("pickClose").addEventListener("click", hidePick);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hidePick(); });

  els.zoomIn.addEventListener("click", () => canvasSel.transition().duration(reduceMotion.matches ? 0 : 250).call(zoom.scaleBy, 2));
  els.zoomOut.addEventListener("click", () => canvasSel.transition().duration(reduceMotion.matches ? 0 : 250).call(zoom.scaleBy, 0.5));

  els.flip.addEventListener("input", () => {
    stopPlay();
    setT(Number(els.flip.value) / 1000);
    requestRender(true);
  });
  els.play.addEventListener("click", () => {
    if (state.t > 0.999) playFromStart(500);
    else playTo(1, 4200);
  });

  // ---------- buttons ----------
  els.circles.addEventListener("click", () => {
    state.showCircles = !state.showCircles;
    els.circles.setAttribute("aria-pressed", String(state.showCircles));
    els.circleLegend.hidden = !state.showCircles;
    render(false);
  });
  els.geo.addEventListener("click", () => {
    if (!("geolocation" in navigator)) { setStatus(t("geoUnsupported")); return; }
    setStatus(t("geoWaiting"));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setStatus(t("geoUsed"));
        state.myLoc = [longitude, latitude];
        setTownPop(false);
        select({ lat: latitude, lon: longitude, name: "", ja: "", country: "", source: "geo" });
      },
      (err) => setStatus(err.code === 1 ? t("geoDenied") : t("geoFailed")),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    );
  });
  // drawers: one at a time; on wide screens the map makes room for them
  function setDrawer(name) {
    for (const [key, btn] of [["details", els.detailsBtn], ["about", els.aboutBtn]]) {
      const open = key === name && els[key].hidden;
      els[key].hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
    }
    resize();
  }
  els.detailsBtn.addEventListener("click", () => setDrawer("details"));
  els.aboutBtn.addEventListener("click", () => setDrawer("about"));
  document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => setDrawer(null)));

  // town popover
  function setTownPop(open) {
    els.townPop.hidden = !open;
    els.townBtn.setAttribute("aria-expanded", String(open));
    if (open) { hidePick(); els.q.focus(); }
    else { els.q.value = ""; closeResults(); }
  }
  els.townBtn.addEventListener("click", () => setTownPop(els.townPop.hidden));
  document.addEventListener("pointerdown", (e) => {
    if (!els.townPop.hidden && !els.townPop.contains(e.target) && !els.townBtn.contains(e.target)) setTownPop(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !els.townPop.hidden) { setTownPop(false); els.townBtn.focus(); }
  });

  // ---------- language ----------
  function applyLang() {
    setStatus("");
    document.documentElement.lang = lang;
    document.title = t("title");
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    els.zoomIn.setAttribute("aria-label", t("zoomIn"));
    els.zoomOut.setAttribute("aria-label", t("zoomOut"));
    updateInfo();
    resize();
  }
  document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => {
    lang = b.dataset.lang;
    try { localStorage.setItem("lang", lang); } catch (e) { /* ignore */ }
    applyLang();
  }));

  // ---------- data ----------
  function toWorld(topo) {
    const o = topo.objects.countries;
    return {
      land: topojson.merge(topo, o.geometries),
      borders: topojson.mesh(topo, o, (a, b) => a !== b),
      countries: topojson.feature(topo, o).features,
    };
  }

  async function init() {
    const fromUrl = readUrl();
    if (fromUrl) state.sel = fromUrl;
    setT(1); // open on the inside-out map; the turn plays only when Play is pressed
    window.addEventListener("resize", resize);
    resize();
    applyLang();

    world110 = toWorld(await d3.json("data/countries-110m.json"));
    render(false); updateCentreKind();

    const [w50, pl, cl] = await Promise.all([
      d3.json("data/countries-50m.json"),
      d3.json("data/places.json"),
      d3.json("data/country-labels.json"),
    ]);
    countryLabels = cl;
    world50 = toWorld(w50);
    places = pl;
    buildIndex();
    // fill in Japanese name / country for a place given by URL
    if (state.sel.source === "url" && state.sel.name) {
      const m = places.find((p) => p[0] === state.sel.name && d3.geoDistance([p[5], p[4]], [state.sel.lon, state.sel.lat]) < 0.01);
      if (m) Object.assign(state.sel, { ja: m[2], country: m[3] });
    }
    updateInfo();
    if (!anim) render(false);
    document.body.dataset.ready = "true";
  }

  init().catch((err) => { console.error(err); setStatus("Failed to load map data."); });
})();
