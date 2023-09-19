import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";

//Scene
const scene = new THREE.Scene()

const planets = {}

const addPlanet = (name, color, radius, x, y, z, layer=0) => {
  //Create our sphere
  // const geometry = new THREE.SphereGeometry(radius, 64, 64)
  const geometry = new THREE.IcosahedronGeometry(radius, 15);
  let material = null
  material = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.5 })
  const mesh = new THREE.Mesh (geometry, material)
  mesh.position.set(x, y, z)
  planets[name] = mesh
  mesh.layers.set(layer)
  scene.add(mesh)
}

//Planets
addPlanet("sun","#FDB813", 4, 0, 0, 0, 1)
addPlanet("fakesun","#FDB813", 4, 0, 0, 0, 2)

addPlanet("green","#00ff83", 3, 20, 10, 10)
addPlanet("red","#880033", 2.5, 45, 20, 20)
addPlanet("blue","#220099", 5, 60, 40, 40)

// Lights
const pointLight = new THREE.PointLight(0xffffff, 10, 0, 0.1); 
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(pointLight, ambientLight);

const ambientLightSun = new THREE.AmbientLight(0xffffff, 1);
ambientLight.layers.set(1)
scene.add(ambientLightSun)

const ambientLightFakeSun = new THREE.AmbientLight(0xffffff, 100);
ambientLightFakeSun.layers.set(2)
scene.add(ambientLightFakeSun)


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

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight)
)
bloomPass.threshold = 0
bloomPass.strength = 5 //intensity of glow
bloomPass.radius = 1

const composer = new EffectComposer(renderer)
composer.setSize(window.innerWidth, window.innerHeight)
// bloomComposer.renderToScreen = true
composer.addPass(renderScene)
composer.addPass(bloomPass)


function render() {
  renderer.clear();
  
  camera.layers.set(1);
  composer.render();
  
  renderer.clearDepth();
  camera.layers.set(0);
  renderer.render(scene, camera);
  
  renderer.clearDepth();
  camera.layers.set(2);
  renderer.render(scene, camera);
  
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