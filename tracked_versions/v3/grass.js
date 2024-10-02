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
import { addCurveVariance } from "./utils";

function createGrass({ lineWidth, numPoints, curveVariance }) {
  const { addX, addY, addY2 } = addCurveVariance(curveVariance);

  const curve = new CubicBezierCurve3(
    new Vector3(0, 1, 0),
    new Vector3(addX, addY2, 0),
    new Vector3(addX, addY, 0),
    new Vector3(0, 0, 0)
  );

  const points = curve.getPoints(numPoints);

  const shape = new Shape([
    ...points,
    ...points.reverse().map((v) => ({ ...v, x: v.x + lineWidth })),
  ]);
  // IDK these settings look them up eventually
  const extrudeSettings = {
    steps: 2,
    depth: 0,
    bevelEnabled: false,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 1,
  };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);

  function vertexShader() {
    return `
      varying vec3 vPos; 
      uniform vec3 wind_dir;
      uniform vec3 wind_pos;
      uniform float u_time;
  
      void main() {
        
        vec3 mvPos = vec3(modelMatrix * instanceMatrix * vec4(position, 1.0)).xyz;
        float angle = acos( dot( normalize(wind_dir.y-wind_dir.x), normalize(wind_dir.z-wind_dir.x) ) );
        float newX = mvPos.y * (mvPos.x + mvPos.x * cos(angle));
        float newY = mvPos.y * (mvPos.y + mvPos.x * sin(angle));
        vec3 newPos = vec3(mvPos); 
        vPos = newPos; 

        gl_Position = projectionMatrix * viewMatrix * vec4(newPos, 1.0);
      }
    `;
  } 
 
  // angle = acos( dot( normalize(y-x), normalize(z-x) ) )

  function fragmentShader() {
    return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      uniform float u_time;
      uniform vec3 wind_pos;

      varying vec3 vPos;

      void main() {
        float distance = length(wind_pos - vPos);
        float allowance = .5;
        float distance_calc = sign(max(allowance - distance,0.));

        gl_FragColor = vec4(mix(colorA, colorB, vPos.y * vPos.y).rgb, 1.0);
      }
  `;
  }

  let uniforms = {
    colorB: { type: "vec3", value: new Color("darkseagreen") },
    colorA: { type: "vec3", value: new Color("darkolivegreen") },
    wind_dir: { type: "vec3", value: new Vector3() },
    wind_pos: { type: "vec3", value: new Vector3() },
    u_time: { type: "u_time", value: 0 },
  };
  let material = new ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fragmentShader(),
    vertexShader: vertexShader(),
  });

  const updateUniforms = (mesh, uniforms) => {
    const { delta, windDir, windPos } = uniforms || {};
    mesh.material.uniforms.u_time.value = delta;
    mesh.material.uniforms.wind_dir.value = windDir;
    mesh.material.uniforms.wind_pos.value = windPos;
  };

  return { geometry, material, updateUniforms };
}

export { createGrass };
