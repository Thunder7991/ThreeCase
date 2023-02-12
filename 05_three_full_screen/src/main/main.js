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
  300,
);
camera.position.set(0, 0, 18);
//3. 添加相机
scene.add(camera);
//创建立方体
const cubeGeometry = new THREE.BoxBufferGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
});
const redMaterial = new THREE.MeshBasicMaterial({ color: '#ff0000' });
//创建1000 个立方体
let cubeArr = [];
let cubeGroup = new THREE.Group();
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    for (let z = 0; z < 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.set(i * 2 - 4, j * 2 - 4, z * 2 - 4);
      cubeGroup.add(cube);
      cubeArr.push(cube);
    }
  }
}
scene.add(cubeGroup);

//创建三角形
let sjxGroup = new THREE.Group();
for (let i = 0; i < 50; i++) {
  //每一个三角形, 需要三个顶点,每个顶点需要三个值
  const geometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(9);
  for (let j = 0; j < 9; j++) {
    positionArray[j] = Math.random() * 10 - 5;
    // if (j % 3 === 1) {

    // } else {
    //   positionArray[j] = Math.random() * 10 - 5;
    // }
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positionArray, 3),
    );
    let color = new THREE.Color(Math.random(), Math.random(), Math.random());
    const cubeMterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    let sjxMesh = new THREE.Mesh(geometry, cubeMterial);
    sjxGroup.add(sjxMesh);
  }
}
sjxGroup.position.set(0, -30, 0);
scene.add(sjxGroup);

const sphereGroup = new THREE.Group();

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphereGroup.add(sphere);
//创建平面
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const plane = new THREE.Mesh(planeGeometry, sphereMaterial);
plane.receiveShadow = true;
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
sphereGroup.add(plane);

const smallBall = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
);

smallBall.position.set(2, 2, 2);

//点光源
const smallPointLight = new THREE.PointLight(0xff0000, 1);
smallPointLight.position.set(2, 2, 2);
//平行光开启阴影
smallPointLight.castShadow = true;
//调节亮度
smallPointLight.intensity = 2;
//设置阴影模糊度
smallPointLight.shadow.radius = 10;
//定义阴影贴图的分辨率

//小球添加点光源
smallBall.add(smallPointLight);
sphereGroup.add(smallBall);
sphereGroup.position.set(0, -60, 0);
scene.add(sphereGroup);

const arrGroup = [cubeGroup, sjxGroup, sphereGroup];

// 灯光 : 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

//点光源
const pointLight = new THREE.PointLight(0xff0000, 1);
pointLight.position.set(2, 2, 2);
scene.add(pointLight);

//创建投射光线对象
const raycaster = new THREE.Raycaster();

//鼠标的位置对象
let mouse = new THREE.Vector2();

//监听鼠标位置
window.addEventListener('click', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
  raycaster.setFromCamera(mouse, camera);
  const result = raycaster.intersectObjects(cubeArr);

  result.forEach((item) => {
    item.object.material = redMaterial;
  });
});

//初始化渲染器
let renderer = new THREE.WebGLRenderer({ alpha: true });
//开启阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
//渲染器透明

//设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

//将webgl渲染到canvas内容到body中
document.body.appendChild(renderer.domElement);

//使用渲染器通过相机将场景渲染进去
renderer.render(scene, camera);

//创建轨道控制器
//参数 是相机 和 渲染元素
// const controls = new OrbitControls(camera, renderer.domElement);

// //设置控制器阻尼,让控制器更有真实的效果, 必须在 动画循环中调用update
// controls.enableDamping = true;
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

gsap.to(cubeGroup.rotation, {
  x: '+=' + Math.PI,
  y: '+=' + Math.PI,
  ease: 'power2.inOut',
  duration: 5,
  repeat: -1,
});

gsap.to(sjxGroup.rotation, {
  x: '+=' + Math.PI,
  y: '+=' + Math.PI,
  ease: 'power2.inOut',
  duration: 5,
  repeat: -1,
});

gsap.to(smallBall.position, {
  x: -3,

  ease: 'power2.inOut',
  duration: 6,
  repeat: -1,
  yoyo: true,
});
gsap.to(smallBall.position, {
  y: 0,
  ease: 'power2.inOut',
  duration: 0.5,
  repeat: -1,
  yoyo: true,
});

//添加渲染函数
function render() {
  // let time = clock.getElapsedTime();
  //获取时间差
  let deltaTime = clock.getDelta()

  // controls.update();

  //根据当前的scrolly, 去设置相机移动的位置
  camera.position.y = -(window.scrollY / window.innerHeight) * 30;

  camera.position.x += ( mouse.x * 10 - camera.position.x) * deltaTime;
  renderer.render(scene, camera);
  //渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}
render();

//鼠标的位置对象 mouse
window.addEventListener("mousemove",(event) => {
  mouse.x  = -(event.clientX / window.innerWidth - 0.5);
  mouse.y = event.clientY / window.innerHeight - 0.5;
})


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

//设置当前页
let currentPage = 0;
window.addEventListener('scroll', (e) => {
  // console.log(window.innerHeight);
  const newPage = Math.round(window.scrollY / window.innerHeight);
  if (newPage != currentPage) {
    currentPage = newPage;
    gsap.to(arrGroup[currentPage].rotation, {
      z: '+=' + 2 * Math.PI,
      duration: 1,
    });

    // gsap.to(`.page${currentPage} h1`,{
    //   rotate: '+=360',
    //   duration:1
    // })
    gsap.fromTo(
      `.page${currentPage} h1`,
      {
        x: -300,
      },
      { x: 0 ,rotate:"+=360",duration:1},
    );
  }
});
