(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BadgeAccessory = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const defaults = {visible:true, role:'leader', width:32, thickness:3, x:0, frontGap:24, elevation:0, yaw:0, pitch:0, roll:0};
  const limits = {width:[10,80], thickness:[.5,15], x:[-120,120], frontGap:[-30,150], elevation:[-30,80], yaw:[-180,180], pitch:[-60,60], roll:[-60,60]};
  function normalize(value) {
    const s = value && typeof value === 'object' ? value : {}, out = {...defaults};
    for (const [key,[min,max]] of Object.entries(limits)) {
      if (typeof s[key] === 'number' && Number.isFinite(s[key])) out[key] = Math.max(min,Math.min(max,s[key]));
    }
    if (['leader','speaker','volunteer'].includes(s.role)) out.role=s.role;
    if (typeof s.visible === 'boolean') out.visible=s.visible;
    out.insertionDepth=typeof s.insertionDepth==='number'&&Number.isFinite(s.insertionDepth)?Math.max(0,Math.min(40,s.insertionDepth)):2;
    return out;
  }
  function placement(p, base, settings, aspect) {
    const s=normalize(settings);
    aspect = aspect ?? 602 / {leader:478,speaker:471,volunteer:470}[s.role];
    return {width:s.width,height:s.width*aspect,thickness:s.thickness,
      position:[s.x,base.top-s.insertionDepth+s.elevation,p.depth/2+p.frontThickness+s.frontGap],
      rotation:[s.pitch,s.yaw,s.roll].map(a=>a*Math.PI/180)};
  }
  // Same XYZ Euler order as Three.js; rotation pivots at the plaque's bottom center.
  function transform(point, model) {
    let [x,y,z]=point;
    const [rx,ry,rz]=model.rotation, c=Math.cos, s=Math.sin;
    [x,y]=[x*c(rz)-y*s(rz),x*s(rz)+y*c(rz)];
    [x,z]=[x*c(ry)+z*s(ry),-x*s(ry)+z*c(ry)];
    [y,z]=[y*c(rx)-z*s(rx),y*s(rx)+z*c(rx)];
    return [x+model.position[0],y+model.position[1],z+model.position[2]];
  }
  function insertionFootprint(p, base, settings, aspect) {
    const s=normalize(settings);
    if (!s.visible) return [];
    const m=placement(p,base,s,aspect), vertices=[];
    for (const x of [-m.width/2,m.width/2]) for (const y of [0,m.height]) for (const z of [-m.thickness/2,m.thickness/2]) vertices.push(transform([x,y,z],m));
    const points=vertices.filter(v=>v[1]>=base.bottom && v[1]<=base.top);
    for (let i=0;i<vertices.length;i++) for(let j=i+1;j<vertices.length;j++) for(const level of [base.bottom,base.top]) {
      const a=vertices[i], b=vertices[j];
      if ((a[1]-level)*(b[1]-level)<0) {
        const t=(level-a[1])/(b[1]-a[1]);
        points.push(a.map((v,k)=>v+t*(b[k]-v)));
      }
    }
    return points.map(([x,y,z])=>[x,-z]);
  }
  function normalizeLayout(value) {
    const s=value&&typeof value==='object'?value:{}, shared=normalize(s);
    const count=typeof s.count==='number'&&Number.isFinite(s.count)?Math.max(0,Math.min(3,Math.round(s.count))):s.visible===false?0:1;
    const seeds=[{}, {role:'speaker',x:-32,frontGap:34}, {role:'volunteer',x:32,frontGap:34}];
    const items=seeds.map((seed,i)=>{
      const item=normalize(Array.isArray(s.items)?{...seed,...s.items[i]}:i===0?s:seed);
      delete item.width;delete item.thickness;delete item.visible;delete item.insertionDepth;
      return item;
    });
    return {count,width:shared.width,thickness:shared.thickness,insertionDepth:shared.insertionDepth,items};
  }
  function activeItems(value) {
    const s=normalizeLayout(value);
    return s.items.slice(0,s.count).map(item=>({...item,visible:true,width:s.width,thickness:s.thickness,insertionDepth:s.insertionDepth}));
  }
  return {defaults,limits,normalize,normalizeLayout,activeItems,placement,transform,insertionFootprint};
});
