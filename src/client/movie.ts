import type { Movie, SceneData } from './types'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { destroySceneEx, initSceneEx } from './scene'

export async function newMovie(content: HTMLElement, baseScene: SceneData, ...otherScenes: SceneData[]): Promise<Movie> {
  const w = window.innerWidth
  const h = window.innerHeight
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
  const loader = new OBJLoader()

  baseScene.cameraInit(camera)

  renderer.setSize(w, h)
  document.body.appendChild(renderer.domElement)

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }, false)

  const movie = {
    animationId: undefined,
    w,
    h,
    camera,
    renderer,
    sceneIdx: 0,
    currentScene: await initSceneEx(baseScene, loader, camera),
    loader,
    scenes: [baseScene, ...otherScenes],
  }
  next(movie, content)
  return movie
}

export function play(movie: Movie) {
  const animate = (t: number = 0) => {
    const time = t * 0.0002
    movie.animationId = requestAnimationFrame(animate)

    movie.scenes[movie.sceneIdx].update(movie.currentScene, time)
    movie.renderer.render(movie.currentScene.base, movie.camera)

    movie.scenes[movie.sceneIdx].cameraMovement(movie.currentScene, movie.camera, time)
  }

  animate()
}

export async function nextScene(movie: Movie, content: HTMLElement) {
  if (movie.sceneIdx === movie.scenes.length - 1)
    return
  movie.sceneIdx++
  movie.currentScene = await initSceneEx(movie.scenes[movie.sceneIdx], movie.loader, movie.camera, movie.currentScene)
  content.innerHTML = ''
  movie.scenes[movie.sceneIdx].next(movie.currentScene, content)
}

export function destroyMovie(movie: Movie) {
  movie.renderer.dispose()
  if (movie.animationId) {
    cancelAnimationFrame(movie.animationId)
  }
  destroySceneEx(movie.currentScene)
  if (movie.renderer.domElement && movie.renderer.domElement.parentNode) {
    movie.renderer.domElement.parentNode.removeChild(movie.renderer.domElement)
  }

  movie.currentScene.base = null as unknown as THREE.Scene
  movie.renderer = null as unknown as THREE.WebGLRenderer
  movie.camera = null as unknown as THREE.Camera
}

export async function next(movie: Movie, content: HTMLElement) {
  if (!movie.scenes[movie.sceneIdx].next(movie.currentScene, content)) {
    nextScene(movie, content)
    return
  }
  movie.scenes[movie.sceneIdx].handleShot(movie.currentScene, movie.currentScene.currentShot)
}
