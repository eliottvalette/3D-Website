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
camera.position.set(0, 5, 7);
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

const boxGeometry_screen = new THREE.BoxGeometry(1, 1, 1); // 1x1x1 cube
const boxMaterial_screen = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Green color
const box_screen = new THREE.Mesh(boxGeometry_screen, boxMaterial_screen);
box_screen.position.set(0, 2.5, 0);
scene.add(box_screen);

const boxGeometry_keyboard = new THREE.BoxGeometry(1, 1, 1); // 1x1x1 cube
const boxMaterial_keyboard = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Green color
const box_keyboard = new THREE.Mesh(boxGeometry_keyboard, boxMaterial_keyboard);
box_keyboard.position.set(0, 0.9, 3);
scene.add(box_keyboard);

const boxGeometry_side = new THREE.BoxGeometry(1, 1, 1); // 1x1x1 cube
const boxMaterial_side = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
const box_side = new THREE.Mesh(boxGeometry_side, boxMaterial_side);
box_side.position.set(-4, 0.9, 0);
scene.add(box_side);

// Create a smooth camera path using CatmullRomCurve3
const cameraPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 5, 7),   // In front of the screen (1)

  new THREE.Vector3(-8, 5, 7),  // Turning around the modem (6)
  new THREE.Vector3(-8, 5, -7),   
  new THREE.Vector3(-2, 5, -5),    
  new THREE.Vector3(-2, 5, 5),     
  new THREE.Vector3(-8, 5, 7),    
  new THREE.Vector3(-8, 5, -7),   

  new THREE.Vector3(7, 5, -7),  // Behind the screen (1)

  new THREE.Vector3(7, 5, 7),   // On the Right (1)

  new THREE.Vector3(0, 5, 7),   // In front of the screen (1)
], true); // The last true ensures the curve is closed

// Define a separate smooth path for camera's lookAt direction (target positions)
const objectPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 2.5, 0),   // Initially look at the center of the setup
  new THREE.Vector3(4, 0.9, 0),  // Look at the modem (side)
  new THREE.Vector3(4, 0.9, 3), // Look towards the back-left
  new THREE.Vector3(0, 2.5, 5),  // Look directly behind
  new THREE.Vector3(-4, 0.9, 3),  // Look towards the back-right
  new THREE.Vector3(-4, 0.9, 0),   // Look at the front-right side
  new THREE.Vector3(0, 2.5, 0)    // Back to the center
], true);

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

  // Move the loaded model (or other objects) along the object path
  if (loadedModel) {
    const objectPosition = objectPath.getPointAt(progress_bar);
    loadedModel.position.copy(objectPosition);
  }

  console.log('Progress:', progress_bar);
}

// Add scroll event listener to the canvas
const canvas = document.querySelector('#bg');
canvas.addEventListener('wheel', fill_bar);

// Helpers
let helper = true
if (helper) {
  const lightHelper = new THREE.PointLightHelper(pointLight);
  scene.add(lightHelper);

  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(5);  // 5 units long axes
  scene.add(axesHelper);

  const pathHelper = new THREE.TubeGeometry(cameraPath, 100, 0.05, 8, true);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
  const pathMesh = new THREE.Mesh(pathHelper, material);
  scene.add(pathMesh);
}

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