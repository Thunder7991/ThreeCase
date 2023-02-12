import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import cameraModule from "./camera";
import {renderer} from "./renderer";
import eventHub from "@/utils/eventHub";

class ControlsModule {
  constructor() {
    this.setOrbitControls();
    eventHub.on("toggleControls", (name) => {
      this[`set${name}Controls`]();
    });
  }

  //设置轨迹球
  setOrbitControls() {
    // 初始化控制器
    console.log(renderer);
    this.controls = new OrbitControls(
      cameraModule.activeCamera,
      renderer.domElement
    );
    // 设置控制器阻尼
    this.controls.enableDamping = true;
    // 设置自动旋转
    // controls.autoRotate = true;
    //能能够垂直旋转角度上限
    this.controls.maxPolarAngle = Math.PI / 2;
    
    this.controls.minPolarAngle = 0;
  }
 //飞行控制器
  setFlyControls() { 
    this.controls = new FlyControls(
      cameraModule.activeCamera,
      renderer.domElement
    );
    this.controls.movementSpeed = 100;
    this.controls.rollSpeed = Math.PI / 60;
  }
  setFirstPersonControls() {
    this.controls = new FirstPersonControls(
      cameraModule.activeCamera,
      renderer.domElement
    );
    this.controls.movementSpeed = 100;
    this.controls.rollSpeed = Math.PI / 60;
  }
}

export default new ControlsModule();
