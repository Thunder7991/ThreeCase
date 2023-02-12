import * as THREE from 'three';
// 目标: 监听小球碰撞事件

//导入 物理cannon引擎
import * as CANNON from 'cannon-es';

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
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: '#ffffff',
});
const cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
cube.castShadow = true;
scene.add(cube);

//创建平面
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
  }),
);
floor.receiveShadow = true;
floor.position.set(0, -5, 0);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

//创建物理事件
// const world = new CANNON.World({gravity:9.8})

const world = new CANNON.World();
//添加重力
world.gravity.set(0, -9.8, 0);
//创建物理小球形状
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5,0.5,0.5));
//设置物体材质
const cubeWorldMaterial = new CANNON.Material("cube");

//创建物理世界的物体
const cubeBody = new CANNON.Body({
  shape: cubeShape,
  position: new CANNON.Vec3(0, 0, 0),
  //小球质量
  mass: 1,
  //添加物体材质
  material: cubeWorldMaterial,
});

//将物体添加至物理世界
world.addBody(cubeBody);

//创建击打声音
const hitSound = new Audio('assets/sound.mp3')
//添加监听小区碰撞事件
function HitEvent(e) {
    console.log(e);
    // 获取撞击强度
    const impactStrength = e.contact.getImpactVelocityAlongNormal()
    if (impactStrength>5) {
      hitSound.currentTime  = 0
      hitSound.play()
    }
}
cubeBody.addEventListener("collide",HitEvent)

//物理物理平面形状
const floorShap = new CANNON.Plane();
//创建物理平面物体
const floorBody = new CANNON.Body();
const floorMaterial = new CANNON.Material("floor")
floorBody.material  = floorMaterial

//mass 当质量为0的时候, 可以使得物体保持不动
floorBody.mass = 0
floorBody.addShape(floorShap)
//地面位置
floorBody.position.set(0,-5,0)
//旋转地面的位置
//沿着X轴,旋转
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2)
world.addBody(floorBody)

//设置两种材质碰撞参数
const defaultContactMaterial = new CANNON.ContactMaterial(
  cubeWorldMaterial,
  floorMaterial,
  {
      friction:0.1,//摩擦力
      restitution:0.7 //弹性
  }
)
//将材料的关联设置添加到物理世界
world.addContactMaterial(defaultContactMaterial)

// 灯光 : 环境光
const ambientLigth = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLigth);
//平行光
const DirectionLight = new THREE.DirectionalLight(0xffffff, 0.5);
DirectionLight.castShadow = true;
scene.add(DirectionLight);

//初始化渲染器
let renderer = new THREE.WebGLRenderer({ alpha: true });
//开启阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
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
  let deltaTime = clock.getDelta();
  //更新物理引擎世界的物体
  world.step(1 / 60, deltaTime);

  cube.position.copy(cubeBody.position);
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
