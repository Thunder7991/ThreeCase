//顶点着色器
precision lowp float;
//定义位置 终点
attribute vec3 aPosition;

//时间
uniform float uTime;

void main() {
    //起点
    vec4 currentPosition = modelMatrix * vec4(position, 1.0); 
    //方向
    vec3 direction = aPosition - currentPosition.xyz;
    //目标位置
    vec3 targetPostion = currentPosition.xyz + direction * 0.1 * uTime;
// modelMatrix * vec4(position,1.0);
    vec4 vPositon = viewMatrix * vec4(targetPostion, 1.0);
    gl_Position = projectionMatrix * vPositon;
    //-10 : 朝向我们是正方向, 远离我们是负方向
    gl_PointSize = -50.0 / vPositon.z;
}