precision lowp float;
uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;
mat2 rotate2d(float _angle) {
   return mat2(cos(_angle), -sin(_angle), sin(_angle), cos(_angle));
}
void main() {
      // vUv - 0.5 调整旋转中心 
   vec2 newUv = rotate2d(uTime * 6.28) * (vUv - 0.5);
   newUv += 0.5;
   float alpha = 1.0 - step(0.1, abs(distance(vUv, vec2(0.5))));

   float angle = atan(newUv.x - 0.5, newUv.y - 0.5);
   float strength = (angle + 3.14) / 6.28; // 0- 1

   gl_FragColor = vec4(uColor, alpha * strength);

}