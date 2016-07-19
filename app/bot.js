// Botklasse
function Bot(direction,speed,location) {
    this.direction = direction;
    this.speed = speed;
    this.location = location;
}

Bot.prototype.move = function(delta, asteroids, enemies) {

};


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

    // 3. Schritt: Ausweichen
    // Asteroiden haben keine Intelligenz -> Bewegung behalten
    // Gegner sind intelligent -> allen vor sie liegenden Asteroiden ausweichen
    //                         -> allen vor sie liegenden Gegnern ausweichen
    // -> vordere updaten und Richtung des nächsten anhand der neuen Position
    //    ausrechnen



    location = location + direction;
}
