import * as THREE from 'three';
// 目标: 着色器飞灯

//导入 物理cannon引擎
import * as CANNON from 'cannon-es';

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//导入动画库
import gsap, { random } from 'gsap';
//导入dat.gui
import * as dat from 'dat.gui';

const gui = new dat.GUI();

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CSS2DObject,CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer.js"
 
//1.创建场景
const scene = new THREE.Scene();

//2.创建相机
//透视相机(角度,宽高比,近端,远端)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1000,
);
camera.position.set(0, 0, -10);
//3. 添加相机
scene.add(camera);

const textureLoader = new THREE.TextureLoader();
//添加地球
const earthGeometry = new THREE.SphereGeometry(1, 16, 16);
const earthMaterial = new THREE.MeshPhongMaterial({
  specular: 0x333333,
  shininess: 5,
  map: textureLoader.load('textures/planets/earth_atmos_2048.jpg'),
  specularMap: textureLoader.load('textures/planets/earth_specular_2048.jpg'),
  normalMap: textureLoader.load('textures/planets/earth_normal_2048.jpg'),
  normalScale: new THREE.Vector2(0.85, 0.85),
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);
// earth.rotation.y = Math.PI
scene.add(earth);
//添加月球
const moonGeometry = new THREE.SphereGeometry(0.27, 16, 16);
const moonMaterial = new THREE.MeshPhongMaterial({
  shininess: 5,
  map: textureLoader.load('textures/planets/moon_1024.jpg'),
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);

scene.add(moon);

//Create a closed wavey loop
const curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( -10, 0, 10 ), //起点
	new THREE.Vector3( -5, 5, 5 ),
	new THREE.Vector3( 0, 0, 0 ), //穿过圆心
	new THREE.Vector3( 5, -5, 5 ),
	new THREE.Vector3( 10, 0, 10 ) //终点
] ,true);

//在曲线里获取51
const points = curve.getPoints( 500 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );

const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

// Create the final object to add to the scene
const curveObject = new THREE.Line( geometry, material );
scene.add(curveObject)

//添加提示标签
const earthDiv = document.createElement("div")
earthDiv.className = "label"
earthDiv.innerHTML = "地球"
const earthLabel = new CSS2DObject(earthDiv)
earthLabel.position.set(0,1,0)
earth.add(earthLabel)

//添加提示标签
const moonDiv = document.createElement("div")
moonDiv.className = "label"
moonDiv.innerHTML = "月球"
const moonLabel = new CSS2DObject(moonDiv)
moonLabel.position.set(0,1,0)
moon.add(moonLabel)

//中国
const chinaDiv = document.createElement("div")
chinaDiv.className = "label1"
chinaDiv.innerHTML = "中国"
const chinaLabel = new CSS2DObject(chinaDiv)

chinaLabel.position.set(-0.3,0.5,-0.9);

earth.add(chinaLabel)


//实例化css2d渲染器
const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(labelRenderer.domElement)

labelRenderer.domElement.style.position = "fixed"
labelRenderer.domElement.style.top = "0px"
labelRenderer.domElement.style.left = "0px"
labelRenderer.domElement.style.zIndex = "99"


//实例化摄像 声明射线
const raycaster = new THREE.Raycaster()
//监测射线碰撞
// chinaLabel



// 灯光 : 环境光
const ambientLigth = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLigth);
//平行光
const DirectionLight = new THREE.DirectionalLight(0xffffff, 1);
DirectionLight.position.set(0, 0, -40);

DirectionLight.castShadow = false;
scene.add(DirectionLight);
//初始化渲染器
let renderer = new THREE.WebGLRenderer({ alpha: true });
//开启阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping; //电影级别
renderer.toneMappingExposure = 1.0;

//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

//将webgl渲染到canvas内容到body中
document.body.appendChild(renderer.domElement);

//使用渲染器通过相机将场景渲染进去
renderer.render(scene, camera);


//创建轨道控制器
//参数 是相机 和 渲染元素
const controls = new OrbitControls(camera, labelRenderer.domElement);
// //设置控制器阻尼,让控制器更有真实的效果, 必须在 动画循环中调用update
controls.enableDamping = true;
//设置自动旋转
controls.autoRotate = true;
controls.autoRotateSpeed = 0.2;
//你能够垂直旋转的角度的上限，范围是0到Math.PI，其默认值为Math.PI。
// controls.maxPolarAngle = (Math.PI / 4) * 3;
// controls.minPolarAngle = (Math.PI / 4) * 2.8;
//添加坐标轴辅助器
//红色是X轴, 绿色是Y轴, 蓝色是Z轴
const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

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

  labelRenderer.setSize(window.innerWidth,window.innerHeight)
});

//添加渲染函数
function render() {
  let time = clock.getElapsedTime();

  controls.update();
  //获取时间差
  // let deltaTime = clock.getDelta();
  // moon.position.set(Math.sin(time) * 5, 0, Math.cos(time) * 5);
  renderer.render(scene, camera);
  //文字渲染器也需要同时更新

  //渲染下一帧的时候就会调用render函数
  //拷贝一份 方便 labelDistance
  const chinaPosition = chinaLabel.position.clone()
  //计算出标签到相机的距离 
  const labelDistance = chinaPosition.distanceTo(camera.position)
  //监测标签渲染
  //获取 NDC空间坐标
  chinaPosition.project(camera);
  raycaster.setFromCamera(chinaPosition,camera)
  const intersects = raycaster.intersectObjects(scene.children,true)
  console.log(intersects);
  
  //如果没有碰撞到任何物体 那么让标签显示
  if (intersects.length == 0) {
    chinaLabel.element.classList.add("visible")
  }else {

    const minDistance = intersects[0].distance;
    if (minDistance < labelDistance) {
      chinaLabel.element.classList.remove("visible")
    }else {
      chinaLabel.element.classList.add("visible")
    }
 

  }
  labelRenderer.render(scene,camera)

  //获取曲线
  //获取时间 从 0-1
  const remainderTime = time/10 % 1
  console.log(remainderTime);
  const point =  curve.getPoint(remainderTime)
  moon.position.copy(point)

  //绑定摄像机
  camera.position.copy(point)
  camera.lookAt(earth.position)
  requestAnimationFrame(render);
}
render();
