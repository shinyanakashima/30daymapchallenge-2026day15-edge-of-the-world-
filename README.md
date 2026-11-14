# Your town, the edge of the world

**#30DayMapChallenge 2026 — Day 15: Inside out**
("Inside out, upside down. Something on this map is not quite right.")

**Live:** https://shinyanakashima.github.io/30daymapchallenge-2026day15-edge-of-the-world-/

![Bristol turned inside out: Great Britain wraps around the outer edge and the rest of the world sits in the middle](docs/screenshot.png)

Pick your town. With the slider at **Normal** it sits in the middle of an ordinary-looking map. Move the slider to **Inside out** (or press **Play**) and the map turns inside out: the centre travels to the other side of the Earth, your town is pushed outward and stretched until it wraps around the whole map as its outer edge, and the rest of the world is squeezed into the middle.

The map opens with Bristol, UK (51.45°N, 2.58°W), already inside out. When it is inside out, the centre is 51.45°S, 177.42°E in the Pacific Ocean south-east of New Zealand, and Great Britain, Ireland and the seas around them fill most of the disc.

The page is in English and can be switched to Japanese (日本語).

## How to use

- **Your town** is shown at the top of the panel. Change it by searching a town by its English name. Major cities, and towns in Japan, can also be found by their Japanese name (e.g. 帯広).
- **Click** a point on the map to open a small bubble; **Make this your town** changes your town to that point. Clicking alone changes nothing.
- **Use where I am** makes your current position (from the browser) your town. A blue marker for it stays on the map when you choose other towns, until the page is reloaded.
- The page opens on the inside-out map. Nothing moves on its own: the turn from an ordinary map plays only when you press **Play**, and touching the map stops it. Choosing another town keeps the current slider position and zoom; the map just turns to the new town.
- **Normal ↔ Inside out** slider: turn the map by hand. **Play** runs the turn again.
- **Drag** to move the map, **scroll / pinch** or **− / +** to zoom. Neither changes your town.
- **Equal circles** shows circles that all have a 500 km radius on the ground, placed at increasing distance from the centre (the same idea as Tissot's indicatrix).
- The address bar holds your town as `?lat=&lon=&name=`, so the page can be bookmarked or linked. A town that came from your location is not written there.
- The red hatched band is everything within 500 km of your town. On the inside-out map it covers 89% of the map, but only 0.15% of the Earth's surface.
- Country names appear where the map is enlarged enough to fit them.

The panel also shows the centre of the inside-out map and whether it is on land or sea, and how much a set of major cities is enlarged on the inside-out map.

## The projection

- Stereographic projection (`d3.geoStereographic`). It is conformal: angles are kept, so small shapes look right, but scale grows with distance from the centre.
- On a Mercator map, scale grows away from the equator. On this map, scale grows away from the centre.
- On the inside-out map the centre is the antipode of your town: for a place at (lat, lon) the centre is (−lat, lon + 180°), set with `projection.rotate`.
- The slider moves the centre from your town along a great circle heading east, 180° to the antipode, while the zoom is set so that your town moves steadily from the centre out to the edge circle. Heading east keeps the path away from the poles, so the map does not flip.
- At angular distance *c* from the centre, lengths are enlarged by 2 / (1 + cos *c*) and areas by the square of that. At *c* = 180° (your town itself) the enlargement is infinite, so the place cannot be drawn as a point and appears as the outer circle.
- Dashed circles mark fixed ground distances from your town. Because they are centred on the projection centre, they appear as concentric circles.

## Notes

- **Clipping.** The map is cut at 178.5° from the centre (`clipAngle(178.5)`). The area within 1.5° (about 170 km) of your town is not drawn; the outer circle stands for it.
- **Location.** Your location is used only inside your browser. It is not sent anywhere and not saved, and it is not written to the address bar.
- Country borders use the 1:110m data while the map is moving and the 1:50m data when it stops.

## Data

- [Natural Earth](https://www.naturalearthdata.com/) (public domain)
  - Admin 0 – Countries, 1:110m and 1:50m, as TopoJSON from [world-atlas](https://github.com/topojson/world-atlas) 2.0.2
  - Admin 0 – Countries 1:50m: names and label points (`data/country-labels.json`, built with `scripts/build-country-labels.mjs`)
  - Populated Places, 1:10m (`data/places.json`, built with `scripts/build-places.mjs`)
- Libraries: [D3](https://d3js.org/) 7.9.0, [topojson-client](https://github.com/topojson/topojson-client) 3.1.0 (ISC licence, files in `vendor/`)

## Run locally

No build step. Serve the folder with any static server, for example:

```sh
python3 -m http.server 8000
```

To rebuild the town list and the country names:

```sh
curl -LO https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_populated_places.geojson
node scripts/build-places.mjs ne_10m_populated_places.geojson
curl -LO https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson
node scripts/build-country-labels.mjs ne_50m_admin_0_countries.geojson
```

Deployed to GitHub Pages by `.github/workflows/pages.yml` on every push to `main`.
