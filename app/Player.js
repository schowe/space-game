
var Player = function() {
    
    return {
        init: function() {
            var material = new THREE.MeshBasicMaterial();
            ship = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4 ), material );
            ship.position.set( 0, 0, 0 );
            controls = new THREE.PointerLockControls( ship );
            scene.add( controls.getObject() );

            camera.lookAt(ship.position);
        }    
    }
    
};



/*function init(){

    ship = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4 ), material );
    ship.position.set( 0, 0, 0 );
    controls = new THREE.PointerLockControls( ship );
    scene.add( controls.getObject() );
}*/

