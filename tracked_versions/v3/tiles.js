import {
  BoxGeometry,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Group,
  InstancedMesh,
  Object3D,
  Vector3,
  LineBasicMaterial,
  BufferGeometry,
  Line,
  StaticDrawUsage,
  DynamicDrawUsage,
  Matrix4,
} from "three";
import { createTile } from "./tile";
import { createWind } from "./wind";
import { createGrass } from "./grass";
import { addLocationVariance, positionBladeInTile } from "./utils";

// ---- SETTINGS ----
const GRID_SIZE = 1;
const ROW_SIZE = Math.floor(Math.sqrt(GRID_SIZE));
const TILE_OFFSET = 2.05;

const TILE_SETTINGS = { width: 2, height: 0.05, depth: 2 };
const GRASS_SETTINGS = {
  curveVariance: 0.25,
  lineWidth: 0.05,
  numPoints: 4,
};
let NUM_BLADES = 128; 
const BLADES_NUM_ROWS = Math.floor(Math.sqrt(NUM_BLADES));
NUM_BLADES = BLADES_NUM_ROWS ** 2 * GRID_SIZE;

function createTiles() {
  const group = new Group();

  // ---- CREATE WIND ----
  const [p0, p1, p2, p3] = [
    new Vector3(0, 0.5, 0),
    new Vector3(1.5, 0.5, 0),
    new Vector3(.5, 0.5, -2),
    new Vector3(2, 0.5, -2),
  ];
  const { wind, windPosFunc, windDirFunc } = createWind(p0, p1, p2, p3);

  // ---- CREATE TILE ----
  let {
    geometry: tile_g,
    material: tile_m,
    tick: tile_tick,
  } = createTile(TILE_SETTINGS);
  const tile = new InstancedMesh(tile_g, tile_m, GRID_SIZE);
  const { width: tile_width, depth: tile_depth } = tile_g.parameters;
  tile.tick = (uniforms) => {
    tile.children.forEach((c) => c.tick(uniforms));
    tile_tick(tile, uniforms);
  };
  tile.position.set(tile_width / 2, -0.05, -tile_depth / 2);
  tile.instanceMatrix.setUsage(StaticDrawUsage);

  // --- CREATE GRASS ---
  const {
    geometry: grass_g,
    material: grass_m,
    updateUniforms: grass_tick,
  } = createGrass(GRASS_SETTINGS);
  const grass = new InstancedMesh(grass_g, grass_m, NUM_BLADES);

  grass.tick = (uniforms) => {
    grass_tick(grass, uniforms);
  };
  grass.instanceMatrix.setUsage(DynamicDrawUsage); 

  // ---- POSITION INSTANCES ------
  const step = tile_width / BLADES_NUM_ROWS;
  const startX = -tile_width / 2 + step / 2;
  const startZ = tile_depth / 2 - step / 2;
  grass.position.set(startX, grass.position.y, startZ);

  let tile_dummy = new Object3D();
  tile_dummy.matrix = tile.matrix;

  for (let i = 0; i < GRID_SIZE; i++) {
    if (i !== 0) {
      if (i % ROW_SIZE === 0) {
        tile_dummy.position.x = 0;
        tile_dummy.position.z -= TILE_OFFSET;
      } else {
        tile_dummy.position.x += TILE_OFFSET;
      }
    }

    tile_dummy.updateMatrix();
    tile.setMatrixAt(i, tile_dummy.matrix);

    positionBladeInTile(
      grass,
      (i * NUM_BLADES) / GRID_SIZE,
      NUM_BLADES / GRID_SIZE,
      BLADES_NUM_ROWS,
      tile_dummy.position.x,
      tile_dummy.position.z,
      step
    );
  } 

  // ---- ADD MESHES TO GROUP ----
  tile.add(grass);
  group.add(tile);
  group.add(wind);
  // group.scale.set(.5,.5,.5)

  // --- ANIMATE ------

  let fullTime = 0;
  group.tick = (delta) => {
    fullTime += delta / 10;

    if (fullTime >= 1) fullTime = 0;
    let windPos = windPosFunc(fullTime);
    let windDir = windDirFunc(fullTime);
    const uniforms = { delta:fullTime, windPos, windDir };
    group.children.forEach((c) => c.tick(uniforms));
  };
  console.log(group)
  return group;
}

export { createTiles };
