import * as THREE from 'three';
// 目标: 控制画面全屏

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
cube.rotation.set(Math.PI / 4, 0, 0, 'XZY');
//将几何体添加到场景中
scene.add(cube);
//创建gui
const gui = new dat.GUI();
gui
  .add(cube.position, 'x')
  .min(0)
  .max(5)
  .step(0.01)
  .name('移动X轴')
  .onChange((value) => {
    console.log(value);
  })
  .onFinishChange(() => {
    console.log('完全停止下来');
  });

//修改物体的颜色
const paramas = {
  color: '#ffff00',
  fn() {
    //让物体运动起来
    gsap.to(cube.position, { x: 1, duration: 2, yoyo: true, repeat: -1 });
  },
};
gui.addColor(paramas, 'color').onChange((val) => {
  console.log(val);
  cube.material.color.set(val);
});
//设置选项框
gui.add(cube, 'visible').name('是否显示');
//添加选项组
let folder = gui.addFolder('设置立方体');
folder.add(cube.material, 'wireframe');

//点击按钮触发某个事件
folder.add(paramas, 'fn').name('立方体运动');

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
