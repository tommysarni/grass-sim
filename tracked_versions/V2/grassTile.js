import {
  BoxGeometry,
  InstancedMesh,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";
import { createGrass } from "./grass";
import { createTile } from "./tile";

let NUM_BLADES = 500;
const BOX_SIZE = Math.floor(Math.sqrt(NUM_BLADES));
NUM_BLADES = BOX_SIZE ** 2;

// Add variance to position in box
const addLocationVariance = (dummy, step) => {
  // move x and z randomly in position +/-(step/2)
  // need random from -1 -> 1 then multiply by (step/2)
  const rand = () => (Math.random() * 2 - 1) * (step/2);
  const clone = dummy.clone();
  clone.position.x += rand();
  clone.position.z += rand();
  clone.updateMatrix();
  return clone.matrix;
};

function createGrassTile() {
  const tile = createTile();
  const { width, depth } = tile.geometry.parameters;
  let grass = createGrass();
  const startPos = grass.position;
  const tickFunc = grass.tick
  grass = new InstancedMesh(grass.geometry, grass.material, NUM_BLADES);
  grass.tick = tickFunc
  grass.position.set(...startPos);
  const step = width / BOX_SIZE;
  const startX = -width / 2 + step / 2;
  const startZ = depth / 2 - step / 2;
  grass.position.set(startX, grass.position.y, startZ);

  let dummy = new Object3D();
  dummy.matrix = grass.matrix;

  for (let i = 1; i < NUM_BLADES; i++) {
    if (i % BOX_SIZE === 0) {
      dummy.position.x = 0;
      dummy.position.z -= step;
    } else {
      dummy.position.x += step;
    }

    let angle = Math.random() * Math.PI /2
    angle = angle * 2 - angle
    dummy.rotateY(angle)

    dummy.updateMatrix();
    grass.setMatrixAt(i, addLocationVariance(dummy, step));
    dummy.rotateY(-angle)
  }
 
  tile.add(grass);

  let dir = new Vector3(.1,0, -.1)
  tile.tick = (delta) => {
    tile.children[0].tick(delta, dir)
  };

  return tile;
}

export { createGrassTile };
