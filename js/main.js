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

Genetic.phase = 0;

Genetic.nodes = [];
Genetic.lines = [];

// Test organism
var organism = new Genetic.Organism(null, 0);
organism.createNodesAndLines(0, 0, 0, Genetic.scene, Genetic.nodes, Genetic.lines, Genetic.phase);

Genetic.render = function()
{
    for (var line_i = 0; line_i < Genetic.lines.length; ++ line_i) {
        var line = Genetic.lines[line_i];
        line.updateMatrix(Genetic.phase);
    }

    requestAnimationFrame(Genetic.render);
    Genetic.renderer.render(Genetic.scene, Genetic.camera);

    var deltatime = 1 / 60;
    Genetic.runNodes(deltatime);
    Genetic.runLines(Genetic.phase);
    Genetic.phase += deltatime;
}

Genetic.runNodes = function(deltatime)
{
    for (var node_i = 0; node_i < Genetic.nodes.length; ++ node_i) {
        var node = Genetic.nodes[node_i];
        node.run(deltatime);
    }
}

Genetic.runLines = function(phase)
{
    for (var line_i = 0; line_i < Genetic.lines.length; ++ line_i) {
        var line = Genetic.lines[line_i];
        line.run(phase, Genetic.nodes, Genetic.scene);
    }
}

Genetic.render();
