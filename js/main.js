var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sun
var sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(0, 1, 0);
scene.add(sun);

// Ambient light
var ambient_light = new THREE.AmbientLight(0x404040);
scene.add(ambient_light);

// Test cube
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
cube.position.y = 2;
scene.add(cube);

// Ground
var ground_geom = new THREE.PlaneGeometry(50, 50);
var ground_mat = new THREE.MeshLambertMaterial({color: 0xffffff});
var ground = new THREE.Mesh(ground_geom, ground_mat);
ground.rotation.x = -Math.PI / 2;
ground.matrixAutoUpdate = false;
ground.updateMatrix();
scene.add(ground);

camera.position.z = 5;
camera.position.y = 2;

function render()
{
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}

render();
