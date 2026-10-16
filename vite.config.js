import { defineConfig } from 'vite'

// The stylesheet is tiny (~2 kB gzipped): inlining it into the HTML removes a
// render-blocking request, so the links paint on the very first round trip.
function inlineCss() {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = Object.values(bundle).find((f) => f.fileName === 'index.html')
      for (const file of Object.values(bundle)) {
        if (!file.fileName.endsWith('.css')) continue
        const tag = new RegExp(`<link rel="stylesheet"[^>]*href="\\./${file.fileName}"[^>]*>`)
        if (!tag.test(html.source)) continue
        html.source = html.source.replace(tag, () => `<style>${file.source}</style>`)
        delete bundle[file.fileName]
      }
    },
  }
}

export default defineConfig({
  // Relative asset URLs: the build works on GitHub Pages (sub-path), Vercel, Netlify or any static host.
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
  plugins: [inlineCss()],
})
