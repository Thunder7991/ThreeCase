import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
  // depthbuffer 深度监测
  logarithmicDepthBuffer:true,
  //物理灯光渲染模式
  physicallyCorrectLights: true,
});
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
//调整映射方式, 电影形式
renderer.toneMapping = THREE.ACESFilmicToneMapping
//曝光度
renderer.toneMappingExposure = 0.8

//创建css3d渲染
const css3dRender =  new CSS3DRenderer()
css3dRender.setSize(window.innerWidth,window.innerHeight)
document.querySelector("#cssrender").appendChild(css3dRender.domElement)


export  {renderer,css3dRender};
