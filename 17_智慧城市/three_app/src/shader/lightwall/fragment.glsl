 precision lowp float;
 varying vec3 vPosition;
 uniform float uHeight;
 void main(){

    // 设置混合的百分比
    float gradMix = (vPosition.y+uHeight/2.0)/uHeight;
   //  // 计算出混合颜色
   //  vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
   //  gl_FragColor = vec4(gradMixColor,1);
  
    gl_FragColor = vec4(1.0,0.0,0.0,1.0-gradMix); 
        
   
   
 }