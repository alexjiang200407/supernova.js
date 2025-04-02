import * as THREE from 'three'
import { SceneData as Scene, SceneEx } from '../types';
import { nextScene } from '../movie';
import { nextSlide } from '../scene';

const initScene = (scene: SceneEx) => {
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

    },
    next: nextSlide,
    paragraphPaths: ['text/slide2/1.html', 'text/slide2/2.html', 'text/slide2/3.html']
  }
}


export default newScene2
