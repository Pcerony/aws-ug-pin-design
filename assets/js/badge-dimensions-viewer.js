(function () {
  'use strict';
  class OutlineViewer {
    constructor(host) {
      this.host = host;
      const T = window.THREE;
      if (!T || !T.OrbitControls) throw new Error('3D资源未加载完成。');
      this.renderer = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      this.renderer.setClearColor('#f5f7f7');
      this.renderer.outputEncoding = T.sRGBEncoding;
      this.renderer.domElement.setAttribute('aria-label', '徽章组合3D预览');
      this.renderer.domElement.setAttribute('role', 'img');
      host.appendChild(this.renderer.domElement);
      this.scene = new T.Scene();
      this.camera = new T.PerspectiveCamera(38, 1, .1, 10000);
      this.controls = new T.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.autoRotateSpeed = 1;
      this.controls.maxPolarAngle = Math.PI * .92;
      this.scene.add(new T.HemisphereLight(0xffffff, 0x758284, 1));
      const light = new T.DirectionalLight(0xffffff, .7);
      light.position.set(100, 200, 150);
      this.scene.add(light);
      this.root = new T.Group();
      this.scene.add(this.root);
      this.artworkCanvases = {};
      this.artworkLoadToken = 0;
      this.artworkCache = new Map();
      this.base = new T.Group();
      this.scene.add(this.base);
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(host);
      this.renderer.domElement.addEventListener('webglcontextlost', e => {
        e.preventDefault();
        document.getElementById('viewerError').textContent = '3D渲染中断，请刷新页面。';
      });
      this.visible = true;
      let pointerStart = null;
      this.renderer.domElement.addEventListener('pointerdown', e => { pointerStart = [e.clientX, e.clientY]; });
      this.renderer.domElement.addEventListener('pointerup', e => {
        if (!pointerStart || Math.hypot(e.clientX - pointerStart[0], e.clientY - pointerStart[1]) > 5) return;
        pointerStart = null;
        const bounds = this.renderer.domElement.getBoundingClientRect();
        const ray = new T.Raycaster();
        ray.setFromCamera(new T.Vector2((e.clientX - bounds.left) / bounds.width * 2 - 1, 1 - (e.clientY - bounds.top) / bounds.height * 2), this.camera);
        const hit = ray.intersectObjects(this.root.children, true).find(hit => hit.object.userData.badgeId);
        if (hit && this.onSelect) this.onSelect(hit.object.userData.badgeId);
      });
      this.renderer.domElement.addEventListener('pointercancel', () => { pointerStart = null; });
      this.tick = () => {
        this.frame = requestAnimationFrame(this.tick);
        if (!this.visible || !host.clientWidth || !host.clientHeight) return;
        this.controls.update();
        this.root.traverse(object => {
          if (object.isSprite && object.userData.normal) {
            const normal = new T.Vector3(...object.userData.normal);
            const towardCamera = this.camera.position.clone().sub(object.getWorldPosition(new T.Vector3()));
            object.visible = normal.dot(towardCamera) > 0;
          }
        });
        this.renderer.render(this.scene, this.camera);
      };
      this.tick();
    }
    async loadArtwork(collection) {
      this.artworkCollection = collection;
      this.artworkReady = false;
      this.host.dataset.artworkCollection = collection;
      delete this.host.dataset.artworkError;
      const token = ++this.artworkLoadToken;
      try {
        if (!this.artworkCache.has(collection)) {
          const loading = Promise.all(Object.keys(BadgeArtwork.collections[collection].sources).map(async id =>
            [id, await BadgeArtwork.canvasFor(id, BadgeApprovedSpec, collection)]
          )).then(Object.fromEntries);
          this.artworkCache.set(collection, loading);
          loading.catch(() => this.artworkCache.delete(collection));
        }
        const canvases = await this.artworkCache.get(collection);
        if (token !== this.artworkLoadToken) return;
        this.artworkCanvases = canvases;
        this.artworkReady = true;
        if (this.params) this.update(this.params, this.options);
      } catch (error) {
        if (token !== this.artworkLoadToken) return;
        this.host.dataset.artworkError = error.message;
        document.getElementById('viewerError').textContent = error.message;
        document.getElementById('artworkStatus').textContent = '贴图加载失败';
      }
    }
    resize() {
      const w = this.host.clientWidth, h = this.host.clientHeight;
      if (!w || !h) return;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      if (this.params) this.fit(false);
    }
    clear(group) {
      group.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const list = Array.isArray(object.material) ? object.material : [object.material];
          for (const material of list) { if (material.map) material.map.dispose(); material.dispose(); }
        }
      });
      while (group.children.length) group.remove(group.children[0]);
    }
    face(vertices, color, opacity = 1) {
      const T = window.THREE, geometry = new T.BufferGeometry(), triangles = [];
      for (let i = 1; i < vertices.length - 1; i++) triangles.push(...vertices[0], ...vertices[i], ...vertices[i + 1]);
      geometry.setAttribute('position', new T.Float32BufferAttribute(triangles, 3));
      geometry.computeVertexNormals();
      return new T.Mesh(geometry, new T.MeshStandardMaterial({ color, side: T.DoubleSide, roughness: .8, metalness: 0, transparent: opacity < 1, opacity }));
    }
    panel(part) {
      if (part.extrusion.every(n => n === 0)) return this.face(part.vertices, part.color);
      const T = window.THREE, triangles = [], geometry = new T.BufferGeometry();
      for (const face of part.solid.faces) {
        for (let i = 1; i < face.length - 1; i++) triangles.push(...part.solid.vertices[face[0]], ...part.solid.vertices[face[i]], ...part.solid.vertices[face[i + 1]]);
      }
      geometry.setAttribute('position', new T.Float32BufferAttribute(triangles, 3));
      geometry.computeVertexNormals();
      return new T.Mesh(geometry, new T.MeshStandardMaterial({ color: part.color, side: T.DoubleSide, roughness: .65, metalness: .08 }));
    }
    label(text, vertices, normal, size) {
      const T = window.THREE, canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = 128;
      const context = canvas.getContext('2d');
      context.fillStyle = '#263436'; context.font = '600 70px system-ui';
      context.textAlign = 'center'; context.textBaseline = 'middle';
      context.fillText(text, 128, 64);
      const texture = new T.CanvasTexture(canvas);
      const sprite = new T.Sprite(new T.SpriteMaterial({ map: texture, depthTest: false, depthWrite: false }));
      sprite.renderOrder = 4;
      sprite.userData.normal = normal;
      const center = vertices.reduce((v, a) => v.add(new T.Vector3(...a)), new T.Vector3()).divideScalar(vertices.length);
      sprite.position.copy(center).add(new T.Vector3(...normal).multiplyScalar(.7));
      sprite.scale.set(size * 1.4, size * .7, 1);
      return sprite;
    }
    artwork(part, model) {
      const T = window.THREE, canvas = this.artworkCanvases[part.id];
      if (!canvas) return null;
      const uv = BadgeArtwork.uvFor(part, model), positions = [], coords = [];
      const surface = ['3', '9'].includes(part.id) ? part.vertices : part.solid.vertices.slice(part.vertices.length);
      for (let i = 1; i < surface.length - 1; i++) for (const index of [0, i, i + 1]) {
        positions.push(...surface[index].map((v, j) => v + part.outward[j] * .025));
        coords.push(...uv[index]);
      }
      const geometry = new T.BufferGeometry();
      geometry.setAttribute('position', new T.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('uv', new T.Float32BufferAttribute(coords, 2));
      geometry.computeVertexNormals();
      const texture = new T.CanvasTexture(canvas);
      texture.encoding = T.sRGBEncoding;
      texture.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
      const mesh = new T.Mesh(geometry, new T.MeshBasicMaterial({ map: texture, side: T.DoubleSide, toneMapped: false }));
      mesh.name = 'artwork-' + part.id;
      mesh.userData.badgeId = part.id.startsWith('12') ? '12' : part.id;
      return mesh;
    }
    update(params, options) {
      this.params = { ...params }; this.options = options;
      const collection = options.collection || 'metal';
      if (window.BadgeArtwork && window.BadgeApprovedSpec && collection !== this.artworkCollection) this.loadArtwork(collection);
      const T = window.THREE, model = BadgeDimensions.assembly(params), separation = options.separation;
      const textured = options.artwork && this.artworkReady;
      let artworkCount = 0;
      this.clear(this.root); this.clear(this.base);
      const max = Math.max(params.width, params.depth, params.wall + params.rise), labelSize = max / 7;
      for (const part of model.parts) {
        if (options.house === false) continue;
        if (part.id.startsWith('12') && !options.roof) continue;
        const group = new T.Group();
        const mesh = this.panel(part);
        if (textured) {
          mesh.material.color.set('#b8b5ab');
          const puzzle = window.BadgeArtwork.collections[collection]?.kind === 'puzzle';
          mesh.material.metalness = puzzle ? .12 : .45;
          mesh.material.roughness = puzzle ? .7 : .35;
          const artwork = this.artwork(part, BadgeDimensions.build(params));
          if (artwork) { group.add(artwork); artworkCount++; }
        }
        mesh.userData.badgeId = part.id.startsWith('12') ? '12' : part.id;
        if (mesh.userData.badgeId === options.selected) mesh.material.emissive.setHex(0x284643);
        group.add(mesh);
        group.add(new T.LineSegments(new T.EdgesGeometry(mesh.geometry), new T.LineBasicMaterial({ color: '#394e51' })));
        if (part.baseline && !textured) {
          const points = [...part.baseline, part.baseline[0]].map(v => new T.Vector3(...v));
          const guide = new T.Line(new T.BufferGeometry().setFromPoints(points), new T.LineDashedMaterial({ color: '#bc5145', dashSize: 1.4, gapSize: .9 }));
          guide.computeLineDistances();
          group.add(guide);
        }
        const labelVertices = ['3', '9'].includes(part.id) ? part.vertices : part.solid.vertices.slice(part.vertices.length);
        if (options.labels) group.add(this.label(part.id, labelVertices, part.outward, labelSize));
        group.position.set(...part.outward).multiplyScalar(separation);
        group.position.y += options.lift || 0;
        this.root.add(group);
      }
      if (!separation && options.house !== false) for (const vertices of model.gaps) {
        const gap = this.face(vertices, '#e84637', .85);
        gap.position.z += Math.sign(vertices[0][2]) * .1;
        gap.position.y += options.lift || 0;
        this.root.add(gap);
      }
      if (!textured && !separation && options.house !== false) for (const pivot of model.pivots) {
        const marker = new T.Mesh(new T.SphereGeometry(max * .012, 12, 8), new T.MeshBasicMaterial({ color: '#dc302d' }));
        marker.position.set(...pivot.point);
        marker.position.y += options.lift || 0;
        marker.name = `wall-pivot-${pivot.id}`;
        this.root.add(marker);
      }
      const plinth = BadgeBase.build(params);
      if (options.base !== false) for (const [i,layer] of plinth.layers.entries()) {
        const triangles = [], geometry = new T.BufferGeometry();
        for (const face of layer.polygons) for (let k=1;k<face.length-1;k++) triangles.push(...face[0],...face[k],...face[k+1]);
        geometry.setAttribute('position',new T.Float32BufferAttribute(triangles,3));
        geometry.computeVertexNormals();
        const mesh = new T.Mesh(geometry,new T.MeshStandardMaterial({color:'#7c9274',side:T.DoubleSide,roughness:.85}));
        mesh.name=layer.id; mesh.userData.badgeId='base';
        if (options.selected==='base') mesh.material.emissive.setHex(0x081008);
        const group=new T.Group(); group.name=`cardboard-layer-${i+1}`;
        group.position.y=layer.offset-(plinth.layerCount-1-i)*separation;
        group.add(mesh);
        group.add(new T.LineSegments(new T.EdgesGeometry(geometry),new T.LineBasicMaterial({color:'#52654e'})));
        this.root.add(group);
      }
      const grid = new T.GridHelper(Math.max(max, params.baseWidth, params.baseDepth) * 3 + separation * 4, 20, '#b3c2c4', '#e0e6e6');
      grid.position.y = plinth.bottom - (options.base !== false ? (plinth.layerCount-1)*separation : 0) - .2;
      this.base.add(grid);
      // Side height follows the roof intersection, not the tapered gable edge.
      const x = params.width / 2 - params.inset + separation + max * .07, z = params.depth / 2;
      const sideH = BadgeDimensions.build(params).sideHeight;
      const line = new T.BufferGeometry().setFromPoints([new T.Vector3(x, 0, z), new T.Vector3(x, sideH, z)]);
      if (options.house !== false && options.labels) {
        const measure = new T.Group();
        measure.add(new T.Line(line, new T.LineBasicMaterial({ color: '#dc302d' })));
        measure.add(this.label(`Hs ${BadgeDimensions.fmt(sideH)}`, [[x + max * .06, sideH / 2, z]], [0, 0, 1], labelSize));
        measure.position.y=options.lift||0;
        this.root.add(measure);
      }
      this.controls.autoRotate = options.rotate;
      this.resize();
      this.fit(!this.initialized);
      this.initialized = true;
      this.host.dataset.ready = 'true';
      this.host.dataset.artworkCount = String(artworkCount);
      const artworkStatus = document.getElementById('artworkStatus');
      if (artworkStatus) artworkStatus.textContent = options.artwork ? (textured ? `${BadgeArtwork.collections[collection].label} · ${artworkCount} 个面` : this.host.dataset.artworkError ? '贴图加载失败' : '正在加载设计…') : '素模';
      if (options.artwork && this.host.dataset.artworkError) document.getElementById('viewerError').textContent = this.host.dataset.artworkError;
      this.host.dataset.parts = String(model.parts.filter(p => options.roof || !p.id.startsWith('12')).length);
      this.host.dataset.solids = String(model.parts.filter(p => (options.roof || !p.id.startsWith('12')) && p.extrusion.some(n => n !== 0)).length);
    }
    fit(reset) {
      const T = window.THREE, box = new T.Box3().setFromObject(this.root);
      if (box.isEmpty()) return;
      const sphere = box.getBoundingSphere(new T.Sphere());
      const aspect = this.host.clientWidth / Math.max(1, this.host.clientHeight);
      const angle = Math.min(this.camera.fov * Math.PI / 360, Math.atan(Math.tan(this.camera.fov * Math.PI / 360) * aspect));
      const distance = sphere.radius / Math.sin(angle) * 1.13;
      const direction = reset ? new T.Vector3(1.2, .75, 1.6).normalize() : this.camera.position.clone().sub(this.controls.target).normalize();
      if (!direction.length()) direction.set(1.2, .75, 1.6).normalize();
      this.controls.target.copy(sphere.center);
      this.camera.position.copy(sphere.center).add(direction.multiplyScalar(distance));
      this.camera.near = Math.max(.05, distance / 1000);
      this.camera.far = distance * 15;
      this.camera.updateProjectionMatrix();
      this.controls.minDistance = sphere.radius * 1.1;
      this.controls.maxDistance = distance * 4;
      this.controls.update();
    }
    view(direction) {
      const T = window.THREE;
      const tilt = this.params.wallTilt * Math.PI / 180;
      const directions = { iso: [1.2,.75,1.6], '1': [0,-Math.sin(tilt),Math.cos(tilt)], '3': [-1,0,0], '6': [0,-Math.sin(tilt),-Math.cos(tilt)], '9': [1,0,0], '12': [.001,1,.001] };
      if (!directions[direction]) return;
      const damping = this.controls.enableDamping;
      this.controls.enableDamping = false;
      this.controls.autoRotate = false;
      this.controls.update();
      this.camera.position.copy(this.controls.target).add(new T.Vector3(...directions[direction]));
      this.fit(false);
      this.controls.enableDamping = damping;
    }
  }
  window.BadgeOutlineViewer = OutlineViewer;
})();
