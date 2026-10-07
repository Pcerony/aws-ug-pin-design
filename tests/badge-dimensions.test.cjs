const test = require('node:test');
const assert = require('node:assert/strict');
const G = require('../assets/js/badge-dimensions-geometry.js');
test('side panels include symmetric triangular wings matching tilted wall planes', () => {
  for (const wallTilt of [0, 10, 30, 45]) {
    const p = { ...G.defaults, width: 80, wall: 40, rise: 40, inset: 12, wallTilt };
    const m = G.build(p), a = G.assembly(p), s = m.sideHeight * Math.sin(wallTilt * Math.PI / 180), shoulder = m.sideHeight * Math.cos(wallTilt * Math.PI / 180);
    assert.ok(Math.abs(m.badges[1].width - (p.depth + 2 * s)) < 1e-9);
    assert.equal(m.badges[1].bottom, p.depth);
    assert.deepEqual(m.badges[1].polygons, m.badges[3].polygons);
    assert.equal(m.badges[1].polygons[0].length, wallTilt === 0 ? 4 : 6);
    for (const part of a.parts.filter(p => ['3', '9'].includes(p.id))) {
      const bottom = part.vertices.filter(v => v[1] === 0);
      const zs = bottom.map(v => v[2]).sort((a,b)=>a-b);
      assert.ok(Math.abs(zs[0] + p.depth / 2) < 1e-9 && Math.abs(zs[1] - p.depth / 2) < 1e-9);
      assert.ok(Math.abs(Math.max(...part.vertices.map(v=>v[2])) - (p.depth/2+s)) < 1e-9);
      if (wallTilt > 0) for (const sign of [-1, 1]) {
        const tip = part.vertices.find(v => Math.abs(v[2] - sign * (p.depth / 2 + s)) < 1e-9);
        assert.ok(Math.abs(tip[1] - shoulder) < 1e-9);
        assert.ok(Math.abs(tip[2] - sign * (p.depth / 2 + tip[1] * Math.tan(wallTilt * Math.PI / 180))) < 1e-9);
      }
    }
    assert.equal((G.contourSvg(m.badges[1]).match(/<path/g)||[]).length,1);
  }
});
test('front/back and left/right share exact contours', () => {
  const m = G.build(G.defaults);
  assert.deepEqual(m.badges[0].polygons, m.badges[2].polygons);
  assert.deepEqual(m.badges[1].polygons, m.badges[3].polygons);
  assert.equal(m.badges[0].width, 50);
  assert.equal(m.badges[0].height, 80);
  assert.equal(m.badges[1].height, 50);
});
test('roof slope derives from the gable and panels meet at the connection region', () => {
  const p = { ...G.defaults, width: 40, rise: 15, depth: 32, gap: 3 };
  const m = G.build(p), roof = m.badges[4];
  assert.equal(m.roofPanel, 25);
  assert.equal(roof.width, 53);
  assert.equal(roof.height, 34);
  assert.equal(roof.polygons[1][0][0] - roof.polygons[0][1][0], 3);
  assert.equal(roof.polygons[0][0][1], roof.polygons[1][0][1]);
});
test('taper changes bottom edges, not wall top or roof slope', () => {
  const m = G.build({ ...G.defaults, taper: 3 });
  assert.equal(m.badges[0].bottom, 44);
  assert.equal(m.badges[1].bottom, 30);
  assert.equal(m.roofPanel, G.build(G.defaults).roofPanel);
});
test('side panels always stay rectangular and use the vertical wall height', () => {
  const p = { ...G.defaults, taper: 6, wall: 40, rise: 40, width: 80 };
  const m = G.build(p), side = m.badges[1];
  assert.deepEqual(side.polygons[0], [[0, 0], [30, 0], [30, 40], [0, 40]]);
  assert.equal(side.height, 40);
  assert.notEqual(side.height, Math.hypot(p.wall, p.taper));
  const a = G.assembly(p);
  for (const part of a.parts.filter(p => ['3', '9'].includes(p.id))) {
    assert.equal(new Set(part.vertices.map(v => v[0])).size, 1);
    assert.equal(Math.max(...part.vertices.map(v => v[1])), 40);
    assert.equal(Math.min(...part.vertices.map(v => v[1])), 0);
  }
  assert.equal(a.gaps.length, 4);
  assert.equal(G.assembly({ ...p, taper: 0 }).gaps.length, 0);
});
test('import uses validated parameters, ignores stale derived data and migrates old specs', () => {
  const old = { schema: 'aws-ug-badge-outline/v0.1', units: 'mm', parameters: { ...G.defaults, taper: 3 }, status: 'locked-draft', badges: [] };
  const state = G.importSpec(old);
  assert.equal(state.migrated, true);
  assert.equal(state.locked, false);
  assert.equal(G.build(state.params).badges[1].bottom, 30);
  assert.equal(G.importSpec({ ...old, schema: 'aws-ug-badge-outline/v0.2' }).locked, false);
  assert.equal(G.importSpec({ ...old, schema: 'aws-ug-badge-outline/v0.3' }).locked, false);
  assert.equal(G.importSpec({ ...old, schema: 'aws-ug-badge-outline/v0.4' }).locked, false);
  assert.equal(G.importSpec({ ...old, schema: 'aws-ug-badge-outline/v0.5' }).locked, false);
  assert.equal(G.importSpec({ ...old, schema: 'aws-ug-badge-outline/v0.6' }).locked, false);
  assert.equal(G.importSpec({ ...old, schema: 'aws-ug-badge-outline/v0.7' }).locked, false);
  assert.equal(G.importSpec({ ...old, schema: 'aws-ug-badge-outline/v0.8' }).locked, false);
  assert.equal(G.importSpec({ ...old, schema: 'aws-ug-badge-outline/v0.9' }).locked, false);
  assert.equal(G.importSpec({ ...old, schema: 'aws-ug-badge-outline/v0.10' }).locked, false);
  assert.equal(G.importSpec({ ...old, schema: 'aws-ug-badge-outline/v0.11' }).locked, false);
  assert.equal(G.importSpec({ ...old, schema: 'aws-ug-badge-outline/v0.12' }).locked, true);
  for (const bad of [{ ...old, units: 'cm' }, { ...old, schema: 'other' }, { ...old, parameters: {} }, null]) assert.throws(() => G.importSpec(bad));
});
test('roof front/back baseline follows the tilted gable apex plus projected thickness', () => {
  const p = { ...G.defaults, wallTilt: 20, frontThickness: 2, backThickness: 3, roofOverhangDepth: 4 };
  const a = p.wallTilt * Math.PI / 180, shift = (p.wall + p.rise) * Math.sin(a);
  const m = G.build(p), assembly = G.assembly(p);
  const front = assembly.parts.find(p => p.id === '1'), back = assembly.parts.find(p => p.id === '6');
  const roofs = assembly.parts.filter(p => p.id.startsWith('12'));
  const zs = roofs.flatMap(p => p.vertices.map(v => v[2]));
  assert.ok(Math.abs(m.roofBaseDepth - (p.depth + 2 * shift + 5 * Math.cos(a))) < 1e-9);
  assert.ok(Math.abs(Math.max(...zs) - (front.solid.vertices[5][2] + 4)) < 1e-9);
  assert.ok(Math.abs(Math.min(...zs) - (back.solid.vertices[5][2] - 4)) < 1e-9);
  assert.ok(Math.abs(m.roofDepth - (Math.max(...zs) - Math.min(...zs))) < 1e-9);
  assert.equal(m.badges[4].height, m.roofDepth);
});
test('front and back tilt symmetrically outward about their unchanged bottom edges', () => {
  for (const wallTilt of [0, 10, 22.5, 45]) {
    const p = { ...G.defaults, wallTilt, taper: 3, inset: 5 };
    const base = G.assembly({ ...p, wallTilt: 0 }), tilted = G.assembly(p);
    const a = wallTilt * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    assert.deepEqual(tilted.pivots, [{ id: '1', point: [20, 0, 15], axis: [1, 0, 0] }, { id: '6', point: [20, 0, -15], axis: [1, 0, 0] }]);
    assert.deepEqual(tilted.pivots, base.pivots);
    for (const index of [0, 2]) assert.deepEqual(G.build(p).badges[index], G.build({ ...p, wallTilt: 0 }).badges[index]);
    for (const id of ['1', '6']) {
      const sign = id === '1' ? 1 : -1, part = tilted.parts.find(p => p.id === id), before = base.parts.find(p => p.id === id);
      before.vertices.forEach(([x, y, z], i) => {
        assert.equal(part.vertices[i][0], x);
        assert.ok(Math.abs(part.vertices[i][1] - y * c) < 1e-9);
        assert.ok(Math.abs(part.vertices[i][2] - (z + sign * y * s)) < 1e-9);
        if (y === 0) assert.deepEqual(part.vertices[i], [x, y, z]);
      });
      assert.ok(Math.abs(part.extrusion[1] + p[id === '1' ? 'frontThickness' : 'backThickness'] * s) < 1e-9);
      assert.ok(Math.abs(part.outward[2] - sign * c) < 1e-9);
      assert.ok(Math.abs(Math.hypot(...part.extrusion) - p[id === '1' ? 'frontThickness' : 'backThickness']) < 1e-9);
      const edges = part.vertices[1].map((v, i) => v - part.vertices[0][i]);
      assert.ok(Math.abs(edges.reduce((n, v, i) => n + v * part.extrusion[i], 0)) < 1e-9);
    }
    assert.ok(Math.abs(G.build(p).gableVerticalHeight - (p.wall + p.rise) * c) < 1e-9);
    assert.ok(Math.abs(G.build(p).gableTopOffset - (p.wall + p.rise) * s) < 1e-9);
    const zs = tilted.parts.flatMap(p => p.solid.vertices.map(v => v[2]));
    assert.ok(Math.abs(G.build(p).overallDepth - (Math.max(...zs) - Math.min(...zs))) < 1e-9);
  }
  for (const wallTilt of [-1, 46, NaN]) assert.throws(() => G.build({ ...G.defaults, wallTilt }));
  const { wallTilt, ...legacy } = G.defaults;
  assert.equal(G.importSpec({schema:'aws-ug-badge-outline/v0.7',units:'mm',parameters:legacy}).params.wallTilt,0);
  assert.throws(() => G.importSpec({schema:'aws-ug-badge-outline/v0.8',units:'mm',parameters:legacy}));
});
test('independent roof extensions enlarge rectangular panels without changing walls or slope', () => {
  const p = { ...G.defaults, width: 40, wall: 50, rise: 15, depth: 32, gap: 3, frontThickness: 2, backThickness: 3, roofOverhangDepth: 4, roofOverhangSide: 6 };
  const m = G.build(p), base = G.build({ ...p, roofOverhangDepth: 0, roofOverhangSide: 0 });
  assert.equal(m.roofBasePanel, 25);
  assert.equal(m.roofPanel, 32.5);
  assert.equal(m.roofDepth, 45);
  assert.equal(m.roofSpan, 52);
  assert.equal(m.roofEaveHeight, 45.5);
  assert.equal(m.badges[4].width, 68);
  assert.equal(m.badges[4].height, 45);
  assert.equal(m.overallHeight, base.overallHeight);
  assert.equal(m.roofAngle, base.roofAngle);
  assert.deepEqual(m.badges.slice(0, 4), base.badges.slice(0, 4));
  const roofs = G.assembly(p).parts.filter(p => p.id.startsWith('12'));
  const coords = roofs.flatMap(p => p.vertices);
  assert.equal(Math.min(...coords.map(v => v[0])), -26);
  assert.equal(Math.max(...coords.map(v => v[0])), 26);
  assert.equal(Math.min(...coords.map(v => v[2])), -23);
  assert.equal(Math.max(...coords.map(v => v[2])), 22);
  for (const part of roofs) {
    const edgeA = part.vertices[1].map((v, i) => v - part.vertices[0][i]);
    const edgeB = part.vertices[3].map((v, i) => v - part.vertices[0][i]);
    assert.equal(Math.hypot(...edgeA), 32.5);
    assert.equal(Math.hypot(...edgeB), 45);
    assert.ok(Math.abs(edgeA.reduce((sum, v, i) => sum + v * part.extrusion[i], 0)) < 1e-9);
  }
  assert.equal(G.build({ ...p, roofOverhangSide: 0 }).roofDepth, 45);
  assert.equal(G.build({ ...p, roofOverhangDepth: 0 }).roofPanel, 32.5);
  for (const value of [-1, NaN, 51]) assert.throws(() => G.build({ ...p, roofOverhangSide: value }));
  const { roofOverhangDepth, roofOverhangSide, ...legacy } = p;
  const imported = G.importSpec({ schema: 'aws-ug-badge-outline/v0.6', units: 'mm', parameters: legacy, status: 'locked-draft' });
  assert.equal(imported.params.roofOverhangDepth, 0);
  assert.equal(imported.params.roofOverhangSide, 0);
  assert.equal(imported.locked, false);
  assert.throws(() => G.importSpec({ schema: 'aws-ug-badge-outline/v0.7', units: 'mm', parameters: legacy }));
});
test('five independent thicknesses extrude in the specified directions and extend roof depth', () => {
  const p = { ...G.defaults, width: 80, inset: 12, frontThickness: 2, backThickness: 3, leftThickness: 4, rightThickness: 5, roofThickness: 6 };
  const m = G.build(p), a = G.assembly(p);
  assert.equal(m.roofDepth, p.depth + 5);
  assert.equal(m.badges[4].height, p.depth + 5);
  assert.deepEqual(m.badges.map(b => b.thickness), [2, 4, 3, 5, 6]);
  const s = Math.hypot(p.width / 2, p.rise);
  for (const [id, delta] of [['1', [0, 0, 2]], ['6', [0, 0, -3]], ['3', [4, 0, 0]], ['9', [-5, 0, 0]], ['12L', [-p.rise / s * 6, p.width / 2 / s * 6, 0]], ['12R', [p.rise / s * 6, p.width / 2 / s * 6, 0]]]) {
    const part = a.parts.find(p => p.id === id);
    assert.deepEqual(part.extrusion, delta);
    assert.equal(part.solid.vertices.length, part.vertices.length * 2);
    assert.equal(part.solid.faces.length, part.vertices.length + 2);
    part.vertices.forEach((v, i) => assert.deepEqual(part.solid.vertices[i + part.vertices.length], v.map((n, j) => n + delta[j])));
    const edges = new Map();
    for (const face of part.solid.faces) face.forEach((v, i) => {
      const key = [v, face[(i + 1) % face.length]].sort((a, b) => a - b).join(',');
      edges.set(key, (edges.get(key) || 0) + 1);
    });
    assert.ok([...edges.values()].every(count => count === 2));
  }
  const roofZ = a.parts.filter(p => p.id.startsWith('12')).flatMap(p => p.vertices.map(v => v[2]));
  assert.equal(Math.max(...roofZ), p.depth / 2 + 2);
  assert.equal(Math.min(...roofZ), -p.depth / 2 - 3);
  assert.throws(() => G.build({ ...p, width: 20, inset: 8 }));
  assert.throws(() => G.build({ ...p, roofThickness: -1 }));
  const legacy = { ...p };
  for (const k of Object.keys(legacy).filter(k => k.endsWith('Thickness'))) delete legacy[k];
  assert.equal(G.importSpec({ schema: 'aws-ug-badge-outline/v0.4', units: 'mm', parameters: legacy }).params.frontThickness, 1);
  assert.throws(() => G.importSpec({ schema: 'aws-ug-badge-outline/v0.5', units: 'mm', parameters: legacy }));
  const nearCenter = G.importSpec({ schema: 'aws-ug-badge-outline/v0.4', units: 'mm', parameters: { ...legacy, width: 80, inset: 39.75 } });
  assert.equal(nearCenter.params.inset, 39.75);
  assert.equal(nearCenter.params.leftThickness, 0);
  assert.equal(nearCenter.params.rightThickness, 0);
  assert.equal(G.build({ ...p, frontThickness: 0, backThickness: 0 }).roofDepth, p.depth);
});
test('each folded roof half is a rectangular slab with perpendicular thickness', () => {
  for (const [width, rise, roofThickness] of [[80, 40, 6], [50, 30, 2.5], [150, 3, 20], [20, 100, 0]]) {
    const p = { ...G.defaults, width, rise, roofThickness };
    const m = G.build(p), roofs = G.assembly(p).parts.filter(p => p.id.startsWith('12'));
    const dot = (a, b) => a.reduce((sum, n, i) => sum + n * b[i], 0);
    for (const roof of roofs) {
      const edgeA = roof.vertices[1].map((v, i) => v - roof.vertices[0][i]);
      const edgeB = roof.vertices[3].map((v, i) => v - roof.vertices[0][i]);
      assert.ok(Math.abs(dot(edgeA, edgeB)) < 1e-9);
      assert.ok(Math.abs(dot(edgeA, roof.extrusion)) < 1e-9);
      assert.ok(Math.abs(dot(edgeB, roof.extrusion)) < 1e-9);
      assert.ok(Math.abs(Math.hypot(...roof.extrusion) - roofThickness) < 1e-9);
      assert.equal(roof.extrusion[2], 0);
    }
    const maxY = Math.max(...roofs.flatMap(p => p.solid.vertices.map(v => v[1])));
    assert.ok(Math.abs(maxY - m.overallHeight) < 1e-9);
    assert.ok(Math.abs(m.overallHeight - (p.wall + rise + roofThickness * width / 2 / Math.hypot(width / 2, rise))) < 1e-9);
    const svg = G.contourSvg(m.badges[4]);
    assert.equal((svg.match(/ Z/g) || []).length, 2);
  }
});
test('inset raises rectangular side panels until both top edges meet the roof', () => {
  const p = { ...G.defaults, width: 80, wall: 40, rise: 40, taper: 6, inset: 8 };
  const m = G.build(p);
  assert.equal(m.sideHeight, 48);
  assert.deepEqual(m.badges[1].polygons[0], [[0, 0], [30, 0], [30, 48], [0, 48]]);
  for (const index of [0, 2, 4]) assert.deepEqual(m.badges[index], G.build({ ...p, inset: 0 }).badges[index]);
  const a = G.assembly(p);
  assert.deepEqual(a.parts.find(p => p.id === '3').vertices.map(v => v[0]), [-32, -32, -32, -32]);
  assert.deepEqual(a.parts.find(p => p.id === '9').vertices.map(v => v[0]), [32, 32, 32, 32]);
  assert.equal(a.gaps.length, 0);
  for (const part of a.parts.filter(p => ['3', '9'].includes(p.id))) {
    assert.equal(Math.max(...part.vertices.map(v => v[1])), 48);
    for (const [x, y] of part.vertices.filter(v => v[1] > 0)) assert.equal(y, p.wall + p.rise * (1 - Math.abs(x) / (p.width / 2)));
  }
  assert.equal(G.assembly({ ...p, inset: 3 }).gaps.length, 4);
  assert.equal(G.build({ ...p, width: 60, rise: 30, wall: 50, inset: 12 }).sideHeight, 62);
  assert.throws(() => G.build({ ...p, inset: 40 }));
  const { inset, ...legacy } = p;
  const migrated = G.importSpec({ schema: 'aws-ug-badge-outline/v0.2', units: 'mm', parameters: legacy });
  assert.equal(migrated.params.inset, 0);
  assert.throws(() => G.importSpec({ schema: 'aws-ug-badge-outline/v0.3', units: 'mm', parameters: legacy }));
});
test('reject invalid or incomplete dimensions', () => {
  for (const width of [NaN, Infinity, -1, 151, '35']) assert.throws(() => G.build({ ...G.defaults, width }));
  assert.throws(() => G.build({}));
});
test('expanded dimensions accept tall gables and reject values beyond new limits', () => {
  const m = G.build({ ...G.defaults, width: 150, wall: 150, rise: 100, depth: 150, gap: 20 });
  assert.equal(m.badges[0].height, 250);
  assert.equal(m.badges[4].width, 270);
  assert.throws(() => G.build({ ...G.defaults, rise: 101 }));
  assert.throws(() => G.build({ ...G.defaults, wall: 151 }));
});
test('export dimensions use millimeters and closed vector paths', () => {
  for (const b of G.build(G.defaults).badges) {
    const svg = G.contourSvg(b);
    assert.match(svg, /width="[\d.]+mm" height="[\d.]+mm"/);
    assert.equal((svg.match(/<path /g) || []).length, b.id === '12' ? 2 : 1);
    assert.match(svg, / Z"/);
  }
});
