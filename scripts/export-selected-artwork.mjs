import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url), A = require('../assets/js/badge-artwork.js');
const spec = JSON.parse(fs.readFileSync(path.join(root, 'specs/approved/house-v012.json'), 'utf8'));
const out = path.join(root, A.deliveryDir);
fs.mkdirSync(out, {recursive: true});
const sessionFlag = process.argv.indexOf('--png-session');
if (sessionFlag !== -1) {
  const session = process.argv[sessionFlag + 1];
  if (!session) throw new Error('Provide an existing Playwright session with the workbench loaded.');
  const cli = path.join(process.env.HOME, '.codex/skills/playwright/scripts/playwright_cli.sh');
  const expression = 'async () => {const out={};for(const id of Object.keys(BadgeArtwork.sources))out[id]=(await BadgeArtwork.canvasFor(id,BadgeApprovedSpec)).toDataURL("image/png");return out}';
  const raw = execFileSync(cli, [`-s=${session}`, 'eval', expression, '--raw'], {encoding:'utf8',maxBuffer:32*1024*1024});
  for (const [id,data] of Object.entries(JSON.parse(raw))) {
    if (!A.sources[id] || !data.startsWith('data:image/png;base64,')) throw new Error('Invalid texture export');
    fs.writeFileSync(path.join(out, `badge-${id}-texture.png`), Buffer.from(data.split(',')[1], 'base64'));
  }
}
const trace = points => points.map(([x,y],i) => `${i?'L':'M'}${x},${y}`).join(' ') + ' Z';
const records = [];
for (const [id,source] of Object.entries(A.sources)) {
  const half = id.startsWith('12'), b = spec.badges.find(b => b.id === (half?'12':id));
  const width = half?b.panel:b.width, height = b.height, d = trace(b.polygons[0]);
  const texturePath = path.join(out, `badge-${id}-texture.png`);
  if (!fs.existsSync(texturePath)) throw new Error('Export PNGs first with --png-session <session>.');
  const png = fs.readFileSync(texturePath);
  if (png.readUInt32BE(16)!==Math.ceil(width*16)||png.readUInt32BE(20)!==Math.ceil(height*16)) throw new Error('Texture dimensions do not match the approved surface.');
  const filename = `badge-${id}-fitted.svg`;
  const content = `<defs><clipPath id="approved"><path d="${d}"/></clipPath></defs><g clip-path="url(#approved)"><image width="${width}" height="${height}" href="data:image/png;base64,${png.toString('base64')}"/></g>`;
  fs.writeFileSync(path.join(out,filename), `<svg xmlns="http://www.w3.org/2000/svg" width="${width}mm" height="${height}mm" viewBox="0 0 ${width} ${height}"><title>Badge ${id}; approved V0.12 boundary; house mascot; ${half?'orange':'ivory'} raised lettering; not production-ready</title>${content}</svg>\n`);
  records.push({id,source:source.src,sourcePolygon:source.polygon,width,height,fit:A.fit(source,width,height),svg:filename,lettering:half?'orange':'ivory'});
}
const roof = spec.badges.find(b=>b.id==='12');
const halves = ['12L','12R'].map(id => fs.readFileSync(path.join(out,`badge-${id}-fitted.svg`)).toString('base64'));
fs.writeFileSync(path.join(out,'badge-12-fitted.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="${roof.width}mm" height="${roof.height}mm" viewBox="0 0 ${roof.width} ${roof.height}"><title>Single unfolded roof badge 12; ivory lettering; two approved rectangles</title><image width="${roof.panel}" height="${roof.height}" href="data:image/svg+xml;base64,${halves[0]}"/><image x="${roof.panel+spec.parameters.gap}" width="${roof.panel}" height="${roof.height}" href="data:image/svg+xml;base64,${halves[1]}"/></svg>\n`);
fs.writeFileSync(path.join(out,'manifest.json'), JSON.stringify({date:'2026-10-08',status:'mascot-selected-3d-review',outline:'specs/approved/house-v012.json',productionReady:false,surfaces:records},null,2)+'\n');
console.log('Exported six PNG-backed fixed-boundary SVG surfaces and one unfolded roof. Originals preserved.');
