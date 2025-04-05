import type { SceneData as Scene, SceneEx } from '../types'
import * as THREE from 'three'
import { nextSlide, rotateCamera } from '../scene'
import getAsteroidBelt from '../solarsystem/Asteroids'
import getNebula from '../solarsystem/Nebula'
import getPlanet from '../solarsystem/Planet'
import newSun from '../solarsystem/Star'
import getStarfield from '../starfield'
import { range } from '../util'
import { LensFlareEffect, LensFlareParams } from '../fx/LensFlare'

function initScene(scene: SceneEx, camera: THREE.Camera) {
  const solarSystem = new THREE.Group()
  solarSystem.userData.update = (t: number) => {
    solarSystem.children.forEach((child) => {
      child.userData.update?.(t)
    })
  }

  scene.base.add(solarSystem)

  const sun = newSun(camera, scene.base)
  solarSystem.add(sun)

  const mercury = getPlanet({ size: 0.05, distance: 1.25, img: 'mercury.png' })
  solarSystem.add(mercury)

  const venus = getPlanet({ size: 0.1, distance: 1.65, img: 'venus.png' })
  solarSystem.add(venus)

  const moon = getPlanet({ size: 0.03, distance: 0.2, img: 'moon.png' })
  const earth = getPlanet({ children: [moon], size: 0.117, distance: 2.0, img: 'earth.png' })
  solarSystem.add(earth)

  const mars = getPlanet({ size: 0.07, distance: 2.25, img: 'mars.png' })
  solarSystem.add(mars)
  const jupiter = getPlanet({ size: 0.2, distance: 2.75, img: 'jupiter.png' })
  solarSystem.add(jupiter)

  const sRingGeo = new THREE.TorusGeometry(0.4, 0.15, 8, 64)
  const sRingMat = new THREE.MeshStandardMaterial()
  const saturnRing = new THREE.Mesh(sRingGeo, sRingMat)
  saturnRing.scale.z = 0.1
  saturnRing.rotation.x = Math.PI * 0.5
  const saturn = getPlanet({ children: [saturnRing], size: 0.15, distance: 3.25, img: 'saturn.png' })
  solarSystem.add(saturn)

  const uRingGeo = new THREE.TorusGeometry(0.35, 0.05, 8, 64)
  const uRingMat = new THREE.MeshStandardMaterial()
  const uranusRing = new THREE.Mesh(uRingGeo, uRingMat)
  uranusRing.scale.z = 0.1
  const uranus = getPlanet({ children: [uranusRing], size: 0.15, distance: 3.75, img: 'uranus.png' })
  solarSystem.add(uranus)

  const neptune = getPlanet({ size: 0.15, distance: 4.25, img: 'neptune.png' })
  solarSystem.add(neptune)

  const asteroidBelt = getAsteroidBelt(Array.from(scene.assets.values()))
  solarSystem.add(asteroidBelt)

  const starfield = getStarfield({ numStars: 500, size: 0.35 })
  scene.base.add(starfield)

  const dirLight = new THREE.DirectionalLight(0x0099FF, 1)
  dirLight.position.set(0, 1, 0)
  scene.base.add(dirLight)

  const nebula = getNebula({
    hue: 0.6,
    numSprites: 10,
    opacity: 0.2,
    radius: 40,
    size: 80,
    z: -50.5,
  })
  scene.base.add(nebula)
  scene.base.userData.cameraDistance = 5
  scene.base.userData.oldCameraDistance = scene.base.userData.cameraDistance
  scene.planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, asteroidBelt]
  scene.star = sun
  const lensFlareEffect = LensFlareEffect()
  scene.base.add(lensFlareEffect)
  
  scene.lensFlareFx = lensFlareEffect
}

function newScene1(): Scene {
  return {
    cameraMovement: rotateCamera,
    init: initScene,
    assets: ['Rock1', 'Rock2', 'Rock3'].map(s => `./meshes/rocks/${s}.obj`),
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
    paragraphPaths: range(1, 7).map(n => `text/slide1/${n}.html`),
    handleShot: () => {},
  }
}

export default newScene1
