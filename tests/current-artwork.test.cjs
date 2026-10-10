const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const G = require('../assets/js/badge-dimensions-geometry.js');
const spec = JSON.parse(fs.readFileSync('specs/approved/house-v012.json', 'utf8'));
const load = () => require('../assets/js/badge-artwork.js');

test('selected artwork has six surfaces from five preserved designs', () => {
  const A = load();
  assert.deepEqual(Object.keys(A.sources), ['1', '3', '6', '9', '12L', '12R']);
  assert.match(A.sources['1'].src, /v07-small-grounded/);
  assert.match(A.sources['3'].src, /badge-3-mascot-v01/);
  assert.match(A.sources['6'].src, /v04-small-window-only/);
  assert.match(A.sources['9'].src, /v03-complete-loop-clean-rim/);
  assert.equal(A.sources['12L'].src, A.sources['12R'].src);
  assert.match(A.sources['12L'].src, /v03-small-overhead-reclining/);
  for (const source of Object.values(A.sources)) assert.ok(fs.existsSync(source.src));
});

test('mascot body scale uses millimeters rather than equal canvas percentages', () => {
  const A = load();
  const scale = JSON.parse(fs.readFileSync('designs/house-series/2026-10-08-mascot-scale/scale-review.json', 'utf8'));
  for (const sample of scale.samples) {
    const badge = spec.badges.find(b => b.id === (sample.surface.startsWith('12') ? '12' : sample.surface));
    const width = sample.surface.startsWith('12') ? badge.panel : badge.width;
    const mm = sample.houseWidthPixels * A.fit(A.sources[sample.surface],width,badge.height).scale;
    assert.ok(Math.abs(mm - scale.targetWidthMm) <= scale.toleranceMm, `${sample.surface}: ${mm} mm`);
  }
});

test('reference surfaces 3 and 9 keep their previous textures byte for byte', () => {
  const A = load();
  for (const id of ['3','9']) {
    assert.deepEqual(fs.readFileSync(`${A.deliveryDir}/badge-${id}-texture.png`), fs.readFileSync(`designs/house-series/2026-10-08-mascot-selected/badge-${id}-texture.png`));
  }
});

test('interior fitting is uniform and never crops selected lettering', () => {
  const A = load();
  for (const id of Object.keys(A.sources)) {
    const badge = spec.badges.find(b => b.id === (id.startsWith('12') ? '12' : id));
    const width = id.startsWith('12') ? badge.panel : badge.width;
    const f = A.fit(A.sources[id], width, badge.height);
    const bounds = A.bounds(A.sources[id].polygon);
    assert.ok(Math.abs(f.width / bounds.width - f.height / bounds.height) < 1e-9);
    assert.ok(f.x >= 0 && f.y >= 0);
    assert.ok(f.x + f.width <= width && f.y + f.height <= badge.height);
  }
});

test('UV orientation reads correctly from outside and roof follows unfolded order', () => {
  const A = load(), p = G.importSpec(spec).params;
  const m = G.build(p), parts = G.assembly(p).parts;
  for (const part of parts) {
    const uv = A.uvFor(part, m);
    assert.equal(uv.length, part.vertices.length);
    for (const pair of uv) for (const v of pair) assert.ok(v >= -1e-9 && v <= 1 + 1e-9);
  }
  assert.equal(A.uvFor(parts.find(p => p.id === '1'), m)[1][0], 1);
  assert.equal(A.uvFor(parts.find(p => p.id === '6'), m)[1][0], 0);
  assert.ok(A.uvFor(parts.find(p => p.id === '3'), m)[0][0] < .1);
  assert.ok(A.uvFor(parts.find(p => p.id === '9'), m)[0][0] > .9);
  assert.deepEqual(A.uvFor(parts.find(p => p.id === '12L'), m), [[0,1],[1,1],[1,0],[0,0]]);
  assert.deepEqual(A.uvFor(parts.find(p => p.id === '12R'), m), [[0,1],[1,1],[1,0],[0,0]]);
});

test('workbench connects artwork without replacing approved geometry', () => {
  const html = fs.readFileSync('badge-dimensions.html', 'utf8');
  assert.match(html, /badge-artwork.js/);
  assert.match(html, /id="showArtwork"/);
  const viewer = fs.readFileSync('assets/js/badge-dimensions-viewer.js', 'utf8');
  assert.match(viewer, /BadgeArtwork\.uvFor/);
  assert.match(viewer, /BadgeDimensions\.assembly\(params\)/);
});

test('exported PNGs and SVG containers match each approved surface', () => {
  const dir = load().deliveryDir + '/';
  for (const id of Object.keys(load().sources)) {
    const badge = spec.badges.find(b => b.id === (id.startsWith('12') ? '12' : id));
    const width = id.startsWith('12') ? badge.panel : badge.width;
    const png = fs.readFileSync(dir + `badge-${id}-texture.png`);
    assert.deepEqual([...png.subarray(0,8)], [137,80,78,71,13,10,26,10]);
    assert.equal(png.readUInt32BE(16), Math.ceil(width * 16));
    assert.equal(png.readUInt32BE(20), Math.ceil(badge.height * 16));
    assert.equal(png[25], 6); // RGBA preserves transparent space outside the approved outline.
    const svg = fs.readFileSync(dir + `badge-${id}-fitted.svg`, 'utf8');
    assert.ok(svg.includes(`viewBox="0 0 ${width} ${badge.height}"`));
    assert.match(svg, /clip-path="url\(#approved\)"/);
  }
  const roof = fs.readFileSync(dir + 'badge-12-fitted.svg', 'utf8');
  assert.ok(roof.includes(`x="${spec.badges[4].panel + spec.parameters.gap}"`));
});
