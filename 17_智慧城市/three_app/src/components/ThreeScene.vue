<template>
  <div class="scene" ref="sceneDiv"></div>
</template>

<script setup>
import { onMounted, ref, defineProps, watch } from 'vue'
import * as THREE from 'three'

import gsap from 'gsap'
// 导入场景
import scene from '@/three/scene'
// 导入相机
import camera from '@/three/camera'

// 导入gui
import gui from '@/three/gui'

// 导入渲染器
import renderer from '@/three/renderer'

import axesHelper from '@/three/axexHelper'

import animate from '@/three/animate'

import light from '@/three/light'

// 导入添加物体函数
import createMesh from '@/three/createMesh'

// 初始化屏幕
import '@/three/init'

// 精灵图
import AlarmSprite from '@/three/mesh/alarmSprite'
import LightWall from '@/three/mesh/lightWall.js'
import FlyLine from '@/three/mesh/flyLine.js'
import FlyLineShader from '@/three/mesh/flyLineShader'
import LightRadar from '@/three/mesh/lightRadar'

import eventBus from '@/utils/eventBus'
import controls from '@/three/controls.js'

const props = defineProps(['eventList'])
// 创景元素div
const sceneDiv = ref(null)
// scene.background = new THREE.Color(0, 0, 0, 1)
scene.add(camera)
scene.add(axesHelper)

// light.directionLight.position.set(0, 0, 800)
// light.directionLight.castShadow = true
// scene.add(light.directionLight)
// scene.add(light.ambientLigth)

// 创建物体
createMesh()
onMounted(() => {
  sceneDiv.value.appendChild(renderer.domElement)
  animate()
})

const eventListMesh = []
watch(() => props.eventList, (val) => {
  eventListMesh.forEach(item => {
    item.remove()
  })
  eventBus.emit('spriteClick', { event: '', index: -1 })
  props.eventList.forEach((item, i) => {
    // 添加精灵图
    const position = {
      x: item.position.x / -10,
      z: item.position.y / -10
    }
    const alarmSprite = new AlarmSprite(item.name, position)
    scene.add(alarmSprite.mesh)

    eventListMesh.push(alarmSprite)
    alarmSprite.onClick(function (e) {
      console.log(item.name, i)
      eventBus.emit('spriteClick', { event: item, index: i })
    })
    alarmSprite.eventListIndex = i

    if (mapFn[item.name]) {
      mapFn[item.name](position, i)
    }
  })
})

const mapFn = {
  火警: (position, i) => {
    const lightWall = new LightWall(1, 2, position)
    lightWall.eventListIndex = i
    scene.add(lightWall.mesh)
    eventListMesh.push(lightWall)
  },
  治安: (position, i) => {
    // 生成随机的颜色
    const color = new THREE.Color(
      Math.random(),
      Math.random(),
      Math.random()
    )
    const flyLineShader = new FlyLineShader(position, color)
    flyLineShader.eventListIndex = i
    scene.add(flyLineShader.mesh)
    eventListMesh.push(flyLineShader)
  },
  电力: (position, i) => {
    const color = new THREE.Color(
      Math.random(),
      Math.random(),
      Math.random()
    )
    const lightRadar = new LightRadar(10, position, color)
    lightRadar.eventListIndex = i
    scene.add(lightRadar.mesh)
    eventListMesh.push(lightRadar)
  }
}
// 此时需要保持 物体 与 index 一直, 因此需要在物体对象中添加eventListIndex属性
eventBus.on('eventToggle', (i) => {
  eventListMesh.forEach(item => {
    if (item.eventListIndex === i) {
      item.mesh.visible = true
      // 修改控制器
      const position = {
        x: item.mesh.position.x / 5 - 10,
        y: 0,
        z: item.mesh.position.y / 5 - 10
      }
      gsap.to(controls.target, {
        duration: 0.5,
        x: position.x,
        y: position.y,
        z: position.z
      })
    } else {
      item.mesh.visible = false
    }
  })
})
</script>

<style lang="scss" scoped>
.scene {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}
</style>
