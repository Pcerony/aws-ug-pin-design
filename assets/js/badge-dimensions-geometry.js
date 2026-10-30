(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BadgeDimensions = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const defaults = { width: 50, wall: 50, rise: 30, depth: 30, taper: 0, gap: 2, inset: 0, frontThickness: 1, backThickness: 1, leftThickness: 1, rightThickness: 1, roofThickness: 1, roofOverhangDepth: 0, roofOverhangSide: 0, wallTilt: 0 };
  const limits = { width: [20, 150], wall: [15, 150], rise: [3, 100], depth: [20, 150], taper: [0, 6], gap: [0, 20], inset: [0, 70], frontThickness: [0, 20], backThickness: [0, 20], leftThickness: [0, 20], rightThickness: [0, 20], roofThickness: [0, 20], roofOverhangDepth: [0, 50], roofOverhangSide: [0, 50], wallTilt: [0, 45] };
  const round = n => Math.round(n * 1000) / 1000;
  Object.assign(defaults, { baseWidth: 100, baseDepth: 80, baseThickness: 4, baseFloor: 1.5, baseClearance: .25, baseLayerThickness: 1.1, baseFrontExtension: 0 });
  Object.assign(limits, { baseWidth: [20, 400], baseDepth: [20, 400], baseThickness: [.5, 40], baseFloor: [.5, 20], baseClearance: [0, 3], baseLayerThickness: [.1, 12], baseFrontExtension: [0, 150] });
  const fmt = n => Number(n.toFixed(2)).toString();
  defaults.baseSolidThickness=5.5;
  limits.baseSolidThickness=[.5,40];
  limits.taper[1]=30;
  function validate(p) {
    return !!p && Object.keys(defaults).every(k => typeof p[k] === 'number' && Number.isFinite(p[k]) && p[k] >= limits[k][0] && p[k] <= limits[k][1]) && p.taper < p.width / 2 && p.inset < p.width / 2 && p.leftThickness + p.rightThickness < p.width - 2 * p.inset;
  }
  function build(p) {
    if (!validate(p)) throw new Error('Invalid badge dimensions');
    const { width: w, wall: h, rise: r, depth: d, taper: t, gap: g } = p;
    const baseSlope = Math.hypot(w / 2, r);
    const slope = baseSlope * (1 + 2 * p.roofOverhangSide / w);
    const gable = [[w / 2, 0], [w, r], [w - t, h + r], [t, h + r], [0, r]];
    const sideHeight = h + 2 * r * p.inset / w;
    const sideWingDepth = sideHeight * Math.sin(p.wallTilt * Math.PI / 180);
    const sideShoulderHeight = sideHeight * Math.cos(p.wallTilt * Math.PI / 180);
    const sideWidth = d + 2 * sideWingDepth;
    const side = p.wallTilt === 0 ? [[0, 0], [d, 0], [d, sideHeight], [0, sideHeight]] : [[sideWingDepth, 0], [sideWingDepth + d, 0], [sideWidth, sideHeight - sideShoulderHeight], [sideWingDepth + d, sideHeight], [sideWingDepth, sideHeight], [0, sideHeight - sideShoulderHeight]];
    const tilt = p.wallTilt * Math.PI / 180, topOffset = (h + r) * Math.sin(tilt);
    const roofBaseDepth = d + 2 * topOffset + (p.frontThickness + p.backThickness) * Math.cos(tilt);
    const roofDepth = roofBaseDepth + 2 * p.roofOverhangDepth;
    const overallDepth = roofDepth;
    const roof = [[[0, 0], [slope, 0], [slope, roofDepth], [0, roofDepth]], [[slope + g, 0], [2 * slope + g, 0], [2 * slope + g, roofDepth], [slope + g, roofDepth]]];
    return {
      roofBaseDepth, overallDepth, gableVerticalHeight: (h + r) * Math.cos(tilt), gableTopOffset: topOffset, sideHeight, roofDepth, roofSpan: w + 2 * p.roofOverhangSide, roofEaveHeight: h - 2 * r * p.roofOverhangSide / w, roofBasePanel: baseSlope, overallHeight: h + r + p.roofThickness * (w / 2 / baseSlope), roofPanel: round(slope), roofAngle: round(Math.atan2(r, w / 2) * 180 / Math.PI),
      badges: [
        { id: '1', name: '正面山墙', width: w, height: h + r, bottom: w - 2 * t, thickness: p.frontThickness, polygons: [gable], type: 'gable' },
        { id: '3', name: '左侧墙面', width: sideWidth, height: sideHeight, bottom: d, wing: sideWingDepth, thickness: p.leftThickness, polygons: [side], type: 'side' },
        { id: '6', name: '背面山墙', width: w, height: h + r, bottom: w - 2 * t, thickness: p.backThickness, polygons: [gable], type: 'gable' },
        { id: '9', name: '右侧墙面', width: sideWidth, height: sideHeight, bottom: d, wing: sideWingDepth, thickness: p.rightThickness, polygons: [side], type: 'side' },
        { id: '12', name: '双片屋顶 · 展开', width: 2 * slope + g, height: roofDepth, panel: slope, thickness: p.roofThickness, polygons: roof, type: 'roof' }
      ]
    };
  }
  function path(points) { return points.map((p, i) => `${i ? 'L' : 'M'}${fmt(p[0])},${fmt(p[1])}`).join(' ') + ' Z'; }
  function contourSvg(b) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${fmt(b.width)}mm" height="${fmt(b.height)}mm" viewBox="0 0 ${fmt(b.width)} ${fmt(b.height)}"><title>Badge ${b.id} outer contour, millimeters</title>${b.polygons.map(p => `<path d="${path(p)}" fill="none" stroke="#000" stroke-width="0.1"/>`).join('')}</svg>`;
  }
  function importSpec(spec) {
    if (!spec || !/^aws-ug-badge-outline\/v0\.(?:[1-9]|10|11|12)$/.test(spec.schema)) throw new Error('规格版本不支持，请选择本工作台导出的JSON。');
    if (spec.units !== 'mm') throw new Error('规格单位必须为mm。');
    const version = Number(spec.schema.split('.').pop());
    const migrated = version !== 12;
    const thicknessDefaults = Object.fromEntries(Object.entries(defaults).filter(([k]) => k.endsWith('Thickness')));
    let source = version >= 5 ? spec.parameters : { ...thicknessDefaults, ...spec.parameters };
    if (version < 7) source = { roofOverhangDepth: 0, roofOverhangSide: 0, ...source };
    if (version < 8) source = { wallTilt: 0, ...source };
    if (version < 11) source = { ...Object.fromEntries(Object.entries(defaults).filter(([k]) => k.startsWith('base'))), ...source };
    if (version < 12 && source) source = { ...source, baseLayerThickness: (source.baseThickness + source.baseFloor) / 5 };
    if (['aws-ug-badge-outline/v0.1', 'aws-ug-badge-outline/v0.2'].includes(spec.schema)) source = { inset: 0, ...source };
    // Legacy drafts near the center may not have room for the new default thickness.
    if (migrated && source && source.leftThickness + source.rightThickness >= source.width - 2 * source.inset && !Object.keys(spec.parameters || {}).some(k => k.endsWith('Thickness'))) source = { ...source, leftThickness: 0, rightThickness: 0 };
    source = {baseFrontExtension: 0, ...source};
    if(source.baseSolidThickness===undefined) source.baseSolidThickness=source.baseLayerThickness*5;
    if (!validate(source)) throw new Error('参数缺失或超出范围；内凹及左右厚度须保留正的内部净宽。');
    const params = Object.fromEntries(Object.keys(defaults).map(k => [k, source[k]]));
    return { params, locked: !migrated && spec.status === 'locked-draft', migrated };
  }
  function solid(vertices, extrusion) {
    const n = vertices.length;
    return {
      vertices: [...vertices.map(v => [...v]), ...vertices.map(v => v.map((x, j) => x + extrusion[j]))],
      faces: [Array.from({ length: n }, (_, i) => n - 1 - i), Array.from({ length: n }, (_, i) => n + i), ...vertices.map((_, i) => [i, (i + 1) % n, (i + 1) % n + n, i + n])]
    };
  }
  // Side panels stay in vertical planes even when the gable outline is tapered.
  function assembly(p) {
    const m = build(p), { width: w, wall: h, rise: r, depth: d, taper: t, inset: i } = p;
    const sideX = w / 2 - i;
    const sideH = m.sideHeight;
    const pivots = [{ id: '1', point: [sideX, 0, d / 2], axis: [1, 0, 0] }, { id: '6', point: [sideX, 0, -d / 2], axis: [1, 0, 0] }];
    const tilt = p.wallTilt * Math.PI / 180;
    const roofFront = d / 2 + m.gableTopOffset + p.frontThickness * Math.cos(tilt) + p.roofOverhangDepth, roofBack = -d / 2 - m.gableTopOffset - p.backThickness * Math.cos(tilt) - p.roofOverhangDepth;
    const eaveX = m.roofSpan / 2, eaveY = m.roofEaveHeight;
    const slope = Math.hypot(r, w / 2), roofX = r / slope * p.roofThickness, roofY = w / 2 / slope * p.roofThickness;
    const extrusion = { '1': [0, 0, p.frontThickness], '6': [0, 0, -p.backThickness], '3': [p.leftThickness, 0, 0], '9': [-p.rightThickness, 0, 0], '12L': [-roofX, roofY, 0], '12R': [roofX, roofY, 0] };
    const front = m.badges[0].polygons[0].map(([x, y]) => [x - w / 2, h + r - y, d / 2]);
    const back = front.map(([x, y]) => [x, y, -d / 2]);
    return {
      pivots,
      parts: [
        { id: '1', color: '#ed874d', vertices: front, outward: [0, 0, 1] },
        { id: '6', color: '#ed874d', vertices: back, outward: [0, 0, -1] },
        { id: '3', color: '#71b6b1', vertices: m.badges[1].polygons[0].map(([z, y]) => [-sideX, sideH - y, z - m.badges[1].width / 2]), outward: [-1, 0, 0] },
        { id: '9', color: '#71b6b1', vertices: m.badges[3].polygons[0].map(([z, y]) => [sideX, sideH - y, z - m.badges[3].width / 2]), outward: [1, 0, 0] },
        { id: '12L', color: '#ded3ae', vertices: [[-eaveX, eaveY, roofBack], [0, h + r, roofBack], [0, h + r, roofFront], [-eaveX, eaveY, roofFront]], outward: [-r / Math.hypot(r, w / 2), w / 2 / Math.hypot(r, w / 2), 0] },
        { id: '12R', color: '#ded3ae', vertices: [[0, h + r, roofBack], [eaveX, eaveY, roofBack], [eaveX, eaveY, roofFront], [0, h + r, roofFront]], outward: [r / Math.hypot(r, w / 2), w / 2 / Math.hypot(r, w / 2), 0] }
      ].map(part => {
        let delta = extrusion[part.id];
        if (p.wallTilt > 0 && ['1', '6'].includes(part.id)) {
          const sign = part.id === '1' ? 1 : -1, angle = p.wallTilt * Math.PI / 180;
          const c = Math.cos(angle), s = Math.sin(angle);
          const baseline = part.vertices;
          const pivot = pivots.find(p => p.id === part.id).point;
          part = { ...part, baseline, vertices: baseline.map(([x, y, z]) => [x, pivot[1] + (y - pivot[1]) * c, pivot[2] + (z - pivot[2]) + sign * (y - pivot[1]) * s]), outward: [0, -s, sign * c] };
          const thickness = part.id === '1' ? p.frontThickness : p.backThickness;
          delta = [0, -thickness * s, sign * thickness * c];
        }
        return { ...part, extrusion: delta, solid: solid(part.vertices, delta) };
      }),
      // Old coplanar taper diagnostics do not describe the rotated wall seams.
      gaps: p.wallTilt > 0 || i >= t ? [] : [-1, 1].flatMap(z => [-1, 1].map(x => [[x * sideX, 0, z * d / 2], [x * sideX, h * (1 - i / t), z * d / 2], [x * (w / 2 - t), 0, z * d / 2]]))
    };
  }
  return { defaults, limits, validate, build, path, fmt, contourSvg, importSpec, assembly };
});
