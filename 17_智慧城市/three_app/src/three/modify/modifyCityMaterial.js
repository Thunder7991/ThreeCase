import * as THREE from 'three'
import gsap from 'gsap'
function modifyCityMaterial (mesh) {
  mesh.material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
          #include <dithering_fragment>
          //#end#
    `
    )
    addGradColor(shader, mesh)
    addSpread(shader, mesh)
    addLightLine(shader)
    addToTopLine(shader)
  }
}

export default modifyCityMaterial

/**
 *  添加渐变
 * @param {*} shader
 * @param {*} mesh
 */
export function addGradColor (shader, mesh) {
  // 计算当前几何体的的边界矩形，该操作会更新已有 [param:.boundingBox]。边界矩形不会默认计算，需要调用该接口指定计算边界矩形，否则保持默认值 null。
  mesh.geometry.computeBoundingBox()
  // 获取物体的最低和最高的高度
  const { min, max } = mesh.geometry.boundingBox
  //   获取物体的高度差
  const uHeight = max.y - min.y

  shader.uniforms.uTopColor = {
    value: new THREE.Color('#aaaeff')
  }
  shader.uniforms.uHeight = {
    value: uHeight
  }

  // 顶点着色器common
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
      #include <common>
      varying vec3 vPosition;
        `
  )
  // 着色器开始位置
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
      #include <begin_vertex>
    vPosition = position;
    `
  )
  // 片源 添加相关变量
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
  #include <common>
    
  uniform vec3 uTopColor;
  uniform float uHeight;
  varying vec3 vPosition;

      `
  )

  // 片元着色器
  shader.fragmentShader = shader.fragmentShader.replace(
    // '#include <dithering_fragment>',
    ' //#end#',
    `
      #include <dithering_fragment>
      vec4 distGradColor = gl_FragColor;

    // 设置混合的百分比
    float gradMix = (vPosition.y+uHeight/2.0)/uHeight;
    // 计算出混合颜色
    vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
    gl_FragColor = vec4(gradMixColor,1);
    //#end#
      `
  )
}

export function addSpread (shader, mesh) {
  // 获取扩散中心
  shader.uniforms.uSpreadCenter = {
    value: new THREE.Vector2(0, 0)
  }
  // 扩散时间
  shader.uniforms.uSpreadTime = { value: 0 }

  // 设置条带的宽度
  shader.uniforms.uSpreadWidth = {
    value: 40
  }

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
     #include <common>
     uniform vec2 uSpreadCenter;
     uniform float uSpreadTime;
     uniform float uSpreadWidth;
    `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    ' //#end#',
    `
    //距离
    float spreadRadius = distance(vPosition.xz,uSpreadCenter);
    //扩散范围的函数
    float spreadIndex = -(spreadRadius - uSpreadTime) * (spreadRadius - uSpreadTime) + uSpreadWidth;
    
    if(spreadIndex > 0.0) {
        gl_FragColor = mix(gl_FragColor,vec4(1.0,1.0,1.0,1.0),spreadIndex/uSpreadWidth);
    }

    //#end#
    `
  )

  gsap.to(shader.uniforms.uSpreadTime, {
    value: 800,
    duration: 2,
    ease: 'none',
    repeat: -1,
    yoyo: false // 来回运动
  })
}

// 添加扫描线段
export function addLightLine (shader, mesh) {
  // 扩散时间
  shader.uniforms.uLightLineTime = { value: -1500 }

  // 设置条带的宽度
  shader.uniforms.uLightLineWidth = {
    value: 40
  }

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
      `
       #include <common>
       uniform float uLightLineTime;
       uniform float uLightLineWidth;
      `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    ' //#end#',
      `
      //扩散范围的函数
      float lightLineMix = -(vPosition.x + vPosition.z - uLightLineTime) * (vPosition.x + + vPosition.z - uLightLineTime) + uLightLineWidth;
      
      if(lightLineMix > 0.0) {
          gl_FragColor = mix(gl_FragColor,vec4(1.0,0.8,0.8,1.0),lightLineMix/uLightLineWidth);
      }
  
      //#end#
      `
  )

  gsap.to(shader.uniforms.uLightLineTime, {
    value: 1500,
    duration: 5,
    ease: 'none',
    repeat: -1,
    yoyo: false // 来回运动
  })
}

export function addToTopLine (shader, mesh) {
  // 扩散时间
  shader.uniforms.uToTopTime = { value: 0 }

  // 设置条带的宽度
  shader.uniforms.uToTopWidth = {
    value: 40
  }

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
        `
         #include <common>
         uniform float uToTopTime;
         uniform float uToTopWidth;
        `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    ' //#end#',
        `
        //扩散范围的函数
        float toTopMix = -(vPosition.y  - uToTopTime) * ( vPosition.y - uToTopTime) + uToTopWidth;
        
        if(toTopMix > 0.0) {
            gl_FragColor = mix(gl_FragColor,vec4(0.8,0.8,1.0,1.0),toTopMix/uToTopWidth);
        }
    
        //#end#
        `
  )

  gsap.to(shader.uniforms.uToTopTime, {
    value: 1500,
    duration: 5,
    ease: 'none',
    repeat: -1,
    yoyo: false // 来回运动
  })
}
