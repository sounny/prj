/**
 * PRJ Clearinghouse — Main Application Logic
 * Handles: card rendering, search, filtering, sorting
 */

// ── State ──────────────────────────────────────────────────
let activeFilter = 'all';
let searchQuery  = '';
let sortMode     = 'name';

// ── DOM References ─────────────────────────────────────────
const grid       = document.getElementById('proj-grid');
const noResults  = document.getElementById('no-results');
const heroSearch = document.getElementById('hero-search');
const chips      = document.querySelectorAll('.chip');
const sortSelect = document.getElementById('sort-select');
const statCount  = document.getElementById('stat-count');

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  statCount.textContent = PROJECTIONS.length;
  renderGrid();
  bindEvents();
});

// ── Render ─────────────────────────────────────────────────
function renderGrid() {
  let data = [...PROJECTIONS];

  // Filter by classification or property
  if (activeFilter !== 'all') {
    const propMap = { 'conformal':'conformal','equal-area':'equalArea','equidistant':'equidistant','compromise':'compromise' };
    const propKey = propMap[activeFilter];
    if (propKey) {
      data = data.filter(p => p.properties?.[propKey]);
    } else {
      data = data.filter(p => p.classification.includes(activeFilter));
    }
  }

  // Filter by search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    data = data.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.altNames || []).some(n => n.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q) ||
      (p.epsg && String(p.epsg).includes(q)) ||
      p.inventor.toLowerCase().includes(q)
    );
  }

  // Sort
  data.sort((a, b) => {
    if (sortMode === 'name') return a.name.localeCompare(b.name);
    if (sortMode === 'year') return a.year - b.year;
    if (sortMode === 'epsg') {
      const ea = a.epsg || 999999;
      const eb = b.epsg || 999999;
      return ea - eb;
    }
    return 0;
  });

  grid.innerHTML = '';

  if (data.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }
  noResults.classList.add('hidden');

  data.forEach((proj, i) => {
    const card = buildCard(proj, i);
    grid.appendChild(card);
  });
}

function buildCard(proj, index) {
  const a = document.createElement('a');
  a.href = `projection.html?id=${proj.id}`;
  a.className = 'proj-card';
  a.style.animationDelay = `${index * 0.05}s`;

  const tags = proj.classification.map(c =>
    `<span class="proj-tag tag-${c}">${c}</span>`
  ).join('');

  const formats = ['wkt1', 'wkt2', 'esri', 'prj', 'proj', 'json', 'html'];
  const fmtPills = formats.map(f =>
    `<span class="fmt-pill fmt-${f === 'html' ? 'html' : f}">${f.toUpperCase()}</span>`
  ).join('');

  const epsgStr = proj.epsg ? `EPSG:${proj.epsg}` : 'No EPSG';

  a.innerHTML = `
    <div class="proj-card-preview" id="preview-${proj.id}">
      <svg id="svg-${proj.id}" viewBox="-200 -120 400 240" xmlns="http://www.w3.org/2000/svg">
        <!-- D3 preview rendered by JS -->
        <text x="0" y="0" text-anchor="middle" fill="rgba(99,130,255,0.3)" font-size="14" font-family="JetBrains Mono, monospace">Loading preview…</text>
      </svg>
    </div>
    <div class="proj-card-body">
      <div class="proj-card-tags">${tags}</div>
      <div class="proj-card-name">${proj.name}</div>
      <div class="proj-card-meta">
        <span>📅 ${proj.year < 0 ? Math.abs(proj.year)+' BCE' : proj.year+' CE'}</span>
        <span>🔖 ${proj.esriWKID ? 'ESRI:'+proj.esriWKID : (proj.epsg ? 'EPSG:'+proj.epsg : 'No EPSG')}</span>
      </div>
      <p class="proj-card-desc">${proj.description}</p>
    </div>
    <div class="proj-card-footer">
      <div class="proj-card-formats">${fmtPills}</div>
      <span class="proj-card-arrow">→</span>
    </div>
  `;

  // Render D3 preview after DOM insertion
  requestAnimationFrame(() => renderCardPreview(proj, a.querySelector(`#svg-${proj.id}`)));

  return a;
}

// ── D3 Card Preview ─────────────────────────────────────────────────────────
function renderCardPreview(proj, svgEl) {
  if (!svgEl) return;
  if (proj.id === 'nicolosi-globular') { drawNicolosiPreview(svgEl); return; }
  if (proj.id === 'robinson')          { drawRobinsonPreview(svgEl);  return; }
  // Try D3_MAP universal renderer
  try {
    const factory = typeof D3_MAP !== 'undefined' ? D3_MAP[proj.id] : null;
    if (factory) { drawD3CardPreview(proj, svgEl, factory); return; }
  } catch(e) {}
  drawGenericGlobePreview(svgEl);
}

function drawD3CardPreview(proj, svgEl, factory) {
  const ns = 'http://www.w3.org/2000/svg';
  const W = 400, H = 240;
  svgEl.setAttribute('viewBox', `-${W/2} -${H/2} ${W} ${H}`);
  svgEl.innerHTML = '';
  // Background
  const bg = document.createElementNS(ns,'rect');
  bg.setAttribute('x',-W/2); bg.setAttribute('y',-H/2);
  bg.setAttribute('width',W); bg.setAttribute('height',H);
  bg.setAttribute('fill','#060a12');
  svgEl.appendChild(bg);
  // D3 mini-map
  const miniSvg = d3.select(svgEl);
  const g = miniSvg.append('g').attr('transform','translate(0,0)');
  let projection;
  try { projection = factory(); } catch(e) { drawGenericGlobePreview(svgEl); return; }
  const types = proj.classification||[];
  let scale = 72;
  if (types.includes('azimuthal')||types.includes('pseudoazimuthal')) scale = 78;
  if (types.includes('conic')||types.includes('pseudoconical')) scale = 60;
  try { projection.scale(scale).translate([0,0]); } catch(e) {}
  const path = d3.geoPath().projection(projection);
  // Sphere
  try { g.append('path').datum({type:'Sphere'}).attr('d',path)
    .attr('fill','#060d1f').attr('stroke','rgba(99,130,255,0.65)').attr('stroke-width','0.8'); } catch(e) {}
  // Graticule
  const grat = d3.geoGraticule().step([30,30]);
  try { g.append('path').datum(grat()).attr('d',path)
    .attr('fill','none').attr('stroke','rgba(99,130,255,0.15)').attr('stroke-width','0.4'); } catch(e) {}
  // Label
  const lbl = document.createElementNS(ns,'text');
  lbl.setAttribute('x',0); lbl.setAttribute('y',H/2-8);
  lbl.setAttribute('text-anchor','middle'); lbl.setAttribute('fill','rgba(99,130,255,0.4)');
  lbl.setAttribute('font-size','8'); lbl.setAttribute('font-family','JetBrains Mono, monospace');
  lbl.textContent = `+proj=${proj.projAlias||proj.id}  ·  ${proj.year<0?Math.abs(proj.year)+' BCE':proj.year+' CE'}`;
  svgEl.appendChild(lbl);
}

function drawNicolosiPreview(svgEl) {
  const W = 400, H = 240, R = 100;
  const cx = 0, cy = 0;

  svgEl.setAttribute('viewBox', `-${W/2} -${H/2} ${W} ${H}`);
  svgEl.innerHTML = '';

  const ns = 'http://www.w3.org/2000/svg';

  // Background
  const bg = document.createElementNS(ns, 'rect');
  bg.setAttribute('x', -W/2); bg.setAttribute('y', -H/2);
  bg.setAttribute('width', W); bg.setAttribute('height', H);
  bg.setAttribute('fill', '#060a12');
  svgEl.appendChild(bg);

  // Helper: create element
  const el = (tag, attrs) => {
    const e = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k, v));
    return e;
  };

  // Glow filter
  const defs = document.createElementNS(ns, 'defs');
  defs.innerHTML = `
    <filter id="glow-card" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="sphere-grad" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#1e3a5f"/>
      <stop offset="100%" stop-color="#060d1f"/>
    </radialGradient>
  `;
  svgEl.appendChild(defs);

  // Draw two hemispheres side by side
  [-1, 1].forEach(side => {
    const ox = side * (R + 8);

    // Sphere fill
    svgEl.appendChild(el('circle', {
      cx: ox, cy: 0, r: R,
      fill: 'url(#sphere-grad)'
    }));

    // Graticule — meridians (circular arcs through poles)
    for (let lon = -75; lon <= 75; lon += 15) {
      const lam = (lon * Math.PI) / 180;
      // Nicolosi meridian: arc through top (0,-R), equator intersection, bottom (0,R)
      // Simplified: use circular arc approximation
      const x_eq = R * Math.sin(lam); // equator crossing
      if (Math.abs(x_eq) < R) {
        // Chord through poles and equator point — approximate as quadratic bezier
        const path = document.createElementNS(ns, 'path');
        const ctrl_x = ox + x_eq * 1.4;
        path.setAttribute('d', `M ${ox} ${-R} Q ${ctrl_x} 0 ${ox} ${R}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'rgba(99,130,255,0.2)');
        path.setAttribute('stroke-width', '0.5');
        svgEl.appendChild(path);
      }
    }

    // Graticule — parallels (circular arcs)
    for (let lat = -75; lat <= 75; lat += 15) {
      const phi = (lat * Math.PI) / 180;
      const y_c = R * Math.sin(phi);
      const x_half = R * Math.cos(phi);
      if (Math.abs(y_c) < R) {
        const path = document.createElementNS(ns, 'path');
        // Arc from left edge to right edge at this latitude
        const rx = x_half * 1.1;
        path.setAttribute('d', `M ${ox - x_half} ${y_c} Q ${ox} ${y_c * 0.85} ${ox + x_half} ${y_c}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'rgba(99,130,255,0.15)');
        path.setAttribute('stroke-width', '0.5');
        svgEl.appendChild(path);
      }
    }

    // Equator
    svgEl.appendChild(el('line', {
      x1: ox - R, y1: 0, x2: ox + R, y2: 0,
      stroke: 'rgba(99,130,255,0.4)', 'stroke-width': '0.7'
    }));

    // Central meridian
    svgEl.appendChild(el('line', {
      x1: ox, y1: -R, x2: ox, y2: R,
      stroke: 'rgba(99,130,255,0.4)', 'stroke-width': '0.7'
    }));

    // Bounding circle
    svgEl.appendChild(el('circle', {
      cx: ox, cy: 0, r: R,
      fill: 'none',
      stroke: 'rgba(99,130,255,0.7)',
      'stroke-width': '1',
      filter: 'url(#glow-card)'
    }));

    // Tissot indicatrices (simplified circles at grid intersections)
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon2 = -60; lon2 <= 60; lon2 += 30) {
        const phi = (lat * Math.PI) / 180;
        const lam = (lon2 * Math.PI) / 180;
        const tx = ox + R * Math.sin(lam) * Math.cos(phi) * 0.95;
        const ty = -R * Math.sin(phi) * 0.95;
        if (Math.sqrt((tx - ox) ** 2 + ty ** 2) < R * 0.92) {
          svgEl.appendChild(el('circle', {
            cx: tx, cy: ty, r: 5,
            fill: 'rgba(99,130,255,0.15)',
            stroke: 'rgba(99,130,255,0.6)',
            'stroke-width': '0.5'
          }));
        }
      }
    }
  });

  // Label
  const label = document.createElementNS(ns, 'text');
  label.setAttribute('x', 0);
  label.setAttribute('y', H / 2 - 8);
  label.setAttribute('text-anchor', 'middle');
  label.setAttribute('fill', 'rgba(99,130,255,0.5)');
  label.setAttribute('font-size', '9');
  label.setAttribute('font-family', 'JetBrains Mono, monospace');
  label.textContent = '+proj=nicol  ·  Nicolosi Globular  ·  ~1000 CE';
  svgEl.appendChild(label);
}

function drawGenericGlobePreview(svgEl) {
  const ns = 'http://www.w3.org/2000/svg';
  svgEl.innerHTML = `
    <rect x="-200" y="-120" width="400" height="240" fill="#060a12"/>
    <circle cx="0" cy="0" r="90" fill="#060d1f" stroke="rgba(99,130,255,0.5)" stroke-width="1"/>
    <text x="0" y="5" text-anchor="middle" fill="rgba(99,130,255,0.4)" font-size="11" font-family="JetBrains Mono, monospace">Preview</text>
  `;
}

function drawRobinsonPreview(svgEl) {
  const ns = 'http://www.w3.org/2000/svg';
  const W = 400, H = 240;
  svgEl.setAttribute('viewBox', `-${W/2} -${H/2} ${W} ${H}`);
  svgEl.innerHTML = '';

  const el = (tag, attrs) => {
    const e = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k, v));
    return e;
  };

  // Robinson lookup table
  const ROBIN = [
    [0,1.0000,0.0000],[5,0.9986,0.0620],[10,0.9954,0.1240],[15,0.9900,0.1860],
    [20,0.9822,0.2480],[25,0.9730,0.3100],[30,0.9600,0.3720],[35,0.9427,0.4340],
    [40,0.9216,0.4958],[45,0.8962,0.5571],[50,0.8679,0.6176],[55,0.8350,0.6769],
    [60,0.7986,0.7346],[65,0.7597,0.7903],[70,0.7186,0.8435],[75,0.6732,0.8936],
    [80,0.6213,0.9394],[85,0.5722,0.9761],[90,0.5322,1.0000]
  ];

  function getXY(latDeg) {
    const abslat = Math.abs(latDeg);
    const i = Math.min(17, Math.floor(abslat / 5));
    const t = (abslat - ROBIN[i][0]) / 5;
    const X = ROBIN[i][1] + t * (ROBIN[i+1 < 19 ? i+1 : 18][1] - ROBIN[i][1]);
    const Y = ROBIN[i][2] + t * (ROBIN[i+1 < 19 ? i+1 : 18][2] - ROBIN[i][2]);
    return { X, Y: latDeg < 0 ? -Y : Y };
  }

  // Scale: fit in viewbox
  const scale = 82; // tune to fit
  const project = (lonDeg, latDeg) => {
    const { X, Y } = getXY(latDeg);
    const lam = (lonDeg * Math.PI) / 180;
    return [
      0.8487 * X * lam * scale,
      -1.3523 * Y * scale
    ];
  };

  // Background
  svgEl.appendChild(el('rect', { x: -W/2, y: -H/2, width: W, height: H, fill: '#060a12' }));

  // Outline (envelope)
  const outlinePts = [];
  for (let lat = 90; lat >= -90; lat -= 2) {
    const [x,y] = project(-180, lat);
    outlinePts.push(`${x},${y}`);
  }
  for (let lat = -90; lat <= 90; lat += 2) {
    const [x,y] = project(180, lat);
    outlinePts.push(`${x},${y}`);
  }
  svgEl.appendChild(el('polygon', {
    points: outlinePts.join(' '),
    fill: '#060d1f',
    stroke: 'rgba(99,130,255,0.7)',
    'stroke-width': '1'
  }));

  // Graticule — parallels
  for (let lat = -75; lat <= 75; lat += 15) {
    const pts = [];
    for (let lon = -180; lon <= 180; lon += 5) {
      const [x,y] = project(lon, lat);
      pts.push(`${x},${y}`);
    }
    svgEl.appendChild(el('polyline', {
      points: pts.join(' '),
      fill: 'none',
      stroke: lat === 0 ? 'rgba(99,130,255,0.45)' : 'rgba(99,130,255,0.13)',
      'stroke-width': lat === 0 ? '0.8' : '0.4'
    }));
  }

  // Graticule — meridians
  for (let lon = -165; lon <= 165; lon += 15) {
    const pts = [];
    for (let lat = -90; lat <= 90; lat += 5) {
      const [x,y] = project(lon, lat);
      pts.push(`${x},${y}`);
    }
    svgEl.appendChild(el('polyline', {
      points: pts.join(' '),
      fill: 'none',
      stroke: lon === 0 ? 'rgba(99,130,255,0.45)' : 'rgba(99,130,255,0.12)',
      'stroke-width': lon === 0 ? '0.8' : '0.4'
    }));
  }

  // Label
  const lbl = document.createElementNS(ns, 'text');
  lbl.setAttribute('x', 0); lbl.setAttribute('y', H/2 - 8);
  lbl.setAttribute('text-anchor', 'middle');
  lbl.setAttribute('fill', 'rgba(99,130,255,0.5)');
  lbl.setAttribute('font-size', '9');
  lbl.setAttribute('font-family', 'JetBrains Mono, monospace');
  lbl.textContent = '+proj=robin  ·  Robinson (1963)  ·  ESRI 54030';
  svgEl.appendChild(lbl);
}

// ── Events ─────────────────────────────────────────────────
function bindEvents() {
  // Search
  heroSearch.addEventListener('input', e => {
    searchQuery = e.target.value.trim();
    renderGrid();
  });

  // Filter chips
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('chip-active'));
      chip.classList.add('chip-active');
      activeFilter = chip.dataset.filter;
      renderGrid();
    });
  });

  // Sort
  sortSelect.addEventListener('change', e => {
    sortMode = e.target.value;
    renderGrid();
  });

  // Clear search
  const clearBtn = document.getElementById('clear-search');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      heroSearch.value = '';
      searchQuery = '';
      renderGrid();
    });
  }
}
