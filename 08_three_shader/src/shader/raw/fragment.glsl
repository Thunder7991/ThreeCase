precision lowp float;
varying vec2 vUv;
varying float vElevation;

//导入 图片纹理
uniform sampler2D uTexture;

void main() {
    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    // float deep = vElevation + 0.05 * 10.0;
    // gl_FragColor = vec4(1.0 * deep, 0.0, 0.0, 1.0);

    //根据UV进行采样 , 去除对应的颜色
    float height = vElevation + 0.05 * 10.0;
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= height;
    gl_FragColor = textureColor;

}
