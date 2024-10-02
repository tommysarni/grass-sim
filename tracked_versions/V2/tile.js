import {
    BoxGeometry,
    MathUtils,
    Mesh,
    MeshStandardMaterial,
  } from 'three';
import { createGrass } from './grass';
  
  function createTile() {
    const geometry = new BoxGeometry(2, .1, 2);
    const material = new MeshStandardMaterial({ color: 'sienna' });
    const tile = new Mesh(geometry, material);
    tile.wireframe = true
    tile.tick = (delta) => {

    };
  
    return tile;
  }
  
  export { createTile };
  