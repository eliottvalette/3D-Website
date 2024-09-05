import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // Import GLTFLoader

// Setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, (window.innerWidth * 0.4) / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth * 0.4, window.innerHeight);
camera.position.setZ(50);
camera.position.setX(-3);

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
  'blenders/viking_hut.glb',
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
    loadedModel.rotation.y += 0.00;
  }

  controls.update(); // Update controls for smooth interaction
  renderer.render(scene, camera);
}

animate();

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.01 + 30; // Adjust z position based on scroll
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();
