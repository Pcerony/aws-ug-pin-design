const test = require('node:test');
const assert = require('node:assert/strict');
const G = require('../assets/js/badge-dimensions-geometry.js');
const J = require('../assets/vendor/badge-jscad-modeling-2.12.1.min.js');
test('base parameters migrate and validate independently of badge contours', () => {
  assert.equal(G.defaults.baseWidth, 100);
  assert.equal(G.validate({...G.defaults, baseThickness: -1}), false);
  const legacy = {...G.defaults};
  for (const k of Object.keys(legacy).filter(k => k.startsWith('base'))) delete legacy[k];
  assert.equal(G.importSpec({schema:'aws-ug-badge-outline/v0.10', units:'mm', parameters:legacy}).params.baseFloor, 1.5);
});
test('base is a single adjustable solid with clear insertion slots', () => {
  const B = require('../assets/js/badge-dimensions-base.js');
  for (const wallTilt of [0, 20, 45]) {
    const p = {...G.defaults, wallTilt, frontThickness:3, backThickness:2, taper:3, inset:4};
    const b = B.build(p), a = G.assembly(p);
    assert.ok(b.polygons.length > 0);
    assert.ok(Math.abs(b.top - b.datum - p.baseSolidThickness)<1e-9);
    assert.equal(b.bottom, b.datum);
    assert.equal(b.layers.length, 1);
    assert.equal(b.layerThickness, p.baseSolidThickness);
    const originalVolume = p.baseWidth*p.baseDepth*b.thickness;
    assert.ok(J.measurements.measureVolume(b.solid) < originalVolume);
    for (const [i,layer] of b.layers.entries()) {
      assert.deepEqual(layer.polygons,b.layers[0].polygons);
      assert.equal(layer.offset, 0);
      assert.ok(Math.abs(J.measurements.measureVolume(layer.solid)-J.measurements.measureVolume(b.solid))<1e-5);
    }
    // Test actual solids throughout the insertion path, not just outlines.
    for (const lift of [0, .1, 1, 2, 4, 10]) for (const part of a.parts) {
      const wall = J.transforms.translate([0,lift,0], B.partSolid(part));
      assert.ok(Math.abs(J.measurements.measureVolume(J.booleans.intersect(b.solid, wall))) < 1e-5, `${wallTilt} / ${part.id} / ${lift}`);
    }
    assert.equal(b.warnings.length, 0);
    assert.match(B.svg(b), /fill-rule="evenodd"/);
  }
});
test('undersized bases and zero-thickness panels produce explicit warnings', () => {
  const B = require('../assets/js/badge-dimensions-base.js');
  assert.ok(B.build({...G.defaults,baseWidth:20,baseDepth:20}).warnings.length);
  assert.ok(B.build({...G.defaults,leftThickness:0}).warnings.length);
});
test('extreme supported parameters keep the Boolean solid finite and clear of insertion', () => {
  const B = require('../assets/js/badge-dimensions-base.js');
  for (const changes of [
    {baseClearance:0,wallTilt:45,frontThickness:20,backThickness:20,baseSolidThickness:40},
    {width:20,wall:15,rise:100,roofOverhangSide:50,baseSolidThickness:.5},
    {width:150,wall:150,rise:3,depth:150,inset:70,baseWidth:400,baseDepth:400,baseClearance:3},
  ]) {
    const p={...G.defaults,...changes},b=B.build(p);
    assert.ok(b.polygons.flat(2).every(Number.isFinite));
    assert.ok(J.measurements.measureVolume(b.solid)>0);
    for (const lift of [0,.25,1,20,40]) for (const part of G.assembly(p).parts) {
      const volume=J.measurements.measureVolume(J.booleans.intersect(b.solid,J.transforms.translate([0,lift,0],B.partSolid(part))));
      assert.ok(Math.abs(volume)<1e-4, `${JSON.stringify(changes)} / ${part.id} / ${lift}: ${volume}`);
    }
  }
});
test('legacy base total thickness migrates to a single slab without changing total height', () => {
  const p={...G.defaults,baseThickness:6,baseFloor:2}; delete p.baseLayerThickness; delete p.baseSolidThickness;
  const imported=G.importSpec({schema:'aws-ug-badge-outline/v0.11',units:'mm',parameters:p,status:'locked-draft'});
  assert.equal(imported.params.baseLayerThickness,1.6);
  assert.equal(imported.params.baseSolidThickness,8);
  assert.equal(imported.locked,false);
});
