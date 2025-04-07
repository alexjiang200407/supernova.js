import type * as THREE from 'three'
import type { SceneData as Scene, SceneEx } from '../types'
import { nextSlide, rotateCamera } from '../scene'
import { range } from '../util'

function handleShot(scene: SceneEx, shotIdx: number) {
  if (shotIdx === 2) {
    console.log("FUCK")
    scene.supernova?.fade()
  }
}

function newScene8(): Scene {
  return {
    cameraMovement: rotateCamera,
    init: () => {},
    assets: [],
    cameraInit: (camera: THREE.Camera): void => {
      camera.position.set(0, 0, 6)
      camera.rotateX(-0.1)
      camera.rotateY(-0.3)
    },
    update: (scene: SceneEx, time) => {
      scene.base.children.forEach((child) => {
        child.userData.update?.(time)
      })
    },
    next: nextSlide,
    paragraphPaths: range(1, 2).map(n => `text/slide8/${n}.html`),
    handleShot,
  }
}

export default newScene8
