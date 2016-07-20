var ship;


function Player() {

    return {
        init: function() {
            var material = new THREE.MeshBasicMaterial();
            ship = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100), material );
            ship.position.set( 0, 0, 0 );            
            scene.add( ship );

        }    
    }
    
}





