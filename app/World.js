var sphere = new THREE.Object3D();
var biggerSphere = new THREE.Object3D(); 
var stars = [];
var asteroids = []; 

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



//AsteroidStuff

function createAsteroids(){





  var  materialAst; 
  var astTexture, astOriginal; 
  
  astTexture = fileLoader.get("AsteroidComplete");
 

  for( countAst =0; countAst < 10; countAst++){

     astOriginal = new THREE.Mesh(astTexture, new THREE.MeshPhongMaterial({culling: THREE.DoubleSide}));
     astOriginal.position.x = ship.position.x + Math.floor(Math.random() * (1000 - (-1000)) -1000); 
     astOriginal.position.y = ship.position.y + Math.floor(Math.random() * (1000 - (-1000)) -1000 ); 
     astOriginal.position.z = ship.position.z + Math.floor(Math.random() * (1000 - (-1000)) -1000 ); 
     astOriginal.scale.x = astOriginal.scale.y = astOriginal.scale.z = Math.random() * 80 - 40;

     scene.add(astOriginal);
     asteroids.push(astOriginal); 

  }

 //    var ast1, ast2, ast3;
 //    var astGroup; 
 //    var randPositionX, randPositionY, randScale; 
 //    astGroup = new THREE.Object3D();

 //    for ( var zposA= -2000; zposA < 500; zposA+=100 ) {
 //         console.log("rendering asteroid");
 //        randScale =  50 ; 
 //        randPositionX = Math.floor((Math.random() * window.innerWidth)) -window.innerWidth /2 ;
 //        randPositionY = Math.floor((Math.random() * window.innerHeight)) - window.innerHeight/2;
 //        //part1
 //        loader.load("../res/models/AsteroidPart1.json", function(geometry) {

 //        ast1 = new THREE.Mesh (geometry, new THREE.MeshPhongMaterial());
 //        ast1.position.x = randPositionX;
 //        ast1.position.y = randPositionY;

 //        ast1.position.z = zposA; 
 //        ast1.scale.x = ast1.scale.y = ast1.scale.z = randScale;

 //       astGroup.add(ast1); 

 //        asteroids.push(ast1);
 //    });
        
 //        //part2
 //        loader.load("../res/models/AsteroidPart2.json", function(geometry) {

 //        ast2 = new THREE.Mesh (geometry, new THREE.MeshPhongMaterial());
 //        ast2.position.x = randPositionX;
 //        ast2.position.y = randPositionY;
 //        ast2.position.z = zposA;
 //        ast2.scale.x = ast2.scale.y = ast2.scale.z = randScale;
 //        astGroup.add(ast2); 

 //        asteroids.push(ast2);
 //    });

      
 //        //part3
 //        loader.load("../res/models/AsteroidPart3.json", function(geometry) {

 //        ast3 = new THREE.Mesh (geometry, new THREE.MeshPhongMaterial());
 //        ast3.position.x = randPositionX;
 //        ast3.position.y = randPositionY;
 //        ast3.position.z = zposA;
 //        ast3.scale.x = ast3.scale.y = ast3.scale.z = randScale;

 //        astGroup.add(ast3); 

 //        asteroids.push(ast3); 

 //    });

       

 //    scene.add(astGroup); 

        

 //    }

   
}

function updateAsteroids(){

  var tmpAsteroid, rotSpeed; 
  rotSpeed = 0.01; 
  var rndSpeedX, rndSpeedY, rndSpeedZ; 

  for(countAst = 0; countAst < asteroids.length; countAst++){

    tmpAsteroid = asteroids[countAst]; 

    tmpAsteroid.rotation.x -= rotSpeed * 2;
    tmpAsteroid.rotation.y -= rotSpeed;
    tmpAsteroid.rotation.z -= rotSpeed * 3;

    tmpAsteroid.position.x += 2; 
    tmpAsteroid.position.y += 1; 
    tmpAsteroid.position.z += 0; 

    if((tmpAsteroid.position.x < biggerSphere.position.x - 2000 || tmpAsteroid.position.x > biggerSphere.position.x + 2000 ||tmpAsteroid.position.y < biggerSphere.position.y - 2000 || tmpAsteroid.position.y > biggerSphere.position.y + 2000 || tmpAsteroid.position.z < biggerSphere.position.z - 2000|| tmpAsteroid.position.z > biggerSphere.position.z + 2000) ){

             tmpAsteroid.position.x = ship.position.x + Math.floor(Math.random() * (2000 - (-2000)) -2000); 
             tmpAsteroid.position.y = ship.position.y + Math.floor(Math.random() * (2000 - (-2000)) -2000 ); 
             tmpAsteroid.position.z = ship.position.x + Math.floor(Math.random() * (2000 - (-2000)) -2000); 

       }

  }


}

function World(){

    return {
        init: function() {
                var geometry = new THREE.SphereGeometry(100, 200, 200);
                var biggerGeometry = new THREE.SphereGeometry (5000, 200,200); 
                var material = new THREE.MeshBasicMaterial({
                    transparent: true
                });

                sphere = new THREE.Mesh(geometry, material);
                biggerSphere = new THREE.Mesh(biggerGeometry, material);
                biggerSphere.position.set(0,0,0); 
                sphere.position.set(0, 0, 0);
                scene.add(sphere);
                scene.add(biggerSphere); 
        }
    }
}

function updateStars(){

    // iterate through every star

    for(var i=0; i<stars.length; i++) {
   
        star = stars[i]; 
        
        // and move it forward 

        // star.position.z +=  0.3;hip.positi
 
       if((star.position.x < sphere.position.x - 1000 || star.position.x > sphere.position.x + 1000 ||star.position.y < sphere.position.y - 1000 || star.position.y > sphere.position.y + 1000 || star.position.z < sphere.position.z - 1000|| star.position.z > sphere.position.z + 1000) ){

             star.position.x = ship.position.x + Math.floor(Math.random() * (1000 - (-1000)) -1000); 
             star.position.y = ship.position.y + Math.floor(Math.random() * (1000 - (-1000)) -1000 ); 
             star.position.z = ship.position.z + Math.floor(Math.random() * (1000 - (-1000)) -1000 ); 


       }
    }

}