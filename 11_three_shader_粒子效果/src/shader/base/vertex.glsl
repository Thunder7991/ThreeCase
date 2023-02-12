precision lowp float;

uniform float uTime;
varying vec2 vUv;

attribute float imgIndex; // 获取模型中的属性
attribute float aScale;
varying float vImgIndex;

varying vec3 vColor;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  

    //获取顶点角度
    float angle = atan(modelPosition.x,modelPosition.z);
    //获取顶点到中心的距离
    float distanceToCenter = length(modelPosition.xz);
    //根据顶点到中心的距离,设置旋转偏移的度数
    float anglrOffset = 1.0 / distanceToCenter * uTime;
    //目前旋转的度数
    angle += anglrOffset;

    modelPosition.x = cos(angle)* distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;
      gl_Position = projectionMatrix * viewMatrix * modelPosition;

    //设置点的大小
    // gl_PointSize = 80.0;
    //根据 viewPosition 的 z坐标决定是否远离摄像机
    gl_PointSize = 100.0 / -(viewMatrix * modelPosition).z * aScale;
    vImgIndex = imgIndex;
    vColor = color;

}
