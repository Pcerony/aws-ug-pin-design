const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const A = require('../assets/js/badge-artwork.js');

test('metal uses generated engraved-rim artwork, not a programmatic band', () => {
  assert.equal(A.collections.metal.preservePhotoRim, true);
  assert.equal(A.collections.metal.rimWidth, undefined);
  assert.equal(A.collections.metalOriginal.sources, A.sources);
  assert.notEqual(A.collections.metal.sources, A.sources);
  assert.deepEqual(Object.keys(A.collections.metal.sources), Object.keys(A.sources));
  for (const source of Object.values(A.collections.metal.sources)) {
    assert.match(source.src, /2026-10-(09-metal-engraved-rim|10-metal-clean-rebuild)/);
    assert.ok(fs.existsSync(source.src), source.src);
  }
  assert.doesNotMatch(fs.readFileSync('assets/js/badge-artwork.js', 'utf8'), /function silverRim/);
});

test('metal selects reviewed clean 9 and 12 while preserving the other badges', () => {
  const sources = A.collections.metal.sources;
  assert.match(sources['9'].src, /badge-9-v02-clean-balanced\.png$/);
  assert.match(sources['12L'].src, /badge-12-v02-even-silver\.png$/);
  assert.equal(sources['12L'].src, sources['12R'].src);
  assert.match(sources['1'].src, /badge-1-v03-original-metal\.png$/);
  assert.match(sources['3'].src, /badge-3-v05-balanced-type\.png$/);
  assert.match(sources['6'].src, /badge-6-v01-original\.png$/);
  assert.deepEqual(sources['12L'].polygon, [[45,48],[730,48],[730,1024],[45,1024]]);
  assert.deepEqual(sources['12R'].polygon, [[741,48],[1426,48],[1426,1024],[741,1024]]);
});

test('home gallery displays the current metal images without changing historical contours', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const gallery = html.split('<section class="project-section">')[0];
  for (const id of ['1', '3', '6', '9', '12L']) {
    assert.ok(gallery.includes(A.collections.metal.sources[id].src), id);
  }
  assert.ok(html.includes('specs/approved/badge-9.svg'));
  assert.ok(html.includes('specs/approved/badge-12.svg'));
});
