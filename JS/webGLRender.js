$(function(){
var container, stats;

var camera, scene, renderer;

var light;

function init() {

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set( 0, 1000, 1000 );
camera.lookAt( scene.position );

renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0xf0f0f0 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

$("#webGL-container").append(renderer.domElement);

// Grid

var size = 500, step = 100;

var geometry = new THREE.Geometry();

for ( var i = - size; i <= size; i += step ) {

    geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
    geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

    geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
    geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

}

var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.5 } );

var line = new THREE.LineSegments( geometry, material );
scene.add( line );

// Spheres

geometry = new THREE.SphereGeometry( 100, 26, 18 );
material = new THREE.MeshLambertMaterial( { color: 0xffffff} );

for ( var i = 0; i < 20; i ++ ) {

    var sphere = new THREE.Mesh( geometry, material );

    sphere.position.x = ( i % 5 ) * 200 - 400;
    sphere.position.z = Math.floor( i / 5 ) * 200 - 400;

    scene.add( sphere );

}

// Lights

var ambientLight = new THREE.AmbientLight( Math.random() * 0x202020 );
scene.add( ambientLight );

var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
directionalLight.position.set( 0, 1, 0 );
scene.add( directionalLight );

light = new THREE.PointLight( 0xff0000, 1, 500 );
scene.add( light );



stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
$("#webGL-container").append(stats.domElement);;

}

function animate() {

requestAnimationFrame( animate );

render();
stats.update();

}

function render() {

var timer = Date.now() * 0.001;

light.position.x = Math.cos( timer ) * 1000;
light.position.y = 500;
light.position.z = Math.sin( timer ) * 1000;

renderer.render( scene, camera );

}
init();
animate();

    $(window).resize(function () {
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    });

});

