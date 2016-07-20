
var controls;
var movementVector = new THREE.Vector4(0,0,0,1);
var speedVector = new THREE.Vector4(0,0,0,1);
var moveForward;
var moveBackward;
var moveLeft;
var moveRight;
var moveUp;
var moveDown;
var zAxis = 0;
var xAxis = 0;
var yAxis = 0;



var mouseX = 0;
var mouseY = 0;
var target = new THREE.Vector3(0,0,0);


var lat = 0;
var lon = 0;
var phi = 0;
var theta = 0;



function Movement() {
    
    return {
        init:function() {



            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
            var blocker = document.getElementById('block');
            var instructions = document.getElementById('splash');

            if (havePointerLock) {

                var element = document.body;

                var pointerlockchange = function (event) {

                    if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

                        controlsEnabled = true;
                        blocker.style.display = 'none';
                        document.addEventListener('mousemove', moveCallback, false);
                        console.log("Added Event Listener");

                    } else {               

                        blocker.style.display = '-webkit-box';
                        blocker.style.display = '-moz-box';
                        blocker.style.display = 'box';
                        document.removeEventListener('mousemove', moveCallback, false);
                        console.log("Removed Event Listener");
                        instructions.style.display = '';

                    }

                };

                var pointerlockerror = function (event) {

                    instructions.style.display = '';

                };

                // Hook pointer lock state change events
                document.addEventListener('pointerlockchange', pointerlockchange, false);
                document.addEventListener('mozpointerlockchange', pointerlockchange, false);
                document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

                document.addEventListener('pointerlockerror', pointerlockerror, false);
                document.addEventListener('mozpointerlockerror', pointerlockerror, false);
                document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

                instructions.addEventListener('click', function (event) {

                    instructions.style.display = 'none';
                    blocker.style.display = 'none';

                    // Ask the browser to lock the pointer
                    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

                    if (/Firefox/i.test(navigator.userAgent)) {

                        var fullscreenchange = function (event) {

                            if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

                                document.removeEventListener('fullscreenchange', fullscreenchange);
                                document.removeEventListener('mozfullscreenchange', fullscreenchange);
                                document.removeEventListener('mousemove', moveCallback, false);



                                element.requestPointerLock();
                            }

                        };

                        document.addEventListener('fullscreenchange', fullscreenchange, false);
                        document.addEventListener('mozfullscreenchange', fullscreenchange, false);
                        document.addEventListener('mousemove', moveCallback, false);
                        console.log("Added Event Listener");

                        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                        element.requestFullscreen();

                    } else {

                        element.requestPointerLock();

                    }

                }, false);

            } else {

                instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

            }

            window.addEventListener('keydown', function (event) {
                switch(event.keyCode){
                    case 38:
                    case 87:
                        moveForward = true;
                        break;
                    case 40:
                    case 83:
                        moveBackward = true;
                        break;
                    case 65:
                    case 37:
                        moveLeft = true;
                        break;
                    case 68:
                    case 39:
                        moveRight = true;
                        break;
                    case 82:
                        moveUp = true;
                        break;
                    case 70:
                        moveDown = true;

                }



            });
            window.addEventListener('keyup', function (event) {
                switch(event.keyCode){
                    case 38:
                    case 87:
                        moveForward = false;
                        break;
                    case 40:
                    case 83:
                        moveBackward = false;
                        break;
                    case 65:
                    case 37:
                        moveLeft = false;
                        break;
                    case 68:
                    case 39:
                        moveRight = false;
                        break;
                    case 82:
                        moveUp = false;
                        break;
                    case 70:
                        moveDown = false;
                }



            });


        },
     


        move:function(delta) {

            if (moveForward == true && yAxis > -100) {
                yAxis--;
            }
            if (moveBackward == true && yAxis < 100) {
                yAxis++;
            }
            if (moveLeft == true && zAxis < 10) {
                zAxis++;
            }
            if (moveRight == true && zAxis > -10) {
                zAxis--;
            }
            if (moveUp == true && xAxis < 10) {
                xAxis--;
            }
            if (moveDown == true && xAxis > -10) {
                xAxis++;
            }
            if (xAxis > 0) {
                xAxis -= 0.5;
            } else if (xAxis < 0) {
                xAxis += 0.5;
            }
            if (zAxis > 0) {
                zAxis -= 0.5;
            } else if (zAxis < 0) {
                zAxis += 0.5;
            }
            ship.translateZ(yAxis);
            ship.translateY(-xAxis);
            ship.translateX(-zAxis);
            


            lon += mouseX;
            lat -= mouseY;
            mouseX = 0;
            mouseY = 0;
            lat = Math.max(-85, Math.min(85, lat));
            phi = THREE.Math.degToRad(90 - lat);
            theta = THREE.Math.degToRad(lon);

            var targetPosition = target;
            var position = ship.position;

            targetPosition.x = position.x + 100 * Math.sin(phi) * Math.cos(theta);
            targetPosition.y = position.y + 100 * Math.cos(phi);
            targetPosition.z = position.z + 100 * Math.sin(phi) * Math.sin(theta);
            ship.lookAt(targetPosition);
        },

        unlockPointer:function(){

            var element = document.body;
            if(document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                element.exitPointerLock = element.exitPointerLock || element.mozExitPointerLock || element.webkitExitPointerLock;
            }
        },

        lockPointer:function(){
            var element = document.body;
            if(document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element){
                element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            }
        }
    }
}

function moveCallback(event){
    mouseX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    mouseY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

}

