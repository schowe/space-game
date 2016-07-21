var minObstacleDistance = 100;
var maxAsteroidSize = 30;
var guardingRadius = 50;
var minDistanceToPlayer = 10;

var asteroids, enemies, enemy, asteroid, playerPosition,
    worldRadius, radius, i;


// Enemyklasse
function Enemy(location, speed ,weapon) {
    this.speed = speed;
    this.location = location;
    this.weapon = weapon;
    this.isAlive = true;
    this.shootAble = false;
    this.onBezier = false;
};

Enemy.prototype.move = function(delta, asteroids, enemies) {
    var wrongDir, avoidDir, alpha, shootAble, d, distanceToShip;

    // 0. Schritt: TODO: Checke ob auf Bezierkurve oder nicht

    // Achte darauf, dass sich der Spieler nicht um mehr als 90° zur
    // urspruenglichen Richtung gedreht hat

    // 1. Schritt: Gehe in Richtung Spieler (Idealrichtung)
    var directionToPlayer = new THREE.Vector3();
    directionToPlayer.copy(playerPosition);
    directionToPlayer.sub(this.location);

    var distanceToPlayer = new THREE.Vector3();
    distanceToPlayer.copy(directionToPlayer);
    distanceToPlayer.length();

    directionToPlayer.normalize();

    // 2. Schritt: Ueberpruefe, ob dem Spieler zu nahe geraten
    if(distanceToPlayer < minDistanceToPlayer) {
            // fliege in Bezierkurve hinter den Flieger
            // setze Idealrichtung als Richtung zu naechstem Punkt auf der Kurve
    } else {
        // Gelange hinter dem Spieler:
        // berechne Bezierkurve und setze flag onBezier = true

    }

    // 3. Schritt: Ueberpruefe auf Hindernisse
    var obstacles = [];
    var possibleObstacle = false;

    // Setze, da Abstand nach vorne wichtiger, Schiff voruebergehend auf die
    // Position mit idealer Flugrichtung im naechsten Frame
    var shipPosition = new THREE.Vector3();
    shipPosition.copy(this.position);
    directionToPlayer.multiplyScalar(delta*this.speed);
    shipPosition.add(directionToPlayer);
    directionToPlayer.normalize();

    var shipDistance = distanceToPlayer + delta * this.speed;

    // Kontrolliere, ob sich im guardingRadius andere Gegenstaende befinden
    for(asteroid of asteroids) { // Asteroiden schon geupdatet
        d = abs(shipDistance - asteroid.location.distance(playerPosition));
        // Teste, ob im richtigen Ring um den Spieler
        if(d <= minObstacleDistance) { // nahe (in Bezug auf Distanz zum Player)
            possibleObstacle = true;
            distanceToShip = asteroid.position.distanceTo(shipPosition);
            if(distanceToShip <= guardingRadius) { // nahe an this
                obstacles.push(asteroid);
            }
        } else if(possibleObstacle && d > minObstacleDistance) {
            possibleObstacle = false;
            break; // da sortiert nun nur noch weiterliegende Objekte
        }

    }

    for(enemy of enemies) {
        d =  enemy.location.distance(playerPosition) - shipDistance;
        if(d <= 0 && d <= minObstacleDistance) { // nahe und vor einem
            distanceToShip = enemy.position.distanceTo(shipPosition);
            if(distanceToShip <= guardingRadius) { // nahe an this
                obstacles.push(enemy);
            }
        } else if(possibleObstacle && d > minObstacleDistance) {
            possibleObstacle = false;
            break;
        }

    }

    // 4. Schritt: ausweichen
    // naechstgelegenem Hindernis ausweichen, bis auf Weg kein Gegenstand

    if(obstacles.length > 0) {
        // Unterscheide nach Faellen, da der Algorithmus fuer mehrere
        // Hindernisse rechenintensiv ist (rendert die Szene neu)

        // einfacher Fall: nur ein Hindernis
        if(obstacles.length == 1) {
            // gehe in die optimale Richtung, abgelenkt um
            // negative Flugrichtung des Hindernisses
            var avoidDir = new THREE.Vector3(0,0,0);
            avoidDir.sub(obstacles[0].direction);

            // Gewichte die Laengen, um Kollision zu vermeiden
            var bestImpact = enemy.position.distanceTo(obstacles[0].position);
            var avoidImpact = 1.5 * maxAsteroidSize;

            avoidDir.multiplyScalar(avoidImpact);

            direction = directionToPlayer.copy();
            direction.multiplyScalar(bestImpact);

            direction.add(avoidDir);

        } else { // schwieriger Fall: mindestens zwei Hindernisse

        // 3.5. Schritt: Sortiere nach Distanz zu this
        // Naechste Objekte vorne
        obstacles.sort(function(a,b) {
            var distanceA = a.location.distanceToSquared(shipPosition);
            var distanceB = b.location.distanceToSquared(shipPosition);

            if(distanceA < distanceB) {
                return -1;
            } else if(distanceA > distanceB) {
                return 1;
            } else {
                return 0;
            }
        });

        // Ausweichalgorithmus:
        // Projeziere Szene auf Plane, deren Abstand zum Schiff durch den
        // maximalen Flugwinkel bestimmt ist
        // -> render mit Kamera bei this in Richtung this.direction
        // da alles Kugel genuegt Mittelpunkt und Radius
        // ! weiter entfernte Objekte sind auf der Plane kleiner
        //      -> Gewichtung entfaellt (bzw. haengt am Radius)

        // Ueberpruefe auf Kollision und merke den "Fehler"

        // Falls bevorzugte Richtung geht, gehe in diese Richtung mit einem
        // kleinen vom "Fehler" abhaengigen Unterschied

        // Sonst gehe in andere Richtung -> Projektion der Asteroiden in
        // Dictionary speichern (z.B. fuer entgegengesetzte Flugrichtung)

        // Falls dies auch nicht geht, ueberpruefe, ob Ecken der Plane frei

        // Falls vor einem alles versperrt, bleibe stehen

        }

    } else {
        direction = directionToPlayer;
        shootAble = true;
    }

    // 5. Schritt: normalisiere, um Geschwindigkeit nur von speed
    //                              abhaengig zu machen
    direction.normalize();

    // 6. Schritt:
    // TODO: an 3JS-Syntax anpassen
    this.location += delta * this.speed * direction;
};

Enemy.prototype.shoot = function() {
    // Schießt von location mit weapon in direction
    // TODO: Je naeher desto haeufiger
};

Enemy.prototype.shot = function() {
    // TODO: Fuer jeden Schuss im Spiel und jeden Gegenstand in der Naehe
    // ueberpruefe Kollision
    return false;
}

Enemy.prototype.onCollisionDetect = function(other) {
    // use other instanceof whatever
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

Asteroid.prototype.onCollisionDetect(other) {
    // TODO: aufspalten in Dreiecke mit reflektiertem Winkel
}
