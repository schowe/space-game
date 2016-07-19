// Botklasse
var minObstacleDistance = 100;
var enemy, asteroid, playerPosition;

// Sortierfunktion für Bots (Enemies und Asteroids)
// je naeher am Schiff, desto niedriger der Indize
function compare(a,b) {
    // bei freier Bewegung: distanceToSquared(playerPosition)
    var distanceA = a.location.distanceToSquared(playerPosition);
    var distanceB = b.location.distanceToSquared(playerPosition)

    if(distanceA < distanceB) {
        return -1;
    } else if(distanceA > distanceB) {
        return 1;
    } else {
        return 0;
    }
}

// Asteroidenklasse
function Asteroid(direction,speed,location) {
    this.direction = direction.normalize();
    this.speed = speed;
    this.location = location;
};

Asteroid.prototype.move = function(delta, asteroids, enemies) {
    location = location

};

// Enemyklasse
function Enemy(speed,location, weapon) {
    this.speed = speed;
    this.location = location;
    this.weapon = weapon;
    this.isAlive = true;
};

Enemy.prototype.move = function(delta, asteroids, enemies) {
    var wrongDir, avoidDir, alpha;
    // prinzipielle Richtung
    var directionToPlayer = new THREE.Vector3();
    directionToPlayer.copy(playerPosition);
    directionToPlayer.sub(this.location);

    // ueberpruefe auf Hindernisse
    // fuer Rand von Box um Enemy
    var raycaster = new THREE.Raycaster(this.location,playerPosition,0,
        minObstacleDistance);

    var AsteroidCollisions = raycaster.intersectObjects(asteroids,true);
    var ShipCollisions = raycaster.intersectObjects(enemies,true);

    // falls es zu einer Moeglichkeit einer Kollision kommt, aendere Richtung
    asteroid = AsteroidCollisions.length > 0 ? AsteroidCollisions[0] : null;
    enemy   =  ShipCollisions.length > 0 ? ShipCollisions[0] : null;

    // nur dem ersten Gegenstand ausweichen
    if(enemy.distanceToSquared(this.position) <
        asteroid.distanceToSquared(this.position)) {
            wrongDir = enemy.direction;
    } else {
            wrongDir = asteroid.direction;
    }

    // Ausweichrichtung:
    // negative Hindernisflugrichtung, im 90° Winkel um ideale Richtung gedreht
    avoidDir = new Vector3(0,0,0);
    avoidDir.sub(wrongDir);
    alpha = Math.PI * Math.random() - Math.PI/2;
    avoidDir.applyAxisAngle(directionToPlayer,alpha);

    // normalisiere, um Geschwindigkeit nur von speed abhaengig zu machen
    direction.normalize();

    this.location = this.location + this.speed * direction;
};

Enemy.prototype.shoot = function() {

};

Enemy.prototype.shot = function() {
    // Für jeden Schuss im Spiel und jeden Gegenstand in der Naehe
    // überprüfe Kollision
    return false;
}


// Kollisionsueberpruefung
function checkCollisions() {

}

// aktualisiere Position der Asteroiden und Gegner
// Setze direction neu
function updateLocation(delta) {
    // 1. Schritt: ideale Richtungen ausrechnen

    // 2. Schritt: Asteroiden und Gegner sortieren
    asteroids.sort(compare);
    enemies.sort(compare);

    // 3. Schritt: Ausweichen
    // Asteroiden haben keine Intelligenz -> Bewegung behalten
    // Gegner sind intelligent -> allen vor sie liegenden Asteroiden ausweichen
    //                         -> allen vor sie liegenden Gegnern ausweichen
    // -> vordere updaten und Richtung des nächsten anhand der neuen Position
    //    ausrechnen

    // Asteroiden: Bewegung updaten
    for(asteroid of asteroids) {
        asteroid.move(delta, asteroids, enemies)
    }

    // Enemies bewegen

    // erst ab bestimmter Distanz d_max ausweichen priorisieren
    // ab d_min auf jeden Fall ausweichen


    location = location + direction;
}

function update(delta) {
    playerPosition = new THREE.Vector3(0,0,0);
    updateLocation(delta);
    checkCollision(asteroids, enemies);
}

function initAI(level) {
    // erstelle Asteroiden

    // erstelle Gegner
}
