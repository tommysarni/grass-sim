import {
    BoxGeometry,
    MeshStandardMaterial,
  } from 'three';
  
  function createTile({width, height, depth}) {
    const geometry = new BoxGeometry(width, height, depth);
    const material = new MeshStandardMaterial({ color: 'darkslategrey' });

    const tick = (tile, uniforms) => {

    };
  
    return {geometry, material, tick};
  }
  
  export { createTile };
  