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
    container.appendChild( renderer.domElement );
    // Event-Listener
    window.addEventListener( 'resize', onWindowResize, false );

    addPoints(50);
    addPoints(50);

    addPoints(50);
    subPoints(50);

    addGeld(50);

    setInterval(addPoint,1000);
}

function addPoint(){
    var tempscore = document.getElementById('score');    
    tempscore.innerHTML = parseInt(tempscore.innerHTML)+1;
}

function addPoints(temp){
    var tempscore = document.getElementById('score');    
    tempscore.innerHTML = parseInt(tempscore.innerHTML)+parseInt(temp);
}

function subPoints(temp){
    var tempscore = document.getElementById('score');    
    tempscore.innerHTML = parseInt(tempscore.innerHTML)-parseInt(temp);
}

function addGeld(temp){
    var tempscore = document.getElementById('geld');    
    tempscore.innerHTML = parseInt(tempscore.innerHTML)+parseInt(temp);
}

function subGeld(temp){
    var tempscore = document.getElementById('geld');    
    tempscore.innerHTML = parseInt(tempscore.innerHTML)-parseInt(temp);
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
