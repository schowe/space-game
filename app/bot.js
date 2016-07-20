// Botklasse

var minObstacleDistance = 100;
var minShipSize = 10;
var maxShipSize = 20;
var maxAsteroidSize = 30;
var guardingRadius = 50;
var asteroids, enemies, enemy, asteroid, playerPosition,
    worldRadius, radius, i;



// Sortierfunktion für Bots (Enemies und Asteroids)
// je naeher am Schiff, desto niedriger der Indize
function compare(a,b) {
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
function Asteroid(location,radius, direction, speed) {
    this.direction = speed * direction.normalize();
    this.radius = radius;
    this.location = location;
};

Asteroid.prototype.move = function(delta, asteroids, enemies) {
    this.location += delta * direction;
};





// Enemyklasse
function Enemy(location, speed ,weapon) {
    this.speed = speed;
    this.location = location;
    this.weapon = weapon;
    this.isAlive = true;
    this.shootAble = false;
};

Enemy.prototype.move = function(delta, asteroids, enemies) {
    var wrongDir, avoidDir, alpha, shootAble;

    // 1. Schritt: Gehe in Richtung Spieler
    var directionToPlayer = new THREE.Vector3();
    directionToPlayer.copy(playerPosition);
    directionToPlayer.sub(this.location);
    directionToPlayer.normalize();

    // 2. Schritt: Ueberpruefe auf Hindernisse
    // fuer Ecken von Box um Enemy

    var raycaster = new THREE.Raycaster(box.location,directionToPlayer,0,
        minObstacleDistance);

    var AsteroidCollisions = raycaster.intersectObjects(asteroids,true);
    var ShipCollisions = raycaster.intersectObjects(enemies,true);

    // 3. Schritt: Falls es zu einer Moeglichkeit einer Kollision kommt,
    //              aendere Richtung
    asteroid = AsteroidCollisions.length > 0 ? AsteroidCollisions[0] : Infinity;
    enemy   =  ShipCollisions.length > 0 ? ShipCollisions[0] : Infinity;

    if(asteroid!=Infinity || enemy!=Infinity) {
        // nur dem ersten Gegenstand ausweichen
        if(enemy.distanceToSquared(this.position) <
            asteroid.distanceToSquared(this.position)) {
                wrongDir = enemy.direction;
        } else {
                wrongDir = asteroid.direction;
        }

        // Ausweichrichtung:
        // negative Hindernisflugrichtung, bis zu 90° Winkel um ideale Richtung
        // gedreht
        avoidDir = new Vector3(0,0,0);
        avoidDir.sub(wrongDir);

        // TODO: Falls <Asteroid,Schiff> nahe -1 -> alpha auf +- 90°
        //          ansonsten variabel drehen
        alpha = Math.PI * Math.random() - Math.PI/2;


        avoidDir.applyAxisAngle(directionToPlayer,alpha);

        avoidDir.normalize();

        // TODO: je naeher an Gegenstand desto mehr ausweichen
        avoidImpact = 1;
    } else {
        avoidDir = new Vector3(0,0,0);
        avoidImpact = 0;
        shootAble = true;
    }

    direction = directionToPlayer.normalize() + avoidImpact * avoidDir();

    // 4. Schritt: normalisiere, um Geschwindigkeit nur von speed
    //                              abhaengig zu machen
    direction.normalize();

    // 5. Schritt:
    this.location += delta * this.speed * direction;
};

Enemy.prototype.shoot = function() {
    // Schießt von location mit weapon in direction
    // TODO: Je naeher desto haeufiger
};

Enemy.prototype.shot = function() {
    // TODO: Für jeden Schuss im Spiel und jeden Gegenstand in der Naehe
    // überprüfe Kollision
    return false;
}





// Reflektiert Asteroiden a und b
function reflectAsteroids(a,b) {
    var factor;

    // "Normale" der Reflektion (zeigt von a nach b -> "Normale fuer a")
    var axis = b.position.sub(a);
    axis.normalize();

    // Reflektion fuer Asteroid a
    factor = 2 * Math.dot(axis,a.direction)
    a.direction =  a.direction.multiplyScalar(-1);
    a.direction += axis.multiplyScalar(factor);

    // Reflektion fuer Asteroid b
    axis = axis.multiplyScalar(-1);
    factor = 2 * Math.dot(axis,b.direction);
    b.direction =  b.direction.multiplyScalar(-1);
    b.direction += axis.multiplyScalar(factor);
}


// Kollisionsueberpruefung und getroffene Ausschalten
function checkCollisionAndDestroy() {
    // TODO:
    // falls Asteroid getroffen:
    // Asteroid ? -> abstossen
    // Schiff   ? -> weiterbewegen
    // Schuss   ? -> explodieren und neu setzen

    // falls Schiff getroffen:
    // Asteroid, Schiff, Schuss von Gegner ? -> neu setzen
    // Schuss vom Spieler ? -> explodieren


    // gebe "Ueberlebende" zurueck
    return enemies;
}

// Testet so, dass sich Gegenstaende beim Erzeugen nicht behindern
function farAway(position,size) {
    // ueberpruefe Kollision mit Asteroiden
    // (ausnutzen, dass asteroids sortiert)
    distance = position.distanceTo(playerPosition);

    var asteroidsLength;
    for(i = 1; i <= asteroidsLength; i++) {
        asteroid = asteroids[asteroidsLength - i];
        var distanceAsteroid = asteroid.position.distanceTo(playerPosition);

        if(distance - size - distanceAsteroid - asteroid.radius < 0) {
            break;
        }
    }

    // ueberpruefe Kollision mit Enemies
    var enemiesLength;
    for(i = 1; i <= enemiesLength; i++) {
        enemy = enemies[enemiesLength - i];
        var distanceEnemy = enemy.position.distanceTo(playerPosition);

        if(distance - size - distanceEnemy - maxShipSize < 0) {
            break;
        }
    }
}


// Erschaffe Asteroiden
function createAsteroid(level) {
    // Welt als Kugel -> Setze an den aeusseren 1/6 Rand
    positionRadius = worldRadius/6 * (5+Math.random());

    // zufaellig an den Rand positionieren
    do {
        alpha = 2 * Math.PI * Math.random();
        beta = Math.PI * Math.random();
        asteroidPosition = new THREE.Vector3(
            Math.sin(beta) * Math.sin(alpha),
            Math.sin(beta) * Math.cos(alpha),
            Math.cos(beta));
        asteroidPosition.multiplyScalar(positionRadius);
        // Radius zufaellig, aber mindestens so gross wie Schiff
        radius = minShipSize + Math.random * (maxAsteroidSize - minShipSize);
    } while(farAway(asteroidPosition, radius));

    // speed abhaengig von Level
    speed = 1;

    // Richtung:
    // Gegengesetzt zur Normalen mit kleinem Fehlerwinkel (bis zu 20°)
    direction = new THREE.Vector3(
            Math.sin(beta) * Math.sin(alpha),
            Math.sin(beta) * Math.cos(alpha),
            Math.cos(beta));
    direction += Math.pow(-1,Math.round(1000 * Math.random())) *
                     Math.random() * 0.36397023; // tan(20°)

    asteroid = new Asteroid(asteroidPosition, direction, speed);

    return asteroid;
}

// Erschaffe Enemy
function createEnemy(level) {
    var weapon;

    // Welt als Kugel -> Setze an den aeusseren 1/6 Rand
    radius = worldRadius/6 * (5+Math.random());

    // zufaellig an den Rand positionieren
    do {
        alpha = 2 * Math.PI * Math.random();
        beta = Math.PI * Math.random();
        enemyPosition = new THREE.Vector3(
            Math.sin(beta) * Math.sin(alpha),
            Math.sin(beta) * Math.cos(alpha),
            Math.cos(beta));
        enemyPosition.multiplyScalar(radius);
    } while(farAway(enemyPosition, maxShipSize));

    // speed abhaengig von Level
    speed = 2;

    // weapon
    switch(Math.round(level * Math.random()) {
        case 0 : weapon = 0; break;
        case 1 : weapon = 1; break;
        case 2 : weapon = 2; break;
        case 3 : weapon = 3; break;
        default: weapon = 4; // hardest weapon
    }

    enemy = new Enemy(enemyPosition, speed, weapon);

    return enemy;
}


// aktualisiere Position der Asteroiden und Gegner
// Setze direction neu
function updateLocation(delta) {

    // 1. Schritt: Asteroiden und Gegner sortieren
    enemies.sort(compare);

    // 2. Schritt: Ausweichen
    // Asteroiden haben keine Intelligenz -> Bewegung behalten
    // Gegner sind intelligent -> allen vor sie liegenden Asteroiden ausweichen
    //                         -> allen vor sie liegenden Gegnern ausweichen
    // -> vordere updaten und Richtung des nächsten anhand der neuen Position
    //    ausrechnen

    // Asteroiden: Bewegung updaten
    for(asteroid of asteroids) {
        asteroid.move(delta, asteroids, enemies)
    }

    asteroids.sort(compare);

    // Enemies bewegen
    // erst ab bestimmter Distanz d_max ausweichen priorisieren
    // ab d_min auf jeden Fall ausweichen
    for(enemy of enemies) {
        enemy.move(delta, asteroid, enemies);
    }

}

// update-Methode, aufzurufen in jedem Durchlauf des Renderers
function update(delta) {
    // Spielerposition updaten
    playerPosition = new THREE.Vector3(0,0,0);
    // Gegner und Asteroiden updaten
    updateLocation(delta);
    // Kollisionsueberpruefung -> zerstoerte Loeschen
    enemies = checkCollisionAndDestroy(asteroids, enemies);
    // Schiessen
    for(enemy of enemies) {
        if(enemy.shootAble == true) {
            enemy.shoot();
            enemy.shootAble = false;
        }
    }
}


// Initialisierer der Bots je Level
function initAI(level) {
    // setzen unserer externen Faktoren
    playerPosition = Player.getPosition();
    worldRadius = World.getRadius();

    // erstelle Asteroiden
    asteroids = [];

    for(i = 0; i < 5 * level; i++) {
        asteroid = createAsteroid(level);
        asteroids.push(asteroid);
    }

    // erstelle Gegner
    enemies = [];

    for(i =0 ; i < 3 * level; i++) {
        enemy = createEnemy(level);
        enemies.push(enemy);
    }
}
