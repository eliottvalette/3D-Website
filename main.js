import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { cameraPathSegment1, cameraPathSegment2, cameraPathSegment3, cameraPathSegment4 } from './cameraPaths.js';
import { lookAtSegment1, lookAtSegment2, lookAtSegment3, lookAtSegment4 } from './lookAtPaths.js';
import { setupLighting } from './lighting.js';
import { setupHelpers } from './helpers.js';

// Setup scene
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 7);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Orbit controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = false;       
controls.enableRotate = false; 
controls.target.set(0, 2.5, 0);
controls.update();

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
let isIn3DSection = false;
let hasAnimationPlayed = false;
let scrollLock = false;

const threeContainer = document.querySelector('.three-container');
const animateButton = document.getElementById('animateButton');

// Observe when the 3D section comes into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !hasAnimationPlayed) {
      isIn3DSection = true;
      scrollLock = true; // Lock scrolling within the 3D section
    } else {
      isIn3DSection = false;
      scrollLock = false; // Unlock scrolling when leaving the section
    }
  });
}, {
  threshold: 0.9 // Trigger when 90% of the section is visible
});

observer.observe(threeContainer);

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

function fill_bar() {
  if (!isIn3DSection || hasAnimationPlayed) {
    return; // Do nothing if the user is not in the 3D section or the animation has completed
  }

  // Calculate scroll progress only within the 3D section
  const scrollTop = window.scrollY;

  const containerStart = threeContainer.offsetTop;
  const containerEnd = containerStart + threeContainer.offsetHeight;

  // Mark animation as played when progress reaches 1
  if (progress_bar >= 1) {
    hasAnimationPlayed = true;
    scrollLock = false; // Allow the user to continue scrolling normally after animation
  }
}

// Handle scrolling within the 3D section to control animation
window.addEventListener('wheel', function (e) {
  if (scrollLock) {
    e.preventDefault();

    // Adjust scroll sensitivity based on scroll speed (deltaY)
    const scrollSpeed = Math.abs(e.deltaY);
    const scrollStep = (scrollSpeed / 1000) * 0.1;  // Adjust this to tune sensitivity

    // Update the progress_bar to reverse animation on scroll up or progress forward on scroll down
    if (e.deltaY > 0 && progress_bar < 1) {
      progress_bar = Math.min(1, progress_bar + scrollStep);  // Scroll forward
    } else if (e.deltaY < 0 && progress_bar > 0) {
      progress_bar = Math.max(0, progress_bar - scrollStep);  // Scroll reverse
    }

    updateCameraPosition();

    // Allow normal scrolling if the animation reaches either end (0 or 1)
    if (progress_bar === 1 || progress_bar === 0) {
      scrollLock = false;  // Unlock scrolling beyond the 3D section when animation completes
    }
  }
}, { passive: false });

document.addEventListener('scroll', fill_bar);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  if (!isIn3DSection && hasAnimationPlayed){
    hasAnimationPlayed = false;
  }
  console.log('hasAnimationPlayed', hasAnimationPlayed)
  console.log('progress_bar', progress_bar)
}

// Attach event listener to the button
animateButton.addEventListener('click', function () {
  animateButton.textContent = isAnimating ? 'Pause Animation' : 'Start Animation';
});


animate();
