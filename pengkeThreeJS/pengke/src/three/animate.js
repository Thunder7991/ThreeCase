import * as THREE from 'three';
import camera from './camera';
import renderer from './render';
import controls from './controls';
import scene from './scene';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';


//设置时钟
const clock = new THREE.Clock();

//添加渲染函数
function animate() {
 

}

//页面重绘动画
// setAnimationLoop : 每个可用帧都会调用的函数。 如果传入‘null’,所有正在进行的动画都会停止。
renderer.setAnimationLoop(() => {
    const time = clock.getElapsedTime();
    controls.update();
    TWEEN.update();
    // earth.totation.y += 0.001
  
    renderer.render(scene, camera);
})
export default animate;
