import * as THREE from "../node_modules/three/build/three.module.js";

let Colors = {
  white: 0xffffff,
  black: 0x000000,
  red1: 0xd25138,
  red2: 0xc2533b,
  red3: 0xbf5139,
  grey: 0xd9d1b9,
  darkGrey: 0x4d4b54,
  windowBlue: 0xaabbe3,
  windowDarkBlue: 0x4a6e8a,
  thrusterOrange: 0xfea036,
};

export default class Rocket {
  constructor() {
    this.mesh = new THREE.Object3D();

    // custom shapes
    let geoFinShape = new THREE.Shape();
    let x = 0,
      y = 0;

    geoFinShape.moveTo(x, y);
    geoFinShape.lineTo(x, y + 50);
    geoFinShape.lineTo(x + 35, y + 10);
    geoFinShape.lineTo(x + 35, y - 10);
    geoFinShape.lineTo(x, y);

    let finExtrudeSettings = {
      amount: 8,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1,
    };

    let geoWindowShape = new THREE.Shape();
    geoWindowShape.moveTo(x - 18, y + 45);
    geoWindowShape.lineTo(x + 18, y + 45);
    geoWindowShape.lineTo(x + 18, y - 45);
    geoWindowShape.lineTo(x - 18, y - 45);
    geoWindowShape.lineTo(x - 18, y + 45);

    // geometry
    let geoCone = new THREE.ConeGeometry(50, 70, 8);
    let geoUpper = new THREE.CylinderGeometry(50, 75, 80, 8);
    let geoMiddle = new THREE.CylinderGeometry(75, 85, 80, 8);
    let geoColumn = new THREE.CylinderGeometry(85, 85, 200, 8);
    let geoWindowFrameOuter = new THREE.CylinderGeometry(55, 55, 40, 8);
    let geoWindowFrameInner = new THREE.CylinderGeometry(40, 40, 40, 16);
    let geoWindow = new THREE.CylinderGeometry(50, 50, 40, 8);
    let geoWindowReflection = new THREE.ShapeGeometry(geoWindowShape);
    let geoFin = new THREE.ExtrudeGeometry(geoFinShape, finExtrudeSettings);
    let geoThruster = new THREE.CylinderGeometry(55, 55, 40, 8);
    let geoConnector = new THREE.CylinderGeometry(55, 35, 10, 8);

    // materials
    let matRoof1 = new THREE.MeshPhongMaterial({
      color: Colors.red1,
      flatShading: true,
    });
    let matRoof2 = new THREE.MeshPhongMaterial({
      color: Colors.red2,
      flatShading: true,
    });
    let matRoof3 = new THREE.MeshPhongMaterial({
      color: Colors.red3,
      flatShading: true,
    });
    let matBody = new THREE.MeshPhongMaterial({
      color: Colors.grey,
      flatShading: true,
    });
    let matWindowFrame = new THREE.MeshPhongMaterial({
      color: Colors.darkGrey,
      side: THREE.DoubleSide,
      flatShading: true,
    });
    let matWindow = new THREE.MeshPhongMaterial({
      color: Colors.windowDarkBlue,
    });
    let matWindowReflection = new THREE.MeshPhongMaterial({
      color: Colors.windowBlue,
    });
    let matThruster = new THREE.MeshPhongMaterial({
      color: Colors.thrusterOrange,
      flatShading: true,
    });

    let m = new THREE.Mesh(geoCone, matRoof1);
    m.position.y = 70;
    m.castShadow = true;
    m.receiveShadow = true;

    let m2 = new THREE.Mesh(geoUpper, matRoof2);
    m2.castShadow = true;
    m2.receiveShadow = true;

    let m3 = new THREE.Mesh(geoMiddle, matRoof3);
    m3.position.y = -70;
    m3.castShadow = true;
    m3.receiveShadow = true;

    this.roof = new THREE.Object3D();
    this.roof.add(m, m2, m3);

    let mColumn = new THREE.Mesh(geoColumn, matBody);
    mColumn.position.y = -210;
    mColumn.position.x = 0;
    mColumn.position.z = 0;
    mColumn.castShadow = true;
    mColumn.receiveShadow = true;

    let zPlacement = 85;
    let yPlacement = -310;
    let xPlacement = 8;
    let yRotation = 1.6;
    let scale = 1.8;
    let finWidth = 15;
    let mFinLeft = new THREE.Mesh(geoFin, matRoof3);
    mFinLeft.position.y = yPlacement;
    mFinLeft.position.z = -zPlacement;
    mFinLeft.rotation.y = yRotation - 0.08;
    mFinLeft.scale.set(scale, scale, scale);
    mFinLeft.castShadow = true;
    mFinLeft.receiveShadow = true;
    let mFinRight = new THREE.Mesh(geoFin, matRoof3);
    mFinRight.position.y = yPlacement;
    mFinRight.position.z = zPlacement;
    mFinRight.rotation.y = -yRotation;
    mFinRight.scale.set(scale, scale, scale);
    mFinRight.castShadow = true;
    mFinRight.receiveShadow = true;

    let mfins = new THREE.Object3D();
    mfins.rotation.y += 0.05;
    mfins.add(mFinLeft, mFinRight);
    this.body = new THREE.Object3D();
    this.body.add(mColumn, mfins);

    let innerMesh = new THREE.Mesh(geoWindowFrameInner);
    innerMesh.rotation.y = 0.2;

    let m6 = new THREE.Mesh(geoWindow, matWindow);
    m6.position.y = -200;
    m6.position.x = -67;
    m6.rotation.z = 1.59;
    m6.castShadow = true;
    m6.receiveShadow = true;

    let mWindowReflection = new THREE.Mesh(
      geoWindowReflection,
      matWindowReflection
    );
    mWindowReflection.position.x = -90;
    mWindowReflection.position.y = -200;
    mWindowReflection.rotation.y = -1.5;
    mWindowReflection.rotation.x = 0.82;
    mWindowReflection.receiveShadow = true;

    this.window = new THREE.Object3D();
    this.window.add(m6, mWindowReflection);

    let mThruster = new THREE.Mesh(geoThruster, matWindowFrame);
    mThruster.position.y = -305;
    mThruster.receiveShadow = true;
    mThruster.castShadow = true;

    let mConnector = new THREE.Mesh(geoConnector, matThruster);
    mConnector.position.y = -330;
    mConnector.receiveShadow = true;
    mConnector.castShadow = true;

    let mBurner = new THREE.Mesh(geoThruster, matWindowFrame);
    mBurner.position.y = -340;
    mBurner.scale.set(0.7, 0.55, 0.7);
    mBurner.receiveShadow = true;
    mBurner.castShadow = true;

    this.base = new THREE.Object3D();
    this.base.add(mThruster, mConnector, mBurner);

    this.mesh.add(this.roof);
    this.mesh.add(this.body);
    this.mesh.add(this.window);
    this.mesh.add(this.base);
  }
}
