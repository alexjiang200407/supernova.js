import * as THREE from 'three'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import getSun from './solarsystem/Star';
import getPlanet from './solarsystem/Planet';
import getStarfield from './starfield';
import getNebula from './solarsystem/Nebula';
import { SceneData } from './types';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import getAsteroidBelt from './solarsystem/Asteroids';
import { randFloat, randInt } from 'three/src/math/MathUtils.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 0, 6);
camera.rotateX(-0.1)
camera.rotateY(-0.3)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);

document.body.appendChild(renderer.domElement);


// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.03;
function initScene(data: SceneData) {
  const solarSystem = new THREE.Group();
  solarSystem.userData.update = (t: number) => {
    solarSystem.children.forEach((child) => {
      child.userData.update?.(t);
    });
  };
  scene.add(solarSystem);

  const sun = getSun();
  solarSystem.add(sun);

    for (let i = 0; i < 12; i++) {
      let [size, distance] = [randFloat(0.01, 0.1), randFloat(2, 10)]
      let children = []
      for (let j = 0; j < randInt(0, 3); j++) {
        children.push(getPlanet({ size: size / 5, distance: size + randFloat(0.05, 0.1), img: 'moon.png'}))
      }
      let planet = getPlanet({ children, size, distance, img: 'mars.png' })


      solarSystem.add(planet)
    }



    const asteroidBelt = getAsteroidBelt(data.objs);
    solarSystem.add(asteroidBelt);


    const starfield = getStarfield({ numStars: 500, size: 0.35 });
    scene.add(starfield);

    const dirLight = new THREE.DirectionalLight(0x0099ff, 1);
    dirLight.position.set(0, 1, 0);
    scene.add(dirLight);

    const nebula = getNebula({
      hue: 0.6,
      numSprites: 10,
      opacity: 0.2,
      radius: 40,
      size: 80,
      z: -50.5,
    });
    scene.add(nebula);

  const cameraDistance = 5;
  const animate = (t: number = 0) => {
    const time = t * 0.0002;
    requestAnimationFrame(animate);
    solarSystem.userData.update(time);
    renderer.render(scene, camera);

    camera.position.x = Math.cos(time * 0.75) * cameraDistance;
    camera.position.y = Math.cos(time * 0.75);
    camera.position.z = Math.sin(time * 0.75) * cameraDistance;
    camera.lookAt(0, 0, 0);
    // controls.update();
  }

  animate();
}



const sceneData: SceneData = {
  objs: [],
};

const manager = new THREE.LoadingManager();
manager.onLoad = () => initScene(sceneData);

const loader = new OBJLoader(manager);
const objs = ['Rock1', 'Rock2', 'Rock3'];
objs.forEach((name) => {
  let path = `./meshes/rocks/${name}.obj`;
  loader.load(path, (obj) => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        sceneData.objs.push(child);
      }
    });
  });
});

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);

initScene(sceneData)