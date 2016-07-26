var ship, frontVector, backVector, directionVector;
var cross;
frontVector = new THREE.Vector3(0, 0, 0);

backVector = new THREE.Vector3(0, 0, 0);
directionVector = new THREE.Vector3(0, 0, 0);

function Player() {


    var startVector = new THREE.Vector3(0, 0, 0);
    var endVector = new THREE.Vector3(0, 0, 0);
    var particleRay;


    function createRay() {
        particleRay = new RayParticleRenderer(0x2255ff, 100, fileLoader.get("particle"), startVector, endVector);
    }
    createRay();

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
        updateParticleValues: function () {
            particleRay.reset();
            createRay();

            if (moveLeft) {
                  
            } else if (moveRight) {
                
            }


            var pos = ship.position;
            var dirVector = new THREE.Vector3(0, 0, 1);
            dirVector.applyQuaternion(ship.quaternion);

            var relativeSpeed = (-yAxis-2)/maxVel;
            var startScale = 6-relativeSpeed*12;
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

            
            particleRay.update();
        }
    };

};








