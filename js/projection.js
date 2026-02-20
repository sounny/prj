/**
 * PRJ Clearinghouse — Universal Projection Renderer
 * Reads ?id= from URL, finds projection in PROJECTIONS[], renders the full page.
 */

// ── D3 projection factory map ─────────────────────────────────────────────────
const D3_MAP = {
  // Cylindrical (D3 core)
  'equirectangular':             () => d3.geoEquirectangular(),
  'mercator':                    () => d3.geoMercator().scale(70).clipExtent([[-530,-265],[530,265]]),
  'transverse-mercator':         () => d3.geoTransverseMercator().scale(100),
  'web-mercator':                () => d3.geoMercator().scale(70).clipExtent([[-530,-265],[530,265]]),
  // Cylindrical (d3-geo-projection)
  'gall-stereographic':          () => d3.geoGall ? d3.geoGall() : d3.geoEquirectangular(),
  'miller-cylindrical':          () => d3.geoMiller ? d3.geoMiller() : d3.geoEquirectangular(),
  'lambert-cylindrical-equal-area': () => d3.geoCylindricalEqualArea ? d3.geoCylindricalEqualArea() : d3.geoEquirectangular(),
  'behrmann':                    () => d3.geoCylindricalEqualArea ? d3.geoCylindricalEqualArea().parallel(30) : d3.geoEquirectangular(),
  'hobo-dyer':                   () => d3.geoCylindricalEqualArea ? d3.geoCylindricalEqualArea().parallel(37.5) : d3.geoEquirectangular(),
  'gall-peters':                 () => d3.geoCylindricalEqualArea ? d3.geoCylindricalEqualArea().parallel(45) : d3.geoEquirectangular(),
  'cassini':                     () => d3.geoEquirectangular(),  // no direct d3 support
  'hotine-oblique-mercator':     () => d3.geoTransverseMercator ? d3.geoTransverseMercator().rotate([-45, 0]) : d3.geoEquirectangular(),
  'roussilhe-oblique-stereographic': () => d3.geoStereographic(),
  'central-cylindrical':         () => d3.geoEquirectangular(),
  // Pseudocylindrical
  'sinusoidal':                  () => d3.geoSinusoidal ? d3.geoSinusoidal() : d3.geoMollweide(),
  'mollweide':                   () => d3.geoMollweide ? d3.geoMollweide() : d3.geoEquirectangular(),
  'sinu-mollweide':              () => d3.geoSinuMollweide ? d3.geoSinuMollweide() : d3.geoMollweide(),
  'eckert-ii':                   () => d3.geoEckert2 ? d3.geoEckert2() : d3.geoMollweide(),
  'eckert-iv':                   () => d3.geoEckert4 ? d3.geoEckert4() : d3.geoMollweide(),
  'eckert-vi':                   () => d3.geoEckert6 ? d3.geoEckert6() : d3.geoMollweide(),
  'ortelius-oval':               () => d3.geoOrtelius ? d3.geoOrtelius() : d3.geoMollweide(),
  'goode-homolosine':            () => d3.geoHomolosine ? d3.geoHomolosine() : d3.geoMollweide(),
  'kavrayskiy-vii':              () => d3.geoKavrayskiy7 ? d3.geoKavrayskiy7() : d3.geoMollweide(),
  'robinson':                    () => d3.geoRobinson(),
  'equal-earth':                 () => d3.geoEqualEarth ? d3.geoEqualEarth() : d3.geoNaturalEarth1(),
  'natural-earth':               () => d3.geoNaturalEarth1 ? d3.geoNaturalEarth1() : d3.geoMollweide(),
  'tobler-hyperelliptical':      () => d3.geoHyperelliptical ? d3.geoHyperelliptical() : d3.geoMollweide(),
  'wagner-vi':                   () => d3.geoWagner6 ? d3.geoWagner6() : d3.geoMollweide(),
  'collignon':                   () => d3.geoCollignon ? d3.geoCollignon() : d3.geoMollweide(),
  'healpix':                     () => d3.geoHealpix ? d3.geoHealpix() : d3.geoMollweide(),
  'boggs-eumorphic':             () => d3.geoBoggs ? d3.geoBoggs() : d3.geoMollweide(),
  'craster-parabolic':           () => d3.geoCraster ? d3.geoCraster() : d3.geoMollweide(),
  'mcbryde-thomas-4':            () => d3.geoMtFlatPoleQuartic ? d3.geoMtFlatPoleQuartic() : d3.geoMollweide(),
  'quartic-authalic':            () => d3.geoQuarticAuthalic ? d3.geoQuarticAuthalic() : d3.geoMollweide(),
  'the-times':                   () => d3.geoTimes ? d3.geoTimes() : d3.geoMollweide(),
  'loximuthal':                  () => d3.geoLoximuthal ? d3.geoLoximuthal() : d3.geoMollweide(),
  'atlantis':                    () => d3.geoMollweide ? d3.geoMollweide().rotate([0,-90]) : d3.geoEquirectangular(),
  // Pseudoazimuthal
  'aitoff':                      () => d3.geoAitoff ? d3.geoAitoff() : d3.geoMollweide(),
  'hammer':                      () => d3.geoHammer ? d3.geoHammer() : d3.geoMollweide(),
  'strebe-1995':                  () => d3.geoMollweide ? d3.geoMollweide() : d3.geoEquirectangular(),
  'winkel-tripel':               () => d3.geoWinkel3 ? d3.geoWinkel3() : d3.geoMollweide(),
  'wagner-vii':                  () => d3.geoWagner7 ? d3.geoWagner7() : d3.geoMollweide(),
  'wiechel':                     () => d3.geoWiechel ? d3.geoWiechel() : d3.geoAzimuthalEquidistant(),
  // Pseudoconic
  'van-der-grinten':             () => d3.geoVanDerGrinten ? d3.geoVanDerGrinten() : d3.geoMollweide(),
  // Conic (D3 core)
  'equidistant-conic':           () => d3.geoConicEquidistant(),
  'lambert-conformal-conic':     () => d3.geoConicConformal(),
  'albers':                      () => d3.geoAlbers().parallels([20, 50]).rotate([0, 0]),
  // Pseudoconical
  'werner':                      () => d3.geoWerner ? d3.geoWerner() : (d3.geoBonne ? d3.geoBonne().parallel(90) : d3.geoEquirectangular()),
  'bonne':                       () => d3.geoBonne ? d3.geoBonne() : d3.geoConicEquidistant(),
  'bottomley':                   () => d3.geoBottomley ? d3.geoBottomley() : d3.geoConicEquidistant(),
  'american-polyconic':          () => d3.geoPolyconic ? d3.geoPolyconic() : d3.geoEquirectangular(),
  'rectangular-polyconic':       () => d3.geoRectangularPolyconic ? d3.geoRectangularPolyconic() : d3.geoEquirectangular(),
  'latitudinally-polyconic':     () => d3.geoEquirectangular(),
  'nicolosi-globular':           () => d3.geoNicolosi ? d3.geoNicolosi() : d3.geoAzimuthalEquidistant(),
  // Azimuthal (D3 core)
  'azimuthal-equidistant':       () => d3.geoAzimuthalEquidistant(),
  'gnomonic':                    () => d3.geoGnomonic().clipAngle(70),
  'lambert-azimuthal-equal-area':() => d3.geoAzimuthalEqualArea(),
  'stereographic':               () => d3.geoStereographic(),
  'orthographic':                () => d3.geoOrthographic().rotate([-20, -30]).clipAngle(90),
  'vertical-perspective':        () => d3.geoSatellite ? d3.geoSatellite().distance(1.1).tilt(30) : d3.geoOrthographic(),
  'two-point-equidistant':       () => d3.geoTwoPointEquidistant ? d3.geoTwoPointEquidistant([-100, 40], [10, 50]) : d3.geoAzimuthalEquidistant(),
  'gott-goldberg-vanderbei':     () => d3.geoAzimuthalEquidistant(),
  // Other / Polyhedral
  'peirce-quincuncial':          () => d3.geoPeirceQuincuncial ? d3.geoPeirceQuincuncial() : d3.geoStereographic(),
  'guyou-hemisphere':            () => d3.geoGuyou ? d3.geoGuyou() : d3.geoStereographic(),
  'adams-hemisphere':            () => d3.geoAirocean ? d3.geoAirocean() : d3.geoStereographic(),
  'lee-conformal-tetrahedron':   () => d3.geoStereographic(),
  'octant':                      () => d3.geoAzimuthalEqualArea(),
  'cahill-butterfly':            () => d3.geoAzimuthalEqualArea(),
  'cahill-keyes':                () => d3.geoAzimuthalEqualArea(),
  'waterman-butterfly':          () => d3.geoAzimuthalEqualArea(),
  'spherical-cube':              () => d3.geoAzimuthalEqualArea(),
  'dymaxion':                    () => d3.geoAirocean ? d3.geoAirocean() : d3.geoAzimuthalEqualArea(),
  'authagraph':                  () => d3.geoAzimuthalEqualArea(),
  'myriahedral':                 () => d3.geoAzimuthalEqualArea(),
  // Retroazimuthal
  'craig-retroazimuthal':        () => d3.geoCraig ? d3.geoCraig() : d3.geoEquirectangular(),
  'hammer-retroazimuthal':       () => d3.geoHammerRetroazimuthal ? d3.geoHammerRetroazimuthal() : d3.geoEquirectangular(),
  'littrow':                     () => d3.geoLittrow ? d3.geoLittrow() : d3.geoEquirectangular(),
  // Other
  'armadillo':                   () => d3.geoArmadillo ? d3.geoArmadillo() : d3.geoEquirectangular(),
  'gs50':                        () => d3.geoEquirectangular(),
  'chamberlin-trimetric':        () => d3.geoChamberlin ? d3.geoChamberlin([-150, 55], [0, 55], [75, 55]) : d3.geoAzimuthalEqualArea(),
  'bertin':                      () => d3.geoBertin1953 ? d3.geoBertin1953() : d3.geoMollweide(),
  'hao':                         () => d3.geoEquirectangular(),
};

// ── WKT/PRJ builder ───────────────────────────────────────────────────────────
function buildGeogCS(p) {
  if (p.datum === 'sphere') {
    return 'GEOGCS["GCS_Sphere",DATUM["D_Sphere",SPHEROID["Sphere",6371000.0,0.0]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]';
  }
  return 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]';
}

function buildBaseGeogCRS(p) {
  if (p.datum === 'sphere') {
    return `BASEGEOGCRS["GCS Sphere",DATUM["Sphere",ELLIPSOID["Sphere",6371000,0,LENGTHUNIT["metre",1]]],PRIMEM["Greenwich",0,ANGLEUNIT["degree",0.0174532925199433]],ID["EPSG",4047]]`;
  }
  return `BASEGEOGCRS["WGS 84",DATUM["World Geodetic System 1984",ELLIPSOID["WGS 84",6378137,298.257223563,LENGTHUNIT["metre",1]]],PRIMEM["Greenwich",0,ANGLEUNIT["degree",0.0174532925199433]],ID["EPSG",4326]]`;
}

function buildParamsWKT1(p) {
  return (p.esriParams || defaultParams()).map(x => `PARAMETER["${x.name}",${x.value}]`).join(',');
}

function buildParamsWKT2(p) {
  const map = {
    'Central_Meridian':    { name: 'Longitude of natural origin', id: 8802, unit: 'degree' },
    'False_Easting':       { name: 'False easting', id: 8806, unit: 'metre' },
    'False_Northing':      { name: 'False northing', id: 8807, unit: 'metre' },
    'Scale_Factor':        { name: 'Scale factor at natural origin', id: 8805, unit: 'unity' },
    'Standard_Parallel_1':{ name: 'Latitude of 1st standard parallel', id: 8823, unit: 'degree' },
    'Standard_Parallel_2':{ name: 'Latitude of 2nd standard parallel', id: 8824, unit: 'degree' },
    'Latitude_Of_Origin':  { name: 'Latitude of natural origin', id: 8801, unit: 'degree' },
    'Latitude_Of_Center':  { name: 'Latitude of projection centre', id: 8811, unit: 'degree' },
  };
  return (p.esriParams || defaultParams()).map(x => {
    const m = map[x.name] || { name: x.name.replace(/_/g,' '), id: null, unit: 'degree' };
    const unitStr = m.unit === 'metre'
      ? 'LENGTHUNIT["metre",1]'
      : m.unit === 'unity'
      ? 'SCALEUNIT["unity",1]'
      : 'ANGLEUNIT["degree",0.0174532925199433]';
    const idStr = m.id ? `,ID["EPSG",${m.id}]` : '';
    return `PARAMETER["${m.name}",${x.value},${unitStr}${idStr}]`;
  }).join(',');
}

function defaultParams() {
  return [
    { name: 'Central_Meridian', value: 0 },
    { name: 'False_Easting',    value: 0 },
    { name: 'False_Northing',   value: 0 },
  ];
}

function buildProjStr(p) {
  if (p.projString) return p.projString;
  if (!p.projAlias)  return null;
  const ps = (p.esriParams || defaultParams()).map(x => {
    const k = { Central_Meridian: 'lon_0', False_Easting: 'x_0', False_Northing: 'y_0',
                 Scale_Factor: 'k', Standard_Parallel_1: 'lat_1', Standard_Parallel_2: 'lat_2',
                 Latitude_Of_Origin: 'lat_0', Latitude_Of_Center: 'lat_0' }[x.name] || x.name.toLowerCase();
    return `+${k}=${x.value}`;
  }).join(' ');
  const R = p.datum === 'sphere' ? '+R=6371000' : '+datum=WGS84';
  return `+proj=${p.projAlias} ${ps} ${R} +units=m +no_defs`;
}

function buildWKT1(p) {
  const pn  = p.esriProjName || p.name.replace(/ /g,'_');
  const geo = buildGeogCS(p);
  const par = buildParamsWKT1(p);
  return `PROJCS["${pn}",${geo},PROJECTION["${pn}"],${par},UNIT["Meter",1.0]]`;
}

function buildWKT1Pretty(p) {
  const pn  = p.esriProjName || p.name.replace(/ /g,'_');
  const par = (p.esriParams || defaultParams()).map(x => `  PARAMETER["${x.name}", ${x.value}]`).join(',\n');
  if (p.datum === 'sphere') {
    return `PROJCS["${pn}",\n  GEOGCS["GCS_Sphere",\n    DATUM["D_Sphere",\n      SPHEROID["Sphere", 6371000.0, 0.0]\n    ],\n    PRIMEM["Greenwich", 0.0],\n    UNIT["Degree", 0.0174532925199433]\n  ],\n  PROJECTION["${pn}"],\n${par},\n  UNIT["Meter", 1.0]\n]`;
  }
  return `PROJCS["${pn}",\n  GEOGCS["GCS_WGS_1984",\n    DATUM["D_WGS_1984",\n      SPHEROID["WGS_1984", 6378137.0, 298.257223563]\n    ],\n    PRIMEM["Greenwich", 0.0],\n    UNIT["Degree", 0.0174532925199433]\n  ],\n  PROJECTION["${pn}"],\n${par},\n  UNIT["Meter", 1.0]\n]`;
}

function buildWKT2(p) {
  const pn  = p.esriProjName || p.name.replace(/ /g,'_');
  const base = buildBaseGeogCRS(p);
  const par  = buildParamsWKT2(p);
  return `PROJCRS["${p.name}",${base},CONVERSION["${p.name}",METHOD["${p.name}",ID["PROJ","${p.projAlias||'custom'}}"]],${par}],CS[Cartesian,2],AXIS["(E)",east,ORDER[1],LENGTHUNIT["metre",1]],AXIS["(N)",north,ORDER[2],LENGTHUNIT["metre",1]]]`;
}

function buildWKT2Pretty(p) {
  const pn   = p.esriProjName || p.name;
  const base = buildBaseGeogCRS(p);
  const par  = (p.esriParams || defaultParams()).map(x => {
    const map2 = {
      'Central_Meridian': 'Longitude of natural origin',
      'False_Easting': 'False easting', 'False_Northing': 'False northing',
      'Scale_Factor': 'Scale factor at natural origin',
      'Standard_Parallel_1': 'Latitude of 1st standard parallel',
      'Standard_Parallel_2': 'Latitude of 2nd standard parallel',
      'Latitude_Of_Origin': 'Latitude of natural origin',
    };
    const unitStr = (x.name.includes('Easting') || x.name.includes('Northing'))
      ? 'LENGTHUNIT["metre",1]' : 'ANGLEUNIT["degree",0.0174532925199433]';
    return `    PARAMETER["${map2[x.name]||x.name}", ${x.value},\n      ${unitStr}]`;
  }).join(',\n');
  return `PROJCRS["${p.name}",\n  ${base},\n  CONVERSION["${pn}",\n    METHOD["${pn}",\n      ID["PROJ","${p.projAlias||'custom'}"]],\n${par}\n  ],\n  CS[Cartesian, 2],\n    AXIS["(E)", east, ORDER[1], LENGTHUNIT["metre", 1]],\n    AXIS["(N)", north, ORDER[2], LENGTHUNIT["metre", 1]]\n]`;
}

function buildJSON(p) {
  const datumObj = p.datum === 'sphere'
    ? { name:'Sphere', ellipsoid:{ name:'Sphere', semiMajorAxis:6371000, inverseFlattening:0 } }
    : { name:'World Geodetic System 1984', ellipsoid:{ name:'WGS 84', semiMajorAxis:6378137, inverseFlattening:298.257223563 } };
  const params = (p.esriParams || defaultParams()).map(x => ({
    name: x.name.replace(/_/g,' '), value: x.value,
    unit: (x.name.includes('Easting')||x.name.includes('Northing')) ? 'metre' : 'degree'
  }));
  return JSON.stringify({
    type: 'ProjectedCRS', name: p.name,
    id: p.esriWKID ? { authority:'ESRI', code: p.esriWKID }
       : p.epsg    ? { authority:'EPSG', code: p.epsg }
       : { authority:'PROJ', code: p.projAlias||'custom' },
    baseGeographicCRS: { type:'GeographicCRS', datum: datumObj,
      primeMeridian:{ name:'Greenwich', longitude:0 } },
    conversion: { name: p.name, method:{ name:p.name, projAlias: p.projAlias||null }, parameters: params },
    projString: buildProjStr(p),
    metadata: {
      inventor: p.inventor, yearInvented: p.year,
      esriWKID: p.esriWKID||null, epsg: p.epsg||null,
      classification: p.classification,
      conformal: !!p.properties.conformal, equalArea: !!p.properties.equalArea,
      equidistant: !!p.properties.equidistant,
      projUrl: p.projUrl||null, wikiUrl: p.wikiUrl||null
    }
  }, null, 2);
}

// ── Tab building ──────────────────────────────────────────────────────────────
function addTab(id, label, contentHTML, isFirst) {
  const bar  = document.getElementById('tab-bar');
  const cont = document.getElementById('tab-content');
  const btn  = document.createElement('button');
  btn.className = 'tab-btn' + (isFirst ? ' active' : '');
  btn.dataset.tab = id;
  btn.setAttribute('role','tab');
  btn.innerHTML = label;
  bar.appendChild(btn);
  const pane = document.createElement('div');
  pane.className = 'tab-pane' + (isFirst ? ' active' : '');
  pane.id = 'tab-' + id;
  pane.innerHTML = contentHTML;
  cont.appendChild(pane);
}

function codePane(content, btnId) {
  return `<div class="code-block-wrap"><button class="copy-btn" onclick="copyCode('${btnId}')">Copy</button><pre class="code-block" id="${btnId}">${escHtml(content)}</pre></div>`;
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function compatBanner(p) {
  const pn = p.esriProjName || p.name;
  if (p.esriWKID) {
    return `<div class="compat-success"><span class="compat-icon">✅</span><div>
      <strong>ArcGIS Pro &amp; ArcMap — Fully Supported</strong> — ${p.name} is registered in the ESRI Projection Engine as 
      <strong>WKID ${p.esriWKID}</strong> (<code>${pn}</code>). This .prj file will apply correctly in all major GIS applications.
      In ArcGIS Pro, search for <em>"${p.name}"</em> or enter WKID <em>${p.esriWKID}</em>.
    </div></div>`;
  }
  if (p.projAlias) {
    return `<div class="compat-warning"><span class="compat-icon">⚠️</span><div>
      <strong>ArcGIS Pro / ArcMap — Limited Support</strong> — <code>${pn}</code> is not registered in the ESRI Projection Engine. 
      ArcGIS will not correctly apply this .prj file. Use the PROJ string in QGIS or GDAL instead:<br/>
      <code>${buildProjStr(p) || 'No PROJ support'}</code>
    </div></div>`;
  }
  return `<div class="compat-none"><span class="compat-icon">🔴</span><div>
    <strong>No Standard Software Support</strong> — This projection lacks a standard PROJ implementation and is not in the ESRI PE. 
    It is primarily of historical or academic interest.
  </div></div>`;
}

function buildTabs(p) {
  const wkt1 = buildWKT1Pretty(p);
  const wkt1m = buildWKT1(p);
  const wkt2 = buildWKT2Pretty(p);
  const wkt2m = buildWKT2(p);
  const proj = buildProjStr(p);
  const json = buildJSON(p);
  const compat = compatBanner(p);
  const esriOk = p.esriWKID
    ? `<div class="compat-success"><span class="compat-icon">✅</span><div>Fully supported in ESRI PE as WKID ${p.esriWKID}.</div></div>`
    : `<div class="compat-warning"><span class="compat-icon">⚠️</span><div>Not in ESRI PE database. Will not apply correctly in ArcGIS.</div></div>`;

  const hrTable = (rows) => `<table class="hr-table">${rows.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>`;
  const wkt1HR = hrTable([
    ['Projection Name', p.esriProjName || p.name],
    ['Datum', p.datum === 'sphere' ? 'D_Sphere (R = 6,371,000 m)' : 'D_WGS_1984'],
    ['Projection Method', p.name],
    ...(p.esriParams||defaultParams()).map(x => [x.name.replace(/_/g,' '), x.value + (x.name.includes('Meridian')||x.name.includes('Parallel')||x.name.includes('Latitude') ? '°' : x.name.includes('ing') ? ' m' : '')]),
    ['Linear Unit', 'Meter (1.0)'],
  ]);

  let tabs = [
    ['wkt1-html', 'WKT-1 (Readable)', `<div class="human-readable-block"><p class="tab-desc">OGC WKT version 1 (ISO 19125). Used by GDAL, QGIS, and most open-source GIS tools.</p>${wkt1HR}</div>${codePane(wkt1,'code-wkt1-html')}`, true],
    ['wkt1-ogc',  'OGC WKT-1',       `<div class="human-readable-block"><p class="tab-desc">Machine-readable single-line OGC WKT-1.</p></div>${codePane(wkt1m,'code-wkt1-ogc')}`, false],
    ['wkt2-html', 'WKT-2 (Readable)', `<div class="human-readable-block"><p class="tab-desc">ISO 19162:2019 WKT-2, formatted for readability.</p></div>${codePane(wkt2,'code-wkt2-html')}`, false],
    ['wkt2-ogc',  'OGC WKT-2',       `<div class="human-readable-block"><p class="tab-desc">Machine-readable ISO 19162:2019 WKT-2.</p></div>${codePane(wkt2m,'code-wkt2-ogc')}`, false],
    ['esri-wkt',  p.esriWKID?'ESRI WKT ✅':'ESRI WKT', `${esriOk}<div class="human-readable-block"></div>${codePane(wkt1m,'code-esri-wkt')}`, false],
    ['prj',       p.esriWKID?'.PRJ ✅':'.PRJ', `${compat}<div class="human-readable-block"><p class="tab-desc">Shapefile projection file (.prj). ${p.esriWKID?'Compatible with all major GIS software including ArcGIS Pro.':'Use QGIS or GDAL for correct application.'}</p></div>${codePane(wkt1m,'code-prj')}<div style="padding:12px 20px;border-top:1px solid var(--clr-border)"><button class="btn btn-primary" onclick="downloadPRJ()">⬇ Download ${(p.id||'projection')}.prj</button></div>`, false],
  ];

  if (proj) {
    tabs.push(['proj', 'PROJ String', `<div class="human-readable-block"><p class="tab-desc">PROJ string — use with GDAL, QGIS, pyproj, R (sf). Supported via <code>+proj=${p.projAlias}</code>.</p></div>${codePane(proj,'code-proj')}`, false]);
  }
  tabs.push(['json', 'JSON', `<div class="human-readable-block"><p class="tab-desc">Structured JSON CRS definition for web APIs and data pipelines.</p></div>${codePane(json,'code-json')}`, false]);

  tabs.forEach(([id, lbl, html, first]) => addTab(id, lbl, html, first));

  // Tab click binding
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });
}

// ── Info Grid ─────────────────────────────────────────────────────────────────
function buildInfoGrid(p) {
  const g = document.getElementById('info-grid');
  const cards = [
    ['EPSG Code',     p.epsg ? `EPSG:${p.epsg}` : 'None — not registered'],
    ['ESRI WKID',     p.esriWKID ? `<span style="color:#34d399;font-weight:600">${p.esriWKID}</span>` : '<span style="color:var(--clr-accent-warn)">None</span>'],
    ['PROJ Alias',    p.projAlias ? `<span class="mono">+proj=${p.projAlias}</span>` : 'Not in PROJ'],
    ['Year',          p.year < 0 ? `${Math.abs(p.year)} BCE` : `${p.year} CE`],
    ['Inventor',      p.inventor || 'Unknown'],
    ['Classification',p.classification.join(' · ')],
    ['Domain',        p.domain || 'World'],
    ['Properties',    Object.entries(p.properties||{}).filter(([k,v])=>v).map(([k])=>k.charAt(0).toUpperCase()+k.slice(1)).join(' · ') || 'Compromise'],
  ];
  g.innerHTML = cards.map(([k,v]) => `<div class="info-card"><div class="info-card-label">${k}</div><div class="info-card-value">${v}</div></div>`).join('');
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function buildSidebar(p) {
  // Downloads
  const dl = document.getElementById('download-list');
  dl.innerHTML = `
    <div class="download-item"><div><div class="download-item-name">${p.id||'projection'}.prj</div><div class="download-item-size">Shapefile Projection File</div></div><button class="download-btn" onclick="downloadPRJ()">⬇</button></div>
    <div class="download-item"><div><div class="download-item-name">${p.id||'projection'}_wkt2.txt</div><div class="download-item-size">ISO 19162:2019 WKT-2</div></div><button class="download-btn" onclick="downloadWKT2()">⬇</button></div>
    <div class="download-item"><div><div class="download-item-name">${p.id||'projection'}.json</div><div class="download-item-size">JSON CRS Definition</div></div><button class="download-btn" onclick="downloadJSON()">⬇</button></div>`;

  // Key params
  const kp = document.getElementById('key-params');
  const rows = [
    ['ESRI WKID', p.esriWKID ? `<span style="color:#34d399;font-weight:600">${p.esriWKID}</span>` : '<span style="opacity:.5">None</span>'],
    ['EPSG Code',  p.epsg || '<span style="opacity:.5">None</span>'],
    ['PROJ Alias', p.projAlias ? `<span style="font-family:var(--font-mono)">${p.projAlias}</span>` : '<span style="opacity:.5">None</span>'],
    ['Datum',      p.datum === 'sphere' ? 'Sphere (R = 6,371 km)' : 'WGS 84'],
    ['Conformal',  p.properties?.conformal ? 'Yes' : 'No'],
    ['Equal-Area', p.properties?.equalArea ? 'Yes' : 'No'],
    ['Equidistant',p.properties?.equidistant ? 'Yes' : 'No'],
    ['Compromise', p.properties?.compromise ? 'Yes' : 'No'],
  ];
  kp.innerHTML = rows.map(([k,v]) => `<div class="sidebar-dl-item"><span class="sidebar-dl-label">${k}</span><span class="sidebar-dl-value">${v}</span></div>`).join('');

  // Refs
  if (p.references?.length) {
    document.getElementById('refs-card').style.display = '';
    document.getElementById('refs-list').innerHTML = p.references.map(r =>
      `<li>${r.url ? `<a href="${r.url}" target="_blank" rel="noopener">${r.text} →</a>` : r.text}</li>`
    ).join('');
  } else {
    const refs = [];
    if (p.wikiUrl) refs.push(`<li><a href="${p.wikiUrl}" target="_blank" rel="noopener">Wikipedia: ${p.name} projection →</a></li>`);
    if (p.projUrl) refs.push(`<li><a href="${p.projUrl}" target="_blank" rel="noopener">PROJ Documentation →</a></li>`);
    document.getElementById('refs-list').innerHTML = refs.join('');
  }

  // See also
  if (p.seeAlso?.length) {
    document.getElementById('see-also-card').style.display = '';
    document.getElementById('see-also-list').innerHTML = p.seeAlso.map(s => `<li>${s}</li>`).join('');
  } else {
    document.getElementById('see-also-card').style.display = 'none';
  }
}

// ── Prose sections ────────────────────────────────────────────────────────────
function buildProse(p) {
  const el = document.getElementById('prose-sections');
  let html = '';
  if (p.history) {
    html += `<div class="prose-section"><h2>History</h2><p>${p.history.replace(/\n\n/g,'</p><p>')}</p></div>`;
  }
  if (p.construction) {
    html += `<div class="prose-section"><h2>Description &amp; Construction</h2><p>${p.construction.replace(/\n\n/g,'</p><p>')}</p></div>`;
  }
  if (p.math?.length) {
    html += `<div class="prose-section"><h2>Mathematical Formulae</h2><div class="math-block">${p.math.map(m=>`<span class="math-var">${m.label}</span> <span class="math-op">=</span> <span class="math-num">${m.formula}</span>`).join('\n')}</div></div>`;
  }
  el.innerHTML = html;
}

// ── D3 Preview ────────────────────────────────────────────────────────────────
let worldData = null;
let showTissot = true;
let currentProj = null;
const SVG_W = 1120, SVG_H = 600;

function renderPreview(p) {
  currentProj = p;
  const svg = d3.select('#main-preview');
  svg.selectAll('*').remove();

  const factory = D3_MAP[p.id];
  if (!factory) { showNoPreview(p.id); return; }

  let projection;
  try { projection = factory(); }
  catch(e) { showNoPreview(p.id); return; }

  projection.translate([0, 0]);
  // Scale heuristics by type
  const types = p.classification || [];
  let scale = 170;
  if (types.includes('azimuthal') || types.includes('pseudoazimuthal')) scale = 180;
  if (types.includes('conic') || types.includes('pseudoconic') || types.includes('pseudoconical')) scale = 140;
  try { projection.scale(scale); } catch(e) {}

  const path = d3.geoPath().projection(projection);
  const g = svg.append('g'); // Already centered due to viewBox="-560 -300 1120 600"

  // Sphere fill
  try {
    g.append('path').datum({type:'Sphere'}).attr('d',path)
      .attr('fill','#0d1117').attr('stroke','rgba(99,130,255,0.7)').attr('stroke-width',0.8);
  } catch(e) {}

  // Graticule
  const step = types.includes('azimuthal') ? 15 : 15;
  const grat = d3.geoGraticule().step([step,step]);
  try {
    g.append('path').datum(grat()).attr('d',path)
      .attr('fill','none').attr('stroke','rgba(99,130,255,0.18)').attr('stroke-width',0.5);
  } catch(e) {}

  // Countries
  if (worldData) {
    try {
      g.append('path').datum(topojson.feature(worldData, worldData.objects.countries)).attr('d',path)
        .attr('fill','rgba(99,130,255,0.22)').attr('stroke','rgba(99,130,255,0.5)').attr('stroke-width',0.4);
    } catch(e) {}
  }

  // Tissot
  if (showTissot) {
    const r = 5;
    for (let lat=-60; lat<=60; lat+=30) {
      for (let lon=-150; lon<=150; lon+=30) {
        const circle = d3.geoCircle().center([lon,lat]).radius(r)();
        const col = Math.abs(lat)>45?'rgba(251,191,36,0.5)':Math.abs(lat)>15?'rgba(99,211,153,0.5)':'rgba(99,130,255,0.5)';
        try {
          g.append('path').datum(circle).attr('d',path)
            .attr('fill',col).attr('stroke','rgba(255,255,255,0.3)').attr('stroke-width',0.4);
        } catch(e) {}
      }
    }
  }

  // Label
  g.append('text').attr('y',-SVG_H/2+22).attr('text-anchor','middle')
    .attr('fill','rgba(99,130,255,0.45)').attr('font-size','11px')
    .attr('font-family','JetBrains Mono, monospace')
    .text(`D3.js +proj=${p.projAlias||p.id} · ${p.esriWKID?'ESRI '+p.esriWKID:p.epsg?'EPSG '+p.epsg:'No standard CRS'}`);
}

function showNoPreview(id) {
  const svg = document.getElementById('main-preview');
  svg.innerHTML = `<foreignObject x="-560" y="-300" width="1120" height="600">
    <div xmlns="http://www.w3.org/1999/xhtml" class="preview-no-support">
      <div class="no-support-icon">🗺</div>
      <p>Interactive preview is not available for this projection — it requires polyhedral or specialized rendering not supported by D3.js.</p>
    </div>
  </foreignObject>`;
}

function toggleTissot() {
  showTissot = !showTissot;
  document.getElementById('btn-tissot').classList.toggle('active', showTissot);
  if (currentProj) renderPreview(currentProj);
}

function setView(v) {
  if (currentProj) renderPreview(currentProj);
}

// ── Download helpers ──────────────────────────────────────────────────────────
let _proj = null;
function downloadPRJ() {
  download(buildWKT1(_proj), (_proj.id||'projection')+'.prj', 'text/plain');
}
function downloadWKT2() {
  download(buildWKT2Pretty(_proj), (_proj.id||'projection')+'_wkt2.txt', 'text/plain');
}
function downloadJSON() {
  download(buildJSON(_proj), (_proj.id||'projection')+'.json', 'application/json');
}
function download(content, filename, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content],{type}));
  a.download = filename; a.click();
  URL.revokeObjectURL(a.href);
}
function copyCode(id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    const btn = document.querySelector(`[onclick="copyCode('${id}')"]`);
    if (btn) { btn.textContent='Copied!'; setTimeout(()=>btn.textContent='Copy',2000); }
  });
}

// ── Main init ─────────────────────────────────────────────────────────────────
function initPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id || typeof PROJECTIONS === 'undefined') {
    document.getElementById('proj-title').textContent = '404 — Projection not found';
    return;
  }

  const p = PROJECTIONS.find(x => x.id === id);
  if (!p) {
    document.getElementById('proj-title').textContent = `No projection found for id="${id}"`;
    return;
  }

  _proj = p;

  // Meta
  document.getElementById('page-title').textContent = `${p.name} — SOUNNY PRJ`;
  document.getElementById('page-desc').content = `GIS reference for the ${p.name} projection: WKT, PROJ string, .prj download, and D3 interactive map preview.`;
  document.getElementById('proj-title').innerHTML = `${p.name}${p.esriWKID ? `<span class="esri-badge">✅ ESRI ${p.esriWKID}</span>` : ''}`;
  document.getElementById('proj-subtitle').innerHTML = `${p.classification.join(' · ')} · ${p.year < 0 ? Math.abs(p.year)+' BCE' : p.year+' CE'} · PROJ alias: <code>${p.projAlias||'None'}</code>`;
  document.getElementById('proj-name-crumb').textContent = p.name;
  document.getElementById('proj-type-crumb').textContent = p.classification[0]?.charAt(0).toUpperCase()+p.classification[0]?.slice(1)||'Other';

  // Tags
  document.getElementById('proj-tags').innerHTML = p.classification.map(c =>
    `<span class="proj-tag tag-${c}">${c.charAt(0).toUpperCase()+c.slice(1)}</span>`
  ).join('');

  // Actions
  const projDocUrl = p.projUrl || (p.projAlias ? `https://proj.org/en/stable/operations/projections/${p.projAlias}.html` : null);
  let acts = `<button class="btn btn-primary" onclick="downloadPRJ()">⬇ Download .prj</button>`;
  if (projDocUrl) acts += `<a href="${projDocUrl}" class="btn btn-secondary" target="_blank" rel="noopener">PROJ Docs ↗</a>`;
  if (p.wikiUrl)  acts += `<a href="${p.wikiUrl}" class="btn btn-secondary" target="_blank" rel="noopener">Wikipedia ↗</a>`;
  document.getElementById('proj-actions').innerHTML = acts;

  // Preview caption
  document.getElementById('preview-caption').textContent =
    `${p.name} · ${p.datum==='sphere'?'Spherical Earth (R = 6,371 km)':'WGS84 Ellipsoid'} · 15° graticule`;

  // Build all sections
  buildInfoGrid(p);
  buildTabs(p);
  buildProse(p);
  buildSidebar(p);

  // Set initial UI state for Tissot button
  document.getElementById('btn-tissot').classList.toggle('active', showTissot);

  // Load world atlas and render
  if (typeof topojson !== 'undefined') {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(data => { worldData = data; renderPreview(p); })
      .catch(() => renderPreview(p));
  } else {
    renderPreview(p);
  }
}

document.addEventListener('DOMContentLoaded', initPage);
