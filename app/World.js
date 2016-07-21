var sphere = new THREE.Object3D();

var stars = [];

//starStuff 
function createStars(){

    var star, material; 

    for ( var zpos= -2000; zpos < 0; zpos+=10 ) {

        // Material of stars
        material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
        var geometry = new THREE.SphereGeometry(1,32,32);
        // make the star
       
        star = new THREE.Mesh(geometry, material)

        // give it a random x and y position between -500 and 500
        star.position.x = Math.floor((Math.random() *  window.innerWidth))-window.innerWidth/2;
        star.position.y =  Math.floor((Math.random() *  window.innerHeight))-window.innerHeight/2;

        star.position.z = zpos; 
        star.scale.x = star.scale.y = star.scale.z = Math.random() * 5 - 4;
        console.log(directionVector);

        scene.add(star); 

        stars.push(star); 
    }

}

function updateStars(){

// iterate through every star
    for(var i=0; i<stars.length; i++) {
   
        star = stars[i]; 
 
        // and move it forward 
        star.position.z +=  0.3;
 
        // if the star is too close move it to the back
        if(star.position.z>camera.position.z) star.position.z-=2000; 
    }

}

function World(){

    return {
        init: function() {
            var textureLoader = new THREE.TextureLoader();
            textureLoader.setCrossOrigin('anonymous');
            textureLoader.load('../res/textures/tex.jpg', function (texture) {
                var geometry = new THREE.SphereGeometry(1000, 200, 200);

                var material = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                });

                sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(0, 0, 0);
                scene.add(sphere);
            });
        }
}
}

