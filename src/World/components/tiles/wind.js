import {
  BoxGeometry,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from "three";

const createWind = (p0, p1, p2, p3) => {
  const lerpBezier = (p0, p1, p2, p3) => (t) => {
    return p0
      .clone()
      .multiplyScalar((1 - t) ** 3)
      .add(p1.clone().multiplyScalar(t * (3 * (1 - t) ** 2)))
      .add(p2.clone().multiplyScalar(3 * (1 - t) * t ** 2))
      .add(p3.clone().multiplyScalar(t ** 3));
  };

  // vec3s (get direction given time)
  const lerpBezierDerivative = (p0, p1, p2, p3) => (t) => {
    return p1
      .clone()
      .sub(p0.clone())
      .multiplyScalar(3 * (1 - t) ** 2)
      .add(
        p2
          .clone()
          .sub(p1.clone())
          .multiplyScalar(6 * (1 - t) * t)
      )
      .add(
        p3
          .clone()
          .sub(p2.clone())
          .multiplyScalar(3 * t ** 2)
      );
  };

  const windPosFunc = lerpBezier(p0, p1, p2, p3);
  const windDirFunc = lerpBezierDerivative(p0, p1, p2, p3);

  let pts = [];
  for (let i = 0; i <= 1; i += 0.01) {
    pts.push(windPosFunc(i));
  }
//   console.log(pts);
  const geometry = new BufferGeometry().setFromPoints(pts);
  const material = new LineBasicMaterial({
    color: 0x000000,
  });

  // Create the final object to add to the scene
  const wind = new Line(geometry, material);

//   wind.position.set(-.5, 0, .5)
  const CUBE_SIZE = .5

  const g = new SphereGeometry(CUBE_SIZE);
  const m = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  const cube = new Mesh(g, m);

  wind.add(cube);
  wind.children[0].position.set(0,0,0)
  console.log(wind)
  wind.tick = (uniforms) => {
    const {delta, windDir, windPos} = uniforms || {}
    const { x, y, z } = windPos;
    wind.children[0].position.set(x, y, z);
  };

  return { wind, windPosFunc, windDirFunc };
};

export { createWind };
