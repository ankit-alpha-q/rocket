import * as THREE from '../node_modules/three/build/three.module.js';

export default class Finish {
  constructor() {
    this.mesh = new THREE.Object3D();
    let pillar = new THREE.CylinderGeometry(0.5, 0.5, 10, 60);
    let material = new THREE.MeshPhongMaterial({
        color: 0xfea036,
      flatShading: true,
    });
    let pillar1 = new THREE.Mesh(pillar, material);
    pillar1.position.x = -10
    let pillar2 = new THREE.Mesh(pillar, material);
    pillar2.position.x = 10

    let flagGeo = new THREE.PlaneGeometry(19,0.2, 30,30);
    let flagMat = new THREE.MeshBasicMaterial({
        color: 0xd25138,
    })
    let flag = new THREE.Mesh(flagGeo,flagMat);
    flag.position.y = -2;

    this.mesh.add(pillar1, pillar2,flag);
  }
}
