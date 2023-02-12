// 警告精灵图
import * as THREE from 'three'
import camera from '../camera'
import gsap from 'gsap'
export default class AlarmSprite {
  constructor (type = '火警', position = { x: -1.8, z: 3 }, color = 0xff0000) {
    const typeObj = {
      火警: './textures/tag/fire.png',
      治安: './textures/tag/jingcha.png',
      电力: './textures/tag/e.png'
    }
    const textureLoader = new THREE.TextureLoader()
    const map = textureLoader.load(typeObj[type])
    this.material = new THREE.SpriteMaterial({
      map: map,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false

    })
    this.mesh = new THREE.Sprite(this.material)

    // 社会位置
    this.mesh.position.set(position.x, 3.5, position.z)

    // 封装点击事件
    this.fns = []

    // 创建射线
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    // 事件监听
    window.addEventListener('click', (event) => {
      // ( 0 - 1 ) * 2 - 1 得到的范围  -1 --- 1  得到的射线
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
      // 设置相机
      this.raycaster.setFromCamera(this.mouse, camera)

      event.mesh = this.mesh
      event.alarm = this
      // 交叉值 ,也就是说检测到点击到物体
      const intersects = this.raycaster.intersectObject(this.mesh)
      if (intersects.length > 0) {
        this.fns.forEach((fn) => {
          fn(event)
        })
      }
    })

    // 物体缩放和移动
    gsap.to(this.mesh.position, {
      y: 4,
      repeat: -1,
      yoyo: true
    })
    console.log(this.mesh.scale)
    gsap.to(this.mesh.scale, {
      x: 1.25,
      y: 1.25,

      repeat: -1,
      ease: 'none',
      yoyo: true
    })
  }

  onClick (fn) {
    this.fns.push(fn)
  }

  remove () {
    this.mesh.remove()
    this.mesh.removeFromParent()
    this.mesh.material.dispose()
    this.mesh.geometry.dispose()
  }
}
