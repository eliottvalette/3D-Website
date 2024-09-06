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

// Instantiate OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Initial camera position
camera.position.set(0, 5, 7);
controls.target.set(0, 2.5, 0);
controls.update();  // Update controls to reflect the new target

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
const boxMaterial_screen = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
const box_screen = new THREE.Mesh(boxGeometry_screen, boxMaterial_screen);
box_screen.position.set(0, 2.5, -0.5);

const boxGeometry_side = new THREE.BoxGeometry(1, 1, 1); // 1x1x1 cube
const boxMaterial_side = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
const box_side = new THREE.Mesh(boxGeometry_side, boxMaterial_side);
box_side.position.set(-4.5, 0.9, -1);

const boxGeometry_keyboard = new THREE.BoxGeometry(1, 1, 1); // 1x1x1 cube
const boxMaterial_keyboard = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue color
const box_keyboard = new THREE.Mesh(boxGeometry_keyboard, boxMaterial_keyboard);
box_keyboard.position.set(0, 0.9, 3);

// Segment 1: Focus on the screen
const cameraPathSegment1 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 5, 7),    // In front of the screen

  new THREE.Vector3(-8, 4, 7),   
], false);

// Segment 2: Turning around the modem
const cameraPathSegment2 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-8, 4, 7),  // Turning around the modem (6)
  new THREE.Vector3(-8, 4, -7),   
  new THREE.Vector3(-2.5, 6, -5),    
  new THREE.Vector3(-2.5, 6, 5),     
  new THREE.Vector3(-8, 4, 7),    
  new THREE.Vector3(-8, 3, -7),  

  new THREE.Vector3(7, 4, -7),
], false);

// Segment 3: turning around the screen
const cameraPathSegment3 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(7, 4, -7), 
  new THREE.Vector3(7, 5, 7),   
  new THREE.Vector3(0, 5, 7),   

  new THREE.Vector3(-3, 3, 3),
], false);

// Segment 4: Tracking the keyboard
const cameraPathSegment4 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-3, 3, 3),  
  new THREE.Vector3(3, 3, 3),   
  new THREE.Vector3(0, 5, 7),   
], false);


// Segment 1: Looking at the screen
const lookAtSegment1 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 2.5, 0),     // Screen (1)
  new THREE.Vector3(-4.5, 0.9, -1), 
], false);

// Segment 2: Looking at the modem
const lookAtSegment2 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-4.5, 0.9, -1), // Modem (6)
  new THREE.Vector3(-4.5, 0.9, -1),  
  new THREE.Vector3(-4.5, 0.9, -1),  
  new THREE.Vector3(-4.5, 0.9, -1),   
  new THREE.Vector3(-4.5, 0.9, -1),   
  new THREE.Vector3(-4.5, 0.9, -1), 

  new THREE.Vector3(0, 2.5, 0),    
], false);

// Segment 3: Back to the screen
const lookAtSegment3 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 2.5, 0),     

  new THREE.Vector3(0, 0.9, 3),    
], false);

// Segment 4: Looking at the keyboard
const lookAtSegment4 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0.9, 3),     
  new THREE.Vector3(0, 2.5, 0),  
], false)

// Progress Bar and Scroll Event
let progress_bar = 0;
let isAnimating = false;

function toggleAnimation() {
  isAnimating = !isAnimating;
}


function updateCameraPosition() {
  let cameraPosition, lookAtTarget;

  if (progress_bar < 0.25) {  // First segment (screen)
    const t = progress_bar / 0.25;  // Normalize progress to this segment's range
    cameraPosition = cameraPathSegment1.getPointAt(t);
    lookAtTarget = lookAtSegment1.getPointAt(t);
  } else if (progress_bar < 0.5) {  // Second segment (modem)
    const t = (progress_bar - 0.25) / 0.25;
    cameraPosition = cameraPathSegment2.getPointAt(t);
    lookAtTarget = lookAtSegment2.getPointAt(t);
  } else if (progress_bar < 0.75) {  // Third segment (turning around the screen)
    const t = (progress_bar - 0.5) / 0.25;
    cameraPosition = cameraPathSegment3.getPointAt(t);
    lookAtTarget = lookAtSegment3.getPointAt(t);
  } else {  // Fourth segment (keyboard)
    const t = (progress_bar - 0.75) / 0.25;
    cameraPosition = cameraPathSegment4.getPointAt(t);
    lookAtTarget = lookAtSegment4.getPointAt(t);
  }

  // Set the camera position and where it looks
  camera.position.copy(cameraPosition);
  controls.target.copy(lookAtTarget);
  controls.update();
}


function fill_bar(event) {
  const increment = 0.002;
  
  if (event.deltaY > 0) {
    progress_bar = Math.min(progress_bar + increment, 1);
  } else {
    progress_bar = Math.max(progress_bar - increment, 0);
  }

  isAnimating = false; // Stop animation on scroll
  updateCameraPosition();
}

function handleCameraMovement() {
  if (isAnimating) {
    const increment = 0.002;
    progress_bar = Math.min(progress_bar + increment, 1);
    
    if (progress_bar === 1) {
      isAnimating = false; // Stop animation when complete
    }

    updateCameraPosition();
  }
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

  // Helpers for each segment of cameraPath

  // Helper for cameraPathSegment1
  const pathHelperSegment1 = new THREE.TubeGeometry(cameraPathSegment1, 100, 0.05, 8, true);
  const materialSegment1 = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
  const pathMeshSegment1 = new THREE.Mesh(pathHelperSegment1, materialSegment1);
  scene.add(pathMeshSegment1);

  // Helper for cameraPathSegment2
  const pathHelperSegment2 = new THREE.TubeGeometry(cameraPathSegment2, 100, 0.05, 8, true);
  const materialSegment2 = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
  const pathMeshSegment2 = new THREE.Mesh(pathHelperSegment2, materialSegment2);
  scene.add(pathMeshSegment2);

  // Helper for cameraPathSegment3
  const pathHelperSegment3 = new THREE.TubeGeometry(cameraPathSegment3, 100, 0.05, 8, true);
  const materialSegment3 = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
  const pathMeshSegment3 = new THREE.Mesh(pathHelperSegment3, materialSegment3);
  scene.add(pathMeshSegment3);

  scene.add(box_screen);
  scene.add(box_side);
  scene.add(box_keyboard);
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Trigger camera movement based on animation or scroll
  handleCameraMovement();

  controls.update(); // Update controls for smooth interaction
  renderer.render(scene, camera);
}

// Attach event listener to the button
const animateButton = document.getElementById('animateButton');
animateButton.addEventListener('click', toggleAnimation);
animate();