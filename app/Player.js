var ship, frontVector, backVector, directionVector;
var hitBoxCenter, hitBoxLeftWing, hitBoxRightWing;
var playerHitBoxes = [];
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

            var hitBoxCenterGeometry = new THREE.BoxGeometry(5,2,20);
            var hitBoxMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
            hitBoxCenter = new THREE.Mesh(hitBoxCenterGeometry, hitBoxMaterial);

            var hitBoxCenterGeometry = new THREE.BoxGeometry(10,2,5);
            hitBoxLeftWing = new THREE.Mesh(hitBoxCenterGeometry, hitBoxMaterial);
            hitBoxLeftWing.position.x = -5;

            var hitBoxCenterGeometry = new THREE.BoxGeometry(10,2,5);
            hitBoxRightWing = new THREE.Mesh(hitBoxCenterGeometry, hitBoxMaterial);
            hitBoxRightWing.position.x = 5;

            playerHitBoxes.push(hitBoxCenter);
            playerHitBoxes.push(hitBoxLeftWing);
            playerHitBoxes.push(hitBoxRightWing);

            // scene.add(hitBoxCenter);
            // scene.add(hitBoxLeftWing);
            // scene.add(hitBoxRightWing);
            ship.add(hitBoxLeftWing);
            ship.add(hitBoxRightWing);
            ship.add(hitBoxCenter);


        },
        updateParticleValues: function () {
            particleRay.reset();
            createRay();
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


            // particleRay.updateStartAndEndpoint(startVector, endVector);
            particleRay.update();
        },

        updatePlayerHitBoxes: function () {
            for (var i = 0; i < playerHitBoxes.length; i++) {

                // playerHitBoxes[i].position.x = ship.position.x;
                // playerHitBoxes[i].position.y = ship.position.y;
                // playerHitBoxes[i].position.z = ship.position.z;

                // var matrix = new THREE.Matrix4();
                // matrix.extractRotation(ship.matrix);

                // var upVector = new THREE.Vector3(0,1,0);
                // matrix.multiplyVector3(upVector);

                // playerHitBoxes[i].applyMatrix(ship.matrix);

                // playerHitBoxes[i].matrix = ship.matrix;

            }
        }

    };

};
