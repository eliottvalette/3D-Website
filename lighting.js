import * as THREE from 'three';

export const setupLighting = (scene) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 2);
  pointLight.position.set(-8, 5, 0);
  scene.add(pointLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  const spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0, 10, 10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  return { ambientLight, pointLight, directionalLight, spotLight };
};
