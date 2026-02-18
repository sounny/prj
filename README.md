# PRJ — Coordinate Reference Systems Clearinghouse

**Live site:** [sounny.github.io/prj](https://sounny.github.io/prj)

A comprehensive open clearinghouse for GIS projection files (`.prj`), WKT definitions, and spatial coordinate reference system (CRS) reference materials. Built for cartographers, GIS analysts, and spatial data scientists.

## Features

- 📥 **Download projection files** — `.prj`, WKT-1, WKT-2, ESRI WKT, JSON
- 🗺️ **Interactive D3 previews** — Visualize each projection with graticule and Tissot indicatrices
- 📚 **Scholarly context** — History, mathematical formulae, and references for each projection
- 🔍 **Search & filter** — Find projections by name, type, or property
- 📋 **Copy-to-clipboard** — One-click copy for all format definitions

## Supported Formats

| Format                 | Description                       |
| ---------------------- | --------------------------------- |
| WKT-1 (Human-Readable) | OGC Well-Known Text v1, formatted |
| OGC WKT-1              | Machine-readable ISO 19125        |
| WKT-2 (Human-Readable) | ISO 19162:2019, formatted         |
| OGC WKT-2              | Machine-readable ISO 19162:2019   |
| ESRI WKT               | ArcGIS / ArcPro compatible        |
| `.PRJ`                 | Shapefile projection file         |
| PROJ String            | PROJ 4/6/9 format                 |
| JSON                   | GeoJSON-compatible CRS object     |

## Projections

| Name                                                    | Year     | EPSG | Classification                        |
| ------------------------------------------------------- | -------- | ---- | ------------------------------------- |
| [Nicolosi Globular](projections/nicolosi-globular.html) | ~1000 CE | None | Pseudoconical · Globular · Compromise |

_More projections coming soon. Contributions welcome!_

## Adding a Projection

1. Add your projection data to `js/data.js` following the existing schema
2. Create a detail page in `projections/your-projection-name.html`
3. Open a pull request

## Tech Stack

- Pure HTML, CSS, JavaScript — no build step required
- Inline SVG for projection previews (JavaScript implementation of forward projection formulae)
- Hosted on GitHub Pages

## References

- Snyder, J.P. (1993). _Flattening the Earth_. University of Chicago Press.
- Snyder, J.P. (1989). _An Album of Map Projections_. USGS Professional Paper 1453.
- [PROJ Documentation](https://proj.org/en/stable/operations/projections/)
- [EPSG Geodetic Parameter Dataset](https://epsg.org/)

## License

Open data, open source. Projection definitions are derived from public domain sources (USGS, PROJ, EPSG).
