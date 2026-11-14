(() => {
  "use strict";

  // ---------- constants ----------
  const CLIP = 178.5; // degrees from the centre that are drawn
  const EARTH_R = 6371; // km
  const CIRCLE_KM = 500;
  const DEFAULT = { lat: 42.92, lon: 143.2, name: "Obihiro", ja: "帯広市", country: "Japan" };
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
      lede: "Your town goes all the way around the outside. The other side of the Earth is in the middle.",
      yourTown: "Your town",
      searchLabel: "Search for a town",
      searchPlaceholder: "Change your town: search (e.g. New York)",
      useLocation: "Use where I am",
      circles: "Equal circles",
      share: "Share",
      hint: "You can also click the map: that point becomes your town. Drag to move, scroll or pinch to zoom.",
      details: "Details",
      selected: "Your town (all around the edge)",
      centre: "Map centre (the other side of the Earth)",
      stretchCaption: "Stretch at each city (relative to the centre)",
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
      aboutP3: "The centre here is the antipode of the place you chose — the point on the exact opposite side of the Earth. The antipode of the centre would be stretched to infinite size, so the place you chose cannot be drawn as a point. It wraps around the whole map as its outer edge. The area within 500 km of it (the red band) fills 89% of the map, and the rest of the world is squeezed into the middle.",
      notesH: "Notes",
      note1: "The map is cut at 178.5° from the centre. The small area within 1.5° (about 170 km) of the chosen place cannot be drawn; the outer circle stands for it.",
      note2: "Your location is used only inside your browser. It is not sent anywhere and not saved. It is added to a link only if you press Share and confirm.",
      note3: 'Data: <a href="https://www.naturalearthdata.com/">Natural Earth</a> (public domain): Admin 0 countries 1:110m and 1:50m (via <a href="https://github.com/topojson/world-atlas">world-atlas</a>), Populated Places 1:10m.',
      credit: 'Data: <a href="https://www.naturalearthdata.com/">Natural Earth</a>',
      ocean: "Ocean",
      land: "Land",
      edgeRow: "the edge",
      infinite: "∞",
      noResults: "No matching town",
      myLocation: "Where you are",
      myLocationInline: "where you are",
      pointName: "Point on the map",
      theSelected: "your town",
      antipodeOf: (n) => `Opposite side from ${n}`,
      mapCentre: "Map centre",
      through: "↕ 12,742 km straight through the Earth",
      viewEdge: "Whole map",
      viewCentre: "Around the centre",
      viewLabel: "View",
      shareCaption: (n, m, e) => [`${m}% of this map is within 500 km of ${n}`, `That area is ${e}% of the Earth's surface.`],
      near: "near",
      geoUnsupported: "This browser cannot provide a location.",
      geoWaiting: "Getting your location…",
      geoDenied: "Location permission was not given.",
      geoFailed: "Could not get your location.",
      geoUsed: "Your location is used only in this browser. It is not sent or saved.",
      shareConfirm: "This link contains your current location (rounded to about 1 km). Anyone who opens it will see where you are. Share it?",
      copied: "Link copied.",
      copyFailed: "Copy this link:",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      mapLabel: (n) => `Stereographic world map centred on the antipode of ${n}. ${n} forms the outer edge.`,
    },
    ja: {
      kicker: "#30DayMapChallenge 2026 · Day 15 · Inside out",
      title: "あなたの町が、世界の果てになる",
      lede: "あなたの町が地図の外側をぐるりと囲み、地球の裏側が真ん中に来ます。",
      yourTown: "あなたの町",
      searchLabel: "町を検索",
      searchPlaceholder: "あなたの町を変える：検索（例：札幌、New York）",
      useLocation: "現在地にする",
      circles: "同じ大きさの円",
      share: "共有",
      hint: "地図をクリックすると、その地点があなたの町になります。ドラッグで移動、スクロールやピンチで拡大縮小。",
      details: "詳細",
      selected: "あなたの町（外周ぜんぶ）",
      centre: "地図の中心（あなたの町の裏側）",
      stretchCaption: "各都市の伸び率（中心を1とする）",
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
      aboutP3: "地図の中心は、選んだ場所の地球の裏側です。中心の裏側の点は無限大に引き伸ばされるので、選んだ場所は点として描けません。そのため地図全体を囲む外周になります。選んだ場所から500 km以内（赤い帯）が地図の89%を占め、残りの世界は中央に押し込まれます。",
      notesH: "注記",
      note1: "中心から178.5°より外側は切り取っています。選んだ場所から1.5°（約170 km）以内は描けないため、外周の円がその場所を表します。",
      note2: "位置情報はブラウザの中だけで使い、どこにも送信せず、保存もしません。「共有」を押して確認したときだけ、リンクに含めます。",
      note3: '出典：<a href="https://www.naturalearthdata.com/">Natural Earth</a>（パブリックドメイン）。国境 1:110m・1:50m（<a href="https://github.com/topojson/world-atlas">world-atlas</a> 経由）、Populated Places 1:10m。',
      credit: '出典：<a href="https://www.naturalearthdata.com/">Natural Earth</a>',
      ocean: "海",
      land: "陸",
      edgeRow: "外周",
      infinite: "∞",
      noResults: "該当する町がありません",
      myLocation: "現在地",
      myLocationInline: "現在地",
      pointName: "地図上の地点",
      theSelected: "あなたの町",
      antipodeOf: (n) => `${n}の裏側`,
      mapCentre: "地図の中心",
      through: "↕ 地球を貫いて一直線に 12,742 km",
      viewEdge: "外周まで",
      viewCentre: "中心付近",
      viewLabel: "表示",
      shareCaption: (n, m, e) => [`この地図の${m}%は、${n}から500 km以内`, `地球の表面では、わずか${e}%の範囲です`],
      near: "付近",
      geoUnsupported: "このブラウザでは位置情報を使えません。",
      geoWaiting: "現在地を取得しています…",
      geoDenied: "位置情報の利用が許可されませんでした。",
      geoFailed: "現在地を取得できませんでした。",
      geoUsed: "位置情報はこのブラウザの中だけで使い、送信・保存はしません。",
      shareConfirm: "このリンクには現在地（約1 km単位に丸めたもの）が含まれます。開いた人にあなたの居場所がわかります。共有しますか？",
      copied: "リンクをコピーしました。",
      copyFailed: "このリンクをコピーしてください：",
      zoomIn: "拡大",
      zoomOut: "縮小",
      mapLabel: (n) => `${n}の地球の裏側を中心にしたステレオ図法の世界地図。${n}が外周になっています。`,
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
    q: $("q"), results: $("results"), geo: $("geo"), circles: $("circles"), share: $("share"),
    zoomIn: $("zoomIn"), zoomOut: $("zoomOut"), status: $("status"),
    viewEdge: $("viewEdge"), viewCentre: $("viewCentre"),
    selName: $("selName"), selCoord: $("selCoord"), ctrCoord: $("ctrCoord"), ctrKind: $("ctrKind"),
    stretchBody: $("stretchBody"), circleLegend: $("circleLegend"), info: $("info"), infoToggle: $("infoToggle"),
  };

  // ---------- state ----------
  const state = {
    sel: { ...DEFAULT, source: "default" },
    centre: antipode(DEFAULT.lon, DEFAULT.lat), // [lon, lat]
    k: 1,
    showCircles: false,
    interacting: false,
    myLoc: null, // [lon, lat], kept in memory only
  };
  let world110 = null, world50 = null; // { land, borders, countries }
  let places = null, searchIndex = null, countryLabels = null;
  let width = 0, height = 0, dpr = 1, cx = 0, cy = 0, baseScale = 1;
  let anim = null;

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
  function antipode(lon, lat) {
    return [wrapLon(lon + 180), -lat];
  }
  function wrapLon(lon) {
    return ((((lon + 180) % 360) + 360) % 360) - 180;
  }
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
  function setStatus(msg) { els.status.textContent = msg || ""; }

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

    const wide = width >= 1000;
    const left = wide ? 384 : 0;
    const availW = width - left;
    let top = 0, bottom = height;
    if (width >= 760) {
      const topBottom = document.querySelector(".top").getBoundingClientRect().bottom;
      els.info.style.maxHeight = `${Math.max(160, height - topBottom - 24)}px`;
    } else {
      els.info.style.maxHeight = "";
    }
    if (width < 760) {
      sizeGlobe();
      const infoH = els.info.classList.contains("collapsed") ? els.info.offsetHeight : 150;
      top = document.querySelector(".top").getBoundingClientRect().bottom + 4;
      bottom = height - infoH - 12;
      if (bottom - top < 200) { top = 0; bottom = height; }
    }
    cx = left + availW / 2;
    cy = (top + bottom) / 2;
    const margin = width < 760 ? 22 : 34;
    const radius = Math.max(60, Math.min(availW, bottom - top) / 2 - margin);
    baseScale = radius / Math.tan((CLIP / 2) * Math.PI / 180); // d3 stereographic: r = scale · tan(c / 2)
    sizeGlobe();
    render();
  }

  function updateProjection() {
    projection
      .rotate([-state.centre[0], -state.centre[1]])
      .scale(baseScale * state.k)
      .translate([cx, cy]);
  }

  // ---------- drawing ----------
  let rafId = 0, fullTimer = 0;
  function requestRender(fast) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => { rafId = 0; render(fast); });
    clearTimeout(fullTimer);
    if (fast) fullTimer = setTimeout(() => { if (!state.interacting && !anim) render(false); }, 180);
  }

  function render(fast) {
    updateProjection();
    const world = (!fast && world50) || world110 || world50;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = COLORS.outside;
    ctx.fillRect(0, 0, width, height);

    // sphere (ocean)
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
    drawCities(boxes);
    drawCentre(boxes);
    if (!fast) drawCountryLabels(boxes);
    drawMyLocation();
    ctx.restore();

    drawEdge();
    drawShareCaption();
    if (!globeTimer) drawGlobe();
  }

  // The band within SHARE_KM of the selected place. On this map it takes most of
  // the disc, while on the globe it is a tiny patch.
  const SHARE_KM = 500;
  function shareNumbers() {
    const half = (CLIP / 2) * Math.PI / 180;
    const rel = Math.tan((Math.PI - SHARE_KM / EARTH_R) / 2) / Math.tan(half);
    return { map: 1 - rel * rel, earth: (1 - Math.cos(SHARE_KM / EARTH_R)) / 2, rel };
  }
  function edgeRadius() { return baseScale * state.k * Math.tan(((CLIP / 2) * Math.PI) / 180); }

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
    const rEdge = edgeRadius(), r = rEdge * shareNumbers().rel;
    if (r > Math.hypot(width, height)) return;
    ctx.beginPath();
    ctx.arc(cx, cy, rEdge, 0, 2 * Math.PI);
    ctx.arc(cx, cy, r, 0, 2 * Math.PI, true);
    ctx.fillStyle = hatch(); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(194, 65, 45, 0.8)"; ctx.stroke();
  }

  function drawShareCaption() {
    const rEdge = edgeRadius(), n = shareNumbers(), r = rEdge * n.rel;
    const y = cy + (r + rEdge) / 2;
    if (width < 760 || r > Math.hypot(width, height) || y > height - 10) return; // phones: shown in the panel
    const fs = width < 760 ? 12 : 14;
    const [l1, l2] = t("shareCaption")(shortName(), Math.round(n.map * 100), (n.earth * 100).toFixed(2));
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `700 ${fs}px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif`;
    ctx.lineWidth = 4; ctx.strokeStyle = "rgba(250,248,243,0.92)";
    ctx.strokeText(l1, cx, y - fs * 0.7); ctx.fillStyle = COLORS.edge; ctx.fillText(l1, cx, y - fs * 0.7);
    ctx.font = `${fs - 1}px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif`;
    ctx.strokeText(l2, cx, y + fs * 0.7); ctx.fillStyle = "#3a2a26"; ctx.fillText(l2, cx, y + fs * 0.7);
    ctx.textAlign = "start";
  }

  // Circles at fixed ground distances from the selected place. Around the
  // centre of an azimuthal projection they are concentric screen circles.
  const RING_KM = [100, 200, 500, 1000, 2000, 5000, 10000, 15000];
  function drawRings(boxes) {
    const diag = Math.hypot(width, height);
    const R = baseScale * state.k;
    let last = Infinity;
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.font = "11px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "center";
    const name = shortName();
    let first = true;
    for (const km of RING_KM) {
      if (km === SHARE_KM) continue;
      const c = Math.PI - km / EARTH_R; // angle from the centre
      if (c > (CLIP * Math.PI) / 180) continue;
      const r = R * Math.tan(c / 2);
      if (r > diag || r < 28 || last - r < 26) continue;
      last = r;
      ctx.strokeStyle = "rgba(35, 49, 58, 0.45)";
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.stroke();
      const d = `${km.toLocaleString("en-US")} km`;
      const label = first ? (lang === "ja" ? `${name}から ${d}` : `${d} from ${name}`) : d;
      first = false;
      const y = cy + r - 2;
      ctx.lineWidth = 3; ctx.strokeStyle = "rgba(202, 217, 222, 0.9)"; ctx.setLineDash([]);
      ctx.strokeText(label, cx, y);
      ctx.fillStyle = "rgba(35, 49, 58, 0.9)"; ctx.fillText(label, cx, y);
      const lw = ctx.measureText(label).width / 2 + 4;
      boxes.push([cx - lw, y - 15, cx + lw, y + 2]);
      ctx.setLineDash([4, 4]); ctx.lineWidth = 1;
    }
    ctx.restore();
  }

  // Country names, shown where the local scale is large enough for them.
  function drawCountryLabels(boxes) {
    if (!countryLabels) return;
    const s = baseScale * state.k;
    const clipRad = ((CLIP - 1) * Math.PI) / 180;
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
  }

  function haloText(text, x, y, color) {
    ctx.lineWidth = 3; ctx.strokeStyle = "rgba(244,240,230,0.9)";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = color; ctx.fillText(text, x, y);
  }

  // The map centre: same marker as the far end of the line in the globe inset.
  function drawCentre(boxes) {
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff"; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = COLORS.edge; ctx.stroke();
    ctx.font = "600 11px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif";
    ctx.textBaseline = "middle"; ctx.textAlign = "start";
    const label = t("antipodeOf")(shortName());
    const lw = ctx.measureText(label).width;
    ctx.textAlign = "center";
    haloText(label, cx, cy - 15, COLORS.edge);
    ctx.textAlign = "start";
    boxes.push([cx - lw / 2 - 4, cy - 24, cx + lw / 2 + 4, cy + 8]);
  }

  function drawMyLocation() {
    if (!state.myLoc) return;
    if (d3.geoDistance(state.myLoc, state.centre) > ((CLIP - 0.3) * Math.PI) / 180) return; // on the edge
    const p = projection(state.myLoc);
    if (!p || p[0] < -20 || p[1] < -20 || p[0] > width + 20 || p[1] > height + 20) return;
    ctx.beginPath(); ctx.arc(p[0], p[1], 9, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(31, 111, 178, 0.18)"; ctx.fill();
    ctx.beginPath(); ctx.arc(p[0], p[1], 5, 0, 2 * Math.PI);
    ctx.fillStyle = COLORS.me; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "#fff"; ctx.stroke();
    ctx.font = "600 11px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif";
    ctx.textBaseline = "middle"; ctx.textAlign = "start";
    const nearCentre = Math.hypot(p[0] - cx, p[1] - cy) < 24;
    haloText(t("myLocation"), p[0] + 10, nearCentre ? cy + 14 : p[1], COLORS.me);
  }

  function shortName() {
    const s = state.sel;
    if (s.source === "geo") return t("myLocationInline");
    return (lang === "ja" ? s.ja : s.name) || t("theSelected");
  }

  function drawCities(boxes) {
    const placed = [];
    ctx.font = "600 11px system-ui, -apple-system, 'Segoe UI', 'Hiragino Sans', sans-serif";
    ctx.textBaseline = "middle";
    const rad = (CLIP - 0.5) * Math.PI / 180;
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
      ctx.fillStyle = COLORS.city;
      ctx.lineWidth = 3; ctx.strokeStyle = "rgba(244,240,230,0.85)";
      ctx.strokeText(label, p[0] + 5, p[1]);
      ctx.fillText(label, p[0] + 5, p[1]);
      boxes.push([p[0] - 4, p[1] - 8, p[0] + 8 + ctx.measureText(label).width, p[1] + 8]);
    }
  }

  function drawEdge() {
    const r = baseScale * state.k * Math.tan((CLIP / 2) * Math.PI / 180);
    const diag = Math.hypot(width, height);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.lineWidth = 3; ctx.strokeStyle = COLORS.edge; ctx.stroke();

    if (r > diag * 3) return; // edge far off screen
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
        const x = cx + tr * Math.cos(mid), y = cy + tr * Math.sin(mid);
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
    ctx.textAlign = "start";
  }

  // ---------- globe inset: the selected place and the map centre joined through the Earth ----------
  const globeCanvas = $("globe");
  const gctx = globeCanvas.getContext("2d");
  const globeProj = d3.geoOrthographic().clipAngle(90).precision(0.5);
  const globePath = d3.geoPath(globeProj, gctx);
  let globeW = 0, globeH = 0, globeR = 0, globeSpin = 0, globeTimer = null;

  function sizeGlobe() {
    const small = width < 760;
    globeR = small ? 40 : 50;
    globeW = globeR * 2 + 8;
    globeH = globeR * 2 + 14;
    globeCanvas.width = Math.round(globeW * dpr);
    globeCanvas.height = Math.round(globeH * dpr);
    globeCanvas.style.width = globeW + "px";
    globeCanvas.style.height = globeH + "px";
  }

  function drawGlobe() {
    if (!globeW) return;
    const P = antipode(state.centre[0], state.centre[1]); // selected place, follows the animation
    const gx = globeW / 2, gy = globeH / 2;
    // Look at the Earth from the side: the view centre is 90° away from P, so P and
    // its antipode sit on the outline, top and bottom. Spinning moves the view
    // centre around the P–antipode axis.
    const toPole = d3.geoRotation([-P[0], 90 - P[1]]);
    const Q = toPole.invert([globeSpin, 0]);
    globeProj.scale(globeR).translate([gx, gy]).rotate([-Q[0], -Q[1], 0]);
    let p = globeProj(P);
    const a = (Math.atan2(p[1] - gy, p[0] - gx) * 180) / Math.PI;
    globeProj.rotate([-Q[0], -Q[1], -(a + 90)]);
    p = globeProj(P);
    if (p[1] > gy) globeProj.rotate([-Q[0], -Q[1], a + 90]);

    const c = gctx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, globeW, globeH);
    c.beginPath(); globePath({ type: "Sphere" });
    c.fillStyle = COLORS.ocean; c.fill();
    const w = world110 || world50;
    if (w) {
      c.beginPath(); globePath(w.land);
      c.fillStyle = COLORS.land; c.fill();
      c.lineWidth = 0.5; c.strokeStyle = COLORS.border; c.stroke();
    }
    // cut through the Earth
    const top = gy - globeR, bottom = gy + globeR;
    c.beginPath(); c.ellipse(gx, gy, globeR * 0.2, globeR, 0, 0, 2 * Math.PI);
    const grad = c.createRadialGradient(gx, gy, 0, gx, gy, globeR);
    grad.addColorStop(0, "#e9b07a"); grad.addColorStop(0.55, "#a8553c"); grad.addColorStop(1, "#5b3128");
    c.fillStyle = grad; c.globalAlpha = 0.9; c.fill(); c.globalAlpha = 1;
    c.beginPath(); globePath({ type: "Sphere" });
    c.lineWidth = 1; c.strokeStyle = "rgba(255,255,255,0.55)"; c.stroke();

    if (state.myLoc && d3.geoDistance(state.myLoc, Q) < Math.PI / 2) {
      const m = globeProj(state.myLoc);
      c.beginPath(); c.arc(m[0], m[1], 3, 0, 2 * Math.PI);
      c.fillStyle = COLORS.me; c.fill(); c.lineWidth = 1; c.strokeStyle = "#fff"; c.stroke();
    }

    c.beginPath(); c.moveTo(gx, top); c.lineTo(gx, bottom);
    c.lineWidth = 2.5; c.strokeStyle = COLORS.edge; c.stroke();
    c.beginPath(); c.arc(gx, gy, 2, 0, 2 * Math.PI); c.fillStyle = "#fff"; c.fill();
    c.beginPath(); c.arc(gx, top, 5, 0, 2 * Math.PI); c.fillStyle = COLORS.edge; c.fill();
    c.beginPath(); c.arc(gx, bottom, 5, 0, 2 * Math.PI); c.fillStyle = "#fff"; c.fill();
    c.lineWidth = 2.5; c.strokeStyle = COLORS.edge; c.stroke();

  }

  function startGlobe() {
    if (globeTimer) { globeTimer.stop(); globeTimer = null; }
    if (reduceMotion.matches) { drawGlobe(); return; }
    let last = 0;
    globeTimer = d3.timer((elapsed) => {
      globeSpin = (globeSpin + ((elapsed - last) / 1000) * 12) % 360; // 12°/s
      last = elapsed;
      drawGlobe();
    });
  }

  // ---------- info panel ----------
  function updateInfo() {
    const s = state.sel;
    const centre = antipode(s.lon, s.lat);
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
    const clipRad = (CLIP * Math.PI) / 180;
    const visible = rows.filter((r) => r.d <= clipRad);
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
    const [l1, l2] = t("shareCaption")(name, Math.round(n.map * 100), (n.earth * 100).toFixed(2));
    $("shareNote").textContent = `${l1}. ${l2}`.replace("。.", "。").replace(/以内\. /, "以内。");
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
  // Zoom that fits the area within 100° of the centre (a bit more than a hemisphere).
  const centreK = () => Math.tan(((CLIP / 2) * Math.PI) / 180) / Math.tan((50 * Math.PI) / 180);
  let viewTimer = 0;

  function zoomTo(k, ms) {
    canvasSel.interrupt();
    if (!ms || reduceMotion.matches) canvasSel.call(zoom.scaleTo, k);
    else canvasSel.transition().duration(ms).ease(d3.easeCubicInOut).call(zoom.scaleTo, k);
  }

  function updateViewButtons() {
    const kc = centreK();
    els.viewEdge.setAttribute("aria-pressed", String(state.k < 1.05));
    els.viewCentre.setAttribute("aria-pressed", String(Math.abs(Math.log(state.k / kc)) < 0.1));
  }

  // New place: turn the globe with the whole map in view, so the new edge is seen,
  // then zoom in on the area around the centre.
  function select(sel, { animate = true, updateUrl = true } = {}) {
    state.sel = sel;
    clearTimeout(viewTimer);
    const target = antipode(sel.lon, sel.lat);
    if (animate && !reduceMotion.matches) {
      if (state.k > 1.05) zoomTo(1, 800);
      // turn → zoom in to show where the centre is → back out to the whole, inside-out map
      animateTo(target, () => {
        viewTimer = setTimeout(() => {
          zoomTo(centreK(), 1600);
          viewTimer = setTimeout(() => zoomTo(1, 1800), 1600 + 2800);
        }, 450);
      });
    } else {
      stopAnim();
      state.centre = target;
      zoomTo(1, 0);
      render(false);
    }
    updateInfo();
    if (updateUrl) writeUrl();
  }

  function stopAnim() { if (anim) { anim.stop(); anim = null; } }

  function animateTo(target, onEnd) {
    stopAnim();
    const from = state.centre.slice();
    const dist = d3.geoDistance(from, target);
    if (dist < 1e-6) { state.centre = target; render(false); if (onEnd) onEnd(); return; }
    const interp = d3.geoInterpolate(from, target);
    const duration = 700 + 900 * (dist / Math.PI);
    anim = d3.timer((elapsed) => {
      const tt = Math.min(1, elapsed / duration);
      state.centre = interp(d3.easeCubicInOut(tt));
      if (tt >= 1) { state.centre = target; stopAnim(); render(false); updateCentreKind(); if (onEnd) onEnd(); }
      else render(true);
    });
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

  function shareUrl() {
    const s = state.sel;
    const params = new URLSearchParams();
    params.set("lat", s.lat.toFixed(2));
    params.set("lon", s.lon.toFixed(2));
    if (s.name && s.source !== "geo") params.set("name", s.name);
    return `${location.origin}${location.pathname}?${params.toString()}`;
  }

  async function share() {
    if (state.sel.source === "geo" && !window.confirm(t("shareConfirm"))) return;
    const url = shareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setStatus(t("copied"));
    } catch (e) {
      window.prompt(t("copyFailed"), url);
    }
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
    closeResults();
    els.q.value = "";
    els.q.blur();
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
  const canvasSel = d3.select(canvas);
  let prevT = null, dragged = false;
  const zoom = d3.zoom()
    .scaleExtent([1, 600])
    .clickDistance(5)
    .on("start", (e) => {
      prevT = e.transform; dragged = false;
      state.interacting = true;
      if (e.sourceEvent) clearTimeout(viewTimer);
      if (e.sourceEvent && e.sourceEvent.type !== "wheel") canvas.classList.add("dragging");
    })
    .on("zoom", (e) => {
      const tr = e.transform;
      if (tr.k !== prevT.k) {
        state.k = tr.k;
        updateViewButtons();
      } else if (e.sourceEvent) {
        const dx = tr.x - prevT.x, dy = tr.y - prevT.y;
        if (dx || dy) {
          stopAnim();
          dragged = true;
          const degPerPx = Math.min(0.5, (2 * 180 / Math.PI) / (baseScale * state.k));
          const lon = wrapLon(state.centre[0] - dx * degPerPx);
          const lat = Math.max(-89.9, Math.min(89.9, state.centre[1] + dy * degPerPx));
          state.centre = [lon, lat];
          state.sel = { lat: -lat, lon: wrapLon(lon + 180), name: "", ja: "", country: "", source: "drag" };
          updateInfoLight();
        }
      }
      prevT = tr;
      requestRender(true);
    })
    .on("end", () => {
      state.interacting = false;
      canvas.classList.remove("dragging");
      if (dragged) {
        const s = state.sel;
        state.sel = selFromPoint(s.lon, s.lat, "drag");
        updateInfo();
        writeUrl();
      }
      requestRender(false);
    });
  canvasSel.call(zoom).on("dblclick.zoom", null);

  function updateInfoLight() {
    els.selName.textContent = t("pointName");
    $("townName").textContent = fmtCoord(state.sel.lat, state.sel.lon);
    els.selCoord.textContent = fmtCoord(state.sel.lat, state.sel.lon);
    els.ctrCoord.textContent = fmtCoord(state.centre[1], state.centre[0]);
  }

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const pt = [e.clientX - rect.left, e.clientY - rect.top];
    updateProjection();
    const ll = projection.invert(pt);
    if (!ll || !isFinite(ll[0]) || !isFinite(ll[1])) return;
    if (d3.geoDistance(ll, state.centre) > (CLIP * Math.PI) / 180) return; // beyond the edge
    setStatus("");
    select(selFromPoint(ll[0], ll[1], "click"));
  });

  els.viewEdge.addEventListener("click", () => { clearTimeout(viewTimer); zoomTo(1, 900); });
  els.viewCentre.addEventListener("click", () => { clearTimeout(viewTimer); zoomTo(centreK(), 900); });
  els.zoomIn.addEventListener("click", () => canvasSel.transition().duration(reduceMotion.matches ? 0 : 250).call(zoom.scaleBy, 2));
  els.zoomOut.addEventListener("click", () => canvasSel.transition().duration(reduceMotion.matches ? 0 : 250).call(zoom.scaleBy, 0.5));

  // ---------- buttons ----------
  els.circles.addEventListener("click", () => {
    state.showCircles = !state.showCircles;
    els.circles.setAttribute("aria-pressed", String(state.showCircles));
    els.circleLegend.hidden = !state.showCircles;
    render(false);
  });
  els.share.addEventListener("click", share);
  els.geo.addEventListener("click", () => {
    if (!("geolocation" in navigator)) { setStatus(t("geoUnsupported")); return; }
    setStatus(t("geoWaiting"));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setStatus(t("geoUsed"));
        state.myLoc = [longitude, latitude];
        select({ lat: latitude, lon: longitude, name: "", ja: "", country: "", source: "geo" });
      },
      (err) => setStatus(err.code === 1 ? t("geoDenied") : t("geoFailed")),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    );
  });
  $("aboutBtn").addEventListener("click", () => {
    const about = $("about");
    about.open = !about.open;
    if (about.open) about.querySelector("summary").focus();
  });
  els.infoToggle.addEventListener("click", () => {
    const collapsed = els.info.classList.toggle("collapsed");
    els.infoToggle.setAttribute("aria-expanded", String(!collapsed));
    if (collapsed) resize();
  });
  if (window.innerWidth < 760) {
    els.info.classList.add("collapsed");
    els.infoToggle.setAttribute("aria-expanded", "false");
  }

  // ---------- language ----------
  function applyLang() {
    setStatus("");
    document.documentElement.lang = lang;
    document.title = t("title");
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    els.zoomIn.setAttribute("aria-label", t("zoomIn"));
    els.zoomOut.setAttribute("aria-label", t("zoomOut"));
    $("viewGroup").setAttribute("aria-label", t("viewLabel"));
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
    state.centre = antipode(state.sel.lon, state.sel.lat);
    window.addEventListener("resize", resize);
    resize();
    applyLang();

    world110 = toWorld(await d3.json("data/countries-110m.json"));
    render(false); updateCentreKind();
    startGlobe();
    reduceMotion.addEventListener?.("change", startGlobe);

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
    render(false);
    document.body.dataset.ready = "true";
  }

  init().catch((err) => { console.error(err); setStatus("Failed to load map data."); });
})();
