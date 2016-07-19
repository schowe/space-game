
function Player() {
    
    return {
        init: function() {
            var material = new THREE.MeshBasicMaterial();
            ship = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4 ), material );
            ship.position.set( 0, 0, 0 );
            controls = new THREE.PointerLockControls( ship );
            scene.add( controls.getObject() );
        }    
    }
    
}



/*function init(){

    ship = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4 ), material );
    ship.position.set( 0, 0, 0 );
    controls = new THREE.PointerLockControls( ship );
    scene.add( controls.getObject() );
}*/

