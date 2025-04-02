import * as THREE from 'three'
import { SceneData as Scene, SceneEx } from '../types';
import { deleteObject, nextSlide, rotateCamera } from '../scene';
import { startRedGiant } from '../solarsystem/Star';

const handleShot = (scene: SceneEx, shotIdx: number) => {
  console.log(shotIdx)
  if (shotIdx === 2) {
    console.log(scene.star)
    if (scene.star)
      startRedGiant(scene.star)
    
    
    scene.base.userData.cameraDistance *= 3
  } else if (shotIdx === 3) {
    scene.planets.forEach(p => deleteObject(p))
    scene.planets = []
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
    paragraphPaths: ['text/slide3/1.html', 'text/slide3/2.html', 'text/slide3/3.html'],
    handleShot
  }
}


export default newScene3
