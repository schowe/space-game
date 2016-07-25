var sphere = new THREE.Object3D();
var biggerSphere = new THREE.Object3D(); 
var stars = [];
var asteroids = []; 
var asteroidSpeedVecs = []; 
var asteroidRotVecs = []; 
var asteroidHitBoxes =[]; 
var smallSphereRadius = 1000; 
var biggerSphereRadius = 5000; 


//starStuff 
function createStars(){

    var star, material, alpha; 


    for (var count =0; count < 150; count++){

        material = new THREE.MeshBasicMaterial( { 

            
        transparent: true, 
        combine: THREE.MixOperation, 
        blending: THREE.AdditiveBlending, 

        color: 0xffffff } );
      
        var sphereGeometry = new THREE.SphereGeometry(1,32,32);
             // make the star
        star = new THREE.Mesh(sphereGeometry, material);

        star.position.x = ship.position.x + Math.floor(Math.random() * (smallSphereRadius - (-smallSphereRadius)) -smallSphereRadius); 
        star.position.y = ship.position.y + Math.floor(Math.random() * (smallSphereRadius - (-smallSphereRadius)) -smallSphereRadius ); 
        star.position.z = ship.position.z + Math.floor(Math.random() * (smallSphereRadius - (-smallSphereRadius)) -smallSphereRadius ); 
        star.scale.x = star.scale.y = star.scale.z = Math.random() * 3 - 2;

        scene.add(star);
        stars.push(star); 
    }
}



//AsteroidStuff

function createAsteroids(){




 var rndSpeedX, rndSpeedY, rndSpeedZ, rotSpeed, rndScale; 
 var  materialAst, astHitBox, hitGeometry; 
 var astTexture, astOriginal; 
  
  astTexture = fileLoader.get("Asteroid V2");

  
  for( countAst =0; countAst < 10; countAst++){

     rndSpeedX = Math.random() * 20 - 16; 
     rndSpeedY = Math.random() * 20 - 16; 
     rndSpeedZ = Math.random() * 20 - 16; 
     rotSpeed = Math.random () * 0.05 - 0.01;
     rndScale = Math.random() * 70 - 40; 

     var vecSpeed = new THREE.Vector3 (rndSpeedX ,rndSpeedY, rndSpeedZ); 
     var vecRot = new THREE.Vector3 (rotSpeed *(Math.random () * (2-0) - 0), rotSpeed * (Math.random() * (2 - 0) - 0 ), rotSpeed * (Math.random() *2 -0)); 
     asteroidSpeedVecs.push(vecSpeed); 
     asteroidRotVecs.push(vecRot); 
    
     astOriginal = new THREE.Mesh(astTexture, new THREE.MeshPhongMaterial({culling: THREE.DoubleSide}));

     astOriginal.position.x = ship.position.x + Math.floor(Math.random() * (biggerSphereRadius - (-biggerSphereRadius)) -biggerSphereRadius); 
     astOriginal.position.y = ship.position.y + Math.floor(Math.random() * (biggerSphereRadius - (-biggerSphereRadius)) -biggerSphereRadius ); 
     astOriginal.position.z = ship.position.z + Math.floor(Math.random() * (biggerSphereRadius - (-biggerSphereRadius)) -biggerSphereRadius ); 
     astOriginal.scale.x = astOriginal.scale.y = astOriginal.scale.z = rndScale;

     hitGeometry =  new THREE.SphereGeometry(6.618, 32, 32);

      var colSphereMaterial = new THREE.MeshBasicMaterial({
                    transparent: true,
                    opacity: 0.5,
                     color: 0xffffff
                });

                astHitBox = new THREE.Mesh(hitGeometry, colSphereMaterial);
                astHitBox.position.set(astOriginal.position.x,astOriginal.position.y,astOriginal.position.z); 
                astHitBox.scale.x = astHitBox.scale.y = astHitBox.scale.z = rndScale;
              //  astHitBox.geometry.applyMatrix(astOriginal.matrix);



     asteroids.push(astOriginal); 
     asteroidHitBoxes.push(astHitBox);
     scene.add(astOriginal);
     //scene.add(astHitBox); 
   
    

  }


   
}


//Update asteroid-position and their hitboxes with randomized speed and rotation; 
function updateAsteroids(){

  var tmpAsteroid, newVec, rndAngle2;
  var tmpHitBox; 

  for(countAst = 0; countAst < asteroids.length; countAst++){

      tmpAsteroid = asteroids[countAst]; 
      tmpHitBox = asteroidHitBoxes[countAst]; 
      //Update RotationValue
      tmpAsteroid.rotation.x += asteroidRotVecs [countAst].x;
      tmpAsteroid.rotation.y -= asteroidRotVecs [countAst].y;
      tmpAsteroid.rotation.z -=  asteroidRotVecs [countAst].z;

      //Update SpeedValue
      tmpAsteroid.position.x += asteroidSpeedVecs[countAst].x; 
      tmpAsteroid.position.y += asteroidSpeedVecs[countAst].y; 
      tmpAsteroid.position.z += asteroidSpeedVecs[countAst].z; 


      //Update SpeedValue Hitbox
      tmpHitBox.position.x += asteroidSpeedVecs[countAst].x; 
      tmpHitBox.position.y += asteroidSpeedVecs[countAst].y; 
      tmpHitBox.position.z += asteroidSpeedVecs[countAst].z; 

    if((tmpAsteroid.position.x < biggerSphere.position.x - biggerSphereRadius || tmpAsteroid.position.x > biggerSphere.position.x + biggerSphereRadius ||tmpAsteroid.position.y < biggerSphere.position.y - biggerSphereRadius || tmpAsteroid.position.y > biggerSphere.position.y + biggerSphereRadius || tmpAsteroid.position.z < biggerSphere.position.z - biggerSphereRadius|| tmpAsteroid.position.z > biggerSphere.position.z + biggerSphereRadius) ){

            newVec = new THREE.Vector3(Math.random(), Math.random(), Math.random()); 
            newVec.normalize(); 
            
            //console.log("new VEC : " + newVec.x + " " + newVec.y + " " + newVec.z ); 
            tmpAsteroid.position.x = ship.position.x + biggerSphereRadius * newVec.x; 
            tmpAsteroid.position.y = ship.position.y + biggerSphereRadius * newVec.y;
            tmpAsteroid.position.z = ship.position.z + biggerSphereRadius * newVec.z;
            
            tmpHitBox.position.x = ship.position.x + biggerSphereRadius * newVec.x; 
            tmpHitBox.position.y = ship.position.y + biggerSphereRadius * newVec.y;
            tmpHitBox.position.z = ship.position.z + biggerSphereRadius * newVec.z;

        

       }

  }


}


//Function to trigger if asteroids collide
function collideAsteroids(ast1, ast2){


    ast1.position.x = getMeshDirection(ast1).x* -1; 
    ast1.position.y = getMeshDirection(ast1).y* -1; 
    ast1.position.z = getMeshDirection(ast1).z* -1; 

    ast2.position.x = getMeshDirection(ast2).x* -1; 
    ast2.position.y = getMeshDirection(ast2).y* -1; 
    ast2.position.z = getMeshDirection(ast2).z* -1; 

}


//Function to trigger if Asteroid get destroyed
function destroyAsteroid(asteroid){


    asteroid.position.x = ship.position.x + Math.floor(Math.random() * (biggerSphereRadius - (-biggerSphereRadius)) -biggerSphereRadius); 
    asteroid.position.y = ship.position.y + Math.floor(Math.random() * (biggerSphereRadius - (-biggerSphereRadius)) -biggerSphereRadius ); 
    asteroid.position.z = ship.position.z + Math.floor(Math.random() * (biggerSphereRadius - (-biggerSphereRadius)) -biggerSphereRadius ); 



}


//Function to create the Spheres around the player
function World(){

    return {
        init: function() {
                var geometry = new THREE.SphereGeometry(smallSphereRadius, 200, 200);
                var biggerGeometry = new THREE.SphereGeometry (biggerSphereRadius, 200,200); 
                var material = new THREE.MeshBasicMaterial({
                    transparent: true
                    
                });

                sphere = new THREE.Mesh(geometry, material);
                biggerSphere = new THREE.Mesh(biggerGeometry, material);
                biggerSphere.position.set(0,0,0); 
                sphere.position.set(0, 0, 0);
                //scene.add(sphere);
                //scene.add(biggerSphere); 
        }
    }
}

//Update stars- check if they are inside Sphere. Else randomize Position
function updateStars(){

    // iterate through every star

    for(var i=0; i<stars.length; i++) {
   
        star = stars[i]; 
        //star.scale.x = star.scale.y = star.scale.z = Math.random() * 3 - 2;
        // and move it forward 

        // star.position.z +=  0.3;hip.positi
 
       if((star.position.x < sphere.position.x - smallSphereRadius || star.position.x > sphere.position.x + smallSphereRadius ||star.position.y < sphere.position.y - smallSphereRadius || star.position.y > sphere.position.y + smallSphereRadius || star.position.z < sphere.position.z - smallSphereRadius|| star.position.z > sphere.position.z + smallSphereRadius) ){

             star.position.x = ship.position.x + Math.floor(Math.random() * (smallSphereRadius - (-smallSphereRadius)) -smallSphereRadius); 
             star.position.y = ship.position.y + Math.floor(Math.random() * (smallSphereRadius - (-smallSphereRadius)) -smallSphereRadius ); 
             star.position.z = ship.position.z + Math.floor(Math.random() * (smallSphereRadius - (-smallSphereRadius)) -smallSphereRadius ); 


       }
    }

}


//function to get the directionVector of a Mesh
function getMeshDirection (mesh){


  //Default Front-Facing
  var dir = new THREE.Vector3(0,0,1); 
  //Apply rotation of Mesh
  dir.applyQuaternion (mesh.quaternion); 

  return dir; 


}