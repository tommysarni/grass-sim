// Cow by Paul Gardiner [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/1ehrTQHBPrl)

import {
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  Points,
  PointsMaterial,
  Vector3,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

const createCow = async (scene) => {
  // Instantiate a loader
  const loader = new GLTFLoader();

  const v = new Vector3();
  const n = new Vector3();
  const lineMat = new LineBasicMaterial({ color: 0xff0000 });
  const lineGeo = new BufferGeometry();
  const lines = new LineSegments(lineGeo, lineMat);
  const fur = [];

  // Load a glTF resource

  const init = async () => {
    loader.load(
      // resource URL
      "assets/Cow.glb",
      // called when the resource is loaded
      function (gltf) {
        console.log(gltf);
        const group = gltf.scene.children[0];
        group.position.set(-2, 0, -5);
        group.scale.multiplyScalar(0.2);

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

        scene.add(gltf.scene);
        setupFur(group);
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened" + error);
      }
    );
  };

  const setupFur = (data) => {
    data.add(lines);

    const sampler = new MeshSurfaceSampler(data.children[0]).build();
    for (let i = 0; i < 20000; i++) {
      sampler.sample(v, n);
      let _v = v.clone();
      _v._x = _v.x;
      _v._y = _v.y;
      _v._z = _v.z;
      _v.n = n.clone();
      fur.push(_v);
      let _n = v.clone().add(n);
      _n._x = _n.x;
      _n._y = _n.y;
      _n._z = _n.z;
      fur.push(n.clone());
    }
    lineGeo.setFromPoints(fur);
    // updateCoords(fur, lineGeo)
  };

 
  const tick = (delta) => {

  };

  return { init, tick };
};

export { createCow };
