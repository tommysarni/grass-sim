import { PerspectiveCamera } from 'three';

function createCamera() {
  const camera = new PerspectiveCamera(35, 1, 0.1, 1000);

  camera.position.set(-2.5, 5, 1.5);
  // 15, 3, 6.5

  return camera;
}

export { createCamera };
