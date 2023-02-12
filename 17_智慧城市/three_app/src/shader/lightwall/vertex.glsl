precision lowp float;
varying vec3 vPosition;

void main() {
    vPosition = position;
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(position,1);
    gl_Position = projectionMatrix * viewPosition;

   
}