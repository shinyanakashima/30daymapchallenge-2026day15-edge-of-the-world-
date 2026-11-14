// Builds data/country-labels.json from Natural Earth ne_50m_admin_0_countries.geojson
// Usage: node scripts/build-country-labels.mjs path/to/ne_50m_admin_0_countries.geojson
import { readFileSync, writeFileSync } from "node:fs";

const src = process.argv[2];
if (!src) {
  console.error("usage: node scripts/build-country-labels.mjs <ne_50m_admin_0_countries.geojson>");
  process.exit(1);
}
const gj = JSON.parse(readFileSync(src, "utf8"));
const round = (v) => Math.round(v * 100) / 100;
const rows = gj.features.map((f) => {
  const p = f.properties;
  // [English, Japanese, label lon, label lat, min label zoom (smaller = more important)]
  return [p.NAME, p.NAME_JA || "", round(p.LABEL_X), round(p.LABEL_Y), p.MIN_LABEL];
});
rows.sort((a, b) => a[4] - b[4]);
writeFileSync(new URL("../data/country-labels.json", import.meta.url), JSON.stringify(rows));
console.log(rows.length, "countries");
