// Asteroidenklasse
// Hier nichts direkt aufrufen, Aufrufe werden ueber Bot.js geregelt
// (Ausnahme: Collision soll collide aufrufen)
var minShipSize = 10;
var maxShipSize = 20;
var maxAsteroidSize = 30;
var asteroidHP = 10;
var smallityBorder = 20;

var geometryA, textureA;

var despawnDistance = 5000; // aus core.js (Backplane der Camera) (changed)
var spawnRadius = 2000;

function Asteroid(location, radius, direction, speed, level) {
    //console.log("Asteroid init");
    // Mesh setzen
    this.isSmall = (radius <= 20) ? true : false;

    geometryA = fileLoader.get("AsteroidV2");
    textureA = fileLoader.get("AsteroidTex");

    THREE.Mesh.call(this, geometryA,
        new THREE.MeshPhongMaterial({ map: textureA }));

    // setze Groesse
    this.scale.set(radius, radius, radius);

    this.direction = direction;
    this.direction.normalize();
    this.speed = speed;
    this.radius = radius;

    this.position.x = location.x;
    this.position.y = location.y;
    this.position.z = location.z;

    this.level = level;
    this.isAlive = true;
    //this.HP = asteroidHP;

    // setze Rotation
    this.rotation.set(0.05 * Math.random(),
        0.05 * Math.random(), 0.05 * Math.random(), 'XYZ');

    this.rotateSpeed = new THREE.Vector3(0.05 * Math.random(),
        0.05 * Math.random(), 0.05 * Math.random());

    // setze Hitbox
    //this.hitBox = this.getHitBox();
    //this.hitBox.position.set(this.position.x, this.position.y, this.position.z);
}

Asteroid.prototype.constructor = Asteroid;
Asteroid.prototype = new THREE.Mesh;

Asteroid.prototype.move = function (delta) {
    this.direction.multiplyScalar(this.speed * delta);
    this.position.x += this.direction.x;
    this.position.y += this.direction.y;
    this.position.z += this.direction.z;
    this.direction.normalize();

    if (this.position.distanceTo(ship.position) > despawnDistance) {
        console.log("DespawnRange");
        this.isAlive = false;
    }

    // console.log("Position asteroid: ("+this.position.x+","+this.position.y+","+this.position.z+")");


    this.rotation.x += this.rotateSpeed.x;
    this.rotation.y += this.rotateSpeed.y;
    this.rotation.z += this.rotateSpeed.z;
    // console.log("Rotation asteroid: ("+this.rotation.x+","+this.rotation.y+","+this.rotation.z+")");

    // HitBox setzen
    //this.hitBox.position.set(this.position.x, this.position.y, this.position.z);

}

Asteroid.prototype.collide = function (other, type, index, otherIndex) {
    switch (type) {
        case "ASTEROID": case "asteroid": case "Asteroid":
            if (this.isSmall) {
                this.isAlive = false;

                if (other.isSmall) {
                    other.isAlive = false;
                }
            } else {
                if (other.isSmall) {
                    other.isAlive = false;
                } else {
                    this.reflect(other);
                }
            }
            break;
        case "SHIP": case "ship": case "Ship":
            // TODO
            break;
        case "PLAYER": case "player": case "Player":
            console.log("player");
            this.isAlive = false;
            break;
        case "LASER": case "laser": case "Laser":
            asteroidHP[index] -= laserDamage;
            break;
        case "ROCKET": case "rocket": case "Rocket":
            asteroidHP[index] -= rocketDamage;
            break;
        case "EXPLOSION": case "explosion": case "Explosion":

            break;
        case "MACHINEGUN": case "machinegun": case "Machinegun":
            this.isAlive = false;
            break;
        default: console.log("Error: Collision with unknown");
    }

    if (!this.isAlive) {
        asteroidHP[index] = 0;
    }
    if ((type == "ASTEROID" || type == "asteroid" || type == "Asteroid") && !other.isAlive) {
        asteroidHP[otherIndex] = 0;
    }
}

Asteroid.prototype.reflect = function (other) {
    // Reflektiert Asteroiden this und other
    var factor;

    // "Normale" der Reflektion (zeigt von this nach other -> "Normale fuer this")
    var axis = MATH.clone(other.position);
    axis.sub(this.position);
    axis.normalize();

    var negAxis = MATH.negated(axis);

    // Reflektion fuer Asteroid a
    var axisA = MATH.clone(axis);
    factor = 2 * Math.dot(axisA, this.direction);
    this.direction.negate();
    this.direction.add(axis.multiplyScalar(factor));

    // Reflektion fuer Asteroid b
    var axisB = MATH.clone(negAxis);
    factor = 2 * Math.dot(axisB, other.direction);
    other.direction.negate();
    other.direction.add(negAxis.multiplyScalar(factor));
}

Asteroid.prototype.getHitBox = function () {
    var mesh, geometry, material;

    geometry = new THREE.SphereGeometry(3.5 * this.radius, 32, 32);

    material = new THREE.MeshBasicMaterial({
        transparent: false,
        opacity: 0.5,
        color: 0xffffff
    });

    mesh = new THREE.Mesh(geometry, material);
    //mesh.position.set(this.position.x, this.position.y, this.position.z);

    return mesh;
}

Asteroid.prototype.getObstacleHitBox = function () {
    var mesh, geometry, material;

    geometry = new THREE.SphereGeometry(1.2 * 3.5 * this.radius, 32, 32);

    material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.0,
        color: 0xffffff
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(this.position.x, this.position.y, this.position.z);
    mesh.direction = this.direction;

    return mesh;
}
