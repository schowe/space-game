// Botklasse

var minShipSize     = 10;
var maxShipSize     = 20;
var maxAsteroidSize = 30;
var guardingRadius  = 50;

var BOT.SHOT     = 1;
var BOT.ASTEROID = 2;
var BOT.SHIP     = 3;

var asteroids = [], enemies = [], enemy, asteroid, playerPosition,
    worldRadius, radius, i;


// Sortierfunktion fuer Bots (Enemies und Asteroids)
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



// Kollisionsueberpruefung und getroffene Ausschalten
// !!! wird in Collision gemacht -> brauchen nur interne Methoden
function checkCollisionAndAct(asteroids, enemies) {
    // TODO:
    // falls Asteroid getroffen:
    // Asteroid ? -> abstossen und verkleinern
    // (notfalls loeschen, falls kleiner maxShipSize -> sowie bei Schuss)
    // Schiff   ? -> weiterbewegen
    // Schuss   ? -> explodieren und neu setzen


    // falls Schiff getroffen:
    // Asteroid, Schiff, Schuss von Gegner ? -> neu setzen
    // Schuss vom Spieler ? -> explodieren

    // nutze die Methoden {asteroid,enemy}.onCollisionDetect(other)

    // gebe "Ueberlebende" zurueck


    // 1. Asteroid <-> Asteroid
    // 2. Enemy <-> Enemy
    // 3. Asteroid <-> Enemy

    // TODO: Fuer alle mit !isAlive neue Objekte erzeugen


    return enemies;
}

// Testet so, dass sich Gegenstaende beim Erzeugen nicht behindern
// TODO: Falls es lagt, Spieler - 1/4 - Asteroiden - 5/6 - Enemies
function farAway(position,size) {
    // ueberpruefe Kollision mit Asteroiden
    var asteroidsLength = asteroids.length;
    for(i = 1; i <= asteroidsLength; i++) {
        asteroid = asteroids[asteroidsLength - i];
        var distanceAsteroid = asteroid.position.distanceTo(position);

        if(distanceAsteroid - size - asteroid.radius < 0) {
            return false;
        }
    }

    // ueberpruefe Kollision mit Enemies
    var enemiesLength = enemies.length;
    for(i = 1; i <= enemiesLength; i++) {
        enemy = enemies[enemiesLength - i];
        var distanceEnemy = enemy.position.distanceTo(position);

        if(distanceEnemy - size - maxShipSize < 0) {
            return false;
        }
    }

    // nichts gefunden
    return true;
}


// Erschaffe Asteroiden
function createAsteroid(level) {
    // Welt als Kugel -> Setze an den aeusseren 3/4 Rand
    positionRadius = worldRadius/4 * (1+3*Math.random());

    // zufaellig an den Rand positionieren
    do {
        alpha = 2 * Math.PI * Math.random();
        beta = Math.PI * Math.random();
        asteroidPosition = new THREE.Vector3(
            Math.sin(beta) * Math.sin(alpha),
            Math.sin(beta) * Math.cos(alpha),
            Math.cos(beta));
        asteroidPosition.multiplyScalar(positionRadius);
        asteroidPosition.add(playerPosition);
        // Radius zufaellig, aber mindestens so gross wie Schiff
        radius = minShipSize + Math.random * (maxAsteroidSize - minShipSize);
    } while(!farAway(asteroidPosition, radius));

    // TODO: speed abhaengig von Level, ! asteroid.speed < min(enemy.speed)
    speed = level;

    // Richtung:
    direction = new THREE.Vector3(
                        playerPosition.x - asteroidPosition.x,
                        playerPosition.y - asteroidPosition.y,
                        playerPosition.z - asteroidPosition.z)
    var randomDir = new THREE.Vector3(
                        Math.random(), Math.random(), Math.random());
    randomDir.normalize();
    randomDir.multiplyScalar(Math.pow(-1,Math.round(1000 * Math.random())) *
                     Math.random() * 0.839); // tan(40°)
    direction.add(randomDir);

    asteroid = new Bots.Asteroid(asteroidPosition, direction, speed, level);

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
        enemyPosition.add(playerPosition);
    } while(!farAway(enemyPosition, maxShipSize));

    // TODO: speed abhaengig von Level
    speed = 2;

    // TODO: weapon
    switch(Math.round(level * Math.random())) {
        case 0 : typ = 0; break;
        case 1 : typ = 1; break;
        case 2 : typ = 2; break;
        case 3 : typ = 3; break;
        default: typ = 4; // hardest weapon
    }

    enemy = new Bots.Enemy(enemyPosition, speed, typ, level);

    return enemy;
}


// aktualisiere Position der Asteroiden und Gegner
// Setze direction neu
function updateLocation(delta) {

    // 1. Schritt: Gegner sortieren (siehe 2. Schritt)
    enemies.sort(compare);

    // 2. Schritt: Ausweichen
    // Asteroiden haben keine Intelligenz -> Bewegung behalten
    // Gegner sind intelligent -> allen vor sie liegenden Asteroiden ausweichen
    //                         -> allen vor sie liegenden Gegnern ausweichen
    // -> vordere updaten und Richtung des naechsten anhand der neuen Position
    //    ausrechnen

    // Asteroiden: Bewegung updaten
    for(asteroid of asteroids) {
        asteroid.move(delta);
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
    playerPosition = ship.position;
    // Gegner und Asteroiden updaten
    updateLocation(delta);
    // Kollisionsueberpruefung -> zerstoerte Loeschen
    enemies = checkCollisionAndAct(asteroids, enemies);
    // Schiessen
    for(enemy of enemies) {
        if(enemy.shootAble) {
            enemy.shoot();
            enemy.shootAble = false;
        }
    }
}


// Initialisierer der Bots je Level
function init(level) {
    // setzen unserer externen Faktoren
    playerPosition = ship.position;
    worldRadius = World.getRadius();

    // erstelle Asteroiden
    if(level == 1) {
        asteroids = [];
    }

    // TODO: Levelabhaengigkeit klaeren
    for(i = 0; i < 5 * level; i++) {
        asteroid = createAsteroid(level);
        asteroids.push(asteroid);
        scene.add(asteroid);
    }

    // erstelle Gegner
    if(level == 1) {
        enemies = [];
    }

    for(i =0 ; i < 3 * level; i++) {
        enemy = createEnemy(level);
        enemies.push(enemy);
        scene.add(enemy);
    }
}
