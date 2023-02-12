import React, { useEffect } from 'react';
import { threeWrapper } from './style';
import * as THREE from 'three';
import gui from '@/three/gui.js';
import scene from './three/scene';
import camera from './three/camera';
import renderer from './three/render';
import axesHelper from './three/axexHelper';
import earth from './three/mesh/createEarth';

import light from './three/light';
import '@/three/animate';


// three.js 相关
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
// import lineFragmentShader from '@/containers/EarthDigital/shaders/line/fragment.glsl';
// echarts 相关
import * as echarts from 'echarts/core';
import { BarChart /*...*/ } from 'echarts/charts';
import { GridComponent /*...*/ } from 'echarts/components';
import { LabelLayout /*...*/ } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([BarChart, GridComponent /* ...*/]);
// console.log(scene);
scene.add(camera);
scene.add(axesHelper);
// scene.add(controls);
function App() {
  useEffect(() => {
    renderer.canvas = document.querySelector('canvas.webgl');
    scene.add(earth)

  });

  return (
    <three-wrapper>
      <canvas className='webgl'></canvas>
      <header className='hud header'></header>
      <header></header>
      <aside className='hud aside left'></aside>
      <aside className='hud aside right'></aside>
      <footer className='hud footer'></footer>
    </three-wrapper>
  );
}

export default App;
