var powerUps = [];
var types = [];
var itemHitBoxes = [];
var shieldActive = false;

function spawnPowerUp(x, y, z, type) {

	var healthTex, rocketTex, rocket2Tex, shieldTex, moneyTex, itemGeometry, minigunTex, coinTex;
    var item;
    var itemHitBox;

    /*Wahrscheinlichkeiten für die Powerups, wenn kein bestimmtes gefordert.*/

	if (type == undefined) {
		var rndCase;
		var rndBadorGood;
		rndCase = Math.random();
		rndBadorGood = Math.random();

		if (rndCase <= 0.125) {

			itemGeometry = fileLoader.get("PowerUpHealth");
			healthTex = fileLoader.get("PowerUpHealthTex");
            item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: healthTex }));
            types.push("HEALTH");

		} else if (rndCase > 0.125 && rndCase <= 0.375) {

			itemGeometry = fileLoader.get("PowerUpRocket");
			rocketTex = fileLoader.get("PowerUpRocketTex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: rocketTex }));
			types.push("SINGLEROCKET");

		} else if (rndCase > 0.375 && rndCase <= 0.5) {

			itemGeometry = fileLoader.get("Coin");
			coinTex = fileLoader.get("Coin_Texture");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: coinTex }));
			types.push("COIN");

		} else if (rndCase > 0.5 && rndCase <= 0.5625) {

			itemGeometry = fileLoader.get("PowerUpRocket2");
			rocketTex = fileLoader.get("PowerUpRocket2Tex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: rocketTex }));
			types.push("DOUBLEROCKET");

		} else if (rndCase > 0.5625 && rndCase <= 0.625) {

			itemGeometry = fileLoader.get("PowerUpRocket4");
			rocketTex = fileLoader.get("PowerUpRocket4Tex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: rocketTex }));
			types.push("QUATROROCKET");


		} else if (rndCase > 0.625 && rndCase <= 0.6875) {

			itemGeometry = fileLoader.get("Geldsack");
			moneyTex = fileLoader.get("GeldsackTex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: moneyTex }));
			types.push("MONEY");

		} else if (rndCase > 0.6875 && rndCase <= 0.75) {

			itemGeometry = fileLoader.get("Geldsack");
			moneyTex = fileLoader.get("GeldsackFacePalmTex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: moneyTex }));
			types.push("FACEPALM");

		} else if (rndCase > 0.75 && rndCase < 0.8125) {

			itemGeometry = fileLoader.get("PowerUpMinigun");
			//minigunTex = fileLoader.get("PowerUpMinigunTex")
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: minigunTex }));
			types.push("MINIGUN");

		} else if (rndCase > 0.8125 && rndCase < 0.875) {

			itemGeometry = fileLoader.get("PowerUpShield");
			shieldTex = fileLoader.get("PowerUpShieldTex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: shieldTex }));
			types.push("SHIELD");

		} else if (rndCase > 0.875 && rndCase < 0.9375) {

			itemGeometry = fileLoader.get("PowerUpLaser");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial());
			types.push("LASERUP");

		} else {

			itemGeometry = fileLoader.get("Coin");
			coinTex = fileLoader.get("Coin_Texture");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: coinTex }));
			types.push("COIN");

		}

	}

	collectGeometry = new THREE.BoxGeometry(3.4 * 10, 3.4 * 10, 1 * 10);

	var colBoxMaterial = new THREE.MeshBasicMaterial({
		transparent: true,
		opacity: 0.5,
		color: 0xffffff
	});

	itemHitBox = new THREE.Mesh(collectGeometry, colBoxMaterial);
	itemHitBox.position.set(x, y, z);

	item.position.set(x, y, z);

	item.scale.x = item.scale.y = item.scale.z = 10;

	powerUps.push(item);
	itemHitBoxes.push(itemHitBox);

	scene.add(item)

    itemHitBox.visible = false;
    scene.add(itemHitBox);

}


function updatePowerUps() {

}


function collected(itemNumber) {

    changeScore(scoreValues["itemCollected"]);

	var tmpItem = types[itemNumber];

	switch (tmpItem) {

		case "HEALTH":

            particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x00FF00, 1, 1);
			powerUpAudio.play();
			changeHP(50);

			break;
		case "SINGLEROCKET":

			rocketAmmo += 1;

			break;

		case "DOUBLEROCKET":

			rocketAmmo += 2;

			break;

		case "QUATROROCKET":

			rocketAmmo += 4;

			break;

		case "SHIELD":

			shieldActive = true;
			player.activateShield();

			break;

		case "MONEY":

			changeMoney(20);
			particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x00FF00, 1, 1);

			break;

		case "FACEPALM":

			break;

		case "COIN":

			changeMoney(2);
			particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x00FF00);

			break;

		case "MINIGUN":

			break;

		case "LASERUP":

			break;

        default:

            particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x6495ED, 1, 1);

			break;

	}

	if (rocketAmmo > MaxRocketAmmo) {

		rocketAmmo = maxRocketAmmo;

	}

	updateWeaponInterface();
    scene.remove(powerUps[itemNumber]);
    scene.remove(itemHitBoxes[itemNumber]);

    itemHitBoxes.splice(itemNumber, 1);
    powerUps.splice(itemNumber, 1);
    types.splice(itemNumber, 1);

}
