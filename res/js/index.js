$(function() {

    var container;

    var camera, scene, renderer, composer;

    var spaceship;


    // start
    init();
    animate();

    function init() {

        // HTML-Container erzeugen
        container = document.createElement( 'div' );
        document.body.appendChild( container );

        // Kamera und Szene erzeugen
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0x000000, 0.0005 );
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
        camera.position.set(12, 15, -20);
        camera.lookAt(scene.position);

        // Renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        // Event-Listener für Resize
        window.addEventListener( 'resize', onWindowResize, false );

        // Licht
        scene.add( new THREE.AmbientLight( 0x404040 ) );
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 3, 6, 0 );
        scene.add( light );

        // Skybox
        var textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');
        textureLoader.load('../res/textures/sky_sphere_map.jpg', function (texture) {
            var geometry = new THREE.SphereGeometry(1000, 20, 20);

            var material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });

            sphere = new THREE.Mesh(geometry, material);

            sphere.position.set(0, 0, 0);
            scene.add(sphere);
        });

        // Spaceship
        var loader = new THREE.JSONLoader();
        loader.load("res/models/HeroShipV2.json", function(geometry) {
            spaceship = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: "orange"}));
            spaceship.position.set(0, 0, 0);
            scene.add(spaceship);
        });

        // composer = new THREE.EffectComposer( renderer );
        // composer.addPass( new THREE.RenderPass( scene, camera ) );
        //
        // glitchPass = new THREE.GlitchPass();
        // glitchPass.renderToScreen = true;
        // composer.addPass( glitchPass );

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );

    }


    function animate() {
        requestAnimationFrame( animate );
        render();

        // animation goes here
        moveSpaceship();
    }


    function render() {
        // dont touch!
        renderer.render( scene, camera );

    }

    function moveSpaceship() {
        if (spaceship !== undefined) {
            var time = new Date().getTime()*0.0005;
            spaceship.position.x = -Math.sin(time)+Math.pow(Math.cos(time), 2);
            spaceship.position.y = -Math.pow(Math.abs(Math.cos(time))*0.5, 2);
            spaceship.position.z = Math.sin(time);

            var angle = -Math.sin(time)*0.0015;
            spaceship.rotateX(angle);
            spaceship.rotateZ(angle*0.1);
        }
    }


});