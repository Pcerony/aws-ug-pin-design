(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./badge-dimensions-geometry.js'),require('./badge-accessory.js'));
  else root.BadgeScale=factory(root.BadgeDimensions,root.BadgeAccessory);
})(typeof globalThis!=='undefined'?globalThis:this,function(G,A){
  'use strict';
  const lengths=Object.keys(G.defaults).filter(k=>k!=='wallTilt');
  const positions=['x','frontGap','elevation'];
  function range(params,accessory){
    const a=A.normalizeLayout(accessory),entries=lengths.map(k=>[params[k],G.limits[k]]);
    for(const k of ['width','thickness'])entries.push([a[k],A.limits[k]]);
    entries.push([a.insertionDepth,[0,40]]);
    for(const item of a.items)for(const k of positions)entries.push([item[k],A.limits[k]]);
    let min=.01,max=100;
    for(const [n,[low,high]]of entries){if(n===0)continue;const bounds=[low/n,high/n].sort((a,b)=>a-b);min=Math.max(min,bounds[0]);max=Math.min(max,bounds[1]);}
    return [min,max];
  }
  function scale(params,accessory,factor){
    const [min,max]=range(params,accessory);
    if(!Number.isFinite(factor)||factor<min-1e-10||factor>max+1e-10)throw Error('缩放超出当前整套尺寸允许范围');
    const p={...params},a=A.normalizeLayout(accessory);
    for(const k of lengths)p[k]*=factor;
    for(const k of ['width','thickness','insertionDepth'])a[k]*=factor;
    for(const item of a.items)for(const k of positions)item[k]*=factor;
    if(!G.validate(p))throw Error('缩放后的尺寸超出范围');
    return {params:p,accessory:a};
  }
  return {lengths,range,scale};
});
