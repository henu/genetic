var Genetic = Genetic || {};

Genetic.setupSceneCameraAndRenderer();
Genetic.setupLights();

// Test cube
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;
cube.position.y = 1;
Genetic.scene.add(cube);

// Ground
var ground_geom = new THREE.PlaneGeometry(50, 50);
var ground_mat = new THREE.MeshLambertMaterial({color: 0xffffff});
var ground = new THREE.Mesh(ground_geom, ground_mat);
ground.castShadow = false;
ground.receiveShadow = true;
ground.rotation.x = -Math.PI / 2;
ground.matrixAutoUpdate = false;
ground.updateMatrix();
Genetic.scene.add(ground);

Genetic.camera.position.z = 3;
Genetic.camera.position.y = 1;

Genetic.render = function()
{
    requestAnimationFrame(Genetic.render);
    Genetic.renderer.render(Genetic.scene, Genetic.camera);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}

Genetic.render();
