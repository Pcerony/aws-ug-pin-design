(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BadgeFactoryExport = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const collections = ['metal', 'puzzle', 'puzzleSpeaker', 'puzzleVolunteer'];
  const fmt = n => Number(n.toFixed(3)).toString();
  const font = 'system-ui, -apple-system, "PingFang SC", sans-serif';

  function filename(collection, dimensions) {
    if (!collections.includes(collection)) throw new Error('Unsupported export collection');
    return 'aws-ug-' + collection + '-136912-v012-' + (dimensions ? 'dimensions' : 'clean') + '.png';
  }

  function layout(spec, dimensions = true) {
    const scale = 12;
    const cells = [
      [160, 300, 1400], [1700, 300, 1400], [3240, 300, 1400],
      [560, 1690, 1400], [2320, 1690, 2160]
    ];
    const groups = ['1', '3', '6', '9', '12'].map((id, i) => {
      const badge = spec.badges.find(b => b.id === id);
      if (!badge || !Number.isFinite(badge.width) || !Number.isFinite(badge.height)) {
        throw new Error('Missing approved badge ' + id);
      }
      const [cellX, cellY, cellWidth] = cells[i];
      const width = badge.width * scale, height = badge.height * scale;
      const x = cellX + (cellWidth - width) / 2, y = cellY + 630 - height / 2;
      const surfaces = id === '12'
        ? [
          { id: '12L', x, y, width: badge.panel * scale, height },
          { id: '12R', x: x + (badge.panel + spec.parameters.gap) * scale, y, width: badge.panel * scale, height }
        ]
        : [{ id, x, y, width, height }];
      const annotations = dimensions ? [
        { kind: 'width', x, y: y - 65, length: width, text: (id === '12' ? '展开总宽 ' : '') + fmt(badge.width) + ' mm' },
        { kind: 'height', x: x + width + 65, y, length: height, text: fmt(badge.height) + ' mm' },
        { kind: 'thickness', x: x + width / 2, y: y + height + (id === '12' ? 140 : 85), text: '板厚 ' + fmt(badge.thickness) + ' mm（名义值）' },
        ...(id === '12' ? [{
          kind: 'roof', x: x + width / 2, y: y + height + 80,
          text: '每半片 ' + fmt(badge.panel) + ' × ' + fmt(badge.height) + ' mm · 连接区 ' + fmt(spec.parameters.gap) + ' mm（非实心板）'
        }] : [])
      ] : [];
      return { id, name: badge.name, labelX: cellX + cellWidth / 2, labelY: cellY + (i < 3 ? -10 : -70), x, y, width, height, surfaces, annotations };
    });
    return { width: 4800, height: 3200, scale, groups, ruler: dimensions ? { x: 160, y: 3050, length: 50 * scale, text: '50 mm 比例尺 · 缩放显示时以标注数值为准' } : null };
  }

  function text(ctx, value, x, y, size, align = 'left', color = '#30383b', weight = 400) {
    ctx.font = weight + ' ' + size + 'px ' + font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillText(value, x, y);
  }

  function dimension(ctx, annotation) {
    const vertical = annotation.kind === 'height';
    const { x, y, length } = annotation;
    ctx.save();
    ctx.translate(x, y);
    if (vertical) ctx.rotate(Math.PI / 2);
    ctx.strokeStyle = '#3b747b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -12); ctx.lineTo(0, 12);
    ctx.moveTo(length, -12); ctx.lineTo(length, 12);
    ctx.moveTo(0, 0); ctx.lineTo(length, 0);
    ctx.moveTo(18, -8); ctx.lineTo(0, 0); ctx.lineTo(18, 8);
    ctx.moveTo(length - 18, -8); ctx.lineTo(length, 0); ctx.lineTo(length - 18, 8);
    ctx.stroke();
    text(ctx, annotation.text, length / 2, -32, 38, 'center', '#3b747b');
    ctx.restore();
  }

  async function render(spec, collection, dimensions = true, artwork) {
    filename(collection, dimensions);
    const sheet = layout(spec, dimensions);
    // Wait for every approved surface before constructing a downloadable result.
    const surfaces = sheet.groups.flatMap(g => g.surfaces);
    const loaded = await Promise.all(surfaces.map(s => artwork.canvasFor(s.id, spec, collection)));
    if (typeof document !== 'undefined' && document.fonts) await document.fonts.ready;
    const canvas = document.createElement('canvas');
    canvas.width = sheet.width; canvas.height = sheet.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法创建导出画布');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const label = artwork.collections[collection].label;
    text(ctx, 'AWS UG · ' + label, 160, 115, 64, 'left', '#242728', 600);
    text(ctx, '1 / 3 / 6 / 9 / 12', 4640, 115, 44, 'right');
    text(ctx, 'V0.12 · 已确认外轮廓 · 五枚 / 六个板面', 160, 200, 38, 'left', '#677176');
    ctx.strokeStyle = '#dce0e1'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(160, 250); ctx.lineTo(4640, 250); ctx.stroke();
    let index = 0;
    for (const group of sheet.groups) {
      text(ctx, group.id + ' · ' + group.name, group.labelX, group.labelY, 46, 'center', '#30383b', 600);
      for (const surface of group.surfaces) {
        ctx.drawImage(loaded[index++], surface.x, surface.y, surface.width, surface.height);
      }
      for (const annotation of group.annotations) {
        if (['width', 'height'].includes(annotation.kind)) dimension(ctx, annotation);
        else text(ctx, annotation.text, annotation.x, annotation.y, 36, 'center', '#526b70');
      }
    }
    if (sheet.ruler) {
      const r = sheet.ruler;
      ctx.fillStyle = '#242728'; ctx.fillRect(r.x, r.y, r.length, 8);
      ctx.fillRect(r.x, r.y - 10, 3, 20); ctx.fillRect(r.x + r.length - 3, r.y - 10, 3, 20);
      text(ctx, r.text, r.x, r.y + 48, 32);
    }
    text(ctx, '工厂沟通参考 · 非量产工程图', 4640, 3080, 38, 'right', '#73513a', 600);
    text(ctx, '内场为位图；材料、浮雕、连接及公差待工厂确认。', 4640, 3140, 32, 'right', '#677176');
    return canvas;
  }

  function pngBlob(canvas) {
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG 编码失败')), 'image/png');
      } catch (error) {
        reject(new Error('无法保存图片，请从线上网站导出：' + error.message));
      }
    });
  }

  async function save(canvas, name) {
    const blob = await pngBlob(canvas), url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = name;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  function mount(spec, artwork) {
    const preview = document.getElementById('sheetPreview');
    if (!preview) return;
    const metal = document.getElementById('downloadMetal');
    const puzzle = document.getElementById('downloadPuzzle');
    const palette = document.getElementById('exportPalette');
    const dimensions = document.getElementById('exportDimensions');
    const status = document.getElementById('exportStatus');
    const error = document.getElementById('exportError');
    const tabs = [...document.querySelectorAll('[data-export-view]')];
    const controls = [metal, puzzle, palette, dimensions, ...tabs];
    let active = 'puzzle', current = null, currentKey = '', busy = false;
    async function refresh(style, download = false) {
      if (busy) return;
      busy = true; active = style;
      const collection = artwork.resolveCollection(style, palette.value);
      const annotate = dimensions.checked, key = collection + ':' + annotate;
      error.textContent = '';
      status.textContent = download ? '正在生成 PNG…' : '正在生成预览…';
      preview.setAttribute('aria-busy', 'true');
      controls.forEach(control => { control.disabled = true; });
      tabs.forEach(tab => tab.setAttribute('aria-pressed', String(tab.dataset.exportView === style)));
      try {
        if (!current || currentKey !== key) {
          current = await render(spec, collection, annotate, artwork);
          current.setAttribute('role', 'img');
          current.setAttribute('aria-label', artwork.collections[collection].label + '整套导出预览');
          preview.replaceChildren(current); currentKey = key;
        }
        if (download) await save(current, filename(collection, annotate));
        status.textContent = artwork.collections[collection].label + ' · 4800 × 3200 PNG' + (download ? ' · 已导出' : '');
      } catch (failure) {
        current = null; currentKey = '';
        preview.replaceChildren();
        error.textContent = '导出失败：' + failure.message + '。请重试。';
        status.textContent = '未生成文件';
      } finally {
        busy = false;
        preview.setAttribute('aria-busy', 'false');
        controls.forEach(control => { control.disabled = false; });
      }
    }
    metal.addEventListener('click', () => refresh('metal', true));
    puzzle.addEventListener('click', () => refresh('puzzle', true));
    palette.addEventListener('change', () => refresh(active));
    dimensions.addEventListener('change', () => refresh(active));
    tabs.forEach(tab => tab.addEventListener('click', () => refresh(tab.dataset.exportView)));
    refresh(active);
  }
  return { layout, filename, render, pngBlob, mount };
});
