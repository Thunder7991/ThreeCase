import * as THREE from 'three';
// 目标: 使用points 设置臂悬星系

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
  20,
);
camera.position.set(0, 0, 10);
//3. 添加相机
scene.add(camera);

const textureLoader = new THREE.TextureLoader();
const particelsTexture = textureLoader.load(`./textures/particles/1.png`);
const params = {
  count: 10000,
  size: 0.1,
  radius: 5, //半径
  branch: 3, //分支
  color: '#ff6030',
  rotateScale: 0.3,
  endColor: '#1b3984',
};
let geomery = null;
let material = null;
let points = null;
const centerColor = new THREE.Color(params.color);
const endColor = new THREE.Color(params.endColor);
const generateGalaxy = () => {
    //如果已经存在这些顶点,那么先释放内存,在删除顶点数据
  if (points !== null) {
    geomery.dispose()
    material.dispose()
    scene.remove(points)
  }
  //生成顶点
  geomery = new THREE.BufferGeometry();
  //随机生成位置
  const positons = new Float32Array(params.count * 3);
  //设置顶点颜色
  const colors = new Float32Array(params.count * 3);

  const scales = new Float32Array(params.count);

  //生成循环点
  for (let i = 0; i < params.count; i++) {
    //当前点应该在那一条分支的角度上
    //(i % params.branch) 在哪个分支
    // (2 * Math.PI / params.branch);  一个分支所在的度数
    const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch);
    //当前点距离圆心的位置
    const distance = Math.random() * params.radius * Math.pow(Math.random(), 3);
    const current = i * 3;

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
    scales[current] = Math.random()
  }
  geomery.setAttribute('position', new THREE.BufferAttribute(positons, 3));
  geomery.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  //设置点材质
  material = new THREE.PointsMaterial({
    // color: new THREE.Color(params.color),
    size: params.size, //点的大小
    sizeAttenuation: true, //相机深度而衰减
    depthWrite: false, //深度监测
    blending: THREE.AdditiveBlending, //混合模式
    map: particelsTexture,
    alphaMap: particelsTexture,
    transparent: true,

    vertexColors: true,
  });
  points = new THREE.Points(geomery, material);
  scene.add(points);
};
generateGalaxy();
// 灯光 : 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

//点光源
const pointLight = new THREE.PointLight(0xff0000, 1);
pointLight.position.set(2, 2, 2);

scene.add(pointLight);

//初始化渲染器
let renderer = new THREE.WebGLRenderer();
//开启阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;

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
