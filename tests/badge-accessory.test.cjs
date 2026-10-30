const test = require('node:test');
const assert = require('node:assert/strict');
const G = require('../assets/js/badge-dimensions-geometry.js');
const B = require('../assets/js/badge-dimensions-base.js');
const J = require('../assets/vendor/badge-jscad-modeling-2.12.1.min.js');
const fs = require('node:fs');
const path = require('node:path');

test('front extension only moves the positive Z base edge, leaving walls and slots fixed', () => {
  const p = {...G.defaults, baseFrontExtension: 24};
  const before = B.build({...p, baseFrontExtension: 0}), after = B.build(p);
  const bounds = b => J.measurements.measureBoundingBox(b.solid);
  assert.equal(after.depth, p.baseDepth + 24);
  assert.ok(Math.abs(bounds(after)[0][2] - bounds(before)[0][2]) < .001);
  assert.ok(Math.abs(bounds(after)[1][2] - bounds(before)[1][2] - 24) < .001);
  assert.deepEqual(after.slotOutlines, before.slotOutlines);
  assert.deepEqual(G.assembly(p), G.assembly({...p, baseFrontExtension: 0}));
  assert.ok(Math.abs(J.measurements.measureVolume(after.solid) - J.measurements.measureVolume(before.solid) - 24*p.baseWidth*after.thickness) < .5);
  assert.match(B.svg(after), /height="104mm"/);
});

test('accessory insertion footprint cuts a matching extra slot and follows yaw', () => {
  const A = require('../assets/js/badge-accessory.js');
  const p = {...G.defaults,baseFrontExtension:24};
  const s = A.normalize({width:30,frontGap:25,thickness:3});
  const plain=B.build(p), inserted=B.build(p,s);
  assert.ok(inserted.slotOutlines.length > plain.slotOutlines.length);
  assert.ok(J.measurements.measureVolume(inserted.solid) < J.measurements.measureVolume(plain.solid));
  assert.deepEqual(B.build(p,{...s,visible:false}).slotOutlines,plain.slotOutlines);
  const a=A.insertionFootprint(p,plain,s), b=A.insertionFootprint(p,plain,{...s,yaw:90});
  const span=(points,i)=>Math.max(...points.map(p=>p[i]))-Math.min(...points.map(p=>p[i]));
  assert.ok(Math.abs(span(a,0)-30)<1e-9);
  assert.ok(Math.abs(span(b,1)-30)<1e-9);
});

test('legacy V0.12 imports default the new draft extension without changing approved dimensions', () => {
  const spec = require('../specs/approved/house-v012.json');
  const p = G.importSpec(spec).params;
  assert.equal(p.baseFrontExtension, 0);
  assert.equal(p.baseDepth, 120);
  assert.equal(G.validate({...p, baseFrontExtension: -1}), false);
  assert.equal(G.validate({...p, baseFrontExtension: NaN}), false);
  const roundTrip = G.importSpec({...spec, parameters: {...p, baseFrontExtension: 35}});
  assert.equal(roundTrip.params.baseFrontExtension, 35);
});

test('plaque is upright, embedded in front of the house, with explicit thickness and pivot', () => {
  const A = require('../assets/js/badge-accessory.js');
  const p = G.importSpec(require('../specs/approved/house-v012.json')).params;
  const s = A.normalize({width:30, thickness:3, x:4, frontGap:10, elevation:0, yaw:0, pitch:0, roll:0});
  const m = A.placement(p, B.build(p), s, 1.2);
  assert.equal(m.width, 30); assert.equal(m.height, 36); assert.equal(m.thickness, 3);
  assert.equal(m.position[0], 4);
  assert.equal(m.position[1], B.build(p).top - 2);
  assert.equal(m.position[2], p.depth/2 + p.frontThickness + 10);
  assert.deepEqual(m.rotation, [0,0,0]);
  const changed = A.placement(p, B.build(p), A.normalize({...s,yaw:45,pitch:12,roll:-8}),1.2);
  assert.ok(Math.abs(changed.rotation[1] - Math.PI/4) < 1e-9);
  assert.deepEqual(changed.position,m.position);
});

test('accessory settings reject corrupt storage, clamp numeric values and preserve role', () => {
  const A = require('../assets/js/badge-accessory.js');
  const s = A.normalize({role:'volunteer',width:Infinity,thickness:-1,yaw:999,x:'4',visible:false});
  assert.equal(s.role,'volunteer'); assert.equal(s.width,A.defaults.width);
  assert.equal(s.thickness,.5); assert.equal(s.yaw,180);
  assert.equal(s.x,A.defaults.x); assert.equal(s.visible,false);
  assert.equal(A.normalize(null).role,'leader');
  assert.equal(A.normalize({role:'<script>'}).role,'leader');
});

test('rotated insertion slots clear the entire nominal plaque thickness inside the base', () => {
  const A=require('../assets/js/badge-accessory.js');
  const T=require('../assets/vendor/badge-three-0.128.0.min.js');
  const p={...G.defaults,baseFrontExtension:35,baseWidth:150};
  for(const angles of [[0,0,0],[25,12,-8],[-40,-20,10],[90,0,0]]) {
    const s=A.normalize({yaw:angles[0],pitch:angles[1],roll:angles[2],frontGap:25,thickness:5});
    const base=B.build(p,s),m=A.placement(p,base,s);
    const local=J.primitives.cuboid({size:[m.width,m.height,m.thickness],center:[0,m.height/2,0]});
    const solid=J.geometries.geom3.create(J.geometries.geom3.toPolygons(local).map(poly=>J.geometries.poly3.create(poly.vertices.map(v=>A.transform(v,m)))));
    const point=[4,8,1], expected=new T.Vector3(...point).applyEuler(new T.Euler(...m.rotation)).add(new T.Vector3(...m.position));
    assert.ok(expected.distanceTo(new T.Vector3(...A.transform(point,m)))<1e-9);
    assert.ok(Math.abs(J.measurements.measureVolume(J.booleans.intersect(base.solid,solid)))<.01);
  }
});

test('gallery and workbench register all owner-cropped role assets and independent controls', () => {
  const root=path.resolve(__dirname,'..'), manifest=require('../designs/accessories/2027-house-roles/manifest.json');
  const home=fs.readFileSync(path.join(root,'index.html'),'utf8'), page=fs.readFileSync(path.join(root,'badge-dimensions.html'),'utf8');
  for(const role of ['leader','speaker','volunteer']) {
    const asset=manifest[role];
    assert.ok(fs.statSync(path.join(root,asset.src)).size>10000);
    assert.ok(asset.contour.length>30);
    assert.ok(asset.contour.flat().every(n=>n>=0&&n<=1));
    assert.match(home,new RegExp('accessory='+role));
    assert.ok(home.includes(asset.src));
  }
  for(const name of ['badge-accessory.js','badge-accessory-assets.js','badge-accessory-controls.js']) assert.ok(page.includes(name));
  assert.ok(page.includes('accessory:BadgeAccessoryControls.get()'));
  assert.ok(page.includes('if(importedSpec.accessory)BadgeAccessoryControls.restore(importedSpec.accessory)'));
});
