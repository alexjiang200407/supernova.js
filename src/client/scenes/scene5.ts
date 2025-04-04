import * as THREE from 'three'
import { SceneData as Scene, SceneEx } from '../types';
import { nextSlide, rotateCamera } from '../scene';
import { range } from '../util';
import { contractCore, hideLayerMesh, hideOuter, startParticleSystem } from '../solarsystem/Star';

const handleShot = (scene: SceneEx, shotIdx: number) => {
  if (!scene.star) return
  if (shotIdx === 3) {
    contractCore(scene.star, 0.1)
  }
  if (shotIdx === 4) {
    startParticleSystem(scene.star)
  }
  if (shotIdx === 6) {
    scene.base.userData.cameraDistance = 18
    hideOuter(scene.star, true)
  }
}


const newScene5 = (): Scene => {
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
    paragraphPaths: range(1, 6).map(n => `text/slide5/${n}.html`),
    handleShot
  }
}


export default newScene5
