var ship, frontVector, backVector, directionVector; 

frontVector = new THREE.Vector3 (0,0,0); 
backVector = new THREE.Vector3 (0,0,0); 
directionVector = new THREE.Vector3 (0,0,0); 

function Player() {

    return {
        init: function() {
            var material = new THREE.MeshBasicMaterial();
            ship = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100), material );
            ship.position.set( 0, 0, 0 );   
            calculateDirection(ship);          
            scene.add( ship );

        }    
    }
    
};

function calculateDirection (box){

   
    frontVector.x = minX(ship); 
    frontVector.y = maxY (ship);      
    frontVector.z = minZ(ship);

    backVector.x = minX(ship); 
    backVector.y = maxY (ship);      
    backVector.z = maxZ(ship);

    directionVector = frontVector.sub(backVector); 
    directionVector.normalize(); 
    console.log(directionVector); 

}

// Calculates the min x value of the vertices of a box
function minX(box) {
    // array for x values
    var globalXs = [];
    // get the position of each vertex
    for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
        {
            // get the local position of the vertex
            var localVertex = box.geometry.vertices[vertexIndex].clone();
            // transform it into the global position
            var globalVertex = localVertex.applyMatrix4( box.matrix );
            // save x value
            globalXs.push(globalVertex.x);
        }
    // return the min
    return Math.min.apply(Math, globalXs);
}

// Calculates the max X value of the vertices of a box
function maxX(box) {
    var globalXs = [];
    for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
        {
            var localVertex = box.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4( box.matrix );
            globalXs.push(globalVertex.x);
        }
    return Math.max.apply(Math, globalXs);
}

// Calculates the min Y value of the vertices of a box
function minY(box) {
    var globalYs = [];
    for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
        {
            var localVertex = box.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4( box.matrix );
            globalYs.push(globalVertex.y);
        }
    return Math.min.apply(Math, globalYs);
}

// Calculates the max Y value of the vertices of a box
function maxY(box) {
    var globalYs = [];
    for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
        {
            var localVertex = box.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4( box.matrix );
            globalYs.push(globalVertex.y);
        }
    return Math.max.apply(Math, globalYs);
}

// Calculates the min Z value of the vertices of a box
function minZ(box) {
    var globalZs = [];
    for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
        {
            var localVertex = box.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4( box.matrix );
            globalZs.push(globalVertex.z);
        }
    return Math.min.apply(Math, globalZs);
}

// Calculates the max Z value of the vertices of a box
function maxZ(box) {
    var globalZs = [];
    for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
        {
            var localVertex = box.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4( box.matrix );
            globalZs.push(globalVertex.z);
        }
    return Math.max.apply(Math, globalZs);
}





