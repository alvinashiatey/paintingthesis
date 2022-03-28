import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
var container, controls, camera, scene, renderer;
// var target = new THREE.Vector3(0, 0, 0);
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

var bubs = [];

if (window.innerWidth <= 1050) {
        isMoblie = true;
}

var canvas = document.querySelector("#c2");

function init() {
        container = document.createElement("div");
        document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(
                45,
                window.innerWidth / window.innerHeight,
                1,
                1000
        );

        if (isMoblie == false) {
                camera.position.z = 20;
        }

        scene = new THREE.Scene();
        scene.add(camera);

        const light = new THREE.AmbientLight(0xffffff, 1.15);
        scene.add(light);

        function onProgress(xhr) {
                if (xhr.lengthComputable) {
                        var percentComplete = (xhr.loaded / xhr.total) * 100;
                        console.log(
                                "model " +
                                        Math.round(percentComplete, 2) +
                                        "% downloaded"
                        );
                }
        }

        var texloader = new THREE.TextureLoader();
        texloader.load("../../threeasset/bubble.png", function (texture) {
                let sphere = new THREE.SphereGeometry(1, 32, 16);
                let material = new THREE.MeshStandardMaterial({
                        map: texture,
                        transparent: true
                });
                var counter = 0;
                var resetCounter = function () {
                        for (let i = 0; i < bubs.length; i++) {
                                scene.remove(bubs[i]);
                        }
                        bubs = [];
                        return (counter = 0);
                };
                var event = [
                        "mousedown",
                        "mousemove",
                        "keypress",
                        "scroll",
                        "touchstart"
                ];
                event.forEach(function (name) {
                        document.addEventListener(name, resetCounter, true);
                });
                setInterval(function () {
                        counter += 1;
                        if (counter > 500) {
                                let bub = new THREE.Mesh(sphere, material);
                                let bx = Math.random().map(0, 1, -15, 15);
                                let by = Math.random().map(0, 1, -10, 10);
                                let bz = Math.random().map(0, 1, -25, 15);
                                bub.position.set(bx, by, bz);
                                bub.scale.set(0.55, 0.55, 0.55);
                                bubs.push(bub);
                                for (let i = 0; i < bubs.length; i++) {
                                        scene.add(bubs[i]);
                                }
                        }
                }, 3000);
        });

        Number.prototype.map = function (in_min, in_max, out_min, out_max) {
                return (
                        ((this - in_min) * (out_max - out_min)) /
                                (in_max - in_min) +
                        out_min
                );
        };

        function onError() {}

        renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true,
                preserveDrawingBuffer: true
        });
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
        // console.log(mouseX);
}

function render() {
        if (bubs) {
                for (let i = 0; i < bubs.length; i++) {
                        bubs[i].rotation.y += 0.0125;
                        bubs[i].rotation.z += 0.0025;
                        bubs[i].position.x += 0.0055;
                        bubs[i].position.y += 0.006;
                }
                //   if (zoomingIn && camera.position.z >= 0 && camera.position.z < 49) {
                //     camera.position.z += za;
                //     za += 0.002;
                //   } else {
                //     zoomingIn = false;
                //   }
                //   target.x += (mouseX - target.x) * 0.000075;
                //   target.y += (-mouseY - target.y) * 0.000075;
                //   target.z = camera.position.z;
                //   if (object) {
                //     object.lookAt(target);
                //   }
        }

        requestAnimationFrame(render);
        renderer.render(scene, camera);
}

document.addEventListener("mousemove", onDocumentMouseMove);

if (canvas) {
        init();
        render();
}
