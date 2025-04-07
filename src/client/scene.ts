import type { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import type { SceneData, SceneEx } from './types'
import * as THREE from 'three'

async function loadAssets(loader: OBJLoader, paths: string[]) {
  const assets = new Map<string, THREE.Mesh>()

  await Promise.all(paths.map(async (path) => {
    const obj = await new Promise<THREE.Object3D>((resolve) => {
      loader.load(path, resolve)
    })

    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        assets.set(child.name, child)
      }
    })
  }))

  return assets
}

export async function initSceneEx(data: SceneData, loader: OBJLoader, camera: THREE.Camera, currentScene?: SceneEx): Promise<SceneEx> {
  const assets = await loadAssets(loader, data.assets)

  let sceneEx: SceneEx

  if (currentScene) {
    sceneEx = {
      ...currentScene,
      assets,
      paragraphText: await Promise.all(
        data.paragraphPaths.map(path => fetch(path)
          .then(res => res.text()),
        ),
      ),
      currentShot: 0,
    }
  }
  else {
    sceneEx = {
      base: new THREE.Scene(),
      assets,
      paragraphText: await Promise.all(
        data.paragraphPaths.map(path => fetch(path)
          .then(res => res.text()),
        ),
      ),
      currentShot: 0,
      planets: [],
      star: undefined,
    }
  }

  data.init(sceneEx, camera)
  data.handleShot(sceneEx, 1)

  return sceneEx
}

export function destroySceneEx(sceneEx: SceneEx): void {
  deleteObject(sceneEx.base)
}

export function deleteObject(obj: any) {
  while (obj.children.length > 0) {
    deleteObject(obj.children[0])
    obj.remove(obj.children[0])
  }

  if (obj.geometry)
    obj.geometry.dispose()
  if (obj.material)
    obj.material.dispose()
  if (obj.texture)
    obj.texture.dispose()
}

export function nextSlide(scene: SceneEx, content: HTMLElement) {
  const hasNextSlide = scene.currentShot < scene.paragraphText.length
  if (hasNextSlide) {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = scene.paragraphText[scene.currentShot]
    while (tempDiv.firstChild) {
      content.appendChild(tempDiv.firstChild) // Move children one by one
    }
    scene.currentShot++
  }
  return hasNextSlide
}

export function getSun(scene: SceneEx): THREE.Mesh {
  return scene.base.userData.sun
}

export function rotateCamera(scene: SceneEx, camera: THREE.Camera, time: number): void {
  const cameraDistanceDelta = scene.base.userData.cameraDistance - scene.base.userData.oldCameraDistance

  if (cameraDistanceDelta < -0.05) {
    scene.base.userData.oldCameraDistance -= 0.05
  }
  else if (cameraDistanceDelta > 0.05) {
    scene.base.userData.oldCameraDistance += 0.05
  }

  camera.position.x = Math.cos(time * 0.75) * scene.base.userData.oldCameraDistance
  camera.position.y = Math.cos(time * 0.75)
  camera.position.z = Math.sin(time * 0.75) * scene.base.userData.oldCameraDistance
  camera.lookAt(0, 0, 0)
}
