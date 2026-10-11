const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const spec = JSON.parse(fs.readFileSync('specs/approved/house-v012.json', 'utf8'));
const api = () => require('../assets/js/badge-factory-export.js');

test('one fixed-scale sheet contains five badges and six surfaces', () => {
  const before = JSON.stringify(spec);
  const sheet = api().layout(spec, true);
  assert.deepEqual(sheet.groups.map(g => g.id), ['1', '3', '6', '9', '12']);
  assert.equal(sheet.width, 4800);
  assert.equal(sheet.height, 3200);
  assert.equal(sheet.groups.flatMap(g => g.surfaces).length, 6);
  for (const group of sheet.groups) {
    const badge = spec.badges.find(b => b.id === group.id);
    assert.equal(group.width, badge.width * sheet.scale);
    assert.equal(group.height, badge.height * sheet.scale);
    for (const surface of group.surfaces) {
      assert.equal(surface.width, (group.id === '12' ? badge.panel : badge.width) * sheet.scale);
      assert.ok(surface.x >= 0 && surface.y >= 0);
      assert.ok(surface.x + surface.width < sheet.width);
      assert.ok(surface.y + surface.height < sheet.height - 160);
    }
  }
  assert.equal(JSON.stringify(spec), before);
});

test('roof preserves two panels, exact gap and annotations outside artwork', () => {
  const sheet = api().layout(spec, true);
  const roof = sheet.groups[4];
  assert.deepEqual(roof.surfaces.map(s => s.id), ['12L', '12R']);
  assert.ok(Math.abs(roof.surfaces[1].x - roof.surfaces[0].x - roof.surfaces[0].width - spec.parameters.gap * sheet.scale) < 1e-9);
  for (const group of sheet.groups) {
    assert.ok(group.annotations.some(a => a.kind === 'width'));
    assert.ok(group.annotations.some(a => a.kind === 'height'));
    assert.ok(group.annotations.some(a => a.kind === 'thickness' && a.text.includes('5')));
  }
  assert.ok(roof.annotations.some(a => a.kind === 'roof' && a.text.includes('2 mm')));
  assert.ok(roof.annotations.some(a => a.text.includes('60.811')));
});

test('dimension-free mode has identical geometry with no measurements or ruler', () => {
  const clean = api().layout(spec, false);
  const annotated = api().layout(spec, true);
  assert.equal(clean.ruler, null);
  assert.ok(annotated.ruler);
  clean.groups.forEach((g, i) => {
    assert.deepEqual(g.surfaces, annotated.groups[i].surfaces);
    assert.deepEqual(g.annotations, []);
  });
});

test('file naming isolates styles, palettes, annotations and rejects archive collections', () => {
  for (const collection of ['metal', 'puzzle', 'puzzleSpeaker', 'puzzleVolunteer']) {
    const name = api().filename(collection, true);
    assert.ok(name.includes(collection));
    assert.match(name, /136912-v012-dimensions\.png$/);
    assert.match(api().filename(collection, false), /-clean\.png$/);
  }
  assert.throws(() => api().filename('metalOriginal', true), /Unsupported/);
});

test('export controls use immutable approval and independent download actions', () => {
  const html = fs.readFileSync('factory-export.html', 'utf8');
  for (const id of ['downloadMetal', 'downloadPuzzle', 'exportDimensions', 'exportPalette', 'sheetPreview', 'exportError']) {
    assert.ok(html.includes('id="' + id + '"'));
  }
  assert.ok(html.includes('data/approved-dimensions.js'));
  assert.ok(!html.includes('localStorage'));
  assert.ok(fs.readFileSync('index.html', 'utf8').includes('factory-export.html'));
  assert.ok(fs.readFileSync('badge-dimensions.html', 'utf8').includes('factory-export.html'));
});

test('image load failures reject export rather than returning a blank sheet', async () => {
  await assert.rejects(api().render(spec, 'puzzle', true, {
    canvasFor: async () => { throw new Error('image failed'); }
  }), /image failed/);
});
