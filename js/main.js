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
node2 = new Genetic.Node(0, 2, 0.1, Genetic.scene);
node3 = new Genetic.Node(0.8, 1.5, 0, Genetic.scene);
line1 = new Genetic.Line(node1, node2, Genetic.scene);
line2 = new Genetic.Line(node2, node3, Genetic.scene);
line3 = new Genetic.Line(node3, node1, Genetic.scene);
Genetic.nodes = [];
Genetic.nodes.push(node1);
Genetic.nodes.push(node2);
Genetic.nodes.push(node3);
Genetic.lines = [];
Genetic.lines.push(line1);
Genetic.lines.push(line2);
Genetic.lines.push(line3);

Genetic.render = function()
{
    for (var line_i = 0; line_i < Genetic.lines.length; ++ line_i) {
        var line = Genetic.lines[line_i];
        line.updateMatrix();
    }

    requestAnimationFrame(Genetic.render);
    Genetic.renderer.render(Genetic.scene, Genetic.camera);

    Genetic.runNodes(1 / 60);
}

Genetic.runNodes = function(deltatime)
{
    for (var node_i = 0; node_i < Genetic.nodes.length; ++ node_i) {
        var node = Genetic.nodes[node_i];
        node.run(deltatime);
    }
    for (var line_i = 0; line_i < Genetic.lines.length; ++ line_i) {
        var line = Genetic.lines[line_i];
        line.run();
    }
}

Genetic.render();
