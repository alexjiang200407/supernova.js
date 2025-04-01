import * as THREE from 'three'
import getSun from '../solarsystem/Star';
import getPlanet from '../solarsystem/Planet';
import getStarfield from '../starfield';
import getNebula from '../solarsystem/Nebula';
import { SceneData as Scene, SceneEx } from '../types';
import getAsteroidBelt from '../solarsystem/Asteroids';
import { randFloat, randInt } from 'three/src/math/MathUtils.js';

function initScene(scene: SceneEx) {
}

const newScene2 = (): Scene => {
  return {
    cameraMovement: (scene: SceneEx, camera: THREE.Camera, time: number): void => {

    },
    init: initScene,
    assets: [],
    cameraInit: (camera: THREE.Camera): void => {

    },
    update: (scene: SceneEx, time) => {

    }
  }
}


export default newScene2
