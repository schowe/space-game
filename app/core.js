var container;

var camera, scene, renderer, clock;

var fileLoader;
var interface;
var ship;

$(function() {
    fileLoader = FileLoader();
    interface = Interface();
    setTimeout(function(){
        init();
        animate();
    },1000)

});


function init() {

    /********** THREE.js initialisieren **********/

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    
    scene = new THREE.Scene();

    // Beispiel-Code ...
    var player = Player();
    player.init();


    
    camera = new THREE.TargetCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );    
    camera.addTarget({
        name:'Target',
        targetObject: ship,
        cameraPosition: new THREE.Vector3(0,15,30),
        fixed: false,
        stiffness: 0.15,
        matchRotation: false
    });

    camera.addTarget({
        name:'Cockpit',
        targetObject: ship,
        cameraPosition: new THREE.Vector3(0,0,-10),
        fixed: false,
        stiffness: 1,
        matchRotation: true
    });

    camera.setTarget('Target');




    /********** Szene füllen **********/


    var light, object;

    scene.add( new THREE.AmbientLight( 0x404040 ) );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    scene.add( light );

    object = new THREE.AxisHelper( 100 );
    object.position.set( 0, 0, 0 );
    scene.add( object );    
    


    

    /********** Module laden **********/

    
    var world = World();
    world.init();
    createStars();
    createAsteroids(); 
    var movement = Movement();
    movement.init();
    interfaceInit();
    


    object = new THREE.AxisHelper( 100 );
    object.position.set( 0, 0, 0 );
    scene.add( object );


   /** object = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 50 );
    object.position.set( 400, 0, -200 );
    scene.add( object ); */



    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );


    /********** Input **********/
    
    // Szene in DOM einsetzen
    container.appendChild( renderer.domElement );
    // Event-Listener
    window.addEventListener( 'resize', onWindowResize, false );

    clock = new THREE.Clock();

    window.onkeydown = onKeyDown;

    initializeWeapons();
}

function onKeyDown(e) {
    var movement = Movement();
    if (e.keyCode == 80 && Pause == false) { // = 'P'
        PauseScreen = true;
        interface.toggleMenuOverlay();        
        movement.unlockPointer();
    }else if(e.keyCode == 80 && Pause == true){
        interface.toggleMenuOverlay();        
        movement.lockPointer();        
        PauseScreen = false;
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



    delta = clock.getDelta();
    if(!Pause) {
        renderWeapons();
        Movement().move(delta);
        updateStars();
        updateAsteroids(); 
        camera.update();        
    }
    renderer.render(scene, camera);
}
