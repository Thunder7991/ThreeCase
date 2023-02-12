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

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

//顶点着色器
import flyVertexShader from '../shader/flylight/vertex.glsl';
import flyFragmentShader from '../shader/flylight/fragment.glsl';

import FireWorks from './firework';
//导入水模块
import {Water} from 'three/examples/jsm/objects/Water2'
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



//创建纹理加载器对象
const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync('./assets/2k.hdr').then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

//添加纹理加载器对象
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./assets/');
const params = {
  uFrequency: 10,
  uScale: 0.1,
};

//创建原始着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
  //顶点位置
  vertexShader: flyVertexShader,
  //顶点颜色
  fragmentShader: flyFragmentShader,
  side: THREE.DoubleSide,
  transparent: false,
  // wireframe:true
  //传递相关参数
  uniforms: {
    uColor: {
      value: new THREE.Color('purple'),
    },

    uTime: {
      value: 0,
    },
  },
});

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

//添加模型
const gltfLoader = new GLTFLoader();
let flyBox = null;
gltfLoader.load('./assets/model/flyLight.glb', (gltf) => {
  console.log(gltf);
  // scene.add(gltf.scene);
  flyBox = gltf.scene.children[0];
  flyBox.material = shaderMaterial;

  //克隆
  for (let i = 0; i < 150; i++) {
    let flylight = gltf.scene.clone(true);
    let x = (Math.random() - 0.5) * 300;
    let z = (Math.random() - 0.5) * 300;
    let y = Math.random() * 60 + 5;
    flylight.position.set(x, y, z);
    gsap.to(flylight.rotation, {
      y: 2 * Math.PI,
      duration: 10 + Math.random() * 10,
      repeat: -1,
    });
    gsap.to(flylight.position, {
      x: '+=' + Math.random() * 5,
      y: '+=' + Math.random() * 20,
      yoyo: true, //来回运动
      repeat: -1,
      duration: 5 + Math.random() * 10,
    });
    scene.add(flylight);
  }
});

gltfLoader.load("./assets/model/newyears_min.glb",(gltf) => {
    scene.add(gltf.scene)
  
    //创建睡眠
    const waterGeometry = new THREE.PlaneBufferGeometry(100,100)
    let water  = new Water(waterGeometry,{
      scale:4,
      textureHeight:1024,
      textureWidth:1024,
      color:"#ffffff",
      flowDirection:new THREE.Vector2(1,1),
    })
    water.position.y = 1;
    water.rotation.x = -Math.PI /2 
    scene.add(water)
})

//管理烟花
let fireworks = [];
//创建烟花
let createFireworks = () => {
  let color = `hsl(${Math.floor(Math.random() * 360)},100%,80%)`;
  let position = {
    x:(Math.random() - 0.5 )* 40,
    z:(Math.random() -0.5) * 40,
    y: 7 + Math.random() * 100,

  }
  //随机生成颜色和烟花放 的我位置
  let fireWork = new FireWorks(color, position);
  fireWork.addScene(scene, camera);

  fireworks.push(fireWork);

};

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

//添加渲染函数
function render() {
  let time = clock.getElapsedTime();
  // shaderMaterial.uniforms.uTime.value = time;
  controls.update();

  fireworks.forEach((item,i) => {
  const type =  item.update()
  if (type =="remove") {
    fireworks.splice(i,1)
  }
  })
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


//监听点击事件
window.addEventListener('click', createFireworks);
