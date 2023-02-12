import * as THREE from 'three';
// 目标: 掌握gsap动画效果

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//导入动画库
import gsap from 'gsap';
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

//4. 添加物体
//创建几何体
const cubeGeomerty = new THREE.BoxGeometry();
//添加材质
const cubeMterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

//根据几何体的材质创建物体
const cube = new THREE.Mesh(cubeGeomerty, cubeMterial);

//移动:修改物体的位置
cube.position.set(5, 0, 0);
cube.position.set(5, 0, 5);
//缩放
cube.scale.set(1, 3, 2);
//旋转
cube.rotation.set(Math.PI / 4, 0, 0);
//将几何体添加到场景中
scene.add(cube);

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

//添加坐标轴辅助器
//红色是X轴, 绿色是Y轴, 蓝色是Z轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

//设置时钟
let clock = new THREE.Clock();
//设置动画
console.log(cube.position);
gsap.to(cube.position, { x: 0, duration: 5 ,ease: "power1.inOut"});
gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5,ease: "power1.out" });

//添加渲染函数
function render() {
  renderer.render(scene, camera);
  //渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}
render();
