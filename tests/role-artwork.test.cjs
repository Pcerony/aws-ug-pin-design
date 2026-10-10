const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const A = require('../assets/js/badge-artwork.js');

test('puzzle palettes resolve independently of the primary style', () => {
  assert.equal(A.resolveCollection('metal', 'speaker'), 'metal');
  assert.equal(A.resolveCollection('puzzle', 'leader'), 'puzzle');
  assert.equal(A.resolveCollection('puzzle', 'speaker'), 'puzzleSpeaker');
  assert.equal(A.resolveCollection('puzzle', 'volunteer'), 'puzzleVolunteer');
  assert.equal(A.resolveCollection('puzzle', 'unknown'), 'puzzle');
});

test('both new role collections have all six existing surfaces and real assets', () => {
  for (const key of ['puzzleSpeaker', 'puzzleVolunteer']) {
    const collection = A.collections[key];
    assert.equal(collection.kind, 'puzzle');
    assert.deepEqual(Object.keys(collection.sources), Object.keys(A.collections.puzzle.sources));
    for (const source of Object.values(collection.sources)) {
      assert.ok(fs.existsSync(source.src), source.src);
      const box = A.bounds(source.polygon);
      assert.ok(box.width > 0 && box.height > 0);
    }
  }
});

test('main selector has only two styles with a separate conditional color selector', () => {
  const html = fs.readFileSync('badge-dimensions.html', 'utf8');
  const selector = html.match(/<select id="artworkCollection"[^>]*>(.*?)<\/select>/)[1];
  assert.equal((selector.match(/<option /g) || []).length, 2);
  assert.match(html, /id="artworkPalette"/);
  assert.match(html, /artworkPaletteControl.*hidden/);
  assert.match(html, /BadgeArtwork.resolveCollection/);
});

test('palette visibility follows style changes without resetting the chosen color', () => {
  const html = fs.readFileSync('badge-dimensions.html', 'utf8');
  const controls = {
    artworkCollection: { value: 'metal' },
    artworkPaletteControl: { hidden: false },
    artworkPalette: { value: 'volunteer' }
  };
  const context = vm.createContext({ document: { getElementById: id => controls[id] } });
  vm.runInContext(html.match(/function syncArtworkControls\(\)\{[^\n]+\}/)[0], context);
  for (const [style, hidden] of [['metal', true], ['puzzle', false], ['metal', true], ['puzzle', false]]) {
    controls.artworkCollection.value = style;
    vm.runInContext('syncArtworkControls()', context);
    assert.equal(controls.artworkPaletteControl.hidden, hidden);
    assert.equal(controls.artworkPalette.value, 'volunteer');
  }
});

test('each palette produces all approved-size canvases using an unstretched fit', async () => {
  const spec = JSON.parse(fs.readFileSync('specs/approved/house-v012.json', 'utf8'));
  const calls = [];
  const context2d = new Proxy({}, { get: (_, name) => (...args) => calls.push([name, ...args]) });
  const sandbox = {
    module: { exports: {} },
    Image: class { set src(value) { this.url = value; this.onload(); } },
    document: { createElement: () => ({ getContext: () => context2d }) }
  };
  vm.runInNewContext(fs.readFileSync('assets/js/badge-artwork.js', 'utf8'), sandbox);
  const artwork = sandbox.module.exports;
  for (const palette of ['puzzle', 'puzzleSpeaker', 'puzzleVolunteer']) {
    for (const id of Object.keys(artwork.collections[palette].sources)) {
      calls.length = 0;
      const canvas = await artwork.canvasFor(id, spec, palette);
      const badge = spec.badges.find(b => b.id === (id.startsWith('12') ? '12' : id));
      assert.equal(canvas.width, Math.ceil((id.startsWith('12') ? badge.panel : badge.width) * 16));
      assert.equal(canvas.height, Math.ceil(badge.height * 16));
      const fitScale = calls.filter(call => call[0] === 'scale')[1];
      assert.equal(fitScale[1], fitScale[2]);
      assert.equal(calls.filter(call => call[0] === 'drawImage').length, 1);
      assert.equal(calls.filter(call => call[0] === 'clip').length, 2);
    }
  }
});
