// height : -2^16 - 2 ^ 16
// mediump : -2 ^10 - 2 ^ 10
// lowp -2^8 : - 2 ^ 8
//告诉gpu 什么精度去计算
precision lowp float;
//每个顶点特殊的信息变量
attribute vec3 position;
attribute vec2 uv;

//通用变量
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
//获取时间
uniform float uTime;

varying vec2 vUv;
varying float vElevation;



void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //X轴向前移动
    // modelPosition.x += 1.0;
    // modelPosition.z += 1.0;
    //倾斜效果
    // modelPosition.z += modelPosition.x; 
    // 着色器内置函数
    modelPosition.z = sin((modelPosition.x + uTime) * 10.0) * 0.05;
    modelPosition.z += sin((modelPosition.y + uTime) * 10.0) * 0.05;
    vElevation = modelPosition.z;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

}
