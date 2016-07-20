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
    
    // HTML-Container erzeugen
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    
    // Beispiel-Code ...
    
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.y = 400;

    scene = new THREE.Scene();

    var light, object;

    scene.add( new THREE.AmbientLight( 0x404040 ) );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    scene.add( light );
    
    var player = Player();
    player.init();
    var world = World();
    world.init();
    var movement = Movement();
    movement.init();

    subHP (500); //HP Bar Beispiel


    object = new THREE.AxisHelper( 100 );
    object.position.set( 0, 0, 0 );
    scene.add( object );
    
    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    // TODO: scene code goes here
    // Welt erzeugen
    // Spieler erzeugen
    // Gegner erzeugen
    // ...
    // => Funktionen aus anderen Dateien laden!!
    
    // Szene in DOM einsetzen
    //container.appendChild( renderer.domElement );
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