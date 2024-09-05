import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // Import GLTFLoader

// Setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, (window.innerWidth) / (window.innerHeight / 2), 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight / 2);

// Initial camera position
camera.position.set(0, 5, 5);
camera.lookAt(0, 0, 0);  // Look at the origin

// Instantiate OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.set(-8, 5, 0);
scene.add(pointLight);

let helper = false
if (helper) {
  const lightHelper = new THREE.PointLightHelper(pointLight);
  scene.add(lightHelper);

  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(gridHelper);
}

// GLTFLoader for loading Blender assets
const loader = new GLTFLoader();
let loadedModel

loader.load(
  'blenders/commodore_64__computer_full_pack.glb',
  function (gltf) {
    loadedModel = gltf.scene;  // Assign loaded model to the variable
    loadedModel.position.set(0,0.1,0)
    scene.add(loadedModel);    // Add model to the scene
  },
  undefined,
  function (error) {
    console.error('An error happened', error);
  }
);

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the loaded model if it exists
  if (loadedModel) {
    loadedModel.rotation.y += 0.0001;
  }

  controls.update(); // Update controls for smooth interaction
  renderer.render(scene, camera);
}

let t = document.body.getBoundingClientRect().top;
let previous_t = t;

function moveCamera() {
  t = document.body.getBoundingClientRect().top;
  const delta = t - previous_t;

  camera.position.z += delta * -0.01; 
  camera.position.x += delta * -0.0005;

  camera.lookAt(0, 0, 0);

  previous_t = t;
}
animate();

document.body.onscroll = moveCamera;
moveCamera();