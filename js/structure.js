var Genetic = Genetic || {};

Genetic.Node = function(x, y, z, scene)
{
    this.velocity = new THREE.Vector3(0, 0, 0);

    this.mesh = new THREE.Mesh(Genetic.Node.geom, Genetic.Node.mat);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;
    scene.add(this.mesh);
}

Genetic.Node.radius = 0.1;
Genetic.Node.geom = new THREE.IcosahedronGeometry(Genetic.Node.radius, 1);
Genetic.Node.mat = new THREE.MeshLambertMaterial({ color: 0x00e0e0 });
Genetic.Node.bounciness = 0.25;

Genetic.Node.prototype.getPosition = function()
{
    return this.mesh.position;
}

Genetic.Node.prototype.run = function(deltatime)
{
    this.velocity.y -= 9.81 * deltatime;
    this.mesh.position.x += this.velocity.x * deltatime;
    this.mesh.position.y += this.velocity.y * deltatime;
    this.mesh.position.z += this.velocity.z * deltatime;
    if (this.mesh.position.y < Genetic.Node.radius) {
        this.mesh.position.y = Genetic.Node.radius;
        this.velocity.y = -this.velocity.y * Genetic.Node.bounciness;
    }
}
