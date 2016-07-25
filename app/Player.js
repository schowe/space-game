var ship, frontVector, backVector, directionVector;
var cross;
frontVector = new THREE.Vector3 (0,0,0); 
backVector = new THREE.Vector3 (0,0,0); 
directionVector = new THREE.Vector3 (0,0,0); 

function Player() {

    return {
        init: function() {

            
             var geometry = fileLoader.get("HeroShipV5");
            
             ship = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: "darkgrey",specular:"darkgrey"}));
             ship.position.set(0, 0, 0);
            
             scene.add(ship);

             var mapA = fileLoader.get("Crosshair");
            
             var materialA = new THREE.SpriteMaterial({map: mapA});
            
             cross = new THREE.Sprite(materialA);
             cross.position.set(0,0,-20);
             cross.scale.set(3.0,3.0,1.0);
             ship.add(cross);
            




        }    
    }
    
};








