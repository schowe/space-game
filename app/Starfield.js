var Starfield = function () {

    var fieldSize = 5000;
    var N_PARTICLES = 500000;


    this.lastPosition = ship.position.clone();

    this.particles = new THREE.Geometry();
    this.particleCount = N_PARTICLES;

    this.material = new THREE.PointsMaterial(
        {
            color: 0xffffff,
            size: 5,
            map: fileLoader.get("particle"),
            blending: THREE.AdditiveBlending,
            transparent: true
        }
    );



    for (var p = 0; p < this.particleCount; p++) {
        var particle = new THREE.Vector3(
            ship.position.x + Math.floor((Math.random()-0.5) * 2 * fieldSize),
            ship.position.y + Math.floor((Math.random()-0.5) * 2 * fieldSize),
            ship.position.z + Math.floor((Math.random()-0.5) * 2 * fieldSize)
        );
        
        this.particles.vertices.push(particle);
    }
    
    this.particleSystem = new THREE.Points(this.particles, this.material);
    scene.add(this.particleSystem);


    this.update = function() {


        var distanceToLastPosition = Math.abs(ship.position.distanceTo(this.lastPosition));

        if (distanceToLastPosition > fieldSize * 0.75) {

            console.log("update");

            this.lastPosition = ship.position.clone();

            var pCount = this.particleCount;
            while (pCount--) {
                this.particles.vertices[pCount] = new THREE.Vector3(
                    ship.position.x + Math.floor((Math.random()-0.5) * 2 * fieldSize),
                    ship.position.y + Math.floor((Math.random()-0.5) * 2 * fieldSize),
                    ship.position.z + Math.floor((Math.random()-0.5) * 2 * fieldSize)
                );

                this.particleSystem.geometry.__dirtyVertices = true;
            }
        }


        this.particles.verticesNeedUpdate = true;
    }

};