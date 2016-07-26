// Asteroidenklasse
// Hier nichts direkt aufrufen, Aufrufe werden ueber Bot.js geregelt
// (Ausnahme: Collision soll onCollisionDetect aufrufen)

var geometry;

var despawnDistance = 5000; // aus core.js (Backplane der Camera)

function Asteroid(location,radius, direction, speed, level, small) {
	this.small	= small || false;

	if(small) {
    	geometry = fileLoader.get("Asteroid V2");
	} else {
		geometry = fileLoader.get("Asteroid V2");
	}

    // Mesh setzen
    THREE.Mesh.call(this, geometry,
        new THREE.MeshPhongMaterial({culling: THREE.DoubleSide}));

    this.direction 	= direction.normalize();
    this.speed 		= speed;
    this.radius 	= radius;
    this.position 	= location;
    this.level 		= level;
    this.isAlive	= true;
}

Asteroid.prototype.constructor = Asteroid;
Asteroid.prototype = new THREE.Mesh;

Asteroid.prototype.move = function(delta) {
    this.position.add(direction.multiplyScalar(speed * delta));
    direction.normalize();

    if(this.position.distanceTo(playerPosition) > despawnDistance) {
    	isAlive = false;
    }

    // TODO: add rotation (this.rotation? <- von Object3D)

}

Asteroid.prototype.onCollisionDetect(other, typ) {
	// TODO:
    // falls Asteroid getroffen:
    // Asteroid ? -> abstossen und verkleinern
    if(typ == BOT.ASTEROID) {
    	this.reflect(other);

    	if(small) {
    		isAlive = false;
    	} else {
    		// verkleiner und erzeuge neuen
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
    		isAlive = false;
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
