// 3D "periodic table" of my tech stack, rendered with Three.js CSS3DRenderer.
// Loaded lazily by main.js after the links are on screen, so it never delays them.
import { Object3D, PerspectiveCamera, Scene, Vector3, MathUtils } from 'three'
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js'
import { TrackballControls } from 'three/addons/controls/TrackballControls.js'
import { Easing, Group, Tween } from '@tweenjs/tween.js'
import { stack } from './stack.js'

const COLS = 9
const CELL_W = 140
const CELL_H = 180
const LAYOUTS = ['table', 'sphere', 'helix', 'grid']
const AUTO_CYCLE_MS = 9000

export function startScene(container, toolbar) {
  const camera = new PerspectiveCamera(40, 1, 1, 10000)
  const scene = new Scene()
  const tweens = new Group()
  const objects = []

  for (const item of stack) {
    const el = document.createElement('div')
    el.className = 'tile'
    el.style.setProperty('--c', item.color)
    el.innerHTML =
      (item.path
        ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${item.path}"/></svg>`
        : `<span class="mono">${item.monogram}</span>`) +
      `<span class="name">${item.name}</span><span class="cat">${item.category}</span>`

    const obj = new CSS3DObject(el)
    obj.position.set(Math.random() * 4000 - 2000, Math.random() * 4000 - 2000, Math.random() * 4000 - 2000)
    scene.add(obj)
    objects.push(obj)
  }

  const targets = buildTargets(objects.length)

  const renderer = new CSS3DRenderer()
  container.appendChild(renderer.domElement)

  // Drag to rotate only with a mouse/trackpad; on touch screens the page must stay scrollable.
  const finePointer = matchMedia('(pointer: fine)').matches
  const controls = finePointer ? new TrackballControls(camera, renderer.domElement) : null
  if (controls) {
    controls.minDistance = 500
    controls.maxDistance = 6000
    controls.rotateSpeed = 2
    controls.addEventListener('start', stopAutoCycle)
    controls.addEventListener('change', wake)
  }

  // ---- Render loop: runs only while something moves, then sleeps ----
  let frame = 0
  let lastChange = 0

  function wake() {
    lastChange = performance.now()
    if (!frame) frame = requestAnimationFrame(loop)
  }

  function loop(time) {
    tweens.update(time)
    controls?.update()
    renderer.render(scene, camera)
    const busy = !tweens.allStopped() || time - lastChange < 1000
    frame = busy ? requestAnimationFrame(loop) : 0
  }

  // ---- Layouts ----
  let current = 'table'

  function transform(name, duration = 2000) {
    current = name
    tweens.removeAll()
    const layout = targets[name]
    objects.forEach((obj, i) => {
      const t = layout[i]
      tweens.add(
        new Tween(obj.position)
          .to({ x: t.position.x, y: t.position.y, z: t.position.z }, Math.random() * duration + duration)
          .easing(Easing.Exponential.InOut)
          .start(),
        new Tween(obj.rotation)
          .to({ x: t.rotation.x, y: t.rotation.y, z: t.rotation.z }, Math.random() * duration + duration)
          .easing(Easing.Exponential.InOut)
          .start(),
      )
    })
    toolbar.querySelectorAll('[data-layout]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.layout === name)))
    wake()
  }

  let cycle = setInterval(() => {
    if (!document.hidden) transform(LAYOUTS[(LAYOUTS.indexOf(current) + 1) % LAYOUTS.length])
  }, AUTO_CYCLE_MS)

  function stopAutoCycle() {
    clearInterval(cycle)
    cycle = 0
  }

  toolbar.addEventListener('click', (e) => {
    const button = e.target.closest('[data-layout]')
    if (!button) return
    stopAutoCycle()
    transform(button.dataset.layout)
  })

  // ---- Sizing: keep the whole table in view on any screen ----
  function resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    camera.aspect = w / h
    const tan = Math.tan(MathUtils.degToRad(camera.fov / 2))
    const halfW = (COLS * CELL_W) / 2 + 80
    const halfH = (Math.ceil(objects.length / COLS) * CELL_H) / 2 + 80
    const distance = Math.max(halfW / (tan * camera.aspect), halfH / tan)
    // Portrait phones: come closer and let the table overflow the sides, so the tiles stay big
    camera.position.setLength(Math.min(Math.max(distance, 1800), camera.aspect < 1 ? 3000 : 6000))
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
    controls?.handleResize()
    wake()
  }

  camera.position.set(0, 0, 3000)
  resize()
  window.addEventListener('resize', resize)

  toolbar.querySelector('.layouts').hidden = false
  transform('table')
  requestAnimationFrame(() => container.classList.add('ready'))
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
    sphere.position.setFromSphericalCoords(700, phi, theta)
    sphere.lookAt(v.copy(sphere.position).multiplyScalar(2))
    targets.sphere.push(sphere)

    // Helix
    const helix = new Object3D()
    helix.position.setFromCylindricalCoords(800, i * 0.35 + Math.PI, -(i * 22) + 480)
    helix.lookAt(v.set(helix.position.x * 2, helix.position.y, helix.position.z * 2))
    targets.helix.push(helix)

    // Grid: 5x5 layers stacked in depth
    const grid = new Object3D()
    grid.position.x = (i % 5) * 360 - 720
    grid.position.y = -(Math.floor(i / 5) % 5) * 360 + 720
    grid.position.z = Math.floor(i / 25) * 900 - 450
    targets.grid.push(grid)
  }

  return targets
}
