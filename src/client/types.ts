
import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export type CameraPathCallback = (scene: SceneEx, camera: THREE.Camera, time: number) => void;
export type CameraInitCallback = (camera: THREE.Camera) => void;
export type SceneInitCallback = (scene: SceneEx) => void;
export type UpdateCallback = (scene: SceneEx, time: number) => void;

export interface SceneData {
  assets: string[]
  cameraMovement: CameraPathCallback
  init: SceneInitCallback
  cameraInit: CameraInitCallback
  update: UpdateCallback
}

export interface SceneEx {
  base: THREE.Scene
  assets: Map<string, THREE.Mesh>
}

export interface Movie {
  animationId?: number;
  renderer: THREE.WebGLRenderer
  camera: THREE.Camera
  scenes: SceneData[]
  currentScene: SceneEx
  sceneIdx: number
  loader: OBJLoader
  w: number
  h: number
}