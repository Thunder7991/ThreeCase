import * as THREE from 'three'
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  50000
)
camera.position.set(5, 10, 15)

export default camera
