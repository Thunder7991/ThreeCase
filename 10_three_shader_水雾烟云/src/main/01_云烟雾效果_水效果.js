import * as THREE from 'three';
// 目标: 云烟雾效果_水效果

//导入 物理cannon引擎
import * as CANNON from 'cannon-es';

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//导入动画库
import gsap, { random } from 'gsap';
//导入dat.gui
import * as dat from 'dat.gui';

const gui = new dat.GUI();



//顶点着色器
import vertexShader from '../shader/water/vertex.glsl';
import fragmentShader from '../shader/water/fragment.glsl';
import { ShadowMaterial } from 'three';
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

const params = {
  //频率
  uWaresFrequency: 14,
  uScale: 0.03,
  uXzScale: 1.5,
  uNoiseFrequency: 10, //噪声频率
  uNoiseScale: 1.5, //噪声缩放
  uLowColor: '#ff0000',
  uHightColor: '#ffff00',
  uZspeed:1,
  uNoiseSpeed:1,
  uOpacity:1,
  uXspeed:1,
}

//添加shaderMaterial
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  transparent: true,
  uniforms: {
    uWaresFrequency: {
      value: params.uWaresFrequency,
    },
    uScale: {
      value: params.uScale,
    },
    uNoiseFrequency: { value: params.uNoiseFrequency },
    uNoiseScale: {
      value: params.uNoiseScale,
    },
    uXzScale: {
      value: params.uXzScale,
    },
    uTime: {
      value: 0,
    },
    uLowColor: {
      value: new THREE.Color(params.uLowColor),
    },
    uHightColor: {
      value: new THREE.Color(params.uHightColor),
    },
    uXspeed: {
      value: 1,
    }, //X轴水流速度
    uZspeed: {
      value: 1,
    }, //Z轴水流速度
    uNoiseSpeed: {
      value: 1,
    },
    uOpacity: {
      value: 1,
    },
  },
});

//添加平面
const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1, 1024, 1024),
  shaderMaterial,
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

//添加gui
gui
  .add(params, 'uWaresFrequency')
  .min(1)
  .max(100)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uWaresFrequency.value = value;
  });

gui
  .add(params, 'uScale')
  .min(0)
  .max(0.2)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uScale.value = value;
  });

gui
  .add(params, 'uNoiseFrequency')
  .min(0)
  .max(100)
  .step(1)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseFrequency.value = value;
  });

gui
  .add(params, 'uNoiseScale')
  .min(0)
  .max(5)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseScale.value = value;
  });

gui
  .add(params, 'uXzScale')
  .min(0)
  .max(5)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uXzScale.value = value;
  });

gui.addColor(params, 'uLowColor').onFinishChange((value) => {
  shaderMaterial.uniforms.uLowColor.value = new THREE.Color(value);
});

gui.addColor(params, 'uHightColor').onFinishChange((value) => {
  shaderMaterial.uniforms.uHightColor.value = new THREE.Color(value);
});
gui
  .add(params, 'uXspeed')
  .min(0)
  .max(5)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uXspeed.value = value;
  });
gui
  .add(params, 'uOpacity')
  .min(0)
  .max(1)
  .step(0.01)
  .onChange((value) => {
    shaderMaterial.uniforms.uOpacity.value = value;
  });

gui
  .add(params, 'uNoiseSpeed')
  .min(0)
  .max(5)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uNoiseSpeed.value = value;
  });

gui
  .add(params, 'uZspeed')
  .min(0)
  .max(5)
  .step(0.1)
  .onChange((value) => {
    shaderMaterial.uniforms.uZspeed.value = value;
  });

//添加纹理加载器对象
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./assets/');

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
//设置编码格式
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMapping = THREE.ReinhardToneMapping

//曝光程度
renderer.toneMappingExposure = 1;

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
  shaderMaterial.uniforms.uTime.value = time;
  // controls.update();
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
