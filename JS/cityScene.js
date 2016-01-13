$(function () {

    //global variables//
    // vars for scene / camera / renderer
    var scene, camera, renderer;
    // cube geometry
    var cubeGeometry;
    // cube material
    var cubeMaterial;
    // cube object(mesh)
    var cube;
    // house object(mesh)
    var houseMesh;
    // statistics
    var stats;
    // lights 
    var spotLight, ambientLight;
    // color for ambientLight
    var ambiColor;
    // size of the screen
    var SCREEN_WIDTH, SCREEN_HEIGHT, VIEW_ANGLE, ASPECT, NEAR, FAR;
    // array for collision detection
    var collidableMeshList = [];
    // keyboard
    var keyboard = new THREEx.KeyboardState();
    // clock
    var clock = new THREE.Clock();
    // path to images
    var path, sides;
    // cube texture
    var cubeTex;
    // sjybox
    var skyShader, skyMaterial, skyBox;



    // initialising function
    function init() {
        // show popup
        $(".popup").append("<div class='text'><p>Movekeys: Z Q S D</p></br><p>Rotate: W X</p></br> <p>Reset: R (or hit a building)</p></br><p>Fullscreen : M</p></br></div>");
        $(".popup").show();
        
        //creates empty scene object, camera and renderer
        scene = new THREE.Scene();

        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        VIEW_ANGLE = 45;
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
        NEAR = 0.1;
        FAR = 6000;
      //camera =  new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, .1, 6000);
        camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

        renderer = new THREE.WebGLRenderer({antialias: true});
        // set color and size of renderer
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xFFFFFF);
        // enables shadowmapping  and defines the type
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;

        $("#webGL-container").append(renderer.domElement);
        
        // fullscreen mode
        THREEx.FullScreen.bindKey({charCode: 'm'.charCodeAt(0)});

        /*
         group = new THREE.Group();
         scene.add( group );
         
         group.position.x = 9.5;
         group.position.y = 4;
         group.position.z = 2.5;                  
         
         var loader = new THREE.TextureLoader();
         
         loader.load('./images/cubeTexture.jpg',function ( texture ) {
         cubeMaterial = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
         cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
         cube  = new THREE.Mesh(cubeGeometry, cubeMaterial);
         group.add(cube );
         });
         */

        // create cube
        var texture = THREE.ImageUtils.loadTexture('../images/cubeTexture.jpg');
        cubeMaterial = new THREE.MeshBasicMaterial( );
        cubeMaterial.map = texture;
        cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, 75, 1700);
        cube.castShadow = true;
        scene.add(cube);

        //create spotlight
        spotLight = new THREE.SpotLight(0xffffff);
        spotLight.castShadow = true;
        spotLight.position.set(-210, 2500, 210);
        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 5000;
        spotLight.shadow.camera.fov = 5000;
        spotLight.shadow.darkness = 0.7;
        scene.add(spotLight);

        // create ambientlight
        ambiColor = "#0c0c0c";
        ambientLight = new THREE.AmbientLight(ambiColor);
        scene.add(ambientLight);

        //load blender scene
        var objLoader = new THREE.ObjectLoader();

        objLoader.load('../models/city.json', function (geometry) { //obj

//            var material1 = new THREE.MeshBasicMaterial({color: 0xffffff});
//            var texture1 = THREE.ImageUtils.loadTexture('./images/city.png');
//            material1.map = texture1;
//            
//            var material2 = new THREE.MeshBasicMaterial({color: 0xffffff});
//            var texture2 = THREE.ImageUtils.loadTexture('./models/ang1.jpg');
//            material2.map = texture2;
//            
            // create materials
            var material1 = new THREE.MeshPhongMaterial({color: 0xFF3333});
            var material2 = new THREE.MeshPhongMaterial({color: 0xCCCCCC});

            // assign materials
            geometry.children[0].material = material1;
            geometry.children[1].material = material1;
            geometry.children[2].material = material2;
            houseMesh = geometry;

            // adding meshes to collisiondetection array
            collidableMeshList.push(geometry.children[0]);
            collidableMeshList.push(geometry.children[1]);
            collidableMeshList.push(geometry.children[2]);

            scene.add(houseMesh);

        });


        //stats
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        $("#webGL-container").append(stats.domElement);
        
        // create the skybox
        drawSimpleSkybox();
    }

    function drawSimpleSkybox() {
        // define path and box sides images
        path = '../images/';
        sides = [path + 'sky.jpg', path + 'sky.jpg', path + 'sky.jpg', path + 'sky.jpg', path + 'sky.jpg', path + 'sky.jpg'];

        // load images
        cubeTex = THREE.ImageUtils.loadTextureCube(sides);
        cubeTex.format = THREE.RGBFormat;

        // prepare skybox material (shader)
        skyShader = THREE.ShaderLib["cube"];
        skyShader.uniforms["tCube"].value = cubeTex;
        skyMaterial = new THREE.ShaderMaterial({
            fragmentShader: skyShader.fragmentShader, vertexShader: skyShader.vertexShader,
            uniforms: skyShader.uniforms, depthWrite: false, side: THREE.BackSide
        });

        // create skybox with cube geometry and add to the scene
        skyBox = new THREE.Mesh(new THREE.CubeGeometry(5000, 5000, 5000), skyMaterial);
        skyMaterial.needsUpdate = true;

        scene.add(skyBox);
    }
    //render function
    function render() {

        var delta = clock.getDelta(); // seconds.
        var moveDistance = 200 * delta; // 200 pixels per second
        var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second

        // local transformations

        // move forwards/backwards/left/right
        if (keyboard.pressed("Z"))
            cube.translateZ(-moveDistance);
        if (keyboard.pressed("S"))
            cube.translateZ(moveDistance);
        if (keyboard.pressed("Q"))
            cube.translateX(-moveDistance);
        if (keyboard.pressed("D"))
            cube.translateX(moveDistance);

        // rotate left/right/up/down
        if (keyboard.pressed("A"))
            cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
        if (keyboard.pressed("E"))
            cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);
        if (keyboard.pressed("W"))
            cube.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotateAngle);
        if (keyboard.pressed("X"))
            cube.rotateOnAxis(new THREE.Vector3(1, 0, 0), -rotateAngle);

        if (keyboard.pressed("R"))
        {
            cube.position.set(0, 75, 1700);
            cube.rotation.set(0, 0, 0);
        }

        // setting cameraangle
        var relativeCameraOffset = new THREE.Vector3(0, 30, 90);
        // setting the camera to follow the cube
        var cameraOffset = relativeCameraOffset.applyMatrix4(cube.matrixWorld);

        camera.position.x = cameraOffset.x;
        camera.position.y = cameraOffset.y;
        camera.position.z = cameraOffset.z;
        camera.lookAt(cube.position);

        var originPoint = cube.position.clone();


        // collision detection between cube vertices and scene mesh vertices
        for (var vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex++)
        {
            var localVertex = cube.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(cube.matrix);
            var directionVector = globalVertex.sub(cube.position);

            var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
            var collisionResults = ray.intersectObjects(collidableMeshList);
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length())
            {
                cube.position.set(0, 75, 1700);
                cube.rotation.set(0, 0, 0);
            }
        }
    }
    // animate function
    function animate()
    {
        requestAnimationFrame(animate);
        render();
        stats.update();
        renderer.render(scene, camera);
    }

    init();
    animate();

    $(window).resize(function ()
    {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    });

});