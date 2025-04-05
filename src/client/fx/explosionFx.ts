import * as THREE from 'three'
import gsap from 'gsap';
import { SceneEx } from '../types';
import createStellarRemnant from './stellarRemnant';


const explode = (mesh: THREE.Mesh, scene: SceneEx) => {
  const {remnantMesh, remnantMaterial} = createStellarRemnant()
  scene.base.add(remnantMesh)
  gsap.timeline()
  .to(mesh.scale, {
      x: 0.0,
      y: 0.0,
      z: 0.0,
      duration: 0.5,
      ease: 'expo.in'
  })
  .then(() => {
    gsap.timeline()
  .to(remnantMaterial.uniforms.uScale, {
      value: 3,
      duration: 0.5,
      ease: 'expo.in'
  })
  })
}


export default explode