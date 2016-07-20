var FileLoader = function() {
    console.log("FileLoader running ...");

    // Pfad zu allen Dateien
    var files = [
        "../res/textures/sky_sphere_map.jpg",
        "../res/models/HeroShipV1.json",
        "../res/models/HeroShipV2.json"
        
    ];
    // Key-Value-Store für die geladenen Dateien (Key: Name => Value: Inhalt)
    var loadedFiles = {};

    // Status des FileLoaders
    var filesSuccessfullyLoaded = 0;

    // Loader für Texturen und JSON initialisieren
    var textureLoader = new THREE.TextureLoader();
    // textureLoader.setCrossOrigin('anonymous');
    var jsonLoader = new THREE.JSONLoader();
    
    // alle gewünschten Files laden
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var h = file.split("/");
        var name = h[h.length-1].split(".")[0];
        var type = h[h.length-1].split(".")[1];

        // abhängig vom Dateityp: korrekten Loader auswählen
        switch (type) {
            case "json":
                jsonLoader.load(file, function (geometry) {
                    loadedFiles[name] = geometry;
                    filesSuccessfullyLoaded += 1;
                });
                break;
            case "jpg": // no break!
            case "jpeg":
                // load texture
                textureLoader.load(file, function (texture) {
                    loadedFiles[name] = texture;
                    filesSuccessfullyLoaded += 1;
                });
                break;
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
        getSkySphereMap: function() {
            // Sky Sphere Map
            return isReady() ? loadedFiles["sky_sphere_map"] : undefined;
        },
        getHeroShip: function() {
            // Hero Space Ship
            return isReady ? loadedFiles["HeroShipV2"] : undefined;
        }
    }
};