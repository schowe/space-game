var ship, frontVector, backVector, directionVector; 

frontVector = new THREE.Vector3 (0,0,0); 
backVector = new THREE.Vector3 (0,0,0); 
directionVector = new THREE.Vector3 (0,0,0); 

function Player() {

    return {
        init: function() {

            
             var geometry = fileLoader.get("HeroShipV4");
            
            

             ship = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: "orange"}));
             ship.position.set(0, 0, 0);
            
             scene.add(ship);
             



        }    
    }
    
};








