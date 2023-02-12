import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import camera  from './camera'
import renderer from './render'
const controls = new OrbitControls(camera, renderer.domElement)

//设置控制器阻尼, 让控制器具有更加真实的效果, 必须在 动画循环中调用update
controls.enableDamping = true

//设置自动旋转 false
controls.autoRotate = false
controls.autoRotateSpeed = 0.2

export default controls