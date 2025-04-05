import type * as THREE from 'three'
import type { SceneData as Scene, SceneEx } from '../types'
import { nextSlide, rotateCamera } from '../scene'
import { contractCore, hideOuter, toggleParticleSystem } from '../solarsystem/Star'
import { range } from '../util'

function handleShot(scene: SceneEx, shotIdx: number) {
  if (!scene.star)
    return
  if (shotIdx === 3) {
    contractCore(scene.star, 0.1)
  }
  if (shotIdx === 4) {
    toggleParticleSystem(scene.star)
  }
  if (shotIdx === 6) {
    scene.base.userData.cameraDistance = 18
    hideOuter(scene.star, true)
  }
}

function newScene5(): Scene {
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
    paragraphPaths: range(1, 6).map(n => `text/slide5/${n}.html`),
    handleShot,
  }
}

export default newScene5
