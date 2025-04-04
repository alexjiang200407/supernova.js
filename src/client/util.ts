import * as THREE from 'three'

export const applyToMaterial = (mesh: THREE.Mesh, callback: (material: THREE.Material) => void) => {
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(callback)
  } else {
    callback(mesh.material)
  }
}

export const range = (start: number, end: number, step: number = 1) => Array.from({ length: Math.ceil((end - start + 1) / step) }, (_, i) => start + i * step);


export const zip = <T extends unknown[][]>(...arrays: T) =>
  arrays[0].map((_, i) => arrays.map(arr => arr[i]) as { [K in keyof T]: T[K][number] });
