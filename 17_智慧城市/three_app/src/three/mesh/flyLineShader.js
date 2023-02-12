import * as THREE from 'three'
import gsap from 'gsap'
import vertex from '@/shader/flyline/vertex.glsl'
import fragment from '@/shader/flyline/fragment.glsl'

export default class FlyLine {
  constructor (position = { x: 0, z: 0 }, color = 0x00ff00, lineWidth = 0.2) {
    // 根据点生成曲线
    const linePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(position.x / 2, 4, position.z / 2),
      new THREE.Vector3(position.x, 0, position.z)

    ]

    // 创建曲线
    this.lineCurve = new THREE.CatmullRomCurve3(linePoints)
    // 将曲线划分的段数
    const points = this.lineCurve.getPoints(1000)
    // 创建几何体顶点
    this.geometry = new THREE.BufferGeometry().setFromPoints(points)

    // 给每个顶点设置属性
    const aSizeArray = new Float32Array(points.length)
    for (let i = 0; i < aSizeArray.length; i++) {
      aSizeArray[i] = i
    }
    // 设置几何体顶点属性
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(aSizeArray, 1))

    //
    // 设置着色器材质
    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0
        },
        uColor: {
          value: new THREE.Color(color)
        },
        uLength: {
          value: points.length
        }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    this.mesh = new THREE.Points(this.geometry, this.shaderMaterial)
    gsap.to(this.shaderMaterial.uniforms.uTime, {
      value: 1000,
      duration: 1,
      repeat: -1,
      ease: 'none'
    })
  }

  remove () {
    this.mesh.remove()
    this.mesh.removeFromParent()
    this.mesh.material.dispose()
    this.mesh.geometry.dispose()
  }
}
