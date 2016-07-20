var container;

var camera, scene, renderer;





// start

init();

animate();

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

    /*var map = new THREE.TextureLoader().load( 'textures/UV_Grid_Sm.jpg' );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;

    var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } );*/
    var material = new THREE.MeshBasicMaterial();

    //


    //sph = new THREE.Mesh( new THREE.SphereGeometry(50,20,20),material);
    //sph.position.set(0,0,0);
    //scene.add(sph);


    var player = Player();
    player.init();
    var world = World();
    world.init();
    var movement = Movement();
    movement.init();
    setScore(939129391);
    setMoney(5000);


    object = new THREE.AxisHelper( 100 );
    object.position.set( 0, 0, 0 );
    scene.add( object );

   /** object = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 50 );
    object.position.set( 400, 0, -200 );
    scene.add( object ); */

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
    container.appendChild( renderer.domElement );
    // Event-Listener
    window.addEventListener( 'resize', onWindowResize, false );

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




   // camera.position.x = Math.cos( timer ) * 800;
   // camera.position.z = Math.sin( timer ) * 800;

    camera.lookAt( scene.position );



function render() {

    // TODO: animation code goes here


    renderer.render( scene, camera );

}