import * as THREE from 'three';
import { getFresnelMat } from "../fx/fresnelMat";
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';

const getSun = (): THREE.Object3D<THREE.Object3DEventMap> => {
  const sunMat = new THREE.MeshStandardMaterial({
    emissive: 0x2e81db,
  });
  const geo = new THREE.IcosahedronGeometry(0.7, 6);
  const sun = new THREE.Mesh(geo, sunMat);

  const sunRimMat = getFresnelMat({ rimHex: 0xe4e8ff, facingHex: 0x000000 });
  const rimMesh = new THREE.Mesh(geo, sunRimMat);
  rimMesh.scale.setScalar(1.01);
  sun.add(rimMesh);


  const sunLight = new THREE.PointLight(0xe4e8ff, 10);
  sun.add(sunLight);
  sun.userData.update = (t: number) => {
    sun.rotation.y = t;
  };
  return sun;
}
export default getSun;