import * as THREE from 'three';
import startPointFragment from '../shader/startPoint/fragment.glsl';
import startPointVertex from '../shader/startPoint/vertex.glsl';

import fireWorkFragment from '../shader/firework/fragment.glsl';
import fireWorkVertex from '../shader/firework/vertex.glsl';

// import

export default class FireWorks {
  constructor(color, to, from = { x: 0, y: 0, z: 0 }) {
    this.color = new THREE.Color(color);
    console.log('创建烟花~');
    //创建烟花的发射的球点
    this.startGeometry = new THREE.BufferGeometry();
    //位置存储, 只有一个位置
    const startPositionArray = new Float32Array(3);
    startPositionArray[0] = from.x;
    startPositionArray[1] = from.y;
    startPositionArray[2] = from.z;
    //设置positon相关属性
    this.startGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(startPositionArray, 3),
    );

    //计算to from 的向量坐标
    const astepArray = new Float32Array(3);
    astepArray[0] = to.x - from.x;
    astepArray[1] = to.y - from.y;
    astepArray[2] = to.z - from.z;
    this.startGeometry.setAttribute(
      'aStep',
      new THREE.BufferAttribute(astepArray, 3),
    );

    //设置着色器材质
    this.startMaterial = new THREE.ShaderMaterial({
      vertexShader: startPointVertex,
      fragmentShader: startPointFragment,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 20,
        },
        uColor: {
          value: this.color,
        },
      },
    });
    //创建烟花点球
    this.startPoint = new THREE.Points(this.startGeometry, this.startMaterial);

    //开始及时
    this.clock = new THREE.Clock();

    // 1. 创建爆炸的烟花
    this.fireworkGeometry = new THREE.BufferGeometry();
    // 1.1 小型烟花数量
    this.fireworksCount = 180 + Math.floor(Math.random() * 180);
    //1.2 眼熟向量点位 vec3(喷发量)
    const positionFireworksArray = new Float32Array(this.fireworksCount * 3);
    //1.3 粒子大小
    const scaleFireArray = new Float32Array(this.fireworksCount);

    //1.4 方向 vec3
    let directionArray = new Float32Array(this.fireworksCount * 3);
    for (let i = 0; i < this.fireworksCount; i++) {
      //开始烟花的位置
      positionFireworksArray[i * 3 + 0] = to.x;
      positionFireworksArray[i * 3 + 1] = to.y;
      positionFireworksArray[i * 3 + 2] = to.z;
      //设置烟花所有粒子初始化大小
      scaleFireArray[i] = Math.random();
      //设置四周发射的角度
      let theta = Math.random() * 2 * Math.PI; //θ
      let beta = Math.random() * 2 * Math.PI; // β
      let r = Math.random(); //半径
      //三角函数
      /**
       * 简化成一个数学问题：
       * 现在在三维坐标系XYZ中，有一条线段长度为r，
       * 与X轴夹角为bate，与Y轴夹角为theta，
       * 求线段顶点坐标的
       */
      directionArray[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta);
      directionArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta);
      directionArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta);
    }
    this.fireworkGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positionFireworksArray, 3),
    );
    this.fireworkGeometry.setAttribute(
      'aScale',
      new THREE.BufferAttribute(scaleFireArray, 1),
    );
    this.fireworkGeometry.setAttribute(
      'aRandom',
      new THREE.BufferAttribute(directionArray, 3),
    );
    //烟花材质
    this.fireWorksMatreial = new THREE.ShaderMaterial({
      fragmentShader: fireWorkFragment,
      vertexShader: fireWorkVertex,
      uniforms: {
        uTime: {
          value: 0,
        },
        uSize: {
          value: 0,
        },
        uColor: {
          value: this.color,
        },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    //烟花实体
    this.fireworks = new THREE.Points(
      this.fireworkGeometry,
      this.fireWorksMatreial,
    );

    //创建音频
    this.linstener = new THREE.AudioListener();
    this.linstener1 = new THREE.AudioListener();

    this.sound = new THREE.Audio(this.linstener);
    this.sendSound = new THREE.Audio(this.linstener1);
    //创建音频加载器
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(
      `./assets/audio/pow${Math.floor(Math.random() * 4) + 1}.ogg`,
      (buffer) => {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(false);
        this.sound.setVolume(1); //音量 1 = 100%
      },
    );
    audioLoader.load('./assets/audio/send.mp3', (buffer) => {
      this.sendSound.setBuffer(buffer);
      this.sendSound.setLoop(false);
      this.sendSound.setVolume(1);
    });
  }
  //添加到场景
  addScene(scene, camera) {
    scene.add(this.startPoint);
    scene.add(this.fireworks);
    this.scene = scene;
  }
  update() {
    const diffTime = this.clock.getElapsedTime();
    // console.log(diffTime)

    //开始的时候小球从0 - 1移动
    if (diffTime>0.2 && diffTime < 1) {
      this.startMaterial.uniforms.uTime.value = diffTime;
      this.startMaterial.uniforms.uSize.value = 20;

      if (!this.sendSound.isPlaying && !this.sendSoundplay) {
        this.sendSound.play();
        this.sendSoundplay = true;
      }

    } else if (diffTime>0.2) {
      
    
      const time = diffTime - 1;
      //点元素消失
      this.startMaterial.uniforms.uSize.value = 0;
      this.startPoint.clear();
      this.startGeometry.dispose();
      this.startMaterial.dispose();

      if (!this.sound.isPlaying && !this.play) {
        this.sound.play();
        this.play = true;
      }

      //设置烟花显示
      this.fireWorksMatreial.uniforms.uSize.value = 20;
      this.fireWorksMatreial.uniforms.uTime.value = time;

      if (time > 5) {
        this.fireWorksMatreial.uniforms.uSize.value = 0;
        this.fireworks.clear();
        this.fireWorksMatreial.dispose();
        this.fireworkGeometry.dispose();
        this.scene.remove(this.fireworks);
        this.scene.remove(this.startPoint);
        return 'remove';
      }
    }
  }
}
