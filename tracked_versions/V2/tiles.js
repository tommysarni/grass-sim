import {
    BoxGeometry,
    MathUtils,
    Mesh,
    MeshStandardMaterial,
    Group,
    InstancedMesh,
    Object3D
  } from 'three';
  import { createTile } from './tile';
import { createGrassTile } from './grassTile';

  const SIZE = 64;
  const ROW_SIZE = Math.sqrt(SIZE)
  const TILE_OFFSET = 2.05

  function createTiles() {
    const group = new Group()
    let tile = createGrassTile();

    group.add(tile)
    console.log(tile)
    const tickFunc = tile.tick
    let clone = tile
    
    // for (let i = 1; i < SIZE; i++) {
    //   clone = clone.clone()
    //   clone.tick = tickFunc

    //   if (i % ROW_SIZE === 0) {
    //     clone.position.z -= TILE_OFFSET
    //     clone.position.x = 0
    //   } else {
    //     clone.position.x += TILE_OFFSET
    //   }

    //   // clone.rotateY(Math.ceil(Math.random() * 4) * Math.PI)
       
    //   group.add(clone)
      
    // }
    

    console.log(group)
    group.tick = (delta) => {
      group.children[0].tick(delta)
    };
  
    return group;
  }
  
  export { createTiles };
  