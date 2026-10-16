// The links are plain HTML and show up instantly. The 3D background is an extra:
// - wide screens: fetched once the page is idle,
// - phones: fetched only when the visitor taps "Explore 3D" (the card covers the screen anyway),
// - never for people who asked for reduced motion or data saving.
const container = document.getElementById('scene')
const toolbar = document.querySelector('.toolbar')
const focusButton = document.getElementById('focus')

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
const saveData = navigator.connection?.saveData === true
const wideScreen = matchMedia('(min-width: 720px)').matches

let scene
function loadScene() {
  scene ??= import('./scene.js')
    .then(({ startScene }) => startScene(container, toolbar))
    .catch((err) => {
      scene = null
      console.warn('3D background unavailable:', err)
    })
  return scene
}

function setExplore(on) {
  document.body.classList.toggle('explore', on)
  focusButton.setAttribute('aria-pressed', String(on))
}

if (!reducedMotion && !saveData) {
  toolbar.hidden = false

  focusButton.addEventListener('click', () => {
    const on = !document.body.classList.contains('explore')
    if (on) loadScene()
    setExplore(on)
  })

  if (wideScreen) {
    const whenIdle = () =>
      window.requestIdleCallback ? requestIdleCallback(loadScene, { timeout: 1500 }) : setTimeout(loadScene, 200)
    if (document.readyState === 'complete') whenIdle()
    else window.addEventListener('load', whenIdle, { once: true })
  }
}
