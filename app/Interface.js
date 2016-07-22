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

/* Sets the starting values. Also used for testing. */
function interfaceInit(){
	setMaxHP(100);
	setHP(100);
	displayLevel(1);
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
    scoreReference.innerHTML = parseInt(value);
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
    moneyReference.innerHTML = parseInt(value);
}

/* Returns the current amount of money */
function getMoney() {
	return parseInt(moneyReference.innerHTML);
}

/**
 * FUNCTIONS FOR AMMO
 */

var ammoWeapon = 60;
var ammoPerShot = 1;

//Reload der waffe
function reload(){
	var actual = document.getElementById('currentAmmo'); 
	var max = document.getElementById('maxAmmo');
	var diff = ammoWeapon - parseInt(actual.innerHTML);

	if(diff>parseInt(max.innerHTML)){
		//FEHLERBEHANDLUNG PLS!
	}else{
		maxAmmo.innerHTML = parseInt(max.innerHTML)-diff;
		actual.innerHTML = ammoWeapon;
	}
}

//Zum minuszählen der ammo beim shot der waffe
function shot(){
	var actual = document.getElementById('currentAmmo');
	if(parseInt(actual.innerHTML)<=0){
		//FEHLERBEHANDLUNG PLS!
		//evtl automatisches reloaden nach upgradekauf
	}else{
		actual.innerHTML = parseInt(actual.innerHTML)-ammoPerShot;
	}
}

//zum parameter laden der waffen
//temp1 = ammo pro magazin
//temp2 = ammo per shot
function switchWeapon(temp1, temp2, name){

	//Speicherung von alten Waffen
	//Bearbeitungsbedarf!

	ammoWeapon = temp1;
	ammoPerShot = temo2;
}

//wenn munition erhalten wird (durch powerups/shop etc. )
function plusAmmo(temp){
	var max = document.getElementById('maxAmmo');
	max.innerHTML = parseInt(max.innerHTML) + temp;
}

/**
 * FUNCTIONS FOR HP
 */
 
 	var currentHP = 0;
	var maxHP = 0;

	var hpBoxCurrent = document.getElementById('hpBoxValue');
	var hpBoxCStyle = window.getComputedStyle(hpBoxCurrent);
	var currentHPpx = parseInt(hpBoxCStyle.getPropertyValue('width'));
	
	var hpBoxMax = document.getElementById('hpBox');
	var hpBoxMStyle = window.getComputedStyle(hpBoxMax);
	var maxHPpx = parseInt(hpBoxMStyle.getPropertyValue('width'));

/* Changes HP by @value */
function changeHP(value) {
	
	hpBoxCStyle = window.getComputedStyle(hpBoxCurrent);
	currentHPpx = parseInt(hpBoxCStyle.getPropertyValue('width'));
	
	hpBoxMStyle = window.getComputedStyle(hpBoxMax);
	maxHPpx = parseInt(hpBoxMStyle.getPropertyValue('width'));
	
	var i = 0;
	var ticks = 200;
	value = parseInt(value);

	// Amount of pixels per tick
	var pxTick = Math.abs(value) / maxHP * maxHPpx / ticks;
	//var hpTick = value / ticks;

	var tempID = setInterval(frame, 1);
	
	function frame() {
		
		if(i < ticks) {

			if(currentHPpx > maxHPpx) {
				clearInterval(tempID);
				currentHP = maxHP;
				updateHPDisplay();
				return;
			}
			
			if(currentHP <= 0) {
				clearInterval(tempID);
				hpBoxCurrent.style.width = 0;
				gameOver();
				return;
			}

			if(value<0){
				currentHPpx -= pxTick;
			}else{
				currentHPpx += pxTick;
			}


			currentHP = currentHPpx / maxHPpx * maxHP;			
			updateHPDisplay();
			i++;
		} else {
			clearInterval(tempID);
		}
	}
}

/* Initiates the gameOver sequences */
function gameOver() {
	//TODO
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

/**
 * FUNCTIONS FOR LEVEL (Proof of concept)
 */
 
var currentLevel = 0;

function displayLevel (value) {
	
	var toChange = document.getElementById("currentLevel");
	toChange.innerHTML = parseInt(value);
	
	
	
	
	$('#levelDisplay').animate({opacity: "1", top:"50px"}, 1000);

	//$('#levelDisplay').animate({'borderWidth':'10px'}, 500);

	//$('#levelDisplay').children('#currentLevel').animate({'fontSize': 60}, 1000);

	//setTimeout(nay, 1000)
	function nay () {
    	$('#currentLevel').animate({'fontSize': 40}, 100);
		$('#currentLevel').animate({'fontSize': 35}, 100);
		$('#currentLevel').animate({'fontSize': 40}, 100);
		$('#currentLevel').animate({'fontSize': 35}, 100);
	}
/*
$('#levelDisplay').children('#currentLevel').animate({opacity: "0"}, 100);
$('#levelDisplay').children('#currentLevel').animate({opacity: "1"}, 100);
$('#levelDisplay').children('#currentLevel').animate({opacity: "0"}, 100);
$('#levelDisplay').children('#currentLevel').animate({opacity: "1"}, 100);
$('#levelDisplay').children('#currentLevel').animate({opacity: "0"}, 100);
*/	
	setTimeout(yay, 1500)
	function yay () {
    	$('#levelDisplay').animate({opacity: "0", top:"0px"}, 1000);
	}

	//$('#levelDisplay').children('#levelText').animate({width: "5px"}, 2000);
	//$('#levelDisplay').children('#currentLevel').animate({width: "5px"}, 1000);
	
	//$('#currentLevel').animate({display: "none"});
	
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

	if(parseInt(temp.innerHTML) >= maxSpeed * speedFactor * 10-10)
		//temp.innerHTML = maxSpeed * speedFactor * 10;
		temp.innerHTML = 42;

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