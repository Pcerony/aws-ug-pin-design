const test=require('node:test'),assert=require('node:assert/strict');
const G=require('../assets/js/badge-dimensions-geometry.js'),B=require('../assets/js/badge-dimensions-base.js');
test('single base thickness is directly adjustable without stacking or changing the footprint',()=>{
  const a=B.build({...G.defaults,baseSolidThickness:5.5}),b=B.build({...G.defaults,baseSolidThickness:12});
  assert.equal(b.layerCount,1);assert.equal(b.layers.length,1);
  assert.equal(b.thickness,12);assert.equal(b.slotDepth,12);
  assert.equal(b.top-b.bottom,12);assert.equal(b.layers[0].offset,0);
  assert.equal(a.width,b.width);assert.equal(a.depth,b.depth);
  assert.doesNotMatch(B.svg(b),/5 identical/);
});
test('old five-layer drafts migrate to a single slab with the same total thickness',()=>{
  const spec=require('../specs/approved/house-v012.json');
  const p=G.importSpec(spec).params;
  assert.equal(p.baseSolidThickness,5.5);
  const exported={...spec,parameters:{...p,baseSolidThickness:9}};
  assert.equal(G.importSpec(exported).params.baseSolidThickness,9);
  assert.equal(G.validate({...p,baseSolidThickness:0}),false);
});
