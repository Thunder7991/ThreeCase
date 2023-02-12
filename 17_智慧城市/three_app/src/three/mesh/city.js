import * as THREE from 'three'
import scene from '../scene'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import modifyCityMaterial from '../modify/modifyCityMaterial'
import FlyLine from './flyLine'
import FlyLineShader from './flyLineShader'
import MeshLine from './meshLine'
import LightWall from './lightWall'
import LightRadar from './lightRadar'
import AlarmSprite from './alarmSprite'
function createCitys () {
  const gltfLoader = new GLTFLoader()
  gltfLoader.load('./model/city.glb', (gltf) => {
    // Object3d traverse 方法循环遍历 Threejs 场景中的所有对象
    gltf.scene.traverse((item) => {
      if (item.type === 'Mesh') {
        const cityMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0x364fc7),
          side: THREE.DoubleSide
        })
        item.material = cityMaterial
        modifyCityMaterial(item)
        // 判断是否建筑物
        if (item.name === 'Layerbuildings') {
          const meshLine = new MeshLine(item.geometry)

          meshLine.mesh.scale.copy(item.scale)
          scene.add(meshLine.mesh)
        }
      }
    })
    scene.add(gltf.scene)

    // 添加飞线
    // const flyLine = new FlyLine()
    // scene.add(flyLine.mesh)

    // 添加着色器飞线

    // const flyLineShader = new FlyLineShader()
    // scene.add(flyLineShader.mesh)

    // 添加光墙
    // const lightWall = new LightWall()
    // scene.add(lightWall.mesh)

    // 添加雷达扫描
    // const lightRadar = new LightRadar()
    // scene.add(lightRadar.mesh)

    // // 添加精灵图
    // const alarmSprite = new AlarmSprite()
    // scene.add(alarmSprite.mesh)
    // alarmSprite.onClick(function (e) {
    //   console.log('警告', e)
    // })
  })
}

export default createCitys
