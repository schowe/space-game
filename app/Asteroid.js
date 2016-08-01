// Asteroidenklasse
// Hier nichts direkt aufrufen, Aufrufe werden ueber Bot.js geregelt
// (Ausnahme: Collision soll onCollisionDetect aufrufen)
var minShipSize     = 10;
var maxShipSize     = 20;
var maxAsteroidSize = 30;

var geometryA, textureA;

var despawnDistance = 700; // aus core.js (Backplane der Camera) (changed)

function Asteroid(location,radius, direction, speed, level, small) {
    console.log("Asteroid init");
    // Mesh setzen
    if(small) {
        geometryA = fileLoader.get("AsteroidV2");
        textureA  = fileLoader.get("AsteroidTex");
    } else {
        geometryA = fileLoader.get("AsteroidV2");
        textureA  = fileLoader.get("AsteroidTex");
    }

    THREE.Mesh.call(this, geometryA,
                        new THREE.MeshPhongMaterial({map: textureA}));

    // setze Groesse
    this.scale.set(radius,radius,radius);

    this.direction  = direction;
    this.direction.normalize();
    this.speed      = speed;
    this.radius     = radius;
    
    this.position.x = location.x;
    this.position.y = location.y;
    this.position.z = location.z;

    this.level      = level;
    this.isAlive    = true;
    this.isSmall 	= small;

    // setze Rotation
    this.rotation.set(0.05 * Math.random(),0.05 * Math.random(),0.05 * Math.random(), 'XYZ');

    this.rotateSpeed = new THREE.Vector3(0.05 * Math.random(),0.05 * Math.random(),0.05 * Math.random());
}

Asteroid.prototype.constructor = Asteroid;
Asteroid.prototype = new THREE.Mesh;

Asteroid.prototype.move = function(delta) {
    this.direction.multiplyScalar(this.speed * delta);
    this.position.x += this.direction.x;
    this.position.y += this.direction.y;
    this.position.z += this.direction.z;
    this.direction.normalize();

    if(this.position.distanceTo(ship.position) > despawnDistance) {
        this.isAlive = false;
    }

   // console.log("Position asteroid: ("+this.position.x+","+this.position.y+","+this.position.z+")");


    this.rotation.x += this.rotateSpeed.x;
    this.rotation.y += this.rotateSpeed.y;
    this.rotation.z += this.rotateSpeed.z;
   // console.log("Rotation asteroid: ("+this.rotation.x+","+this.rotation.y+","+this.rotation.z+")");

}

Asteroid.prototype.onCollisionDetect = function(other, typ) {
	// siehe World und Zettel 2 -> HP fuer Asteroid?

    // TODO:
    // falls Asteroid getroffen:
    // Asteroid ? -> abstossen und verkleinern
    if(typ == BOT.ASTEROID) {
        this.reflect(other);

        if(small) {
            this.isAlive = false;
        } else {
            // verkleiner und erzeuge neuen
            this.isSmall = true;
        }

        if(other.small) {
            isAlive = false;
        } else {
            // verkleiner und erzeuge neuen
        }
    }

    // Schiff   ? -> weiterbewegen (nichts tun)
    if(typ == BOT.SHIP) {
        other.isAlive = false;
    }

    // Schuss   ? -> explodieren und neu setzen
    if(typ == BOT.SHOT) {
        if(small) {
            this.isAlive = false;
        } else {
            // verkleiner und erzeuge neuen
        }
    }

    // TODO: aufspalten in Dreiecke mit reflektiertem Winkel
}

Asteroid.prototype.reflect = function(other) {
    // Reflektiert Asteroiden this und other
    var factor;

    // "Normale" der Reflektion (zeigt von this nach other -> "Normale fuer this")
    var axis = MATH.clone(other.position);
    axis.sub(this.position);
    axis.normalize();

    var negAxis = MATH.negated(axis);

    // Reflektion fuer Asteroid a
    var axisA = MATH.clone(axis);
    factor = 2 * Math.dot(axisA,this.direction);
    this.direction.negate();
    this.direction.add(axis.multiplyScalar(factor));

    // Reflektion fuer Asteroid b
    var axisB = MATH.clone(negAxis);
    factor = 2 * Math.dot(axisB,other.direction);
    other.direction.negate();
    other.direction.add(negAxis.multiplyScalar(factor));
}
