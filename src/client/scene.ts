import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { SceneData, SceneEx } from "./types"
import * as THREE from 'three'

async function loadAssets(loader: OBJLoader, paths: string[]) {
  const assets = new Map<string, THREE.Mesh>();

  await Promise.all(paths.map(async (path) => {
    const obj = await new Promise<THREE.Object3D>((resolve) => {
      loader.load(path, resolve);
    });

    obj.traverse(child => {
      if (child instanceof THREE.Mesh) {
        assets.set(child.name, child);
      }
    });
  }));

  return assets;
}


export const initSceneEx = async (data: SceneData, loader: OBJLoader): Promise<SceneEx> => {
  const assets = await loadAssets(loader, data.assets);

  const sceneEx: SceneEx = {
    base: new THREE.Scene,
    assets,
  }

  data.init(sceneEx)

  return sceneEx
}


export const destroySceneEx = (sceneEx: SceneEx): void => {
  deleteObject(sceneEx.base)
}

function deleteObject(obj: any) {
  while (obj.children.length > 0) {
    deleteObject(obj.children[0])
    obj.remove(obj.children[0]);
  }

  if (obj.geometry) { obj.geometry.dispose(); }
  if (obj.material) { obj.material.dispose(); }
  if (obj.texture) { obj.texture.dispose(); }
}