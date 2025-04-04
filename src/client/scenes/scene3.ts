import * as THREE from 'three'
import { SceneData as Scene, SceneEx } from '../types';
import { nextSlide, rotateCamera } from '../scene';
import { startRedGiant } from '../solarsystem/Star';
import { range } from '../util';

const handleShot = (scene: SceneEx, shotIdx: number) => {
  if (shotIdx === 6) {
    if (scene.star)
      startRedGiant(scene.star)
    
    scene.base.userData.cameraDistance *= 3
  }
}


const newScene3 = (): Scene => {
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
    paragraphPaths: range(0, 5).map(n => `text/slide3/${n}.html`),
    handleShot
  }
}


export default newScene3
