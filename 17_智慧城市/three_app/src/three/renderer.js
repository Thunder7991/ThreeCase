import * as THREE from 'three'
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true// 抗锯齿
})
// 开启阴影贴图
renderer.shadowMap.enabled = true
// renderer.physicallyCorrectLights = true

// renderer.toneMappingExposure = 0.1

renderer.setSize(window.innerWidth, window.innerHeight)

export default renderer
