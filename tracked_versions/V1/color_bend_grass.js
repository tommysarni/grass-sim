import {
  BoxGeometry,
  MathUtils,
  Mesh,
  InstancedMesh,
  MeshStandardMaterial,
  Group,
  CubicBezierCurve3,
  BufferGeometry,
  LineBasicMaterial,
  Line,
  Curve,
  Vector3,
  Shape,
  TubeGeometry,
  MeshBasicMaterial,
  ExtrudeGeometry,
  Color,
  ShaderMaterial,
} from "three";

const BLADE_HEIGHT = 0.3;

function createGrass() {
  const addCurbeVariance = (scalar) => {
    // move x and z randomly in position +/-(step/2)
    // need random from -1 -> 1 then multiply by (step/2)
    const rand = () => Math.random() * 2 - 1;

    const addX = rand() * scalar;
    const addY = Math.random() * scalar;
    const addY2 = Math.random() * scalar;
    return { addX, addY, addY2 };
  };

  const { addX, addY, addY2 } = addCurbeVariance(0.5);
  console.log({ addX, addY, addY2 });

  const curve = new CubicBezierCurve3(
    new Vector3(0, 1, 0),
    new Vector3(addX, addY2, 0),
    new Vector3(addX, addY, 0),
    new Vector3(0, 0, 0),
  );

  const points = curve.getPoints( 5 );
  console.log([...points, ...points.reverse()])
  const shape = new Shape([...points, ...points.reverse().map(v => ({...v, x: v.x+.05}))]);
  const extrudeSettings = {
    steps: 2,
    depth: 0,
    bevelEnabled: false,
    bevelThickness: .01,
    bevelSize: .01,
    bevelOffset: 0,
    bevelSegments: 1
  };
  

  const g = new ExtrudeGeometry( shape, extrudeSettings );

  function vertexShader() {
    return `
      varying vec3 vUv; 
  
      void main() {
        vUv = position; 
  
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4( position, 1.0 );
      }
    `
  }

  function fragmentShader() {
    return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      varying vec3 vUv;

      void main() {
        gl_FragColor = vec4(mix(colorA, colorB, vUv.y * vUv.y), 1.0);
      }
  `
  }

  let uniforms = {
    colorB: {type: 'vec3', value: new Color('cornsilk')},
    colorA: {type: 'vec3', value: new Color('darkolivegreen')}
}
let mat =  new ShaderMaterial({
  uniforms: uniforms,
  fragmentShader: fragmentShader(),
  vertexShader: vertexShader(),
})




  const material = new MeshStandardMaterial({ color: 'darkolivegreen', wireframe: false, wireframeLinewidth: 1 });
  console.log(material)
  const mesh = new Mesh(g, mat);

  console.log(mesh);

  return mesh;
}

export { createGrass };
