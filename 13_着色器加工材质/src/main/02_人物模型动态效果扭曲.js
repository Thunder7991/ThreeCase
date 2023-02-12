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

import  {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'



//顶点着色器
import flyVertexShader from '../shader/flylight/vertex.glsl';
import flyFragmentShader from '../shader/flylight/fragment.glsl';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

const gui = new dat.GUI();
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

//创建纹理加载器
const textureLoader = new THREE.TextureLoader()
//添加环境纹理 
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  "textures/environmentMaps/0/px.jpg",
  "textures/environmentMaps/0/nx.jpg",
  "textures/environmentMaps/0/py.jpg",
  "textures/environmentMaps/0/ny.jpg",
  "textures/environmentMaps/0/pz.jpg",
  "textures/environmentMaps/0/nz.jpg",
]);

scene.environment = envMapTexture;
scene.background = envMapTexture;

// 加载模型纹理
const modelTexture = textureLoader.load('./models/LeePerrySmith/color.jpg');
// 加载模型的法向纹理
const normalTexture = textureLoader.load('./models/LeePerrySmith/normal.jpg')

const material = new THREE.MeshStandardMaterial({
  map:modelTexture,
  normalMap:normalTexture
})
const customUniforms = {
  uTime:{
    value:0
  }
}
material.onBeforeCompile =(shader) => {
  //传递时间
  shader.uniforms.uTime = customUniforms.uTime
  shader.vertexShader = shader.vertexShader.replace(
    `#include <common>`,
    `#include <common>
    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
  }
    uniform float uTime;
    `

  )

  shader.vertexShader = shader.vertexShader.replace(
    '#include <beginnormal_vertex>',
    `
    #include <beginnormal_vertex>
        float angle =sin(position.y + uTime) *0.5;
        mat2 rotateMatrix = rotate2d(angle);
        objectNormal.xz = rotateMatrix * objectNormal.xz;
    `

  )
  shader.vertexShader =  shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
        #include <begin_vertex>
        // float angle = transformed.y*0.5;
        // mat2 rotateMatrix = rotate2d(angle);
        transformed.xz = rotateMatrix * transformed.xz;

      `
    )
}






// 灯光 : 环境光
const ambientLigth = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLigth);
//平行光
const DirectionLight = new THREE.DirectionalLight(0xffffff, 1);
DirectionLight.position.set(0,0,200)

DirectionLight.castShadow = true;
scene.add(DirectionLight); 
//初始化渲染器
let renderer = new THREE.WebGLRenderer({ alpha: true });
//开启阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;



//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

//将webgl渲染到canvas内容到body中
document.body.appendChild(renderer.domElement);

//使用渲染器通过相机将场景渲染进去
renderer.render(scene, camera);

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20,20),
  new THREE.MeshStandardMaterial()
)
plane.position.set(0,0,-6);
plane.receiveShadow = true;
scene.add(plane)



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





const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking:THREE.RGBADepthPacking
})
depthMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime
  shader.vertexShader = shader.vertexShader.replace(
    `#include <common>`,
    `#include <common>
  
    mat2 rotate2d(float _angle){
      return mat2(cos(_angle),-sin(_angle),
                  sin(_angle),cos(_angle));
  }
  uniform float uTime;
    `

  )
  shader.vertexShader =  shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
        #include <begin_vertex>
        float angle =sin(transformed.y + uTime) *0.5;
        mat2 rotateMatrix = rotate2d(angle);
        transformed.xz = rotateMatrix * transformed.xz;

      `
    )
}
//模型加载
const gltfLoader = new GLTFLoader()
gltfLoader.load("./models/LeeperrySmith/LeePerrySmith.glb",(gltf) => {
  console.log(gltf);
  const mesh = gltf.scene.children[0]
  mesh.material = material
  mesh.castShadow = true;
  //由于物体已经改变,但是阴影形状还是没有变化, 所偶需要自定义材质
  mesh.customDepthMaterial = depthMaterial;

  scene.add(mesh) 
})

//添加渲染函数
function render() {
  let time = clock.getElapsedTime();
  customUniforms.uTime.value = time;
  controls.update();


  //获取时间差
  // let deltaTime = clock.getDelta();
  // console.log(deltaTime);
  renderer.render(scene, camera);
  //渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}
render();

