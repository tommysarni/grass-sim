import {
    BoxGeometry,
    MathUtils,
    Mesh,
    InstancedMesh,
    MeshStandardMaterial,
    Group,
  } from 'three';

  const BLADE_HEIGHT = .3;
  
  function createGrass() {
    const geometry = new BoxGeometry(.02, BLADE_HEIGHT, .02);
    const material = new MeshStandardMaterial({ color: 'green' });
    const grass = new Mesh(geometry, material);
    grass.position.set(0, BLADE_HEIGHT/2, 0)
    const g = new BoxGeometry(.02, 100, .02);
    const m = new MeshStandardMaterial({ color: 'red' });
    const gr = new Mesh(g, m);
    grass.add(gr)
    grass.tick = (delta) => {

    };
  
    return grass;
  }
  
  export { createGrass };
  