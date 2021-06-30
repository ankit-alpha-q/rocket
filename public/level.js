import * as THREE from "../node_modules/three/build/three.module.js";
import Finish from "./finish.js";

export default class Level {
  constructor() {
    this.arrangeObstacle = () => {
      this.arr = [];
      this.arr1 = [];
      for (var i = 0; i < 1000; i++) {
        let pos = Math.floor(Math.random() * 10 + 1);
        let pos1 = Math.floor(Math.random() * 3 + 1) + 7;
        this.arr.push(pos);
        this.arr1.push(pos1);
        this.mesh.children[i].children[0].position.x = pos;
        this.mesh.children[i].children[1].position.x = pos - pos1;
      }
    };
    this.mesh = new THREE.Object3D();
    this.arr = [];
    this.arr1 = [];
    let box1Geo = new THREE.BoxGeometry(6, 10, 2);
    let box2Geo = new THREE.BoxGeometry(6, 10, 2);

    let box1Mat = new THREE.MeshPhongMaterial({
      color: 0xd25138,
      flatShading: true,
    });
    let box2Mat = new THREE.MeshPhongMaterial({
      color: 0xfea036,
      flatShading: true,
    });

    for (var i = 0; i < 1000; i++) {
      let pos = Math.floor(Math.random() * 10 + 1);
      this.arr.push(pos);
      let pos1 = Math.floor(Math.random() * 3 + 1) + 7;
      this.arr1.push(pos1);

      let box1 = new THREE.Mesh(box1Geo, box1Mat);
      box1.position.x = pos;
      box1.castShadow = true;
      box1.receiveShadow = true;
      let box2 = new THREE.Mesh(box2Geo, box2Mat);
      box2.position.x = pos - pos1;
      box2.castShadow = true;
      box2.receiveShadow = true;

      this.layer = new THREE.Object3D();
      this.layer.add(box1, box2);
      this.layer.position.z = i * -40;

      this.mesh.add(this.layer);
    }

    let finish = new Finish();
    finish.mesh.position.z = -40 * this.arr.length;
    this.mesh.add(finish.mesh);
  }
}
