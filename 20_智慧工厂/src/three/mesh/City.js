import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import gsap from 'gsap';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import eventHub from '@/utils/eventHub';
import cameraModule from '../camera';
import fragmentShader from '@/shader/fighter/fragmentShader.glsl';
import vertexShader from '@/shader/fighter/vertexShader.glsl';

export default class City {
  constructor(scene) {
    // 载入模型
    this.scene = scene;
    this.loader = new GLTFLoader();
    //解压缩
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./draco/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    dracoLoader.preload();
    this.loader.setDRACOLoader(dracoLoader);

    this.floor1;
    this.floor2;
    this.fighter;
    this.wall;
    this.fighterPointsG;
    this.floor2Tags = [];

    this.loader.load('./model/floor1.glb', (gltf) => {
      this.floor1 = gltf.scene;
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material.emissiveIntensity = 5;
        }
      });
      this.floor1.visible = false;
      scene.add(gltf.scene);
    });
    this.loader.load('./model/floor2.glb', (gltf) => {
      this.floor2 = gltf.scene;
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material.emissiveIntensity = 15;
        }
        if (child.type === 'Object3D' && child.children.length == 0) {
          const css3dObject = this.createTag(child);
          css3dObject.visible = false;
          this.floor2Tags.push(css3dObject);
          this.floor2.add(css3dObject);
        }
      });
      this.floor2.visible = false;
      scene.add(gltf.scene);
    });
    //添加外墙
    this.loader.load('./model/wall.glb', (gltf) => {
      scene.add(gltf.scene);
      this.wall = gltf.scene;
    });
    //战斗机模型加载
    this.loader.load('./model/Fighter.glb', (gltf) => {
      this.fighter = gltf.scene;
      this.fighter.visible = true;
      scene.add(this.fighter);
      this.fighter.position.set(3, 42, 68);
      this.fighter.traverse((child) => {
        if (child.isMesh) {
          child.material.emissiveIntensity = 15;
        }
      });
      // this.showFighter();
    });

    this.initEvent();

    this.mouse = new THREE.Vector2();

    this.raycaster = new THREE.Raycaster();

    //点击事件
    window.addEventListener('click', (event) => {
      //   console.log(event);
      //   对时间对象进行加工
      event.mesh = this;
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);

      //通过摄像机和鼠标位置更新射线
      this.raycaster.setFromCamera(this.mouse, cameraModule.activeCamera);

      //进行检测
      const intersects = this.raycaster.intersectObject(this.fighter);
      //   console.log(intersects);
      if (intersects.length > 0) {
        //   真正触发精灵的点击事件
        if (this.floor2.visible) {
          this.floor2.visible = false;
          this.floor2Tags.forEach((tag) => {
            tag.visible = false;
          });
        } else {
          this.floor2.visible = true;
          this.floor2Tags.forEach((tag) => {
            tag.visible = true;
          });
        }
      }
    });
  }

  createTag(object3D) {
    //创建元素 广告牌
    const ele = document.createElement('div');
    ele.className = 'eleTag';
    ele.innerHTML = `
      <div class="elementContent">
      <h3>智慧工厂</h3>
      <p>温度：26℃</p>
      <p>湿度：50%</p>
    `;
    const objectCss3D = new CSS3DObject(ele);
    objectCss3D.scale.set(0.2, 0.2, 0.2);
    objectCss3D.position.copy(object3D.position);
    // this.scene.add(objectCss3D)
    return objectCss3D;
  }
  showOrHidden(floorName, bool, ...args) {
    this[floorName].visible = bool;
    if (args.length > 0) {
      this.floor2Tags.forEach((css3) => {
        css3.visible = args[0];
      });
    }
  }
  initEvent() {
    eventHub.on('showFloor1', () => {
      this.showOrHidden('floor1', true);
      this.showOrHidden('wall', false);
      this.showOrHidden('floor2', false, false);
      this.showOrHidden('fighter', false);
    });

    eventHub.on('showFloor2', () => {
      this.showOrHidden('floor2', true, true);
      this.showOrHidden('fighter', true);
      this.showOrHidden('wall', false);
      this.showOrHidden('floor1', false);
    });

    eventHub.on('showWall', () => {
      this.showOrHidden('wall', true);
      this.showOrHidden('floor2', false, false);
      this.showOrHidden('fighter', false);
      this.showOrHidden('floor1', false);
    });
    eventHub.on('showAll', () => {
      this.showOrHidden('wall', true);
      this.showOrHidden('floor2', true, true);
      this.showOrHidden('floor1', true);
      gsap.to(this.wall.position, {
        y: 200,
        duration: 1,
        // repeat:1,
      });
      gsap.to(this.floor2.position, {
        y: 100,
        duration: 1,
        delay: 1,
      });
    });

    eventHub.on('hideAll', () => {
      gsap.to(this.wall.position, {
        y: 0,
        duration: 1,
        // repeat:1,
        delay: 1,
        onComplete: () => {
          this.showOrHidden('floor2', false, false);
          this.showOrHidden('floor1', false);
        },
      });
      gsap.to(this.floor2.position, {
        y: 0,
        duration: 1,
      });
    });
    //展开飞机模型
    eventHub.on('flatFighter', (bool) => {
      // console.log(this.fighter);
      //将飞机展示成立方体
      //获取立方体点的位置

      let n = 0;
      if (bool) {
        const positions = [];
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < 5; j++) {
            positions.push(new THREE.Vector3(i * 2 - 2, 0, j * 2 - 2));
          }
        }
        this.fighter.traverse((child) => {
          if (child.isMesh) {
            positions[n].multiplyScalar(20);
            //保留一份数据
            child.position2 = child.position.clone();
            gsap.to(child.position, {
              x: positions[n].x,
              y: positions[n].y,
              z: positions[n].z,
              duration: 1,
            });
            n++;
          }
        });
      } else {
        this.fighter.traverse((child) => {
          console.log(child);
          if (child.isMesh) {
            gsap.to(child.position, {
              x: child.position2.x,
              y: child.position2.y,
              z: child.position2.z,
              duration: 1,
            });
          }
        });
      }
    });
    eventHub.on('pointsEffect', () => {
      // this.scene.add(this.transformPoints(this.fighter));
      // this.scene.add(this.transformPoints3(this.fighter));
      this.createPoints(this.fighter);
    });
    //粒子爆炸
    eventHub.on('pointsBlast', () => {
      this.pointsBlast();
    });
    //粒子模型恢复
    eventHub.on('pointsRestore', () => {
      this.pointsRestore()
    });
    //创建粒子
    eventHub.on('pointsFighter', () => {
      this.createPoints(this.fighter);
    });
  }
  //爆炸
  pointsBlast() {
    //判断 当前是否是个点
    this.fighterPointsG.traverse((child) => {
      console.log(child.isPoints);
      if (child.isPoints) {
        //有多少顶点就生成多少个位置
        let randomPositionArray = new Float32Array(
          child.geometry.attributes.position.count * 3,
        );
        for (let i = 0; i < randomPositionArray.length; i++) {
          //三个为一组
          randomPositionArray[i * 3 + 0] = (Math.random() * 2 - 1) * 10;
          randomPositionArray[i * 3 + 1] = (Math.random() * 2 - 1) * 10;
          randomPositionArray[i * 3 + 2] = (Math.random() * 2 - 1) * 10;
        }
        child.geometry.setAttribute(
          "aPosition",
          new THREE.BufferAttribute(randomPositionArray,3)
        )
      
        gsap.to(child.material.uniforms.uTime,{
          value:10,
          duration:10,
  
        })
      }
   
    });


  }
  showFighter() {
    this.floor1 && this.showOrHidden('floor1', false, false);
    this.floor2 && this.showOrHidden('floor2', false);
    this.wall && this.showOrHidden('wall', false);
    this.fighter.visible = true;
  }
  //粒子爆炸效果 (递归)
  transformPoints(object3d) {
    //创建纹理图案
    const texture = new THREE.TextureLoader().load('./assets/particles/1.png');

    const group = new THREE.Group();

    function createPoints(object3d, newObject3d) {
      if (object3d.children.length > 0) {
        object3d.children.forEach((child) => {
          if (child.isMesh) {
            //随机生成颜色
            const color = new THREE.Color(
              Math.random(),
              Math.random(),
              Math.random(),
            );
            const material = new THREE.PointsMaterial({
              size: 0.1,
              color,
              map: texture,
              blending: THREE.AdditiveBlending, //混合模式
              transparent: true,
              depthTest: false,
            });

            const points = new THREE.Points(child.geometry, material);
            points.position.copy(child.position);
            //选装
            points.rotation.copy(child.rotation);
            points.scale.copy(child.scale);
            newObject3d.add(points);
            createPoints(child, points);
          }
        });
      }
    }
    createPoints(object3d, group);
    return group;
  }
  //粒子效果02
  transformPoints2(object3d) {
    const texture = new THREE.TextureLoader().load('./assets/particles/1.png');
    const group = new THREE.Group();
    object3d.traverse((child) => {
      if (child.isMesh) {
        const points = child.geometry.attributes.position.array;
        // const colors = child.geometry.attributes.array;
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(points, 3),
        );
        // geometry.setAttribute(
        //   'color',
        //   new THREE.Float32BufferAttribute(colors, 3),
        // );
        //随机生成颜色
        const color = new THREE.Color(
          Math.random(),
          Math.random(),
          Math.random(),
        );
        const material = new THREE.PointsMaterial({
          size: 0.1,
          color,
          map: texture,
          blending: THREE.AdditiveBlending, //混合模式
          transparent: true,
          depthTest: false,
        });
        const pointsMesh = new THREE.Points(geometry, material);
        pointsMesh.position.copy(child.position);
        pointsMesh.rotation.copy(child.rotation);
        pointsMesh.scale.copy(child.scale);
        group.add(pointsMesh);
      }
    });
    return group;
  }

  //粒子效果03 着色器
  transformPoints3(object3d) {
    //创建纹理图案
    const texture = new THREE.TextureLoader().load('./assets/particles/1.png');

    const group = new THREE.Group();

    function createPoints(object3d, newObject3d) {
      if (object3d.children.length > 0) {
        object3d.children.forEach((child) => {
          if (child.isMesh) {
            //随机生成颜色
            const color = new THREE.Color(
              Math.random(),
              Math.random(),
              Math.random(),
            );
            const material = new THREE.ShaderMaterial({
              vertexShader: vertexShader,
              fragmentShader: fragmentShader,
              transparent: true,
              depthTest: false,
              blending: THREE.AdditiveBlending,
              uniforms: {
                uColor: { value: color },
                uTexture: {
                  value: texture,
                },
                uTime:{
                  value:0
                }
              },
            });

            const points = new THREE.Points(child.geometry, material);
            points.position.copy(child.position);
            //选装
            points.rotation.copy(child.rotation);
            points.scale.copy(child.scale);
            newObject3d.add(points);
            createPoints(child, points);
          }
        });
      }
    }
    createPoints(object3d, group);
    return group;
  }
  createPoints(object3d) {
    if (!this.fighterPointsG) {
      this.fighterPointsG = this.transformPoints3(object3d);
      this.scene.add(this.fighterPointsG);
    }
  }
  //粒子恢复
  pointsRestore() {
    this.fighterPointsG.traverse(child => {
      if (child.isPoints) {
        gsap.to(child.material.uniforms.uTime,{
          value:0,
          duration:10,
  
        })
      }
    })
  }
}
