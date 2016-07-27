// Botklasse

// Fuer Kollision:
// asteroids und enemies sind nach Abstand zum Spieler sortiert
// -> break-Chance

// Hier aufzurufen:
// - init()
// - update(delta)
var asteroids = [], enemies = [], enemy, asteroid, playerPosition, worldRadius;

function Bot() {

    var minShipSize     = 10;
    var maxShipSize     = 20;
    var maxAsteroidSize = 30;
    var guardingRadius  = 50;

    var SHOT     = 1;
    var ASTEROID = 2;
    var SHIP     = 3;

    var radius, i;


    // Sortierfunktion fuer Bots (Enemies und Asteroids)
    // je naeher am Schiff, desto niedriger der Indize
    function compare(a,b) {
        var distanceA = a.position.distanceToSquared(playerPosition);
        var distanceB = b.position.distanceToSquared(playerPosition)

        if(distanceA < distanceB) {
            return -1;
        } else if(distanceA > distanceB) {
            return 1;
        } else {
            return 0;
        }
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
	console.log("Enter Create Asteroid");
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
        speed = level > 15 ? 15 : level;
        speed = speed/3 * (2 * Math.random() + 1);

        // Richtung:
        direction = new THREE.Vector3(
                            playerPosition.x - asteroidPosition.x,
                            playerPosition.y - asteroidPosition.y,
                            playerPosition.z - asteroidPosition.z);
        var randomDir = new THREE.Vector3(
                            Math.random(), Math.random(), Math.random());
        randomDir.normalize();
        randomDir.multiplyScalar(Math.random() * 0.839); // tan(40°)
        randomDir.multiplyScalar(direction.length());
        direction.add(randomDir);
	    console.log("Finally Create Asteroid");

        asteroid = new Asteroid(asteroidPosition, 20, direction, speed, level, false);

        return asteroid;
    }

    // Erschaffe Enemy
    function createEnemy(level) {
        var weapon;
	console.log("Enter Create Enemy");
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
        speed = 20;

        // TODO: weapon
        switch(Math.round(level * Math.random())) {
            case 0 : typ = 0; break;
            case 1 : typ = 1; break;
            case 2 : typ = 2; break;
            case 3 : typ = 3; break;
            default: typ = 4; // hardest weapon
        }

	console.log("Finally Create Enemy");
        enemy = new Enemy(enemyPosition, speed, level, typ);

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
            console.log("Asteroid wird bewegt")
        }

        asteroids.sort(compare);

        // Enemies bewegen
        // erst ab bestimmter Distanz d_max ausweichen priorisieren
        // ab d_min auf jeden Fall ausweichen
        for(enemy of enemies) {
            enemy.move(delta, asteroid, enemies);
            console.log("Enemy wird bewegt")
        }

    }

    return {
        // update-Methode, aufzurufen in jedem Durchlauf des Renderers
        updateAI: function(delta) {
            // Spielerposition updaten
            playerPosition = ship.position;
            // Gegner und Asteroiden updaten
            updateLocation(delta);
            // Kollisionsueberpruefung -> zerstoerte Loeschen
            // Schiessen
            for(enemy of enemies) {
                if(enemy.shootAble) {
                    enemy.shoot();
                    enemy.shootAble = false;
                }
            }
            console.log("AI updated")
        },


        // Initialisierer der Bots je Level
        initAI: function(level) {
		console.log("Start initAI");
            // setzen unserer externen Faktoren
            playerPosition = ship.position;
            worldRadius = 5000;

            // erstelle Asteroiden
            if(level == 1) {
                asteroids = [];
            }

            // TODO: Levelabhaengigkeit klaeren
            for(var i = 0; i < 50 * level; i++) {
                asteroid = createAsteroid(level);
                asteroids.push(asteroid);
		        console.log(asteroids.length);
                scene.add(asteroid);
            }

            // erstelle Gegner
            if(level == 1) {
                enemies = [];
            }

            for(var i =0 ; i < 5 * level; i++) {
                enemy = createEnemy(level);
                enemies.push(enemy);
 		        console.log(enemies.length);
                scene.add(enemy);
                i = 5;
            }
        }
    }
}
