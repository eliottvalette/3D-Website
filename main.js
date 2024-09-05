import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // Import GLTFLoader


// Setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, (window.innerWidth * 0.6) / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth * 0.6, window.innerHeight);
camera.position.setZ(50);
camera.position.setX(-3);

renderer.render(scene, camera);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.set(15, 0, 0);
scene.add(pointLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

// Create Engineering Figures

// 1. Dodecahedron (existing object)
const dodecahedronGeometry = new THREE.DodecahedronGeometry(6);
const dodecahedronMaterial = new THREE.MeshStandardMaterial({ color: 0x44aa88, flatShading: true });
const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
dodecahedron.position.set(0, 0, 0);
scene.add(dodecahedron);

// 2. Torus (donut shape, often used to represent rotating objects)
const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347, wireframe: false });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 0, 0);
scene.add(torus);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the objects
  dodecahedron.rotation.x += 0.01;
  dodecahedron.rotation.y += 0.01;

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;

  controls.update();
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
