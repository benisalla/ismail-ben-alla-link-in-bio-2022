// 3D "periodic table" of my tech stack, rendered with WebGL (Three.js).
// - Tiles morph between table / sphere / helix / grid layouts.
// - Hover a tile: it lifts toward you and shows how many projects use it.
// - Click a tile: it becomes the foundation of a house whose floors are the
//   projects built with it, topped with a roof. Click a floor to open it.
// Loaded lazily by main.js after the links are on screen.
import {
  CanvasTexture, Color, DirectionalLight, DoubleSide, ExtrudeGeometry, HemisphereLight, MathUtils, Mesh,
  MeshBasicMaterial, MeshStandardMaterial, Object3D, PerspectiveCamera, PlaneGeometry, BoxGeometry, Raycaster,
  Scene, Shape, SRGBColorSpace, Vector2, Vector3, WebGLRenderer, Group,
} from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Easing, Group as TweenGroup, Tween } from '@tweenjs/tween.js'
import { stack } from './stack.js'

const TILE_W = 120
const TILE_H = 150
const PAD = 14 // room for the glow drawn around each tile
const COLS = 11
const CELL_W = 140
const CELL_H = 180
const LAYOUTS = ['table', 'sphere', 'helix', 'grid']
const AUTO_CYCLE_MS = 9000
const TEX_SCALE = 2

const FLOOR_W = 520
const FLOOR_H = 96
const FLOOR_D = 300
const FLOOR_GAP = 6
const BASE_H = 76
const ROOF_H = 170
const MAX_FLOORS = 7

export async function startScene(container, toolbar) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  // Devices without GPU acceleration render WebGL on the CPU: keep the motion light there
  const lowPower = isSoftwareRenderer(renderer)
  renderer.setPixelRatio(lowPower ? 1 : Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)
  const canvas = renderer.domElement
  canvas.style.cursor = 'grab'

  const scene = new Scene()
  scene.add(new HemisphereLight(0xffffff, 0x1b2333, 1.8))
  const sun = new DirectionalLight(0xffffff, 2.2)
  sun.position.set(400, 700, 600)
  scene.add(sun)

  const camera = new PerspectiveCamera(40, 1, 1, 12000)
  camera.position.set(0, 0, 3000)

  // Startup is split across frames so the page never freezes for long
  await nextFrame()

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.enablePan = false
  controls.rotateSpeed = 0.6
  controls.minDistance = 400
  controls.maxDistance = 6000

  const tweens = new TweenGroup()
  const tip = document.createElement('div')
  tip.className = 'tip'
  tip.hidden = true
  document.body.appendChild(tip)

  // ---------- Tiles ----------
  // All tiles are drawn into one atlas texture and share one material, so the GPU
  // setup happens once instead of 33 times. Faded tiles (behind a house) share a second one.
  await nextFrame()
  const atlas = drawAtlas(stack)
  await nextFrame()
  const tileMaterial = new MeshBasicMaterial({ map: atlas.texture, transparent: true, side: DoubleSide, depthWrite: false })
  const fadedMaterial = tileMaterial.clone()
  const tiles = stack.map((item, i) => {
    const mesh = new Mesh(atlas.geometry(i), tileMaterial)
    const holder = new Object3D() // layouts move the holder; hover moves the mesh inside it
    holder.add(mesh)
    holder.position.set(Math.random() * 4000 - 2000, Math.random() * 4000 - 2000, Math.random() * 4000 - 2000)
    mesh.userData = { kind: 'tile', item, holder }
    scene.add(holder)
    return mesh
  })
  const targets = buildTargets(tiles.length)

  // ---------- Render loop: runs only while something moves ----------
  let frame = 0
  let lastChange = 0
  let needsPick = false
  let mouseInside = false // re-check what is under the mouse while things move

  function wake() {
    lastChange = performance.now()
    if (!frame) frame = requestAnimationFrame(loop)
  }

  function loop(time) {
    tweens.update(time)
    controls.update()
    if (needsPick || mouseInside) pick()
    renderer.render(scene, camera)
    const busy = !tweens.allStopped() || time - lastChange < 1000
    frame = busy ? requestAnimationFrame(loop) : 0
  }

  controls.addEventListener('change', wake)
  controls.addEventListener('start', () => {
    stopAutoCycle()
    stopSway()
    canvas.style.cursor = 'grabbing'
  })
  controls.addEventListener('end', () => (canvas.style.cursor = hovered ? 'pointer' : 'grab'))

  // ---------- Layouts ----------
  let current = 'table'

  function transform(name, duration = 2000) {
    current = name
    const layout = targets[name]
    const list = tiles.flatMap((mesh, i) => {
      const { holder } = mesh.userData
      const t = layout[i]
      return [
        new Tween(holder.position).to({ x: t.position.x, y: t.position.y, z: t.position.z }, Math.random() * duration + duration).easing(Easing.Exponential.InOut),
        new Tween(holder.rotation).to({ x: t.rotation.x, y: t.rotation.y, z: t.rotation.z }, Math.random() * duration + duration).easing(Easing.Exponential.InOut),
      ]
    })
    run('tiles', ...list)
    toolbar.querySelectorAll('[data-layout]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.layout === name)))
  }

  // Tweens are grouped by key (tiles, camera, house, a hovered mesh...).
  // Starting a group stops the previous one, so animations never fight.
  const running = new Map()

  function run(key, ...list) {
    for (const t of running.get(key) ?? []) {
      t.stop()
      tweens.remove(t)
    }
    running.set(key, list)
    add(...list)
  }

  function add(...list) {
    for (const t of list) {
      tweens.add(t)
      t.start()
    }
    wake()
  }

  let cycle = lowPower
    ? 0
    : setInterval(() => {
        if (!document.hidden && !house) transform(LAYOUTS[(LAYOUTS.indexOf(current) + 1) % LAYOUTS.length])
      }, AUTO_CYCLE_MS)

  function stopAutoCycle() {
    clearInterval(cycle)
    cycle = 0
  }

  toolbar.addEventListener('click', (e) => {
    const button = e.target.closest('[data-layout]')
    if (!button) return
    stopAutoCycle()
    if (house) closeHouse()
    transform(button.dataset.layout)
  })

  // ---------- Hover & click ----------
  const raycaster = new Raycaster()
  const pointer = new Vector2()
  const screenPos = { x: 0, y: 0 }
  let hovered = null
  let down = null

  function setPointer(e) {
    const rect = canvas.getBoundingClientRect()
    pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1)
    screenPos.x = e.clientX
    screenPos.y = e.clientY
  }

  function hit() {
    raycaster.setFromCamera(pointer, camera)
    // In a house only the floors are interactive; the faded tiles are just scenery
    const found = raycaster.intersectObjects(house ? house.floors : tiles, false)
    return found.find((f) => f.object.userData.kind === 'floor' || (f.object.visible && f.object.material === tileMaterial))?.object ?? null
  }

  function pick() {
    needsPick = false
    const obj = hit()
    if (obj !== hovered) {
      if (hovered) liftOff(hovered)
      hovered = obj
      if (hovered) liftOn(hovered)
      canvas.style.cursor = hovered ? 'pointer' : 'grab'
    }
    if (hovered) {
      const d = hovered.userData
      tip.innerHTML =
        d.kind === 'tile'
          ? `<b>${escapeHtml(d.item.name)}</b> · ${count(d.item.projects.length)}<small>Click to build its house</small>`
          : d.project
            ? `<b>${escapeHtml(d.project.title)}</b><small>${d.project.url ? 'Click to open' : escapeHtml(d.project.kind)}</small>`
            : `<b>${escapeHtml(d.label)}</b><small>See the full list in the panel</small>`
      tip.style.transform = `translate(${screenPos.x + 16}px, ${screenPos.y + 16}px)`
      tip.hidden = false
    } else {
      tip.hidden = true
    }
  }

  function liftOn(mesh) {
    if (mesh.userData.kind === 'tile') {
      run(mesh, new Tween(mesh.position).to({ z: 50 }, 220).easing(Easing.Cubic.Out), new Tween(mesh.scale).to({ x: 1.18, y: 1.18 }, 220).easing(Easing.Cubic.Out))
    } else {
      run(mesh, new Tween(mesh.position).to({ z: 26 }, 220).easing(Easing.Cubic.Out))
    }
  }

  function liftOff(mesh) {
    run(mesh, new Tween(mesh.position).to({ z: 0 }, 220).easing(Easing.Cubic.Out), new Tween(mesh.scale).to({ x: 1, y: 1 }, 220).easing(Easing.Cubic.Out))
  }

  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return
    setPointer(e)
    mouseInside = true
    needsPick = true
    wake()
  })
  canvas.addEventListener('pointerleave', () => {
    mouseInside = false
    if (hovered) liftOff(hovered)
    hovered = null
    tip.hidden = true
  })
  canvas.addEventListener('pointerdown', (e) => (down = { x: e.clientX, y: e.clientY, t: performance.now() }))
  canvas.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6 || performance.now() - down.t > 600) return
    setPointer(e)
    const obj = hit()
    if (obj?.userData.kind === 'tile') openHouse(obj)
    else if (obj?.userData.kind === 'floor' && obj.userData.project?.url) window.open(obj.userData.project.url, '_blank', 'noopener')
    else if (!obj && house) closeHouse()
  })
  window.addEventListener('keydown', (e) => e.key === 'Escape' && house && closeHouse())

  // ---------- House ----------
  const panel = document.getElementById('house-panel')
  let house = null
  let sway = null
  const view = { x: 0, y: 0 } // camera view offset, so the house is not hidden behind the panel

  function openHouse(tileMesh) {
    stopAutoCycle()
    if (house) disposeHouse()
    const { item } = tileMesh.userData
    const color = item.color
    const group = new Group()
    const floors = []
    const parts = []

    // Floors: projects in data order; overflow is summarized on the top floor
    const list = item.projects
    const shown = list.length > MAX_FLOORS ? list.slice(0, MAX_FLOORS - 1) : list
    const extra = list.length - shown.length
    const floorItems = shown.map((p) => ({ project: p }))
    if (extra > 0) floorItems.push({ label: `+ ${count(extra)} more` })

    const build = []
    const totalH = houseHeight(floorItems.length)
    const bottom = -totalH / 2

    // Foundation: the clicked tile grows into a slab
    const base = box(FLOOR_W + 70, BASE_H, FLOOR_D + 70, shade(color, 0.32), canvasTexture(drawBase(item)))
    base.position.y = bottom + BASE_H / 2
    base.scale.set(1, 0.01, 1)
    base.userData = { kind: 'base' }
    group.add(base)
    parts.push(base)
    build.push(new Tween(base.scale).to({ y: 1 }, 450).delay(350).easing(Easing.Back.Out))

    floorItems.forEach((f, i) => {
      const mesh = box(FLOOR_W, FLOOR_H, FLOOR_D, shade(color, i % 2 ? 0.2 : 0.27), canvasTexture(drawFloor(f, color)))
      const y = bottom + BASE_H + FLOOR_GAP + i * (FLOOR_H + FLOOR_GAP) + FLOOR_H / 2
      mesh.position.y = y + 1400
      mesh.userData = { kind: 'floor', project: f.project, label: f.label }
      group.add(mesh)
      floors.push(mesh)
      parts.push(mesh)
      build.push(new Tween(mesh.position).to({ y }, 700).delay(700 + i * 160).easing(Easing.Bounce.Out))
    })

    // Roof
    const roofY = bottom + BASE_H + floorItems.length * (FLOOR_H + FLOOR_GAP) + FLOOR_GAP
    const roof = makeRoof(color, item)
    roof.position.y = roofY + 1400
    group.add(roof)
    parts.push(roof)
    build.push(new Tween(roof.position).to({ y: roofY }, 800).delay(800 + floorItems.length * 160).easing(Easing.Bounce.Out))

    scene.add(group)
    run('house', ...build)
    house = { group, floors, parts, item, totalH }

    // Other tiles drift away and fade; the clicked one dives into the foundation
    const away = tiles.flatMap((mesh, i) => {
      const { holder } = mesh.userData
      if (mesh === tileMesh) {
        return [
          new Tween(holder.position).to({ x: 0, y: bottom + BASE_H / 2, z: FLOOR_D / 2 }, 600).easing(Easing.Cubic.In).onComplete(() => (mesh.visible = false)),
          new Tween(holder.rotation).to({ x: 0, y: 0, z: 0 }, 600),
        ]
      }
      mesh.material = fadedMaterial
      const t = targets.sphere[i]
      return [
        new Tween(holder.position).to({ x: t.position.x * 3, y: t.position.y * 3, z: t.position.z * 3 - 1500 }, 1200).easing(Easing.Cubic.InOut),
        new Tween(holder.rotation).to({ x: t.rotation.x, y: t.rotation.y, z: t.rotation.z }, 1200),
      ]
    })
    run('tiles', ...away)
    run('fade', new Tween(fadedMaterial).to({ opacity: 0.18 }, 800))
    if (hovered) liftOff(hovered)
    hovered = null
    tip.hidden = true

    fillPanel(item)
    document.body.classList.add('house')
    frameHouse(true)

    // Gentle sway so it reads as 3D; stops as soon as the visitor drags
    group.rotation.y = 0
    sway = new Tween(group.rotation).to({ y: [0.45, -0.45, 0] }, 9000).delay(1800).repeat(Infinity).easing(Easing.Sinusoidal.InOut)
    run('sway', sway)
  }

  function houseHeight(floorCount) {
    return BASE_H + floorCount * (FLOOR_H + FLOOR_GAP) + FLOOR_GAP + ROOF_H
  }

  function frameHouse(animate) {
    const w = window.innerWidth
    const h = window.innerHeight
    const side = w >= 900
    const panelW = side ? panel.offsetWidth + 32 : 0
    const sheetH = side ? 0 : panel.offsetHeight + 16
    const availW = w - panelW
    const availH = h - sheetH
    const tan = Math.tan(MathUtils.degToRad(camera.fov / 2))
    const fitH = ((house.totalH / 2 + 160) / tan) * (h / availH)
    const fitW = ((FLOOR_W / 2 + 160) / (tan * (w / h))) * (w / availW)
    const to = { x: 0, y: house.totalH * 0.12, z: Math.max(fitH, fitW) }
    const offset = { x: panelW / 2, y: sheetH / 2 }
    if (!animate) {
      run('camera')
      camera.position.set(to.x, to.y, to.z)
      controls.target.set(0, 0, 0)
      Object.assign(view, offset)
      applyView()
      return wake()
    }
    run(
      'camera',
      new Tween(camera.position).to(to, 1400).easing(Easing.Cubic.InOut),
      new Tween(controls.target).to({ x: 0, y: 0, z: 0 }, 1400).easing(Easing.Cubic.InOut),
      new Tween(view).to(offset, 1400).easing(Easing.Cubic.InOut).onUpdate(applyView),
    )
  }

  function applyView() {
    const w = window.innerWidth
    const h = window.innerHeight
    if (Math.abs(view.x) > 0.5 || Math.abs(view.y) > 0.5) camera.setViewOffset(w, h, view.x, view.y, w, h)
    else camera.clearViewOffset()
  }

  function closeHouse() {
    if (!house) return
    stopSway()
    const old = house
    house = null
    run('house', ...old.parts.map((m, i) => new Tween(m.position).to({ y: m.position.y + 1600 }, 600).delay(i * 40).easing(Easing.Cubic.In)))
    setTimeout(() => {
      scene.remove(old.group)
      disposeGroup(old.group)
      wake()
    }, 700 + old.parts.length * 40)

    panel.hidden = true
    document.body.classList.remove('house')
    tiles.forEach((m) => (m.visible = true))
    run(
      'fade',
      new Tween(fadedMaterial).to({ opacity: 1 }, 900).onComplete(() => tiles.forEach((m) => (m.material = tileMaterial))),
    )
    transform(current, 1200)
    run(
      'camera',
      new Tween(camera.position).to(homePosition(), 1400).easing(Easing.Cubic.InOut),
      new Tween(controls.target).to({ x: 0, y: 0, z: 0 }, 1400).easing(Easing.Cubic.InOut),
      new Tween(view).to({ x: 0, y: 0 }, 1400).easing(Easing.Cubic.InOut).onUpdate(applyView),
    )
  }

  function disposeHouse() {
    stopSway()
    run('house')
    scene.remove(house.group)
    disposeGroup(house.group)
    house = null
  }

  function stopSway() {
    run('sway')
    sway = null
  }

  function fillPanel(item) {
    panel.querySelector('.hp-title').textContent = item.name
    panel.querySelector('.hp-count').textContent = `${count(item.projects.length)} built with it`
    panel.style.setProperty('--c', item.color)
    const list = panel.querySelector('.hp-list')
    list.replaceChildren(
      ...item.projects.map((p) => {
        const li = document.createElement('li')
        const name = document.createElement(p.url ? 'a' : 'span')
        name.className = 'hp-name'
        name.textContent = p.title
        if (p.url) Object.assign(name, { href: p.url, target: '_blank', rel: 'noopener' })
        const meta = document.createElement('span')
        meta.className = 'hp-meta'
        meta.textContent = `${p.kind} · ${p.year}`
        const desc = document.createElement('p')
        desc.textContent = p.desc
        li.append(name, meta, desc)
        return li
      }),
    )
    panel.hidden = false
    list.scrollTop = 0
  }

  panel.querySelector('.hp-close').addEventListener('click', closeHouse)

  // ---------- Sizing ----------
  function homePosition() {
    const tan = Math.tan(MathUtils.degToRad(camera.fov / 2))
    const halfW = (COLS * CELL_W) / 2 + 80
    const halfH = (Math.ceil(tiles.length / COLS) * CELL_H) / 2 + 80
    const distance = Math.max(halfW / (tan * camera.aspect), halfH / tan)
    // Portrait phones: come closer and let the table overflow the sides, so the tiles stay big
    const len = Math.min(Math.max(distance, 1800), camera.aspect < 1 ? 3000 : 6000)
    return new Vector3(0, 0, len)
  }

  function resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    if (house) frameHouse(false)
    else {
      camera.position.copy(homePosition())
      applyView()
    }
    wake()
  }

  resize()
  window.addEventListener('resize', resize)

  // Compile every shader (tiles and house) in parallel off the main thread
  // before the first frame, so neither the start nor the first click stutters.
  // (On CPU-rendered devices only the tile shader is compiled up front.)
  const probe = box(10, 10, 10, new Color('#333'), atlas.texture)
  probe.position.z = -5000
  if (!lowPower) scene.add(probe)
  const compiled = renderer.extensions.has('KHR_parallel_shader_compile')
    ? renderer.compileAsync(scene, camera).catch(() => {})
    : Promise.resolve(renderer.compile(scene, camera))
  compiled.then(() => {
    scene.remove(probe)
    probe.geometry.dispose()
    probe.material.forEach((m) => m.dispose())
    toolbar.querySelector('.layouts').hidden = false
    transform('table', lowPower ? 600 : 2000)
    requestAnimationFrame(() => container.classList.add('ready'))
  })
}

// ---------- Geometry helpers ----------

function box(w, h, d, sideColor, frontTexture) {
  const side = new MeshStandardMaterial({ color: sideColor, roughness: 0.55, metalness: 0.05 })
  const front = new MeshBasicMaterial({ map: frontTexture })
  // BoxGeometry face order: +x, -x, +y, -y, +z (front), -z (back)
  return new Mesh(new BoxGeometry(w, h, d), [side, side, side, side, front, side])
}

function makeRoof(color, item) {
  const w = FLOOR_W + 90
  const shape = new Shape()
  shape.moveTo(-w / 2, 0)
  shape.lineTo(w / 2, 0)
  shape.lineTo(0, ROOF_H)
  shape.closePath()
  const depth = FLOOR_D + 50
  const geometry = new ExtrudeGeometry(shape, { depth, bevelEnabled: false })
  geometry.translate(0, 0, -depth / 2)
  const roof = new Mesh(geometry, new MeshStandardMaterial({ color: new Color(mix(color, '#2a3242', 0.85)), roughness: 0.45 }))
  roof.userData = { kind: 'roof' }

  // Logo on the front gable
  const emblem = new Mesh(new PlaneGeometry(92, 92), new MeshBasicMaterial({ map: canvasTexture(drawEmblem(item)), transparent: true }))
  emblem.position.set(0, ROOF_H * 0.36, depth / 2 + 1)
  roof.add(emblem)
  return roof
}

function disposeGroup(group) {
  group.traverse((o) => {
    o.geometry?.dispose()
    for (const m of [].concat(o.material ?? [])) {
      m.map?.dispose()
      m.dispose()
    }
  })
}

function buildTargets(count) {
  const targets = { table: [], sphere: [], helix: [], grid: [] }
  const rows = Math.ceil(count / COLS)
  const v = new Vector3()

  for (let i = 0; i < count; i++) {
    // Table: categories read left-to-right, top-to-bottom, centered on the origin
    const table = new Object3D()
    table.position.x = (i % COLS) * CELL_W - ((COLS - 1) * CELL_W) / 2
    table.position.y = -Math.floor(i / COLS) * CELL_H + ((rows - 1) * CELL_H) / 2
    targets.table.push(table)

    // Sphere: evenly spread points (spherical Fibonacci-like spiral)
    const phi = Math.acos(-1 + (2 * i) / count)
    const theta = Math.sqrt(count * Math.PI) * phi
    const sphere = new Object3D()
    sphere.position.setFromSphericalCoords(650, phi, theta)
    sphere.lookAt(v.copy(sphere.position).multiplyScalar(2))
    targets.sphere.push(sphere)

    // Helix
    const helix = new Object3D()
    helix.position.setFromCylindricalCoords(750, i * 0.4 + Math.PI, -(i * 28) + 460)
    helix.lookAt(v.set(helix.position.x * 2, helix.position.y, helix.position.z * 2))
    targets.helix.push(helix)

    // Grid: 4x3 layers stacked in depth
    const grid = new Object3D()
    grid.position.x = (i % 4) * 340 - 510
    grid.position.y = -(Math.floor(i / 4) % 3) * 360 + 360
    grid.position.z = Math.floor(i / 12) * 800 - 800
    targets.grid.push(grid)
  }

  return targets
}

// ---------- Canvas drawing (textures) ----------

const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif'

function canvasTexture(canvas) {
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function makeCanvas(w, h) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(w * TEX_SCALE)
  canvas.height = Math.round(h * TEX_SCALE)
  const ctx = canvas.getContext('2d')
  ctx.scale(TEX_SCALE, TEX_SCALE)
  return [canvas, ctx]
}

function drawIcon(ctx, item, cx, cy, size) {
  ctx.fillStyle = '#fff'
  if (item.path) {
    ctx.save()
    ctx.translate(cx - size / 2, cy - size / 2)
    ctx.scale(size / 24, size / 24)
    ctx.fill(new Path2D(item.path))
    ctx.restore()
  } else {
    ctx.font = `800 ${size * 0.6}px ${FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(item.monogram, cx, cy + 1)
  }
}

// Draws every tile into one canvas and returns the texture plus a geometry factory
// whose UVs point at tile i inside it.
function drawAtlas(items) {
  const cellW = (TILE_W + 2 * PAD) * TEX_SCALE
  const cellH = (TILE_H + 2 * PAD) * TEX_SCALE
  const cols = Math.ceil(Math.sqrt(items.length))
  const rows = Math.ceil(items.length / cols)
  const canvas = document.createElement('canvas')
  canvas.width = cols * cellW
  canvas.height = rows * cellH
  const ctx = canvas.getContext('2d')
  items.forEach((item, i) => {
    ctx.save()
    ctx.translate((i % cols) * cellW, Math.floor(i / cols) * cellH)
    ctx.scale(TEX_SCALE, TEX_SCALE)
    drawTile(ctx, item)
    ctx.restore()
  })
  const texture = canvasTexture(canvas)

  function geometry(i) {
    const g = new PlaneGeometry(TILE_W + 2 * PAD, TILE_H + 2 * PAD)
    const uv = g.attributes.uv
    const col = i % cols
    const row = Math.floor(i / cols)
    for (let k = 0; k < uv.count; k++) {
      uv.setXY(k, (col + uv.getX(k)) / cols, 1 - (row + 1 - uv.getY(k)) / rows)
    }
    return g
  }

  return { texture, geometry }
}

function drawTile(ctx, item) {
  const cx = PAD + TILE_W / 2

  // Glow: a few soft strokes (much cheaper than canvas shadowBlur)
  for (const [width, alpha] of [[14, 0.06], [9, 0.1], [5, 0.16]]) {
    ctx.beginPath()
    ctx.roundRect(PAD, PAD, TILE_W, TILE_H, 10)
    ctx.lineWidth = width
    ctx.strokeStyle = rgba(item.color, alpha)
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.roundRect(PAD, PAD, TILE_W, TILE_H, 10)
  ctx.fillStyle = mix(item.color, '#0a0e14', 0.24)
  ctx.fill()
  ctx.lineWidth = 1.5
  ctx.strokeStyle = rgba(item.color, 0.8)
  ctx.stroke()

  drawIcon(ctx, item, cx, PAD + 52, 52)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#fff'
  ctx.font = `600 13px ${FONT}`
  ctx.fillText(item.name, cx, PAD + 110)
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = `600 9px ${FONT}`
  ctx.fillText(item.category.toUpperCase(), cx, PAD + 128)

  // Project count badge
  const n = String(item.projects.length)
  const bw = 12 + n.length * 6
  ctx.beginPath()
  ctx.roundRect(PAD + TILE_W - bw - 6, PAD + 6, bw, 17, 8.5)
  ctx.fillStyle = rgba(item.color, 0.95)
  ctx.fill()
  ctx.fillStyle = luminance(item.color) > 0.6 ? '#0b0d12' : '#fff'
  ctx.font = `700 10.5px ${FONT}`
  ctx.textBaseline = 'middle'
  ctx.fillText(n, PAD + TILE_W - 6 - bw / 2, PAD + 15)
}

function drawBase(item) {
  const w = FLOOR_W + 70
  const [canvas, ctx] = makeCanvas(w, BASE_H)
  ctx.fillStyle = mix(item.color, '#0b0f16', 0.4)
  ctx.fillRect(0, 0, w, BASE_H)
  ctx.fillStyle = 'rgba(0,0,0,0.25)'
  ctx.fillRect(0, BASE_H - 8, w, 8)
  drawIcon(ctx, item, 46, BASE_H / 2 - 2, 40)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#fff'
  ctx.font = `800 28px ${FONT}`
  ctx.fillText(item.name, 84, BASE_H / 2 - 3)
  ctx.textAlign = 'right'
  ctx.font = `600 16px ${FONT}`
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fillText(count(item.projects.length), w - 24, BASE_H / 2 - 2)
  return canvas
}

function drawFloor({ project, label }, color) {
  const [canvas, ctx] = makeCanvas(FLOOR_W, FLOOR_H)
  ctx.fillStyle = mix(color, '#0d121b', 0.16)
  ctx.fillRect(0, 0, FLOOR_W, FLOOR_H)
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 8, FLOOR_H)
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'

  if (!project) {
    ctx.fillStyle = '#fff'
    ctx.font = `700 22px ${FONT}`
    ctx.fillText(label, 28, 46)
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = `14px ${FONT}`
    ctx.fillText('See the full list in the panel', 28, 72)
    return canvas
  }

  ctx.fillStyle = mix(color, '#ffffff', 0.55)
  ctx.font = `700 11.5px ${FONT}`
  ctx.fillText(`${project.kind} · ${project.year}`.toUpperCase(), 28, 26)
  ctx.fillStyle = '#fff'
  ctx.font = `700 21px ${FONT}`
  ctx.fillText(fit(ctx, project.title, FLOOR_W - 90), 28, 53)
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.font = `13.5px ${FONT}`
  ctx.fillText(fit(ctx, project.desc, FLOOR_W - 60), 28, 77)
  if (project.url) {
    // "Open" arrow
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2.2
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(FLOOR_W - 44, 54)
    ctx.lineTo(FLOOR_W - 30, 40)
    ctx.moveTo(FLOOR_W - 42, 40)
    ctx.lineTo(FLOOR_W - 30, 40)
    ctx.lineTo(FLOOR_W - 30, 52)
    ctx.stroke()
  }
  return canvas
}

function drawEmblem(item) {
  const [canvas, ctx] = makeCanvas(92, 92)
  ctx.beginPath()
  ctx.arc(46, 46, 44, 0, Math.PI * 2)
  ctx.fillStyle = mix(item.color, '#0b0f16', 0.35)
  ctx.fill()
  ctx.lineWidth = 3
  ctx.strokeStyle = 'rgba(255,255,255,0.85)'
  ctx.stroke()
  drawIcon(ctx, item, 46, 46, 46)
  return canvas
}

// ---------- Small utilities ----------

function isSoftwareRenderer(renderer) {
  const gl = renderer.getContext()
  const info = gl.getExtension('WEBGL_debug_renderer_info')
  const name = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : ''
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name)
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve)))
}

function fit(ctx, text, max) {
  if (ctx.measureText(text).width <= max) return text
  let s = text
  while (s.length > 1 && ctx.measureText(s + '…').width > max) s = s.slice(0, -1)
  return s.trimEnd() + '…'
}

function count(n) {
  return `${n} project${n === 1 ? '' : 's'}`
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
}

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgba(hex, a) {
  return `rgba(${rgb(hex).join(',')},${a})`
}

// Mix `amount` of `hex` into `base`
function mix(hex, base, amount) {
  const a = rgb(hex)
  const b = rgb(base)
  return `rgb(${a.map((v, i) => Math.round(v * amount + b[i] * (1 - amount))).join(',')})`
}

function shade(hex, amount) {
  return new Color(mix(hex, '#141a24', amount))
}

function luminance(hex) {
  const [r, g, b] = rgb(hex)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}
