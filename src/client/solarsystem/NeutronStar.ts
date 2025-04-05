import * as THREE from 'three'

function newNeutronStar() {
  const starGeometry = new THREE.SphereGeometry(0.3, 64, 64)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0xFFFFFF) }, // Color of the glow
      intensity: { value: 2.0 }, // How intense the glow is
    },
    fragmentShader: `
        uniform float intensity;
        uniform vec3 glowColor;
        void main() {
            gl_FragColor = vec4(glowColor * intensity, 1.0);
        }
    `,
  })

  const pointLight = new THREE.PointLight(0xFFFFFF, 10, 100) // color: white, intensity: high
  pointLight.position.set(0, 0, 0) // center of the scene

  const starMesh = new THREE.Mesh(starGeometry, material)

  starMesh.add(pointLight)
  return starMesh
}

export default newNeutronStar
