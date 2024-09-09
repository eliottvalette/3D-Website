import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer, Clock } from 'three';

let scene, camera, renderer, mixer, clock;
let cameraAnimation;

init();
animate();

function init() {
  // Set up basic scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Adjust intensity as needed
  scene.add(ambientLight);

  clock = new Clock();

  // Load the GLTF model (including camera animation)
  const loader = new GLTFLoader();
  loader.load('blenders/desk1_baked.glb', function(gltf) {
    console.log('model loaded');
    console.log(gltf);  // Log the entire glTF structure to inspect

    scene.add(gltf.scene);  // Add the loaded scene

    // Log the cameras and animations
    console.log('Cameras:', gltf.cameras);
    console.log('Animations:', gltf.animations);

    // Check if the model has animations
    if (gltf.animations.length > 0) {
        cameraAnimation = gltf.animations[0];  // Assuming the first animation is the camera animation
        console.log('camera animation imported');
    } else {
        console.log('No animations found');
    }

    // Check if the model has a camera
    if (gltf.cameras && gltf.cameras.length > 0) {
        const importedCamera = gltf.cameras[0];
        camera = importedCamera;
        console.log('camera imported');
    } else {
        console.log('No cameras found');
    }

    // Initialize AnimationMixer for the camera
    mixer = new AnimationMixer(gltf.scene);

    // Show the animation button if animation exists
    if (cameraAnimation) {
      const animateButton = document.getElementById('animateButton');
      animateButton.style.display = 'block';

      // Trigger the animation when the button is clicked
      animateButton.addEventListener('click', function() {
          console.log(camera); // Make sure the camera is the one imported from Blender
          if (cameraAnimation) {
            const action = mixer.clipAction(cameraAnimation);
            action.reset();
            action.play();
            console.log('Camera animation started'); // For debugging
          } else {
            console.log('No camera animation available');
          }
      });
    }
  });

  console.log(camera.position);
}

function animate() {
    requestAnimationFrame(animate);
  
    const delta = clock.getDelta();  // Time between frames
  
    // Update the animation mixer if it exists
    if (mixer) {
      mixer.update(delta);  // Updates the camera animation over time
    }
  
    // Render the scene with the animated camera
    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
