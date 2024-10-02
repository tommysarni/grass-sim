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
import {TessellateModifier} from 'three/addons/modifiers/TessellateModifier.js';
import { createTile } from "./tile";
import { createWind } from "./wind";
import { createGrass } from "./grass";

import { addLocationVariance, positionBladeInTile } from "./utils";

// ---- SETTINGS ----
const GRID_SIZE = 128;
const ROW_SIZE = Math.floor(Math.sqrt(GRID_SIZE));
const TILE_OFFSET = 1.;

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
    new Vector3(5, 0.5, 0),
    new Vector3(5, 0.5, -2),
    new Vector3(4, 0.5, -4),
  ];
  const { wind, windPosFunc, windDirFunc } = createWind(p0, p1, p2, p3);

  // ---- CREATE TILE ----
  let {
    geometry: tile_g,
    material: tile_m,
    updateUniforms: tile_tick,
  } = createTile(TILE_SETTINGS);
  const tile = new InstancedMesh(tile_g, tile_m, GRID_SIZE);
  console.log(tile)
  const { width: tile_width, depth: tile_depth } = tile_g.parameters;
  tile.tick = (uniforms) => {
    tile.children.forEach((c) => c.tick(uniforms));
    tile_tick(tile, uniforms);
  };
  // tile.position.set(tile_width / 2, -0.05, -tile_depth / 2);
  tile.instanceMatrix.setUsage(StaticDrawUsage);

  // --- CREATE GRASS ---
  const {
    geometry: grass_g,
    material: grass_m,
    updateUniforms: grass_tick,
  } = createGrass(GRASS_SETTINGS);
  let grass = new InstancedMesh(grass_g, grass_m, NUM_BLADES);


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

  let toMod = 5;
  // move back 1,3,6, 10
  for (let i = 0; i < GRID_SIZE; i++) {
    if (i !== 0) {
      if (i % toMod === 0) {
        tile_dummy.position.x = -toMod/2;
        tile_dummy.position.z -= TILE_OFFSET;

      } else {
        tile_dummy.position.x += TILE_OFFSET;
      }
    }
    if (i === 15) toMod = 10;

    tile_dummy.updateMatrix();
    tile.setMatrixAt(i, tile_dummy.matrix);
    tile.computeBoundingSphere();





    positionBladeInTile(
      grass,
      (i * NUM_BLADES) / GRID_SIZE,
      NUM_BLADES / GRID_SIZE,
      BLADES_NUM_ROWS,
      tile_dummy.position.x,
      tile_dummy.position.z,
      step
    );
    grass.computeBoundingSphere();
  } 

  // ---- ADD MESHES TO GROUP ----
  tile.add(grass);
  group.add(tile);
  // group.add(wind);
  // group.scale.set(.5,.5,.5)

  // --- ANIMATE ------


/**
 * Todos
 * make grass taller (move grass in front of camera)
 * set camera up (fixed camera) (face 0,0)
 * get cow model with animations
 * play fetch with cow 
 * 
 */

  // not needed for this one
const moveGrassInstancesTo = (position) => {
  // add x and z to the instances
 }

  let fullTime = 0;
  const startCam = {
    "x": 14.999999999999991,
    "y": 2.9999999999999982,
    "z": 6.4999999999999964
}
  group.tick = (delta, camPos) => {

    fullTime += delta / 10;
    if (fullTime >= 1) fullTime = 0;
    let windPos = windPosFunc(fullTime);
    let windDir = windDirFunc(fullTime);
    const uniforms = { delta: fullTime, windPos, windDir };
    group.children.forEach((c) => c.tick(uniforms));
  };
  console.log(group)
  // group.position.set(-2.5, 0, 4* TILE_OFFSET)
  return group;
}

export { createTiles };
