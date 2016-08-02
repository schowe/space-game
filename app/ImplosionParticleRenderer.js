function ImplosionParticleRenderer(particleColor, nParticles, particleTexture, startVector, size) {

    this.startVector = startVector;
    this.particleCount = nParticles;
    this.color = particleColor;

    this.running = true;
    this.clock = new THREE.Clock();
    this.clock.start();

    this.particles = new THREE.Geometry();

    this.material = new THREE.PointsMaterial(
        {
            color: particleColor,
            size: size,
            map: particleTexture,
            blending: THREE.AdditiveBlending,
            transparent: true
        }
    );

    for (var p = 0; p < this.particleCount; p++) {
        var particle = new THREE.Vector3(
            startVector.x,
            startVector.y,
            startVector.z
        );

        particle.x += Math.random() - 0.5;
        particle.y += Math.random() - 0.5;
        particle.z += Math.random() - 0.5;

        particle.velocity = particle.clone().sub(startVector.clone());

        this.particles.vertices.push(particle);
    }

    this.particleimploSystem = new THREE.Points(this.particles, this.material);

    this.currentMovement = 1;

    // zur Szene hinzufügen
    scene.add(this.particleimploSystem);

    this.update = function () {

        if (this.running) {

            var pCount = this.particleCount;

            while (pCount--) {
                var particle = this.particles.vertices[pCount];

                particle.x += particle.velocity.x * this.currentMovement * 0.5;
                particle.y += particle.velocity.y * this.currentMovement * 0.5;
                particle.z += particle.velocity.z * this.currentMovement * 0.5;

                this.particleimploSystem.geometry.__dirtyVertices = true;
            }

            if (this.currentMovement > -1) {
                this.currentMovement -= 0.1;
            } else if (this.currentMovement <= -1) {
                this.running = false;
            }

            this.particles.verticesNeedUpdate = true;

            return true; // weitermachen
        } else {
            scene.remove(this.particleimploSystem);
            return false; //aufhören
        }
    };

}