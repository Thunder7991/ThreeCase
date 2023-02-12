import * as THREE from 'three'
import scene from './scene'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'
import createCitys from './mesh/city'
function createMesh () {
  createCitys()
}
export default createMesh
