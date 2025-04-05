import * as THREE from 'three'

function getParticles(radius: number, color: THREE.ColorRepresentation) {
  const particleCount = 5000
  const particlesGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    // Generate random points inside a sphere
    const r = Math.cbrt(Math.random()) * radius // Cube root for uniform density
    const theta = Math.random() * Math.PI * 2 // Random angle around the sphere
    const phi = Math.acos(2 * Math.random() - 1) // Random elevation angle

    // Convert spherical coordinates to Cartesian (x, y, z)
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)

    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const particlesMaterial = new THREE.PointsMaterial({
    color,
    size: 0.05,
    transparent: true,
    opacity: 1,
  })

  const particles = new THREE.Points(particlesGeometry, particlesMaterial)
  particles.renderOrder = -1
  // Update function to move particles while keeping them inside the sphere
  particles.userData.update = (_: number) => {
    const positions = particlesGeometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      // Slight jitter in all directions
      positions[i] += (Math.random() - 0.5) * 0.002
      positions[i + 1] += (Math.random() - 0.5) * 0.002
      positions[i + 2] += (Math.random() - 0.5) * 0.002

      // Keep particle inside the core radius
      const dist = Math.sqrt(
        positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2,
      )

      if (dist > radius) {
        const scale = radius / dist
        positions[i] *= scale
        positions[i + 1] *= scale
        positions[i + 2] *= scale
      }
    }
    particlesGeometry.attributes.position.needsUpdate = true
  }

  return particles
}

export default getParticles
