// Tiles shown in the 3D scene, grouped by category. Every tile has at least one
// entry in projects.js (a repo, a job, or "used at work"), so clicking it always builds a house.
// Icons come from simple-icons (only the ones imported here end up in the bundle).
// Brands without an icon there get a short text monogram instead.
import {
  siPython, siPytorch, siLightning, siTensorflow, siKeras, siScikitlearn, siNumpy, siPandas, siOpencv, siYolo,
  siPyg, siOnnx, siJupyter, siNvidia,
  siHuggingface, siLangchain, siQdrant, siMeta, siElevenlabs, siStreamlit, siGradio,
  siWeightsandbiases, siMlflow, siApacheairflow,
  siFastapi, siFlask, siPydantic, siPostgresql, siMysql, siMongodb, siOpenjdk, siPhp, siGo, siCplusplus,
  siDocker, siGooglecloud, siTerraform, siGithubactions, siLinux, siGnubash, siGit,
  siTypescript, siJavascript, siReact, siNextdotjs, siThreedotjs, siTailwindcss, siHtml5, siCss, siVite,
  siKotlin, siAndroid,
} from 'simple-icons'
import { projectsFor } from './projects.js'

const ML = 'ML'
const GENAI = 'GenAI'
const MLOPS = 'MLOps'
const BACKEND = 'Backend'
const CLOUD = 'Cloud'
const WEB = 'Web'
const MOBILE = 'Mobile'
const HARDWARE = 'Hardware'

// [icon | monogram, name, category, color override]
export const stack = [
  [siPython, 'Python', ML],
  [siPytorch, 'PyTorch', ML],
  [siLightning, 'Lightning', ML],
  [siTensorflow, 'TensorFlow', ML],
  [siKeras, 'Keras', ML],
  [siScikitlearn, 'scikit-learn', ML],
  [siNumpy, 'NumPy', ML, '#4dabcf'],
  [siPandas, 'pandas', ML, '#6f5bd8'],
  [siOpencv, 'OpenCV', ML],
  [siYolo, 'YOLO', ML, '#4f7cff'],
  [siPyg, 'PyG', ML, '#7c5cff'],
  [siOnnx, 'ONNX', ML],
  [siJupyter, 'Jupyter', ML],
  [siNvidia, 'CUDA', ML],
  ['M', 'MATLAB', ML, '#e16737'],

  [siHuggingface, 'Hugging Face', GENAI],
  [siLangchain, 'LangChain', GENAI],
  ['LI', 'LlamaIndex', GENAI, '#b46cf0'],
  ['AI', 'OpenAI', GENAI, '#10a37f'],
  [siQdrant, 'Qdrant', GENAI],
  [siMeta, 'FAISS', GENAI],
  ['Pc', 'Pinecone', GENAI, '#9ca3af'],
  [siElevenlabs, 'ElevenLabs', GENAI, '#9ca3af'],
  [siStreamlit, 'Streamlit', GENAI],
  [siGradio, 'Gradio', GENAI],
  [siWeightsandbiases, 'W&B', MLOPS],
  [siMlflow, 'MLflow', MLOPS],
  ['TB', 'TensorBoard', MLOPS, '#ff6f00'],
  [siApacheairflow, 'Airflow', MLOPS],

  [siFastapi, 'FastAPI', BACKEND],
  [siFlask, 'Flask', BACKEND],
  [siPydantic, 'Pydantic', BACKEND],
  [siPostgresql, 'PostgreSQL', BACKEND],
  [siMysql, 'MySQL', BACKEND],
  [siMongodb, 'MongoDB', BACKEND],
  [siOpenjdk, 'Java', BACKEND, '#f89820'],
  ['EE', 'Java EE', BACKEND, '#f8981d'],
  [siPhp, 'PHP', BACKEND],
  [siGo, 'Go', BACKEND],
  [siCplusplus, 'C++', BACKEND],

  [siDocker, 'Docker', CLOUD],
  ['AWS', 'AWS', CLOUD, '#ff9900'],
  ['Az', 'Azure', CLOUD, '#0078d4'],
  [siGooglecloud, 'GCP', CLOUD],
  [siTerraform, 'Terraform', CLOUD],
  [siGithubactions, 'GH Actions', CLOUD],
  [siLinux, 'Linux', CLOUD],
  [siGnubash, 'Bash', CLOUD],
  [siGit, 'Git', CLOUD],

  [siTypescript, 'TypeScript', WEB],
  [siJavascript, 'JavaScript', WEB],
  [siReact, 'React', WEB],
  [siNextdotjs, 'Next.js', WEB, '#9ca3af'],
  [siThreedotjs, 'Three.js', WEB, '#9ca3af'],
  [siTailwindcss, 'Tailwind', WEB],
  [siHtml5, 'HTML5', WEB],
  [siCss, 'CSS', WEB],
  [siVite, 'Vite', WEB],

  [siKotlin, 'Kotlin', MOBILE],
  [siAndroid, 'Android', MOBILE],
  ['FPGA', 'FPGA', HARDWARE, '#ed1c24'],
].map(([icon, name, category, color]) => ({
  name,
  category,
  path: typeof icon === 'string' ? null : icon.path,
  monogram: typeof icon === 'string' ? icon : null,
  color: color ?? `#${icon.hex}`,
  projects: projectsFor(name),
}))
