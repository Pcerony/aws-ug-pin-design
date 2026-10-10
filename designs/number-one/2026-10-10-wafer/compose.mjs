import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '../../..');
const spec = JSON.parse(fs.readFileSync(path.join(root, 'specs/approved/house-v012.json'), 'utf8'));
const badge = spec.badges.find(item => item.id === '1');
if (badge.width !== 80 || badge.height !== 80) throw new Error('Recheck fitting for changed approval');
const d = badge.polygons.map(points => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ') + ' Z').join(' ');

// Enlarge uniformly, anchored at the bottom, to exclude the approximate AI rim.
const scale = 1.12;
const width = badge.width * scale;
const height = badge.height * scale;
const x = (badge.width - width) / 2;
const y = badge.height - height;
const names = process.argv.slice(2);
for (const name of names.length ? names : ['gold', 'silver', 'glass']) {
  if (!['gold', 'silver', 'glass', 'glass-coarse'].includes(name)) throw new Error('Unknown study');
  const bytes = fs.readFileSync(path.join(dir, `raw-${name}.png`));
  if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    throw new Error('Expected PNG source');
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80mm" height="80mm" viewBox="0 0 80 80">
<title>Wafer ${name}; approved V0.12 contour; visual candidate, not manufacturing artwork</title>
<defs><clipPath id="approved"><path d="${d}"/></clipPath></defs>
<g clip-path="url(#approved)">
<path d="${d}" fill="#151719"/>
<image x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" href="data:image/png;base64,${bytes.toString('base64')}"/>
<path d="${d}" fill="none" stroke="#252729" stroke-width="0.5" stroke-linejoin="miter"/>
</g></svg>\n`;
  fs.writeFileSync(path.join(dir, `badge-1-${name}-fitted.svg`), svg);
  console.log(`${name}: 80 x 80 mm approved contour, uniform ${scale} fitting`);
}
