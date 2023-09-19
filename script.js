import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { BloomEffect, SelectiveBloomEffect, EffectComposer, EffectPass, RenderPass, BlendFunction, FXAAEffect } from "postprocessing";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
// import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

//Scene
const scene = new THREE.Scene()

const planets = {}
const bloomObjs = []

const addPlanet = (name, color, radius, x, y, z, bloomColor = "", bloomLevel = 0.25) => {
  //Create our sphere
  // const geometry = new THREE.SphereGeometry(radius, 64, 64)
  const geometry = new THREE.IcosahedronGeometry(radius, 15);
  let material = null
  if (bloomColor !== "") {
    material = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.5, emissive: bloomColor, emissiveIntensity:bloomLevel, toneMapped:false})
  } else {
    const moonTexture = new THREE.TextureLoader().load('moon.jpg');
    const normalTexture = new THREE.TextureLoader().load('normal.jpg');
    material = new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.5, map: moonTexture, normalMap: normalTexture})
  }

  // material = new THREE.MeshStandardMaterial({ color: "red" })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, z)
  planets[name] = mesh
  scene.add(mesh)
  return mesh
}

//Planets
const sun = addPlanet("sun","#ffffff", 4, 0, 0, 0, "orange", 2.5)
// sun.layers.set(1)
bloomObjs.push(sun)

// const fakesun = addPlanet("sun","#FDB813", 4, 0, 0, 0, true)
// fakesun.layers.set(2)

addPlanet("green","#00ff83", 4, 30, 10, 10)
addPlanet("red","#880033", 2.5, -45, 20, -20)
addPlanet("x3","#236543", 0.5, 45, 20, 25)
addPlanet("x4","#32563", 0.5, 46, 19, 24)
addPlanet("blue","#220099", 5, 60, -40, 40)
addPlanet("x","#423942", 1.5, 60, 45, -45)
addPlanet("x2","#00ee33", 3, -50, 30, 40)
addPlanet("x5","#880033", 10, -80, 30, 80)

for (let i = 0; i < 300; i++){
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread ( 1000 ) );
  // console.log(x, y, z)
  const r = THREE.MathUtils.randFloatSpread ( 3 )
  addPlanet("i" + i,"#ffffff", r, x, y, z, "white")
}


// Lights
const pointLight = new THREE.PointLight(0xffffff, 10, 0, 0.1); 
scene.add(pointLight);
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

const ambientLightSun = new THREE.AmbientLight(0xffffff, 1);
// ambientLightSun.layers.set(1)
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
// renderer.setSize(1200, 900)
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()

//bloom renderer
const renderScene = new RenderPass(scene, camera)

// const selectiveBloom = new SelectiveBloomEffect(scene, camera, {
//   blendFunction: BlendFunction.AVERAGE,
//   intensity:10,
//   luminanceThreshold: 0.0001,
//   luminanceSmoothing: 0.1,
//   mipmapBlur: true,
//   radius: 0.4,
//   levels: 5,
// })
// selectiveBloom.selection = bloomObjs
// console.log(bloomObjs)
// const selBloomPass = new EffectPass(camera, selectiveBloom )

// const fxaaPass = new EffectPass(camera, new FXAAEffect())

// const composer = new EffectComposer(renderer)
// composer.addPass(renderScene)
// composer.addPass(selBloomPass)
// composer.addPass(bloomPass)
// composer.addPass(fxaaPass)

const unrealBloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),1.5,1,1
)

// const bloomComposer = new EffectComposer( renderer );
// bloomComposer.renderToScreen = false;
// bloomComposer.addPass( renderScene );
// bloomComposer.addPass( unrealBloomPass );

// const mixPass = new ShaderPass(
//   new THREE.ShaderMaterial( {
//     uniforms: {
//       baseTexture: { value: null },
//       bloomTexture: { value: bloomComposer.renderTarget2.texture }
//     },
//     // vertexShader: document.getElementById( 'vertexshader' ).textContent,
//     // fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
//     defines: {}
//   } ), 'baseTexture'
// );
// mixPass.needsSwap = true;

// const outputPass = new OutputPass();

const unrealComposer = new EffectComposer(renderer)
unrealComposer.setSize(window.innerWidth, window.innerHeight)
// unrealComposer.renderToScreen = true
unrealComposer.addPass(renderScene)
unrealComposer.addPass(unrealBloomPass)
// unrealComposer.addPass(mixPass)
// unrealComposer.addPass(outputPass)


function render() {
  renderer.clear();
  unrealComposer.render()
  
  // camera.layers.set(0);
  // composer.render();
  
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
setTimeout(render, 100)