//创建地球
import * as THREE from 'three';
import controls from '../controls';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

//创建球类坐标
let sph = new THREE.Spherical();
let dummyObj = new THREE.Object3D();

let p = new THREE.Vector3();
let geoms = [],
  rad = 5,
  r = 0;

let dlong = Math.PI * (3 - Math.sqrt(5));

let dz = 2 / -0.5;

let long = 0;
let z = 1 - dz / 2;

let params = {
  colors: { base: '#f9f002', gradInner: '#8ae66e', gradOuter: '#03c03c' },
  reset: () => {
    controls.reset();
  },
};

let uniforms = {
  // impacts: { value: impacts },
  // 陆地色块大小
  maxSize: { value: 0.04 },
  // 海洋色块大小
  minSize: { value: 0.025 },
  // 冲击波高度
  waveHeight: { value: 0.1 },
  // 冲击波范围
  scaling: { value: 1 },
  // 冲击波径向渐变内侧颜色
  gradInner: { value: new THREE.Color(params.colors.gradInner) },
  // 冲击波径向渐变外侧颜色
  gradOuter: { value: new THREE.Color(params.colors.gradOuter) },
};

//创建10000个平面圆点网格并将其定位到球坐标
for (let i = 0; i < 10000; i++) {
  r = Math.sqrt(1 - z * z);
  p.set(Math.cos(long) * r, z, -Math.sin(long) * r).multiplyScalar(rad);
  z = z - dz;
  long = long + dlong;
  sph.setFromVector3(p);
  dummyObj.lookAt(p);
  dummyObj.updateMatrix();

  let g = new THREE.PlaneGeometry(1, 1);
  g.applyMatrix4(dummyObj.matrix); //用给定矩阵转换几何体的顶点坐标。
  g.translate(p.x, p.y, p.z);

  let centers = [p.x, p.y, p.z, p.x, p.y, p.z, p.x, p.y, p.z, p.x, p.y, p.z];
  let uv = new THREE.Vector2(
    (sph.theta + Math.PI) / (Math.PI * 2),
    1 - sph.phi / Math.PI,
  );
  let uvs = [uv.x, uv.y, uv.x, uv.y, uv.x, uv.y, uv.x, uv.y];
  g.setAttribute('center', new THREE.Float32BufferAttribute(centers, 3));
  g.setAttribute('baseUv', new THREE.Float32BufferAttribute(uvs, 2));
  geoms.push(g);
}

//将 多个网格合成成一个网格
let g = mergeBufferGeometries(geoms);
let m = new THREE.MeshBasicMaterial({
  color: new THREE.Color(params.colors.base),
  onBeforeCompile: (shader) => {
    shader.uniforms.impacts = uniforms.impacts;
    shader.uniforms.maxSize = uniforms.maxSize;
    shader.uniforms.minSize = uniforms.minSize;
    shader.uniforms.waveHeight = uniforms.waveHeight;
    shader.uniforms.scaling = uniforms.scaling;
    shader.uniforms.gradInner = uniforms.gradInner;
    shader.uniforms.gradOuter = uniforms.gradOuter;

    //将地球图片作为参数传递给shader
    shader.uniforms.tex = {
      value: new THREE.TextureLoader().load('./img/earth.jpg'),
    };
    // shader.vertexShader = vertexShader;
    // shader.fragmentShader = fragmentShader
  },
});

//创建球体
const earth = new THREE.Mesh(g, m);
earth.rotation.y = Math.PI;
earth.add(
  new THREE.Mesh(
    new THREE.SphereGeometry(4.9995, 72, 36),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0x000000) }),
  ),
);
earth.position.set(0, -0.4, 0);

export default earth;
