// The links are plain HTML and show up instantly. The 3D animation is fetched
// right after the page has loaded, on every device, so it never delays the links.
const container = document.getElementById('scene')
const toolbar = document.querySelector('.toolbar')
const focusButton = document.getElementById('focus')

focusButton.addEventListener('click', () => {
  const on = document.body.classList.toggle('explore')
  focusButton.setAttribute('aria-pressed', String(on))
})

function loadScene() {
  import('./scene.js')
    .then(({ startScene }) => startScene(container, toolbar))
    .catch((err) => console.warn('3D animation unavailable:', err))
}

if (document.readyState === 'complete') loadScene()
else window.addEventListener('load', loadScene, { once: true })
