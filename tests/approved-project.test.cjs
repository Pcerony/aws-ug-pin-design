const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {execFileSync}=require('node:child_process');
const G=require('../assets/js/badge-dimensions-geometry.js');
const root=path.resolve(__dirname,'..');
test('approved dimensions are the user supplied parameters, not workbench defaults',()=>{
  const spec=JSON.parse(fs.readFileSync(path.join(root,'specs/approved/house-v012.json'),'utf8'));
  assert.equal(spec.status,'locked-draft');
  assert.equal(spec.parameters.width,80); assert.equal(spec.parameters.wall,40);
  assert.equal(spec.parameters.rise,40); assert.equal(spec.parameters.depth,60);
  assert.equal(spec.parameters.wallTilt,5); assert.equal(spec.parameters.inset,12);
  assert.equal(spec.parameters.baseDepth,120);
  const m=G.build(G.importSpec(spec).params);
  assert.equal(m.badges[0].bottom,68); assert.equal(m.sideHeight,52);
  assert.ok(Math.abs(m.badges[4].panel-60.81118318204309)<1e-9);
});
test('artwork container keeps the approved SVG silhouette and refuses overwrites',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'badge-outline-'));
  const output=path.join(dir,'badge.svg');
  const args=['scripts/compose-badge.mjs','1','specs/approved/badge-1-reference.png',output];
  execFileSync(process.execPath,args,{cwd:root});
  const svg=fs.readFileSync(output,'utf8');
  assert.match(svg,/width="80mm" height="80mm"/);
  assert.match(svg,/M40,0 L80,40 L74,80 L6,80 L0,40 Z/);
  assert.match(svg,/clip-path="url\(#approved\)"/);
  assert.match(svg,/preserveAspectRatio="xMidYMid slice"/);
  assert.throws(()=>execFileSync(process.execPath,args,{cwd:root,stdio:'pipe'}));
  assert.equal(fs.readFileSync(output,'utf8'),svg);
  fs.rmSync(dir,{recursive:true});
});
test('handoff assets include all five schemes and each exact contour',()=>{
  for(const file of ['01-diecut.png','02-ribbon.png','03-modular.png','04-orbit.png','05-mosaic.png']) assert.ok(fs.statSync(path.join(root,'designs/number-one/2026-10-07',file)).size>1000);
  for(const id of ['1','3','6','9','12']) assert.match(fs.readFileSync(path.join(root,`specs/approved/badge-${id}.svg`),'utf8'),/mm/);
  const guide=fs.readFileSync(path.join(root,'项目核心规范与Agent协作指南.md'),'utf8');
  assert.match(guide,/house-v012.json/); assert.match(guide,/2.*5/); assert.match(guide,/不能.*保证/);
});
