import { initSceneEx } from "./scene";
import { Movie as Movie, SceneData } from "./types";
import * as THREE from 'three'
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export const newMovie = async (baseScene: SceneData): Promise<Movie> => {
  const w = window.innerWidth
  const h = window.innerHeight
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
  const loader = new OBJLoader

  baseScene.cameraInit(camera)

  renderer.setSize(w, h)
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, false)


  return {
    w,
    h,
    camera,
    renderer,
    sceneIdx: 0,
    currentScene: await initSceneEx(baseScene, loader),
    loader,
    scenes: [baseScene],
  }
}

export const registerScene = (movie: Movie, sceneData: SceneData) => {
  movie.scenes.push(sceneData)
}

export const play = (movie: Movie) => {
  const animate = (t: number = 0) => {
    const time = t * 0.0002;
    requestAnimationFrame(animate);
    
    movie.scenes[movie.sceneIdx].update(movie.currentScene, time);
    movie.renderer.render(movie.currentScene.base, movie.camera);

    movie.scenes[movie.sceneIdx].cameraMovement(movie.currentScene, movie.camera, time)
  }

  animate();
}