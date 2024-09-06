import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { cameraPathSegment1, cameraPathSegment2, cameraPathSegment3, cameraPathSegment4 } from './cameraPaths.js';
import { lookAtSegment1, lookAtSegment2, lookAtSegment3, lookAtSegment4 } from './lookAtPaths.js';
import { setupLighting } from './lighting.js';

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

// Box geometries for testing
const boxGeometry_screen = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial_screen = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const box_screen = new THREE.Mesh(boxGeometry_screen, boxMaterial_screen);
box_screen.position.set(0, 2.5, -0.5);

const boxGeometry_side = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial_side = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const box_side = new THREE.Mesh(boxGeometry_side, boxMaterial_side);
box_side.position.set(-4.5, 0.9, -1);

const boxGeometry_keyboard = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial_keyboard = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const box_keyboard = new THREE.Mesh(boxGeometry_keyboard, boxMaterial_keyboard);
box_keyboard.position.set(0, 0.9, 3);

// Camera movement segments and lookAt segments (imported)
const cameraPath = new THREE.CatmullRomCurve3([
  ...cameraPathSegment1.getPoints(100),
  ...cameraPathSegment2.getPoints(100),
  ...cameraPathSegment3.getPoints(100),
  ...cameraPathSegment4.getPoints(100),
], false);

const lookAtPath = new THREE.CatmullRomCurve3([
  ...lookAtSegment1.getPoints(100),
  ...lookAtSegment2.getPoints(100),
  ...lookAtSegment3.getPoints(100),
  ...lookAtSegment4.getPoints(100),
], false);

// Progress Bar and Scroll Event
let progress_bar = 0;
let isAnimating = false;

function toggleAnimation() {
  isAnimating = !isAnimating;
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
  if (isAnimating) {
    const increment = 0.002;
    progress_bar = Math.min(progress_bar + increment, 1);

    if (progress_bar === 1) {
      isAnimating = false;
    }

    updateCameraPosition();
  }
}

// Add scroll event listener to the canvas
const canvas = document.querySelector('#bg');
canvas.addEventListener('wheel', fill_bar);

// Helper variables (optional, based on your needs)
let helper = false;
if (helper) {
  const lightHelper = new THREE.PointLightHelper(pointLight);
  scene.add(lightHelper);

  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  const pathHelper = new THREE.TubeGeometry(cameraPath, 100, 0.05, 8, true);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
  const pathMesh = new THREE.Mesh(pathHelper, material);
  scene.add(pathMesh);

  const lookPathHelper = new THREE.TubeGeometry(lookAtPath, 100, 0.05, 8, true);
  const lookMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  const lookPathMesh = new THREE.Mesh(lookPathHelper, lookMaterial);
  scene.add(lookPathMesh);

  scene.add(box_screen);
  scene.add(box_side);
  scene.add(box_keyboard);
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
