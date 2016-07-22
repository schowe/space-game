var minObstacleDistance = 100;
var maxAsteroidSize = 30;
var guardingRadius = 50;
var minDistanceToPlayer = 10;
var maxShipAngle = 70 * (Math.PI / 360);

var asteroids, enemies, enemy, asteroid, playerPosition,
    radius, i, bezierPoints;


// Enemyklasse
function Enemy(location, speed ,weapon) {
    this.speed = speed;
    this.location = location;
    this.weapon = weapon;
    this.isAlive = true;
    this.shootAble = false;
    this.onBezier = false;
}

Enemy.prototype.move = function(delta, asteroids, enemies) {
    var wrongDir, avoidDir, alpha, shootAble, d, distanceToShip,
        obstacleDistance, tmpDistance;
    var onPlayerAttack = false;

    // 0. Schritt: Checke ob auf Bezierkurve oder nicht
    if(onPlayerAttack) {
    // Achte darauf, dass sich der Spieler nicht um mehr als 90° zur
    // urspruenglichen Richtung gedreht hat
    } else {
        // 1. Schritt: Gehe in Richtung Spieler (Idealrichtung)
        var directionToPlayer = MATH.clone(playerPosition);
        directionToPlayer.sub(this.location);

        var distanceToNext = directionToPlayer.length();

        directionToPlayer.normalize();

        // TODO: Fuer Bezier Wechsel auf optimalDir
        var optimalDir = MATH.clone(directionToPlayer);

        // 2. Schritt: Ueberpruefe, ob dem Spieler zu nahe geraten
        if(distanceToNext < minDistanceToPlayer) {
                // fliege in Bezierkurve hinter den Flieger
                // setze Idealrichtung als Richtung zu naechstem Punkt auf der Kurve
        } else {
            // Gelange hinter dem Spieler:
            // berechne Bezierkurve und setze flag onBezier = true
            onBezier = true;
        }
    }
    // 3. Schritt: Ueberpruefe auf Hindernisse
    var obstacles = [];

    // Setze, da Abstand nach vorne wichtiger, Schiff voruebergehend auf die
    // Position mit idealer Flugrichtung im naechsten Frame
    var shipPosition = MATH.clone(this.position);
    optimalDir.multiplyScalar(delta*this.speed);
    shipPosition.add(optimalDir);
    optimalDir.normalize();

    var shipDistance = distanceToNext + delta * this.speed;

    // Kontrolliere, ob sich im guardingRadius andere Gegenstaende befinden
    for(asteroid of asteroids) { // Asteroiden schon geupdatet
        d = Math.abs(shipDistance - asteroid.location.distance(playerPosition));
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
            var flightAngle =
                Math.dot(obstacles[1].direction.normalize(),this.direction);

            // Falls nicht auf einen zufliegend
            if(flightAngle >= -0.965) { // im 15° Winkel auf einen zufliegend
                // Weiche aus: Gehe in die optimale Richtung, abgelenkt um
                //  Normale zum Schnittpunkt mit Hindernis
                var avoidDir = new THREE.Vector3(0,0,0);
                // TODO: weiche aus in Richtung der Normalen des Schnittpunkts
                // TODO: rotiere avoidDir um bis zu +-10° bzgl. jeder Richtung

                // Gewichte die Laengen, um Kollision zu vermeiden
                var bestImpact = this.position.distanceTo(obstacles[0].location);
                var avoidImpact = 1.5 * maxAsteroidSize;

                avoidDir.multiplyScalar(avoidImpact);

                direction = MATH.clone(directionToPlayer);
                direction.multiplyScalar(bestImpact);

                direction.add(avoidDir);

            } else {
            // sonst, weiche aus bzw. zerschiesse Asteroid wie aufs Zettel 1
            }
        } else { // schwieriger Fall: mindestens zwei Hindernisse

            // 3.5. Schritt: Sortiere nach Distanz zu this
            // Naechste Objekte vorne
            // obstacles.sort(function(a,b) {
            //     var distanceA = a.location.distanceToSquared(shipPosition);
            //     var distanceB = b.location.distanceToSquared(shipPosition);

            //     if(distanceA < distanceB) {
            //         return -1;
            //     } else if(distanceA > distanceB) {
            //         return 1;
            //     } else {
            //         return 0;
            //     }
            // });

            // Ausweichalgorithmus:
            // Projeziere Szene auf Plane, deren Abstand zum Schiff durch
            // den maximalen Flugwinkel bestimmt ist
            // -> render mit Kamera bei this in Richtung this.direction
            // da alles Kugel genuegt Mittelpunkt und Radius
            // ! weiter entfernte Objekte sind auf der Plane kleiner
            //      -> Gewichtung entfaellt (bzw. haengt am Radius)

            // Koordinatensystemwechsel:
            // N = optimalDir,U =N x(Up x N),V =N x U, Up=shipPosition + e_y
            var upVector = new THREE.Vector3(0,1,0);
            //upVector.add(shipPosition);
            // TODO: Ueberpruefe, ob Up richtig
            var N = MATH.clone(optimalDir);

            var U = MATH.clone(N);
            U.cross(N);
            U.cross(N);

            var V = MATH.clone(N);
            V.cross(U);

            N.normalize();
            U.normalize();
            V.normalize();

            // Stelle Koordinatensystemwechselmatrix auf
            // Ursprung = this.position + a * optimalDir
            var coordMatrix = new Matrix4();
            // Plane etwas vor einem
            var distanceToPlane = 1.2 * speed * delta;

            var ursprung = MATH.clone(optimalDir);
            ursprung.multiplyScalar(distanceToPlane);
            ursprung.add(this.position);

            coordMatrix.set(U.x,V.x,N.x,ursprung.x,
                            U.y,V.y,N.y,ursprung.y,
                            U.z,V.z,N.z,ursprung.z,
                            0,  0,  0,  1);
            coordMatrix.getInverse(coordMatrix);

            // Transformation der Mittelpunkte sowie der Radien
            // Sammle zu jedem obstacle den Mittelpunkt und schick ihn durch die Matrix
            // Radius bleibt bei coordMatrix, da UVN ONB ist

            var projMatrix = new Matrix4();
            projMatrix.set(1,0,0,0, 0,1,0,0, 0,0,0,0, 0,0,1/distanceToPlane,1);

            var obstaclesCenter = []j;
            var obstaclesRadius = [];
            var center;

            // Transformiere Mittelpunkt und Radius
            for(i = 0; i < obstacles.length; i++) {
                obstacle = obstacles[i];
                var tmp = [obstacle.location.x, obstacle.location.y,
                                obstacle.location.z];
                tmp = coordMatrix.applyToVector3Array(tmp);
                tmp = projMatrix.applyToVector3Array(tmp);
                center = new THREE.Vector3(tmp[0],tmp[1],tmp[2]);
                // push setzt bei Array hinten drauf
                obstaclesCenter.push(center);
                // TODO: Formel fuer projectedRadius einsetzen
                obstaclesRadius.push(projectedRadius);
            }
            // -> Projektion der Schutzradien
            // -> Ausweichproblem in 2D

            var directionInPlane = MATH.clone(this.position);
            directionInPlane.add(optimalDir.multiplyScalar(distanceToPlane));
            // TODO: Formel fuer guadrfingRadius auf Plane einsetzen
            var guardingPlane = 1;

            // Ueberpruefe auf Kollision und merke den "Fehler"
            for(i = 0; i < obstacles.length; i++) {
                tmpDistance = this.location.distanceTo(obstacles[i].location);
                tmpDistance = tmpDistance - guardingPlane - obstaclesRadius;
                if(obstacleDistance > tmpDistance) {
                    obstacleDistance = tmpDistance;
                }
            }


            // Falls Fehlergroesse min |a-b|-r-R >= 0 -> widerstandsfrei
            if(obstacleDistance >= 0) {
                // Falls bevorzugte Richtung geht, gehe in diese Richtung
                // mit einem kleinen vom "Fehler" abhaengigen Unterschied
                direction = new THREE.Vector3(
                                Math.random(), Math.random(), Math.random());
                direction.addScalar(directionError);
                direction.add(optimalDir.multiplyScalar(distanceToNext));
            } else {
                directionFound = false;

                // Sonst gehe in andere Richtung

                // TODO: Suche weitere Richtung

                // falls Fehler klein -> in Umgebung um optimalDir

                // sonst rate bis zu fuenfmal Richtung


                if(!directionFound) {
                    // Falls dies auch nicht geht, pruefe, ob Ecken der Plane frei
                    var edgeNotPossible = true;
                    var toEdge = distanceToPlane * Math.tan(maxShipAngle);

                    i = 0;
                    while(edgeNotPossible) {

                        direction = directionInPlane.clone();

                        switch(i) {
                            case 0:
                                direction.x -= toEdge * u.x;
                                direction.y -= toEdge * u.y;
                                edgeNotPossible =
                                checkCollisionInDirection(direction, obstacles);
                                break;
                            case 1:
                                direction.x += toEdge * u.x;
                                direction.y -= toEdge * u.y;
                                edgeNotPossible =
                                checkCollisionInDirection(direction, obstacles);
                                break;
                            case 2:
                                direction.x += toEdge * u.x;
                                direction.y += toEdge * u.y;
                                edgeNotPossible =
                                checkCollisionInDirection(direction, obstacles);
                                break;
                            case 3:
                                direction.x -= toEdge * u.x;
                                direction.y += toEdge * u.y;
                                edgeNotPossible =
                                checkCollisionInDirection(direction, obstacles);
                                break;
                            default: edgeNotPossible = true;
                        }

                        directionFound = !edgeNotPossible;

                        i++;
                    }

                    if(!directionFound) {
                        // Falls vor einem alles versperrt, bleibe stehen und schiesse
                        direction = new THREE.Vector3(0,0,0);
                        this.shoot();
                    }
                }
            }
        }

    } else {
        direction = directionToPlayer;
        shootAble = true;
    }

    // 5. Schritt: normalisiere, um Geschwindigkeit nur von speed
    //                              abhaengig zu machen
    direction.normalize();

    // 6. Schritt:
    this.location.add(direction.multiplyScalar(delta * this.speed);
}


Enemy.prototype.shoot = function() {
    // Schießt von location mit weapon in direction
    // TODO: Je naeher desto haeufiger
}

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
}

Asteroid.prototype.move = function(delta, asteroids, enemies) {
    this.location.add(direction.multiplyScalar(delta));;
}

Asteroid.prototype.onCollisionDetect(other) {
    // TODO: aufspalten in Dreiecke mit reflektiertem Winkel
}
