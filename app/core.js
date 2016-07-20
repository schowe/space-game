var container;

var camera, scene, renderer;

var fileLoader;
var interface;

$(function() {
    fileLoader = FileLoader();
    interface = Interface();

    init();
    animate();
});


function init() {

    /********** THREE.js initialisieren **********/

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.y = 400;

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    scene = new THREE.Scene();



    /********** Szene füllen **********/

    var light, object;

    scene.add( new THREE.AmbientLight( 0x404040 ) );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    scene.add( light );

    object = new THREE.AxisHelper( 100 );
    object.position.set( 0, 0, 0 );
    scene.add( object );


    var spaceShipModel = fileLoader.get("HeroShipV2");



    /********** Module laden **********/

    var player = Player();
    player.init();
    var world = World();
    world.init();
    var movement = Movement();
    movement.init();


    subHP (500); //HP Bar Beispiel



    /********** Input **********/
    
    // Szene in DOM einsetzen
    container.appendChild( renderer.domElement );
    // Event-Listener
    window.addEventListener( 'resize', onWindowResize, false );
    window.onkeydown = onKeyDown;


}

function onKeyDown(e) {
    if (e.keyCode == 80) { // = 'P'
        interface.toggleMenuOverlay();
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {
    // dont touch!
    requestAnimationFrame( animate );
    render();
}


function render() {

    // TODO: animation code goes here

    renderer.render( scene, camera );

}