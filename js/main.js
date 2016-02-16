var Genetic = Genetic || {};

Genetic.setupSceneCameraAndRenderer();
Genetic.setupLights();

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

// Some test structures
node1 = new Genetic.Node(0, 1, 0, Genetic.scene);
node2 = new Genetic.Node(0, 2, 0, Genetic.scene);
node3 = new Genetic.Node(0.8, 1.5, 0, Genetic.scene);
Genetic.nodes = [];
Genetic.nodes.push(node1);
Genetic.nodes.push(node2);
Genetic.nodes.push(node3);

Genetic.clock = new THREE.Clock(true);

Genetic.render = function()
{
    requestAnimationFrame(Genetic.render);
    Genetic.renderer.render(Genetic.scene, Genetic.camera);

    Genetic.runNodes(Genetic.clock.getDelta());
}

Genetic.runNodes = function(deltatime)
{
    for (var node_i = 0; node_i < Genetic.nodes.length; ++ node_i) {
        var node = Genetic.nodes[node_i];
        node.run(deltatime);
    }
}

Genetic.render();
