import * as THREE from 'three';
// 目标: 详解环境贴图

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//导入动画库
import gsap from 'gsap';
//导入dat.gui
import * as dat from 'dat.gui';
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

//设置cube纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  './textures/environmentMaps/1/px.jpg',
  './textures/environmentMaps/1/nx.jpg',
  './textures/environmentMaps/1/py.jpg',
  './textures/environmentMaps/1/ny.jpg',
  './textures/environmentMaps/1/pz.jpg',
  './textures/environmentMaps/1/nz.jpg',
]);
const sphereGeometry = new THREE.SphereGeometry(1,20,20);
const material = new THREE.MeshStandardMaterial({
  metalness:0.7,//金属度
  roughness:0.1,//光滑
  envMap:envMapTexture,//环境贴图
})
const sphere  = new THREE.Mesh(sphereGeometry,material)
scene.add(sphere)
//灯光 : 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

//直线光源 平行光:
const directionalight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalight.position.set(10, 10, 10);
scene.add(directionalight);

//初始化渲染器
let renderer = new THREE.WebGLRenderer();

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
