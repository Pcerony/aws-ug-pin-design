const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const A = require('../assets/js/badge-artwork.js');
test('all five text-bearing surfaces use ivory edits, leaving the blank roof half intact', () => {
  assert.ok(A.lettering);
  assert.deepEqual(Object.keys(A.lettering), ['1','3','6','9','12R']);
  assert.match(A.lettering['1'].src, /ivory-lettering/);
  for (const edit of Object.values(A.lettering)) {
    assert.ok(fs.existsSync(edit.src));
    for (const [x,y,w,h] of edit.regions) {
      assert.ok(x >= 0 && y >= 0 && w > 0 && h > 0 && x+w <= 1 && y+h <= 1);
    }
  }
});
test('orange roof revision changes only two roof surfaces and retains the approved geometry', () => {
  assert.match(A.deliveryDir, /mascot-scale-fitted/);
  assert.deepEqual(Object.keys(A.roofEdits), ['12L','12R']);
  for(const edit of Object.values(A.roofEdits)) assert.ok(fs.existsSync(edit.src));
});
