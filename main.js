import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { cameraPathSegment1, cameraPathSegment2, cameraPathSegment3, cameraPathSegment4 , cameraPath} from './cameraPaths.js';
import { lookAtSegment1, lookAtSegment2, lookAtSegment3, lookAtSegment4 , lookAtPath} from './lookAtPaths.js';
import { setupLighting } from './lighting.js';
import { setupHelpers } from './helpers.js'; // Import the helper setup function

// Setup scene
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight / 1.5), 0.1, 1000);
camera.position.set(0, 5, 7);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight / 1.5);

// Orbit controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.target.set(0, 2.5, 0);
controls.update(); // Update controls to reflect the new target

// Setup lighting
const { ambientLight, pointLight, directionalLight, spotLight } = setupLighting(scene);

// Load the GLTF model
const loader = new GLTFLoader();
let loadedModel;

loader.load(
  'blenders/commodore_low_res.glb',
  function (gltf) {
    loadedModel = gltf.scene;
    loadedModel.position.set(0, 0.1, 0);
    scene.add(loadedModel);
  },
  undefined,
  function (error) {
    console.error('An error happened', error);
  }
);

// Progress Bar and Scroll Event
let progress_bar = 0;
let isAnimating = false;
let isreverse = false

function toggleAnimation() {
  isAnimating = !isAnimating;
  animateButton.textContent = isAnimating ? 'Pause Animation' : 'Start Animation';
}
  

function updateCameraPosition() {
    let cameraPosition, lookAtTarget;
  
    if (progress_bar < 0.1) {
      const t = progress_bar / 0.1;
      cameraPosition = cameraPathSegment1.getPointAt(t);
      lookAtTarget = lookAtSegment1.getPointAt(t);
    } else if (progress_bar < 0.6) {
      const t = (progress_bar - 0.1) / 0.5;
      cameraPosition = cameraPathSegment2.getPointAt(t);
      lookAtTarget = lookAtSegment2.getPointAt(t);
    } else if (progress_bar < 0.8) {
      const t = (progress_bar - 0.6) / 0.2;
      cameraPosition = cameraPathSegment3.getPointAt(t);
      lookAtTarget = lookAtSegment3.getPointAt(t);
    } else {
      const t = (progress_bar - 0.8) / 0.2;
      cameraPosition = cameraPathSegment4.getPointAt(t);
      lookAtTarget = lookAtSegment4.getPointAt(t);
    }
  
    // Update camera and controls
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

  isAnimating = false;
  updateCameraPosition();
}

function handleCameraMovement() {
    if (!isAnimating) {
      return;
    }
    const increment = 0.002;
  
    if (!isreverse) {
      progress_bar = Math.min(progress_bar + increment, 1);
    } else {
      progress_bar = Math.max(progress_bar - increment, 0);
    }
  
    if (progress_bar === 1) {
      isreverse = true; 
      isAnimating = false
      animateButton.textContent = 'Reverse the Animation';
    } else if (progress_bar === 0) {
      isreverse = false; 
      isAnimating = false
      animateButton.textContent = 'Start the Animation';
    }
    updateCameraPosition();
  }
  

// Add scroll event listener to the canvas
const canvas = document.querySelector('#bg');
canvas.addEventListener('wheel', fill_bar);

// Helper variables (optional, based on your needs)
let helper = false;
if (helper) {
  setupHelpers(scene, pointLight, cameraPath, lookAtPath); // Move helper setup to external function
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  handleCameraMovement();
  controls.update();
  renderer.render(scene, camera);
}

// Attach event listener to the button
const animateButton = document.getElementById('animateButton');
animateButton.addEventListener('click', toggleAnimation);

animate();
