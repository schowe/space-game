var ParticleHandler = function () {

    var currentExplosions = [];
    var currentImplosions = [];
    var currentHalos = [];

    function addlittleExplosion(position, lifetime, color, speed, size){
        if (speed == undefined) speed = 1;
        if (size == undefined) size = 1;

        // explosion 15 bewegungsschritte laufen lassen

        var explosion = new ExplosionParticleRenderer(color, 2500, fileLoader.get("particle_grey"), lifetime, position, speed, size);

      /*  for (var i = 0; i < 15; i++) {

            explosion.update();
        }*/
        currentExplosions.push(explosion); 
    }

    function addExplosion(position, lifetime, color, speed, size) {


        if (speed == undefined) speed = 1;
        if (size == undefined) size = 1;

        // explosion 15 bewegungsschritte laufen lassen

        var explosion = new ExplosionParticleRenderer(color, 5000, fileLoader.get("particle_grey"), lifetime + 2, position, speed, size);

        for (var i = 0; i < 15; i++) {

            explosion.update();
        }
        currentExplosions.push(explosion);

    }


    function addImplosion(position) {

        var implosion = new ImplosionParticleRenderer(0xffcc11, 5000, fileLoader.get("particle_grey"), position, 1);

        currentImplosions.push(implosion);

    }


    function addHalo(position, lifetime, color) {
        var halo = new HaloParticleRenderer(color, 10000, fileLoader.get("particle_grey"), lifetime, position, 1, 30);
        currentHalos.push(halo);
    }

    return {

        addlittleExplosion: addlittleExplosion,

        addExplosion: addExplosion,

        addImplosion: addImplosion,

        addHalo: addHalo,

        update: function () {

            for (var i = 0; i < currentExplosions.length; i++) {
                var explosion = currentExplosions[i];
                var successful = explosion.update();
                if (!successful) {
                    currentExplosions.splice(i, 1);
                }
            }

            for (var i = 0; i < currentImplosions.length; i++) {
                var implosion = currentImplosions[i];

                var successful = implosion.update();
                if (!successful) {
                    // Explosion starten
                    addExplosion(implosion.startVector, 1, implosion.color, 1, 1);
                    addHalo(implosion.startVector, 2, implosion.color);

                    // Implosion löschen
                    currentImplosions.splice(i, 1);
                }
            }

            for (var i = 0; i < currentHalos.length; i++) {
                var halo = currentHalos[i];
                var successful = halo.update();
                if (!successful) {
                    currentHalos.splice(i, 1);
                }
            }

        }
    };

};
