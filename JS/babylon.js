$(function () {

    /**************** Babylon.js ************************/
    var canvas = document.getElementById('babylonCanvas');

    // init babylon
    var engine = new BABYLON.Engine(canvas, true);

    // create scene
    var sceneB = new BABYLON.Scene(engine);

    // create camera
    var camera = new BABYLON.ArcRotateCamera("camera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), sceneB);

    // create light
    var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -1, 0), sceneB);
    light.diffuse = new BABYLON.Color3(1, 0, 0);
    light.specular = new BABYLON.Color3(1, 1, 1);

    // create cube
    var box = BABYLON.Mesh.CreateBox("box", 3.0, sceneB);
    var material = new BABYLON.StandardMaterial("texture", sceneB);

    // create material
    material.diffuseColor = new BABYLON.Color3(1, 0, 0);

    // add material to cube
    box.material = material;

    sceneB.activeCamera.attachControl(canvas);

    engine.runRenderLoop(function () {
        box.rotation.x += 0.005;
        box.rotation.y += 0.01;
        sceneB.render();
    });

});

