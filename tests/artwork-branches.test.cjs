const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const A = require('../assets/js/badge-artwork.js');
const spec = JSON.parse(fs.readFileSync('specs/approved/house-v012.json', 'utf8'));

test('metal archive and puzzle retain separate six-surface collections', () => {
  assert.equal(A.collections.metalOriginal.sources, A.sources);
  assert.notEqual(A.collections.puzzle.sources, A.sources);
  assert.deepEqual(Object.keys(A.collections.puzzle.sources), Object.keys(A.sources));
  assert.match(A.sources['6'].src, /v04-small-window-only/);
  assert.match(A.collections.puzzle.sources['6'].src, /v03-relocated-joint/);
  for (const source of Object.values(A.collections.puzzle.sources)) {
    const id = Object.keys(A.collections.puzzle.sources).find(id => A.collections.puzzle.sources[id] === source);
    const badge = spec.badges.find(b => b.id === (id.startsWith('12') ? '12' : id));
    const width = id.startsWith('12') ? badge.panel : badge.width;
    const f = A.fit(source, width, badge.height), b = A.bounds(source.polygon);
    assert.ok(Math.abs(f.width / b.width - f.height / b.height) < 1e-9);
    assert.ok(f.x >= 0 && f.y >= 0);
  }
});

test('workbench provides a collection selector and viewer isolates asynchronous loads', () => {
  const html = fs.readFileSync('badge-dimensions.html', 'utf8');
  assert.match(html, /id="artworkCollection"/);
  assert.match(html, /value="metal"/);
  assert.match(html, /value="puzzle"/);
  const viewer = fs.readFileSync('assets/js/badge-dimensions-viewer.js', 'utf8');
  assert.match(viewer, /loadArtwork\(collection\)/);
  assert.match(viewer, /token !== this.artworkLoadToken/);
});
