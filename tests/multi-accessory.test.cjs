const test=require('node:test'),assert=require('node:assert/strict');
const A=require('../assets/js/badge-accessory.js'),B=require('../assets/js/badge-dimensions-base.js'),G=require('../assets/js/badge-dimensions-geometry.js');
test('zero to three plaques share dimensions but retain independent transforms and roles',()=>{
  const layout=A.normalizeLayout({count:3,width:28,thickness:4,items:[{x:-30,role:'leader'},{x:0,yaw:20,role:'speaker'},{x:30,frontGap:40,role:'volunteer'}]});
  const list=A.activeItems(layout);
  assert.equal(list.length,3);assert.deepEqual(list.map(s=>s.x),[-30,0,30]);
  assert.deepEqual(list.map(s=>s.width),[28,28,28]);assert.deepEqual(list.map(s=>s.thickness),[4,4,4]);
  assert.equal(list[1].yaw,20);assert.equal(list[2].frontGap,40);
  for(const count of [0,1,2,3])assert.equal(A.activeItems({...layout,count}).length,count);
  assert.equal(A.normalizeLayout({count:9}).count,3);
});
test('single-plaque drafts migrate and shared sizes override per-plaque stale values',()=>{
  const layout=A.normalizeLayout({visible:true,role:'speaker',width:40,thickness:7,x:12,yaw:35});
  assert.equal(layout.count,1);assert.equal(layout.items[0].role,'speaker');assert.equal(layout.items[0].x,12);
  assert.equal(A.normalizeLayout({visible:false}).count,0);
  const changed=A.normalizeLayout({...layout,count:3,width:24,items:layout.items.map(s=>({...s,width:70,thickness:14}))});
  assert.ok(A.activeItems(changed).every(s=>s.width===24&&s.thickness===7));
  assert.deepEqual(A.normalizeLayout(JSON.parse(JSON.stringify(changed))),changed);
});
test('base slots follow every active plaque, and count zero removes accessory slots',()=>{
  const p={...G.defaults,baseWidth:180,baseDepth:120,baseFrontExtension:30};
  const layout=A.normalizeLayout({count:3,width:24,items:[{x:-40},{x:0},{x:40}]});
  const plain=B.build(p),three=B.build(p,layout),zero=B.build(p,{...layout,count:0});
  assert.equal(three.slotOutlines.length,plain.slotOutlines.length+3);
  assert.deepEqual(zero.slotOutlines,plain.slotOutlines);
});
