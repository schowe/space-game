var minObstacleDistance = 100;
var maxAsteroidSize     = 30;
var guardingRadius      = 50;
var minDistanceToPlayer = 200;
var maxShipAngle        = 70 * (Math.PI / 360);

var BOSS1  = 1;
var BOSS2  = 2;
var SMALL1 = 3;
var SMALL2 = 4;

var asteroids, enemies, enemy, asteroid, playerPosition,
    radius, i, bezierPoints, geometryB, textureB, MATH, bot;

// Enemyklasse
// Hier nichts direkt aufrufen, Aufrufe werden ueber Bot.js geregelt
// (Ausnahme: Collision soll auf onCollisionDetect zugreifen)
function Enemy(location, speed, level, typ) {
    // TODO: unterschiedliche Enemies

    // Waffe setzen und Groesse aendern
    // TODO: weaponguard
    switch(typ) {
        case BOSS1:
            geometryB = fileLoader.get("EnemyMiniShipV1");
            this.weapon = 1;
            this.scale.set(1,1,1);
            break;
        case BOSS2:
            geometryB = fileLoader.get("EnemyMiniShipV1");
            this.weapon = 1;
            this.scale.set(1,1,1);
            break;
        case SMALL1:
            geometryB = fileLoader.get("EnemyMiniShipV1");
            this.weapon = 1;
            this.scale.set(1,1,1);
            break;
        case SMALL2:
            geometryB = fileLoader.get("EnemyMiniShipV1");
            this.weapon = 1;
            this.scale.set(1,1,1);
            break;
        default:
            geometryB = fileLoader.get("EnemyMiniShipV1");
            this.weapon = 1;
            this.scale.set(1,1,1);
    }
    geometryB = fileLoader.get("HeroShipV5");
    this.scale.set(20,20,20);

    var textureB  = fileLoader.get("TextureHero");



    // Mesh setzen
    THREE.Mesh.call(this, geometryB,
                    new THREE.MeshPhongMaterial({map: textureB}));        

    MATH = MATHX();

    this.speed      = speed;
    this.position.set(location.x,location.y,location.z);    
    this.level      = level;
    this.isAlive    = true;
    this.shootAble  = false;
    this.onPlayerAttack  = false;
    // Initialen Ausrichtungsvektor
    this.lookAt(playerPosition);
    // .. und direction
    this.direction  = MATH.clone(playerPosition);
    this.direction.sub(this.position);
    this.direction.normalize();

    this.oldDir = MATH.clone(this.direction);

    // Listen updaten
    bot = Bot();
    asteroids = bot.getAsteroids();
    enemies   = bot.getEnemies();

}

Enemy.prototype.constructor = Asteroid;
Enemy.prototype = new THREE.Mesh;

// TODO: currentDir merken und einfließen lassen -> weniger hakelig (Traegheit)
Enemy.prototype.move = function(delta, asteroids, enemies) {
    var avoidDir, d, distanceToShip, collision, translate,
        possibleObstacle, dir, optimalDir;
    var avoidDirs = [];
    var collisions = [];

    asteroids = bot.getAsteroids();
    enemies   = bot.getEnemies();

    playerPosition = ship.position;

    // 0. Schritt: Checke ob auf Bezierkurve oder nicht
    if(this.onPlayerAttack) {
        // Achte darauf, dass sich der Spieler nicht um mehr als 90° zur
        // urspruenglichen Richtung gedreht hat
        var renew = false;
        // Falls Spieler umgedreht (im Vergleich zum initialisieren), neu machen
        if(MATH.dot(this.oldDir,this.direction) < 0) {
            renew = true;
        }

        optimalDir = this.moveBezier(renew, delta);
        optimalDir.normalize();

        console.log("Points Bezier:_"+ this.points.length);
        if(this.points.length == 0) {
            this.onPlayerAttack = false;
        }

    } else {

        // 1. Schritt: Gehe in Richtung Spieler (Idealrichtung)
        var directionToPlayer = MATH.clone(playerPosition);
        directionToPlayer.sub(this.position);

        var distanceToNext = directionToPlayer.length();

        directionToPlayer.normalize();

        // TODO: Fuer Bezier Wechsel auf optimalDir
        optimalDir = MATH.clone(directionToPlayer);

        // 2. Schritt: Ueberpruefe, ob dem Spieler zu nahe geraten
        if(distanceToNext < minDistanceToPlayer){
            // Gelange hinter dem Spieler:
            // fliege in Bezierkurve hinter den Flieger
            // setze Idealrichtung als Richtung zu naechstem Punkt auf der Kurve
            // berechne Bezierkurve und setze flag onBezier = true
            onPlayerAttack = true;

            // TODO: Init Bezier-Kurve und gebe ersten Punkt vor
            optimalDir = this.moveBezier(true, delta);
            optimalDir.normalize();
        }
    }

    this.direction.x = optimalDir.x;
    this.direction.y = optimalDir.y;
    this.direction.z = optimalDir.z;

    dir = optimalDir;

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
        d = Math.abs(shipDistance - asteroid.position.distanceTo(playerPosition));

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
            if(distanceToShip <= minObstacleDistance && enemy!=this) { // nahe an this
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
    // ab hier TODO
    if(obstacles.length > 0) {
        // Unterscheide nach Faellen, da der Algorithmus fuer mehrere
        // Hindernisse rechenintensiv ist (rendert die Szene neu)

        // einfacher Fall: nur ein Hindernis
        if(obstacles.length == 1) {
            obstacle = obstacles[0];
            var flightAngle =
                MATH.dot(obstacle.direction,this.direction);

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


                // Gewichte die Laengen, um Kollision zu vermeiden
                var bestImpact = this.position.distanceTo(obstacles[0].position);
                var avoidImpact = 1.5 * maxAsteroidSize;

                avoidDir.multiplyScalar(avoidImpact);

                dir = MATH.clone(optimalDir);
                dir.multiplyScalar(bestImpact);
                dir.add(avoidDir);

                console.log(dir.x, dir.y, dir.z);


            } else {
            // sonst, weiche aus bzw. zerschiesse Asteroid wie aufs Zettel 1
            // TODO: U,V nehmen -> orthogonal verschieben und schiesse zuvor
            this.shoot();
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
            // !!!! TODO
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
            collision = this.checkDirection(dir, obstacles);
            directionFound = (collision == 0);

            if(directionFound) {
                // Falls bevorzugte Richtung geht, gehe in diese Richtung
                // mit einem kleinen vom "Fehler" abhaengigen Unterschied
                dir = new THREE.Vector3(
                                Math.random(), Math.random(), Math.random());
                //direction.addScalar(directionError);
               dir.add(optimalDir.multiplyScalar(distanceToNext));
               optimalDir.normalize();
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
                    avoidDir = MATH.clone(optimalDir);
                    switch(i) {
                        case 0: avoidDir = avoidDir.add(U).add(V); break;
                        case 1: avoidDir = avoidDir.add(U).sub(V); break;
                        case 2: avoidDir = avoidDir.sub(U).add(V); break;
                        case 3: avoidDir = avoidDir.sub(U).sub(V); break;
                        default:avoidDir = optimalDir;
                    }

                    avoidDirs.push(avoidDir);
                    collisions[i] = this.checkDirection(avoidDir, obstacles);
                    directionFound = (collisions[i] == 0);

                    if(directionFound) {
                        dir = avoidDir;
                        break;
                    }
                }

                var iter = 0;
                do {
                    // 4.1.4a Bestimme Richtung mit minimaler Kollisionsanzahl
                    if(!directionFound) {
                        dir = avoidDirs[MATH.getMinIndex(collisions)];
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
                    for(var i = 0; i < 4; i++) {
                        avoidDir = MATH.clone(optimalDir);
                        avoidDir.add(translate);

                        // TODO: Verschiebe avoidDir ein Stückchen
                        switch(i) {
                            case 0: avoidDir = avoidDir.add(U).add(V); break;
                            case 1: avoidDir = avoidDir.add(U).sub(V); break;
                            case 2: avoidDir = avoidDir.sub(U).add(V); break;
                            case 3: avoidDir = avoidDir.sub(U).sub(V); break;
                            default: avoidDir = optimalDir;
                        }

                        collision = this.checkDirection(avoidDir, obstacles);
                        directionFound = (collision == 0);

                        if(directionFound) {
                           dir = avoidDir;
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

                        for(var i = 0; i < 4; i++) {
                            avoidDir = MATH.clone(this.direction);
                            avoidDir.add(translate);
                            switch(i) {
                                case 0: avoidDir = avoidDir.add(U).add(V);break;
                                case 1: avoidDir = avoidDir.add(U).sub(V);break;
                                case 2: avoidDir = avoidDir.sub(U).add(V);break;
                                case 3: avoidDir = avoidDir.sub(U).sub(V);break;
                                default: avoidDir = optimalDir;
                            }

                            collision = this.checkDirection(avoidDir, obstacles);
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

                    for(var i = 0; i < 9; i++) {
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
                            dir = MATH.clone(optimalDir);
                        } else {
                            dir = new THREE.Vector3(0,0,0);
                        }

                        dir.add(avoidDir);

                        //  teste, ob diese geht
                        collision = this.checkDirection(dir, obstacles);
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

                    var j = 0;
                    while(!directionFound) {

                        dir = MATH.clone(optimalDir);

                        switch(j) {
                            case 0:
                                dir = direction.add(U).add(V);
                                break;
                            case 1:
                                dir = direction.add(U).sub(V);
                                break;
                            case 2:
                                dir = direction.sub(U).add(V);
                                break;
                            case 3:
                                dir = direction.sub(U).sub(V);
                                break;
                            default: dir = optimalDir;
                        }



                        collision = this.checkDirection(dir, obstacles);
                        directionFound = (collision == 0);
                        j++;
                    }

                    // Falls dies auch nicht geht, gehe orthogonal
                    // Raycaster in v x e1, v x e2, v x e3 -> falls nichts getroffen -> hierhin
                    if(!directionFound) {
                    // nur in diese Richtung nicht linearkominiert
                        for(var i = 0; i < 6; i++) {
                            dir = MATH.clone(optimalDir);
                            switch(i) {
                                case 0:
                                    dir.cross(new THREE.Vector3(1,0,0));
                                    break;
                                case 1:
                                    dir.cross(new THREE.Vector3(0,1,0));
                                    break;
                                case 2:
                                    dir.cross(new THREE.Vector3(0,0,1));
                                    break;
                                case 3:
                                    dir.cross(new THREE.Vector3(-1,0,0));
                                    break;
                                case 4:
                                    dir.cross(new THREE.Vector3(0,-1,0));
                                    break;
                                case 5:
                                    dir.cross(new THREE.Vector3(0,0,-1));
                                    break;
                                default: break;
                            }

                            collision = this.checkDirection(dir, obstacles);
                            directionFound = (collision == 0);

                            if(directionFound) {
                                break;
                            }
                        }


                        if(!directionFound) {
                            // Falls alles versperrt, bleibe stehen und schiesse
                            dir = new THREE.Vector3(0,0,0);
                            this.shootAble = true;
                        }
                    }
                }
            }
        }

    } else {
        dir = MATH.clone(optimalDir);
        shootAble = true;
    }

    // 5. Schritt: normalisiere, um Geschwindigkeit nur von speed
    //                              abhaengig zu machen
    dir.normalize();
    //this.direction = MATH.clone(dir);

    
    // 6. Schritt:
    console.log("Position enemy before: ("+this.position.x+","+this.position.y+","+this.position.z+")");
    console.log("Direction: ("+dir.x+","+dir.y+","+dir.z+")");

    dir.multiplyScalar(delta * this.speed);
    this.position.x += dir.x;
    this.position.y += dir.y;
    this.position.z += dir.z;
    // this.position.x += this.direction.x;
    // this.position.y += this.direction.y;
    // this.position.z += this.direction.z;
    console.log("Position enemy after: ("+this.position.x+","+this.position.y+","+this.position.z+")");
    console.log("Direction at init: ("+this.direction.x+","+this.direction.y+","+this.direction.z+")");




    // 7. Schritt: rotieren mit lookAt
    dir.normalize();
    var viewDir = MATH.clone(this.position);
    viewDir.add(dir.multiplyScalar(this.speed));
    this.lookAt(viewDir);

    // 8. Schritt: Speichern
    this.oldDir = MATH.clone(dir);

}

// @return optimale Richtung nach Bezierflugbahn
// TODO: In aufrufender Klasse Fallunterscheidung
Enemy.prototype.moveBezier = function(renew, delta) {
    var p1, p2;
    var shipSize = 9;

    this.points = [];

    // Falls noch nicht erzeugt oder Spieler sich um mehr als 90° gedreht hat
    if(renew) {
        this.speed /= 10;
        var distanceToPlayer = this.position.distanceTo(ship.position);
        // Vektor zum Spieler
        var N = MATH.clone(ship.position);
        N.sub(this.position);

        // orthogonale Vektoren, um Plane aufzuspannen
        var U = MATH.clone(N);
        U.cross(new THREE.Vector3(0,1,0));
        var V = MATH.clone(U);
        V.cross(N);

        U.normalize();
        V.normalize();

        // vor dem Spieler
        if(MATH.dot(this.direction,this.direction) <= 0) {// !! TODO: Nachfragen player.direction
            p1 = MATH.clone(ship.position);
            p1.add(U.addScalar(shipSize + Math.random() * shipSize));
            p1.add(V.addScalar(shipSize + Math.random() * shipSize));
            U.normalize();
            V.normalize();
            p2 = MATH.clone(ship.position);
            p2.add(N.addScalar(0.5));
            p2.add(U.addScalar(Math.random() * (shipSize + Math.random() * shipSize)));
            p2.add(V.addScalar(Math.random() * (shipSize + Math.random() * shipSize)));
            U.normalize();
            V.normalize();
            N.addScalar(2);
        } else { // hinter dem Spieler
            p1 = MATH.clone(this.position);
            p1.add(N.addScalar(2/3));
            p1.add(U.addScalar(shipSize + Math.random() * shipSize));
            p1.add(V.addScalar(shipSize + Math.random() * shipSize));
            U.normalize();
            V.normalize();
            N.addScalar(3/2);

            p2 = MATH.clone(this.position);
            p2.add(N.addScalar(1/3));
            p2.add(U.addScalar(shipSize + Math.random() * shipSize));
            p2.add(V.addScalar(shipSize + Math.random() * shipSize));
            U.normalize();
            V.normalize();
            N.addScalar(3);
        }

        var curve = new THREE.SplineCurve3([
            this.position,
            p1,
            p2,
            ship.position]);

        this.points = curve.getPoints(5 / delta);
    }
    
    // Punkte abarbeiten mit points.shift();
    var dir = this.points.shift();
    dir.sub(this.position);
    return dir;
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
 //       this = bot.createEnemy(level);
    }
    // Asteroid, Schiff, Schuss von Gegner ? -> neu setzen
    // Schuss vom Spieler ? -> explodieren

    // nutze die Methoden {asteroid,enemy}.onCollisionDetect(other)

    // gebe "Ueberlebende" zurueck
}
