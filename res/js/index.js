var camera, scene, renderer, composer;

var spaceship, sphere, planet, spaceshipWrapper;



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
        //scene.add(new THREE.AmbientLight(0x404040));

        var light = new THREE.DirectionalLight(0xffffff);
        // dirLight.castShadow = true;
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
            scene.add(planet);
        });

        // Spaceship
        var loader = new THREE.JSONLoader();
        loader.load("res/meshes/HeroShipV5.json", function (geometry) {
            var textureLoader = new THREE.TextureLoader();
            textureLoader.load("res/textures/TextureHero.png", function (texture) {
                spaceship = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map:texture}));
                spaceship.position.set(0, 0, 0);
                spaceship.rotateY(225);
                // scene.add(spaceship);

                var particleSpawnLocation = new THREE.Mesh({
                    geometry: new THREE.SphereGeometry(0.1, 32, 32),
                    material: new THREE.MeshBasicMaterial()
                });
                particleSpawnLocation.position.set(-5, 0.5, 0); // TODO: anpassen

                spaceshipWrapper = new THREE.Group(); // TODO: bugfix? gibt nen error
                spaceshipWrapper.add(particleSpawnLocation);
                spaceshipWrapper.add(spaceship);
                scene.add(spaceshipWrapper);
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
        //TWEEN.update();
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
        if (spaceship !== undefined) {
            // TODO: dreht sich zu weit

            var time = new Date().getTime() * 0.0005;
            spaceship.position.x = -Math.sin(time) + Math.pow(Math.cos(time), 2);
            spaceship.position.y = -Math.pow(Math.abs(Math.cos(time)) * 0.5, 2);
            spaceship.position.z = Math.sin(time);

            var angle = -Math.sin(time) * 0.0015;
            spaceship.rotateX(angle);
            spaceship.rotateZ(angle * 0.1);
        }

        if (planet !== undefined) {
            planet.rotateX(0.0002);
            planet.rotateY(0.0002);
        }

    }


});