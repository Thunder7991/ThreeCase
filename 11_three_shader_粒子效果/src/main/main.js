import * as THREE from 'three';
// 目标: water

//导入 物理cannon引擎
import * as CANNON from 'cannon-es';

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//导入动画库
import gsap, { random } from 'gsap';
//导入dat.gui
import * as dat from 'dat.gui';

const gui = new dat.GUI();

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//导入 wtaer
import { Water } from 'three/examples/jsm/objects/Water2';

//顶点着色器
import vertexShader from '../shader/galaxy/vertex.glsl';
import fragmentShader from '../shader/galaxy/fragment.glsl';
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

//添加纹理材质
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('textures/particles/10.png');
const texture1 = textureLoader.load('textures/particles/11.png');
const texture2 = textureLoader.load('textures/particles/9.png');

// const geometry = new THREE.BufferGeometry()
// const position  = new Float32Array([0,0,0])

// geometry.setAttribute("position",new THREE.BufferAttribute(position,3))

//点材质
// const material = new THREE.PointsMaterial({
//   color:0xff0000,
//   size:1,
//   sizeAttenuation:true
// })

let geomery = null;
let material = null;
let points = null;
const params = {
  count: 10000,
  size: 0.1,
  radius: 5, //半径
  branch: 3, //分支
  color: '#ff6030',
  rotateScale: 0.3,
  endColor: '#1b3984',
};
const centerColor = new THREE.Color(params.color);
const endColor = new THREE.Color(params.endColor);

const generateGalaxy = () => {
  //生成顶点
  geomery = new THREE.BufferGeometry();
  //随机生成位置
  const positons = new Float32Array(params.count * 3);
  //设置顶点颜色
  const colors = new Float32Array(params.count * 3);

  const scales = new Float32Array(params.count);

  //图案属性
  const imgIndex = new Float32Array(params.count);

  //生成循环点
  for (let i = 0; i < params.count; i++) {
    //当前点应该在那一条分支的角度上
    //(i % params.branch) 在哪个分支
    // (2 * Math.PI / params.branch);  一个分支所在的度数
    const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch);
    //当前点距离圆心的位置
    const distance = Math.random() * params.radius * Math.pow(Math.random(), 3);
    let current = i * 3;
    //Math.pow  : 解决的是中间内聚的问题 立方
    // (params.radius-distance) /5:中心到末尾,慢慢的减少
    const randomX =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomY =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;
    const randomZ =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5;

    positons[current] =
      Math.cos(branchAngel + distance * params.rotateScale) * distance +
      randomX;
    positons[current + 1] = 0 + randomY;
    positons[current + 2] =
      Math.sin(branchAngel + distance * params.rotateScale) * distance +
      randomZ;

    //混合颜色, 形成渐变色
    const mixColor = centerColor.clone();
    //开始颜色到终点颜色渐变
    mixColor.lerp(endColor, distance / params.radius);
    colors[current] = mixColor.r;
    colors[current + 1] = mixColor.g;
    colors[current + 2] = mixColor.b;
    //顶点的大小
    scales[current] = Math.random();
    //根据索引值设置不同的图案
    imgIndex[current] = i % 3;
  
  }
  geomery.setAttribute('position', new THREE.BufferAttribute(positons, 3));
  geomery.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geomery.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
  geomery.setAttribute('imgIndex', new THREE.BufferAttribute(imgIndex, 1));

  //设置点材质
  // material = new THREE.PointsMaterial({
  //   // color: new THREE.Color(params.color),
  //   size: params.size, //点的大小
  //   sizeAttenuation: true, //相机深度而衰减
  //   depthWrite: false, //深度监测
  //   blending: THREE.AdditiveBlending, //混合模式
  //   map: particelsTexture,
  //   alphaMap: particelsTexture,
  //   transparent: true,

  //   vertexColors: true,
  // });
  material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    vertexColors: true,
    transparent: true,
    depthWrite: false, //深度监测
    blending: THREE.AdditiveBlending, //混合模式
    uniforms: {
      uTime:{
        vlaue:0
      },
      uTexture: {
        value: texture,
      },
      uTexture1: {
        value: texture1,
      },
      uTexture2: {
        value: texture2,
      },
      uColor:{
        value: centerColor
      }
    },
  });

  points = new THREE.Points(geomery, material);
  scene.add(points);
};
generateGalaxy();

// const  material = new THREE.ShaderMaterial({
//   vertexShader:vertexShader,
//   fragmentShader:fragmentShader,
//   transparent:true,
//   uniforms:{
//     uTexture: {
//       value:texture
//     }
//   }
// })

//生成点
// const points = new THREE.Points(geometry,material)
// scene.add(points)

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
  material.uniforms.uTime.value = time;
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
