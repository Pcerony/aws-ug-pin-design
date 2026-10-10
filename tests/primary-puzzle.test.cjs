const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('3D initially selects puzzle but explicit metal links still open the backup', () => {
  const html = fs.readFileSync('badge-dimensions.html', 'utf8');
  const selector = html.match(/<select id="artworkCollection"[^>]*>(.*?)<\/select>/)[1];
  assert.match(selector, /<option value="puzzle" selected>/);
  const line = html.split('\n').find(line => line.startsWith('const requestedDesign='));
  assert.ok(line, 'explicit style query handling');
  for (const [search, expected] of [['', 'puzzle'], ['?design=metal', 'metal'], ['?design=puzzle', 'puzzle'], ['?design=unknown', 'puzzle']]) {
    const control = { value: 'puzzle' };
    vm.runInNewContext(line, { URLSearchParams, location: { search }, document: { getElementById: () => control } });
    assert.equal(control.value, expected);
  }
  const viewer = fs.readFileSync('assets/js/badge-dimensions-viewer.js', 'utf8');
  assert.match(viewer, /options.collection \|\| 'puzzle'/);
});

test('home identifies puzzle as primary and preserves a metal comparison link and wafer studies', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.ok(html.includes('拼块版 · 橙色 Leader'));
  assert.ok(html.includes('badge-dimensions.html?approved=1&amp;design=metal#model'));
  for (const name of ['glass', 'glass-coarse']) {
    assert.ok(html.includes('badge-1-' + name + '-fitted.svg'));
  }
});
