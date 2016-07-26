var ExplosionParticleHandler = function() {
  
    var currentExplosions = [];
    
    return {
        addExplosion: function(position, lifetime, color) {
            var explosion = new ExplosionParticleRenderer(color, 100000, fileLoader.get("particle"), lifetime, position);
            
            currentExplosions.push(explosion);
        },
        update: function() {
            for (var i = 0; i < currentExplosions.length; i++) {
                var explosion = currentExplosions[i];
                var successful = explosion.update();
                if (!successful) {
                    currentExplosions.splice(i,1);
                }
            }
            console.log(currentExplosions.length);
        }
    }
    
};