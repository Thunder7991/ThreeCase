precision lowp float;
varying float vElevation;
uniform vec3 uHightColor;
uniform vec3 uLowColor;
uniform float uOpacity;
void main() {
    //从低到高位置
    float a = (vElevation + 1.0) / 2.0;
    vec3 color = mix(uLowColor,uHightColor,a);
    gl_FragColor = vec4(color , uOpacity);
}
