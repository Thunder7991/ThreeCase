//片元着色器
uniform sampler2D uTexture;
uniform vec3 uColor;
void main() {
    //点坐标 对应 点纹理
    vec4 uTextureColor = texture2D(uTexture,gl_PointCoord);
    //
    gl_FragColor =vec4(uColor,uTextureColor.x);
}