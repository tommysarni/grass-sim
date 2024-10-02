import { World } from './World/World.js';
import Stats from 'three/examples/jsm/libs/stats.module.js'

async function main() {
  // Get a reference to the container element
  const container = document.querySelector('#scene-container');

  // create a new world
  const world = new World(container);

  // complete async tasks
//   await world.init();

  // start the animation loop
  world.start();
}

const btn = document.querySelector('#start')
if (btn) {
    btn.addEventListener('click', () => {
        btn.style.display = 'none'
        main().catch((err) => {
            console.error(err);
          });
    })
    
}


var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function animate() {

	stats.begin();

	// monitored code goes here

	stats.end();

	requestAnimationFrame( animate );

}

requestAnimationFrame( animate );


