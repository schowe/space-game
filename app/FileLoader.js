//Audio-Variables
var laserAudio;
var rocketAudio;
var explosionAudio;
//var MGAudio;



var FileLoader = function() {
    console.log("FileLoader running ...");

    // Pfad zu allen Dateien
    var files = [
        // Texturen
        "../res/textures/metall.jpg",
        "../res/textures/test.jpg",
        "../res/textures/tex.jpg",
        "../res/textures/sky_sphere_map.jpg",
        "../res/textures/Crosshair.png",
        "../res/textures/RocketTexture.png",


        // Models
        //"../res/meshes/HeroShipV1.json",
        //"../res/meshes/HeroShipV2.json",
        //"../res/meshes/HeroShipV4.json",
        "../res/meshes/HeroShipV5.json",
        "../res/meshes/EnemyMiniShipV1.json",
        "../res/meshes/AsteroidPart1.json",
        "../res/meshes/AsteroidPart2.json",
        "../res/meshes/AsteroidPart3.json",
        "../res/meshes/AsteroidComplete.json",
        "../res/meshes/RocketV1.json",
        "../res/meshes/Asteroid V2.json"
    ];
    // Key-Value-Store für die geladenen Dateien (Key: Name => Value: Inhalt)
    var loadedFiles = {};

    // Status des FileLoaders
    var filesSuccessfullyLoaded = 0;

    function loadJson(file, name) {
        var jsonLoader = new THREE.JSONLoader();
        jsonLoader.load(file,
            function (geometry) {
                // on success:
                console.log("got:"+name);
                loadedFiles[name] = geometry;
                filesSuccessfullyLoaded += 1;
            }
        );
    }

    function loadImage(file, name) {
        var textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');
        // load texture
        textureLoader.load(file, function (texture) {
            console.log("got:"+name);
            loadedFiles[name] = texture;
            filesSuccessfullyLoaded += 1;
        });
    }
    
    // alle gewünschten Files laden
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var h = file.split("/");
        var name = h[h.length-1].split(".")[0];
        var type = h[h.length-1].split(".")[1];

        // abhängig vom Dateityp: korrekten Loader auswählen
        switch (type) {
            case "json":
                loadJson(file, name);
                break;
            case "png": // no break!
            case "jpg": // no break!
            case "jpeg":
                loadImage(file, name);
                break;
            default:
                console.log("Error: unknown file format: "+file);
        }
    }


    //initialize Audio-files

    //Main-laser audio
    laserAudio = document.createElement('audio');
    var laserAudioSource = document.createElement('source');
    laserAudioSource.src = '../res/sounds/gun.wav';
    laserAudio.appendChild(laserAudioSource);

    //rocket audio
    rocketAudio = document.createElement('audio');
    var rocketAudioSource = document.createElement('source');
    rocketAudioSource.src = '../res/sounds/rocket.wav';
    rocketAudio.appendChild(rocketAudioSource);

    explosionAudio = document.createElement('audio');
    var explosionAudioSource = document.createElement('source');
    explosionAudioSource.src = '../res/sounds/explosion.wav';
    explosionAudio.appendChild(explosionAudioSource);

    // MGAudio = document.createElement('audio');
    // var MGAudioSource = document.createElement('source');
    // MGAudioSource.src = 'mg.wav';
    // MGAudio.appendChild(MGAudioSource);



    console.log("FileLoader done.");
    
    function isReady() {
        // gibt true zurück, wenn alle Files geladen wurden
        return (filesSuccessfullyLoaded == files.length);
    }
    
    // "public" Methoden:
    return {
        isReady: isReady,
        getAll: function() {
            // gibt alle geladenen Dateien zurück
            return isReady() ? loadedFiles : undefined;
        },
        get: function(name) {

            return isReady() ? loadedFiles[name] : undefined;
        }
    }
};