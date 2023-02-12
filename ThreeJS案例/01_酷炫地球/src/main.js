import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/orbitcontrols';
let renderer, camera, scene, light, controls, axesHelper;
let radius = 5;
let earthGroup = new THREE.Group();
let apertureGroup = new THREE.Group();
let haloGroup = new THREE.Group();
let clock = new THREE.Clock();
let lineGroup = null
//初始化渲染场景
function initRenderer() {
  renderer = new THREE.WebGLRenderer({ alpha: true });
  //设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);

  //将webgl渲染到canvas内容到body中
  document.body.appendChild(renderer.domElement);

  renderer.shadowMap.enabled = true;
  // renderer.physicallyCorrectLights = false;
  // renderer.toneMapping = THREE.ACESFilmicToneMapping; //电影级别
  // renderer.toneMappingExposure = 1.0;

  //使用渲染器通过相机将场景渲染进去
  renderer.render(scene, camera);
}

//初始化相机
function initCamera() {
  //透视相机(角度,宽高比,近端,远端)
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000,
  );
  camera.position.set(5, -20, 200);
  camera.lookAt(0, 3, 0);
  //3. 添加相机
  scene.add(camera);
}

//初始化场景
function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020924);
  scene.fog = new THREE.Fog(0x020924, 200, 1000);
  window.scene = scene;
}

//初始化轨道控制器
function initControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  //控制器阻尼
  controls.enableDamping = true;
  //可缩放
  controls.enableZoom = true;
  controls.autoRotate = false;
  //旋转速度
  controls.autoRotateSpeed = 2;
  controls.enablePan = true;
}

function initHelper(params) {
  axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
}

//初始化灯管
function initLight() {
  // 环境光会均匀的照亮场景中的所有物体。
  const ambientLight = new THREE.AmbientLight(0xcccccc, 1.1);
  scene.add(ambientLight);
  // 平行光
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
  directionalLight.position.set(1, 0.1, 0).normalize();
  var directionalLight2 = new THREE.DirectionalLight(0xff2ffff, 0.2);
  directionalLight2.position.set(1, 0.1, 0.1).normalize();
  scene.add(directionalLight);
  scene.add(directionalLight2);
  // 光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。
  var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.2);
  hemiLight.position.set(0, 1, 0);
  scene.add(hemiLight);
  var directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 500, -20);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.top = 18;
  directionalLight.shadow.camera.bottom = -10;
  directionalLight.shadow.camera.left = -52;
  directionalLight.shadow.camera.right = 12;
  scene.add(directionalLight);
}

/**
 * 窗口变动
 **/
function onWindowResize() {
  //更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  //更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
}

/**
 * 更新
 **/
function animate() {
  controls.update();
  let time = clock.getElapsedTime();
  // console.log(time);
  const remainderTime = time/10 % 1
  haloGroup.rotation.set(1.9, 0.5, Math.PI * remainderTime);

  // haloGroup.rotateY.copy(point)
  // console.log(remainderTime);
  renderer.render(scene, camera);
  //渲染下一帧的时候就会调用render函数
  requestAnimationFrame(animate);
}

window.onload = () => {
  initScene();
  initCamera();
  initRenderer();

  initHelper();
  initLight();
  initControls();
  initPoints();
  initEarth();
  initAperture();
  initSatellite();
  // createPointMesh(lglt2xyz(116.4, 39.9, radius));
  // createPointMesh(lglt2xyz(126.4, 38.9, radius));
  // createPointMesh(lglt2xyz(179, 90, radius));

  animate();

  window.addEventListener('resize', onWindowResize, false);
};
//星星
function initPoints() {
  const positions = [];
  const colors = [];
  const geometry = new THREE.BufferGeometry();
  for (var i = 0; i < 10000; i++) {
    var vertex = new THREE.Vector3();
    vertex.x = Math.random() * 2 - 1;
    vertex.y = Math.random() * 2 - 1;
    vertex.z = Math.random() * 2 - 1;
    positions.push(vertex.x, vertex.y, vertex.z);
    var color = new THREE.Color();
    color.setHSL(Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55);
    colors.push(color.r, color.g, color.b);
  }
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  //添加粒子材质
  const textureLoader = new THREE.TextureLoader();
  const particelsTexture = textureLoader.load(`./texture/guangqiu.png`);
  console.log(particelsTexture);
  var starsMaterial = new THREE.PointsMaterial({
    map: particelsTexture,
    size: 1,
    transparent: true,
    opacity: 1,
    vertexColors: true, //true：且该几何体的colors属性有值，则该粒子会舍弃第一个属性--color，而应用该几何体的colors属性的颜色
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  let stars = new THREE.Points(geometry, starsMaterial);
  stars.scale.set(300, 300, 300);
  scene.add(stars);
  console.log(scene);
}

//地球
function initEarth() {
  // 初始化一个加载器
  const loader = new THREE.TextureLoader();
  loader.load('./texture/earth-74015.jpg', (texture) => {
    let globeGeometry = new THREE.SphereGeometry(radius, 100, 100);
    let globeMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    let globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    // earthGroup.rotation.set(0.5, 2.9, 0.1);
    earthGroup.add(globeMesh);
    scene.add(earthGroup);
  });
}

//添加地球光圈
function initAperture() {
  const loader = new THREE.TextureLoader();
  var texture = loader.load('./texture/guangyun03.png');
  var spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });
  var sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(radius * 2.2, radius * 2.2, 1);
  apertureGroup.add(sprite);
  scene.add(apertureGroup);


}
//卫星环绕特效
function initSatellite() {
  const loader = new THREE.TextureLoader();
  var texture = loader.load('./texture/halo.png', (texture) => {
    var geometry = new THREE.PlaneGeometry(14, 14);
    var material = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    var mesh = new THREE.Mesh(geometry, material);
    haloGroup.add(mesh);

    //添加卫星
    loader.load('./texture/smallEarth.png', function (texture) {
      var p1 = new THREE.Vector3(-7, 0, 0);
      var p2 = new THREE.Vector3(7, 0, 0);
      const points = [p1, p2];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      var material = new THREE.PointsMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        size: 1,
        depthWrite: false,
      });
      var earthPoints = new THREE.Points(geometry, material);
      haloGroup.add(earthPoints);
    });
    haloGroup.rotation.set(1.9, 0.5, 1);
    scene.add(haloGroup);


  });

  //创建旋转线
  // const curve = new THREE.EllipseCurve(
  //   0,  0,            // ax, aY
  //   7, 7,           // xRadius, yRadius
  //   0,  2 * Math.PI,  // aStartAngle, aEndAngle
  //   false,            // aClockwise
  //   0                 // aRotation
  // );
  
  // //在曲线里获取51
  // const points = curve.getPoints( 500 );
  // const pointsGeometry = new THREE.BufferGeometry().setFromPoints( points );
  
  // const pointsMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
  // // Create the final object to add to the scene
  // const curveObject = new THREE.Line( pointsGeometry, pointsMaterial );
  // curveObject.rotation.set(1.9, 0.5, 1);
  // lineGroup = curve
  // scene.add(curveObject)
}

//经纬度坐标转换成3D空间坐标
function lglt2xyz(lng, lat, radius) {
  const theta = (90 + lng) * (Math.PI / 180);
  const phi = (90 - lat) * (Math.PI / 180);
  return new THREE.Vector3().setFromSpherical(
    new THREE.Spherical(radius, phi, theta),
  );

  //
}
// 坐标转换，
function createPosition(lnglat) {
  let spherical = new THREE.Spherical();
  spherical.radius = radius;
  const lng = lnglat[0];
  const lat = lnglat[1];
  const theta = (lng + 90) * (Math.PI / 180);
  const phi = (90 - lat) * (Math.PI / 180);
  spherical.phi = phi; // phi是方位面（水平面）内的角度，范围0~360度
  spherical.theta = theta; // theta是俯仰面（竖直面）内的角度，范围0~180度
  let position = new THREE.Vector3();
  position.setFromSpherical(spherical);
  return position;
}

function createPointMesh(R, lon, lat) {
  

  let texture = new THREE.TextureLoader();
  let loader = texture.load('./texture/gq.png');
  var material = new THREE.MeshBasicMaterial({
    map: loader,
    transparent: true, //使用背景透明的png贴图，注意开启透明计算
    // side: THREE.DoubleSide, //双面可见
    depthWrite: false, //禁止写入深度缓冲区数据
  });
  const planeGeometry = new THREE.PlaneGeometry(
   1,1
  );
  var mesh = new THREE.Mesh(planeGeometry, material);
  var size1 = R * 0.05;//矩形平面Mesh的尺寸
  mesh.scale.set(size1, size1, size1);//设置mesh大小
  
  // 经纬度转球面坐标
  var coord = lon2xyz(R * 1.001, lon, lat)
  //设置mesh位置
  mesh.position.set(coord.x, coord.y, coord.z);
  //光圈
  var geometry2 = new THREE.PlaneBufferGeometry(1, 1);
  var textureLoader2 = new THREE.TextureLoader();
  var texture2 = textureLoader2.load("./texture/halo.png");

  var material2 = new THREE.MeshBasicMaterial({
    color: 0x22ffcc,
    map: texture2,
    transparent: true,
    opacity: 1.0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  var waveMesh = new THREE.Mesh(geometry2, material2);
  var size2 = R * 0.03;
  waveMesh.size = size2;//自定义一个属性，表示mesh静态大小
  waveMesh.scale.set(size2, size2, size2);
  waveMesh._s = Math.random() + 1.0;//光圈在原来mesh.size基础上1~2倍之间变化

  mesh.add(waveMesh)//将waveMesh设置为mesh的子元素，继承mesh位置及姿态信息


    // mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
    var coordVec3 = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
    // mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0, 1)
    var meshNormal = new THREE.Vector3(0, 0, 1);
    // 四元数属性.quaternion表示mesh的角度状态
    //.setFromUnitVectors();计算两个向量之间构成的四元数值
    mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);

  return mesh;
}
