/**
 * PRJ Clearinghouse — Detail Page Logic
 * Handles: tabs, copy buttons, downloads, D3 interactive map preview
 */

// ── State ──────────────────────────────────────────────────
let showTissot = true;
let currentView = 'double';
let worldData = null;

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initCopyButtons();
  loadMapData().then(() => {
    setView('double');
  });
});

async function loadMapData() {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    worldData = await response.json();
  } catch (e) {
    console.error('Failed to load map data', e);
  }
}

function initTabs() {
  const tabBar = document.getElementById('tab-bar');
  if (!tabBar) return;

  tabBar.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      tabBar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      const pane = document.getElementById(`tab-${tabId}`);
      if (pane) pane.classList.add('active');
    });
  });
}

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
  });
}

// ── Download Functions ─────────────────────────────────────
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadPRJ() {
  const content = `PROJCS["Nicolosi_Globular",GEOGCS["GCS_Sphere",DATUM["D_Sphere",SPHEROID["Sphere",6371000.0,0.0]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Nicolosi_Globular"],PARAMETER["Central_Meridian",0.0],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],UNIT["Meter",1.0]]`;
  downloadFile(content, 'nicolosi_globular.prj', 'text/plain');
}

function downloadWKT2() {
  const content = document.getElementById('code-wkt2-ogc').textContent;
  downloadFile(content, 'nicolosi_globular_wkt2.txt', 'text/plain');
}

function downloadJSON() {
  const content = document.getElementById('code-json').textContent;
  downloadFile(content, 'nicolosi_globular.json', 'application/json');
}

// ── Interactive Map Preview (D3.js) ────────────────────────
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
  const svg = d3.select('#main-preview');
  if (!svg.node()) return;

  svg.selectAll('*').remove();

  const width = 1000;
  const height = 560;
  
  // Create a group for the map
  const g = svg.append('g');

  // Background
  g.append('rect')
    .attr('x', -width / 2)
    .attr('y', -height / 2)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', '#060a12');

  // Define hemispheres
  let hemispheres = [];
  if (view === 'double') {
    hemispheres = [
      { lon0: -90, ox: -250, label: 'Western Hemisphere (90°W)' },
      { lon0: 90, ox: 250, label: 'Eastern Hemisphere (90°E)' }
    ];
  } else if (view === 'west') {
    hemispheres = [{ lon0: -90, ox: 0, label: 'Western Hemisphere (90°W)' }];
  } else {
    hemispheres = [{ lon0: 90, ox: 0, label: 'Eastern Hemisphere (90°E)' }];
  }

  const R = view === 'double' ? 220 : 250;

  hemispheres.forEach(h => {
    const hGroup = g.append('g').attr('transform', `translate(${h.ox}, 0)`);
    
    // Create the Nicolosi projection for this hemisphere
    const projection = d3.geoNicolosi()
      .scale(R / Math.PI) // Scale for the circle radius
      .translate([0, 0])
      .rotate([-h.lon0, 0, 0])
      .clipAngle(90); // Only show the hemisphere

    const path = d3.geoPath().projection(projection);

    // Sphere base (ocean)
    hGroup.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', R)
      .attr('fill', '#0d1f40')
      .attr('stroke', 'rgba(99,130,255,0.3)')
      .attr('stroke-width', 1);

    // Graticule
    const graticule = d3.geoGraticule().step([15, 15]);
    hGroup.append('path')
      .datum(graticule())
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(99,130,255,0.15)')
      .attr('stroke-width', 0.5);

    // Land
    if (worldData) {
      const countries = topojson.feature(worldData, worldData.objects.countries);
      hGroup.append('path')
        .datum(countries)
        .attr('d', path)
        .attr('fill', '#1a3a6a')
        .attr('stroke', 'rgba(99,130,255,0.3)')
        .attr('stroke-width', 0.5);
    }

    // Tissot Indicatrices
    if (showTissot) {
      const tissot = d3.geoGraticule().step([30, 30]);
      const indicatrices = [];
      for (let lat = -60; lat <= 60; lat += 30) {
        for (let lon = -180; lon < 180; lon += 30) {
          // Check if longitude is within the hemisphere rotated to h.lon0
          let diff = lon - h.lon0;
          while (diff <= -180) diff += 360;
          while (diff > 180) diff -= 360;
          
          if (Math.abs(diff) < 90) {
            indicatrices.push(d3.geoCircle().center([lon, lat]).radius(5)());
          }
        }
      }

      hGroup.selectAll('.tissot')
        .data(indicatrices)
        .enter().append('path')
        .attr('class', 'tissot')
        .attr('d', path)
        .attr('fill', 'rgba(52, 211, 153, 0.15)')
        .attr('stroke', 'rgba(52, 211, 153, 0.6)')
        .attr('stroke-width', 0.5);
    }

    // Boundary circle glow
    hGroup.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', R)
      .attr('fill', 'none')
      .attr('stroke', '#6382ff')
      .attr('stroke-width', 2)
      .attr('style', 'filter: drop-shadow(0 0 8px rgba(99, 130, 255, 0.5))');

    // Label
    hGroup.append('text')
      .attr('y', R + 25)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(139, 156, 200, 0.8)')
      .attr('font-size', view === 'double' ? '12px' : '14px')
      .text(h.label);
  });

  // Global Title
  g.append('text')
    .attr('y', -height / 2 + 25)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgba(99,130,255,0.5)')
    .attr('font-size', '11px')
    .attr('font-family', 'JetBrains Mono, monospace')
    .text(`D3.js + d3-geo-projection: +proj=nicol +lon_0=${hemispheres[0].lon0} · R=${view === 'double' ? 220 : 250}px`);
}
