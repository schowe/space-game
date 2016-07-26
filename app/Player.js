var ship, frontVector, backVector, directionVector;
var cross;
frontVector = new THREE.Vector3(0, 0, 0);
backVector = new THREE.Vector3(0, 0, 0);
directionVector = new THREE.Vector3(0, 0, 0);

function Player() {


    var startVector = new THREE.Vector3(0, 0, 0);
    var endVector = new THREE.Vector3(100, 0, 0);
    var particleRay= new RayParticleRenderer(
        0x2255ff, 1000, "../res/textures/particle.png", startVector, endVector
    );


    return {
        init: function () {
            var geometry = fileLoader.get("HeroShipV5");
            var texture = fileLoader.get("TextureHero");
            
            ship = new THREE.Mesh(
                geometry,
                new THREE.MeshPhongMaterial({map: texture})
            );

            ship.position.set(0, 0, 0);
            scene.add(ship);

            var mapA = fileLoader.get("Crosshair");
            var materialA = new THREE.SpriteMaterial({map: mapA});

            cross = new THREE.Sprite(materialA);
            cross.position.set(0, 0, -20);
            cross.scale.set(3.0, 3.0, 1.0);
            ship.add(cross);
        },
        update: function() {
            particleRay.reset();
            particleRay = new RayParticleRenderer(
              0x2255ff, 1000, "../res/textures/particle.png", startVector, endVector
             );
            
            var pos = ship.position;

            //Default Front-Facing
            var dirVector = new THREE.Vector3(0, 0, 1);
            //Apply rotation of Mesh
            dirVector.applyQuaternion(ship.quaternion);

            var startScale = 8;
            startVector = new THREE.Vector3(
                pos.x + startScale * dirVector.x,
                pos.y + startScale * dirVector.y,
                pos.z + startScale * dirVector.z
            );
            var endScale = 10;
            endVector = new THREE.Vector3(
                pos.x + endScale * dirVector.x,
                pos.y + endScale * dirVector.y,
                pos.z + endScale * dirVector.z
            );

<<<<<<< HEAD
            //particleRay.updateStartAndEndpoint(startVector, endVector);
=======
            particleRay.updateStartAndEndpoint(startVector, endVector);
>>>>>>> 57e6c0349e3f175e7096771d7556086741beb8f6
            particleRay.update();
        }
    }

};








