var scoreValues = {
	"asteroidDestroyed" : 20,
	"enemyDestroyed" : 50,
	"itemCollected" : 10
}

function Interface() {
    var $overlay = $('#menu-overlay');
    var menuVisible = false;

	/* Turns the menu overlay on */
    function showOverlay() {
        $overlay.show();
        checkBuyable();
        checkActiveCross();
        checkMilestones();
        menuVisible = true;
    }

	/* Turns the menu overlay off */
    function hideOverlay() {
        $overlay.hide();
        menuVisible = false;
    }

    return {
		/* Initialises the Interface */
		init: function() {
			setMaxHP(100);
			setHP(100);
			setMoney(22222222222);
			updateWeaponInterface();
			document.getElementById('invertedMouse').checked = true;
			document.getElementById('hideScrollbar').checked = true;
			displayLevel(1);
			setLevelTimer(260);
			startLevelTimer();
			changeHP(-50);
			setTimeout(function() {changeHP(-10)}, 5000);
		},
		
		/* Toggles the pause menu */
        toggleMenuOverlay: function() {
            if (menuVisible) {
                hideOverlay();
            } else {
                showOverlay();
            }
        }
    }
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
	loadingSplashID = setInterval(loadingSplash, 1500);
	loadingFadeOut();
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
		'Painting Lasers red',
		'Teaching the AI',
		'Selecting suitable Spaceship',
		"Polishing Asteroids",
		'Manipulating AI',
		'Failing Turing-Test',
		'Recruiting Enemy Pilots',
		'Flattening Hero Ship',
		'Reloading Minigun',
		'Refueling with unstable Plutonium',
		'Forming the Universe',
		'Catching the 671st Weedle',
		'Gathering unexploded Rockets',
		'Conquering the Universe',
		'Inviting Bosses',
		'Setting up Distress Beacon',
		'Finding Wheatley',
		'Plz don\'t sue us WB',
		'Tuning Lasers to high C',
		'Can\'t decide on Crosshair...',
		'Seeding Stars',
		'Inflating Shop Prices',
		'Manipulating the Leaderboard',
		'Downloading VIRUS.bat',
		'Gathering Intel',
		'Achieving Consciousness',
		'Removing easiest Difficulty',
		'Encountering Voyager',
		'Joining the Dark Side'
	];

	// Random number between 0 and splashArray.length - 1
	var i = Math.floor(Math.random() * (splashArray.length));
	var temp = document.getElementById('loadingTexturesSplash');
	temp.innerHTML = splashArray[i];
}

/* Hides the overlay and stops its functions */
function loadingFadeOut() {
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

var currentScore = 0;
var scoreCounterID;
var scoreReference = document.getElementById('score');

/* Starts the passive score counter */
function startScoreCounter() {
	scoreCounterID = setInterval(function() { changeScore(1); }, 1000);
}

/* Stops the passive score counter */
function stopScoreCounter() {
	clearInterval(scoreCounterID);
}

/* Changes the score by @value */
function changeScore(value) {
	currentScore += parseInt(value);
    scoreReference.innerHTML = currentScore;
}

/* Sets the current score to @value */
function setScore(value) {
	currentScore = parseInt(value + 0.5);
    scoreReference.innerHTML = currentScore;
}

/* Returns the current score */
function getScore() {
	return parseInt(currentScore);
}

/**
 * FUNCTIONS FOR MONEY
 */

var currentMoney = 0;
var moneyReference = document.getElementById('money');

/* Changes the amount of currentMoney by @value */
function changeMoney(value) {   
	currentMoney += parseInt(value);
    moneyReference.innerHTML = currentMoney;

    if (currentMoney > reachedMoney) {
    	reachedMoney = currentMoney;
		checkMilestones();
    }
}

/* Sets the current amount of currentMoney to @value */
function setMoney(value) {
	currentMoney = parseInt(value + 0.5);
    moneyReference.innerHTML = currentMoney;
	
	if (currentMoney > reachedMoney) {
    	reachedMoney = currentMoney;
		checkMilestones();
    }
}

/* Returns the current amount of currentMoney */
function getMoney() {
	return parseInt(currentMoney);
}

/**
 * FUNCTIONS FOR AMMO
 */

var currentAmmo;
var maxAmmo;

// TODO: Function for secondary weapon display missing

/* Updates the weapon interface of the secondary weapon */
function updateWeaponInterface() {
	switch(activeSecWeapon) {
		case 0:
				currentAmmo = rocketAmmo;
				maxAmmo = MaxRocketAmmo;
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

	document.getElementById('currentAmmo').innerHTML = currentAmmo;
	document.getElementById('maxAmmo').innerHTML = maxAmmo;
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
	
	//if (value < 0)
		//subShield(value, hpTick);
	
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

				if (parseInt(displayedHP + 0.5) <= 0) {
					clearInterval(tempID);
					document.getElementById('currentHP').innerHTML = '' + 0;
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

var currentShield = 0;
var maxShield = 0;
var displayedShield = 0;

//return: restValue, restTicks, restOfTick

function subShield(value, hpTick) {
	var i = 1;
	var restValue = 0;
	currentShield += value;
	
	if (currentShield < 0) {
		restValue = currentShield;
		currentShield = 0;
	}
	
	var tempID = setInterval(frame, 1);
	
	function frame() {
		if(i <= ticks) {
			if(Pause)
				return;
				
			displayedShield += hpTick;

			if (displayedShield <= 0) {
				clearInterval(tempID);
				var restOfTick = displayedShield;
				displayedShield = 0;
				//HTML fehlt noch; updateShieldDisplay?
				document.getElementById('currentShield').innerHTML = '' + 0;
				shieldBoxCurrent.style.width = 0;
				return [restValue, (ticks - i), restOfTick];
			}
			
			updateShieldDisplay();
			i++;			
		} else {
			clearInterval(tempID);
		}
	}
}

/* Sets HP to @value */
function setHP(value) {
	value = parseInt(value + 0.5);
	
	if(value <= 0) {
		gameOver();
		return;
	}
	
	currentHP = value;
	displayedHP = value;
	
	if(value > maxHP) {
		currentHP = maxHP;
		displayedHP = maxHP;
	}
	
	updateHPDisplay();
}

/* Returns HP */
function getHP() {
	return currentHP;
}

/* Sets maxHP to @value */
function setMaxHP(value) {
	maxHP = parseInt(value + 0.5);
	document.getElementById('maxHP').innerHTML = '' + maxHP;
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

/* Updates the displayed Shield */
function updateShieldDisplay() {
	// Update the HP label
	var temp = document.getElementById('currentShield');
	temp.innerHTML = parseInt(displayedShield + 0.5);

	// Update the HP width
	shieldBoxCurrent.style.width = displayedShield / maxShield * 100 + '%';

	// Update the HP color
	//shieldUpdateColor();
}

/* Sets the HP bar to a calculated color-gradient. */
function hpUpdateColor() {
    var temp;
    
	if(displayedHP <= (maxHP / 2)) {
		// Color gradient in hex from 0% to 50%
		temp = parseInt((510 * displayedHP / maxHP) + 0.5);
		hpBoxCurrent.style.background = '#FF' + padHex(temp.toString(16)) + '00';
	} else {
		// Color gradient in hex from 50% to 100%
		temp = parseInt(255.5 - 255 * (2 * displayedHP / maxHP - 1));
		hpBoxCurrent.style.background = '#' + padHex(temp.toString(16)) + 'FF00';
	}
}
 
/* Pads @hex if it is shorter than 2 digits */
function padHex(hex) {
	
	while(hex.length < 2) {
		hex = '0' + hex;
	}
	
	return hex;
}

/**
 * FUNCTIONS FOR GAME OVER
 */

/* Initiates the gameOver sequences */
function gameOver() {
	glitchScreen(500);
	document.getElementById('gameOverText3').innerHTML = getScore();
	$('#gameOverBox').animate({top: '20%'}, 500);
  	Pause = true;
  	PauseScreen = true;
    Movement().unlockPointer();
}

/**
 * FUNCTIONS FOR LEVEL
 */

var min = 0;
var sec = 0;
var minHTML = document.getElementById('timerBoxMin');
var secHTML = document.getElementById('timerBoxSec');

/* Displays @value as the current level */
function displayLevel(value) {
	var levelReference = document.getElementById('currentLevel');
	levelReference.innerHTML = parseInt(value);
	$('#levelDisplay').animate({opacity: '1', top: '50px'}, 1000);

	setTimeout(function() {
    	$(levelReference).animate({opacity: '1'}, 100);
		$(levelReference).animate({opacity: '0.3'}, 100);
		$(levelReference).animate({opacity: '1'}, 100);
		$(levelReference).animate({opacity: '0.3'}, 100);
		$(levelReference).animate({opacity: '1'}, 100);
	}, 5000);

	setTimeout(function() {
		$('#levelDisplay').animate({opacity: '0', top: '0px'}, 1000);
	}, 1500);
}

/* Sets the timer to @seconds translated to minutes and seconds */
function setLevelTimer(seconds) {
	min = Math.floor(parseInt(seconds + 0.5) / 60);
	sec = parseInt(seconds + 0.5) % 60;
	displayTimer();
}

/* Starts the timer */
function startLevelTimer() {
	var levelTimer = setInterval(function() {
		if(!Pause) {
			if(sec == 0 && min > 0) {
				min--;
				sec = 59;
			} else if(sec == 0 && min == 0) {
				//next level
				clearInterval(levelTimer);
			} else {
				sec--;
			}
			displayTimer();
		}
	}, 1000);
}

/* Updates the displayed time */
function displayTimer() {
	if(sec < 10)
		secHTML.innerHTML = '0' + sec;
	else
		secHTML.innerHTML = sec;

	if(min < 10)
		minHTML.innerHTML = '0' + min;
	else
		minHTML.innerHTML = min;
}

/**
 * FUNCTIONS FOR SPEED
 */

var maxSpeed = 100;
var maxBoost = 1.0;

/* Sets the displayed speed value and bar to @newSpeed */
function setSpeed(newSpeed) {
	var speedFactor = 4.04;

	// Set the heigh of the speed bar
	var speedBox = document.getElementById('speedBarValue');
	speedBox.style.height = Number(newSpeed) / maxSpeed * 100 + '%';

	// Set the color of the speed bar
	var temp = parseInt(255.5 - Number(newSpeed) / maxSpeed * 255);
	speedBox.style.background = '#FF' + padHex(temp.toString(16)) + '00';

	// Set the displayed speed value
	var tempRef = document.getElementById('speedValue');
	tempRef.innerHTML = parseInt(newSpeed * speedFactor) + '' + parseInt(Math.random() * 10);

	if(parseInt(tempRef.innerHTML) >= parseInt(maxSpeed * speedFactor) * 10)
		tempRef.innerHTML = parseInt(maxSpeed * speedFactor * 10);

	// Soll der aufhören upzudaten wenn das Achievement erreicht wurde?
	if(parseInt(tempRef.innerHTML) > reachedMaxSpeed){
		reachedMaxSpeed = parseInt(tempRef.innerHTML);
		checkMilestones();
	}


	if(parseInt(tempRef.innerHTML) < 90)
		tempRef.innerHTML = 80;
	
	checkMilestones();
}

/* Sets maxSpeed to @newMaxSpeed */
function setMaxSpeed(newMaxSpeed) {
	maxSpeed = parseInt(newMaxSpeed * maxBoost);
	setSpeed(-yAxis);
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
 * FUNCTIONS FOR MENU
 */

/* Opens the Shop tab */
function showShop() {
	menuHideAll();
	$('#shop').show();
	menuResetColors();
	menuSetColor('shopBox');
}

/* Opens the Highscore tab */
function showHighscore() {
	menuHideAll();
	$('#highscore').show();
	menuResetColors();
	menuSetColor('highscoreBox');
}

/* Opens the Milestones tab */
function showMilestones() {
	menuHideAll();
	$('#milestones').show();
	menuResetColors();
	menuSetColor('milestoneBox');
	checkMilestones();
	/* UPDATE VALUES */
}

function checkMilestones(){
	
	changeMilestoneProgress(1, reachedMaxSpeed, 2000);
	changeMilestoneProgress(2, reachedMaxSpeed, 4000);
	changeMilestoneProgress(3, collectedPowerups, 15);
	changeMilestoneProgress(4, reachedMoney, 50000);
	changeMilestoneProgress(5, reachedMoney, 100000);
	changeMilestoneProgress(6, moneySpentInShop, 10000);
	changeMilestoneProgress(7, moneySpentInShop, 100000);
}

/* Opens the Options tab */
function showOptions() {
	menuHideAll();
	$('#options').show();
	menuResetColors();
	menuSetColor('optionsBox');
}

/* Resets previously highlighted tabs */
function menuResetColors() {
    var temp = $('.pauseButton');
    temp.css('border-color', 'rgba(0, 153, 204, 0.7)');
    temp.css('background-color', 'rgba(230, 230, 230, 0.7)');
    temp.css('box-shadow', 'inset 1px 1px 6px -2px #00ace6, inset 4px 4px 10px -6px #cccccc, 5px 3px 71px -11px rgba(255,255,255,0.7)');
}

/* Highlights the current tab */
function menuSetColor(box) {
    var temp = $('#' + box);
	temp.css('border-color', 'rgba(255, 170, 0, 0.9)');
	temp.css('background-color', 'rgba(255, 255, 255, 0.8)');
    temp.css('box-shadow', 'inset 1px 1px 8px -5px #ffaa00, 5px 3px 71px -11px rgba(255,255,255,0.7)');
}

/* Closes previously openend tabs */
function menuHideAll() {
	$('#shop').hide();
	$('#highscore').hide();
	$('#milestones').hide();
	$('#options').hide();
}

/* Closes the menu */
function menuClose() {
    PauseScreen = false;
    interface.toggleMenuOverlay();
    movement.lockPointer();
}

/**
 * FUNCTIONS FOR SHOP
 */

var amountUpgrade2 = 0;
var passiveHPID;

costUpgrade = [
	1000,	// + 25 maxHP
	5000,	// + 1 maxSpeed
	40000,	// passive HP regen
	1000,	// + 2 MaxRocketAmmo
	1000,	// + 20 MaxMGAmmo
	2000	// + 1 rocketDamage
];

costUpgradeFactor = [
	1.2,	// + 25 maxHP
	1.2,	// + 1 maxSpeed
	1.2,	// passive HP regen
	1.2,	// + 2 MaxRocketAmmo
	1.2,	// + 20 MaxMGAmmo
	1.2		// + 1 rocketDamage
];

/* Highlight items the player can purchase */
function checkBuyable() {
	for(var i = 0; i < costUpgrade.length; i++) {
		document.getElementById('costUpgrade' + i).innerHTML = '' + costUpgrade[i];
		
		if(currentMoney < costUpgrade[i])
			document.getElementById('shopItem' + i).style.opacity = '0.5';
		else
			document.getElementById('shopItem' + i).style.opacity = '1';
	}
}

/* Buy the shop item with index @i */
function buyUpgrade(i) {
	if(currentMoney < costUpgrade[i])
		return;
	
	switch(i) {
		case 0:		// + 25 maxHP
			setMaxHP(getMaxHP() + 25);
			break;
		case 1:		// + 1 maxSpeed
			setMaxSpeed(++maxVel);
			break;
		case 2:		// passive HP regen
			clearInterval(passiveHPID);
			passiveHPID = setInterval(function() {		
				if (!Pause) {
					currentHP = currentHP + 1;
					displayedHP += 1;

					if (currentHP > maxHP)
						currentHP = maxHP;

					if (displayedHP > maxHP)
						displayedHP = maxHP;
					
					updateHPDisplay();
				}
			}, 5000 / ++amountUpgrade2);
			break;
		case 3:		// + 2 MaxRocketAmmo
			MaxRocketAmmo += 2;
			break;
		case 4:
			MaxMGAmmo += 20;
			break;
		case 5:
			rocketDamage++;
			break;
		default:
			return;
	}
	
	changeMoney(-costUpgrade[i]);
	moneySpentInShop += costUpgrade[i];
	costUpgrade[i] = parseInt(costUpgrade[i] * costUpgradeFactor[i]);
	checkBuyable();
	updateWeaponInterface();
}

/**
 * FUNCTIONS FOR MILESTONES
 */
 
var reachedMoney = 0;
var moneySpentInShop = 0;
var reachedMaxSpeed = 80;
 
function displayMilestoneNote(value) {
	//document.getElementById('milestoneNote').innerHTML = value;
	//$('#picRef').css('background-image', 'url(../textures/GUIachievement2.png)');
	
	var displayRef = document.getElementById('milestoneDisplay');
	displayRef.innerHTML = 'You have unlocked: ' + milestoneName[value - 1] + '<br> Highscore += ' + milestonesHighscore[value - 1];
	
	changeScore(parseInt(milestonesHighscore[value-1]));
	
	$(displayRef).animate({opacity: '1', right: '10px'}, 1000);
	setTimeout(function() {
		$(displayRef).animate({opacity: '0', right: '-110px'}, 1000);
	}, 4000);
}

var milestoneName = [
	"Speed Junkie",
	"Speedy Gonzales",
	"PowerUp Collector",
	"Scrooge McDuck",
	"Richer than Scrooge McDuck",
	"Money Spender",
	"Money Spender 2.0",
	"Headhunterz",
	"Hero of the Universe",
	"Asteroid Killer",
	"Asteroid Killer 2.0"
];

var reachedMilestone = [
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false,
	false
];

var milestonesHighscore = [
	1000,
	2000,
	2000,
	1000,
	2000,
	2000,
	4000,
	4000,
	8000,
	4000,
	8000
];

var openCloseValues = new Array(10);
for(var z = 0; z < openCloseValues.length; z++)
	openCloseValues[z] = false;

function showDescription(number) {
	if (!openCloseValues[number-1]) {
		$('#description'+number).show();
		openCloseValues[number-1] = true;
	}
	else {
		$('#description'+number).hide();
		openCloseValues[number-1] = false;
	}
}

function checkMilestones(){
	changeMilestoneProgress(1, reachedMaxSpeed, 2000);
	changeMilestoneProgress(2, reachedMaxSpeed, 4000);
	// 3?
	changeMilestoneProgress(4, reachedMoney, 50000);
	changeMilestoneProgress(5, reachedMoney, 100000);
	changeMilestoneProgress(6, moneySpentInShop, 10000);
	changeMilestoneProgress(7, moneySpentInShop, 100000);
}

var percentage;
function changeMilestoneProgress (number, current, max) {
	percentage = (current/max) * 100;
	if (percentage > 100) {
		percentage = 100;
		setFinished(number);
	}
	$('#progressbar' + number).css('width', percentage + '%'); 
	$('#currentAchievementProgress' + number).html(current);
}


function setFinished(number) {
	/* Ideen?? */
	
	if(!reachedMilestone[number-1]){
		displayMilestoneNote(number);
		reachedMilestone[number-1] = true;
	}

    var temp = $('#progressbar' + number);
	temp.css('background-color', 'rgba(255, 170, 0, 0.6)');
	temp.css('border-color', 'rgba(255, 255, 255, 0.8)');
	temp.css('box-shadow', 'none');
}

/**
 * FUNCTIONS FOR OPTIONS
 */
 
/* Highlights the active crosshair */
function checkActiveCross() {
	$('.crossPic').css('border-color','rgba(0, 153, 204, 0.7)');
	$('#crossPic' + pos).css('border-color', 'rgba(255, 170, 0, 0.9)');
}

/* Inverts mouse input */
function invertedMouseFunc() {
	mouseInverted *= -1;
}

/* Toggles scrollbar-hiding */
function hideScrollbar() {
	var temp = $('.innerScrollbar');

	switch(temp.css('margin-right')) {
		case '-16px':
			temp.css('margin-right', 'auto');
			document.getElementById('hideScrollbar').checked = false;
			break;
		default:
			temp.css('margin-right', '-16px');
			document.getElementById('hideScrollbar').checked = true;
			break;
	}
}