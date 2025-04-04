import * as THREE from 'three';
import { getFresnelMat } from "../fx/fresnelMat";
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';
import gsap from "gsap";
import { applyToMaterial, zip } from '../util';
import getParticles from '../fx/particles';
import { getParticleSystem } from '../fx/getParticleSystem';

function getCorona() {
  const radius = 0.6;
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff99,
    side: THREE.BackSide,
    transparent: true,
    opacity: 1,
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

const newSun = (camera: THREE.Camera, scene: THREE.Scene): THREE.Mesh => {
  const sunMat = new THREE.MeshStandardMaterial({
    emissive: 0x2e81db,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
  });

  const coreMat = new THREE.MeshStandardMaterial({
    emissive: 0xffffff,
    emissiveIntensity: 1.5, // Brighter core
    transparent: true,
    opacity: 0,
  });
  
  
  const layerColors = [0xff0000, 0xffa500, 0x2e81db, 0x0000ff, 0xffc0cb]
  const layerRadii = [0.59, 0.50, 0.40, 0.30, 0.20]

  const layerMats = zip([0.6, 0.5, 0.4, 0.3, 0], layerColors).map(x => new THREE.MeshStandardMaterial({
    emissive: x[1],
    emissiveIntensity: x[0],
    blending: THREE.AdditiveBlending, // Makes layers glow
    opacity: 0,
    transparent: true
  }))

  const geo = new THREE.IcosahedronGeometry(0.7, 6);
  const sun = new THREE.Mesh(geo, sunMat);

  
  const geoCore = new THREE.IcosahedronGeometry(0.10, 6);
  const layers = layerRadii.map(n => new THREE.IcosahedronGeometry(n, 6))
  
  // Core
  const coreMesh = new THREE.Mesh(geoCore, coreMat);
  sun.add(coreMesh);
  coreMesh.add(getParticles(0.15, 0xa19d94))
  
  // Layers with different colors & opacities
  const layerMeshParticles = zip(layers, layerColors, layerRadii).map(([layerGeo, color, radius], i) => {
    const layerMesh = new THREE.Mesh(layerGeo, layerMats[i]);
    layerMesh.userData.baseScale = 1 + i * 0.02; // Store original scale
    sun.add(layerMesh);
    const particles = getParticles(radius, color)
    layerMesh.add(particles)
    return particles
  });

  // Fresnel Rim Effect
  const sunRimMat = getFresnelMat({ rimHex: 0xe4e8ff, facingHex: 0x000000 });
  const rimMesh = new THREE.Mesh(geo, sunRimMat);
  rimMesh.scale.setScalar(1.01);
  sun.add(rimMesh);

  // Optional: Corona
  const coronaMesh = getCorona();
  sun.add(coronaMesh);

  // Light
  const sunLight = new THREE.PointLight(0xe4e8ff, 10);
  sun.add(sunLight);

  // ** Layer Animation Effect using GSAP **
  function animateLayers() {
    layers.forEach((layerGeo, i) => {
      const layerMesh = sun.children[i + 1] as THREE.Mesh; // Skip core (index 0)
      gsap.to(layerMesh.scale, {
        x: layerMesh.userData.baseScale * 1.1,
        y: layerMesh.userData.baseScale * 1.1,
        z: layerMesh.userData.baseScale * 1.1,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    });
  }
  
  animateLayers(); // Start layer animation

  // ** Update Function (Rotates and animates corona) **
  sun.userData.update = (t: number) => {
    sun.rotation.y = t;
    if (coronaMesh.userData.update) coronaMesh.userData.update(t);

    if (sun.userData.doParticleSystem)
      sun.userData.particleSystem.update(0.05)

  };

  
  sun.userData.material = sunMat;
  sun.userData.corona = coronaMesh;
  sun.userData.rim = rimMesh;
  sun.userData.core = coreMesh
  sun.userData.particleSystem = getParticleSystem({
    camera: camera,
    emitter: sun,
    parent: scene,
    rate: 50,
    texture: 'textures/circle.png',
    radius: 1
  })
  sun.userData.layerParticles = layerMeshParticles
  return sun;
};


export const startRedGiant = (sun: THREE.Mesh) => {
  if (sun) {
    gsap.to(sun.userData.material.emissive, {
      r: 0.8, g: 0.1, b: 0,
      duration: 6,
      repeat: 0,
      yoyo: false
    });

    gsap.to(sun.scale, { 
      x: 7, y: 7, z: 7, // Target scale (twice the size)
      duration: 6, // Expand over 3 seconds
      repeat: 0, // Loop infinitely
      yoyo: false, // Expand and shrink back
      ease: "power1.inOut" // Smooth transition
    });
  }
}

export const hideOuter = (star: THREE.Mesh, reversed: boolean = false) => {
  applyToMaterial(star, m => {
    gsap.to(m, { 
      opacity: reversed ? 1 : 0, // Target scale (twice the size)
      duration: 3, // Expand over 3 seconds
      repeat: 0, // Loop infinitely
      yoyo: false, // Expand and shrink back
      ease: "power1.inOut", // Smooth transition
      overwrite: true

    });

    m.depthTest = reversed
    m.depthWrite = reversed

  })

  applyToMaterial(star.userData.corona, m => {
    gsap.to(m, { 
      opacity: reversed ? 1 : 0, // Target scale (twice the size)
      duration: 3, // Expand over 3 seconds
      repeat: 0, // Loop infinitely
      yoyo: false, // Expand and shrink back
      ease: "power1.inOut", // Smooth transition
      overwrite: true
    });

    m.depthTest = reversed
    m.depthWrite = reversed
  })


  applyToMaterial(star.userData.rim, m => {
    gsap.to(m, { 
      opacity: reversed ? 1 : 0, // Target scale (twice the size)
      duration: 3, // Expand over 3 seconds
      repeat: 0, // Loop infinitely
      yoyo: false, // Expand and shrink back
      ease: "power1.inOut", // Smooth transition
      overwrite: true
    });

    m.depthTest = reversed
    m.depthWrite = reversed
  })
}


export const hideLayerMesh = (idx: number, star: THREE.Mesh, reversed: boolean = false) => {
  applyToMaterial(star.userData.layerParticles[idx], m => {
    gsap.to(m, { 
      opacity: 0, // Target scale (twice the size)
      duration: 3, // Expand over 3 seconds
      repeat: 0, // Loop infinitely
      yoyo: false, // Expand and shrink back
      ease: "power1.inOut", // Smooth transition
      overwrite: true
    });

    m.depthTest = reversed
    m.depthWrite = reversed
  })

}

export const contractCore = (star: THREE.Mesh, scale: number) => {
  gsap.to(star.userData.core.scale, { 
    x: scale, y: scale, z: scale,
    duration: 1.2, 
    repeat: 0, 
    yoyo: false,
    ease: "power1.inOut",
    overwrite: true
  });
}


export const startParticleSystem = (star: THREE.Mesh) => {
  star.userData.doParticleSystem = true
}


export default newSun;