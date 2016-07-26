var minObstacleDistance = 100;
var maxAsteroidSize     = 30;
var guardingRadius      = 50;
var minDistanceToPlayer = 10;
var maxShipAngle        = 70 * (Math.PI / 360);

var ENEMY.BOSS1  = 1;
var ENEMY.BOSS2  = 2;
var ENEMY.SMALL1 = 3;
var ENEMY.SMALL2 = 4;

var asteroids, enemies, enemy, asteroid, playerPosition,
    radius, i, bezierPoints, geometry;

// Enemyklasse
// Hier nichts direkt aufrufen, Aufrufe werden ueber Bot.js geregelt
// (Ausnahme: Collision soll auf onCollisionDetect zugreifen)
function Enemy(location, speed, level, typ) {
    // TODO: unterschiedliche Enemies

    // Waffe setzen und Groesse aendern
    // TODO: weaponguard
    switch(typ) {
        case ENEMY.BOSS1:
            geometry = fileLoader.get("EnemyMiniShipV1");
            this.weapon = 1;
            this.scale.set(1,1,1);
            break;
        case ENEMY.BOSS2:
            geometry = fileLoader.get("EnemyMiniShipV1");
            this.weapon = 1;
            this.scale.set(1,1,1);
            break;
        case ENEMY.SMALL1:
            geometry = fileLoader.get("EnemyMiniShipV1");
            this.weapon = 1;
            this.scale.set(1,1,1);
            break;
        case ENEMY.SMALL2:
            geometry = fileLoader.get("EnemyMiniShipV1");
            this.weapon = 1;
            this.scale.set(1,1,1);
            break;
        default:
            geometry = fileLoader.get("EnemyMiniShipV1");
            this.weapon = 1;
            this.scale.set(1,1,1);
    }


    // Mesh setzen
    THREE.Mesh.call(this, geometry,
        new THREE.MeshPhongMaterial({culling: THREE.DoubleSide}));


    this.speed      = speed;
    this.position   = location;
    this.level      = level;
    this.isAlive    = true;
    this.shootAble  = false;
    this.onBezier   = false;
}

Enemy.prototype.constructor = Asteroid;
Enemy.prototype = new THREE.Mesh;

// TODO: currentDir merken und einfließen lassen -> weniger hakelig (Traegheit)
Enemy.prototype.move = function(delta, asteroids, enemies) {
    var avoidDir, avoidDirs, collisions, d, distanceToShip, collision, translate;
    var onPlayerAttack = false;

    // 0. Schritt: Checke ob auf Bezierkurve oder nicht
    if(onPlayerAttack) {
        // Achte darauf, dass sich der Spieler nicht um mehr als 90° zur
        // urspruenglichen Richtung gedreht hat
        optimalDir = this.moveBezier();
    } else {

        // 1. Schritt: Gehe in Richtung Spieler (Idealrichtung)
        var directionToPlayer = MATH.clone(playerPosition);
        directionToPlayer.sub(this.position);

        var distanceToNext = directionToPlayer.length();

        directionToPlayer.normalize();

        // TODO: Fuer Bezier Wechsel auf optimalDir
        var optimalDir = MATH.clone(directionToPlayer);

        // 2. Schritt: Ueberpruefe, ob dem Spieler zu nahe geraten
        if(distanceToNext < minDistanceToPlayer){
            // Gelange hinter dem Spieler:
            // fliege in Bezierkurve hinter den Flieger
            // setze Idealrichtung als Richtung zu naechstem Punkt auf der Kurve
            // berechne Bezierkurve und setze flag onBezier = true
            onPlayerAttack = true;

            // TODO: Init Bezier-Kurve und gebe ersten Punkt vor
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
        d = Math.abs(shipDistance - asteroid.position.distance(playerPosition));

        // Teste, ob im richtigen Ring um den Spieler
        // possibleObstacle um die Sortierung zu nutzen -> Doppelter switch
        if(d <= minObstacleDistance) { // nahe (in Bezug auf Distanz zum Player)
            possibleObstacle = true;
            distanceToShip = asteroid.position.distanceTo(shipPosition);
            if(distanceToShip <= minObstacleDistance) { // nahe an this
                obstacles.push(asteroid);
            }
        } else if(possibleObstacle && d > minObstacleDistance) {
            possibleObstacle = false;
            break; // da sortiert nun nur noch weiterliegende Objekte
        }

    }

    for(enemy of enemies) {
        d =  enemy.position.distanceTo(playerPosition) - shipDistance;
        if(d <= 0 && d <= minObstacleDistance) { // nahe und vor einem
            distanceToShip = enemy.position.distanceTo(shipPosition);
            if(distanceToShip <= minObstacleDistance) { // nahe an this
                obstacles.push(enemy);
            }
        } else if(possibleObstacle && d > minObstacleDistance) {
            // nach Sortierung wieder zu weit entfernt oder hinter enemy
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
                Math.dot(obstacles[0].direction.normalize(),this.direction);

            // Falls nicht auf einen zufliegend
            if(flightAngle >= -0.965) { // im 15° Winkel auf einen zufliegend
                // Weiche aus: Gehe in die optimale Richtung, abgelenkt um
                //  Normale zum Schnittpunkt mit Hindernis
                var avoidDir = new THREE.Vector3(0,0,0);
                // TODO: weiche aus in Richtung der Normalen des Schnittpunkts

                var avoidDir = new THREE.Vector3(
                    this.position.x - obstacles[0].position.x,
                    this.position.y - obstacles[0].position.y ,
                    this.position.z - obstacles[0].position.z);
                avoidDir.normalize();

                // rotiere avoidDir um bis zu +-10° bzgl. jeder Richtung
                //          sowie in createAsteroid()
                var randomDir = new THREE.Vector3(Math.random(),
                                        Math.random(), Math.random());
                randomDir.normalize();
                randomDir.multiplyScalar(
                        Math.pow(-1, Math.round(1000 * Math.random())) *
                        Math.random() * 0.176); // tan(10°)
                direction.add(randomDir);

                // Gewichte die Laengen, um Kollision zu vermeiden
                var bestImpact = this.position.distanceTo(obstacles[0].position);
                var avoidImpact = 1.5 * maxAsteroidSize;

                avoidDir.multiplyScalar(avoidImpact);

                direction = MATH.clone(directionToPlayer);
                direction.multiplyScalar(bestImpact);

                direction.add(avoidDir);

            } else {
            // sonst, weiche aus bzw. zerschiesse Asteroid wie aufs Zettel 1
            // TODO: U,V nehmen -> orthogonal verschieben und schiesse zuvor

            }
        } else {
            directionFound = false;

            // Konstruiere Richtungsplane
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


            // 4.1 Suche bis zu fuenf Iterationen lang eine neue Richtung

            // 4.1.1 trivialer Versuch -> geht optimale Richtung?
            collision = checkDirection(direction, obstacles);
            directionFound = (collision == 0);

            if(directionFound) {
                direction = optimalDir;
                // Falls bevorzugte Richtung geht, gehe in diese Richtung
                // mit einem kleinen vom "Fehler" abhaengigen Unterschied
                direction = new THREE.Vector3(
                                Math.random(), Math.random(), Math.random());
                direction.addScalar(directionError);
                direction.add(optimalDir.multiplyScalar(distanceToNext));
            } else {
                // 4.1.2 wenn nicht, ueberpruefe schrittweise Umgebungs
                // 4.1.3 alles in Umgebung (gleicher Abstand)
                var scalar = this.speed * delta * Math.tan(maxShipAngle);
                var checkingDistance =  0.2 * scalar; // s. Zettel 3

                // setze die Laengen von U und V neu, auf maximale Distanz
                // (je nach Winkel des Raumschiffs)
                U.multiplyScalar(checkingDistance);
                V.multiplyScalar(checkingDistance);

                for(i = 0; i < 4; i++) {
                    avoidDir = MATH.clone(direction);
                    switch(i) {
                        case 0: avoidDir = avoidDir.add(U).add(V); break;
                        case 1: avoidDir = avoidDir.add(U).sub(V); break;
                        case 2: avoidDir = avoidDir.sub(U).add(V); break;
                        case 3: avoidDir = avoidDir.sub(U).sub(V); break;
                        default: avoidDir = optimalDir;
                    }

                    avoidDirs.push(avoidDir);
                    collisions[i] = checkDirection(avoidDir, obstacles);
                    directionFound = (collisions[i] == 0);

                    if(directionFound) {
                        direction = avoidDir;
                        break;
                    }
                }

                var iter = 0;
                do {
                    // 4.1.4a Bestimme Richtung mit minimaler Kollisionsanzahl
                    if(!directionFound) {
                        direction = avoidDirs[MATH.getMinIndex(collisions)];
                    }

                    // setze die Laengen von U und V neu, auf maximale Distanz
                    // (je nach Winkel des Raumschiffs)
                    U.normalize();
                    V.normalize();
                    U.multiplyScalar(2/3*checkingDistance*scalar);
                    V.multiplyScalar(2/3*checkingDistance*scalar);

                    // verschiebe um ein kleines Stueck (V Hochachse)
                        translate = MATH.clone(U);
                        var Vt = MATH.clone(V);
                        translate.multiplyScalar(0.5);
                        Vt.multiplyScalar(0.5);

                        switch(MATH.getMinIndex(collisions)) {
                            case 0: // oben rechts
                                translate = translate.add(Vt);
                            case 1: // unten rechts
                                translate.negate().add(Vt);
                            case 2: // oben links
                                translate.add(Vt.negate());
                            case 3: // unten links
                                translate.negate().add(Vt.negate());

                            default:
                        }

                    // 4.1.4b Betrachte die Eckpunkte (Abstand ungleich) in der Umgebung
                    for(i = 0; i < 4; i++) {
                        avoidDir = MATH.clone(direction);
                        avoidDir.add(translate);

                        // TODO: Verschiebe avoidDir ein Stückchen
                        switch(i) {
                            case 0: avoidDir = avoidDir.add(U).add(V); break;
                            case 1: avoidDir = avoidDir.add(U).sub(V); break;
                            case 2: avoidDir = avoidDir.sub(U).add(V); break;
                            case 3: avoidDir = avoidDir.sub(U).sub(V); break;
                            default: avoidDir = optimalDir;
                        }

                        collision = checkDirection(avoidDir, obstacles);
                        directionFound = (collision == 0);

                        if(directionFound) {
                            direction = avoidDir;
                        }
                    }

                    if(directionFound) {
                        // 4.1.4c Mach eine weitere Iteration zum Pruefen

                        // setze die Laengen von U & V neu, auf maximale Distanz
                        U.normalize();
                        V.normalize();
                        U.multiplyScalar(2/3 * checkingDistance * scalar);
                        V.multiplyScalar(2/3 * checkingDistance * scalar);

                        // verschiebe um ein kleines Stueck (V Hochachse)
                        translate = MATH.clone(U);
                        Vt = MATH.clone(V);
                        translate.multiplyScalar(0.5);
                        Vt.multiplyScalar(0.5);

                        switch(MATH.getMinIndex(collisions)) {
                            case 0: // oben rechts
                                translate = translate.add(Vt);
                            case 1: // unten rechts
                                translate.negate().add(Vt);
                            case 2: // oben links
                                translate.add(Vt.negate());
                            case 3: // unten links
                                translate.negate().add(Vt.negate());

                            default:
                        }

                        for(i = 0; i < 4; i++) {
                            avoidDir = MATH.clone(direction);
                            avoidDir.add(translate);
                            switch(i) {
                                case 0: avoidDir = avoidDir.add(U).add(V);break;
                                case 1: avoidDir = avoidDir.add(U).sub(V);break;
                                case 2: avoidDir = avoidDir.sub(U).add(V);break;
                                case 3: avoidDir = avoidDir.sub(U).sub(V);break;
                                default: avoidDir = optimalDir;
                            }

                            collision = checkDirection(avoidDir, obstacles);
                            if(collision != 0) {
                                // Falls Kollision -> weiter iterieren
                                directionFound = false;
                                break;
                            }
                        }
                    }

                    // Automatisch erfuellt
                    // Falls immer noch keine Kollision, nimm die vorherige

                    // Falls doch und Iterationsanzahl erreicht
                    //    -> nimm letzte gute und schiesse
                    iter++;
                } while(!directionFound && iter <= 5);
            }


            if(!directionFound){
                    // sonst rate bis zu fuenfmal Richtung
                    // oder gehe orthogonal
                    U.normalize();
                    V.normalize();

                    for(i = 0; i < 9; i++) {
                        // "rate" neue Richtung
                        avoidDir = MATH.clone(U);
                        U.addScalar(2*Math.random() - 1);
                        V.addScalar(2*Math.random() - 1);
                        avoidDir.add(V);
                        V.normalize();
                        avoidDir.normalize();
                        // Strecke, bleibe aber im Bereich
                        avoidDir.addScalar(Math.random() * distanceToNext);

                        if(i < 5) {
                            direction = MATH.clone(optimalDir);
                        } else {
                            direction = new THREE.Vector3(0,0,0);
                        }

                        direction.add(avoidDir);

                        //  teste, ob diese geht
                        collision = checkDirection(direction, obstacles);
                        directionFound = (collision == 0);

                        if(directionFound) {
                            // falls ja, nimm diese
                            break;
                        }
                    }





                if(!directionFound) {
                    // Falls dies auch nicht geht, pruefe, ob Ecken der Plane frei

                    // Setze die Laengen von U und V neu, auf maximale Distanz
                    // (je nach Winkel des Raumschiffs)
                    U.normalize();
                    V.normalize();
                    U.multiplyScalar(scalar);
                    V.multiplyScalar(scalar);

                    i = 0;
                    while(!directionFound) {

                        direction = MATH.clone(optimalDir);

                        switch(i) {
                            case 0:
                                direction = direction.add(U).add(V);
                                break;
                            case 1:
                                direction = direction.add(U).sub(V);
                                break;
                            case 2:
                                direction = direction.sub(U).add(V);
                                break;
                            case 3:
                                direction = direction.sub(U).sub(V);
                                break;
                            default: direction = optimalDir;
                        }



                        collision = checkDirection(direction, obstacles);
                        directionFound = (collision == 0);
                        i++;
                    }

                    // Falls dies auch nicht geht, gehe orthogonal
                    // Raycaster in v x e1, v x e2, v x e3 -> falls nichts getroffen -> hierhin
                    if(!directionFound) {
                    // nur in diese Richtung nicht linearkominiert
                        for(i = 0; i < 6; i++) {
                            direction = MATH.clone(optimalDir);
                            switch(i) {
                                case 0:
                                    direction.cross(new THREE.Vector3(1,0,0));
                                    break;
                                case 1:
                                    direction.cross(new THREE.Vector3(0,1,0));
                                    break;
                                case 2:
                                    direction.cross(new THREE.Vector3(0,0,1));
                                    break;
                                case 3:
                                    direction.cross(new THREE.Vector3(-1,0,0));
                                    break;
                                case 4:
                                    direction.cross(new THREE.Vector3(0,-1,0));
                                    break;
                                case 5:
                                    direction.cross(new THREE.Vector3(0,0,-1));
                                    break;
                                default: break;
                            }

                            direction.normalize();
                            collision = checkDirection(direction, obstacles);
                            directionFound = (collision == 0);

                            if(directionFound) {
                                break;
                            }
                        }


                        if(!directionFound) {
                            // Falls alles versperrt, bleibe stehen und schiesse
                            direction = new THREE.Vector3(0,0,0);
                            this.shootAble = true;
                        }
                    }
                }
            }
        }

    } else {
        direction = directionToPlayer;
        // "wackel" an Richtung um bis zu +-10° bzgl. jeder Richtung
        //          sowie in createAsteroid()
        var randomDir = new THREE.Vector3(Math.random(),
                                Math.random(), Math.random());
        randomDir.normalize();
        randomDir.multiplyScalar(
                Math.pow(-1, Math.round(1000 * Math.random())) *
                Math.random() * 0.176); // tan(10°)
        direction.add(randomDir);
        shootAble = true;
    }

    // 5. Schritt: normalisiere, um Geschwindigkeit nur von speed
    //                              abhaengig zu machen
    direction.normalize();

    // 6. Schritt:
    this.position.add(direction.multiplyScalar(delta * this.speed);

    // 7. Schritt: rotieren mit lookAt
    // TODO:
}

// @return optimale Richtung nach Bezierflugbahn
Enemy.prototype.moveBezier = function() {
    return new THREE.Vector3(0,0,0);
}

// Ueberprueft die Richtung auf Hindernisse
// @return #Hindernisse
Enemy.prototype.checkDirection = function(direction, objects) {
    var raycaster =
        new THREE.Raycaster(this.position, direction, 0,
            minObstacleDistance - this.speed * delta);
    var rayObstacles = raycaster.intersectObjects(objects);

    return rayObstacles.length;
}


Enemy.prototype.shoot = function() {
    // Schießt von position mit weapon in direction
    // TODO: Je naeher desto haeufiger

    // shootable setzen

    if(this.shootable) {
        // Schuss mit name="enemieshot"? versehen

        this.shootAble = false;
    }
}


Enemy.prototype.onCollisionDetect = function(other, typ) {

    // TODO:
    // falls Schiff getroffen:
    if(other instanceof Enemy) {
        this = bot.createEnemy(level);
    }
    // Asteroid, Schiff, Schuss von Gegner ? -> neu setzen
    // Schuss vom Spieler ? -> explodieren

    // nutze die Methoden {asteroid,enemy}.onCollisionDetect(other)

    // gebe "Ueberlebende" zurueck
}
