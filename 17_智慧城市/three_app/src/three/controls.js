import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import camera from './camera'
import renderer from './renderer'
const controls = new OrbitControls(camera, renderer.domElement)
// //设置控制器阻尼,让控制器更有真实的效果, 必须在 动画循环中调用update
controls.enableDamping = true
// 设置自动旋转
controls.autoRotate = true
controls.autoRotateSpeed = 0.2
export default controls
