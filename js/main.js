import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//scene setup: 
const scene = new THREE.Scene();
//Create sphere
const geometry = new THREE.SphereGeometry( 3, 64, 64 ); 
// 64 64 makes it smooth, 3 is the radius\
//Create material, Material is the color or texture of the object
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
});

//Create mesh - combination of geometry and material :
//so technically final sphere
const mesh = new THREE.Mesh( geometry, material );
//Add mesh to scene
scene.add(mesh);

//Sizes:
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//Add Cameras :
const camera = new THREE.PerspectiveCamera(
  45, // FOV
  sizes.width / sizes.height // Aspect Ratio
);
camera.position.z = 20;
//adding camera to scene
scene.add(camera);
//Add lights
const light = new THREE.PointLight(0xffffff, 150, 100, 1.7);
light.position.set(
  0, // x
  10, // y
  10 // z
);
scene.add(light);


//Rendering the ball on screen:
// where the ball is going to be displayed
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({canvas});
//setting the size of the renderer
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2) // makes it look better and smoother 
//actual render, YAYYYYY!!!!!! YIPEEEE!!!!
renderer.render(scene, camera);


//Controls, to move around the ball :
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // smooth out the movement
controls.enablePan = false; // disable panning
controls.enableZoom = false; // disable zooming
controls.autoRotate = true; // rotate automatically

// Resizing 
// everytime we resize the page this will update
window.addEventListener('resize', () => {
  //updating sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //updating camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix(); // stop the ball from squishing
  renderer.setSize(sizes.width, sizes.height);
});

// Stop ball from squishing when we resize the page
const loop = () => {
  controls.update(); // make ball move even after released mouse
  renderer.render(scene, camera); // re render it everytime
  window.requestAnimationFrame(loop); // loop it
}
// call the loop:
loop();


//Animations, GSAP:
const t1 = gsap.timeline({defaults: {duration: 1}});
t1.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1});
t1.fromTo("nav", {y: "-160%"}, {y: "0%"})
t1.fromTo(".title", {opacity: 0}, {opacity: 1})
t1.fromTo(".titleExplorer", {opacity: 0}, {opacity: 1})


//Mouse anination color change
let mouseDown = false; //when mouse isnt moving, it will be false
let rbg = []; // starting color
window.addEventListener('mousedown', () => {
  mouseDown = true; // holding mouse click
}); 
window.addEventListener('mouseup', () => {
  mouseDown = false; // letting go of mouse click
});

window.addEventListener('mousemove', (e) => { 
  if (mouseDown){
    rbg = [ // array of colors, first is red, second is green, third is blue
      Math.round((e.pageX / sizes.width) * 255), // gives us a number between 0 and 255 when moving around the x axis
      Math.round((e.pageY / sizes.height) * 255),
      150 
    ]
    //Animation:
    let newColor = new THREE.Color(`rbg(${rbg.join(',')})`) // interpolation of colors, like writing rgb(255, 255, 255)
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b
    })
  }
})
