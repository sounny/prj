/**
 * PRJ Clearinghouse — Detail Page Logic
 * Handles: tabs, copy buttons, downloads, D3 preview
 */

// ── Tab System ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initCopyButtons();
  renderMainPreview('double');
});

function initTabs() {
  const tabBar = document.getElementById('tab-bar');
  if (!tabBar) return;

  tabBar.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;

      // Update buttons
      tabBar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panes
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      const pane = document.getElementById(`tab-${tabId}`);
      if (pane) pane.classList.add('active');
    });
  });
}

// ── Copy to Clipboard ──────────────────────────────────────
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
      copyCode(targetId, btn);
    });
  });
}

function copyCode(elementId, btnEl) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const text = el.textContent;
  navigator.clipboard.writeText(text).then(() => {
    // Find the button that triggered this
    const btn = btnEl || document.querySelector(`[onclick="copyCode('${elementId}')"]`);
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.remove('copied');
      }, 2000);
    }
  }).catch(() => {
    // Fallback for older browsers
    const range = document.createRange();
    range.selectNode(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  });
}

// ── Download Functions ─────────────────────────────────────
function downloadPRJ() {
  const content = `PROJCS["Nicolosi_Globular",GEOGCS["GCS_Sphere",DATUM["D_Sphere",SPHEROID["Sphere",6371000.0,0.0]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Nicolosi_Globular"],PARAMETER["Central_Meridian",0.0],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],UNIT["Meter",1.0]]`;
  downloadFile(content, 'nicolosi_globular.prj', 'text/plain');
}

function downloadWKT2() {
  const content = `PROJCRS["Nicolosi Globular",
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
]`;
  downloadFile(content, 'nicolosi_globular_wkt2.txt', 'text/plain');
}

function downloadJSON() {
  const content = JSON.stringify({
    type: "ProjectedCRS",
    name: "Nicolosi Globular",
    id: { authority: "PROJ", code: "nicol" },
    baseGeographicCRS: {
      type: "GeographicCRS",
      name: "GCS Sphere",
      datum: {
        type: "GeodeticReferenceFrame",
        name: "Sphere",
        ellipsoid: { name: "Sphere", semiMajorAxis: 6371000.0, inverseFlattening: 0 }
      },
      primeMeridian: { name: "Greenwich", longitude: 0 },
      coordinateSystem: {
        subtype: "ellipsoidal",
        axis: [
          { name: "Geodetic latitude",  abbreviation: "Lat", direction: "north", unit: "degree" },
          { name: "Geodetic longitude", abbreviation: "Lon", direction: "east",  unit: "degree" }
        ]
      }
    },
    conversion: {
      name: "Nicolosi Globular",
      method: { name: "Nicolosi Globular", projAlias: "nicol" },
      parameters: [
        { name: "Longitude of natural origin", value: 0, unit: "degree" },
        { name: "False easting",               value: 0, unit: "metre"  },
        { name: "False northing",              value: 0, unit: "metre"  }
      ]
    },
    coordinateSystem: {
      subtype: "Cartesian",
      axis: [
        { name: "Easting",  abbreviation: "E", direction: "east",  unit: "metre" },
        { name: "Northing", abbreviation: "N", direction: "north", unit: "metre" }
      ]
    },
    projString: "+proj=nicol +lon_0=0 +R=6371000 +x_0=0 +y_0=0",
    metadata: {
      inventor: "Abū Rayḥān al-Bīrūnī",
      yearInvented: 1000,
      westernReinventor: "Giovanni Battista Nicolosi",
      yearReinvented: 1660,
      classification: ["pseudoconical", "globular", "compromise"],
      hemisphere: true,
      conformal: false,
      equalArea: false,
      equidistant: false,
      epsg: null,
      projUrl: "https://proj.org/en/stable/operations/projections/nicol.html",
      wikiUrl: "https://en.wikipedia.org/wiki/Nicolosi_globular_projection"
    }
  }, null, 2);
  downloadFile(content, 'nicolosi_globular.json', 'application/json');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── D3-style SVG Preview ───────────────────────────────────
let showTissot = true;
let currentView = 'double';

function setView(view) {
  currentView = view;
  document.querySelectorAll('.preview-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`btn-${view}`);
  if (btn) btn.classList.add('active');
  renderMainPreview(view);
}

function toggleTissot() {
  showTissot = !showTissot;
  const btn = document.getElementById('btn-tissot');
  if (btn) {
    btn.classList.toggle('active', showTissot);
    btn.textContent = showTissot ? 'Tissot ✓' : 'Tissot';
  }
  renderMainPreview(currentView);
}

function renderMainPreview(view) {
  const svg = document.getElementById('main-preview');
  if (!svg) return;

  const ns = 'http://www.w3.org/2000/svg';
  svg.innerHTML = '';

  const W = 1000, H = 560;
  svg.setAttribute('viewBox', `${-W/2} ${-H/2} ${W} ${H}`);

  // Defs
  const defs = document.createElementNS(ns, 'defs');
  defs.innerHTML = `
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="sphere-main" cx="38%" cy="32%" r="65%">
      <stop offset="0%" stop-color="#1a3a6a"/>
      <stop offset="60%" stop-color="#0d1f40"/>
      <stop offset="100%" stop-color="#060d1f"/>
    </radialGradient>
    <radialGradient id="sphere-sheen" cx="30%" cy="25%" r="50%">
      <stop offset="0%" stop-color="rgba(99,130,255,0.08)"/>
      <stop offset="100%" stop-color="rgba(99,130,255,0)"/>
    </radialGradient>
  `;
  svg.appendChild(defs);

  // Background
  const bg = document.createElementNS(ns, 'rect');
  bg.setAttribute('x', -W/2); bg.setAttribute('y', -H/2);
  bg.setAttribute('width', W); bg.setAttribute('height', H);
  bg.setAttribute('fill', '#060a12');
  svg.appendChild(bg);

  const el = (tag, attrs, parent) => {
    const e = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k, v));
    if (parent) parent.appendChild(e);
    return e;
  };

  // Determine hemispheres to draw
  let hemispheres = [];
  if (view === 'double') {
    hemispheres = [
      { lon0: -90, ox: -240, label: 'Western Hemisphere (90°W)' },
      { lon0:  90, ox:  240, label: 'Eastern Hemisphere (90°E)' }
    ];
  } else if (view === 'west') {
    hemispheres = [{ lon0: -90, ox: 0, label: 'Western Hemisphere (90°W)' }];
  } else {
    hemispheres = [{ lon0:  90, ox: 0, label: 'Eastern Hemisphere (90°E)' }];
  }

  const R = view === 'double' ? 200 : 230;

  hemispheres.forEach(({ lon0, ox, label }) => {
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('transform', `translate(${ox}, 0)`);
    svg.appendChild(g);

    // Sphere base
    el('circle', { cx: 0, cy: 0, r: R, fill: 'url(#sphere-main)' }, g);

    // Graticule — parallels
    for (let lat = -75; lat <= 75; lat += 15) {
      const phi = (lat * Math.PI) / 180;
      const y_c = -R * Math.sin(phi);
      const x_half = R * Math.cos(phi);
      if (Math.abs(y_c) < R) {
        const isMajor = lat === 0 || lat === 23.5 || lat === -23.5 || lat === 66.5 || lat === -66.5;
        const path = document.createElementNS(ns, 'path');
        // Nicolosi parallel: arc from left edge to right edge
        const ctrl_y = y_c * 0.88;
        path.setAttribute('d', `M ${-x_half} ${y_c} Q 0 ${ctrl_y} ${x_half} ${y_c}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', isMajor ? 'rgba(99,130,255,0.35)' : 'rgba(99,130,255,0.15)');
        path.setAttribute('stroke-width', isMajor ? '0.8' : '0.4');
        if (isMajor) path.setAttribute('stroke-dasharray', lat !== 0 ? '4 3' : 'none');
        g.appendChild(path);
      }
    }

    // Graticule — meridians
    for (let lon = -75; lon <= 75; lon += 15) {
      const lam = (lon * Math.PI) / 180;
      const x_eq = R * Math.sin(lam);
      if (Math.abs(x_eq) < R) {
        const isMajor = lon === 0;
        const path = document.createElementNS(ns, 'path');
        const ctrl_x = x_eq * 1.35;
        path.setAttribute('d', `M 0 ${-R} Q ${ctrl_x} 0 0 ${R}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', isMajor ? 'rgba(99,130,255,0.5)' : 'rgba(99,130,255,0.15)');
        path.setAttribute('stroke-width', isMajor ? '0.9' : '0.4');
        g.appendChild(path);
      }
    }

    // Equator line
    el('line', { x1: -R, y1: 0, x2: R, y2: 0, stroke: 'rgba(99,130,255,0.5)', 'stroke-width': '0.9' }, g);

    // Sphere sheen
    el('circle', { cx: 0, cy: 0, r: R, fill: 'url(#sphere-sheen)' }, g);

    // Tissot indicatrices
    if (showTissot) {
      for (let lat = -60; lat <= 60; lat += 30) {
        for (let lon = -60; lon <= 60; lon += 30) {
          const phi = (lat * Math.PI) / 180;
          const lam = (lon * Math.PI) / 180;

          // Approximate Nicolosi forward projection
          const { x: tx, y: ty } = nicolosiForward(phi, lam, 0, R);

          if (Math.sqrt(tx * tx + ty * ty) < R * 0.95) {
            // Scale Tissot radius by approximate distortion
            const distortion = Math.abs(lat) / 90 * 0.5 + 0.5;
            const tr = (view === 'double' ? 12 : 14) * distortion;
            const tc = document.createElementNS(ns, 'ellipse');
            tc.setAttribute('cx', tx);
            tc.setAttribute('cy', -ty);
            tc.setAttribute('rx', tr * 0.85);
            tc.setAttribute('ry', tr);
            tc.setAttribute('fill', 'rgba(99,130,255,0.12)');
            tc.setAttribute('stroke', 'rgba(99,130,255,0.7)');
            tc.setAttribute('stroke-width', '0.6');
            g.appendChild(tc);
          }
        }
      }
    }

    // Bounding circle (glowing)
    el('circle', {
      cx: 0, cy: 0, r: R,
      fill: 'none',
      stroke: 'rgba(99,130,255,0.8)',
      'stroke-width': '1.5',
      filter: 'url(#glow)'
    }, g);

    // Label
    const lbl = document.createElementNS(ns, 'text');
    lbl.setAttribute('x', 0);
    lbl.setAttribute('y', R + 22);
    lbl.setAttribute('text-anchor', 'middle');
    lbl.setAttribute('fill', 'rgba(139,156,200,0.7)');
    lbl.setAttribute('font-size', view === 'double' ? '11' : '13');
    lbl.setAttribute('font-family', 'Inter, sans-serif');
    lbl.textContent = label;
    g.appendChild(lbl);
  });

  // Title
  const title = document.createElementNS(ns, 'text');
  title.setAttribute('x', 0);
  title.setAttribute('y', -H/2 + 22);
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('fill', 'rgba(99,130,255,0.5)');
  title.setAttribute('font-size', '11');
  title.setAttribute('font-family', 'JetBrains Mono, monospace');
  title.textContent = '+proj=nicol  ·  Nicolosi Globular Projection  ·  Spherical Earth R=6371km  ·  15° graticule';
  svg.appendChild(title);
}

// ── Nicolosi Forward Projection (JavaScript implementation) ──
function nicolosiForward(phi, lam, lam0, R) {
  const dl = lam - lam0;

  // Special cases
  if (Math.abs(dl) < 1e-10) return { x: 0, y: R * phi };
  if (Math.abs(phi) < 1e-10) return { x: R * dl, y: 0 };
  if (Math.abs(Math.abs(dl) - Math.PI / 2) < 1e-10) {
    return { x: R * dl * Math.cos(phi), y: (Math.PI / 2) * R * Math.sin(phi) };
  }
  if (Math.abs(Math.abs(phi) - Math.PI / 2) < 1e-10) {
    return { x: 0, y: R * phi };
  }

  const b = Math.PI / (2 * dl) - (2 * dl) / Math.PI;
  const c = (2 * phi) / Math.PI;
  const d = (1 - c * c) / (Math.sin(phi) - c);
  const b2d2 = (b * b) / (d * d);
  const d2b2 = (d * d) / (b * b);

  const M = (b * Math.sin(phi) / d - b / 2) / (1 + b2d2);
  const N = (d * d * Math.sin(phi) / (b * b) + d / 2) / (1 + d2b2);

  const disc_x = M * M + Math.cos(phi) * Math.cos(phi) / (1 + b2d2);
  const disc_y = N * N - (d2b2 * Math.sin(phi) * Math.sin(phi) + d * Math.sin(phi) - 1) / (1 + d2b2);

  const sign_x = dl > 0 ? 1 : -1;
  const sign_y = phi < 0 ? 1 : -1;

  const x = (Math.PI / 2) * R * (M + sign_x * Math.sqrt(Math.max(0, disc_x)));
  const y = (Math.PI / 2) * R * (N + sign_y * Math.sqrt(Math.max(0, disc_y)));

  return { x, y };
}
