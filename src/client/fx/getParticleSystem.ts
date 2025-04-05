import * as THREE from 'three'

const _VS = `
uniform float pointMultiplier;

attribute float size;
attribute float angle;
attribute vec4 aColor;

varying vec4 vColor;
varying vec2 vAngle;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * pointMultiplier / gl_Position.w;

  vAngle = vec2(cos(angle), sin(angle));
  vColor = aColor;
}`

const _FS = `
uniform sampler2D diffuseTexture;

varying vec4 vColor;
varying vec2 vAngle;

void main() {
  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
  gl_FragColor = texture2D(diffuseTexture, coords) * vColor;
}`

function getLinearSpline<T>(
  lerp: (t: number, a: T, b: T) => T,
): {
    addPoint: (t: number, d: T) => void
    getValueAt: (t: number) => T
  } {
  const points: [number, T][] = []

  function addPoint(t: number, d: T) {
    points.push([t, d])
  }

  function getValueAt(t: number): T {
    let p1 = 0
    for (let i = 0; i < points.length; i++) {
      if (points[i][0] >= t)
        break
      p1 = i
    }
    const p2 = Math.min(points.length - 1, p1 + 1)
    if (p1 === p2)
      return points[p1][1]
    return lerp(
      (t - points[p1][0]) / (points[p2][0] - points[p1][0]),
      points[p1][1],
      points[p2][1],
    )
  }

  return { addPoint, getValueAt }
}

// Particle interface
interface Particle {
  position: THREE.Vector3
  size: number
  currentSize?: number
  colour: THREE.Color
  alpha: number
  life: number
  maxLife: number
  rotation: number
  rotationRate: number
  velocity: THREE.Vector3
}

// Params for emitter
interface ParticleSystemParams {
  camera: THREE.Camera
  emitter: THREE.Mesh
  parent: THREE.Scene
  rate: number
  texture: string
  radius?: number
  maxLife?: number
  maxSize?: number
  maxVelocity?: number
}

function getParticleSystem({
  camera,
  emitter,
  parent,
  rate,
  texture,
  radius = 0.5,
  maxLife = 1.5,
  maxSize = 0.15,
  maxVelocity = 0.5,
}: ParticleSystemParams): { update: (dt: number) => void, state: { enabled: boolean } } {
  const uniforms = {
    diffuseTexture: {
      value: new THREE.TextureLoader().load(texture),
    },
    pointMultiplier: {
      value: window.innerHeight / (2.0 * Math.tan((30.0 * Math.PI) / 180.0)),
    },
  }

  const _material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: _VS,
    fragmentShader: _FS,
  })

  let _particles: Particle[] = []

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3))
  geometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1))
  geometry.setAttribute('aColor', new THREE.Float32BufferAttribute([], 4))
  geometry.setAttribute('angle', new THREE.Float32BufferAttribute([], 1))

  const _points = new THREE.Points(geometry, _material)
  parent.add(_points)

  // Splines
  const alphaSpline = getLinearSpline<number>((t, a, b) => a + t * (b - a))
  alphaSpline.addPoint(0.0, 0.0)
  alphaSpline.addPoint(0.6, 1.0)
  alphaSpline.addPoint(1.0, 0.0)

  const colorSpline = getLinearSpline<THREE.Color>((t, a, b) => a.clone().lerp(b, t))
  colorSpline.addPoint(0.0, new THREE.Color(0xFFFFFF))
  colorSpline.addPoint(1.0, new THREE.Color(0xFF8080))

  const sizeSpline = getLinearSpline<number>((t, a, b) => a + t * (b - a))
  sizeSpline.addPoint(0.0, 0.0)
  sizeSpline.addPoint(0.4, 0.5)
  sizeSpline.addPoint(1.0, 0.0)

  let _accumulator = 0

  function _AddParticles(timeElapsed: number) {
    _accumulator += timeElapsed
    const n = Math.floor(_accumulator * rate)
    _accumulator -= n / rate

    for (let i = 0; i < n; i++) {
      const life = (Math.random() * 0.75 + 0.25) * maxLife
      _particles.push({
        position: new THREE.Vector3(
          (Math.random() * 2 - 1) * radius,
          (Math.random() * 2 - 1) * radius,
          (Math.random() * 2 - 1) * radius,
        ).add(emitter.position.clone()),
        size: (Math.random() * 0.5 + 0.5) * maxSize,
        colour: new THREE.Color(),
        alpha: 1.0,
        life,
        maxLife: life,
        rotation: Math.random() * 2 * Math.PI,
        rotationRate: Math.random() * 0.01 - 0.005,
        velocity: new THREE.Vector3(
          (Math.random() * 2 - 1) * maxVelocity,
          (Math.random() * 2 - 1) * maxVelocity,
          (Math.random() * 2 - 1) * maxVelocity,
        ),
      })
    }
  }

  function _UpdateParticles(timeElapsed: number) {
    _particles = _particles.filter(p => (p.life -= timeElapsed) > 0)

    for (const p of _particles) {
      const t = 1.0 - p.life / p.maxLife
      p.rotation += p.rotationRate
      p.alpha = alphaSpline.getValueAt(t)
      p.currentSize = p.size * sizeSpline.getValueAt(t)
      p.colour.copy(colorSpline.getValueAt(t))
      p.position.add(p.velocity.clone().multiplyScalar(timeElapsed))

      const drag = p.velocity.clone().multiplyScalar(timeElapsed * 0.1)
      drag.x = Math.sign(p.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(p.velocity.x))
      drag.y = Math.sign(p.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(p.velocity.y))
      drag.z = Math.sign(p.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(p.velocity.z))
      p.velocity.sub(drag)
    }

    _particles.sort(
      (a, b) => camera.position.distanceTo(b.position) - camera.position.distanceTo(a.position),
    )
  }

  function _UpdateGeometry() {
    const positions: number[] = []
    const sizes: number[] = []
    const colours: number[] = []
    const angles: number[] = []

    for (const p of _particles) {
      positions.push(p.position.x, p.position.y, p.position.z)
      sizes.push(p.currentSize ?? 1)
      colours.push(p.colour.r, p.colour.g, p.colour.b, p.alpha)
      angles.push(p.rotation)
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
    geometry.setAttribute('aColor', new THREE.Float32BufferAttribute(colours, 4))
    geometry.setAttribute('angle', new THREE.Float32BufferAttribute(angles, 1))

    geometry.attributes.position.needsUpdate = true
    geometry.attributes.size.needsUpdate = true
    geometry.attributes.aColor.needsUpdate = true
    geometry.attributes.angle.needsUpdate = true
  }

  const state = { enabled: false }

  function update(dt: number) {
    if (state.enabled) {
      _AddParticles(dt)
    }
    _UpdateParticles(dt)
    _UpdateGeometry()
  }

  return { update, state }
}

export { getParticleSystem }
