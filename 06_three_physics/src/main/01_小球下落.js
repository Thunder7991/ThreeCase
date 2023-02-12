import * as THREE from 'three';
// 目标: 使用annon引擎

//导入 物理cannon引擎
import * as CANNON from 'cannon-es'



//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//导入动画库
import gsap from 'gsap';
//导入dat.gui
import * as dat from 'dat.gui';

const gui = new dat.GUI();
//1.创建场景
const scene = new THREE.Scene();

//2.创建相机
//透视相机(角度,宽高比,近端,远端)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  300,
);
camera.position.set(0, 0, 18);
//3. 添加相机
scene.add(camera);

//创建求和平面
//球体在没有添加重力的时候是不会下降的, 所有需要添加cannon物理实现
const sphereGeometry = new THREE.SphereGeometry(1,20,20)
const sphereMaterial = new THREE.MeshStandardMaterial({
  color:"#ffffff" ,
  side: THREE.DoubleSide,
})
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
sphere.castShadow = true
scene.add(sphere)


//创建平面
const floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(20,20),new THREE.MeshStandardMaterial())
floor.receiveShadow = true
floor.position.set(0,-5,0)
floor.rotation.x = -Math.PI / 2
scene.add(floor)

//创建物理事件
// const world = new CANNON.World({gravity:9.8})

//设置物体材质
const sphereWorldMaterial = new CANNON.Material()
const world = new CANNON.World()
//添加重力
world.gravity.set(0,-9.8,0)
//创建物理小球形状
const sphereShape =new CANNON.Sphere(1)
//创建物理世界的物体
const sphereBody = new CANNON.Body({

  shape:sphereShape,
  position:new CANNON.Vec3(0,0,0),
  //小球质量
  mass:1,
  //添加物体材质
  material:sphereWorldMaterial

})
//将物体添加至物理世界
world.addBody(sphereBody)

// 灯光 : 环境光
const ambientLigth = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLigth);
//平行光
const DirectionLight = new THREE.DirectionalLight(0xffffff, 0.5);
DirectionLight.castShadow = true
scene.add(DirectionLight);

//初始化渲染器
let renderer = new THREE.WebGLRenderer({ alpha: true });
//开启阴影贴图
renderer.shadowMap.enabled = true;
// renderer.physicallyCorrectLights = true;
//渲染器透明

//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

//将webgl渲染到canvas内容到body中
document.body.appendChild(renderer.domElement);

//使用渲染器通过相机将场景渲染进去
renderer.render(scene, camera);

//创建轨道控制器
//参数 是相机 和 渲染元素
const controls = new OrbitControls(camera, renderer.domElement);

// //设置控制器阻尼,让控制器更有真实的效果, 必须在 动画循环中调用update
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
  // let time = clock.getElapsedTime();
  //获取时间差
  let deltaTime = clock.getDelta()
  //更新物理引擎世界的物体
  world.step(1/60,deltaTime)

  sphere.position.copy(sphereBody.position)
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

//监听滚动事件

