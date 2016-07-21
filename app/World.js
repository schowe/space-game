var sphere = new THREE.Object3D();

var stars = [];

//starStuff 
function createStars(){

    var star, material, alpha; 

    // for ( var zpos= -2000; zpos < 0; zpos+=10 ) {

    //     // Material of stars
    //     material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    //     var geometry = new THREE.SphereGeometry(1,32,32);
    //     // make the star
       
    //     star = new THREE.Mesh(geometry, material)

    //     // give it a random x and y position between -500 and 500
    //     star.position.x = Math.floor((Math.random() *  window.innerWidth))-window.innerWidth/2;
    //     star.position.y =  Math.floor((Math.random() *  window.innerHeight))-window.innerHeight/2;

    //     star.position.z = zpos; 
    //     star.scale.x = star.scale.y = star.scale.z = Math.random() * 5 - 4;
    //     console.log(directionVector);

    //     scene.add(star); 

    //     stars.push(star); 
    // }


    for (var count =0; count < 150; count++){

        material = new THREE.MeshBasicMaterial( { 

            
        transparent: true, 
        combine: THREE.MixOperation, 
        blending: THREE.AdditiveBlending, 

        color: 0xffffff } );
      
        var geometry = new THREE.SphereGeometry(1,32,32);
             // make the star
        star = new THREE.Mesh(geometry, material);

        star.position.x = ship.position.x + Math.floor(Math.random() * (1000 - (-1000)) -1000); 
        star.position.y = ship.position.y + Math.floor(Math.random() * (1000 - (-1000)) -1000 ); 
        star.position.z = ship.position.z + Math.floor(Math.random() * (1000 - (-1000)) -1000 ); 
        star.scale.x = star.scale.y = star.scale.z = Math.random() * 5 - 4;

        scene.add(star);
        stars.push(star); 
    }
}

function World(){

    return {
        init: function() {
                var geometry = new THREE.SphereGeometry(1000, 200, 200);

                var material = new THREE.MeshBasicMaterial({
                    transparent: true
                });

                sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(0, 0, 0);
                scene.add(sphere);
        }
    }
}

function updateStars(){

    // iterate through every star

    for(var i=0; i<stars.length; i++) {
   
        star = stars[i]; 
        
        // and move it forward 

        // star.position.z +=  0.3;hip.positi
 
       if((star.position.x < -sphere.position.x - 1000 || star.position.x > sphere.position.x + 1000 ||star.position.y < sphere.position.y - 1000 || star.position.y > sphere.position.y + 1000 || star.position.z < sphere.position.z - 1000|| star.position.z > sphere.position.z + 1000) ){

             star.position.x = ship.position.x + Math.floor(Math.random() * (1000 - (-1000)) -1000); 
             star.position.y = ship.position.y + Math.floor(Math.random() * (1000 - (-1000)) -1000 ); 
             star.position.z = ship.position.z + Math.floor(Math.random() * (1000 - (-1000)) -1000 ); 


       }
    }

}