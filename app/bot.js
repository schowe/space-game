// Botklasse

var direction;
var speed;
var location;

bot = function(d,s,l) {
    direction = d;
    speed = s;
    location = l;
}

move: function(delta, asteroids, enemies) {
    // Setze direction neu

    // ausweichen

    // allen Asteroiden
    for(asteroid of asteroids) {

    }

    // sowie allen Schiffen
    for(enemy of enemies) {

    }


    location = location + direction;
}

shoot: function() {

}
