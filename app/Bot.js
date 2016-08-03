// Botklasse
var destroyedAsteroids = 0; //für die milestones

// Fuer Kollision:
// asteroids und enemies sind nach Abstand zum Spieler sortiert
// -> break-Chance

// Hier aufzurufen:
// - init()
// - update(delta)
var asteroids = [], enemies = [], asteroidHitBoxes = [], enemyHitBoxes = [],
    asteroidHP = [], enemyHP = [], enemy, worldRadius, gameLevel, numOfAsteroids = 150,
    asteroidSpeedVecs = [], asteroidRotVecs = [];

function Bot() {

    var minShipSize = 10;
    var maxShipSize = 20;
    var minAsteroidSize = 10;
    var maxAsteroidSize = 30;
    var guardingRadius = 50;

    var SHOT = 1;
    var ASTEROID = 2;
    var SHIP = 3;

    // Sortierfunktion fuer Bots (Enemies und Asteroids)
    // je naeher am Schiff, desto niedriger der Indize
    function compare(a, b) {
        var distanceA = a.position.distanceToSquared(ship.position);
        var distanceB = b.position.distanceToSquared(ship.position)

        if (distanceA < distanceB) {
            return -1;
        } else if (distanceA > distanceB) {
            return 1;
        } else {
            return 0;
        }
    }


    // Testet so, dass sich Gegenstaende beim Erzeugen nicht behindern
    // TODO: Falls es lagt, Spieler - 1/4 - Asteroiden - 5/6 - Enemies
    function farAway(position, size) {
        // ueberpruefe Kollision mit Asteroiden
        var asteroidsLength = asteroids.length;
        for (i = 1; i <= asteroidsLength; i++) {
            asteroid = asteroids[asteroidsLength - i];
            var distanceAsteroid = asteroid.position.distanceTo(position);

            if (distanceAsteroid - size - asteroid.radius < 0) {
                return false;
            }
        }

        // ueberpruefe Kollision mit Enemies
        var enemiesLength = enemies.length;
        for (i = 1; i <= enemiesLength; i++) {
            enemy = enemies[enemiesLength - i];
            var distanceEnemy = enemy.position.distanceTo(position);

            if (distanceEnemy - size - maxShipSize < 0) {
                return false;
            }
        }

        // nichts gefunden
        return true;
    }

    // Respawn der Asteroiden
    function respawnAsteroid(asteroid, index) {
        //console.log("Respawned: "+index);
        var level = asteroid.level;
        // altes Loeschen

        scene.remove(asteroid);
        /*
        asteroids.splice(i,1);
        asteroidHitBoxes.splice(i,1);
        */
        // nachgelagertes behandeln

        //changeScore(scoreValues["asteroidDestroyed"]);
        // gegebenfalls Power-Up zeigen
        if (Math.random() < 0.23) {
            spawnPowerUp(asteroid.position.x,
                asteroid.position.y, asteroid.position.z);
        }

        // neu erschaffen
        asteroid = createAsteroid(level, index);
        asteroids[index] = asteroid;
        asteroidHitBoxes[index] = asteroid.getHitBox();
        asteroidHitBoxes[index].position.set(asteroids[index].position.x, asteroids[index].position.y, asteroids[index].position.z);
        asteroidHP[index] = (10);
        //console.log("Respawned: " + i);
        scene.add(asteroid);
    }


    // Erschaffe Asteroiden
    function createAsteroid(level, astIndex) {

        var asteroid = new Asteroid(level, astIndex);

        return asteroid;

    }

    // Erschaffe Enemy
    function createEnemy(level, index) {
        var direction, alpha, beta, enemyPosition, radius,
            typ;
        //console.log("Enter Create Enemy");
        // Welt als Kugel -> Setze an den aeusseren 1/2 Rand
        // TODO: spawnRadius setzen
        var spawnRadius = 300;
        radius = spawnRadius / 2 * (1 + Math.random());

        // zufaellig an den Rand positionieren
        do {
            alpha = 2 * Math.PI * Math.random();
            beta = 2 * Math.PI * Math.random();
            enemyPosition = new THREE.Vector3(
                Math.sin(beta) * Math.sin(alpha),
                Math.sin(beta) * Math.cos(alpha),
                Math.cos(beta));
            enemyPosition.multiplyScalar(radius);
            enemyPosition.add(ship.position);
        } while (!farAway(enemyPosition, maxShipSize));

        // TODO: speed abhaengig von Level
        var speed = 15;

        // TODO: weapon
        switch (Math.round(level * Math.random())) {
            case 0: typ = "BOSS1"; break;
            case 1: typ = "BOSS2"; break;
            case 2: typ = "SMALL1"; break;
            case 3: typ = "SMALL2"; break;
            default: typ = "BOSS1"; // hardest weapon
        }

        //console.log("Finally Create Enemy");
        enemy = new Enemy(enemyPosition, speed, level, typ, index);

        return enemy;
    }


    // aktualisiere Position der Asteroiden und Gegner
    // Setze direction neu
    function updateLocation(delta) {

        //console.log(asteroids[49].position.distanceTo(ship.position));

        // 1. Schritt: Gegner sortieren (siehe 2. Schritt)
        enemies.sort(compare);

        // 2. Schritt: Ausweichen
        // Asteroiden haben keine Intelligenz -> Bewegung behalten
        // Gegner sind intelligent -> allen vor sie liegenden Asteroiden ausweichen
        //                         -> allen vor sie liegenden Gegnern ausweichen
        // -> vordere updaten und Richtung des naechsten anhand der neuen Position
        //    ausrechnen

        var asteroidsClone = [], asteroidHitBoxesClone = [];

        // Asteroiden: Bewegung updaten
        for (var i = asteroids.length - 1; i >= 0; i--) {
            //console.log("HP of "+i+" "+asteroidHP[i]);
            var asteroid = asteroids[i];
            asteroid.move(delta);
            asteroidHitBoxes[i].position.set(asteroid.position.x, asteroid.position.y, asteroid.position.z);
            //console.log("Asteroid wird bewegt")
            asteroidsClone[i] = asteroids[i];
            asteroidHitBoxesClone[i] = asteroidHitBoxes[i];
        }

        asteroidsClone.sort(compare);
        asteroidHitBoxesClone.sort(compare);

        // Enemies bewegen
        // erst ab bestimmter Distanz d_max ausweichen priorisieren
        // ab d_min auf jeden Fall ausweichen
        for (var i = enemies.length - 1; i >= 0; i--) {
            if (enemyHP[i] <= 0) {
                enemies.splice(i, 1);
                enemyHitBoxes.splice(i, 1);
                enemyHP.splice(i, 1);
            } else {
                enemies[i].move(delta, asteroidsClone, asteroidHitBoxesClone, i);
                for (var j = enemyHitBoxes[i].length - 1; j >= 0; j--) {
                    enemyHitBoxes[i][j].position.set(enemies[i].position.x, enemies[i].position.y, enemies[i].position.z);
                }
            }
            //console.log("Enemy wird bewegt")
        }

    }

    return {
        // update-Methode, aufzurufen in jedem Durchlauf des Renderers
        updateAI: function (delta) {
            // Asteroiden respawnen
            // respawnEnemies();
            //console.log("AI updated")
            // Gegner und Asteroiden updaten
            updateLocation(delta);
            for (var i = 0; i < enemies.length; i++) {
                for (var j = enemyHitBoxes[i].length - 1; j >= 0; j--) {
                    enemyHitBoxes[i][j].rotation = enemies[i].rotation;
                }
            }
        },


        // Initialisierer der Bots je Level
        initAI: function (level) {
            //console.log("Start initAI");
            // setzen unserer externen Faktoren
            worldRadius = 5000;
            gameLevel = level;

            // erstelle Asteroiden
            // TODO: asteroiden wie loeschen
            if (level == 1) {
                asteroids = [];
            }

            // TODO: Levelabhaengigkeit klaeren
            for (var i = 0; i < numOfAsteroids; i++) {
                var asteroid = createAsteroid(level, i);
            }

            // erstelle Gegner
            if (level == 1) {
                enemies = [];
            }

            for (var i = 0; i < 1 * level; i++) {
                //console.log("Hello");
                enemy = createEnemy(level, i);
                enemies.push(enemy);
                enemyHitBoxes.push(enemy.getHitBoxes());
                for (var j = enemyHitBoxes[i].length - 1; j >= 0; j--) {
                    enemyHitBoxes[i][j].position.set(enemies[i].position.x, enemies[i].position.y, enemies[i].position.z);
                }
                //console.log(enemies.length);
                scene.add(enemy);
            }
        },

        getAsteroids: function () {
            return asteroids;
        },

        getEnemies: function () {
            return enemies;
        }
    }
}
