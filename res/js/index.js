$(function() {
    // TODO: WebSQL ist eigentlich veraltet. Funktioniert für die App hier aber super. Ersatz finden?

    // open simple sql database for highscores
    var db = openDatabase("spacegame", "1.0", "spacegame highscores", 2*1024*1024);
    db.transaction(function (tx) {
        // create highscore table
        //tx.executeSql("DROP TABLE IF EXISTS highscore");
        tx.executeSql("CREATE TABLE IF NOT EXISTS highscore (id INTEGER PRIMARY KEY ASC, player TEXT, points INTEGER)");

        // ... testdaten
        tx.executeSql("INSERT OR REPLACE INTO highscore VALUES (1, 'JP', 1000000)");
        tx.executeSql("INSERT OR REPLACE INTO highscore VALUES (2, 'alle anderen', 1)");

        // load highscores
        tx.executeSql("SELECT * FROM highscore ORDER BY points DESC LIMIT 0,10", [], function(tx, results) {
            for (var i = 0; i < results.rows.length; i++) {
                var highscore = results.rows[i];
                // add highscore to table
                var row = '<tr><td>'+(i+1)+'</td><td>'+highscore["player"]+'</td><td>'+highscore["points"]+'</td></tr>';
                $('#highscore > tbody:last-child').append(row);
            }
        });
    });

    $("#form").submit(function() {
        var playerName = $("#player").val();
        localStorage.setItem("player", playerName);

        // => Spielername kann nun mit localStorage.getItem("player")
        // aufgerufen werden auf der nächsten HTML Seite
    });




    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    var container;

    var camera, scene, scene2, renderer;

    var mouseX = 0, mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {



        document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    }


    function onDocumentMouseMove(event) {

        mouseX = ( event.clientX - windowHalfX );
        mouseY = ( event.clientY - windowHalfY );

    }


    function animate() {

        requestAnimationFrame( animate );

        render();
        stats.update();

    }

    function render() {

        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - ( mouseY - 200) - camera.position.y ) * .05;

        camera.lookAt( scene.position );

        // renderer.clear();

        renderer.render( scene, camera );

    }





});