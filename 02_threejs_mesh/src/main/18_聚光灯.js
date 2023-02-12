import * as THREE from 'three';
// 目标: 聚光灯

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//导入动画库
import gsap from 'gsap';
//导入dat.gui
import * as dat from 'dat.gui';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
//灯光阴影
// 1. 材质要满足能够对光照的反应
//2. 设置源燃气开启阴影计算 renderer.shadowMap.enabled = true
//3. 设置光照投射阴影directionalLight.castShadow = true 平行光
//4. 设置物体投射阴影: sphere.castShadow =treu
//5. 设置物体接受阴影plane.receiveShadow = true

const gui = new dat.GUI();
//1.创建场景
const scene = new THREE.Scene();

//2.创建相机
//透视相机(角度,宽高比,近端,远端)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 0, 10);
//3. 添加相机
scene.add(camera);

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
});

const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.castShadow = true;
scene.add(sphere);
//创建平面
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const plane = new THREE.Mesh(planeGeometry, material);
plane.receiveShadow = true;
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

//灯光 : 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

//聚光灯
const spotLight = new THREE.SpotLight(0xffffff, 0.5);
spotLight.position.set(10, 10, 10);
//平行光开启阴影
spotLight.castShadow = true;
//调节亮度
spotLight.intensity = 2
//设置阴影模糊度
spotLight.shadow.radius = 10;
//定义阴影贴图的分辨率
spotLight.shadow.mapSize.set(4096, 4096);
spotLight.target = sphere;
spotLight.angle = Math.PI / 6
spotLight.distance = 0
spotLight.penumbra = 0 //光照衰减
spotLight.decay  = 0 //沿着光照距离衰减量
scene.add(spotLight)


gui
  .add(sphere.position,'x')
  .min(-5)
  .max(20)
  .step(0.1)
  .onChange(() => {
    //
    // spotLight.shadow.camera.updateProjectionMatrix();
  });

  gui
  .add(spotLight,'angle')
  .min(0)
  .max(Math.PI / 2)
  .step(0.1)
  .onChange(() => {
    //
    // spotLight.shadow.camera.updateProjectionMatrix();
  });

  gui
  .add(spotLight,'distance')
  .min(0)
  .max(20)
  .step(0.1)
  .onChange(() => {
    //
    // spotLight.shadow.camera.updateProjectionMatrix();
  });
  gui
  .add(spotLight,'penumbra')
  .min(0)
  .max(1)
  .step(0.1)
  .onChange(() => {
    //
    // spotLight.shadow.camera.updateProjectionMatrix();
  });
  gui
  .add(spotLight,'decay')
  .min(0)
  .max(5)
  .step(0.1)
  .onChange(() => {
    //
    // spotLight.shadow.camera.updateProjectionMatrix();
  });

//初始化渲染器
let renderer = new THREE.WebGLRenderer();
//开启阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true


//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

//将webgl渲染到canvas内容到body中
document.body.appendChild(renderer.domElement);

//使用渲染器通过相机将场景渲染进去
renderer.render(scene, camera);

//创建轨道控制器
//参数 是相机 和 渲染元素
const controls = new OrbitControls(camera, renderer.domElement);

//设置控制器阻尼,让控制器更有真实的效果, 必须在 动画循环中调用update
controls.enableDamping = true;
//添加坐标轴辅助器
//红色是X轴, 绿色是Y轴, 蓝色是Z轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//设置时钟
let clock = new THREE.Clock();

window.addEventListener('dblclick', function () {
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    //双击控制屏幕进入全屏,再次双击取消全屏
    //让画布对象全屏
    renderer.domElement.requestFullscreen();
  } else {
    //使用document对象退出
    document.exitFullscreen();
  }
});
//添加渲染函数
function render() {
  controls.update();
  renderer.render(scene, camera);
  //渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}
render();

//监听页面变化,更新渲染画面
window.addEventListener('resize', function () {
  //更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  //更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
