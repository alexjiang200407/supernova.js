import * as THREE from 'three'


const createStellarRemnant = () => {
  const numParticles = 100000
  const vertices = []
  const randomForParticles = new Float32Array(numParticles * 3)

  for (let i = 0; i < numParticles; i++) {

      const x = THREE.MathUtils.randFloatSpread(10)//random float between -5 and 5
      const y = THREE.MathUtils.randFloatSpread(10)
      const z = THREE.MathUtils.randFloatSpread(10)

      vertices.push(x, y, z)

      randomForParticles.set([
          Math.random() * 2 - 1,// zero to 2 minus 1
          Math.random() * 2 - 1,// zero to 2 minus 1
          Math.random() * 2 - 1// zero to 2 minus 1

      ], i * 3)

  }

  const starsGeometry = new THREE.BufferGeometry()
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  starsGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randomForParticles, 3))

  const starsMaterial = new THREE.ShaderMaterial({
      uniforms: {
          uColor: { value: new THREE.Color(0x31c48D) },
          uColor1: { value: new THREE.Color(0x6C63FF) },
          uTime: { value: 0},
          uScale: { value: 0 }
      },
      vertexShader: `
// uniform type is used for the data that don't change among the vertices (are uniform)
uniform float uTime;
uniform float uScale;

// attribute type is used for the data that change among the vertices
attribute vec3 aRandom;

// varying  type is used to make a variable available in both vertex and fragment shader files
varying vec3 vPosition;


void main() {

    vPosition = position;

    vec3 pos = position;

    float time = uTime * 4.0;

    pos.x += sin(time * aRandom.x);
    pos.y += cos(time * aRandom.y);
    pos.z += cos(time * aRandom.z);

    pos *= uScale;

    // 1)postion our geometry - coordinates your object begins in.
    vec4 localPosition = vec4(pos, 1.0);

    // 2)transform the local coordinates to world-space coordinates
    vec4 worldPosition = modelMatrix * localPosition;
    
    // 3)transform the world coordinates to view-space coordinates - seen from the camera/viewer point of view
    vec4 viewPosition = viewMatrix * worldPosition;

    // 4)project view coordinates to clip coordinates and transform to screen coordinates
    vec4 clipPosition = projectionMatrix * viewPosition;

    gl_Position = clipPosition;

    gl_PointSize = 5.0 / clipPosition.z;

    //************ OR ****************//
    // everything in one line:

    //OPTION 1: 
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    //OPTION 2 (combine model and view matrices):
    // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
      
      
      `,
      fragmentShader: `
// uniform type is used for the data that don't change among the vertices (are uniform)
 uniform vec3 uColor;
 uniform vec3 uColor1;

// varying  type is used to make a variable available in both vertex and fragment shader files
varying vec3 vPosition;


void main() {

    //**** simple color - a vector of rgba
    // vec4 color = vec4(1., 0.0, .0, 1.);
    // gl_FragColor = color;
    //******

    //***** use mix function

    float depth = (vPosition.x + 5.) / 10.0;

    // vec3 color1 = vec3(1., 1.0, 1.0);
    // vec3 color2 = vec3(0., .0, 1.0);

    // vec3 mixedColor = mix(color1, color2, depth);
    vec3 mixedColor = mix(uColor, uColor1, depth);
    gl_FragColor = vec4(mixedColor, 1.0);
}      `,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending
  })


  const stars = new THREE.Points(starsGeometry, starsMaterial)

  stars.userData.update = (t: number) => {
    stars.material.uniforms.uTime.value = t
  }

  return {remnantMesh: stars, remnantMaterial: starsMaterial}
}



export default createStellarRemnant