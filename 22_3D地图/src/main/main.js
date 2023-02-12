import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import * as d3 from 'd3';
import Stats from 'three/examples/jsm/libs/stats.module.js';

//创建gui对象
const gui = new dat.GUI();

const stats = new Stats();
document.body.appendChild(stats.dom);
// console.log(THREE);
// 初始化场景
const scene = new THREE.Scene();

// console.log(d3);
// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerHeight / window.innerHeight,
  0.1,
  100000,
);
// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.position.set(0, 0, 1000);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);
const light = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true });
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.BasicShadowMap;
// renderer.shadowMap.type = THREE.VSMShadowMap;

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener('resize', () => {
  //   console.log("resize");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
});

// 将渲染器添加到body
document.body.appendChild(renderer.domElement);
const canvas = renderer.domElement;

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
controls.enableDamping = true;
// 设置自动旋转
// controls.autoRotate = true;

const clock = new THREE.Clock();
function animate(t) {
  controls.update();
  stats.update();
  const deltaTime = clock.getDelta();

  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
}

animate();

//创建一个文件loader
//载入GEOJSON文件
const loader = new THREE.FileLoader();
loader.load('./assets/texture/China.json', function (data) {
  console.log(data);
  const jsonData = JSON.parse(data);
  operationData(jsonData);
});
const map = new THREE.Object3D();
function operationData(jsonData) {
  //获取所有的特征
  const features = jsonData.features;

  features.forEach((feature) => {
    //创建 省份 的物体
    const province = new THREE.Object3D();
    province.properties = feature.properties.name;
    //获取经纬度坐标
    const coordinates = feature.geometry.coordinates;
    console.log(feature.geometry.type);
    if (feature.geometry.type === 'Polygon') {
      coordinates.forEach((coordinate) => {
        const mesh = createMesh(coordinate);
     
        mesh.properties = feature.properties.name;
        province.add(mesh);
        const line = createLine(coordinate)
        province.add(line)
      });
    }
    if (feature.geometry.type === 'MultiPolygon') {
      coordinates.forEach((item) => {
        item.forEach((coor) => {
          const mesh = createMesh(coor);
          mesh.properties = feature.properties.name;
          province.add(mesh);
          const line = createLine(coor)
          province.add(line)
        });
      });
    }
    map.add(province);
  });
  scene.add(map);
}

const projection = d3.geoMercator().center([116.5, 38.5]).translate([0, 0, 0]);
function createMesh(py) {
  const shape = new THREE.Shape();
  //得到形状
  py.forEach((item, i) => {
    const [longitude, latitude] = projection(item);
    if (i === 0) {
      shape.moveTo(longitude, -latitude);
    }
    shape.lineTo(longitude, -latitude);
  });

  //挤出物体
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 5,
  });
  //创建随机颜色
  const color = new THREE.Color(Math.random() * 0xffffff);
  //设置材质
  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
  });
  return new THREE.Mesh(geometry, material);
}
// 上一次选中的物体
let lastPicker = null;
window.addEventListener('click', (event) => {
  //获取鼠标的位置
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  //获取鼠标点击位置
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  // 监测碰撞的物体, 获取点击的点
  const intersects = raycaster.intersectObjects(map.children);
  console.log(map.children);
  if (intersects.length > 0) {
    if (lastPicker) {
      lastPicker.material.color.copy(lastPicker.material.oldColor);
    }
    lastPicker = intersects[0].object;
    lastPicker.material.oldColor = lastPicker.material.color.clone(); //记录原来的颜色
    lastPicker.material.color.set(0xffffff);
  } else {
    if (lastPicker) {
      lastPicker.material.color.copy(lastPicker.material.oldColor);
    }
  }
});

//根据经纬度绘制线
function createLine(polygon) {
  const lineGeometry = new THREE.BufferGeometry();
  const pointsArray = [];
  polygon.forEach((row, i) => {
    const [longitude, latitude] = projection(row);
    pointsArray.push(new THREE.Vector3(longitude, -latitude, 10));
  });
  //通过点生成线几何体
  lineGeometry.setFromPoints(pointsArray);
  //创建线的材质
  const color = new THREE.Color(Math.random() * 0xffffff);
  const lineMaterial = new THREE.LineBasicMaterial({color})
  return new THREE.Line(lineGeometry,lineMaterial)
}
