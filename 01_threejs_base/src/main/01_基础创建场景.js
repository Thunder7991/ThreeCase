import * as THREE from 'three';
//了解three.js的基本内容
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
scene.add(camera)

//4. 添加物体
//创建几何体
const cubeGeomerty = new THREE.BoxGeometry();
//添加材质
const  cubeMterial = new THREE.MeshBasicMaterial({color:0xffff00})

//根据几何体的材质创建物体
const cube= new THREE.Mesh(cubeGeomerty,cubeMterial)

//将几何体添加到场景中
scene.add(cube)

//初始化渲染器
let renderer = new THREE.WebGLRenderer()

//设置渲染的尺寸大小
renderer.setSize(window.innerWidth,window.innerHeight)
//将webgl渲染到canvas内容到body中

document.body.appendChild(renderer.domElement)

//使用渲染器通过相机将场景渲染进去
renderer.render(scene,camera)



