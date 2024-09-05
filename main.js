import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // Import GLTFLoader

// Setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, (window.innerWidth) / (window.innerHeight / 1.5), 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight / 1.5);

// Initial camera position
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);  // Look at the origin

// Instantiate OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(-8, 5, 0);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 10, 10); // Position the spotlight directly above the model
spotLight.castShadow = true;
scene.add(spotLight);


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
  'blenders/commodore_low_res.glb',
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


// Create a smooth camera path using CatmullRomCurve3
const cameraPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(5, 5, 5),     // Start position
  new THREE.Vector3(-5, 5, 5),    // First checkpoint
  new THREE.Vector3(-5, 5, -5),   // Second checkpoint
  new THREE.Vector3(5, 5, -5),    // Third checkpoint
  new THREE.Vector3(5, 5, 5),     // Back to start
], true); // The last true ensures the curve is closed

// Progress Bar and Scroll Event
let progress_bar = 0;

function fill_bar(event) {
  // Adjust progress bar based on scroll direction
  if (event.deltaY > 0) {
    progress_bar = Math.min(progress_bar + 0.009, 1);
  } else {
    progress_bar = Math.max(progress_bar - 0.009, 0);
  }

  // Get camera position from the path curve based on progress_bar
  const cameraPosition = cameraPath.getPointAt(progress_bar);
  camera.position.copy(cameraPosition);

  // Ensure the camera is always looking at the PC
  camera.lookAt(0, 0, 0);

  console.log('Progress:', progress_bar);
}

// Add scroll event listener to the canvas
const canvas = document.querySelector('#bg');
canvas.addEventListener('wheel', fill_bar);

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

animate();