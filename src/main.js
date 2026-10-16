// The links are plain HTML and show up instantly. The 3D animation is fetched
// right after the page has loaded, on every device, so it never delays the links.
const container = document.getElementById('scene')
const toolbar = document.querySelector('.toolbar')
const focusButton = document.getElementById('focus')

document.getElementById('hint').addEventListener('click', () => focusButton.click())

focusButton.addEventListener('click', () => {
  const on = document.body.classList.toggle('explore')
  focusButton.setAttribute('aria-pressed', String(on))
})

function loadScene() {
  import('./scene.js')
    .then(({ startScene }) => startScene(container, toolbar))
    .catch((err) => console.warn('3D animation unavailable:', err))
}

// Start once the browser is idle after load, so it never competes with a first tap
const whenIdle = () => (window.requestIdleCallback ? requestIdleCallback(loadScene, { timeout: 1500 }) : setTimeout(loadScene, 300))
if (document.readyState === 'complete') whenIdle()
else window.addEventListener('load', whenIdle, { once: true })
