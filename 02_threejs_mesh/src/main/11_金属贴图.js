import * as THREE from 'three';
// 目标:粗糙度

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//导入动画库
import gsap from 'gsap';
//导入dat.gui
import * as dat from 'dat.gui';
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
camera.position.set(0, 0, 10);
//3. 添加相机
scene.add(camera);

//导入纹理
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load('./textures/door/color.jpg');
const doorAplhaTexture = textureLoader.load('./textures/door/alpha.jpg');
const texture = textureLoader.load('./textures/minecraft.png');
//环境遮挡贴图
const  doorAoTexture = textureLoader.load("./textures/door/ambientOcclusion.jpg")

//导入置换贴图
const doorHeightTexture =  textureLoader.load('./textures/door/height.jpg')

//导入粗糙度贴图
const roughnessTexture = textureLoader.load('./texture/door/roughness.jpg')

//导入金属贴图
const metalnessTextrue = textureLoader.load("./textures/door/metalness.jpg")

//纹理偏移
// doorColorTexture.offset.set(0.2,0.2,0.2);
//纹理旋转
//默认是 0 , 0
// doorColorTexture.center.set(0.5,0.5)
//旋转45度
// doorColorTexture.rotation = Math.PI / 4
//设置纹理的重复
// doorColorTexture.repeat.set(2,3)
//设置纹理重复的模式
// doorColorTexture.wrapS = THREE.RepeatWrapping
// doorColorTexture.wrapT = THREE.MirroredRepeatWrapping

//纹理的显示设置
// texture.minFilter= THREE.NearestFilter;
// texture.magFilter = THREE.NearestFilter
//4. 添加物体
//创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1,200,200);
//添加材质
const material = new THREE.MeshStandardMaterial({
  color: '#ffff00',
  map: doorColorTexture,
  alphaMap: doorAplhaTexture,
  transparent: true,
  // opacity:0.5,
  // side:THREE.DoubleSide
  // map:texture,
  aoMap:doorAoTexture,
  aoMapIntensity:1 ,//遮挡强度
  displacementMap:doorHeightTexture,//置换贴图
  displacementScale:0.1,
  roughness:0,//粗糙度
  roughnessMap:roughnessTexture,//粗糙度贴图
  metalness:1,
  metalnessMap:metalnessTextrue,//金属材质贴图
});

material.side = THREE.DoubleSide
const cube = new THREE.Mesh(cubeGeometry, material);
scene.add(cube);
cubeGeometry.setAttribute('uv2',new THREE.BufferAttribute(cubeGeometry.attributes.uv.array,2))

//添加平面
const planeGeometry = new THREE.PlaneBufferGeometry(1,1,200,200)
const plane = new THREE.Mesh(planeGeometry,material);
plane.position.set(1.5,0,0)
scene.add(plane);
//两个点作为一个点 x , y
//给平面设置第二组Uv
planeGeometry.setAttribute('uv2',new THREE.BufferAttribute(planeGeometry.attributes.uv.array,2))

//灯光 : 环境光
const light = new THREE.AmbientLight(0xffffff,1)
scene.add(light)

//直线光源 平行光:
const directionalight = new THREE.DirectionalLight(0xffffff,0.5)
directionalight.position.set(10,10,10)
scene.add(directionalight)


//初始化渲染器
let renderer = new THREE.WebGLRenderer();

//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

//将webgl渲染到canvas内容到body中
document.body.appendChild(renderer.domElement);

//使用渲染器通过相机将场景渲染进去
renderer.render(scene, camera);

//创建轨道控制器
//参数 是相机 和 渲染元素
const controls = new OrbitControls(camera, renderer.domElement);

//设置控制器阻尼,让控制器更有真实的效果, 必须在 动画循环中调用update
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
  controls.update();
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
