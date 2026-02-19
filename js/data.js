/**
 * PRJ Clearinghouse — Projection Data Store
 * Each entry contains full CRS definitions in all supported formats.
 */
const PROJECTIONS = [
  {
    id: "nicolosi-globular",
    name: "Nicolosi Globular",
    altNames: ["Al-Biruni Globular", "Nicolosi's Globular"],
    year: 1000,
    inventor: "Abū Rayḥān al-Bīrūnī (reinvented by Giovanni Battista Nicolosi, 1660)",
    epsg: null,
    epsgNote: "Not registered in the EPSG Geodetic Parameter Dataset. This is a spherical, historical compromise projection.",
    esriWKID: null,
    esriNote: "Not natively supported in the ESRI Projection Engine. Identified by the name 'Nicolosi_Globular' in custom WKT definitions.",
    projString: "+proj=nicol +lon_0=0 +x_0=0 +y_0=0 +R=6371000 +units=m +no_defs",
    classification: ["globular", "pseudoconical", "compromise"],
    properties: {
      conformal: false,
      equalArea: false,
      equidistant: false,
      compromise: true,
      hemisphere: true,
    },
    domain: "Hemispheric (one hemisphere per map)",
    sphere: "Spherical only (no ellipsoidal form)",
    units: "Meters (projected); Degrees (geographic input)",
    description: "The Nicolosi globular projection is a polyconic map projection invented around 1000 CE by the Persian polymath Abū Rayḥān al-Bīrūnī for celestial mapping. Reinvented in the Western world by Sicilian cartographer Giovanni Battista Nicolosi in 1660, it displays a single hemisphere within a circle. As a compromise projection, it preserves no single geometric property but achieves a visually balanced distribution of distortions. It reached peak use in the 19th century and is rarely employed today.",
    history: `Abū Rayḥān Muḥammad ibn Aḥmad Al-Bīrūnī, foremost scholar of the Islamic Golden Age, invented the first recorded globular projection for celestial maps around the year 1000 CE. The projection entered European cartographic practice through a chain of reinventions: Roger Bacon (13th century), Petrus Apianus (16th century), and Georges Fournier (16th century) each developed related globular constructions. In 1660, Giovanni Battista Nicolosi, a Sicilian chaplain working in Rome, independently reinvented al-Biruni's projection as a modification of Fournier's first projection. It is unlikely Nicolosi was aware of al-Biruni's prior work. The projection became relatively common in the 19th century as the stereographic projection fell out of favor for hemispheric world maps, and continued in use into the early 20th century.`,
    construction: `The construction is geometric and can be executed with compasses and straightedge. Given a bounding circle, the poles are placed at the top and bottom, and the central meridian is drawn as a vertical diameter. The equator is drawn as a horizontal diameter. Each remaining meridian is a circular arc through both poles, spaced equally along the equator. Each parallel is a circular arc from the left edge through the central meridian to the right edge, spaced equally along both the perimeter and the central meridian. The result closely resembles the azimuthal equidistant projection centered on the same point.`,
    math: [
      { label: "b", formula: "π / (2(λ−λ₀)) − 2(λ−λ₀) / π" },
      { label: "c", formula: "2φ / π" },
      { label: "d", formula: "(1 − c²) / (sin φ − c)" },
      { label: "M", formula: "(b·sin φ / d − b/2) / (1 + b²/d²)" },
      { label: "N", formula: "(d²·sin φ / b² + d/2) / (1 + d²/b²)" },
      { label: "x", formula: "(π/2)·R · (M ± √(M² + cos²φ / (1 + b²/d²)))" },
      { label: "y", formula: "(π/2)·R · (N ± √(N² − (d²/b²·sin²φ + d·sin φ − 1) / (1 + d²/b²)))" },
    ],
    specialCases: [
      { condition: "λ − λ₀ = 0 (central meridian)", x: "0", y: "R·φ" },
      { condition: "φ = 0 (equator)", x: "R·(λ−λ₀)", y: "0" },
      { condition: "|λ−λ₀| = π/2 (boundary meridian)", x: "R·(λ−λ₀)·cos φ", y: "(π/2)·R·sin φ" },
      { condition: "|φ| = π/2 (poles)", x: "0", y: "R·φ" },
    ],
    formats: {
      wkt1_html: {
        label: "WKT-1 (Human-Readable)",
        description: "OGC Well-Known Text version 1 formatted for readability. Based on ISO 19125.",
        content: `PROJCS["Nicolosi_Globular",
  GEOGCS["GCS_Sphere",
    DATUM["D_Sphere",
      SPHEROID["Sphere", 6371000.0, 0.0]
    ],
    PRIMEM["Greenwich", 0.0],
    UNIT["Degree", 0.0174532925199433]
  ],
  PROJECTION["Nicolosi_Globular"],
  PARAMETER["Central_Meridian", 0.0],
  PARAMETER["False_Easting", 0.0],
  PARAMETER["False_Northing", 0.0],
  UNIT["Meter", 1.0]
]`,
        humanReadable: [
          ["Projection Name", "Nicolosi Globular"],
          ["Geographic CRS", "GCS Sphere (Spherical Earth)"],
          ["Datum", "D_Sphere"],
          ["Spheroid", "Sphere — radius 6,371,000 m, flattening 0 (perfect sphere)"],
          ["Prime Meridian", "Greenwich (0°)"],
          ["Projection Method", "Nicolosi_Globular (pseudoconical, compromise)"],
          ["Central Meridian", "0° (Greenwich)"],
          ["False Easting", "0.0 m"],
          ["False Northing", "0.0 m"],
          ["Linear Unit", "Meter (1.0)"],
          ["Angular Unit", "Degree (0.01745329…)"],
        ]
      },
      wkt1_ogc: {
        label: "OGC WKT-1",
        description: "Machine-readable OGC WKT version 1 (ISO 19125 / GDAL format).",
        content: `PROJCS["Nicolosi_Globular",GEOGCS["GCS_Sphere",DATUM["D_Sphere",SPHEROID["Sphere",6371000.0,0.0]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Nicolosi_Globular"],PARAMETER["Central_Meridian",0.0],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],UNIT["Meter",1.0]]`
      },
      wkt2_html: {
        label: "WKT-2 (Human-Readable)",
        description: "ISO 19162:2019 Well-Known Text version 2, formatted for readability.",
        content: `PROJCRS["Nicolosi Globular",
  BASEGEOGCRS["GCS Sphere",
    DATUM["Sphere",
      ELLIPSOID["Sphere", 6371000, 0,
        LENGTHUNIT["metre", 1]]
    ],
    PRIMEM["Greenwich", 0,
      ANGLEUNIT["degree", 0.0174532925199433]],
    ID["EPSG", 4047]
  ],
  CONVERSION["Nicolosi Globular",
    METHOD["Nicolosi Globular",
      ID["PROJ", "nicol"]],
    PARAMETER["Longitude of natural origin", 0,
      ANGLEUNIT["degree", 0.0174532925199433],
      ID["EPSG", 8802]],
    PARAMETER["False easting", 0,
      LENGTHUNIT["metre", 1],
      ID["EPSG", 8806]],
    PARAMETER["False northing", 0,
      LENGTHUNIT["metre", 1],
      ID["EPSG", 8807]]
  ],
  CS[Cartesian, 2],
    AXIS["(E)", east,
      ORDER[1],
      LENGTHUNIT["metre", 1]],
    AXIS["(N)", north,
      ORDER[2],
      LENGTHUNIT["metre", 1]]
]`,
        humanReadable: [
          ["Standard", "ISO 19162:2019 (WKT-2)"],
          ["Projected CRS Name", "Nicolosi Globular"],
          ["Base Geographic CRS", "GCS Sphere (EPSG:4047 — GCS_Sphere)"],
          ["Ellipsoid", "Sphere — semi-major axis 6,371,000 m, inverse flattening 0"],
          ["Prime Meridian", "Greenwich (0°)"],
          ["Conversion Method", "Nicolosi Globular (PROJ alias: nicol)"],
          ["Central Meridian (lon_0)", "0° (Greenwich)"],
          ["False Easting", "0 m"],
          ["False Northing", "0 m"],
          ["Coordinate System", "Cartesian 2D"],
          ["Axis 1", "East (E), Order 1"],
          ["Axis 2", "North (N), Order 2"],
          ["Linear Unit", "Metre (1.0)"],
        ]
      },
      wkt2_ogc: {
        label: "OGC WKT-2",
        description: "Machine-readable ISO 19162:2019 WKT-2.",
        content: `PROJCRS["Nicolosi Globular",BASEGEOGCRS["GCS Sphere",DATUM["Sphere",ELLIPSOID["Sphere",6371000,0,LENGTHUNIT["metre",1]]],PRIMEM["Greenwich",0,ANGLEUNIT["degree",0.0174532925199433]],ID["EPSG",4047]],CONVERSION["Nicolosi Globular",METHOD["Nicolosi Globular",ID["PROJ","nicol"]],PARAMETER["Longitude of natural origin",0,ANGLEUNIT["degree",0.0174532925199433],ID["EPSG",8802]],PARAMETER["False easting",0,LENGTHUNIT["metre",1],ID["EPSG",8806]],PARAMETER["False northing",0,LENGTHUNIT["metre",1],ID["EPSG",8807]]],CS[Cartesian,2],AXIS["(E)",east,ORDER[1],LENGTHUNIT["metre",1]],AXIS["(N)",north,ORDER[2],LENGTHUNIT["metre",1]]]`
      },
      esri_wkt: {
        label: "ESRI WKT",
        description: "⚠️ ArcGIS Compatibility Warning: Nicolosi Globular is NOT in the ESRI Projection Engine (PE) database. ArcGIS Pro and ArcMap will NOT recognize the PROJECTION[\"Nicolosi_Globular\"] keyword and will silently fall back to a default projection (typically Mercator). This string is provided for completeness and for use with software that accepts custom WKT. For ArcGIS users, see the workaround instructions in the .PRJ tab below.",

        content: `PROJCS["Nicolosi_Globular",GEOGCS["GCS_Sphere",DATUM["D_Sphere",SPHEROID["Sphere",6371000.0,0.0]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Nicolosi_Globular"],PARAMETER["Central_Meridian",0.0],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],UNIT["Meter",1.0]]`,
        humanReadable: [
          ["Format", "ESRI WKT (Custom)"],
          ["Projection Name", "Nicolosi_Globular"],
          ["Geographic CRS", "GCS_Sphere"],
          ["Datum", "D_Sphere"],
          ["Spheroid Name", "Sphere"],
          ["Semi-Major Axis", "6,371,000.0 m"],
          ["Inverse Flattening", "0.0"],
          ["Prime Meridian", "Greenwich (0.0°)"],
          ["Projection Method", "Nicolosi_Globular"],
          ["Central_Meridian", "0.0°"],
          ["False_Easting", "0.0 m"],
          ["False_Northing", "0.0 m"],
          ["Linear Unit", "Meter (1.0)"],
        ]
      },
      prj: {
        label: ".PRJ",
        description: "⚠️ ArcGIS Pro / ArcMap Limitation: ArcGIS will NOT correctly interpret this .prj file. The Nicolosi Globular projection is NOT registered in the ESRI Projection Engine database, so ArcGIS silently falls back to Mercator when it encounters the unrecognized PROJECTION[\"Nicolosi_Globular\"] keyword. This is a known ESRI limitation, not a file error.\n\n✅ Workaround for ArcGIS Pro: (1) In ArcGIS Pro, go to the Map Properties → Coordinate System tab; (2) Click 'Add Coordinate System' → 'Import Coordinate System' and select this .prj file; (3) ArcGIS will import the geographic CRS (GCS_Sphere) correctly, but the projection method will not apply; (4) Instead, use the PROJ string (+proj=nicol +lon_0=0 +R=6371000 +x_0=0 +y_0=0) in the 'Custom Projection' dialog via ArcGIS Pro's 'New Projected Coordinate System' tool.\n\n✅ Recommended Alternative: Use QGIS or any GDAL-based tool, which reads the PROJ string natively and supports Nicolosi Globular (+proj=nicol) out of the box.",
        content: `PROJCS["Nicolosi_Globular",GEOGCS["GCS_Sphere",DATUM["D_Sphere",SPHEROID["Sphere",6371000.0,0.0]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Nicolosi_Globular"],PARAMETER["Central_Meridian",0.0],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],UNIT["Meter",1.0]]`,
        filename: "nicolosi_globular.prj",
        esriCompatible: false,
        esriNote: "Not recognized by ESRI Projection Engine. Use PROJ string in QGIS or GDAL instead."
      },
      proj: {
        label: "PROJ String",
        description: "PROJ 4/6/9 projection string. Supported natively in PROJ 9.x via the +proj=nicol alias.",
        content: `+proj=nicol +lon_0=0 +R=6371000 +x_0=0 +y_0=0 +units=m +no_defs`
      },
      json: {
        label: "JSON / GeoJSON CRS",
        description: "GeoJSON-compatible CRS object and a structured JSON representation of the projection parameters.",
        content: `{
  "type": "ProjectedCRS",
  "name": "Nicolosi Globular",
  "id": {
    "authority": "PROJ",
    "code": "nicol"
  },
  "baseGeographicCRS": {
    "type": "GeographicCRS",
    "name": "GCS Sphere",
    "datum": {
      "type": "GeodeticReferenceFrame",
      "name": "Sphere",
      "ellipsoid": {
        "name": "Sphere",
        "semiMajorAxis": 6371000.0,
        "inverseFlattening": 0
      }
    },
    "primeMeridian": {
      "name": "Greenwich",
      "longitude": 0
    },
    "coordinateSystem": {
      "subtype": "ellipsoidal",
      "axis": [
        { "name": "Geodetic latitude", "abbreviation": "Lat", "direction": "north", "unit": "degree" },
        { "name": "Geodetic longitude", "abbreviation": "Lon", "direction": "east", "unit": "degree" }
      ]
    }
  },
  "conversion": {
    "name": "Nicolosi Globular",
    "method": {
      "name": "Nicolosi Globular",
      "projAlias": "nicol"
    },
    "parameters": [
      { "name": "Longitude of natural origin", "value": 0, "unit": "degree" },
      { "name": "False easting", "value": 0, "unit": "metre" },
      { "name": "False northing", "value": 0, "unit": "metre" }
    ]
  },
  "coordinateSystem": {
    "subtype": "Cartesian",
    "axis": [
      { "name": "Easting", "abbreviation": "E", "direction": "east", "unit": "metre" },
      { "name": "Northing", "abbreviation": "N", "direction": "north", "unit": "metre" }
    ]
  },
  "projString": "+proj=nicol +lon_0=0 +R=6371000 +x_0=0 +y_0=0",
  "metadata": {
    "inventor": "Abū Rayḥān al-Bīrūnī",
    "yearInvented": 1000,
    "westernReinventor": "Giovanni Battista Nicolosi",
    "yearReinvented": 1660,
    "classification": ["pseudoconical", "globular", "compromise"],
    "hemisphere": true,
    "conformal": false,
    "equalArea": false,
    "equidistant": false
  }
}`
      }
    },
    references: [
      {
        text: "Snyder, J.P. (1993). Flattening the Earth: Two Thousand Years of Map Projections. University of Chicago Press. p. 41.",
        url: "https://press.uchicago.edu/ucp/books/book/chicago/F/bo3632853.html"
      },
      {
        text: "Snyder, J.P. (1989). An Album of Map Projections. USGS Professional Paper 1453. p. 234.",
        url: "https://pubs.usgs.gov/pp/1453/report.pdf"
      },
      {
        text: "Keuning, J. (1955). The history of geographical map projections until 1600. Imago Mundi, 12, 20.",
        url: "https://www.tandfonline.com/doi/abs/10.1080/03085695508592085"
      },
      {
        text: "PROJ Contributors (2025). Nicolosi Globular — PROJ 9.7.1 Documentation.",
        url: "https://proj.org/en/stable/operations/projections/nicol.html"
      },
      {
        text: "Wikipedia: Nicolosi globular projection.",
        url: "https://en.wikipedia.org/wiki/Nicolosi_globular_projection"
      }
    ],
    seeAlso: ["Azimuthal Equidistant", "Stereographic", "Fournier Globular I"],
    wikiUrl: "https://en.wikipedia.org/wiki/Nicolosi_globular_projection",
    projUrl: "https://proj.org/en/stable/operations/projections/nicol.html",
  },

  // ── Robinson ──────────────────────────────────────────────────────────────
  {
    id: "robinson",
    name: "Robinson",
    altNames: ["Orthophanic Projection"],
    year: 1963,
    inventor: "Arthur H. Robinson",
    epsg: null,
    epsgNote: "Not registered in the EPSG dataset. The ESRI authority code 54030 is the de facto standard for the World Robinson CRS.",
    esriWKID: 54030,
    esriNote: "Fully supported in ESRI Projection Engine as WKID 54030 (World_Robinson). ArcGIS Pro and ArcMap will correctly apply this projection.",
    projString: "+proj=robin +lon_0=0 +R=6371000 +x_0=0 +y_0=0 +units=m +no_defs",
    classification: ["pseudocylindrical", "compromise"],
    properties: {
      conformal: false,
      equalArea: false,
      equidistant: false,
      compromise: true,
      hemisphere: false,
    },
    domain: "World (whole-globe map)",
    sphere: "Spherical only (no ellipsoidal form defined in original formulation)",
    units: "Meters (projected); Degrees (geographic input)",
    description: "The Robinson projection is a pseudocylindrical world map projection devised by Arthur H. Robinson in 1963. It is a compromise projection, preserving neither conformality nor equal area, but distributing distortions across the map in a visually balanced manner. Meridians curve gently and parallels are straight horizontal lines. The National Geographic Society used it as its standard world map projection from 1988 to 1998.",
    history: `Arthur H. Robinson developed the projection in 1963 at the request of the Rand McNally cartographic company, which sought a world map projection with a pleasing aesthetic and acceptable distortion characteristics for general-purpose use. Robinson took an unusual approach: rather than beginning with equations, he manually tuned the visual shape of the projection until it looked right, then derived the mathematical table from that result. He published the tabular formulation in 1974.\n\nThe National Geographic Society adopted the Robinson projection in 1988 for its standard world maps, replacing the Van der Grinten projection. It was featured prominently in National Geographic atlases and educational materials throughout the late 20th century. In 1998, the NGS replaced it with the Winkel Tripel projection, citing further reduction of polar distortion. Today it remains widely used by the CIA World Factbook and the European Centre for Disease Prevention and Control (ECDC) for disease mapping.`,
    construction: `The Robinson projection is defined by a look-up table of 19 values at 5° latitude intervals (0° to 90°), with two columns: X (parallel length ratio relative to equator) and Y (distance from equator normalized to equator length). The table was derived empirically by Robinson to produce a visually pleasing result. Intermediate values between the tabulated latitudes are computed by interpolation — typically cubic spline or Aitken interpolation. The forward projection equations are then:\n\n  x = 0.8487 · R · X(φ) · (λ − λ₀)\n  y = 1.3523 · R · Y(φ)\n\nwhere X(φ) and Y(φ) are interpolated from the table.`,
    math: [
      { label: "x", formula: "0.8487 · R · X(φ) · (λ − λ₀)" },
      { label: "y", formula: "1.3523 · R · Y(φ)" },
      { label: "X(φ)", formula: "Tabulated parallel length ratio (interpolated from 5° table)" },
      { label: "Y(φ)", formula: "Tabulated parallel distance ratio (interpolated from 5° table)" },
    ],
    robinsonTable: [
      [0,   1.0000, 0.0000], [5,  0.9986, 0.0620], [10, 0.9954, 0.1240],
      [15,  0.9900, 0.1860], [20, 0.9822, 0.2480], [25, 0.9730, 0.3100],
      [30,  0.9600, 0.3720], [35, 0.9427, 0.4340], [40, 0.9216, 0.4958],
      [45,  0.8962, 0.5571], [50, 0.8679, 0.6176], [55, 0.8350, 0.6769],
      [60,  0.7986, 0.7346], [65, 0.7597, 0.7903], [70, 0.7186, 0.8435],
      [75,  0.6732, 0.8936], [80, 0.6213, 0.9394], [85, 0.5722, 0.9761],
      [90,  0.5322, 1.0000],
    ],
    formats: {
      wkt1_html: {
        label: "WKT-1 (Human-Readable)",
        description: "OGC Well-Known Text version 1 (ISO 19125), formatted for readability. Used by GDAL, QGIS, and most open-source GIS tools.",
        content: `PROJCS["World_Robinson",
  GEOGCS["GCS_WGS_1984",
    DATUM["D_WGS_1984",
      SPHEROID["WGS_1984", 6378137.0, 298.257223563]
    ],
    PRIMEM["Greenwich", 0.0],
    UNIT["Degree", 0.0174532925199433]
  ],
  PROJECTION["Robinson"],
  PARAMETER["Central_Meridian", 0.0],
  PARAMETER["False_Easting", 0.0],
  PARAMETER["False_Northing", 0.0],
  UNIT["Meter", 1.0]
]`,
        humanReadable: [
          ["Projection Name", "World Robinson"],
          ["Geographic CRS", "GCS_WGS_1984"],
          ["Datum", "D_WGS_1984"],
          ["Spheroid", "WGS_1984 — semi-major 6,378,137 m, inv. flat. 298.257223563"],
          ["Prime Meridian", "Greenwich (0°)"],
          ["Projection Method", "Robinson (pseudocylindrical, compromise)"],
          ["Central Meridian", "0° (Greenwich)"],
          ["False Easting", "0.0 m"],
          ["False Northing", "0.0 m"],
          ["Linear Unit", "Meter (1.0)"],
          ["Angular Unit", "Degree (0.01745329…)"],
        ]
      },
      wkt1_ogc: {
        label: "OGC WKT-1",
        description: "Machine-readable OGC WKT-1 (ISO 19125 / GDAL format). Single-line. Paste into GDAL, QGIS, or any ISO 19125-compatible tool.",
        content: `PROJCS["World_Robinson",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Robinson"],PARAMETER["Central_Meridian",0.0],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],UNIT["Meter",1.0]]`
      },
      wkt2_html: {
        label: "WKT-2 (Human-Readable)",
        description: "ISO 19162:2019 Well-Known Text version 2, formatted for readability.",
        content: `PROJCRS["World Robinson",
  BASEGEOGCRS["WGS 84",
    DATUM["World Geodetic System 1984",
      ELLIPSOID["WGS 84", 6378137, 298.257223563,
        LENGTHUNIT["metre", 1]]
    ],
    PRIMEM["Greenwich", 0,
      ANGLEUNIT["degree", 0.0174532925199433]],
    ID["EPSG", 4326]
  ],
  CONVERSION["Robinson",
    METHOD["Robinson",
      ID["PROJ", "robin"]],
    PARAMETER["Longitude of natural origin", 0,
      ANGLEUNIT["degree", 0.0174532925199433],
      ID["EPSG", 8802]],
    PARAMETER["False easting", 0,
      LENGTHUNIT["metre", 1],
      ID["EPSG", 8806]],
    PARAMETER["False northing", 0,
      LENGTHUNIT["metre", 1],
      ID["EPSG", 8807]]
  ],
  CS[Cartesian, 2],
    AXIS["(E)", east,
      ORDER[1],
      LENGTHUNIT["metre", 1]],
    AXIS["(N)", north,
      ORDER[2],
      LENGTHUNIT["metre", 1]]
]`,
        humanReadable: [
          ["Standard", "ISO 19162:2019 (WKT-2)"],
          ["Projected CRS Name", "World Robinson"],
          ["Base Geographic CRS", "WGS 84 (EPSG:4326)"],
          ["Ellipsoid", "WGS 84 — 6,378,137 m, inv. flat. 298.257223563"],
          ["Prime Meridian", "Greenwich (0°)"],
          ["Conversion Method", "Robinson (PROJ alias: robin)"],
          ["Central Meridian", "0° (Greenwich) [EPSG:8802]"],
          ["False Easting", "0 m [EPSG:8806]"],
          ["False Northing", "0 m [EPSG:8807]"],
          ["Coordinate System", "Cartesian 2D"],
          ["Axis 1", "Easting (E), east, Order 1"],
          ["Axis 2", "Northing (N), north, Order 2"],
          ["Linear Unit", "Metre (1.0)"],
        ]
      },
      wkt2_ogc: {
        label: "OGC WKT-2",
        description: "Machine-readable ISO 19162:2019 WKT-2. Compatible with PROJ 6+, GDAL 3+, and modern GIS software.",
        content: `PROJCRS["World Robinson",BASEGEOGCRS["WGS 84",DATUM["World Geodetic System 1984",ELLIPSOID["WGS 84",6378137,298.257223563,LENGTHUNIT["metre",1]]],PRIMEM["Greenwich",0,ANGLEUNIT["degree",0.0174532925199433]],ID["EPSG",4326]],CONVERSION["Robinson",METHOD["Robinson",ID["PROJ","robin"]],PARAMETER["Longitude of natural origin",0,ANGLEUNIT["degree",0.0174532925199433],ID["EPSG",8802]],PARAMETER["False easting",0,LENGTHUNIT["metre",1],ID["EPSG",8806]],PARAMETER["False northing",0,LENGTHUNIT["metre",1],ID["EPSG",8807]]],CS[Cartesian,2],AXIS["(E)",east,ORDER[1],LENGTHUNIT["metre",1]],AXIS["(N)",north,ORDER[2],LENGTHUNIT["metre",1]]]`
      },
      esri_wkt: {
        label: "ESRI WKT",
        description: "✅ Fully supported in the ESRI Projection Engine as WKID 54030 (World_Robinson). Works correctly in ArcGIS Pro and ArcMap.",
        content: `PROJCS["World_Robinson",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Robinson"],PARAMETER["Central_Meridian",0.0],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],UNIT["Meter",1.0]]`,
        humanReadable: [
          ["Format", "ESRI WKT"],
          ["ESRI WKID", "54030"],
          ["Projection Name", "World_Robinson"],
          ["Geographic CRS", "GCS_WGS_1984"],
          ["Datum", "D_WGS_1984"],
          ["Spheroid", "WGS_1984 — 6,378,137.0 m, inv. flat. 298.257223563"],
          ["Prime Meridian", "Greenwich (0.0°)"],
          ["Projection Method", "Robinson"],
          ["Central_Meridian", "0.0°"],
          ["False_Easting", "0.0 m"],
          ["False_Northing", "0.0 m"],
          ["Linear Unit", "Meter (1.0)"],
          ["ArcGIS Pro", "✅ Fully supported (WKID 54030)"],
          ["ArcMap", "✅ Fully supported (WKID 54030)"],
        ]
      },
      prj: {
        label: ".PRJ",
        description: "✅ Shapefile projection file (.prj). Works correctly in ArcGIS Pro, ArcMap, QGIS, GDAL, and all major GIS applications. Robinson is fully registered in the ESRI Projection Engine (WKID 54030).",
        content: `PROJCS["World_Robinson",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Robinson"],PARAMETER["Central_Meridian",0.0],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],UNIT["Meter",1.0]]`,
        filename: "robinson.prj",
        esriCompatible: true,
        esriWKID: 54030
      },
      proj: {
        label: "PROJ String",
        description: "PROJ 4/6/9 projection string. Natively supported via the +proj=robin alias. Works in GDAL, QGIS, Python (pyproj), R (sf), and command-line tools.",
        content: `+proj=robin +lon_0=0 +R=6371000 +x_0=0 +y_0=0 +units=m +no_defs`
      },
      json: {
        label: "JSON / GeoJSON CRS",
        description: "Structured JSON CRS definition with full projection metadata and GeoJSON-compatible CRS object.",
        content: `{
  "type": "ProjectedCRS",
  "name": "World Robinson",
  "id": {
    "authority": "ESRI",
    "code": 54030
  },
  "baseGeographicCRS": {
    "type": "GeographicCRS",
    "name": "WGS 84",
    "datum": {
      "type": "GeodeticReferenceFrame",
      "name": "World Geodetic System 1984",
      "ellipsoid": {
        "name": "WGS 84",
        "semiMajorAxis": 6378137.0,
        "inverseFlattening": 298.257223563
      }
    },
    "primeMeridian": { "name": "Greenwich", "longitude": 0 },
    "coordinateSystem": {
      "subtype": "ellipsoidal",
      "axis": [
        { "name": "Geodetic latitude",  "abbreviation": "Lat", "direction": "north", "unit": "degree" },
        { "name": "Geodetic longitude", "abbreviation": "Lon", "direction": "east",  "unit": "degree" }
      ]
    }
  },
  "conversion": {
    "name": "Robinson",
    "method": { "name": "Robinson", "projAlias": "robin" },
    "parameters": [
      { "name": "Longitude of natural origin", "value": 0, "unit": "degree" },
      { "name": "False easting",               "value": 0, "unit": "metre"  },
      { "name": "False northing",              "value": 0, "unit": "metre"  }
    ]
  },
  "coordinateSystem": {
    "subtype": "Cartesian",
    "axis": [
      { "name": "Easting",  "abbreviation": "E", "direction": "east",  "unit": "metre" },
      { "name": "Northing", "abbreviation": "N", "direction": "north", "unit": "metre" }
    ]
  },
  "projString": "+proj=robin +lon_0=0 +R=6371000 +x_0=0 +y_0=0",
  "metadata": {
    "inventor": "Arthur H. Robinson",
    "yearInvented": 1963,
    "commissionedBy": "Rand McNally",
    "formulation": "Tabular (empirically derived lookup table, 5° intervals)",
    "classification": ["pseudocylindrical", "compromise"],
    "domain": "World",
    "conformal": false,
    "equalArea": false,
    "equidistant": false,
    "esriWKID": 54030,
    "epsg": null,
    "projUrl": "https://proj.org/en/stable/operations/projections/robin.html",
    "wikiUrl": "https://en.wikipedia.org/wiki/Robinson_projection"
  }
}`
      }
    },
    references: [
      {
        text: "Robinson, A.H. (1974). A New Map Projection: Its Development and Characteristics. International Yearbook of Cartography, Vol. 14, pp. 145–155.",
        url: "https://en.wikipedia.org/wiki/Robinson_projection"
      },
      {
        text: "Snyder, J.P. (1993). Flattening the Earth: 2000 Years of Map Projections. Univ. of Chicago Press. pp. 214–216.",
        url: "https://press.uchicago.edu/ucp/books/book/chicago/F/bo3632853.html"
      },
      {
        text: "Snyder, J.P. & Voxland, P.M. (1989). An Album of Map Projections. USGS PP 1453. pp. 82–83.",
        url: "https://pubs.usgs.gov/pp/1453/report.pdf"
      },
      {
        text: "Ipbuker, C. (2005). A Computational Approach to the Robinson Projection. Survey Review, 38(297), 204–217.",
        url: "https://doi.org/10.1179/sre.2005.38.297.204"
      },
      {
        text: "PROJ Contributors (2025). Robinson — PROJ 9.7.1 Documentation.",
        url: "https://proj.org/en/stable/operations/projections/robin.html"
      }
    ],
    seeAlso: ["Winkel Tripel", "Van der Grinten", "Kavrayskiy VII", "Natural Earth"],
    wikiUrl: "https://en.wikipedia.org/wiki/Robinson_projection",
    projUrl: "https://proj.org/en/stable/operations/projections/robin.html",
  }
];
