var Genetic = Genetic || {};

Genetic.Node = function(x, y, z, scene)
{
    this.last_pos = new THREE.Vector3(x, y, z);

    this.mesh = new THREE.Mesh(Genetic.Node.geom, Genetic.Node.mat);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
    scene.add(this.mesh);

    this.lines_connected = 0;
}

Genetic.Node.radius = 0.1;
Genetic.Node.geom = new THREE.IcosahedronGeometry(Genetic.Node.radius, 1);
Genetic.Node.mat = new THREE.MeshLambertMaterial({ color: 0x00e0e0 });
Genetic.Node.bounciness = 0.1;

Genetic.Node.prototype.getPosition = function()
{
    return this.mesh.position;
}

Genetic.Node.prototype.copy = function(scene)
{
    var result = new Genetic.Node(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z, scene)
    result.last_pos.x = this.last_pos.x;
    result.last_pos.y = this.last_pos.y;
    result.last_pos.z = this.last_pos.z;
    return result;
}

Genetic.Node.prototype.run = function(deltatime)
{
    // Calculate velocity from last and current positions
    var velocity_x = (this.mesh.position.x - this.last_pos.x) / deltatime;
    var velocity_y = (this.mesh.position.y - this.last_pos.y) / deltatime;
    var velocity_z = (this.mesh.position.z - this.last_pos.z) / deltatime;

    // Add gravity
    velocity_y -= 9.81 * deltatime;

    // Store last position
    this.last_pos.x = this.mesh.position.x;
    this.last_pos.y = this.mesh.position.y;
    this.last_pos.z = this.mesh.position.z;

    // Apply velocity to position
    this.mesh.position.x += velocity_x * deltatime;
    this.mesh.position.y += velocity_y * deltatime;
    this.mesh.position.z += velocity_z * deltatime;

    // Make sure node will not fall through the ground
    if (this.mesh.position.y < Genetic.Node.radius) {
        this.mesh.position.y = Genetic.Node.radius;
        velocity_y = -velocity_y * Genetic.Node.bounciness;
        velocity_x *= Genetic.Node.bounciness;
        velocity_z *= Genetic.Node.bounciness;
        // Because velocity will be lost after we exit from this function,
        // we modify last position to keep the effects of bouncing.
        this.last_pos.x = this.mesh.position.x - velocity_x * deltatime;
        this.last_pos.y = this.mesh.position.y - velocity_y * deltatime;
        this.last_pos.z = this.mesh.position.z - velocity_z * deltatime;
    }
}

Genetic.Line = function(node1, node2, scene)
{
    this.node1 = node1;
    this.node2 = node2;
    this.length = node1.getPosition().distanceTo(node2.getPosition());

    ++ node1.lines_connected;
    ++ node2.lines_connected;

    this.mesh = new THREE.Mesh(Genetic.Line.geom, Genetic.Line.mat);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.matrixAutoUpdate = false;
    scene.add(this.mesh);

    this.muscle_freq = -1;
    this.muscle_phase = 0;
}

Genetic.Line.prototype.setMuscle = function(frequency, phase, phase_now)
{
    this.muscle_freq = frequency;
    this.muscle_phase = phase;

    // Setting Line muscle means its length should be longer or
    // shorter at current phase. Because of this, its default
    // length needs to be recalculated.
    var muscle_stretch = this.getMuscleStretch(phase_now);
    this.length /= muscle_stretch;
}

Genetic.Line.prototype.updateMatrix = function(phase)
{
    var p1 = this.node1.getPosition();
    var p2 = this.node2.getPosition();

    // Move to correct position
    this.mesh.matrix.makeTranslation(p1.x, p1.y, p1.z);

    // Rotate
    var diff_x = p2.x - p1.x;
    var diff_y = p2.y - p1.y;
    var diff_z = p2.z - p1.z;
    var diff_xz = Math.sqrt(diff_x*diff_x + diff_z*diff_z);
    var yaw = Math.atan2(-diff_x, -diff_z);
    var pitch = Math.PI * -0.5 + Math.atan2(diff_y, diff_xz);
    Genetic.Line.tmp_mat1.makeRotationY(yaw);
    this.mesh.matrix.multiply(Genetic.Line.tmp_mat1)
    Genetic.Line.tmp_mat1.makeRotationX(pitch);
    this.mesh.matrix.multiply(Genetic.Line.tmp_mat1)

    // Set correct length
    Genetic.Line.tmp_mat1.makeScale(1, this.getDesiredLength(phase), 1);
    this.mesh.matrix.multiply(Genetic.Line.tmp_mat1)

    // Make it grow up from origin
    Genetic.Line.tmp_mat1.makeTranslation(0, 0.5, 0);
    this.mesh.matrix.multiply(Genetic.Line.tmp_mat1)
}

Genetic.Line.prototype.run = function(phase, nodes, scene)
{
    var BREAK_THRESHOLD = 0.075;

    var length_now = this.node1.getPosition().distanceTo(this.node2.getPosition());
    if (length_now > 0.001) {
        var diff_x = this.node2.getPosition().x - this.node1.getPosition().x;
        var diff_y = this.node2.getPosition().y - this.node1.getPosition().y;
        var diff_z = this.node2.getPosition().z - this.node1.getPosition().z;

        var fix = (length_now - this.getDesiredLength(phase)) / length_now / 2;
        if (Math.abs(fix) > 0.001) {
            var fix_x = diff_x * fix;
            var fix_y = diff_y * fix;
            var fix_z = diff_z * fix;

            // If fix is too big, then break line
            var fix_len = Math.sqrt(fix_x*fix_x + fix_y*fix_y + fix_z*fix_z);
            if (fix_len > BREAK_THRESHOLD && (this.node1.lines_connected > 1 || this.node2.lines_connected > 1)) {
                // Break one of the nodes. Use random selection
                // if both are still connected to other lines.
                if (this.node2.lines_connected <= 1 || (this.node1.lines_connected > 1 && Math.random() < 0.5)) {
                    var new_node = node1.copy(scene);
                    -- this.node1.lines_connected;
                    nodes.push(new_node);
                    this.node1 = new_node;
                    new_node.lines_connected = 1;

                    this.node1.getPosition().x += fix_x * 2;
                    this.node1.getPosition().y += fix_y * 2;
                    this.node1.getPosition().z += fix_z * 2;
                } else {
                    var new_node = node2.copy(scene);
                    -- this.node2.lines_connected;
                    nodes.push(new_node);
                    this.node2 = new_node;
                    new_node.lines_connected = 1;

                    this.node2.getPosition().x -= fix_x * 2;
                    this.node2.getPosition().y -= fix_y * 2;
                    this.node2.getPosition().z -= fix_z * 2;
                }
            } else {
                this.node1.getPosition().x += fix_x;
                this.node1.getPosition().y += fix_y;
                this.node1.getPosition().z += fix_z;
                this.node2.getPosition().x -= fix_x;
                this.node2.getPosition().y -= fix_y;
                this.node2.getPosition().z -= fix_z;
            }
        }
    }
}

Genetic.Line.prototype.getDesiredLength = function(phase)
{
    // If there is no muscle here
    if (this.muscle_freq < 0) {
        return this.length;
    }

    var muscle_stretch = this.getMuscleStretch(phase);
    return this.length * muscle_stretch;
}

Genetic.Line.prototype.getMuscleStretch = function(phase)
{
    var relative_phase = phase * this.muscle_freq + this.muscle_phase;
    return 1 + 0.5 * Math.sin(relative_phase * Math.PI * 2);
}

Genetic.Line.radius = 0.075;
Genetic.Line.geom = new THREE.CylinderGeometry(Genetic.Line.radius, Genetic.Line.radius, 1, 6, 1, true);
Genetic.Line.mat = new THREE.MeshLambertMaterial({ color: 0x00e0e0 });

Genetic.Line.tmp_mat1 = new THREE.Matrix4();
