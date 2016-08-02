

function blablubb() {
	//spawnPowerUp(0,0,0, "HEALTH");
	geob = fileLoader.get("Geldsack");
	geotex = fileLoader.get("GeldsackFacePalmTex");
	blubb = new THREE.Mesh(geob, new THREE.MeshPhongMaterial({ map: geotex }));
	
	//blubb.position.set(0,0,0);
	blubb.scale.x = blubb.scale.y = blubb.scale.z = 6;
	//blubb.position.set(ship.position.x, ship.position.y, ship.position.z);
	scene.add(blubb);

	//ship.add( blubb );
	
	//blubb.position.set( 0, 10, 0 );
	
}

