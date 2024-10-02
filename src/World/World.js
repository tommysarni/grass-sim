// import { loadBirds } from './components/birds/birds.js';
import { createCamera } from "./components/camera.js";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene.js";
import { createCube } from "./components/cube.js";
// import { createTiles } from "../../tracked_versions/v3/tiles.js";
import { createTiles } from './components/tiles/tiles.js';

import { createControls } from "./systems/controls.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./systems/Loop.js";
import { AxesHelper } from "three";
import { createCow } from "./components/tiles/cow.js";

let camera;
let controls;
let renderer;
let scene;
let loop;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement);
    const axes = new AxesHelper(5);

    // const { ambientLight, mainLight } = createLights();
    // const cube = createCube();
    const tile = createTiles();

    loop.updatables.push(controls, tile);
    scene.add(tile, axes);
    // console.log(createCow(scene))
    // createCow(scene).then(({init, tick}) => {
    //   init();
    // const cowObj = {tick};
    // loop.updatables.push(cowObj)
    // });

    const resizer = new Resizer(container, camera, renderer);
  }

  //   async init() {
  //     const { parrot, flamingo, stork } = await loadBirds();

  //     // move the target to the center of the front bird
  //     controls.target.copy(parrot.position);

  //     loop.updatables.push(parrot, flamingo, stork);
  //     scene.add(parrot, flamingo, stork);
  //   }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
