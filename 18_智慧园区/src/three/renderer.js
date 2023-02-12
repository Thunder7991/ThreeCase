import * as THREE from "three";
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
renderer.toneMappingExposure = 1.5 

export default renderer;
