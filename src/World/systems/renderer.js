import { WebGLRenderer } from 'three';

function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true });
  console.log(renderer.info)

  renderer.physicallyCorrectLights = true;

  return renderer;
}

export { createRenderer };
