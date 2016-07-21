# Space Game

In dieser Gruppe soll ein 3D-Space-Shooter entwickelt werden, in dem der Spieler ein Raumschiff steuern und sich – ähnlich wie bei Asteroids – gegen Wellen verschiedener Feinde wehren muss, um dabei möglichst lange zu überleben.

Verschiedene Waffen und Waffenstärken sowie unterschiedliche Gegnertypen (z. B. unterschieden durch bewaffnet/unbewaffnet) sollen für Abwechslung und die Abgrenzung zu oben genanntem Spiel sorgen. Durch die drei Dimensionen ist es wichtig, auf unterschiedlichste Kollisionen und auf möglichst realistische Bewegungsmuster zu achten. Sollte das Grundgerüst einmal stehen, wären mögliche Erweiterungen z. B. ein Shop-System oder dynamische Spawns/Spawnpositionen.

Dieses Spiel wird in JavaScript mit three.js entwickelt. Teilweise wird auch mit Blender gearbeitet werden; diese Arbeit wird aber nicht im Vordergrund stehen. 


# How To

Um das Spiel zu starten muss ein HTTP-Server laufen:

1. im Basisordner des Projektes folgende Zeile in der Konsole ausführen: `python -m SimpleHTTPServer 8080`
2. Webbrowser öffnen und folgende Adresse aufrufen: `http://localhost:8080`
3. Läuft!
4. Server beenden mit `Strg+C` in der Konsole

Alternativ: Skript benutzen

1. (einmalig) Ausführberechtigungen für das Skript: `chmod +x start_server`
2. im Basisordner Skript ausführen mit `./start_server`
3. ... wie oben


# Ordnerstruktur

`app/` ist der **Hauptordner**, in dem sich das Spiel befindet

`app/game.html` und `app/core.js` sind die **Hauptdateien des Spiels** (bislang mit Beispielcode)

`res/` ist der **Resourcenordner** für statische Files (CSS-Stylesheets, Texturen, Sounds, ...) und 3rd Party Plugins für Javascript
 
`index.html` ist die Website mit dem **Hauptmenü**


also: Sachen mit Three.js werden in `app/core.js` programmiert  
