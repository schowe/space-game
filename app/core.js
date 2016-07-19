var container;

var camera, scene, renderer;

// start
init();
animate();

function init() {
    
    // HTML-Container erzeugen
    container = document.createElement( 'div' );
    document.body.appendChild( container );



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
        console.log("pause");
        showMenuOverlay();
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

    //renderer.render( scene, camera );

}