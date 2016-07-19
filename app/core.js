/**
 * Created by jp on 18.07.16.
 */

var container;

var camera, scene, renderer;

init();
animate();

function init() {
    
    // HTML-Container erzeugen
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // TODO: code goes here
    
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    var timer = Date.now() * 0.0001;

    camera.position.x = Math.cos( timer ) * 800;
    camera.position.z = Math.sin( timer ) * 800;

    camera.lookAt( scene.position );

    for ( var i = 0, l = scene.children.length; i < l; i ++ ) {

        var object = scene.children[ i ];

        object.rotation.x = timer * 5;
        object.rotation.y = timer * 2.5;

    }

    renderer.render( scene, camera );

}