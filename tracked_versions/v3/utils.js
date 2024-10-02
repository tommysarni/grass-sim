import { Object3D } from "three";

const addCurveVariance = (scalar) => {
  // move x and z randomly in position +/-(step/2)
  // need random from -1 -> 1 then multiply by (step/2)
  const rand = () => 0 // Math.random() * 2 - 1;

  const addX = rand() * scalar;
  const addY = Math.random() * scalar;
  const addY2 = Math.random() * scalar + addY;
  return { addX, addY, addY2 };
};

const addLocationVariance = (dummy, step) => {
  const rand = () => (Math.random() * 2 - 1) * (step/2);
  const clone = dummy.clone();
  clone.position.x += rand();
  clone.position.z += rand();
  clone.updateMatrix();
  return clone.matrix;
};


  const positionBladeInTile = (
    imesh,
    startIndex,
    bladesPerTile,
    numRows,
    startX,
    startZ,
    step
  ) => {
    let dummy = new Object3D();
    dummy.matrix = imesh.matrix;
    dummy.position.x = startX;
    dummy.position.z = startZ
    for (let i = startIndex; i < bladesPerTile + startIndex; i++) {
      if (i !== startIndex) { 
        if (i % numRows === 0) {
          dummy.position.x = startX;
          dummy.position.z -= step;
        } else {
          dummy.position.x += step;
        }
      }

      dummy.updateMatrix();
      imesh.setMatrixAt(i, addLocationVariance(dummy, step));
    }
  };

export { addCurveVariance, addLocationVariance, positionBladeInTile };

// ---- HELPERS FOR INSTANCE TSR -----
// const meshes = [];
// const meshMap = new WeakMap();
// const _vector = new Vector3();

// function addMesh(mesh) {
//   const body = mesh.isInstancedMesh ? createInstancedBody(mesh) : null;

//   meshes.push(mesh);
//   meshMap.set(mesh, body);
// }

// function createInstancedBody(mesh) {
//   const array = mesh.instanceMatrix.array;

//   const bodies = [];

//   for (let i = 0; i < mesh.count; i++) {
//     const position = _vector.fromArray(array, i * 16 + 12);
//     bodies.push(position);
//   }

//   return bodies;
// }

// function setMeshPosition(mesh, position, index = 0) {
//   let body = meshMap.get(mesh);

//   if (mesh.isInstancedMesh) {
//     body = body[index];
//   }
//   // vec3s console.log(position, body)
//   // need to add a matrix
//   body = position;

//   mesh.setMatrixAt(index, position.add(body));
// }
