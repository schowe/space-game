// TODO: eventuell Refactoring?


function Interface() {
    var $overlay = $("#menu-overlay");
    var menuVisible = false;


    function showOverlay() {
        $overlay.show();
        menuVisible = true;
    }

    function hideOverlay() {
        $overlay.hide();
        menuVisible = false;
    }

    return {
        toggleMenuOverlay: function() {
            if (menuVisible) {
                hideOverlay();
            } else {
                showOverlay();
            }
        }
    }
};

/* Sets the starting values. Also used for testing. */
function interfaceInit() {
	LoadingScreen();
	setMaxHP(100);
	setHP(100);
	updateWeaponInterface();
	displayLevel(1);
}

/**
 * FUNCTIONS FOR LOADING SCREEN
 */

var loadingEllipsisID;
var loadingSplashID;

/* Runs the overlay functions while the textures are loading */
function LoadingScreen() {
	loadingEllipsis();
	loadingSplash();
	loadingEllipsisID = setInterval(loadingEllipsis, 1000);
	loadingSplashID = setInterval(loadingSplash, 5000);
	hideTextureLoading();
}

/* Adds an animated ellipsis to the loading screen */
function loadingEllipsis() {
	var loadingHeader = document.getElementById('loadingTexturesHeader');
	
	switch(loadingHeader.innerHTML.length) {
		case 7:
			loadingHeader.innerHTML = 'Loading.';
			break;
		case 8:
			loadingHeader.innerHTML = 'Loading..';
			break;
		case 9:
			loadingHeader.innerHTML = 'Loading...';
			break;
		default:
			loadingHeader.innerHTML = 'Loading';
			break;
	}
}

/* Randomly selects a splash text from an array */
function loadingSplash() {
	
	var splashArray = [
		"text1",
		"text2",
		"text3",
	];
	
	// Random number between 0 and splashArray.length - 1
	var i = Math.floor(Math.random() * (splashArray.length));
	var temp = document.getElementById('loadingTexturesSplash');
	temp.innerHTML = splashArray[i];
}

/* Hides the overlay and stops its functions */
function hideTextureLoading() {
	// Set an Interval to check if textures have loaded
	var loadingID = setInterval(function() {
		if(fileLoader.isReady()) {
			$('#loadingTexturesOverlay').hide();
			clearInterval(loadingID);
			clearInterval(loadingEllipsisID);
			clearInterval(loadingSplashID);
		}
	}, 1000);
}

/**
 * FUNCTIONS FOR HIGHSCORE
 */

var scoreCounterID;
var scoreReference = document.getElementById('score'); 

/* Starts the passive score counter */
function startScoreCounter() {
	scoreCounterID = setInterval(function() { addScore(1); }, 1000);
}

/* Stops the passive score counter */
function stopScoreCounter() {
	clearInterval(scoreCounterID);
}

/* Changes the score by @value */
function changeScore(value) {   
    scoreReference.innerHTML = parseInt(scoreReference.innerHTML) + parseInt(value);
}

/* Sets the current score to @value */
function setScore(value) {
    scoreReference.innerHTML = parseInt(value + 0.5);
}

/* Returns the current score */
function getScore() {
	return parseInt(scoreReference.innerHTML);
}

/**
 * FUNCTIONS FOR MONEY	
 */

var moneyReference = document.getElementById('money'); 

/* Changes the amount of money by @value */
function changeMoney(value) {   
    moneyReference.innerHTML = parseInt(moneyReference.innerHTML) + parseInt(value);
}

/* Sets the current amount of money to @value */
function setMoney(value) {   
    moneyReference.innerHTML = parseInt(value + 0.5);
}

/* Returns the current amount of money */
function getMoney() {
	return parseInt(moneyReference.innerHTML);
}

/**
 * FUNCTIONS FOR AMMO
 */
 
var currentAmmoLabel = document.getElementById('currentAmmo');
var maxAmmoLabel = document.getElementById('maxAmmo');
var currentAmmo = 0;
var maxAmmo = 0;

// Function for secondary weapon display missing
 
/* Updates the weapon interface of the secondary weapon*/
function updateWeaponInterface() {
	
	switch(activeSecWeapon) {
		case 0: 
				currentAmmo = rocketAmmo;
				maxAmmo = MaxRockedAmmo;
				break;
		case 1: 
				currentAmmo = MGAmmo;
				maxAmmo = MaxMGAmmo;
				break;
		default:
				currentAmmo = 42;
				maxAmmo = 42;
				break;
	}
	
	currentAmmoLabel.innerHTML = currentAmmo;
	maxAmmoLabel.innerHTML = maxAmmo;
}

/**
 * FUNCTIONS FOR HP
 */
 
 	var currentHP = 0;
	var maxHP = 0;
	var displayedHP = 0;
	var hpBoxCurrent = document.getElementById('hpBoxValue');

/* Changes HP by @value */
function changeHP(value) {
	var i = 0;
	var ticks = 200;
	value = parseInt(value);
	currentHP = currentHP + value;

	if (currentHP > maxHP)
		currentHP = maxHP;

	// Amount of HP per tick
	var hpTick = value / ticks;
	var tempID = setInterval(frame, 1);
	
	function frame() {
		if(i < ticks) {
			if (!Pause) {
				displayedHP += hpTick;
			
				if (displayedHP > maxHP) {
					clearInterval(tempID);
					displayedHP = maxHP;
					updateHPDisplay();
					return;
				}
			
				if (displayedHP <= 0) {
					clearInterval(tempID);
					var temp = document.getElementById('currentHP');
					temp.innerHTML = 0;
					hpBoxCurrent.style.width = 0;
					gameOver();
					return;
				}
			
				updateHPDisplay();
				i++;
			}
		} else {
			clearInterval(tempID);
		}
	}
}

/* Initiates the gameOver sequences */
function gameOver() {
	var gameOverScore = document.getElementById('gameOverText3');
	gameOverScore.innerHTML = parseInt(getScore());

	setTimeout(animateGameOver, 1);
	function animateGameOver () {
		$('#gameOverBox').animate({top : '20%'}, 250);
	}

  	Pause = true;  
  	PauseScreen = true;     
    Movement().unlockPointer();
}

/* Sets HP to @value */
function setHP(value) {
	currentHP = value;
	displayedHP = value;
	updateHPDisplay();
}

/* Returns HP */
function getHP() {
	return currentHP;
}

/* Sets maxHP to @value */
function setMaxHP(value) {
	maxHP = parseInt(value + 0.5);
	document.getElementById('maxHP').innerHTML = maxHP;
	updateHPDisplay();
}

/* Returns maxHP */
function getMaxHP() {
	return maxHP;
}

/* Updates the displayed HP */
function updateHPDisplay() {
	// Update the HP label
	var temp = document.getElementById('currentHP');
	temp.innerHTML = parseInt(displayedHP + 0.5);
	
	// Update the HP width
	hpBoxCurrent.style.width = displayedHP / maxHP * 100 + '%';
	
	// Update the HP color
	hpUpdateColor();
}

/* Sets the HP bar to a calculated color-gradient. */
function hpUpdateColor() {
	
	if(displayedHP <= (maxHP / 2)) {
		// Color gradient in hex from 0% to 50%
		var temp = parseInt((510 * displayedHP / maxHP) + 0.5);
		hpBoxCurrent.style.background = '#FF' + padHex(temp.toString(16)) + '00';
	} else {
		// Color gradient in hex from 50% to 100%
		var temp = parseInt(255.5 - 255 * (2 * displayedHP / maxHP - 1));
		hpBoxCurrent.style.background = '#' + padHex(temp.toString(16)) + 'FF00';
	}
}

/**
 * FUNCTIONS FOR LEVEL
 */

/* Displays @value as the current level */
function displayLevel(value) {
	
	var tempLevel = document.getElementById('currentLevel');
	tempLevel.innerHTML = parseInt(value);
	$('#levelDisplay').animate({opacity: '1', top: '50px'}, 1000);

	setTimeout(animateLevel, 5000);
	function animateLevel () {
    	$('#currentLevel').animate({opacity: '1'}, 100);
		$('#currentLevel').animate({opacity: '0.3'}, 100);
		$('#currentLevel').animate({opacity: '1'}, 100);
		$('#currentLevel').animate({opacity: '0.3'}, 100);
		$('#currentLevel').animate({opacity: '1'}, 100);
	}
	
	setTimeout(hideLevel, 1500);
	function hideLevel () {
    	$('#levelDisplay').animate({opacity: '0', top: '0px'}, 1000);
	}
}

/**
 * FUNCTIONS FOR SPEED
 */
 
var maxSpeed = 100;
var speedFactor = 4.04;
var maxBoost = 1.0;

/* Sets the displayed speed value and bar to @newSpeed */
function setSpeed(newSpeed) {
	
	// Set the height of the speed bar
	var speedBox = document.getElementById('speedBarValue');	
	speedBox.style.height = Number(newSpeed) / maxSpeed * 100 + '%';
	
	// Set the color of the speed bar
	var temp = parseInt(255.5 - Number(newSpeed) / maxSpeed * 255);
	speedBox.style.background = '#FF' + padHex(temp.toString(16)) + '00';

	// Set the displayed speed value
	var temp = document.getElementById('speedValue');
	temp.innerHTML = parseInt(newSpeed * speedFactor) + '' + parseInt(Math.random() * 10);

	if(parseInt(temp.innerHTML) >= maxSpeed * speedFactor * 10 - 10)
		temp.innerHTML = parseInt(maxSpeed * speedFactor * 10);

	if(parseInt(temp.innerHTML) < 10)
		temp.innerHTML = 0;
}

/* Sets maxSpeed to @newMaxSpeed */
function setMaxSpeed(newMaxSpeed) {
	maxSpeed = parseInt(newMaxSpeed * maxBoost);
}

/**
 * FUNCTIONS FOR POWERUPS
 */
 
/* Changes the status of an addressed PowerUp */
function setPowerUp(powerUp, removeOrAdd) {
	var icon;
	
	switch(powerUp) {
		case 1:
			icon = document.getElementById('powerUpOne');
			break;	
		case 2:
			icon = document.getElementById('powerUpTwo');
			break;
		case 3:
			icon = document.getElementById('powerUpThree');
			break;
		case 4: 
			icon = document.getElementById('powerUpFour');
			break;
		default:
			return;
	}

	if (removeOrAdd == 1)
		icon.classList.remove('inactive');
	
	if (removeOrAdd == 0)
		icon.classList.add('inactive');
}

/**
 * MISC FUNCTIONS
 */
 
/* Pads @hex if it is shorter than 2 digits */
function padHex(hex) {
	
	while(hex.length < 2) {
		hex = '0' + hex;
	}
	
	return hex;
}