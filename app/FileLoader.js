var FileLoader = function() {
    console.log("FileLoader running ...");

    // Pfad zu allen Dateien
    var files = [
        // Texturen
        "../res/textures/metall.jpg",
        "../res/textures/test.jpg",
        "../res/textures/tex.jpg",
        "../res/textures/sky_sphere_map.jpg",

        // Models
        "../res/meshes/HeroShipV1.json",
        "../res/meshes/HeroShipV2.json",
        "../res/meshes/EnemyMiniShipV1.json",
        "../res/meshes/AsteroidPart1.json",
        "../res/meshes/AsteroidPart2.json",
        "../res/meshes/AsteroidPart3.json",
        "../res/meshes/AsteroidComplete.json"
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

    function loadJpeg(file, name) {
        var textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');
        // load texture
        textureLoader.load(file, function (texture) {
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
            case "jpg": // no break!
            case "jpeg":
                loadJpeg(file, name);
                break;
            default:
                console.log("Error: unknown file format: "+file);
        }
    }

    console.log("FileLoader done.");
    
    function isReady() {
        // gibt true zurück, wenn alle Files geladen wurden
        return (filesSuccessfullyLoaded == files.length);
    }
    
    // "public" Methoden:
    return {
        isReady: function() {
            // gibt true zurück, wenn alle Files geladen wurden
            return isReady();
        },
        getAll: function() {
            // gibt alle geladenen Dateien zurück
            return isReady() ? loadedFiles : undefined;
        },
        get: function(name) {
            return isReady() ? loadedFiles[name] : undefined;
        }
    }
};