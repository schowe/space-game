var camera, scene, renderer;

var spaceshipGroup, sphere, planet;

var rayParticleRenderer, rayStart, rayEnd;

$(function () {

    var container;
    var tick;
    var clock = new THREE.Clock(true);

    // start
    init();
    fadeOutLoadingOverlay();
    animate();


    function init() {

        // HTML-Container erzeugen
        container = document.createElement('div');
        document.body.appendChild(container);

        // Kamera und Szene erzeugen
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.0009);
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(12, 15, -20);
        camera.lookAt(scene.position);

        // Renderer
        renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Licht
        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(3, 6, 0);
        scene.add(light);

        // lens flares
        var dirLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
        dirLight.position.set( 5, 5, 5 );
        dirLight.color.setHSL( 0.1, 0.7, 0.5 );
        scene.add( dirLight );


        var textureLoaderLensFlare = new THREE.TextureLoader();
        textureLoaderLensFlare.load("res/textures/lensflare0.png", function (texture1) {
            textureLoaderLensFlare.load("res/textures/lensflare2.png", function (texture2) {
                textureLoaderLensFlare.load("res/textures/lensflare3.png", function (texture3) {
                    var light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
                    light.color.setHSL( 32/255, 1, 0.5 );
                    light.position.set( 5, 5, 5 );
                    scene.add( light );

                    var flareColor = new THREE.Color( 0xffffff );
                    flareColor.setHSL( 0.55, 0.9, 1);

                    var lensFlare = new THREE.LensFlare(texture1, 700, 0.0, THREE.AdditiveBlending, flareColor );

                    lensFlare.add( texture2, 512, 0.0, THREE.AdditiveBlending );
                    lensFlare.add( texture2, 512, 0.0, THREE.AdditiveBlending );
                    lensFlare.add( texture2, 512, 0.0, THREE.AdditiveBlending );

                    lensFlare.add( texture3, 60, 0.6, THREE.AdditiveBlending );
                    lensFlare.add( texture3, 70, 0.7, THREE.AdditiveBlending );
                    lensFlare.add( texture3, 120, 0.9, THREE.AdditiveBlending );
                    lensFlare.add( texture3, 70, 1.0, THREE.AdditiveBlending );

                    //lensFlare.customUpdateCallback = lensFlareUpdateCallback;
                    lensFlare.position.copy( light.position );

                    scene.add( lensFlare );
                });
            });
        } );


        // Skybox
        var textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');
        textureLoader.load('../res/textures/sky_sphere_map.jpg', function (texture) {
            var geometry = new THREE.SphereGeometry(1000, 256, 256);

            var material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });

            sphere = new THREE.Mesh(geometry, material);

            scene.add(sphere);
        });

        // Planet
        var textureLoader2 = new THREE.TextureLoader();
        textureLoader2.setCrossOrigin("anonymous");
        textureLoader2.load("../res/textures/Planet.png", function (texture) {
            var geometry = new THREE.SphereGeometry(100, 128, 128);
            var material = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide
            });
            planet = new THREE.Mesh(geometry, material);
            planet.position.set(-500, -500, 300);
            planet.rotateZ(0.5);
            planet.castShadow = true;
            scene.add(planet);
        });

        // Spaceship
        var loader = new THREE.JSONLoader();
        loader.load("res/meshes/HeroShipV5.json", function (geometry) {
            var textureLoader = new THREE.TextureLoader();
            textureLoader.load("res/textures/TextureHero.png", function (texture) {
                var spaceship = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map:texture}));
                spaceship.position.set(0, 0, 0);
                spaceship.rotateY(-1.571);
                // spaceship.visible = false;

                var sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
                var material =  new THREE.MeshBasicMaterial();

                rayStart = new THREE.Mesh(sphereGeometry, material);
                rayStart.translateX(-5);
                rayStart.visible = false;

                rayEnd = new THREE.Mesh(sphereGeometry, material);
                rayEnd.translateX(-8);
                rayEnd.visible = false;

                spaceshipGroup = new THREE.Group();
                spaceshipGroup.add(spaceship);
                spaceshipGroup.add(rayStart);
                spaceshipGroup.add(rayEnd);
                scene.add(spaceshipGroup);

                rayParticleRenderer = new RayParticleRenderer(
                    0x2255ff,10000,"res/textures/particle.png",
                    rayStart.position, rayEnd.position
                );

            });
        });



        // Event-Listener für Resize
        window.addEventListener("resize", onWindowResize, false);
        window.addEventListener("mousemove", onMouseMove, false);

    }






    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(e) {
        if (e.isTrusted) {
            var x = Math.abs(e.clientX/window.innerWidth)-0.5;
            var y = Math.abs(e.clientY/window.innerHeight)-0.5;
            //console.log(x+"/"+y);

            var scaling = 20;
            $("#overlay-highscore").css("margin-right", 50+x*scaling+"px");
            $("#overlay-highscore").css("padding-top", 50-y*scaling+"px");
            $("#overlay-menu").css("margin-left", 50-x*scaling+"px");
            $("#overlay-menu").css("padding-top", 50-y*scaling+"px");
        }
    }


    function animate() {
        requestAnimationFrame(animate);
        render();

        // animation goes here

        moveSpaceship();
    }


    function render() {
        // dont touch!
        renderer.render(scene, camera);

    }

    function fadeOutLoadingOverlay() {
        setTimeout(function() {
            $("#loading-overlay").fadeOut();
        }, 2000);
    }

    function moveSpaceship() {
        if (spaceshipGroup !== undefined && rayParticleRenderer !== undefined) {

            var time = new Date().getTime() * 0.0005;

            spaceshipGroup.position.set(
                -Math.sin(time) + Math.pow(Math.cos(time), 2),
                -Math.pow(Math.abs(Math.cos(time)) * 0.5, 2),
                Math.sin(time)
            );

            var angle = -Math.sin(time) * 0.0015;
            spaceshipGroup.rotateX(angle);
            spaceshipGroup.rotateZ(angle * 0.1);

            var newStart = new THREE.Vector3(
                spaceshipGroup.position.x+rayStart.position.x,
                spaceshipGroup.position.y+rayStart.position.y,
                spaceshipGroup.position.z+rayStart.position.z
            );
            var newEnd = new THREE.Vector3(
                spaceshipGroup.position.x+rayEnd.position.x,
                spaceshipGroup.position.y+rayEnd.position.y,
                spaceshipGroup.position.z+rayEnd.position.z
            );

            rayParticleRenderer.updateStartAndEndpoint(newStart, newEnd);
            rayParticleRenderer.update();
        }

        if (planet !== undefined) {
            planet.rotateX(0.0002);
            planet.rotateY(0.0002);
        }

    }


});