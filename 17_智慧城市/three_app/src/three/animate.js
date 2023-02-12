import * as THREE from 'three'
import camera from '@/three/camera'
import renderer from '@/three/renderer'
import controls from '@/three/controls'
import scene from './scene'
// 设置时钟
const clock = new THREE.Clock()
// 添加渲染函数
function animate () {
  const time = clock.getElapsedTime()
  // customUniforms.uTime.value = time;
  controls.update()
  renderer.render(scene, camera)
  // 渲染下一帧的时候就会调用render函数
  requestAnimationFrame(animate)
}
export default animate
