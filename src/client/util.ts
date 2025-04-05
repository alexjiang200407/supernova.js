import type * as THREE from 'three'

export function applyToMaterial(mesh: THREE.Mesh, callback: (material: THREE.Material) => void) {
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(callback)
  }
  else {
    callback(mesh.material)
  }
}

export const range = (start: number, end: number, step: number = 1) => Array.from({ length: Math.ceil((end - start + 1) / step) }, (_, i) => start + i * step)

export function zip<T extends unknown[][]>(...arrays: T) {
  return arrays[0].map((_, i) => arrays.map(arr => arr[i]) as { [K in keyof T]: T[K][number] })
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
