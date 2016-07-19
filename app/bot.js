// Botklasse
function Bot(direction,speed,location) {
    this.direction = direction;
    this.speed = speed;
    this.location = location;
}

Bot.prototype.move = function(delta, asteroids, enemies) {

};

// Sortierfunktion für Bots (Enemies und Asteroids)
// je naeher am Schiff, desto niedriger der Indize
function compare(a,b) {
    // angenommen: Schiff laeuft auf positiver z-Achse
    // bei freier Bewegung: distanceToSquared(player.location)
    if(a.location.z < b.location.z) {
        return -1;
    } else if(a.location.z > b.location.z) {
        return 1;
    } else {
        return 0;
    }
}

// Asteroidenklasse
function Asteroid(direction,speed,location) {
    Bot.call(direction,speed,location);
};

Asteroid.prototype = Object.create(Bot.prototype);
Asteroid.prototype.constructor = Asteroid;

// Enemyklasse
function Enemy(direction,speed,location) {
    Bot.call(direction,speed,location);
};

Enemy.prototype = Object.create(Bot.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.shoot = function() {

};


// aktualisiere Position der Asteroiden und Gegner
// Setze direction neu
function updateLocation(delta) {
    // 1. Schritt: ideale Richtung ausrechnen

    // 2. Schritt: Asteroiden und Gegner sortieren
    asteroids.sort(compare);
    enemies.sort(compare);

    // 3. Schritt: Ausweichen
    // Asteroiden haben keine Intelligenz -> Bewegung behalten
    // Gegner sind intelligent -> allen vor sie liegenden Asteroiden ausweichen
    //                         -> allen vor sie liegenden Gegnern ausweichen
    // -> vordere updaten und Richtung des nächsten anhand der neuen Position
    //    ausrechnen

    // erst ab bestimmter Distanz d_max ausweichen priorisieren
    // ab d_min auf jeden Fall ausweichen


    location = location + direction;
}
