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
  PlaneGeometry,
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
      #define PI 3.14159265359
      varying vec3 vPos; 
      uniform vec3 wind_dir;
      uniform vec3 wind_pos;
      uniform float u_time;
  
      void main() {
        
        vec3 mvPos = vec3(modelMatrix * instanceMatrix * vec4(position, 1.0)).xyz;
        vec3 newPos = mvPos; 

        

      float wavelength = 5. ;
      float amp = .5;
      float freq = 2. / wavelength;
      float speed = 30. * freq;
      float offset = amp * sin((newPos.x + newPos.y) * -freq + u_time * speed);
      newPos.x += newPos.y * offset;

      newPos.y = newPos.y * step(newPos.y, .7) * sin(newPos.y) + cos(newPos.x);
      newPos.y -= 1. * cos(newPos.x);
      // newPos *= 2.;


      // newPos.y += noise;//vec3(pos_sin * top_y * normalize(wind_dir) * noise); // 
        float di = length(newPos - wind_pos);
        newPos.y *= abs(step(di, .5) - 1.);


        // for under rocks
        float left_bank = smoothstep(5., -7., newPos.x) * smoothstep(-1., newPos.x, -2.) * step(newPos.z, -7.) * step(-10., newPos.z);
        float right_bank = smoothstep(0.,2., newPos.x) * smoothstep(-3., newPos.z, -5.) * step(-7., newPos.z);
        newPos.y *= abs((left_bank + right_bank) - 1.);


        vPos = newPos; 

        gl_Position = projectionMatrix * viewMatrix * vec4(newPos, 1.0);
      }
    `;
  }

  // 168 , 15488

  /**
   * 
        // Extras
        float di = distance(mvPos, wind_pos) * .5;
        float alpha_cool_boundary_effect = 1. - di + 1. / max(di, 1.);
        float alpha_wind_intensity_hit_effect = max(.1, alpha_cool_boundary_effect);
        // End Extras
   */


  function fragmentShader() {
    return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      uniform float u_time;
      uniform vec3 wind_pos;

      varying vec3 vPos;

      void main() {

        gl_FragColor = vec4(mix(colorA, colorB, vPos.y * vPos.y * 10.), 1. );
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
