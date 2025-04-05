import * as THREE from 'three'
import { getFresnelMat } from '../fx/fresnelMat'

const texLoader = new THREE.TextureLoader()
const geo = new THREE.IcosahedronGeometry(1, 6)

export interface PlanetProps {
  children?: THREE.Object3D<THREE.Object3DEventMap>[]
  distance: number
  img: string
  size: number
}

function getPlanet({ children = [], distance = 0, img = '', size = 1 }: PlanetProps): THREE.Object3D<THREE.Object3DEventMap> {
  const orbitGroup = new THREE.Group()
  orbitGroup.rotation.x = Math.random() * Math.PI * 2

  const orbitPath = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(
      new THREE.EllipseCurve(0, 0, distance, distance, 0, Math.PI * 2, false, 0)
        .getPoints(100), // Number of segments
    ),
    new THREE.LineBasicMaterial({ color: 0x888888, linewidth: 1, opacity: 0.5 }),
  )
  orbitPath.rotation.x = Math.PI / 2 // Make it horizontal
  orbitGroup.add(orbitPath)

  const path = `./textures/${img}`
  const map = texLoader.load(path)
  const planetMat = new THREE.MeshStandardMaterial({
    map,
  })
  const planet = new THREE.Mesh(geo, planetMat)
  planet.scale.setScalar(size)

  const startAngle = Math.random() * Math.PI * 2
  planet.position.x = Math.cos(startAngle) * distance
  planet.position.z = Math.sin(startAngle) * distance

  const planetRimMat = getFresnelMat({ rimHex: 0xFFFFFF, facingHex: 0x000000 })
  const planetRimMesh = new THREE.Mesh(geo, planetRimMat)
  planetRimMesh.scale.setScalar(1.01)
  planet.add(planetRimMesh)

  children.forEach((child) => {
    child.position.x = Math.cos(startAngle) * distance
    child.position.z = Math.sin(startAngle) * distance
    orbitGroup.add(child)
  })

  const rate = Math.random() * 1 - 1.0
  orbitGroup.userData.update = (t: number) => {
    orbitGroup.rotation.y = t * rate
    children.forEach((child) => {
      child.userData.update?.(t)
    })
  }
  orbitGroup.add(planet)
  return orbitGroup
}

export default getPlanet
