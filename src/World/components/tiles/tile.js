import {
  BoxGeometry,
  Color,
  MeshBasicMaterial,
  MeshStandardMaterial,
  ShaderMaterial,
  Vector3,
} from "three";

function createTile({ width, height, depth }) {
  const geometry = new BoxGeometry(width, height, depth, 10, 1, 1);
  // const material = new MeshBasicMaterial({ color: 'darkolivegreen' });

  function vertexShader() {
    return `
        #define PI 3.14159265359
        varying vec3 vPos; 
        varying float under_rock;
        uniform vec3 wind_dir;
        uniform vec3 wind_pos;
        uniform float u_time;
    
        void main() {
          
          vec3 mvPos = vec3(modelMatrix * instanceMatrix * vec4(position, 1.0)).xyz;
          vec3 newPos = mvPos; 

          float left_bank = smoothstep(5., -7., newPos.x) * smoothstep(-1., newPos.x, -2.) * step(newPos.z, -7.) * step(-10., newPos.z);
          float right_bank = smoothstep(0.,2., newPos.x) * smoothstep(-3., newPos.z, -5.) * step(-7., newPos.z);

          newPos.y += left_bank + right_bank;

  
          vPos = newPos; 
  
          gl_Position = projectionMatrix * viewMatrix * vec4(newPos, 1.0);
        }
      `;
  }

  function fragmentShader() {
    return `
        uniform vec3 colorA; 
        uniform vec3 colorB; 
        uniform float u_time;
        uniform vec3 wind_pos;
  
        varying vec3 vPos;
        varying float under_rock;
  
        void main() {

          vec3 newCol = colorA;
          newCol *= abs(under_rock - 1.);
  
          gl_FragColor = vec4(newCol, 1. );
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
    // wireframe: true
  });

  const updateUniforms = (mesh, uniforms) => {
    const { delta, windDir, windPos } = uniforms || {};

    mesh.material.uniforms.u_time.value = delta;
    mesh.material.uniforms.wind_dir.value = windDir;
    mesh.material.uniforms.wind_pos.value = windPos;
  };

  return { geometry, material, updateUniforms };
}

export { createTile };
