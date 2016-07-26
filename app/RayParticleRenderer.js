function RayParticleRenderer(particleColor, nParticles, particleTexture, startVector, endVector) {

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
            this.startVector.x+(Math.random()-0.5),
            this.startVector.y+(Math.random()-0.5),
            this.startVector.z+(Math.random()-0.5)
        );

        particle.x += this.directionVector.x * Math.random() * 0.001;
        particle.y += this.directionVector.y * Math.random() * 0.001;
        particle.z += this.directionVector.z * Math.random() * 0.001;
        
        particle.velocity = new THREE.Vector3(
            this.directionVector.x * Math.random(),
            this.directionVector.y * Math.random(),
            this.directionVector.z * Math.random()
        );
        this.particles.vertices.push(particle);
    }
    this.particleSystem = new THREE.PointCloud(this.particles, this.material);
    
    // zur Szene hinzufügen
    scene.add(this.particleSystem);
    


    this.updateStartAndEndpoint = function(startVector, endVector) {
        this.startVector = startVector;
        this.endVector = endVector;
    };
    
    this.update = function() {
       // console.log("Bin drin");
        var pCount = this.particleCount;
        while (pCount--) {
            var particle = this.particles.vertices[pCount];

            // überprüfen: hat der Particle den Endpunkt erreicht und muss zurückgesetzt werden?
            var distanceFromEndVector = new THREE.Vector3(
                this.endVector.x - particle.x,
                this.endVector.y - particle.y,
                this.endVector.z - particle.z
            );

            var distance = Math.sqrt(
                distanceFromEndVector.x*distanceFromEndVector.x
                +distanceFromEndVector.y*distanceFromEndVector.y
                +distanceFromEndVector.z*distanceFromEndVector.z
            );

            distanceFromEndVector = distanceFromEndVector.normalize();
            var scaling = 50;
            distanceFromEndVector.x *= scaling;
            distanceFromEndVector.y *= scaling;
            distanceFromEndVector.z *= scaling;

            if (distance < this.rayRadius) {

                // Particle hat den Endpunkt erreicht => zurücksetzen!
                particle = new THREE.Vector3(
                    this.startVector.x+(Math.random()-0.5)*0.1,
                    this.startVector.y+(Math.random()-0.5)*0.1,
                    this.startVector.z+(Math.random()-0.5)*0.1
                );

                particle.x += distanceFromEndVector.x * Math.random() * 0.01;
                particle.y += distanceFromEndVector.y * Math.random() * 0.01;
                particle.z += distanceFromEndVector.z * Math.random() * 0.01;
                
                particle.velocity = new THREE.Vector3(0, 0, 0);

                this.particles.vertices[pCount] = particle;
            } else {

                // Particles auf Flugbahn weiterbewegen
                var r = Math.random();
                particle.velocity.x = distanceFromEndVector.x * r * 0.1 + (Math.random()-0.5) * 0.1;
                particle.velocity.y = distanceFromEndVector.y * r * 0.1 + (Math.random()-0.5) * 0.1;
                particle.velocity.z = distanceFromEndVector.z * r * 0.1 + (Math.random()-0.5) * 0.1;

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
