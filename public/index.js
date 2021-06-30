import * as THREE from "../node_modules/three/build/three.module.js";
import Rocket from "./rocket.js";
import gsap from "../node_modules/gsap/index.js";
import Level from "./level.js";

let scene;
let camera;
let renderer;
const canvas = document.querySelector(".webgl");
var hasCrashed = false;
var startGame = false;
var stopSmoke = false;
var currentScore = 0;
const highScore = $(".word");
const message = $(".complete");
const restart = $(".back");
var completed = false;

restart.click(() => {
  message[0].style.top = "-100%";
  goBack();
});

//getScore
var score = window.localStorage.getItem("rocket_3d_score");
const box = $(".value");
box[0].innerHTML = score || 0;

//launch game
const launch = $(".launch");
const back = $(".backBtn");
const title = $(".title-box");

launch.click(() => {
  stopSmoke = true;
  highScore[0].innerHTML = "Score : ";
  box[0].innerHTML = 0;
  title[0].style.top = "-100%";
  gsap.to(galaxyMesh.rotation, {
    duration: 2,
    x: 0.8,
    ease: "power3.out",
  });
  gsap.to(level.mesh.position, {
    duration: 2,
    y: 0,
  });
  gsap.to(level.mesh.rotation, {
    duration: 1,
    x: 0,
    ease: "Power3.out",
  });
  gsap.to(rocket.mesh.scale, {
    duration: 1,
    x: 0.002,
    y: 0.002,
    z: 0.002,
    ease: "Power3.inOut",
  });
  gsap.to(rocket.mesh.position, {
    duration: 1,
    x: 0,
    y: -2,
    z: 0,
    ease: "Power3.inOut",
  });
  gsap.to(rocket.mesh.rotation, {
    duration: 2,
    x: -1.5,
    y: 1.5,
    ease: "Power3.out",
    onComplete: () => {
      startGame = true;
      stopSmoke = false;
    },
  });
});

const goBack = () => {
  stopSmoke = true;
  level.arrangeObstacle();
  highScore[0].innerHTML = "High Score : ";
  box[0].innerHTML = score || 0;
  back[0].style.left = "-50px";
  title[0].style.top = "0%";
  assembleParts();
  gsap.to(galaxyMesh.rotation, {
    duration: 2,
    x: 0,
    ease: "power3.out",
  });
  gsap.to(level.mesh.position, {
    duration: 2,
    y: -40,
    z: -40,
  });
  gsap.to(level.mesh.rotation, {
    duration: 2,
    x: -1.5,
    ease: "Power3.in",
  });
  gsap.to(rocket.mesh.scale, {
    duration: 1,
    x: 0.01,
    y: 0.01,
    z: 0.01,
    ease: "Power3.inOut",
  });
  gsap.to(camera.position, {
    duration: 1,
    x: 0,
    y: 0,
    z: 8,
    ease: "Power3.inOut",
  });
  gsap.to(rocket.mesh.position, {
    duration: 1,
    x: 2.5,
    y: 1.5,
    z: 0,
    ease: "Power3.inOut",
  });
  gsap.to(rocket.mesh.rotation, {
    duration: 1,
    x: 0,
    y: 0,
    z: 0,
    ease: "Power3.inOut",
    onComplete: () => {
      startGame = false;
      stopSmoke = false;
      hasCrashed = false;
      completed = false;
    },
  });
};

back.click(goBack);

// scene setup
scene = new THREE.Scene();

// camera setup
const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1001;
camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 8;
camera.position.x = 0;
scene.add(camera);

// renderer setup
renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
renderer.autoClear = false;
renderer.setClearColor(0x000000, 0.0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//window resize
window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

//ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientlight);

//point light
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 5, 10);
scene.add(pointLight);

//galaxy
const starGeo = new THREE.SphereGeometry(500, 64, 64);
const starMat = new THREE.MeshBasicMaterial({
  map: THREE.ImageUtils.loadTexture("./galaxy1.png"),
  side: THREE.BackSide,
  transparent: true,
});
const galaxyMesh = new THREE.Mesh(starGeo, starMat);
scene.add(galaxyMesh);

//rocket body
var rocket = new Rocket();
rocket.mesh.scale.set(0.01, 0.01, 0.01);
rocket.mesh.position.x = 2.5;
rocket.mesh.position.y = 1.5;
scene.add(rocket.mesh);

//Obstacle Layer
let level = new Level();
level.mesh.position.z = -40;
level.mesh.position.y = -40;
level.mesh.rotation.x = -1.5;
scene.add(level.mesh);

const assembleParts = () => {
  transitionArray.forEach((i) => {
    i.reverse();
  });
  transitionArray = [];
};

const control = {
  up: false,
  down: false,
  left: false,
  right: false,
};

window.addEventListener("keydown", (e) => {
  if (startGame) {
    //Reset game - r
    if (e.keyCode == 82 && hasCrashed) {
      level.arrangeObstacle();
      back[0].style.left = "-50px";
      assembleParts();
      gsap.to(rocket.mesh.position, {
        duration: 1,
        x: 0,
        y: -2,
        z: 0,
      });
      gsap.to(camera.position, {
        duration: 1,
        x: 0,
        y: 0,
        z: 8,
      });
      gsap.to(rocket.mesh.rotation, {
        duration: 1,
        x: -1.5,
        y: 1.5,
        z: 0,
      });
      gsap.to(level.mesh.position, {
        duration: 1,
        z: -40,
        onComplete: () => {
          hasCrashed = false;
        },
      });
    }
    if (e.keyCode == 37) {
      control.down = true;
      if (!hasCrashed) {
        gsap.to(rocket.mesh.rotation, {
          duration: 0.2,
          y: 1,
          z: 0.1,
          ease: "power3.out",
        });
      }
    }
    if (e.keyCode == 38) {
      control.right = true;
      if (!hasCrashed) {
        gsap.to(rocket.mesh.rotation, {
          duration: 0.2,
          x: -1.2,
          ease: "power3.out",
        });
      }
    }
    if (e.keyCode == 39) {
      control.up = true;
      if (!hasCrashed) {
        gsap.to(rocket.mesh.rotation, {
          duration: 0.2,
          y: 2,
          z: -0.1,
          ease: "power3.out",
        });
      }
    }
    if (e.keyCode == 40) {
      control.left = true;
      if (!hasCrashed) {
        gsap.to(rocket.mesh.rotation, {
          duration: 0.2,
          x: -1.8,
          ease: "power3.out",
        });
      }
    }
    if (e.keyCode == 13 || e.keyCode == 32) {
      e.preventDefault();
    }
  }
});

window.addEventListener("keyup", (e) => {
  if (startGame) {
    if (e.keyCode == 37) {
      control.down = false;
      if (!hasCrashed) {
        gsap.to(rocket.mesh.rotation, {
          duration: 0.2,
          y: 1.5,
          z: 0,
          ease: "power3.out",
        });
      }
    }
    if (e.keyCode == 38) {
      control.right = false;
      if (!hasCrashed) {
        gsap.to(rocket.mesh.rotation, {
          duration: 0.2,
          x: -1.5,
          ease: "power3.out",
        });
      }
    }
    if (e.keyCode == 39) {
      control.up = false;
      if (!hasCrashed) {
        gsap.to(rocket.mesh.rotation, {
          duration: 0.2,
          y: 1.5,
          z: 0,
          ease: "power3.out",
        });
      }
    }
    if (e.keyCode == 40) {
      control.left = false;
      if (!hasCrashed) {
        gsap.to(rocket.mesh.rotation, {
          duration: 0.2,
          x: -1.5,
          ease: "power3.out",
        });
      }
    }
  }
});

const createSmoke = () => {
  let p = getParticle();
  !stopSmoke && !hasCrashed && dropParticle(p);
};

const particleArray = [];

class Particle {
  constructor() {
    var scale = 20 + Math.random() * 20;
    var nLines = 5 + Math.floor(Math.random() * 5);
    var nRows = 5 + Math.floor(Math.random() * 5);
    this.geometry = new THREE.SphereGeometry(scale, nLines, nRows);
    this.material = new THREE.MeshLambertMaterial({
      color: 0xe3e3e3,
      shading: THREE.FlatShading,
      transparent: true,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
}

const getParticle = () => {
  let p;
  if (particleArray.length) {
    p = particleArray.pop();
  } else {
    p = new Particle();
  }
  return p;
};

const dropParticle = (p) => {
  scene.add(p.mesh);
  var s = Math.random(0.2) + 0.35;
  p.mesh.material.opacity = 1;
  if (startGame) {
    p.mesh.scale.set(s * 0.004, s * 0.004, s * 0.004);
    p.mesh.position.x = rocket.mesh.position.x;
    p.mesh.position.y = rocket.mesh.position.y - 0.1;
    p.mesh.position.z = rocket.mesh.position.z + 0.75;
  } else {
    p.mesh.scale.set(s * 0.015, s * 0.015, s * 0.015);
    p.mesh.position.x = 2.5;
    p.mesh.position.y = -2.2;
    p.mesh.position.z = 0;
  }
  gsap.to(p.mesh.scale, {
    duration: startGame ? 0.5 : 1,
    x: startGame ? s * 0.008 : s * 0.03,
    y: startGame ? s * 0.008 : s * 0.03,
    z: startGame ? s * 0.008 : s * 0.03,
    ease: "power3.inOut",
    onComplete: recycleParticle,
    onCompleteParams: [p],
  });
  gsap.to(
    p.mesh.position,
    startGame
      ? {
          duration: 0.5,
          z: 1,
          y: rocket.mesh.position.y - 0.5,
          ease: "none",
        }
      : {
          duration: 1,
          y: -5,
          ease: "none",
        }
  );
  gsap.to(p.mesh.material, {
    duration: startGame ? 0.5 : 1,
    opacity: 0,
    ease: "none",
  });
};

const recycleParticle = (p) => {
  p.mesh.rotation.x = Math.random() * Math.PI * 2;
  p.mesh.rotation.y = Math.random() * Math.PI * 2;
  p.mesh.rotation.z = Math.random() * Math.PI * 2;
  particleArray.push(p);
};

const updateRocketPosition = () => {
  if (!hasCrashed) {
    if (control.up) {
      rocket.mesh.position.x += 0.2;
      camera.position.x += 0.2;
    }
    if (control.down) {
      rocket.mesh.position.x -= 0.2;
      camera.position.x -= 0.2;
    }
    if (control.left) {
      rocket.mesh.position.y -= 0.2;
    }
    if (control.right) {
      rocket.mesh.position.y += 0.2;
    }
    if (rocket.mesh.position.y > window.innerHeight / 160) {
      rocket.mesh.position.y = window.innerHeight / 160;
    }
    if (rocket.mesh.position.y < -window.innerHeight / 160) {
      rocket.mesh.position.y = -window.innerHeight / 160;
    }
    if (rocket.mesh.position.x > window.innerWidth / 160) {
      rocket.mesh.position.x = window.innerWidth / 160;
      camera.position.x = window.innerWidth / 160;
    }
    if (rocket.mesh.position.x < -window.innerWidth / 160) {
      rocket.mesh.position.x = -window.innerWidth / 160;
      camera.position.x = -window.innerWidth / 160;
    }
  }
};

var transitionArray = [];
const checkCollision = () => {
  if (!hasCrashed) {
    for (var i = 0; i < level.arr.length; i++) {
      if (
        level.mesh.position.z >= i * 40 - 1 &&
        level.mesh.position.z <= i * 40 + 1
      ) {
        if (
          (rocket.mesh.position.x >= level.arr[i] - 3.25 &&
            rocket.mesh.position.x <= level.arr[i] + 2.75) ||
          (rocket.mesh.position.x >= level.arr[i] - (level.arr1[i] + 3.25) &&
            rocket.mesh.position.x <= level.arr[i] - (level.arr1[i] - 3.25))
        ) {
          hasCrashed = true;
          if (currentScore > score) {
            score = currentScore;
            window.localStorage.setItem("rocket_3d_score", currentScore);
          }
          back[0].style.left = "0px";
          rocket.roof.children.forEach((i) => {
            transitionArray.push(
              gsap.to(i.position, {
                duration: 1,
                x: i.position.x + Math.floor(Math.random() * 500 + 1),
                y: i.position.y - Math.floor(Math.random() * 500 + 1),
                z: i.position.z + Math.floor(Math.random() * 500 + 1),
              })
            );
          });
          rocket.body.children.forEach((i) => {
            transitionArray.push(
              gsap.to(i.position, {
                duration: 1,
                x: i.position.x - Math.floor(Math.random() * 500 + 1),
                y: i.position.y - Math.floor(Math.random() * 500 + 1),
                z: i.position.z - Math.floor(Math.random() * 500 + 1),
              })
            );
          });
          rocket.window.children.forEach((i) => {
            transitionArray.push(
              gsap.to(i.position, {
                duration: 1,
                x: i.position.x + Math.floor(Math.random() * 500 + 1),
                y: i.position.y - Math.floor(Math.random() * 500 + 1),
                z: i.position.z + Math.floor(Math.random() * 500 + 1),
              })
            );
          });
          rocket.base.children.forEach((i) => {
            transitionArray.push(
              gsap.to(i.position, {
                duration: 1,
                x: i.position.x - Math.floor(Math.random() * 500 + 1),
                y: i.position.y - Math.floor(Math.random() * 500 + 1),
                z: i.position.z - Math.floor(Math.random() * 500 + 1),
              })
            );
          });
        }
      }
    }
  }
};

const updateScore = () => {
  currentScore = Math.floor((level.mesh.position.z + 40) / 40);
  box[0].innerHTML = currentScore;
};

const animate = () => {
  if (level.mesh.position.z == level.arr.length * 40 && !completed) {
    message[0].style.top = "10%";
    completed = true;
    if (currentScore > score) {
      score = currentScore;
      window.localStorage.setItem("rocket_3d_score", currentScore);
    }
  }
  if (!startGame) {
    rocket.mesh.rotation.y += 0.01;
  } else {
    if (!hasCrashed && !completed) {
      level.mesh.position.z += 0.5 + currentScore / 1000;
    }
  }
  galaxyMesh.rotation.y += 0.0001;
  createSmoke();
  !stopSmoke && startGame && !completed && checkCollision();
  !stopSmoke && startGame && !completed && updateScore();
  updateRocketPosition();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();
