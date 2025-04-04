import * as THREE from 'three'
import { SceneData as Scene, SceneEx } from '../types';
import { deleteObject, nextSlide, rotateCamera } from '../scene';
import { hideLayerMesh, hideOuter } from '../solarsystem/Star';
import { range } from '../util';

const handleShot = (scene: SceneEx, shotIdx: number) => {
  if (shotIdx === 2) {
    scene.planets.forEach(p => deleteObject(p))
    scene.planets = []
    
    if (scene.star) {
      hideOuter(scene.star)
    }
  } else if (shotIdx >= 4 && scene.star) {
    hideLayerMesh(shotIdx - 4, scene.star)
    scene.base.userData.cameraDistance *= 0.9
  }
}


const newScene4 = (): Scene => {
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
    paragraphPaths: range(4, 11).map(n => `text/slide4/${n}.html`),
    handleShot
  }
}


export default newScene4
