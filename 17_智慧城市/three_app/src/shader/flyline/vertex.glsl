precision lowp float;
varying float vSize;
attribute float aSize;
uniform float uTime;

uniform float uLength;
void main() {
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(position,1);
    gl_Position = projectionMatrix * viewPosition;

    vSize =( aSize - 500.0 - uTime);
    if(vSize < 0.0) {
        vSize = vSize + uLength;
    }
    vSize =(vSize - 500.0) * 0.1;
    
    //设置点位大小
    gl_PointSize = -vSize / viewPosition.z;
}