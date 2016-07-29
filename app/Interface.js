// TODO: eventuell Refactoring?


function Interface() {
    var $overlay = $('#menu-overlay');
    var menuVisible = false;


    function showOverlay() {
        $overlay.show();
        checkBuyable();
        checkActiveCross();
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
}
/* Sets the starting values. Also used for testing. */
function interfaceInit() {
	setMaxHP(100);
	setHP(100);

	setMoney(45000);
	changeMoney(10);
	updateWeaponInterface();
	document.getElementById('invertedMouse').checked = true;

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
		'Catching the 671th Weedle',
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

var currentAmmo;
var maxAmmo;

// TODO: Function for secondary weapon display missing

/* Updates the weapon interface of the secondary weapon */
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

	/* Von wem ist das? Code funktioniert an dieser Stelle nicht
    if (value < 0) {
        // negative HP change: player lost HP => show visual effect
        glitchScreen(500);
    }*/

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

/* Sets HP to @value */
function setHP(value) {
	currentHP = parseInt(value + 0.5);
	displayedHP = parseInt(value + 0.5);
	updateHPDisplay();

	/* Woher kommen diese Edits o.O
	if(value<=maxHP){
		currentHP = value;
		displayedHP = value;
		updateHPDisplay();
	}*/
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

var reachedMaxSpeed = 0;
var maxSpeed = 100;
var maxBoost = 1.0;

/* Sets the displayed speed value and bar to @newSpeed */
function setSpeed(newSpeed) {
	var speedFactor = 4.04;

	// Set the height of the speed bar
	var speedBox = document.getElementById('speedBarValue');
	speedBox.style.height = Number(newSpeed) / maxSpeed * 100 + '%';

	// Set the color of the speed bar
	var temp = parseInt(255.5 - Number(newSpeed) / maxSpeed * 255);
	speedBox.style.background = '#FF' + padHex(temp.toString(16)) + '00';

	var randomNum = parseInt(Math.random() * 10);

	// Set the displayed speed value
	var tempRef = document.getElementById('speedValue');
	tempRef.innerHTML = parseInt(newSpeed * speedFactor) + '' + randomNum;

	if(parseInt(temp.innerHTML) >= maxSpeed * speedFactor * 10 - randomNum) {
		tempRef.innerHTML = parseInt(maxSpeed * speedFactor * 10);
	}

	if(parseInt(temp.innerHTML) > reachedMaxSpeed) {
		reachedMaxSpeed = parseInt(temp.innerHTML);
	}

	if(parseInt(tempRef.innerHTML) < 90){
		tempRef.innerHTML = 80;
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

/** 
 * milestone variables 
 */
var reachedMoney = 23;

/* Opens the Milestones tab */
function showMilestones() {
	menuHideAll();
	$('#milestones').show();
	menuResetColors();
	menuSetColor('milestoneBox');

	/* UPDATE VALUES */

	/* test */
	changeProgress(2, 120, 100);
	/* Money achievement */
	//changeProgress(3, (reachedMoney/50000) * 100);
	changeProgress(3, reachedMoney, 50000);

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
 * FUNCTIONS FOR MILESTONES
 */

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
function changeProgress (number, current, max) {
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
    var temp = $('#progressbar' + number);
	temp.css('background-color', 'rgba(255, 170, 0, 0.6)');
	temp.css('border-color', 'rgba(255, 255, 255, 0.8)');
	temp.css('box-shadow', 'none');
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

function checkBuyable(){

	//setzen der Preise
    document.getElementById('costUpgrade1').innerHTML = '' + costUpgrade1;
    document.getElementById('costUpgrade2').innerHTML = '' + costUpgrade2;
    document.getElementById('costUpgrade3').innerHTML = '' + costUpgrade3;

	//Opacity setzen (Display ob kaufbar oder nicht)
	var shopTr1 = document.getElementById('shopItem1');
	var shopTr2 = document.getElementById('shopItem2');
	var shopTr3 = document.getElementById('shopItem3');

	if(currentMoney < costUpgrade1) {
		shopTr1.style.opacity = '0.5';
	} else {
		shopTr1.style.opacity = '1';
	}

	if(currentMoney < costUpgrade2) {
		shopTr2.style.opacity = '0.5';
	} else {
		shopTr2.style.opacity = '1';
	}

	if(currentMoney < costUpgrade3) {
		shopTr3.style.opacity = '0.5';
	} else {
		shopTr3.style.opacity = '1';
	}
}
var addHPID;

function buyUpgrade(value){
	switch(value){
		case 1: //max hp +25
			if(abrechnung(costUpgrade1)){
				setMaxHP(getMaxHP()+25);
				costUpgrade1 = parseInt(costUpgrade1*costUpgrade1Faktor);
			}
			break;
		case 2:
			if(abrechnung(costUpgrade2)){
				maxVel++;
				setMaxSpeed(maxVel);
				setSpeed(-yAxis);
				costUpgrade2 = parseInt(costUpgrade2*costUpgrade2Faktor);
			}
			break;
		case 3:
			if(abrechnung(costUpgrade3)){
				clearInterval(addHPID);

				costUpgrade3 = parseInt(costUpgrade3*costUpgrade3Faktor);
				addHPID = setInterval(function() {
					if(!Pause) {
						setHP(getHP() + 1);
					}	
				}, 5000 / ++amountUpgrade3);
			}
			break;
		default:
			break;
	}
	checkBuyable();
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
	//var bratwurst = document.getElementById('crossPic' + pos);

	var temp = 'crossPic' + pos;
	console.log(temp);

	//$('.crossPic').css('border-style', 'none'); 
	//$('.crossPic').css('border-color', 'rgba(255,255,255,0.5)'); 

	//$('#'+temp).css('border-style', 'solid'); 
	//$('#'+temp).css('border-color', 'rgba(255,255,255,0.5)'); 

	//box-shadow: inset 1px 1px 6px -2px #00ace6, inset 2px 2px 10px -6px #cccccc, 5px 3px 71px -11px rgba(255,255,0,0.5); 

	$('.crossPic').css('border-color','rgba(0, 153, 204, 0.7)');
	$('#'+temp).css('border-color', 'rgba(255, 170, 0, 0.9)');

}

function invertedMouseFunc() {
	mouseInverted*=-1;
}

function hideScrollbar() {
	var temp = $('.innerScrollbar');

	switch(temp.css('margin-right')) {
		case '-16px':
			temp.css('margin-right', 'auto');
			break;
		default:
			temp.css('margin-right', '-16px');
			break;
	}
}
