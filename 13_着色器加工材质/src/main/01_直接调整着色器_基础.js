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
import  {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'



//顶点着色器
import flyVertexShader from '../shader/flylight/vertex.glsl';
import flyFragmentShader from '../shader/flylight/fragment.glsl';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

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
camera.position.set(0, 0, 18);
//3. 添加相机
scene.add(camera);








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
//设置编码格式
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMapping = THREE.ReinhardToneMapping

//曝光程度
renderer.toneMappingExposure = 0.2;

//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

//将webgl渲染到canvas内容到body中
document.body.appendChild(renderer.domElement);

//使用渲染器通过相机将场景渲染进去
renderer.render(scene, camera);

const plane = new THREE.PlaneBufferGeometry(2,2)
const planeMaterial = new THREE.MeshBasicMaterial()
const baseUniform = {
    uTime : {
      value:0
    }
}
planeMaterial.onBeforeCompile = (shader,renderer) => {
  console.log(shader);
  console.log(renderer);
  shader.uniforms.uTime =  baseUniform.uTime;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `#include <common>
    uniform float uTime;
    `
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
      #include <begin_vertex>
      transformed.x += sin(uTime) *2.0;
      transformed.z += cos(uTime)*2.0;
    `
  )
}
const planeMesh = new THREE.Mesh(plane,planeMaterial)
scene.add(planeMesh)



//创建轨道控制器
//参数 是相机 和 渲染元素
const controls = new OrbitControls(camera, renderer.domElement);

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
  // shaderMaterial.uniforms.uTime.value = time;
  controls.update();
  baseUniform.uTime.value = time

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

//模型加载
const gltfLoader = new GLTFLoader()
gltfLoader.load("./models/LeeperrySmith/LeePerrySmith.glb",(gltf) => {
  console.log(gltf);
  const mesh = gltf.scene.children[0]
  scene.add(mesh) 
})


