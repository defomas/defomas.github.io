$(function () {

    var div = document.getElementById('three');
    var height = div.offsetHeight;
    var width = div.offsetWidth;

    // init the WebGL renderer and append it to the Dom

    var renderer = new THREE.WebGLRenderer(); 
    renderer.setSize(width, height);
    div.appendChild(renderer.domElement); // using div

    // create camera
    var camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    camera.position.z = 400;

    // create scene
    var sceneT = new THREE.Scene();

    // create cube
    var cube = new THREE.CubeGeometry(100, 100, 100);

    // create material
    var material = new THREE.MeshNormalMaterial();

    // create mesh
    var mesh = new THREE.Mesh(cube, material);

    // add object to scene
    sceneT.add(mesh);

    // animate function
    animate();

    function animate() {

        requestAnimationFrame(animate);

        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;

        renderer.render(sceneT, camera);
    }

});

