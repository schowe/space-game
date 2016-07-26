var sphere = new THREE.Object3D();
var biggerSphere = new THREE.Object3D();
var stars = [];

var asteroids = [];
var asteroidSpeedVecs = [];
var asteroidRotVecs = [];
var asteroidHitBoxes = [];
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

    // var vecSpeed = new THREE.Vector3 (0 ,-1, 1);
    // var vecRot = new THREE.Vector3 (0, 0, 0);
    // asteroidSpeedVecs.push(vecSpeed);
    // asteroidRotVecs.push(vecRot);
    // astOriginal = new THREE.Mesh(astTexture, new THREE.MeshPhongMaterial({culling: THREE.DoubleSide}));
    // astOriginal.position.x = -400;
    // astOriginal.position.y = 200;
    // astOriginal.position.z = -200;
    // astOriginal.scale.x = astOriginal.scale.y = astOriginal.scale.z = 10;
    // hitGeometry =  new THREE.SphereGeometry(66.18, 32, 32);

    // var colSphereMaterial = new THREE.MeshBasicMaterial({
    //                 transparent: true,
    //                 opacity: 0.5,
    //                  color: 0xffffff
    //             });
    //             astHitBox = new THREE.Mesh(hitGeometry, colSphereMaterial);
    //             astHitBox.position.set(astOriginal.position.x,astOriginal.position.y,astOriginal.position.z);
    //             astHitBox.scale.x = astHitBox.scale.y = astHitBox.scale.z = 1;
    //           //astHitBox.geometry.applyMatrix(astOriginal.matrix);
    //  asteroids.push(astOriginal);
    //  asteroidHitBoxes.push(astHitBox);
    //  scene.add(astOriginal);
    //  scene.add(astHitBox);


    // var vecSpeed2 = new THREE.Vector3 (0 ,-1, -1);
    // var vecRot2 = new THREE.Vector3 (0, 0, 0);
    // asteroidSpeedVecs.push(vecSpeed2);
    // asteroidRotVecs.push(vecRot2);
    // astOriginal2 = new THREE.Mesh(astTexture, new THREE.MeshPhongMaterial({culling: THREE.DoubleSide}));
    // astOriginal2.position.x = -400;
    // astOriginal2.position.y = 200;
    // astOriginal2.position.z = 200;
    // astOriginal2.scale.x = astOriginal2.scale.y = astOriginal2.scale.z = 10;
    // hitGeometry =  new THREE.SphereGeometry(66.18, 32, 32);

    // var colSphereMaterial2 = new THREE.MeshBasicMaterial({
    //                 transparent: true,
    //                 opacity: 0.5,
    //                  color: 0xffffff
    //             });
    //             astHitBox2 = new THREE.Mesh(hitGeometry, colSphereMaterial2);
    //             astHitBox2.position.set(astOriginal2.position.x,astOriginal2.position.y,astOriginal2.position.z);
    //             astHitBox2.scale.x = astHitBox2.scale.y = astHitBox2.scale.z = 1;
    //           //astHitBox.geometry.applyMatrix(astOriginal.matrix);
    //  asteroids.push(astOriginal2);
    //  asteroidHitBoxes.push(astHitBox2);
    //  scene.add(astOriginal2);
    //  scene.add(astHitBox2);


    // var vecSpeed3 = new THREE.Vector3 (0 ,0, -3);
    // var vecRot3 = new THREE.Vector3 (0, 0, 0);
    // asteroidSpeedVecs.push(vecSpeed3);
    // asteroidRotVecs.push(vecRot3);
    // astOriginal3 = new THREE.Mesh(astTexture, new THREE.MeshPhongMaterial({culling: THREE.DoubleSide}));
    // astOriginal3.position.x = -400;
    // astOriginal3.position.y = 0;
    // astOriginal3.position.z = 400;
    // astOriginal3.scale.x = astOriginal3.scale.y = astOriginal3.scale.z = 10;
    // hitGeometry =  new THREE.SphereGeometry(66.18, 32, 32);

    // var colSphereMaterial3 = new THREE.MeshBasicMaterial({
    //                 transparent: true,
    //                 opacity: 0.5,
    //                  color: 0xffffff
    //             });
    //             astHitBox3 = new THREE.Mesh(hitGeometry, colSphereMaterial3);
    //             astHitBox3.position.set(astOriginal3.position.x,astOriginal3.position.y,astOriginal3.position.z);
    //             astHitBox3.scale.x = astHitBox3.scale.y = astHitBox3.scale.z = 1;
    //           //astHitBox.geometry.applyMatrix(astOriginal.matrix);
    //  asteroids.push(astOriginal3);
    //  asteroidHitBoxes.push(astHitBox3);
    //  scene.add(astOriginal3);
    //  scene.add(astHitBox3);


  for( countAst = 0; countAst < 100; countAst++){

     rndSpeedX = Math.random()* 20 - 14;
     rndSpeedY = Math.random()* 20 - 14;
     rndSpeedZ = Math.random()* 20 - 14;
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
              //astHitBox.geometry.applyMatrix(astOriginal.matrix);



     asteroids.push(astOriginal);
     asteroidHitBoxes.push(astHitBox);
     scene.add(astOriginal);
  }


}


//Update asteroid-position and their hitboxes with randomized speed and rotation;
function updateAsteroids(){

  var tmpAsteroid, newVec, rndAngle2;
  var tmpHitBox;

  for(countAst = 0; countAst < asteroids.length ; countAst++){

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
function asteroidCollision(ast1Index, ast2Index){

    console.log("asteroidCollision");

    var ast1 = asteroids[ast1Index];
    var ast2 = asteroids[ast2Index];
    var ast1Dir = asteroidSpeedVecs[ast1Index];
    var ast2Dir = asteroidSpeedVecs[ast2Index];

    var axis = ast2.position.clone();
    axis.sub(ast1.position);

    var negAxis = ast1.position.clone();
    negAxis.sub(ast2.position);

    axis.normalize();
    negAxis.normalize();

    ast1Dir = ast1Dir.sub(axis.multiplyScalar(2*ast1Dir.dot(axis)));
    ast2Dir = ast2Dir.sub(negAxis.multiplyScalar(2*ast2Dir.dot(negAxis)));

    asteroidSpeedVecs[ast1Index] = ast1Dir;
    asteroidSpeedVecs[ast2Index] = ast2Dir;

    asteroidHitBoxes[ast1Index].material = new THREE.MeshBasicMaterial({color:0XFF0000});
    asteroidHitBoxes[ast2Index].material = new THREE.MeshBasicMaterial({color:0XFF0000});

}

function reflect(thisAst, otherAst) {
    // Reflektiert Asteroiden this und other
    var factor;

    // "Normale" der Reflektion (zeigt von this nach other -> "Normale fuer this")
    var axis = MATH.clone(otherAst.position);
    axis.sub(thisAst.position);
    axis.normalize();

    var negAxis = MATH.negated(axis);

    // Reflektion fuer Asteroid a
    var axisA = MATH.clone(axis);
    factor = 2 * Math.dot(axisA,thisAst.direction);
    thisAst.direction.negate();
    thisAst.direction.add(axis.multiplyScalar(factor));

    // Reflektion fuer Asteroid b
    var axisB = MATH.clone(negAxis);
    factor = 2 * Math.dot(axisB,other.direction);
    other.direction.negate();
    other.direction.add(negAxis.multiplyScalar(factor));
}


//Function to trigger if Asteroid get destroyed
function destroyAsteroid(asteroidNumber){

   var newRandomPosAstX = Math.floor(Math.random() * (biggerSphereRadius - (-biggerSphereRadius)) -biggerSphereRadius);
   var newRandomPosAstY = Math.floor(Math.random() * (biggerSphereRadius - (-biggerSphereRadius)) -biggerSphereRadius);
   var newRandomPosAstZ = Math.floor(Math.random() * (biggerSphereRadius - (-biggerSphereRadius)) -biggerSphereRadius);
   var newScale = Math.random() * 70 - 40;

    asteroids[asteroidNumber].position.x = ship.position.x + newRandomPosAstX;
    asteroids[asteroidNumber].position.y = ship.position.y + newRandomPosAstY;
    asteroids[asteroidNumber].position.z = ship.position.z + newRandomPosAstZ;

    asteroidHitBoxes[asteroidNumber].position.x = ship.position.x + newRandomPosAstX;
    asteroidHitBoxes[asteroidNumber].position.y = ship.position.y + newRandomPosAstY;
    asteroidHitBoxes[asteroidNumber].position.z = ship.position.z + newRandomPosAstZ;

    asteroids[asteroidNumber].scale.x = asteroids[asteroidNumber].scale.y = asteroids[asteroidNumber].scale.z = newScale;
    asteroidHitBoxes[asteroidNumber].scale.x = asteroidHitBoxes[asteroidNumber].scale.y = asteroidHitBoxes[asteroidNumber].scale.z = newScale;

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
        }
    }
}

//Update stars- check if they are inside Sphere. Else randomize Position
function updateStars(){

    // iterate through every star

    for(var i=0; i<stars.length; i++) {


        star = stars[i];
        star.scale.x = star.scale.y = star.scale.z = Math.random() * 2 -0;
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
