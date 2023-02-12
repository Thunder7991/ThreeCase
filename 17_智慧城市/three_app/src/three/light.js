import * as THREE from 'three'

// 灯光 : 环境光
const ambientLigth = new THREE.AmbientLight(0xffffff, 0.5)

// 平行光
const directionLight = new THREE.DirectionalLight(0xff0000, 1)

export default { directionLight, ambientLigth }
