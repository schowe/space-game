
function Interface() {
    var $overlay = $('#menu-overlay');
    var menuVisible = false;


    function showOverlay() {
        $overlay.show();
        checkBuyable();
        checkActiveCross();
        checkMilestones();
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
	setMaxHP(100);
	setHP(100);
	//setMoney(20333300);
	setMoney(450033300);
	changeMoney(10);
	updateWeaponInterface();
	
	document.getElementById('invertedMouse').checked = true;
	document.getElementById('hideScrollbar').checked = true;

	displayLevel(1);
	setLevelTimer(260);
	startLevelTimer();

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
		'Lasers are being painted red',
		'Teaching the AI',
		'Selecting suitable spaceship',
		"Polishing Asteroids",
		'Manipulating AI',
		'Failing Turing-Test',
		'Recruiting Enemy Pilots',
		'Flattening Hero Ship',
		'Reloading Minigun',
		'Refueling with unstable plutonium',
		'Forming the Universe',
		'Catching the 671th Weedle',
		'Gather unexploded Rockets',
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
		'Removing easiest difficulty',
		'Encounting Voyager',
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
	scoreCounterID = setInterval(function() { addScore(1); }, 1000);
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
    }
}

/* Sets the current amount of currentMoney to @value */
function setMoney(value) {
	currentMoney = parseInt(value + 0.5);
    moneyReference.innerHTML = currentMoney;
}

/* Returns the current amount of currentMoney */
function getMoney() {
	return parseInt(currentMoney);
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

    if (value < 0) {
        // negative HP change: player lost HP => show visual effect
        glitchScreen(500);
    }

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
					document.getElementById('currentHP').innerHTML = 0;
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

/* Sets HP to @value */
function setHP(value) {
	updateHPDisplay();

	if(value<=maxHP){
		currentHP = value;
		displayedHP = value;
		updateHPDisplay();
	}
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
	document.getElementById('gameOverText3').innerHTML = getScore();

	$('#gameOverBox').animate({top : '20%'}, 500);
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

var currentSpeed = 0;
var reachedMaxSpeed = 0;
var maxSpeed = 100;
var maxBoost = 1.0;

function updateSpeedBar(newSpeed){
	// Set the height of the speed bar
	var speedBox = document.getElementById('speedBarValue');
	speedBox.style.height = Number(newSpeed) / maxSpeed * 100 + '%';

	// Set the color of the speed bar
	var temp = parseInt(255.5 - Number(newSpeed) / maxSpeed * 255);
	speedBox.style.background = '#FF' + padHex(temp.toString(16)) + '00';

}

/* Sets the displayed speed value and bar to @newSpeed */
function setSpeed(newSpeed) {
	var speedFactor = 4.04;

	updateSpeedBar(newSpeed);

	var randomNum = parseInt(Math.random() * 10);

	// Set the displayed speed value
	var temp = document.getElementById('speedValue');
	temp.innerHTML = parseInt(newSpeed * speedFactor) + '' + randomNum;
	currentSpeed = parseInt(newSpeed * speedFactor) + '' + randomNum;

	if(parseInt(temp.innerHTML) >= maxSpeed * speedFactor * 10 - randomNum) {
		temp.innerHTML = parseInt(maxSpeed * speedFactor * 10);
		currentSpeed = parseInt(maxSpeed * speedFactor * 10);
	}

	console.log('current1 ' +currentSpeed);
	console.log('max1 ' + reachedMaxSpeed);

	if(!reachedMilestone4&&parseInt(currentSpeed)>=parseInt(reachedMaxSpeed)){
		console.log('geht rein');
		this.reachedMaxSpeed = currentSpeed;
	}

	console.log('max2 ' + reachedMaxSpeed);

	if(parseInt(temp.innerHTML) < 90){
		temp.innerHTML = 80;
	}
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
 * FUNCTIONS FOR MENU
 */


var menuShop = $('#shop');
var menuOptions = $('#options');
var menuMilestones = $('#milestones');
var menuHighscore = $('#highscore');

function showShop() {
	menuHideAll();
	menuShop.show();
	menuResetColors();
	menuSetColor('shopBox');
	checkBuyable();
}

function showHighscore() {
	menuHideAll();
	menuHighscore.show();
	menuResetColors();
	menuSetColor('highscoreBox');
}

/* 
milestone variables 
*/
var reachedMoney = 23;

function showMilestones() {
	menuHideAll();
	menuMilestones.show();
	menuResetColors();
	menuSetColor('milestoneBox');
	checkMilestones();
	/* UPDATE VALUES */
}

function checkMilestones(){
	changeMilestoneProgress(2, 120, 100);

	changeMilestoneProgress(3, reachedMoney, 50000);

	console.log(reachedMaxSpeed);
	changeMilestoneProgress(4, reachedMaxSpeed, 2000);
}


function showOptions() {
	menuHideAll();
	menuOptions.show();
	menuResetColors();
	menuSetColor('optionsBox');

}

function menuResetColors() {
	$('.pauseButton').css('border-color', 'rgba(0, 153, 204, 0.7)'); 
	$('.pauseButton').css('background-color', 'rgba(230, 230, 230, 0.7)'); 
    $('.pauseButton').css('box-shadow', 'inset 1px 1px 6px -2px #00ace6, inset 4px 4px 10px -6px #cccccc, 5px 3px 71px -11px rgba(255,255,255,0.7)'); 
}

function menuSetColor(box) {
	$('#' + box).css('border-color', 'rgba(255, 170, 0, 0.9)'); 
	$('#' + box).css('background-color', 'rgba(255, 255, 255, 0.8)');
    $('#' + box).css('box-shadow', 'inset 1px 1px 8px -5px #ffaa00, 5px 3px 71px -11px rgba(255,255,255,0.7)'); 
}

function menuHideAll() {
	menuShop.hide();
	menuHighscore.hide();
	menuMilestones.hide();
	menuOptions.hide();
}

function menuClose() {
    PauseScreen = false;
    interface.toggleMenuOverlay();
    movement.lockPointer();
}

/**
 * FUNCTIONS FOR MILESTONES
 */

var reachedMilestone = [
	false,
	false,
	false,
	false
	]

var reachedMilestone1 = false;
var reachedMilestone2 = false;
var reachedMilestone3 = false;
var reachedMilestone4 = false;

var openCloseValues = new Array(10);


function showDescription(number) {
	var $open = openCloseValues[number-1];
	if (!$open) {
		$('#description'+number).show();
		openCloseValues[number-1] = true;
	}
	else {
		$('#description'+number).hide();
		openCloseValues[number-1] = false;
	}
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

/* ??? */
function setFinished(number) {
	/* Ideen?? */
	$('#progressbar' + number).css('background-color', 'rgba(255, 170, 0, 0.6)'); 
	$('#progressbar' + number).css('border-color', 'rgba(255, 255, 255, 0.8)'); 
	$('#progressbar' + number).css('box-shadow', 'none'); 
}


/**
 * FUNCTIONS FOR SHOP
 */

var costUpgrade1Faktor = 1.2;
var costUpgrade1 = 1000; //+ 25 maxHP

var costUpgrade2Faktor = 1.2;
var costUpgrade2 = 5000; //+ 1 maxSpeed

var amountUpgrade3 = 0;
var costUpgrade3Faktor = 1.2;
var costUpgrade3 = 40000; //+ 1 hp alle anfangs 5 sec
var upgrade3Time = 5000;

var costUpgrade4Faktor = 1.2;
var costUpgrade4 = 1000; //+ 2 ammo capacity

var costUpgrade5Faktor = 1.2;
var costUpgrade5 = 1000; //+ 2 ammo capacity

function checkBuyable(){
	//setzen der Preise
	var cost1 = document.getElementById('costUpgrade1');
	cost1.innerHTML = parseInt(costUpgrade1);

	var cost2 = document.getElementById('costUpgrade2');
	cost2.innerHTML = parseInt(costUpgrade2);

	var cost3 = document.getElementById('costUpgrade3');
	cost3.innerHTML = parseInt(costUpgrade3);

	var cost4 = document.getElementById('costUpgrade4');
	cost4.innerHTML = parseInt(costUpgrade4);

	var cost5 = document.getElementById('costUpgrade5');
	cost5.innerHTML = parseInt(costUpgrade5);

	//Opacity setzen (Display ob kaufbar oder nicht)
	var shopTr1 = document.getElementById('shopItem1');
	var shopTr2 = document.getElementById('shopItem2');
	var shopTr3 = document.getElementById('shopItem3');
	var shopTr4 = document.getElementById('shopItem4');
	var shopTr5 = document.getElementById('shopItem5');

	if(currentMoney < costUpgrade1) {
		shopTr1.style.opacity = '0.5';
	} else {
		shopTr1.style.opacity= '1';
	}

	if(currentMoney < costUpgrade2) {
		shopTr2.style.opacity = '0.5';
	} else {
		shopTr2.style.opacity= '1';
	}

	if(currentMoney < costUpgrade3) {
		shopTr3.style.opacity = '0.5';
	} else {
		shopTr3.style.opacity= '1';
	}

	if(currentMoney < costUpgrade4) {
		shopTr4.style.opacity = '0.5';
	} else {
		shopTr4.style.opacity= '1';
	}

	if(currentMoney < costUpgrade5) {
		shopTr5.style.opacity = '0.5';
	} else {
		shopTr5.style.opacity= '1';
	}
}

var addSlowHP;

function buyUpgrade(value){
	var cost = 0;
	switch(value){
		case 1: //max hp +25
			cost = costUpgrade1;
			if(abrechnung(cost)){
				setMaxHP(getMaxHP()+25);
				costUpgrade1 = parseInt(costUpgrade1*costUpgrade1Faktor);
			}
			break;
		case 2:
			cost = costUpgrade2;
			if(abrechnung(cost)){
				maxVel++;
				setMaxSpeed(maxVel);
				updateSpeedBar(-yAxis);
				costUpgrade2 = parseInt(costUpgrade2*costUpgrade2Faktor);
			}
			break;
		case 3:
			cost = costUpgrade3;
			if(abrechnung(cost)){

				clearInterval(addSlowHP);
				costUpgrade3 = parseInt(costUpgrade3*costUpgrade3Faktor);
				addSlowHP = setInterval(function() {
					if(!Pause) {
						setHP(getHP() + 1);
					}	
				}, 5000 / ++amountUpgrade3);
			}
			break;
		case 4:
			cost = costUpgrade4;
			if(abrechnung(cost)){
				MaxRockedAmmo+=2;
				costUpgrade4 = parseInt(costUpgrade4*costUpgrade4Faktor);
			}
			break;
		case 5:
			cost = costUpgrade5;
			if(abrechnung(cost)){
				MaxMGAmmo+=20;
				costUpgrade5 = parseInt(costUpgrade5*costUpgrade4Faktor);
			}
			break;
		default:
			break;
	}
	checkBuyable();
	updateWeaponInterface();
}

function abrechnung(value) {
	if(currentMoney>=value){
		changeMoney(-value);
		return true;
	}else{
		return false;
	}
}


/**
 * FUNCTIONS FOR OPTIONS
 */
 
function checkActiveCross(){

	var temp = 'crossPic' + pos;
	$('.crossPic').css('border-color','rgba(0, 153, 204, 0.7)');
	$('#'+temp).css('border-color', 'rgba(255, 170, 0, 0.9)');

}



function invertedMouseFunc(){
	mouseInverted*=-1;
}

var sichtbar = 0;
function hideScrollbar() {
	if(sichtbar==1){
		$('.innerScrollbar').css('margin-right', 'auto');	
		sichtbar = 0;
	}else{
		$('.innerScrollbar').css('margin-right', '-16px');
		sichtbar = 1;
	}
}
