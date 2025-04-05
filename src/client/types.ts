import type * as THREE from 'three'
import type { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

export type CameraPathCallback = (scene: SceneEx, camera: THREE.Camera, time: number) => void
export type CameraInitCallback = (camera: THREE.Camera) => void
export type SceneInitCallback = (scene: SceneEx, camera: THREE.Camera) => void
export type UpdateCallback = (scene: SceneEx, time: number) => void
export type NextCallback = (scene: SceneEx, content: HTMLElement) => boolean
export type HandleShotCallback = (scene: SceneEx, shotIdx: number) => void

export interface SceneData {
  assets: string[]
  paragraphPaths: string[]
  cameraMovement: CameraPathCallback
  init: SceneInitCallback
  cameraInit: CameraInitCallback
  update: UpdateCallback
  next: NextCallback
  handleShot: HandleShotCallback
}

export interface SceneEx {
  base: THREE.Scene
  assets: Map<string, THREE.Mesh>
  paragraphText: string[]
  currentShot: number
  planets: THREE.Object3D<THREE.Object3DEventMap>[]
  star?: THREE.Mesh
}

export interface Movie {
  animationId?: number
  renderer: THREE.WebGLRenderer
  camera: THREE.Camera
  scenes: SceneData[]
  currentScene: SceneEx
  sceneIdx: number
  loader: OBJLoader
  w: number
  h: number
}
