(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./badge-dimensions-geometry.js'), require('../vendor/badge-jscad-modeling-2.12.1.min.js'));
  else root.BadgeBase = factory(root.BadgeDimensions, root.jscadModeling);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (G, J) {
  'use strict';
  const { geometries, booleans, primitives, transforms, expansions, extrusions } = J;
  const cross = (a,b,c) => (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  function hull(points) {
    const sorted = [...new Map(points.map(p => [p.map(n => n.toFixed(8)).join(','),p])).values()].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
    const half = list => { const out=[]; for (const p of list) { while(out.length>1 && cross(out.at(-2),out.at(-1),p)<=1e-9) out.pop(); out.push(p); } return out; };
    return [...half(sorted).slice(0,-1), ...half([...sorted].reverse()).slice(0,-1)];
  }
  function partSolid(part) {
    if (part.extrusion.every(n => n === 0)) return geometries.geom3.create();
    const center = part.solid.vertices.reduce((a,p)=>a.map((n,i)=>n+p[i]/part.solid.vertices.length),[0,0,0]);
    return geometries.geom3.create(part.solid.faces.map(face => {
      let points = face.map(i=>part.solid.vertices[i]);
      const polygon = geometries.poly3.create(points), normal = geometries.poly3.plane(polygon);
      if (normal.slice(0,3).reduce((n,v,i)=>n+v*(points[0][i]-center[i]),0)<0) points=[...points].reverse();
      return geometries.poly3.create(points);
    }));
  }
  function upright(shape, height, bottom) {
    return transforms.translate([0,bottom,0], transforms.rotateX(-Math.PI/2, extrusions.extrudeLinear({height},shape)));
  }
  let cacheKey, cache;
  function build(p) {
    if (!G.validate(p)) throw new Error('Invalid base dimensions');
    const key=JSON.stringify(p); if(key===cacheKey) return cache;
    const parts=G.assembly(p).parts;
    const datum=Math.min(...parts.flatMap(part=>part.solid.vertices.map(v=>v[1])));
    const layerCount=5, thickness=p.baseLayerThickness*layerCount;
    const top=datum+thickness, bottom=datum;
    const footprints=[], warnings=[];
    for(const part of parts) {
      if(part.extrusion.every(n=>n===0)) { warnings.push(`${part.id} 厚度为零，未生成实体插槽。`); continue; }
      const vertices=part.solid.vertices, points=vertices.filter(v=>v[1]<=top+1e-9);
      // Project the entire lower solid, not only its final section: vertical slots
      // clear the full downward insertion path even for tilted walls.
      for(let i=0;i<vertices.length;i++) for(let k=i+1;k<vertices.length;k++) {
        const a=vertices[i],b=vertices[k];
        if((a[1]-top)*(b[1]-top)<0) { const t=(top-a[1])/(b[1]-a[1]); points.push(a.map((n,j)=>n+t*(b[j]-n))); }
      }
      const outline=hull(points.map(v=>[v[0],-v[2]]));
      if(outline.length<3) continue;
      let shape=geometries.geom2.fromPoints(outline);
      if(p.baseClearance>0) shape=expansions.offset({delta:p.baseClearance,corners:'edge'},shape);
      footprints.push(shape);
    }
    const rectangle=primitives.rectangle({size:[p.baseWidth,p.baseDepth]});
    const slots=footprints.length ? booleans.union(...footprints) : geometries.geom2.create();
    const slotOutlines=footprints.length ? geometries.geom2.toOutlines(slots) : [];
    const rim=Math.min(...slotOutlines.flatMap(points=>points.flatMap(([x,z])=>[p.baseWidth/2-Math.abs(x),p.baseDepth/2-Math.abs(z)])));
    if(rim<2) warnings.push('插槽距底座外沿不足 2 mm，请增大底座长宽。');
    const surface=footprints.length ? booleans.subtract(rectangle,slots) : rectangle;
    const hasSurface=geometries.geom2.toSides(surface).length>0;
    const solid=hasSurface ? upright(surface,thickness,datum) : geometries.geom3.create();
    const layerSolid=hasSurface ? upright(surface,p.baseLayerThickness,datum) : geometries.geom3.create();
    const layerPolygons=geometries.geom3.toPolygons(layerSolid).map(poly=>poly.vertices);
    const layers=Array.from({length:layerCount},(_,i)=>({id:`base-${i+1}`,offset:i*p.baseLayerThickness,solid:layerSolid,polygons:layerPolygons}));
    const polygons=geometries.geom3.toPolygons(solid).map(poly=>poly.vertices);
    cacheKey=key;
    return cache={datum,top,bottom,width:p.baseWidth,depth:p.baseDepth,thickness,layerCount,layerThickness:p.baseLayerThickness,layers,slotDepth:thickness,clearance:p.baseClearance,solid,polygons,slotOutlines,topOutlines:geometries.geom2.toOutlines(surface),warnings};
  }
  function svg(b) {
    const paths=b.topOutlines.map(points=>G.path(points.map(([x,z])=>[x+b.width/2,z+b.depth/2]))).join(' ');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${G.fmt(b.width)}mm" height="${G.fmt(b.depth)}mm" viewBox="0 0 ${G.fmt(b.width)} ${G.fmt(b.depth)}"><title>Cardboard base layer; cut 5 identical copies; through slots; millimeters</title><path d="${paths}" fill="#bcc8bb" fill-rule="evenodd" stroke="#415446" stroke-width=".2"/></svg>`;
  }
  return {build,partSolid,svg};
});
