import * as THREE from 'three';
import { getFresnelMat } from "../fx/fresnelMat";
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';

function getCorona() {
  const radius = 0.6;
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff99,
    side: THREE.BackSide,
  });
  const geo = new THREE.IcosahedronGeometry(radius, 6);
  const mesh = new THREE.Mesh(geo, material);
  const noise = new ImprovedNoise();

  let v3 = new THREE.Vector3();
  let p = new THREE.Vector3();
  let pos = geo.attributes.position;
  const len = pos.count;

  function update(t: number) {
    for (let i = 0; i < len; i += 1) {
      p.fromBufferAttribute(pos, i).normalize();
      v3.copy(p).multiplyScalar(3.0);
      let ns = noise.noise(v3.x + Math.cos(t), v3.y + Math.sin(t), v3.z + t);
      v3.copy(p)
        .setLength(radius)
        .addScaledVector(p, ns * 0.4);
      pos.setXYZ(i, v3.x, v3.y, v3.z);
    }
    pos.needsUpdate = true;
  }
  mesh.userData.update = update;
  return mesh;
}

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

  const coronaMesh = getCorona();
  sun.add(coronaMesh);

  const sunLight = new THREE.PointLight(0xe4e8ff, 10);
  sun.add(sunLight);
  sun.userData.update = (t: number) => {
    sun.rotation.y = t;
    coronaMesh.userData.update(t)
  };
  return sun;
}
export default getSun;