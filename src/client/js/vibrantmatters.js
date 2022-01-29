import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

var container, controls, camera, scene, renderer;

var target = new THREE.Vector3(0, 0, 0);

var mouseX = 0,
  mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var object;

var ratio;

var material;

var isMoblie = false;

var zoomingIn = true;

var za = 0;

if (window.innerWidth <= 1050) {
  isMoblie = true;
}
var canvas = document.querySelector("#c");

function init() {
  container = document.createElement("div");
  container.className = "three_container";
  document.body.prepend(container);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  if (isMoblie == false) {
    camera.position.z = 1.75;
  } else {
    camera.position.z = 8;
  }

  scene = new THREE.Scene();
  scene.add(camera);

  const light = new THREE.AmbientLight(0xffffff, 1.15);
  scene.add(light);

  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      var percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log("model " + Math.round(percentComplete, 2) + "% downloaded");
    }
  }

  new MTLLoader().load("../threeasset/test.mtl", function (materials) {
    materials.preload();
    new OBJLoader()
      .setMaterials(materials)
      .load("../threeasset/test.obj", function (obj) {
        obj.position.x = -1;
        obj.position.y = -1.85;
        obj.position.z = 2;
        obj.scale.set(0.052, 0.052, 0.052);
        var texture = new THREE.TextureLoader().load(
          "../threeasset/bubble.png"
        );

        obj.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material.map = texture;
            child.material.transparent = true;
          }
        });
        scene.add(obj);
        object = obj;
      });
  });

  function onError() {}

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0xffffff, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  //     if (isMoblie == false) {
  // controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls.addEventListener("change", render);
  //     }
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  ratio = window.innerWidth / window.innerHeight;
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) / 2;
  mouseY = (event.clientY - windowHalfY) / 2;
}

function render() {
  if (isMoblie == false) {
    if (zoomingIn && camera.position.z >= 0 && camera.position.z < 49) {
      camera.position.z += za;
      za += 0.002;
    } else {
      zoomingIn = false;
    }
  }
  target.x += (mouseX - target.x) * 0.00025;
  target.y += (-mouseY - target.y) * 0.00025;
  target.z = camera.position.z;
  if (object && camera.position.z >= 1) {
    object.lookAt(target);
  }
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

document.addEventListener("mousemove", onDocumentMouseMove);

if (canvas) {
  init();
  render();
}

let toggle = false;
let pa = document.querySelector(".pa");
let group = document.querySelector(".artist__groups");
pa.addEventListener("click", function (e) {
  e.preventDefault();
  if (isMoblie == false) {
    if (toggle == false) {
      group.style.display = "block";
      toggle = true;
    } else {
      group.style.display = "none";
      toggle = false;
    }
  }
});
