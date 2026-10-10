const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const dir = 'designs/number-one/2026-10-10-wafer';

test('early exploration removes diecut display but preserves other directions and source', () => {
  const html = read('index.html');
  assert.doesNotMatch(html, /data-image="designs\/number-one\/2026-10-07\/01-diecut.png"/);
  assert.ok(fs.existsSync(path.join(root, 'designs/number-one/2026-10-07/01-diecut.png')));
  for (const name of ['02-ribbon', '03-modular', '04-orbit', '05-mosaic']) {
    assert.ok(html.includes('data-image="designs/number-one/2026-10-07/' + name + '.png"'));
  }
});

test('three independent wafer studies are registered in the existing lightbox', () => {
  const html = read('index.html');
  for (const name of ['gold', 'silver', 'glass']) {
    const src = dir + '/badge-1-' + name + '-fitted.svg';
    assert.ok(html.includes('data-image="' + src + '"'), name);
    assert.ok(html.includes('src="' + src + '"'), name);
  }
});

test('coarse irregular glass revision sits alongside the preserved fine glass study', () => {
  const html = read('index.html');
  for (const name of ['glass', 'glass-coarse']) {
    assert.ok(html.includes('data-image="' + dir + '/badge-1-' + name + '-fitted.svg"'));
  }
  const svg = read(dir + '/badge-1-glass-coarse-fitted.svg');
  assert.match(svg, /width="80mm" height="80mm" viewBox="0 0 80 80"/);
  assert.ok(svg.includes('M40,0 L80,40 L74,80 L6,80 L0,40 Z'));
  assert.ok(svg.includes('clip-path="url(#approved)"'));
});

test('wafer studies use the exact approved 80 mm pentagon clip without changing approval', () => {
  for (const name of ['gold', 'silver', 'glass']) {
    const svg = read(dir + '/badge-1-' + name + '-fitted.svg');
    assert.match(svg, /width="80mm" height="80mm" viewBox="0 0 80 80"/);
    assert.ok(svg.includes('M40,0 L80,40 L74,80 L6,80 L0,40 Z'));
    assert.ok(svg.includes('clip-path="url(#approved)"'));
    assert.ok(svg.includes('preserveAspectRatio="xMidYMid slice"'));
  }
  assert.equal(JSON.parse(read('specs/approved/house-v012.json')).productionReady, false);
});
