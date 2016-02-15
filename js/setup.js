var Genetic = Genetic || {};

Genetic.setupSceneCameraAndRenderer = function()
{
    Genetic.scene = new THREE.Scene();
    Genetic.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    Genetic.renderer = new THREE.WebGLRenderer();
    Genetic.renderer.setSize(window.innerWidth, window.innerHeight);
    Genetic.renderer.setClearColor(0xffffff);
    Genetic.renderer.shadowMapEnabled = true;
    Genetic.renderer.shadowMapType = THREE.PCFSoftShadowMap;
    document.body.appendChild(Genetic.renderer.domElement);
}

Genetic.setupLights = function()
{
    // Sun
    Genetic.sun = new THREE.DirectionalLight(0xffffff, 1);
    Genetic.sun.castShadow = true;
    Genetic.sun.shadowDarkness = 1;
    Genetic.sun.position.set(20, 100, 30);
    Genetic.scene.add(Genetic.sun);

    // Ambient light
    Genetic.ambient_light = new THREE.AmbientLight(0x404040);
    Genetic.scene.add(Genetic.ambient_light);
}
