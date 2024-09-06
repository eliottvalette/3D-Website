import * as THREE from 'three';

export const lookAtSegment1 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 2.5, 0),
  new THREE.Vector3(-4.5, 0.9, -1),
], false);

export const lookAtSegment2 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-4.5, 0.9, -1),
  new THREE.Vector3(-4.5, 0.9, -1),
  new THREE.Vector3(-4.5, 0.9, -1),
  new THREE.Vector3(-4.5, 0.9, -1),
  new THREE.Vector3(-4.5, 0.9, -1),
  new THREE.Vector3(-4.5, 0.9, -1),
  new THREE.Vector3(0, 2.5, 0),
], false);

export const lookAtSegment3 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 2.5, 0),
  new THREE.Vector3(-3, 0.9, 3),
], false);

export const lookAtSegment4 = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-3, 0.9, 3),
  new THREE.Vector3(3, 0.9, 3),
  new THREE.Vector3(0, 2.5, 0),
], false);

export const lookAtPath = new THREE.CatmullRomCurve3([
  ...lookAtSegment1.getPoints(100),
  ...lookAtSegment2.getPoints(100),
  ...lookAtSegment3.getPoints(100),
  ...lookAtSegment4.getPoints(100),
], false);
