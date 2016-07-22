function RayParticleRenderer(particleColor, nParticles, particleTexture, startVector, endVector) {

    function rand() {
        return Math.random();
    }

    // TODO: Partikel anzahl begrenzen! sonst aua für den computer

    // TODO: camera position verwenden als endVector ?

    this.rayRadius = 1; // TODO: evtl konfigurierbar machen?
    this.startVector = startVector;
    this.endVector = endVector;
    this.particleCount = nParticles;
    this.particles = new THREE.Geometry();
    
    // Material erstellen
    this.material = new THREE.PointCloudMaterial(
        {
            color: particleColor,
            size: 1,
            map: THREE.ImageUtils.loadTexture(particleTexture), // TODO: Fileloader benutzen
            blending: THREE.AdditiveBlending,
            transparent: true
        }    
    );
    
    // Flugrichtung der Particles bestimmen
    this.directionVector = new THREE.Vector3(
        this.endVector.x - this.startVector.x,
        this.endVector.y - this.startVector.y,
        this.endVector.z - this.startVector.z
    );
    
    // Particles initial erstellen (am Startvektor) mit Velocity (zum Endvektor)
    for (var p = 0; p < this.particleCount; p++) {
        var particle = new THREE.Vector3(
            this.startVector.x,
            this.startVector.y,
            this.startVector.z
        );

        particle.x += this.directionVector.x * rand() * 0.001;
        particle.y += this.directionVector.y * rand() * 0.001;
        particle.z += this.directionVector.z * rand() * 0.001;
        
        particle.velocity = new THREE.Vector3(
            this.directionVector.x * rand(),
            this.directionVector.y * rand(),
            this.directionVector.z * rand()
        );
        this.particles.vertices.push(particle);
    }
    this.particleSystem = new THREE.PointCloud(this.particles, this.material);
    
    // zur Szene hinzufügen
    scene.add(this.particleSystem);
    



    
    
    this.update = function() {

        var pCount = this.particleCount;
        while (pCount--) {
            var particle = this.particles.vertices[pCount];
            
            
            // überprüfen: hat der Particle den Endpunkt erreicht und muss zurückgesetzt werden?
            var distanceFromEndVector = new THREE.Vector3(
                Math.abs(this.endVector.x - particle.x),
                Math.abs(this.endVector.y - particle.y),
                Math.abs(this.endVector.z - particle.z)
            );

            var distance = Math.sqrt(
                distanceFromEndVector.x*distanceFromEndVector.x
                +distanceFromEndVector.y*distanceFromEndVector.y
                +distanceFromEndVector.z*distanceFromEndVector.z);

            if (distance < this.rayRadius) {
                // Particle hat den Endpunkt erreicht => zurücksetzen!
                particle = new THREE.Vector3(
                    this.startVector.x,
                    this.startVector.y,
                    this.startVector.z
                );

                particle.x += this.directionVector.x * rand() * 0.001;
                particle.y += this.directionVector.y * rand() * 0.001;
                particle.z += this.directionVector.z * rand() * 0.001;

                particle.velocity = new THREE.Vector3(0, 0, 0);

                this.particles.vertices[pCount] = particle;
            } else {

                // Particles auf Flugbahn weiterbewegen
                var r = rand();
                particle.velocity.x = this.directionVector.x * r * 0.1 + (rand()-0.5) * 0.1;
                particle.velocity.y = this.directionVector.y * r * 0.1 + (rand()-0.5) * 0.1;
                particle.velocity.z = this.directionVector.z * r * 0.1 + (rand()-0.5) * 0.1;

                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;
                particle.z += particle.velocity.z;

                this.particles.vertices[pCount] = particle;
            }

            this.particleSystem.geometry.__dirtyVertices = true;
        }
        this.particles.verticesNeedUpdate = true;
    };

    
}

// particleExplosion: function (vector, maxRadius, duration, color) {
