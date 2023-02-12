import * as THREE from 'three';
// 目标: 着色器飞灯

//导入 物理cannon引擎
import * as CANNON from 'cannon-es';

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//导入效果合成器
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
//three自带的渲染效果
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';

import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

//导入动画库
import gsap, { random } from 'gsap';
//导入dat.gui
import * as dat from 'dat.gui';

const gui = new dat.GUI();

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

//添加环境纹理
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  'textures/environmentMaps/0/px.jpg',
  'textures/environmentMaps/0/nx.jpg',
  'textures/environmentMaps/0/py.jpg',
  'textures/environmentMaps/0/ny.jpg',
  'textures/environmentMaps/0/pz.jpg',
  'textures/environmentMaps/0/nz.jpg',
]);

scene.environment = envMapTexture;
scene.background = envMapTexture;

//创建纹理加载器
const textureLoader = new THREE.TextureLoader();
// 加载模型纹理
const modelTexture = textureLoader.load('./models/LeePerrySmith/color.jpg');
// 加载模型的法向纹理
const normalTexture = textureLoader.load('./textures/interfaceNormalMap.png');

const customUniforms = {
  uTime: {
    value: 0,
  },
};
const material = new THREE.MeshStandardMaterial({
  map: modelTexture,
  normalMap: normalTexture,
});
material.onBeforeCompile = (shader) => {
  //传递时间
  shader.uniforms.uTime = customUniforms.uTime;
  shader.vertexShader = shader.vertexShader.replace(
    `#include <common>`,
    `#include <common>
    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
  }
    uniform float uTime;
    `,
  );

  shader.vertexShader = shader.vertexShader.replace(
    '#include <beginnormal_vertex>',
    `
    #include <beginnormal_vertex>
        float angle =sin(position.y + uTime) *0.5;
        mat2 rotateMatrix = rotate2d(angle);
        objectNormal.xz = rotateMatrix * objectNormal.xz;
    `,
  );
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
        #include <begin_vertex>
        // float angle = transformed.y*0.5;
        // mat2 rotateMatrix = rotate2d(angle);
        transformed.xz = rotateMatrix * transformed.xz;

      `,
  );
};

// 灯光 : 环境光
const ambientLigth = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLigth);
//平行光
const DirectionLight = new THREE.DirectionalLight(0xffffff, 1);
DirectionLight.position.set(0, 0, 200);

DirectionLight.castShadow = true;
scene.add(DirectionLight);
//初始化渲染器
let renderer = new THREE.WebGLRenderer({ alpha: true });
//开启阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping; //电影级别
renderer.toneMappingExposure = 1.0;

//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

//将webgl渲染到canvas内容到body中
document.body.appendChild(renderer.domElement);

//使用渲染器通过相机将场景渲染进去
renderer.render(scene, camera);

//合成效果 (renderer:true,width/height)
const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(window.innerWidth, window.innerHeight);
//添加渲染通道
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const colorParams = {
  r: 0,
  g: 0,
  b: 0.5,
};
//着色器写渲染通道
const techPass = new ShaderPass({
  uniforms: {
    tDiffuse: {
      value: null,
    },
    uNormalMap:{
      value:null
    }
  },
  vertexShader: `
  varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
  //vUv => uv
  varying vec2 vUv;
  uniform sampler2D tDiffuse;
  uniform vec3 uColor;
  uniform sampler2D uNormalMap;
  void main() {
    vec4 color= texture2D(tDiffuse ,vUv);
    // gl_FragColor = vec4(vUv,0.0,1.0);
    //法线颜色
    vec4 normalColor = texture2D(uNormalMap,vUv);
    //设置光线的角度
    vec3 lightDirection =normalize(vec3(-5.0,5.0,2.0)) ;
      //取出xyz 三维向量/ 
    float lightness =clamp(dot(normalColor.xyz,lightDirection),0.0,1.0) ;
    color.xyz += lightness;
    gl_FragColor = color;

  }
  `,
})
techPass.material.uniforms.uNormalMap.value = normalTexture;
effectComposer.addPass(techPass);


const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial(),
);
plane.position.set(0, 0, -6);
plane.receiveShadow = true;
scene.add(plane);

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
const gltfLoader = new GLTFLoader();
gltfLoader.load('./models/DamagedHelmet/glTF/DamagedHelmet.gltf', (gltf) => {
  const mesh = gltf.scene.children[0];
  mesh.castShadow = true;
  scene.add(mesh);
});

//添加渲染函数
function render() {
  let time = clock.getElapsedTime();
  customUniforms.uTime.value = time;
  controls.update();

  //获取时间差
  // let deltaTime = clock.getDelta();
  // console.log(deltaTime);
  // renderer.render(scene, camera);

  //合成效果需要用 effectComposer渲染
  effectComposer.render();
  //渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}
render();
