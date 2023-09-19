import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { SelectiveBloomEffect, EffectComposer, EffectPass, RenderPass, BlendFunction, FXAAEffect } from "postprocessing";
// import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
// import { EffectComposer as EffectComposer2 } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";

//Scene
const scene = new THREE.Scene()

const planets = {}
const bloomObjs = []

const addPlanet = (name, color, radius, x, y, z) => {
  //Create our sphere
  // const geometry = new THREE.SphereGeometry(radius, 64, 64)
  const geometry = new THREE.IcosahedronGeometry(radius, 15);
  let material = null
  material = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.5 })
  const mesh = new THREE.Mesh (geometry, material)
  mesh.position.set(x, y, z)
  planets[name] = mesh
  scene.add(mesh)
  return mesh
}

//Planets
const sun = addPlanet("sun","#ffff00", 4, 0, 0, 0)
bloomObjs.push(sun)

// const fakesun = addPlanet("sun","#FDB813", 4, 0, 0, 0, true)
// fakesun.layers.set(2)

addPlanet("green","#00ff83", 3, 20, 10, 10)
addPlanet("red","#880033", 2.5, 45, 20, 20)
addPlanet("blue","#220099", 5, 60, 40, 40)

// Lights
const pointLight = new THREE.PointLight(0xffffff, 10, 0, 0.1); 
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(pointLight, ambientLight);

const ambientLightSun = new THREE.AmbientLight(0xffffff, 10);
scene.add(ambientLightSun)

// const ambientFakeLightSun = new THREE.AmbientLight(0xffffff, 10);
// bloomObjs.push(ambientFakeLightSun)
// scene.add(ambientFakeLightSun)


//Camera
const camera = new THREE.PerspectiveCamera (45, 800 / 600)
camera.position.z = 100
// camera.layers.enable(1);
// camera.layers.enable(2);

//Renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(1200, 900)
renderer.autoClear = false;
// renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.setPixelRatio(window.devicePixelRatio)
// camera.aspect = width / height
// camera.updateProjectionMatrix()

//bloom renderer
const renderScene = new RenderPass(scene, camera)

const selectiveBloom = new SelectiveBloomEffect(scene, camera, {
  blendFunction: BlendFunction.AVERAGE,
  intensity:10,
  // luminanceThreshold: 0.0001,
  // luminanceSmoothing: 0.1,
  // mipmapBlur: true,
  // radius: 0.4,
  // levels: 5,
})
selectiveBloom.selection = bloomObjs
const bloomPass = new EffectPass(camera, selectiveBloom )

// const fxaaPass = new EffectPass(camera, new FXAAEffect())

const composer = new EffectComposer(renderer)
composer.addPass(renderScene)
composer.addPass(bloomPass)
// composer.addPass(fxaaPass)

// const unrealBloomPass = new UnrealBloomPass(
//   new THREE.Vector2(window.innerWidth, window.innerHeight),1,1,1
// )
// unrealBloomPass.threshold = 0
// unrealBloomPass.strength = 1 //intensity of glow
// unrealBloomPass.radius = 1
// const unrealComposer = new EffectComposer2(renderer)
// unrealComposer.setSize(window.innerWidth, window.innerHeight)
// // unrealComposer.renderToScreen = true
// unrealComposer.addPass(renderScene)
// unrealComposer.addPass(unrealBloomPass)


function render() {
  renderer.clear();
  // unrealComposer.render()
  
  // camera.layers.set(0);
  composer.render();
  
  // renderer.clearDepth();
  // camera.layers.set(0);
  // renderer.render(scene, camera);
  
  // requestAnimationFrame(render);
}


// controls
const controls = new OrbitControls( camera, renderer.domElement )
controls.listenToKeyEvents( window ) // optional
controls.addEventListener( 'change', render ) // call this only in static scenes (i.e., if there is no animation loop)
controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05
controls.screenSpacePanning = false
controls.minDistance = 10
controls.maxDistance = 5000
controls.maxPolarAngle = Math.PI

render()