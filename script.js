import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//Scene
const scene = new THREE.Scene()

const planets = {}

const addPlanet = (name, color, radius, x, y, z) => {
  //Create our sphere
  const geometry = new THREE.SphereGeometry(radius, 64, 64)
  const material = new THREE.MeshStandardMaterial({ color })
  const mesh = new THREE.Mesh (geometry, material)
  mesh.position.set(x, y, z)
  planets[name] = mesh
  scene.add(mesh)
}

addPlanet("green","#00ff83", 3, 0, 0, 0)
addPlanet("red","#880033", 3, 10, 0, 0)
addPlanet("blue","#220099", 3, 20, 0, 0)


//Light
const light = new THREE.PointLight(0xffffff, 100, 100) 
light.position.set(0, 10, 10) 
scene.add(light)
//Camera
const camera = new THREE.PerspectiveCamera (45, 800 / 600)
camera.position.z = 50
scene.add(camera)
//Renderer
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(800, 600)
renderer.render(scene, camera)

// controls

function render() {
  renderer.render( scene, camera );
}

const controls = new OrbitControls( camera, renderer.domElement );
controls.listenToKeyEvents( window ); // optional

controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 10;
controls.maxDistance = 500;

controls.maxPolarAngle = Math.PI / 2;