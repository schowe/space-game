var ship, frontVector, backVector, directionVector;
var hitBoxCenter, hitBoxLeftWing, hitBoxRightWing;
var playerHitBoxes = [];

var cross;



frontVector = new THREE.Vector3(0, 0, 0);

backVector = new THREE.Vector3(0, 0, 0);
directionVector = new THREE.Vector3(0, 0, 0);


var shield, shieldGeometry, shieldTex, shieldMaterial, rotClock;


function Player() {

    var startVector = new THREE.Vector3(0, 0, 0);
    var endVector = new THREE.Vector3(0, 0, 0);
    var particleRay;


    function createRay() {
        particleRay = new RayParticleRenderer(0x2255ff, 100, fileLoader.get("particle"), startVector, endVector);
    }
    createRay();

    // TODO: auslagern in Mathe-Klasse
    function getOrthognalVector(vector1, vector2) {
        var v1 = vector1.clone();
        var v2 = vector2.clone();
        return new THREE.Vector3().crossVectors(v1, v2);
    }

    return {

        playerHitByAsteroid: function (indexAsteroid, collisionSide) {

            var rotCount = 0;

            switch (collisionSide) {

                //CenterBox
                case 0:
                    console.log("CenterWing");
                    if (yAxis < 0 && yAxis >= -6) {

                        changeHP(-10);

                    } else if (yAxis < -6) {

                        //Schleudere nach hinten
                        var interval = setInterval(function () {

                            lat -= 20;
                            yAxis = 5;
                            setSpeed(yAxis);
                            rotCount += 1;
                            if (rotCount > 10) {

                                clearInterval(interval);
                            }


                        }, 200);

                        changeHP(-10);

                    }

                    break;

                //LeftWing
                case 1:
                    console.log("LinkerWing");
                    if (yAxis < 0 && yAxis >= -6) {

                        changeHP(-10);



                    } else if (yAxis < -6 && yAxis >= -14) {
                        var oldRotX = 0;
                        oldRotX = ship.rotation.x;



                        var interval = setInterval(function () {

                            lon += 20;
                            yAxis = -1;
                            setSpeed(yAxis);
                            rotCount += 1;
                            if (rotCount > 10) {

                                clearInterval(interval);
                            }


                        }, 200);

                        changeHP(-10);

                    }
                    break;

                //rightWing
                case 2:
                    console.log("RechterWing");
                    if (yAxis < 0 && yAxis >= -6) {

                        changeHP(-10);

                    } else if (yAxis < -6 && yAxis >= -14) {
                        var oldRotX = 0;
                        oldRotX = ship.rotation.x;



                        var interval = setInterval(function () {

                            lon -= 20;
                            yAxis = -1;
                            setSpeed(yAxis);
                            rotCount += 1;
                            if (rotCount > 10) {

                                clearInterval(interval);
                            }


                        }, 200);

                        changeHP(-10);

                    }

                    break;

            }

        },

        init: function () {

            var geometry = fileLoader.get("HeroShipV5");
            var texture = fileLoader.get("TextureHero");

            ship = new THREE.Mesh(
                geometry,
                new THREE.MeshPhongMaterial({ map: texture })
            );

            ship.position.set(0, 0, 0);
            scene.add(ship);

            var hitBoxCenterGeometry = new THREE.BoxGeometry(5, 2, 20);
            var hitBoxMaterial = new THREE.MeshBasicMaterial({ transparent:true, color: 0xffff00 });
            hitBoxCenter = new THREE.Mesh(hitBoxCenterGeometry, hitBoxMaterial);

            var hitBoxWingGeometry = new THREE.BoxGeometry(10, 2, 5);
            hitBoxLeftWing = new THREE.Mesh(hitBoxWingGeometry, hitBoxMaterial);
            hitBoxLeftWing.position.x = -5;

            hitBoxRightWing = new THREE.Mesh(hitBoxWingGeometry, hitBoxMaterial);
            hitBoxRightWing.position.x = 5;

            playerHitBoxes.push(hitBoxCenter);
            playerHitBoxes.push(hitBoxLeftWing);
            playerHitBoxes.push(hitBoxRightWing);
        },

        updateParticleValues: function () {
            particleRay.reset();

            // Schiffsposition und Richtingsvektor bestimmen
            var pos = ship.position;
            var dirVector = new THREE.Vector3(0, 0, 1);
            dirVector.applyQuaternion(ship.quaternion);

            // Seitenvektoren bestimmen
            var matrix = new THREE.Matrix4();
            matrix.extractRotation(ship.matrix);
            var upVector = new THREE.Vector3(0, 1, 0);
            upVector.applyMatrix4(matrix);
            var leftVector = getOrthognalVector(dirVector, upVector);
            var rightVector = leftVector.clone().multiplyScalar(-1);

            // Relative Geschwindigkeit des Schiffes
            var relativeSpeed = (-yAxis - 2) / maxVel;

            var startScale = 6 - relativeSpeed * 3;
            // Vector berechnen, auf dem sich der Partikelstrahl bewegen soll
            startVector = new THREE.Vector3(
                pos.x + startScale * dirVector.x,
                pos.y + startScale * dirVector.y,
                pos.z + startScale * dirVector.z
            );
            var endScale = 12;
            endVector = new THREE.Vector3(
                pos.x + endScale * dirVector.x,
                pos.y + endScale * dirVector.y,
                pos.z + endScale * dirVector.z
            );

            // Bewegung zur Seite anpassen
            if (moveLeft) {
                startVector.addScaledVector(leftVector, 2);
            } else if (moveRight) {
                startVector.addScaledVector(rightVector, 2);
            }

            // Partikel updaten
            createRay();
            particleRay.update();
        },


        activateShield: function () {

            if (shield !== undefined) {
                scene.remove(shield);
                shield = undefined;
            }

            shieldGeometry = fileLoader.get("Kugelschild");
            shieldTex = fileLoader.get("KugelschildTex");

            shield = new THREE.Mesh(shieldGeometry, new THREE.MeshPhongMaterial({ map: shieldTex, transparent: true, opacity: 0.4 }));
            shield.scale.x = shield.scale.y = shield.scale.z = 0.01;
            shield.position.set(ship.position.x, ship.position.y, ship.position.z);
            scene.add(shield);

            var scalingShield = 0.01
            var interval = setInterval(function () {

                            shield.scale.x = shield.scale.y = shield.scale.z = scalingShield;
                            scalingShield += 0.01;
                            if (scalingShield > 1) {

                                clearInterval(interval);
                            }


                        }, 20);

        },

    };

};
