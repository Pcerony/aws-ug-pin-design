(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BadgeArtwork = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const dir = 'designs/house-series/';
  // Interior landmarks exclude the old photo rim and its white backdrop.
  const sources = {
    '1': { src: dir + '2026-10-08-mascot-scale/badge-1-v07-small-grounded.png', polygon: [[625,48],[1204,651],[1092,1172],[146,1172],[42,623]] },
    '3': { src: dir + '2026-10-08-mascot-series/badge-3-mascot-v01.png', polygon: [[22,145],[1414,145],[1283,929],[121,929]] },
    '6': { src: dir + '2026-10-08-mascot-scale/badge-6-v04-small-window-only.png', polygon: [[625,20],[1230,639],[1138,1224],[113,1224],[22,629]] },
    '9': { src: dir + '2026-10-08-mascot-series/badge-9-mascot-v03-complete-loop-clean-rim.png', polygon: [[23,134],[1416,134],[1297,933],[139,933]] },
    '12L': { src: dir + '2026-10-08-mascot-scale/badge-12-v03-small-overhead-reclining.png', polygon: [[58,49],[713,49],[713,1015],[58,1015]] },
    '12R': { src: dir + '2026-10-08-mascot-scale/badge-12-v03-small-overhead-reclining.png', polygon: [[759,49],[1415,49],[1415,1015],[759,1015]] }
  };
  const images = new Map();
  const puzzleDir = dir + '2026-10-09-block-puzzle-branch/';
  // This branch keeps its engraved broad rim; the original collection stays untouched.
  const puzzleSources = {
    '1': { src: puzzleDir + 'badge-1-style-reference.png', polygon: [[626,2],[1252,599],[1136,1205],[119,1205],[0,577]] },
    '3': { src: puzzleDir + 'badge-3-v02-block-joints-small-type.png', polygon: [[48,110],[1390,110],[1345,925],[135,925]] },
    '6': { src: puzzleDir + 'badge-6-v03-relocated-joint.png', polygon: [[626,2],[1250,588],[1135,1220],[117,1220],[2,569]] },
    '9': { src: puzzleDir + 'badge-9-v02-block-joints-small-type.png', polygon: [[14,207],[1297,207],[1180,1077],[115,1077]] },
    '12L': { src: puzzleDir + 'badge-12-v02-block-joints-small-type.png', polygon: [[65,73],[728,73],[728,962],[65,962]] },
    '12R': { src: puzzleDir + 'badge-12-v02-block-joints-small-type.png', polygon: [[742,73],[1367,73],[1367,962],[742,962]] }
  };
  const engravedDir = dir + '2026-10-09-metal-engraved-rim/';
  const cleanMetalDir = dir + '2026-10-10-metal-clean-rebuild/';
  const engravedSources = {
    '1': { src: engravedDir + 'badge-1-v03-original-metal.png', polygon: [[627,14],[1232,542],[1068,1215],[181,1215],[17,507]] },
    '3': { src: engravedDir + 'badge-3-v05-balanced-type.png', polygon: [[166,128],[1280,128],[1419,432],[1265,946],[184,946],[26,425]] },
    '6': { src: engravedDir + 'badge-6-v01-original.png', polygon: [[627,24],[1236,599],[1115,1207],[134,1207],[12,556]] },
    '9': { src: cleanMetalDir + 'badge-9-v02-clean-balanced.png', polygon: [[15,119],[1429,119],[1271,984],[176,984]] },
    '12L': { src: cleanMetalDir + 'badge-12-v02-even-silver.png', polygon: [[45,48],[730,48],[730,1024],[45,1024]] },
    '12R': { src: cleanMetalDir + 'badge-12-v02-even-silver.png', polygon: [[741,48],[1426,48],[1426,1024],[741,1024]] }
  };
  const speakerDir = dir + '2026-10-10-speaker-block-series/';
  const volunteerDir = dir + '2026-10-10-volunteer-block-series/';
  const speakerSources = {
    '1': { src: speakerDir + 'badge-1-v01-microphone.png', polygon: [[625,2],[1251,597],[1142,1206],[98,1206],[1,576]] },
    '3': { src: speakerDir + 'badge-3-v01.png', polygon: [[48,108],[1362,108],[1318,906],[131,906]] },
    '6': { src: speakerDir + 'badge-6-v01.png', polygon: [[625,2],[1249,598],[1140,1218],[115,1218],[1,567]] },
    '9': { src: speakerDir + 'badge-9-v01.png', polygon: [[44,121],[1400,121],[1290,1003],[172,1003]] },
    '12L': { src: speakerDir + 'badge-12-v01.png', polygon: [[66,72],[738,72],[738,969],[66,969]] },
    '12R': { src: speakerDir + 'badge-12-v01.png', polygon: [[751,72],[1385,72],[1385,969],[751,969]] }
  };
  const volunteerSources = {
    '1': { src: volunteerDir + 'badge-1-v01-welcome.png', polygon: [[625,2],[1251,597],[1142,1206],[98,1206],[1,576]] },
    '3': { src: volunteerDir + 'badge-3-v01.png', polygon: [[46,110],[1397,110],[1294,905],[130,905]] },
    '6': { src: volunteerDir + 'badge-6-v01.png', polygon: [[625,2],[1249,598],[1140,1218],[115,1218],[1,567]] },
    '9': { src: volunteerDir + 'badge-9-v01.png', polygon: [[32,109],[1416,109],[1298,992],[169,992]] },
    '12L': { src: volunteerDir + 'badge-12-v01.png', polygon: [[66,73],[725,73],[725,960],[66,960]] },
    '12R': { src: volunteerDir + 'badge-12-v01.png', polygon: [[742,73],[1364,73],[1364,960],[742,960]] }
  };
  const collections = {
    metal: { label: '金属版 · 嵌字宽框', sources: engravedSources, preservePhotoRim: true },
    metalOriginal: { label: '金属版 · 原版存档', sources },
    puzzle: { label: '拼块版 · 橙色 Leader', kind: 'puzzle', sources: puzzleSources, preservePhotoRim: true },
    puzzleSpeaker: { label: '拼块版 · 绿色 Speaker', kind: 'puzzle', sources: speakerSources, preservePhotoRim: true },
    puzzleVolunteer: { label: '拼块版 · 紫色 Volunteer', kind: 'puzzle', sources: volunteerSources, preservePhotoRim: true }
  };
  function resolveCollection(style, palette) {
    if (style !== 'puzzle') return 'metal';
    return { speaker: 'puzzleSpeaker', volunteer: 'puzzleVolunteer' }[palette] || 'puzzle';
  }
  const ivoryDir = dir + '2026-10-08-ivory-lettering';
  const deliveryDir = dir + '2026-10-08-mascot-scale-fitted';
  const legacyRoofDir = dir + '2026-10-08-orange-roof';
  // Historical lettering inputs remain available for archive validation, not compositing.
  const roofEdits = {
    '12L': { src: legacyRoofDir+'/badge-12L-orange-edit.png', crop: [65,0,902,1525] },
    '12R': { src: legacyRoofDir+'/badge-12R-orange-type-v02.png' }
  };
  const lettering = {
    '1': { src: ivoryDir+'/badge-1-ivory-edit.png', regions: [[.635,.36,.305,.215],[.635,.575,.24,.135],[.635,.708,.245,.081]] },
    '3': { src: ivoryDir+'/badge-3-ivory-edit.png', regions: [[.059,.285,.255,.23],[.079,.525,.214,.15],[.08,.677,.205,.088]] },
    '6': { src: ivoryDir+'/badge-6-ivory-edit.png', regions: [[.64,.366,.30,.215],[.644,.575,.226,.14],[.644,.708,.226,.081]] },
    '9': { src: ivoryDir+'/badge-9-ivory-edit.png', regions: [[.62,.22,.315,.268],[.62,.511,.23,.169],[.62,.683,.265,.107]] },
    '12R': { src: ivoryDir+'/badge-12R-ivory-edit.png', regions: [[.092,.65,.378,.153],[.105,.807,.245,.093],[.105,.9,.321,.065]] }
  };
  function bounds(polygon) {
    const x = Math.min(...polygon.map(p => p[0])), y = Math.min(...polygon.map(p => p[1]));
    return { x, y, width: Math.max(...polygon.map(p => p[0])) - x, height: Math.max(...polygon.map(p => p[1])) - y };
  }
  function fit(source, width, height, margin = .6) {
    const b = bounds(source.polygon);
    const scale = Math.min((width - 2 * margin) / b.width, (height - 2 * margin) / b.height);
    return { x: (width - b.width * scale) / 2, y: (height - b.height * scale) / 2, width: b.width * scale, height: b.height * scale, scale };
  }
  function uvFor(part, model) {
    if (part.id.startsWith('12')) return [[0,1],[1,1],[1,0],[0,0]];
    const badge = model.badges.find(b => b.id === part.id);
    const mirror = ['6', '9'].includes(part.id);
    return badge.polygons[0].map(([x,y]) => [mirror ? 1 - x / badge.width : x / badge.width, 1 - y / badge.height]);
  }
  async function prepare(collection = 'metal') {
    if (!collections[collection]) throw new Error('Unknown artwork collection: ' + collection);
    await Promise.all([...new Set(Object.values(collections[collection].sources).map(s => s.src))].map(src => {
      if (!images.has(src)) images.set(src, new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => { images.delete(src); reject(new Error('贴图加载失败：' + src)); };
        img.src = src;
      }));
      return images.get(src);
    }));
  }
  function trace(ctx, points) {
    ctx.beginPath(); points.forEach(([x,y], i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y)); ctx.closePath();
  }
  async function canvasFor(id, spec, collection = 'metal') {
    const source = collections[collection] && collections[collection].sources[id];
    if (!source) throw new Error('Unknown artwork surface: ' + id);
    await prepare(collection);
    const img = await images.get(source.src), half = id.startsWith('12');
    const badge = spec.badges.find(b => b.id === (half ? '12' : id));
    const width = half ? badge.panel : badge.width, height = badge.height;
    const preservePhotoRim = collections[collection].preservePhotoRim;
    const polygon = badge.polygons[0], f = fit(source, width, height), b = bounds(source.polygon);
    const canvas = document.createElement('canvas'), pixels = 16;
    canvas.width = Math.ceil(width * pixels); canvas.height = Math.ceil(height * pixels);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.scale(canvas.width / width, canvas.height / height);
    trace(ctx, polygon); ctx.clip();
    ctx.fillStyle = preservePhotoRim ? '#b8b8b6' : half ? '#ff7900' : '#f3f0e7'; ctx.fillRect(0,0,width,height);
    // Continue the orange upper field to the exact apex without stretching the artwork.
    if (!preservePhotoRim && (id === '1' || id === '6')) {
      ctx.fillStyle = '#ff7900';
      ctx.fillRect(0,0, f.x + (id === '1' ? 740 : 625) * f.scale - b.x*f.scale, height/2);
    }
    ctx.save(); ctx.translate(f.x,f.y); ctx.scale(f.scale,f.scale); ctx.translate(-b.x,-b.y);
    trace(ctx, source.polygon); ctx.clip(); ctx.drawImage(img,0,0); ctx.restore();
    // New engraved rims are part of the generated artwork, never painted over it.
    if (!preservePhotoRim) {
      trace(ctx, polygon); ctx.lineJoin = 'miter';
      for (const [stroke, lineWidth] of [['#77736b',.7],['#deddd6',.44],['#a7a49c',.16]]) {
        ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke();
      }
    }
    return canvas;
  }
  return { sources, collections, resolveCollection, lettering, roofEdits, deliveryDir, bounds, fit, uvFor, prepare, canvasFor };
});
