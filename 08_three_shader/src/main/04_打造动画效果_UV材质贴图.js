import * as THREE from 'three';
// 目标: 打造动画效果 / UV采样贴图

//导入 物理cannon引擎
import * as CANNON from 'cannon-es';

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//导入动画库
import gsap from 'gsap';
//导入dat.gui
import * as dat from 'dat.gui';

const gui = new dat.GUI();

//顶点着色器
import basicVertexShader from '../shader/raw/vertex.glsl';
import basicFragmentShader from '../shader/raw/fragment.glsl';
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
camera.position.set(0, 0, 18);
//3. 添加相机
scene.add(camera);

//添加纹理加载器对象
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load("./textures/ca.jpeg")
const params = {
  uFrequency:10,
  uScale:0.1,
}


//创建平面
const plane = new THREE.PlaneBufferGeometry(1, 1,64,64);
//设置物体材质
// let planeMaterial = new THREE.MeshBasicMaterial({
//   color:'#00ff00',
//   side:THREE.DoubleSide
// })
//创建原始着色器材质
const RawshaderMaterial = new THREE.RawShaderMaterial({
  //顶点位置
  vertexShader: basicVertexShader,
  //顶点颜色
  fragmentShader: basicFragmentShader,
  side: THREE.DoubleSide,
  // wireframe:true
  //传递相关参数
  uniforms:{
    uTime:{
      value:0,
    },
    uTexture:{
      value:texture
    }
  },
  
});
const planeMesh = new THREE.Mesh(plane, RawshaderMaterial);
console.log(planeMesh);
planeMesh.position.set(0, 0, 2);
scene.add(planeMesh);

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
renderer.physicallyCorrectLights = false;
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
  let time = clock.getElapsedTime();
  RawshaderMaterial.uniforms.uTime.value = time
  //获取时间差
  // let deltaTime = clock.getDelta();
  // console.log(deltaTime);
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
