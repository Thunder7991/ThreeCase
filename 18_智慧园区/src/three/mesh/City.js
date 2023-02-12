import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import gsap from 'gsap';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import eventHub from '@/utils/eventHub';
import cameraModule from '../camera';

export default class City {
  constructor(scene) {
    // 载入模型
    this.scene = scene;
    this.loader = new GLTFLoader();
    //解压缩
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./draco/');
    this.loader.setDRACOLoader(dracoLoader);
    this.loader.load('./model/city4.glb', (gltf) => {
      console.log(gltf);
      scene.add(gltf.scene);

      //遍历子元素
      this.gltf = gltf
      gltf.scene.traverse((child) => {
        if (child.name === '热气球') {
          this.mixer = new THREE.AnimationMixer(child);
          this.clip = gltf.animations[0];
          this.action = this.mixer.clipAction(this.clip)
          this.action.play()
        }

        if (child.name==="汽车园区轨迹") {
          const line = child
          line.visible = false
          //根据点创建曲线
          const points = []
          for(let i=line.geometry.attributes.position.count-1;i>=0;i--) {

            points.push(
              new THREE.Vector3(
                line.geometry.attributes.position.getX(i),
                line.geometry.attributes.position.getY(i),
                line.geometry.attributes.position.getZ(i)
              )
            )
          }
          // 从一系列的点创建一条平滑的三维样条曲线。
          this.curve = new THREE.CatmullRomCurve3(points)
          this.curveProgress = 0
          this.carAnimation() 
        }
        if (child.name === "redcar") {
          this.redCar = child
        }
      });
      //添加相机
      gltf.cameras.forEach((camera) => {
        // scene.add(camera)
        cameraModule.add(camera.name,camera)
      })
    });
    //点击左侧菜单栏，切换热气球事件 ，BigScreen触发，在此监听
    eventHub.on("actionClick",(i) => {
      console.log(i);
      //重置
      this.action.reset()
      this.clip= this.gltf.animations[i]
      this.action = this.mixer.clipAction(this.clip)
      this.action.play()
    })
  }

  update (time) {  
    if (this.mixer) {
      this.mixer.update(time)
    }
  }
  carAnimation() {
    gsap.to(this, { 
      curveProgress:0.999,
      duration:20,
      repeat:-1,
      onUpdate:() => {
       
        const point = this.curve.getPoint(this.curveProgress)
        this.redCar.position.set(point.x,point.y,point.z)
        //调整方向
        if (this.curveProgress+0.001 <1 ) {
            const point = this.curve.getPoint(this.curveProgress + 0.001)
            this.redCar.lookAt(point)
        }
      }

    })
  }
  

}
