// Builds data/places.json from Natural Earth ne_10m_populated_places.geojson
// Usage: node scripts/build-places.mjs path/to/ne_10m_populated_places.geojson
import { readFileSync, writeFileSync } from "node:fs";

const src = process.argv[2];
if (!src) {
  console.error("usage: node scripts/build-places.mjs <ne_10m_populated_places.geojson>");
  process.exit(1);
}
const gj = JSON.parse(readFileSync(src, "utf8"));
const round = (v) => Math.round(v * 1000) / 1000;

const rows = gj.features.map((f) => {
  const p = f.properties;
  const pop = p.POP_MAX || 0;
  // Japanese names: all places in Japan, plus large cities elsewhere
  const ja = p.NAME_JA && (p.ADM0_A3 === "JPN" || pop >= 1000000) ? p.NAME_JA : "";
  return [p.NAME, p.NAMEASCII === p.NAME ? "" : p.NAMEASCII, ja, p.ADM0NAME, round(p.LATITUDE), round(p.LONGITUDE), pop];
});
rows.sort((a, b) => b[6] - a[6]);
writeFileSync(new URL("../data/places.json", import.meta.url), JSON.stringify(rows));
console.log(rows.length, "places");
