import * as THREE from 'three';
// 目标: 认识points, 点材质

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//导入动画库
import gsap from 'gsap';
//导入dat.gui
import * as dat from 'dat.gui';
import { PointsMaterial } from 'three';



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

//创建球几何体
const sphereGeometry = new THREE.SphereGeometry(3, 30, 30);
// const material = new THREE.MeshBasicMaterial({
//   color: 0xff0000,
//   wireframe: true,
// });
//创建点材质
const pointMaterial = new THREE.PointsMaterial()
pointMaterial.size = 0.1
pointMaterial.color.set(0xff0000)
//相机深度而衰减
pointMaterial.sizeAttenuation = true
//载入纹理
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load("./textures/particles/2.png")
//设置点材质纹理
pointMaterial.map = texture
//透明贴图
pointMaterial.alphaMap = texture
//允许透明
pointMaterial.transparent = true
//深度监测
pointMaterial.depthWrite = false
//设置需要使用何种混合模式 (相加模式)
pointMaterial.blending = THREE.AdditiveBlending
const points = new THREE.Points(sphereGeometry,pointMaterial);
scene.add(points);
//灯光 : 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

//点光源
const pointLight = new THREE.PointLight(0xff0000, 1);
pointLight.position.set(2, 2, 2);

scene.add(pointLight);

//初始化渲染器
let renderer = new THREE.WebGLRenderer();
//开启阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;

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
