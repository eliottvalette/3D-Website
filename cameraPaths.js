import * as THREE from 'three';

export const cameraPathSegment1 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 5, 7),
  new THREE.Vector3(-8, 4, 7),
], false);

export const cameraPathSegment2 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-8, 4, 7),
  new THREE.Vector3(-8, 4, -7),
  new THREE.Vector3(-2.5, 6, -5),
  new THREE.Vector3(-2.5, 6, 5),
  new THREE.Vector3(-8, 4, 7),
  new THREE.Vector3(-8, 3, -7),
  new THREE.Vector3(7, 4, -7),
], false);

export const cameraPathSegment3 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(7, 4, -7),
  new THREE.Vector3(7, 5, 7),
  new THREE.Vector3(0, 5, 7),
  new THREE.Vector3(-3, 3, 4),
], false);

export const cameraPathSegment4 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-3, 3, 4),
  new THREE.Vector3(3, 3, 4),
  new THREE.Vector3(3, 3, 4),
  new THREE.Vector3(0, 5, 7),
], false);

export const cameraPath = new THREE.CatmullRomCurve3([
  ...cameraPathSegment1.getPoints(100),
  ...cameraPathSegment2.getPoints(100),
  ...cameraPathSegment3.getPoints(100),
  ...cameraPathSegment4.getPoints(100),
], false);
