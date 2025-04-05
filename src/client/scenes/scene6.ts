import * as THREE from 'three'
import { SceneData as Scene, SceneEx } from '../types';
import { nextSlide, rotateCamera } from '../scene';
import { range } from '../util';
import explode from '../fx/explosionFx';
import { toggleParticleSystem } from '../solarsystem/Star';


const handleShot = (scene: SceneEx, shotIdx: number) => {
  if (shotIdx === 2 && scene.star) {
    toggleParticleSystem(scene.star, false)
    explode(scene.star, scene)
  }
}


const newScene6 = (): Scene => {
  return {
    cameraMovement: rotateCamera,
    init: () => {},
    assets: [],
    cameraInit: (camera: THREE.Camera): void => {
      camera.position.set(0, 0, 6);
      camera.rotateX(-0.1)
      camera.rotateY(-0.3)
    },
    update: (scene: SceneEx, time) => {
      scene.base.children.forEach((child) => {
        child.userData.update?.(time);
      });
    },
    next: nextSlide,
    paragraphPaths: range(1, 3).map(n => `text/slide6/${n}.html`),
    handleShot
  }
}


export default newScene6
