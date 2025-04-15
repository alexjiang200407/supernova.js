import * as THREE from 'three'
import { SceneData as Scene, SceneEx } from '../types'
import { nextSlide, rotateCamera } from '../scene'
import { range } from '../util'
import Gas, { startGasAnimation } from '../fx/gas';
import newSun from '../solarsystem/Star';
import gsap from 'gsap';



function init(scene: SceneEx, camera: THREE.Camera) {
  const gas = Gas(30, camera)
  scene.base.add(gas)
  scene.base.userData.gas = gas
}


function handleShot(scene: SceneEx, shotIdx: number) {
  if (shotIdx === 2) {
    startGasAnimation(scene.base.userData.gas)
  } else if (shotIdx === 3) {
    const stars: THREE.Mesh[] = [];
    const starGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 20; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);
  
      // Position stars randomly around the gas
      star.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      );
  
      // Set initial scale to zero
      star.scale.set(0, 0, 0);
  
      scene.base.add(star);
      stars.push(star);
    }
  
    scene.base.userData.stars = stars;
  
    stars.forEach((star, index) => {
      gsap.to(star.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        delay: index * 0.1, // staggered effect
        ease: "power2.out"
      });
    });
  }
}

function newScene10(): Scene {
  return {
    cameraMovement: rotateCamera,
    init,
    assets: [],
    cameraInit: (camera: THREE.Camera): void => {
    },
    update: (scene: SceneEx, time) => {
      scene.base.children.forEach((child) => {
        child.userData.update?.(time)
      })
    },
    next: nextSlide,
    paragraphPaths: range(1, 3).map(n => `text/slide10/${n}.html`),
    handleShot,
  }
}

export default newScene10
