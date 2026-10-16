// Tiles shown in the 3D scene, grouped by category. Every tile has at least one
// project in projects.js, so clicking it always builds a house.
// Icons come from simple-icons (only the ones imported here end up in the bundle).
// Brands without an icon there get a short text monogram instead.
import {
  siPython, siPytorch, siTensorflow, siScikitlearn, siNumpy, siPandas, siJupyter, siNvidia, siHuggingface,
  siStreamlit, siGradio, siQdrant, siPydantic, siElevenlabs,
  siFastapi, siFlask, siPostgresql, siDocker, siTerraform, siGithubactions,
  siTypescript, siJavascript, siReact, siNextdotjs, siThreedotjs, siTailwindcss, siVite, siKotlin, siAndroid,
} from 'simple-icons'
import { projectsFor } from './projects.js'

const ML = 'ML'
const GENAI = 'GenAI'
const BACKEND = 'Backend'
const CLOUD = 'Cloud'
const WEB = 'Web'
const MOBILE = 'Mobile'

// [icon | monogram, name, category, color override]
export const stack = [
  [siPython, 'Python', ML],
  [siPytorch, 'PyTorch', ML],
  [siTensorflow, 'TensorFlow', ML],
  [siScikitlearn, 'scikit-learn', ML],
  [siNumpy, 'NumPy', ML, '#4dabcf'],
  [siPandas, 'pandas', ML, '#6f5bd8'],
  [siJupyter, 'Jupyter', ML],
  [siNvidia, 'CUDA', ML],
  [siHuggingface, 'Hugging Face', GENAI],
  ['LI', 'LlamaIndex', GENAI, '#b46cf0'],
  [siQdrant, 'Qdrant', GENAI],

  ['AI', 'OpenAI', GENAI, '#10a37f'],
  [siElevenlabs, 'ElevenLabs', GENAI, '#9ca3af'],
  [siStreamlit, 'Streamlit', GENAI],
  [siGradio, 'Gradio', GENAI],
  [siPydantic, 'Pydantic', BACKEND],
  [siFastapi, 'FastAPI', BACKEND],
  [siFlask, 'Flask', BACKEND],
  [siPostgresql, 'PostgreSQL', BACKEND],
  [siDocker, 'Docker', CLOUD],
  ['AWS', 'AWS', CLOUD, '#ff9900'],
  ['Az', 'Azure', CLOUD, '#0078d4'],

  [siTerraform, 'Terraform', CLOUD],
  [siGithubactions, 'GH Actions', CLOUD],
  [siTypescript, 'TypeScript', WEB],
  [siJavascript, 'JavaScript', WEB],
  [siReact, 'React', WEB],
  [siNextdotjs, 'Next.js', WEB, '#9ca3af'],
  [siThreedotjs, 'Three.js', WEB, '#9ca3af'],
  [siTailwindcss, 'Tailwind', WEB],
  [siVite, 'Vite', WEB],
  [siKotlin, 'Kotlin', MOBILE],
  [siAndroid, 'Android', MOBILE],
].map(([icon, name, category, color]) => ({
  name,
  category,
  path: typeof icon === 'string' ? null : icon.path,
  monogram: typeof icon === 'string' ? icon : null,
  color: color ?? `#${icon.hex}`,
  projects: projectsFor(name),
}))
