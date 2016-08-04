var powerUps = [];
var types = [];
var itemHitBoxes = [];
var shieldActive = false; 
var collectedPowerups = 0;

function spawnPowerUp(x, y, z, type) {

	var healthTex, rocketTex, rocket2Tex, shieldTex, moneyTex, itemGeometry, minigunTex, coinTex, miniAmmoTex, shockwaveTex;
    var item;
    var itemHitBox;
    
    /*Wahrscheinlichkeiten für die Powerups, wenn kein bestimmtes gefordert.*/

	if (type == undefined) {
		var rndCase;
		var rndBadorGood;
		rndCase = Math.random();
		rndBadOrGood = Math.random(); 
		var scndRandom = Math.random(); 
		rndBadorGood = Math.random();

		if (rndCase <= 0.125) {
			//Bad and good Health 
			if(rndBadorGood < 0.5){

			itemGeometry = fileLoader.get("PowerUpHealth");
			healthTex = fileLoader.get("PowerUpHealthBadTex");
            item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: healthTex }));
            types.push("HEALTHBAD");


			} else {

			itemGeometry = fileLoader.get("PowerUpHealth");
			healthTex = fileLoader.get("PowerUpHealthTex");
            item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: healthTex }));
            types.push("HEALTH");

        	}

		} else if (rndCase > 0.125 && rndCase <= 0.375) {

			//Bad and Good Single Rocket
			if(rndBadorGood < 0.5) {

			itemGeometry = fileLoader.get("PowerUpRocket");
			rocketTex = fileLoader.get("PowerUpRocketBadTex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: rocketTex }));
			types.push("SINGLEROCKETBAD");

			} else{

			itemGeometry = fileLoader.get("PowerUpRocket");
			rocketTex = fileLoader.get("PowerUpRocketTex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: rocketTex }));
			types.push("SINGLEROCKET");

			}

		} else if (rndCase > 0.375 && rndCase <= 0.5) {
			//Single or Triple Coin
			if(scndRandom < 0.5){
			itemGeometry = fileLoader.get("Coin");
			coinTex = fileLoader.get("Coin_Texture");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: coinTex }));

			types.push("COIN");
			}else{

				itemGeometry = fileLoader.get("Coin3");
			coinTex = fileLoader.get("Coin_Texture");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: coinTex }));
			types.push("COIN3");

			}

		} else if (rndCase > 0.5 && rndCase <= 0.5625) {
			//MiniGunAmmo200 || bad RocketAmmo2 or good Rocketammo2
			if(scndRandom < 0.5){

			itemGeometry = fileLoader.get("PowerUpMinigun200");
			miniAmmoTex = fileLoader.get("MinigunAmmoUp");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: rocketTex }));
			types.push("MINIGUN200");

			}else{

			itemGeometry = fileLoader.get("PowerUpRocket2");
			rocketTex = fileLoader.get("PowerUpRocket2Tex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: rocketTex }));
			types.push("DOUBLEROCKET");


			}

		} else if (rndCase > 0.5625 && rndCase <= 0.625) {

			//RocketAmmo4 or MingunAmmo400
			itemGeometry = fileLoader.get("PowerUpRocket4");
			rocketTex = fileLoader.get("PowerUpRocket4Tex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: rocketTex }));
			types.push("QUATROROCKET");


		} else if (rndCase > 0.625 && rndCase <= 0.6875) {

			//Shockwave 
			itemGeometry = fileLoader.get("PowerUp_Shockwave");
			shockwaveTex = fileLoader.get("PowerUpRocket4Tex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: shockwaveTex }));
			types.push("SHOCKWAVE");	

		} else if (rndCase > 0.6875 && rndCase <= 0.75) {

			//Bad GeldSack or good Geldsack
			if(rndBadorGood < 0.5) {
			itemGeometry = fileLoader.get("Geldsack");
			moneyTex = fileLoader.get("GeldsackFacePalmTex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: moneyTex }));
			types.push("FACEPALM");

			} else {

			itemGeometry = fileLoader.get("Geldsack");
			moneyTex = fileLoader.get("GeldsackTex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: moneyTex }));
			types.push("MONEY");

			}


		} else if (rndCase > 0.75 && rndCase < 0.8125) {

			itemGeometry = fileLoader.get("PowerUpMinigun");
			minigunTex = fileLoader.get("PowerUpMinigunTex")
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: minigunTex }));
			types.push("MINIGUN");

		} else if (rndCase > 0.8125 && rndCase < 0.875) {

			itemGeometry = fileLoader.get("PowerUpShield");
			shieldTex = fileLoader.get("PowerUpShieldTex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: shieldTex }));
			types.push("SHIELD");

		} else if (rndCase > 0.875 && rndCase < 0.9375) {
			//Make Minigun, Laser, or Rockets stronger
			if(scndRandom < 0.33){
			itemGeometry = fileLoader.get("PowerUpLaser");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial());
			types.push("LASERUP");
		} else if (scndRandom >= 0.33 && scndRandom < 0.66){

			itemGeometry = fileLoader.get("PowerUpMinigun");
			minigunTex = fileLoader.get("PowerUpMinigunTex")
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: minigunTex }));
			types.push("MINIGUN");

		} else {


			//TODO : Was soll alles stärker werden? PowerUpRocket = +1 oder stärker? 


		}

		} else {

			itemGeometry = fileLoader.get("PowerUpShield");
			shieldTex = fileLoader.get("PowerUpShieldTex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({ map: shieldTex }));
			types.push("SHIELD");
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


//Switch - Case when collide with different powerups

function collected(itemNumber) {

    changeScore(scoreValues["itemCollected"]);

	var tmpItem = types[itemNumber];

	powerUpAudio.play();

	switch (tmpItem) {

		

		case "HEALTH":

            particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x00FF00, 1, 1);
			
			changeHP(50);

			break;

		case "HEALTHBAD":

            particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x00FF00, 1, 1);
			
			changeHP(-30);

			break;

		case "SINGLEROCKET":
            particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0xC00200);
			rocketAmmo +=1;

            if (rocketAmmo > MaxRocketAmmo) {
                rocketAmmo = MaxRocketAmmo;
            }

			break;

		case "SINGLEROCKETBAD":
            particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0xC00200);
			rocketAmmo -=1;

            if (rocketAmmo < 0) {

                rocketAmmo = 0;
            }

			break;

		case "DOUBLEROCKET":

			particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0xC00200);
            rocketAmmo +=2;

            if (rocketAmmo > MaxRocketAmmo) {
                rocketAmmo = MaxRocketAmmo;
            }


			break;

		case "DOUBLEROCKETBAD":

			particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0xC00200);
            rocketAmmo -=2;

            if (rocketAmmo < 0) {
                rocketAmmo = 0;
            }


			break;

		case "QUATROROCKET":

            particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0xC00200);
			rocketAmmo += 4;

            if (rocketAmmo > MaxRocketAmmo) {

                rocketAmmo = MaxRocketAmmo;
            }


			break;

		case "QUATROROCKETBAD":

            particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0xC00200);
			rocketAmmo -= 4;

            if (rocketAmmo < 0) {

                rocketAmmo = 0;
            }


			break;

		case "SHIELD":

            particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x0023FF);
			shieldActive = true;
			player.activateShield();

			break;

		case "SHIELDBAD":

            particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x0023FF);
			shieldActive = true;
			player.activateShield();

			break;

		case "COIN": 
			changeMoney(1);
			particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x8E0067);

			break; 

		case "COIN3":
			changeMoney(3);
			particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x8E0067);
			break; 

		case "MONEY":

			changeMoney(20);
			particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x8E0067);
			break;

		case "FACEPALM":

            particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x8E0067);
			break;

		case "COIN":

			changeMoney(2);
			particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x00FF00);

			break;

		case "MINIGUN":

			MGAmmo +=100;

			 if (rocketAmmo > MaxRocketAmmo) {
			 	MGAmmo = MaxMGAmmo;
			 }
			break;

		case "MINIGUN200":

			MGAmmo +=200; 
			 if (rocketAmmo > MaxRocketAmmo) {
			 	MGAmmo = MaxMGAmmo;
			 }
			break; 

			case "MINIGUN200":

			MGAmmo +=400; 

			 if (rocketAmmo > MaxRocketAmmo) {
			 	MGAmmo = MaxMGAmmo;
			 }
			break;

		case "LASERUP":

			break;

        default:

            particleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x6495ED, 1, 1);

			break;

	}

	if (rocketAmmo > MaxRocketAmmo) {

		rocketAmmo = MaxRocketAmmo;

	}

	updateWeaponInterface();
	collectedPowerups++;
    scene.remove(powerUps[itemNumber]);
    scene.remove(itemHitBoxes[itemNumber]);

    itemHitBoxes.splice(itemNumber, 1);
    powerUps.splice(itemNumber, 1);
    types.splice(itemNumber, 1);

}
