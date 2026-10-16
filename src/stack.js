// Tiles shown in the 3D background, grouped by category.
// Icons come from simple-icons (only the ones imported here end up in the bundle).
// Brands without an icon there get a short text monogram instead.
import {
  siPython, siPytorch, siLightning, siTensorflow, siKeras, siScikitlearn, siNumpy, siPandas,
  siOpencv, siOnnx, siJupyter, siHuggingface, siNvidia,
  siClaude, siLangchain, siQdrant, siOllama, siPydantic, siGradio, siStreamlit, siElevenlabs,
  siWeightsandbiases, siMlflow,
  siFastapi, siFlask, siPostgresql, siRedis, siDocker, siTerraform, siGithubactions, siLinux, siGit, siGo,
  siTypescript, siJavascript, siReact, siNextdotjs, siThreedotjs, siTailwindcss, siKotlin, siAndroid, siCplusplus,
} from 'simple-icons'

const ML = 'ML'
const GENAI = 'GenAI'
const MLOPS = 'MLOps'
const BACKEND = 'Backend'
const CLOUD = 'Cloud'
const WEB = 'Web'
const MOBILE = 'Mobile'

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
  [siOnnx, 'ONNX', ML],
  [siJupyter, 'Jupyter', ML],
  [siNvidia, 'CUDA', ML],

  [siHuggingface, 'Hugging Face', GENAI],
  [siClaude, 'Claude', GENAI],
  [siLangchain, 'LangChain', GENAI],
  ['LI', 'LlamaIndex', GENAI, '#b46cf0'],
  [siQdrant, 'Qdrant', GENAI],
  [siOllama, 'Ollama', GENAI, '#9ca3af'],
  [siPydantic, 'Pydantic', GENAI],
  [siGradio, 'Gradio', GENAI],
  [siStreamlit, 'Streamlit', GENAI],
  [siElevenlabs, 'ElevenLabs', GENAI, '#9ca3af'],
  [siWeightsandbiases, 'W&B', MLOPS],
  [siMlflow, 'MLflow', MLOPS],

  [siFastapi, 'FastAPI', BACKEND],
  [siFlask, 'Flask', BACKEND],
  [siPostgresql, 'PostgreSQL', BACKEND],
  [siRedis, 'Redis', BACKEND],
  [siGo, 'Go', BACKEND],
  [siDocker, 'Docker', CLOUD],
  ['AWS', 'AWS', CLOUD, '#ff9900'],
  ['Az', 'Azure', CLOUD, '#0078d4'],
  [siTerraform, 'Terraform', CLOUD],
  [siGithubactions, 'GH Actions', CLOUD],
  [siLinux, 'Linux', CLOUD],
  [siGit, 'Git', CLOUD],

  [siTypescript, 'TypeScript', WEB],
  [siJavascript, 'JavaScript', WEB],
  [siReact, 'React', WEB],
  [siNextdotjs, 'Next.js', WEB, '#9ca3af'],
  [siThreedotjs, 'Three.js', WEB, '#9ca3af'],
  [siTailwindcss, 'Tailwind', WEB],
  [siKotlin, 'Kotlin', MOBILE],
  [siAndroid, 'Android', MOBILE],
  [siCplusplus, 'C++', BACKEND],
].map(([icon, name, category, color]) => ({
  name,
  category,
  path: typeof icon === 'string' ? null : icon.path,
  monogram: typeof icon === 'string' ? icon : null,
  color: color ?? `#${icon.hex}`,
}))
