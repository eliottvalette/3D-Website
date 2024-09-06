import * as THREE from 'three';

export const setupHelpers = (scene, pointLight, cameraPath, lookAtPath) => {
  const lightHelper = new THREE.PointLightHelper(pointLight);
  scene.add(lightHelper);

  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(5); // 5 units long axes
  scene.add(axesHelper);

  const pathHelper = new THREE.TubeGeometry(cameraPath, 100, 0.05, 8, true);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
  const pathMesh = new THREE.Mesh(pathHelper, material);
  scene.add(pathMesh);

  const lookPathHelper = new THREE.TubeGeometry(lookAtPath, 100, 0.05, 8, true);
  const lookMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  const lookPathMesh = new THREE.Mesh(lookPathHelper, lookMaterial);
  scene.add(lookPathMesh);

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

  scene.add(box_screen);
  scene.add(box_side);
  scene.add(box_keyboard);
};
