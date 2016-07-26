// TODO: eventuell Refactoring?


var Interface = function() {
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

var costUpgrade1 = 1000;
var buyable1 = false;

var costUpgrade2 = 5000;
var buyable2 = false;

var $menuShop = $("#shop");
function showShop(){
	$istEgal.hide();
	$menuShop.show();

	var cost1 = document.getElementById('costUpgrade1');
	cost1.innerHTML = parseInt(costUpgrade1);

	var cost2 = document.getElementById('costUpgrade2');
	cost2.innerHTML = parseInt(costUpgrade2);

	var shopTr1 = document.getElementById('shopItem1');
	var shopTr2 = document.getElementById('shopItem2');

	if(currentMoney<costUpgrade1){


		shopTr1.style.opacity = '0.5';
	}else{
		shopTr1.style.opacity="1";
	}

	if(currentMoney<costUpgrade2){

		shopTr2.style.opacity = '0.5';
	}else{
		shopTr2.style.opacity="1";
	}
}


var $istEgal = $("#test41234");
function showHighscore(){
	$menuShop.hide();
	$istEgal.show();
}

/* Sets the starting values. Also used for testing. */
function interfaceInit(){
	setScore(100000);
	setMaxHP(100);
	setHP(100);

	setMoney(2000);
	//setLevelTimer(61);
	//startLevelTimer();
	//displayLevel(1);
}

/**
 * FUNCTIONS FOR HIGHSCORE
 */

var score = 0;
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
	score += parseInt(value + 0.5);
    scoreReference.innerHTML = score;
}

/* Sets the current score to @value */
function setScore(value) {
	score = parseInt(value + 0.5);
    scoreReference.innerHTML = score;
}

/* Returns the current score */
function getScore() {
	return parseInt(score);
}

/**
 * FUNCTIONS FOR MONEY	
 */

var currentMoney = 0;
var moneyReference = document.getElementById('money'); 

/* Changes the amount of currentMoney by @value */
function changeMoney(value) {   
	currentMoney +=parseInt(value + 0.5);
    moneyReference.innerHTML = currentMoney
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
var currentWeapon = 0;
var currentAmmo = 0;
var maxAmmo = 0;

// Function for secondary weapon display missing
 
/* Updates the weapon interface of the secondary weapon*/
function updateWeaponInterface() {
	//currentWeapon = get current weapon
	//correntAmmo = get current ammo
	//maxAmmo = get max ammo
	
	currentAmmoLabel.innerHTML = currentAmmo;
	maxAmmoLabel.innerHTML = maxAmmo;
}

/**
 * FUNCTIONS FOR HP
 */
 
 	var currentHP = 0;
	var maxHP = 0;
	var hpBoxCurrent = document.getElementById('hpBoxValue');

/* Changes HP by @value */
function changeHP(value) {
	var i = 0;
	var ticks = 200;
	value = parseInt(value);
	// Amount of HP per tick
	var hpTick = value / ticks;
	var tempID = setInterval(frame, 1);
	
	function frame() {

		if(i < ticks) {

			if(!Pause){

				if (currentHP > maxHP) {
					clearInterval(tempID);
					currentHP = maxHP;
					updateHPDisplay();
					return;
				}

				if (parseInt(currentHP) <= 0) {
					clearInterval(tempID);
					var temp = document.getElementById('currentHP');
					temp.innerHTML = parseInt(0);
					hpBoxCurrent.style.width = 0;
					gameOver();
					return;
				}
			
				currentHP += hpTick;
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
	currentHP = value;
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
	temp.innerHTML = parseInt(currentHP + 0.5);
	
	// Update the HP width
	hpBoxCurrent.style.width = currentHP / maxHP * 100 + '%';
	
	// Update the HP color
	hpUpdateColor();
}

/* Sets the HP bar to a calculated color-gradient. */
function hpUpdateColor() {
	
	if(currentHP <= (maxHP / 2)) {
		// Color gradient in hex from 0% to 50%
		var temp = parseInt((510 * currentHP / maxHP) + 0.5);
		hpBoxCurrent.style.background = '#FF' + padHex(temp.toString(16)) + '00';
	} else {
		// Color gradient in hex from 50% to 100%
		var temp = parseInt(255.5 - 255 * (2 * currentHP / maxHP - 1));
		hpBoxCurrent.style.background = '#' + padHex(temp.toString(16)) + 'FF00';
	}
}

//GAME OVER FUNC
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


/**
 * FUNCTIONS FOR LEVEL
 */

/* Displays @value as the current level */
function displayLevel (value) {
	
	var tempLevel = document.getElementById('currentLevel');
	tempLevel.innerHTML = parseInt(value);
	$('#levelDisplay').animate({opacity: "1", top: "50px"}, 1000);

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
var speedFactor = 4.04; //ERR Page not found
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
		//temp.innerHTML = 42;

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
			icon = document.getElementById('one');
			break;	
		case 2:
			icon = document.getElementById('two');
			break;
		case 3:
			icon = document.getElementById('three');
			break;
		case 4: 
			icon = document.getElementById('four');
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

/**
 * LEVEL TIMER FUNCTIONS
 */

var min = 0;
var sec = 0;

var minHTML = 0;
var secHTML = 0;

//Setzt die Zeit : Value in sec pls!
function setLevelTimer(value){
	min = parseInt(value/60);
	sec = value%60;

	minHTML = document.getElementById('timerBoxMin');
	secHTML = document.getElementById('timerBoxSec');

	displayTimer();
}

function startLevelTimer() {
	var levelTimer = setInterval(minus, 1000);

	function minus(){
		if(!Pause){
			if(sec==0&&min>0){
				min--;
				sec=59;
			}else if(sec==0&&min==0){
				//next level
				clearInterval(levelTimer);
			}
			else{
				sec--;
			}
			displayTimer();
		}
	}
}

function displayTimer(){
	if(sec<10){
		secHTML.innerHTML = '0' + sec;
	}else{
		secHTML.innerHTML = sec;
	}

	if(min<10){
		minHTML.innerHTML = '0' + min;
	}else{
		minHTML.innerHTML = min;
	}
}
