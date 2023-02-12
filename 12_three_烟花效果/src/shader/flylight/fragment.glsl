precision lowp float;

varying vec4 vPosition;
varying vec4 gPosition;
void main() {
    vec4 redColor = vec4(1.0, 0.0, 0.0, 1.0);
    vec4 yellowColor = vec4(1.0, 1.0, 0.0, 1.0);
    vec4 mixColor = mix(yellowColor, redColor, gPosition.y / 3.0);

    gl_FragColor = vec4(mixColor.xyz, 1.0);

    //判断是正面还是反面
    if(gl_FrontFacing) { //正面
        gl_FragColor = vec4(mixColor.xyz - (vPosition.y - 20.0) / 80.0 - 0.1, 1);
    }else {
        gl_FragColor = vec4(mixColor.xyz,1);
    }
}
