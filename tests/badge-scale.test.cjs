const test=require('node:test'),assert=require('node:assert/strict');
const G=require('../assets/js/badge-dimensions-geometry.js'),A=require('../assets/js/badge-accessory.js'),B=require('../assets/js/badge-dimensions-base.js');
test('uniform scaling includes all physical dimensions, positions and insertion depth, not angles or counts',()=>{
  const S=require('../assets/js/badge-scale.js'),p=G.importSpec(require('../specs/approved/house-v012.json')).params;
  const a=A.normalizeLayout({count:3,width:26,thickness:3,items:[{x:5,yaw:15},{x:-30,pitch:10},{x:30,roll:-8}]});
  const out=S.scale(p,a,1.25);
  for(const key of Object.keys(G.defaults))assert.equal(out.params[key],key==='wallTilt'?p[key]:p[key]*1.25);
  assert.equal(out.accessory.width,32.5);assert.equal(out.accessory.thickness,3.75);
  assert.equal(out.accessory.items[1].x,-37.5);assert.equal(out.accessory.items[1].pitch,10);
  assert.equal(out.accessory.count,3);assert.equal(out.accessory.insertionDepth,2.5);
  const before=A.placement(p,B.build(p),A.activeItems(a)[0]),after=A.placement(out.params,B.build(out.params),A.activeItems(out.accessory)[0]);
  before.position.forEach((n,i)=>assert.ok(Math.abs(after.position[i]-n*1.25)<1e-8));
});
test('scale range intersects every dimension limit and refuses silent clipping',()=>{
  const S=require('../assets/js/badge-scale.js'),p={...G.defaults},a=A.normalizeLayout({width:78});
  const [min,max]=S.range(p,a);
  assert.ok(min>0);assert.ok(max<1.03);
  assert.throws(()=>S.scale(p,a,2));assert.throws(()=>S.scale(p,a,NaN));
  assert.ok(G.validate(S.scale(p,a,(min+max)/2).params));
});
