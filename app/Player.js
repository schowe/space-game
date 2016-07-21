var ship;


function Player() {

    return {
        init: function() {
            
             var geometry = fileLoader.get("HeroShipV4");
            
            

             ship = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: "orange"}));
             ship.position.set(0, 0, 0);
            
             scene.add(ship);
             


        }    
    }
    
}





