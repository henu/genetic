var Genetic = Genetic || {};

Genetic.Organism = function(parent, mutation)
{
    // If there is no parent, then create new genes randomly
    if (!parent) {
        // Add some random nodes
        this.nodes = [];
        this.lines = [];
        var nodes_count = 5 + Math.floor(Math.random() * 3);
        for (var node_i = 0; node_i < nodes_count; ++ node_i) {
            // If this is first node, then add it to center
            if (this.nodes.length == 0) {
                this.nodes.push(new THREE.Vector3(0, 0, 0));
            } else {
                this.addRandomNodeAndLines();
            }
        }

        this.muscle_freq = 0.1 + Math.random() * 0.9;
    }
    // Copy genes from parent and add little mutation
    else {

    }

    // Finally move all nodes so that average point is zero and lowest point is on the ground
    var average_x = 0;
    var average_z = 0;
    var min_y = this.nodes[0].y;
    for (var node_i = 0; node_i < this.nodes.length; ++ node_i) {
        var node = this.nodes[node_i];
        average_x += node.x;
        average_z += node.z;
        min_y = Math.min(min_y, node.y);
    }
    average_x /= this.nodes.length;
    average_z /= this.nodes.length;
    for (var node_i = 0; node_i < this.nodes.length; ++ node_i) {
        var node = this.nodes[node_i];
        node.x -= average_x;
        node.z -= average_z;
        node.y -= min_y - Genetic.Node.radius;
    }
}

Genetic.Organism.prototype.createNodesAndLines = function(x, y, z, scene, nodes, lines, phase)
{
    var real_nodes = [];
    for (var node_i = 0; node_i < this.nodes.length; ++ node_i) {
        var node = this.nodes[node_i];
        var real_node = new Genetic.Node(x + node.x, y + node.y, z + node.z, scene);
        nodes.push(real_node);
        real_nodes.push(real_node);
    }

    for (var line_i = 0; line_i < this.lines.length; ++ line_i) {
        var line = this.lines[line_i];
        var node1 = real_nodes[line.node1];
        var node2 = real_nodes[line.node2];
        var real_line = new Genetic.Line(node1, node2, scene);
        if (line.muscle) {
            real_line.setMuscle(this.muscle_freq, line.muscle_phase, phase)
        }
        lines.push(real_line);
    }
}

Genetic.Organism.prototype.addRandomNodeAndLines = function()
{
    var MAX_DISTANCE = 1;
    var MIN_DISTANCE = 0.25;

    while (true) {
        // Select one of the nodes as base
        var base_node = this.nodes[Math.floor(Math.random() * this.nodes.length)];
        var new_node = new THREE.Vector3(base_node.x, base_node.y, base_node.z);

        // Randomly move away from base node
        new_node.x += Math.random() * MAX_DISTANCE * 2 - MAX_DISTANCE;
        new_node.y += Math.random() * MAX_DISTANCE * 2 - MAX_DISTANCE;
        new_node.z += Math.random() * MAX_DISTANCE * 2 - MAX_DISTANCE;

        // This node is valid, if there is enough old nodes
        // near it, and if none of these is too near.
        var nodes_too_near = false;
        var neighbors = [];
        for (var node_i = 0; node_i < this.nodes.length; ++ node_i) {
            var node = this.nodes[node_i];
            var distance = node.distanceTo(new_node);
            if (distance < MIN_DISTANCE) {
                nodes_too_near = true;
                break;
            }
            if (distance <= MAX_DISTANCE) {
                neighbors.push(node_i);
            }
        }
        if (!nodes_too_near) {
            var allowed_neighbors_min = Math.min(3, this.nodes.length);
            var allowed_neighbors_max = 4;
            if (neighbors.length >= allowed_neighbors_min && neighbors.length < allowed_neighbors_max) {
                this.nodes.push(new_node);
                break;
            }
        }
    }

    var new_node_i = this.nodes.length - 1;

    // Select some of the neighbors randomly and connect
    var add_nodes = 3;
    while (add_nodes > 0 && neighbors.length > 0) {
        -- add_nodes;
        var neighbor_i = Math.floor(Math.random() * neighbors.length);
        var neighbor = neighbors.splice(neighbor_i, 1)[0];
        var new_line = {
            node1: neighbor,
            node2: new_node_i,
            muscle: false
        };
        if (Math.random() < 0.1) {
            new_line.muscle = true;
            new_line.muscle_phase = Math.random();
        }
        this.lines.push(new_line);
    }
}
