
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
var matr = new THREE.Matrix4();
var relativeCamPos = new THREE.Vector3(0,400,0);

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
                        controls.enabled = true;

                        blocker.style.display = 'none';
                        document.addEventListener("mousemove", this.mouseMove, false);

                    } else {

                        controls.enabled = false;

                        blocker.style.display = '-webkit-box';
                        blocker.style.display = '-moz-box';
                        blocker.style.display = 'box';
                        document.removeEventListener("mousemove", this.mouseMove, false);
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
                                document.removeEventListener("mousemove", this.mouseMove, false);

                                element.requestPointerLock();
                            }

                        };

                        document.addEventListener('fullscreenchange', fullscreenchange, false);
                        document.addEventListener('mozfullscreenchange', fullscreenchange, false);
                        document.addEventListener("mousemove", this.mouseMove, false);

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


        move:function(){

            if(moveForward == true && yAxis < 100){
                yAxis--;
            }
            if(moveBackward == true && yAxis > -100){
                yAxis++;
            }
            if(moveLeft == true && zAxis < 100){
                zAxis++;
            }
            if(moveRight == true && zAxis > -100){
                zAxis--;
            }
            if(moveUp == true && xAxis < 100){
                xAxis--;
            }
            if(moveDown == true && xAxis > -100){
                xAxis++;
            }

            /*matr.set(1,0,0,0,
                    0,1,0,0,
                    0,0,1,zAxis/100 * 5,
                    0,0,0,1);*/

            //ship.position.applyMatrix4(matr);
            ship.position.x += xAxis/20;
            ship.position.y += yAxis/20;
            ship.position.z += zAxis/20;



            //var desired = new THREE.Vector3()

           // var relativeCamPos = new THREE.Vector3(0,400,0);
           // var cameraOffset = relativeCamPos.applyMatrix4( ship.matrixWorld );
          //  camera.lookAt(new THREE.Vector3(0,0,0));
           // camera.position.x = cameraOffset.x;
           // camera.position.y = cameraOffset.y;
          //  camera.position.z = cameraOffset.z;

           // camera.rotation.x = ship.rotation.x;
           // camera.rotation.y = ship.rotation.y;
           // camera.rotation.z = ship.rotation.z;
           // camera.lookAt(ship.position);
            //console.log("x "+cameraOffset.x+" y "+ cameraOffset.y + " z "+ cameraOffset.z);




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

function mouseMove(e){
    var movementX = e.movementX ||
            e.mozMovementX          ||
            e.webkitMovementX       ||
            0,
        movementY = e.movementY ||
            e.mozMovementY      ||
            e.webkitMovementY   ||
            0;

}

