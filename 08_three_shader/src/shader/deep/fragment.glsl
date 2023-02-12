precision lowp float;
varying vec2 vUv;
//获取时间
uniform float uTime;
//缩放
uniform float uScale;
//随机函数
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) *
        43758.5453123);
}

//旋转函数 
vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x, cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y);
}

#define PI 3.1415926;

//噪声函数
float noise(in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
        (c - a) * u.y * (1.0 - u.x) +
        (d - b) * u.x * u.y;
}

vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

vec2 fade(vec2 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}
//新噪声
float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main() {
    //1. 通过顶点对应的UV , 决定每一个想在uv图像的位置, 通过这个位置x.y 决定颜色
    // gl_FragColor = vec4(vUv, 0.0, 1.0);

    //2. 对第一种变形
    // gl_FragColor = vec4(vUv,1.0,1.0);
    //3. 利用uv 实现渐变效果
    // vUv.x从左到右
    // float strength = vUv.x;
    // gl_FragColor = vec4(strength,strength,strength,1);

    //4/利用UV实现渐变效果, 从下到上
    // float strength = vUv.y;
    // gl_FragColor = vec4(strength,strength ,strength,1);
    //5.从上到下
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = vec4(strength,strength,strength,1);

    //6. 利用uv实现短范围内渐变
    // float strength = vUv.y * 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    //7. 斑马条纹 通过取模 达到反复的效果 , 中间反复渐变.
    // float strength =mod(vUv.y * 10.0,1.0);
    // gl_FragColor = vec4(strength, strength, strength, 1);
    //8.斑马条纹 利用step(edge,x) 函数,如果x < edge,返回0.0 否则返回1.0 
    //  float strength =mod(vUv.y * 10.0,1.0);
    //  strength  =  step(0.8,strength);
    //  gl_FragColor = vec4(strength, strength, strength, 1);

    // 9.斑马条纹 X 轴
    //  float strength =mod(vUv.x * 10.0,1.0);
    //  strength  =  step(0.8,strength);
    //  gl_FragColor = vec4(strength, strength, strength, 1);

    // //10. 条纹相加 
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0));

   //11. 条纹相乘
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0, 1.0));

      //12. 条纹相减
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength -= step(0.8, mod(vUv.y * 10.0, 1.0));

      //13.  箭头动画
    // float barx  = step(0.4, mod(vUv.x * 10.0 + uTime * 0.1, 1.0)) * step(0.8, mod(vUv.y * 10.0 + uTime * 0.1, 1.0));
    // float bary = step(0.4, mod(vUv.y * 10.0 + uTime * 0.1, 1.0)) * step(0.8, mod(vUv.x * 10.0 + uTime * 0.1, 1.0));
    // float strength = barx + bary;

    // gl_FragColor = vec4(strength, strength,strength,1);
    //14 T星图
    // float barx = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
    // float bary = step(0.4, mod(vUv.y * 10.0, 1.0)) * step(0.8, mod(vUv.x * 10.0, 1.0));
    // float strength = barx + bary;

    //15 利用绝对值 
    // float strength =abs(vUv.x - 0.5) ;

    // gl_FragColor = vec4(vUv, 1.0, strength);
// 16利用Y值
    // float strength = abs(vUv.y - 0.5);

    //17  min 最小值
    // float strength = min(abs(vUv.x - 0.5),abs(vUv.y - 0.5));

    //18 max 去最大值
    // float strength =1.0 - max(abs(vUv.x - 0.5),abs(vUv.y - 0.5));

    //19 step 中间黑色, 其他白色
    // float strength =step(0.2,max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));

    //20 step 小正方形, 中间白色 其他黑色
    // float strength =1.0 - step(0.2,max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));

    // 21.floor 向下去整 利用取整实现条纹渐变 
    // float strength = floor(vUv.x * 10.0) / 10.0; //整数 / 10
    // float strength = floor(vUv.y * 10.0) / 10.0; //整数 / 10
    //条纹相乘 渐变格子
    // float strength = floor(vUv.x * 10.0)/ 10.0 * floor(vUv.y * 10.0) / 10.0;

    //22.向上取整
    // float strength = ceil(vUv.x * 10.0) / 10.0 * ceil(vUv.y * 10.0) /10.0;

    //23.随机效果
    // float strength = random(vUv);
    //24 随机+格子效果
    // float strength = ceil(vUv.x * 10.0) / 10.0 * ceil(vUv.y * 10.0) /10.0;
    //  strength = random(vec2(strength,strength));

    //25 根据length 返回向量的长度 (根据半径 进行渐变)
    // float strength = length(vUv);

    //26: 两个向量之间的距离 distance ,
    // float strength = distance(vUv,vec2(0.5,0.5));

    // 27: 根据相除, 实现星星
    // float strength =0.15 / distance(vUv,vec2(0.5,0.5)) - 1.0;

    //28: 设置 vUv水平或者竖直变量 从 0到 1 变为从 0 到5
    // float strength =0.15 / distance(vec2(vUv.x,vUv.y * 5.0),vec2(0.5,0.5)) - 1.0;

        //29 十字交叉的星星
        // float strength  = 0.15 / distance(vec2(vUv.x,(vUv.y - 0.5) * 5.0 + 0.5),vec2(0.5,0.5)) - 1.0;
        //  strength  += 0.15 / distance(vec2(vUv.y,(vUv.x - 0.5) * 5.0 + 0.5),vec2(0.5,0.5)) - 1.0;

    //30 旋转飞镖, 旋转UV
    // vec2 rotateUv = rotate(vUv, 3.1415926 * 0.25, vec2(0.5, 0.5));
    //动态旋转
    // vec2 rotateUv = rotate(vUv, uTime, vec2(0.5, 0.5));
    // float strength = 0.15 / distance(vec2(rotateUv.x, (rotateUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    // strength += 0.15 / distance(vec2(rotateUv.y, (rotateUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;

    //31 绘制圆
    // float strength =1.0 - step(0.5,distance(vUv, vec2(0.5)) + 0.25);    

    //32 绘制圆环
//    float strength = step(0.5,distance(vUv, vec2(0.5)) + 0.35);   
//      strength *= 1.0 - step(0.5,distance(vUv, vec2(0.5)) + 0.25);   

        //33 渐变环
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);   

    //34 打靶 圆环
    //  float strength = step(0.1,abs(distance(vUv, vec2(0.5)) - 0.25));   

    //35 圆环
    // float strength = 1.0 - step(0.1,abs(distance(vUv, vec2(0.5)) - 0.25));   

    //36 波浪环
    // vec2 waveUv = vec2(vUv.x, vUv.y + sin(vUv.x * 30.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    //37 
    //  vec2 waveUv = vec2(vUv.x + sin(vUv.x *30.0)*0.1, vUv.y + sin(vUv.x * 30.0) * 0.1);
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25));

    // 38  正切
    // float angle = atan(vUv.x,vUv.y);
    // float strength = angle

    // 39 根据角度实现螺旋渐变
    // float angle = atan(vUv.x - 0.5,vUv.y - 0.5);
    // float strength = (angle + 3.14) / 6.28;

    //40 实现雷达扫描
    // float alpha = 1.0 - step(0.1, abs(distance(vUv, vec2(0.5))));
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = (angle + 3.14) / 6.28;

    //41 通过实时实现动态旋转
    // vec2 rotateUv = rotate(vUv, uTime, vec2(0.5, 0.5));
    // float alpha = 1.0 - step(0.1, abs(distance(rotateUv, vec2(0.5))));
    // float angle = atan(rotateUv.x - 0.5, rotateUv.y - 0.5);
    // float strength = (angle + 3.14) / 6.28;
    // gl_FragColor = vec4(strength, strength, strength, alpha);

    //42 万花筒
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) /PI;
    // float strength =mod(angle*10.0,1.0) ;

    //43光芒四射
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / 2.0 * PI;
    // float strength = sin(angle * 30.0);

    //44 使用噪声实现延误、波纹效果
    // float  strength  = noise(vUv);

    // float  strength  = noise(vUv * 100.0);

    // float  strength  =step(0.5,noise(vUv * 100.0));

        //通过时间设置波形
    // float  strength  =step(uScale,cnoise((vUv+ uTime) * 10.0 ) );

    // float  strength  =abs(cnoise((vUv) * 10.0 ) );

    //发光路径
    // float strength = 1.0 - abs(cnoise((vUv) * 10.0));

    //黑色路径
    // float strength = sin(cnoise((vUv) * 10.0));

    //波纹效果 动态
    // float strength = sin(cnoise((vUv) * 10.0 + uTime) * 5.0 );

    // float strength = step(0.9,sin(cnoise((vUv) * 10.0 ) * 20.0 ));

    //使用混合函数混合颜色
    vec3 blackColor = vec3(1, 0.0, 1);
    vec3 yellowColor = vec3(1.0, 1.0, 0.0);
    vec3 uvColor = vec3(vUv,1.0);

    float strength = step(0.9, sin(cnoise((vUv) * 10.0) * 20.0));
    // vec3 mixColor = mix(uvColor, yellowColor,strength);
    vec3 mixColor = mix(yellowColor,uvColor,strength);

    // gl_FragColor = vec4(mixColor, 1.0);

    gl_FragColor = vec4(mixColor, 1.0);

    // gl_FragColor = vec4(strength, strength, strength, 1);

}
